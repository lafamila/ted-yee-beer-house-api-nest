import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

interface MemoLock {
  socketId: string;
  displayName: string;
  userId: string;
}

interface ScreenShareState {
  userId: string;
  displayName: string;
  socketId: string;
}

@WebSocketGateway({
  cors: { origin: true },
  path: '/api/socket.io/',
})
export class MemoGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(MemoGateway.name);

  // memoId → Set of socket IDs in the room
  private readonly rooms = new Map<string, Set<string>>();

  // memoId → lock holder info
  private readonly locks = new Map<string, MemoLock>();

  // socketId → user info (from JWT)
  private readonly users = new Map<
    string,
    { userId: string; displayName: string }
  >();

  // socketId → set of joined memoIds (for cleanup on disconnect)
  private readonly socketMemos = new Map<string, Set<string>>();

  private readonly screenShares = new Map<string, ScreenShareState>();

  private readonly socketProjects = new Map<string, Set<string>>();

  private jwtSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.jwtSecret =
      this.configService.get<string>('JWT_SECRET') ??
      this.configService.get<string>('SECRET_KEY') ??
      'your-secret-key-change-in-production';
  }

  handleConnection(client: Socket) {
    try {
      const token =
        (client.handshake.auth as { token?: string })?.token ??
        (client.handshake.headers.authorization?.split(' ')[1] as
          | string
          | undefined);

      if (!token) {
        this.logger.warn(`Client ${client.id} connected without token`);
        client.disconnect();
        return;
      }

      const payload = jwt.verify(token, this.jwtSecret) as {
        sub: string;
        display_name?: string;
        username?: string;
      };

      const userId = String(payload.sub);
      const displayName =
        payload.display_name ?? payload.username ?? `User ${userId}`;

      this.users.set(client.id, { userId, displayName });
      this.socketMemos.set(client.id, new Set());
      this.socketProjects.set(client.id, new Set());

      this.logger.log(`Client connected: ${client.id} (user: ${displayName})`);
    } catch (error) {
      this.logger.warn(
        `Client ${client.id} auth failed: ${(error as Error).message}`,
      );
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const joinedMemos = this.socketMemos.get(client.id);
    if (joinedMemos) {
      for (const memoId of joinedMemos) {
        this.leaveRoom(client, memoId);
      }
    }

    const stoppedProjects: string[] = [];
    for (const [projectId, share] of this.screenShares) {
      if (share.socketId !== client.id) continue;
      this.screenShares.delete(projectId);
      stoppedProjects.push(projectId);
    }

    for (const projectId of stoppedProjects) {
      this.server.to(`project:${projectId}`).emit('screenShareStopped', {
        projectId,
      });
    }

    this.users.delete(client.id);
    this.socketMemos.delete(client.id);
    this.socketProjects.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinProject')
  handleJoinProject(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { projectId: string },
  ) {
    const roomName = `project:${data.projectId}`;
    void client.join(roomName);
    this.socketProjects.get(client.id)?.add(data.projectId);

    const share = this.screenShares.get(data.projectId);
    client.emit('screenShareStatus', {
      projectId: data.projectId,
      isSharing: Boolean(share),
      sharer: share
        ? { userId: share.userId, displayName: share.displayName }
        : null,
    });
  }

  @SubscribeMessage('leaveProject')
  handleLeaveProject(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { projectId: string },
  ) {
    void client.leave(`project:${data.projectId}`);
    this.socketProjects.get(client.id)?.delete(data.projectId);

    const share = this.screenShares.get(data.projectId);
    if (share && share.socketId === client.id) {
      this.stopScreenShare(data.projectId);
    }
  }

  @SubscribeMessage('startScreenShare')
  handleStartScreenShare(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { projectId: string },
  ) {
    const userInfo = this.users.get(client.id);
    if (!userInfo) return;

    const existing = this.screenShares.get(data.projectId);
    if (existing && existing.socketId !== client.id) {
      client.emit('screenShareDenied', { projectId: data.projectId });
      return;
    }

    this.screenShares.set(data.projectId, {
      userId: userInfo.userId,
      displayName: userInfo.displayName,
      socketId: client.id,
    });

    this.server.to(`project:${data.projectId}`).emit('screenShareStarted', {
      projectId: data.projectId,
      sharer: {
        userId: userInfo.userId,
        displayName: userInfo.displayName,
      },
    });
  }

  @SubscribeMessage('stopScreenShare')
  handleStopScreenShare(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { projectId: string },
  ) {
    const share = this.screenShares.get(data.projectId);
    if (!share || share.socketId !== client.id) return;
    this.stopScreenShare(data.projectId);
  }

  @SubscribeMessage('joinMemo')
  handleJoinMemo(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { memoId: string },
  ) {
    const { memoId } = data;
    const roomName = `memo:${memoId}`;

    void client.join(roomName);

    if (!this.rooms.has(memoId)) {
      this.rooms.set(memoId, new Set());
    }
    this.rooms.get(memoId)!.add(client.id);

    this.socketMemos.get(client.id)?.add(memoId);

    // Send current lock status to the joining client
    const lock = this.locks.get(memoId);
    client.emit('lockStatus', {
      memoId,
      lockedBy: lock ? lock.displayName : null,
      lockedByUserId: lock ? lock.userId : null,
    });

    this.logger.log(`Client ${client.id} joined memo:${memoId}`);
  }

  @SubscribeMessage('leaveMemo')
  handleLeaveMemo(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { memoId: string },
  ) {
    this.leaveRoom(client, data.memoId);
  }

  @SubscribeMessage('lockMemo')
  handleLockMemo(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { memoId: string },
  ) {
    const { memoId } = data;
    const existingLock = this.locks.get(memoId);

    // If already locked by someone else, deny
    if (existingLock && existingLock.socketId !== client.id) {
      client.emit('lockDenied', {
        memoId,
        lockedBy: existingLock.displayName,
      });
      return;
    }

    const userInfo = this.users.get(client.id);
    if (!userInfo) return;

    this.locks.set(memoId, {
      socketId: client.id,
      displayName: userInfo.displayName,
      userId: userInfo.userId,
    });

    // Broadcast to all others in the room
    client.to(`memo:${memoId}`).emit('memoLocked', {
      memoId,
      displayName: userInfo.displayName,
      userId: userInfo.userId,
    });

    // Confirm to the requester
    client.emit('lockAcquired', { memoId });

    this.logger.log(
      `Memo ${memoId} locked by ${userInfo.displayName} (${client.id})`,
    );
  }

  @SubscribeMessage('unlockMemo')
  handleUnlockMemo(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { memoId: string },
  ) {
    const { memoId } = data;
    const lock = this.locks.get(memoId);

    // Only the lock holder can unlock
    if (!lock || lock.socketId !== client.id) return;

    this.locks.delete(memoId);

    // Broadcast to all in the room (including sender for confirmation)
    this.server.to(`memo:${memoId}`).emit('memoUnlocked', { memoId });

    this.logger.log(`Memo ${memoId} unlocked by ${client.id}`);
  }

  @SubscribeMessage('memoUpdated')
  handleMemoUpdated(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { memoId: string; content: string; title?: string },
  ) {
    const { memoId, content, title } = data;

    // Broadcast new content to all others in the room
    client.to(`memo:${memoId}`).emit('memoContentUpdated', {
      memoId,
      content,
      title,
    });

    this.logger.log(`Memo ${memoId} content broadcast by ${client.id}`);
  }

  private leaveRoom(client: Socket, memoId: string) {
    const roomName = `memo:${memoId}`;

    void client.leave(roomName);

    // Remove from room tracking
    const room = this.rooms.get(memoId);
    if (room) {
      room.delete(client.id);
      if (room.size === 0) {
        this.rooms.delete(memoId);
      }
    }

    this.socketMemos.get(client.id)?.delete(memoId);

    // Release lock if this client held it
    const lock = this.locks.get(memoId);
    if (lock && lock.socketId === client.id) {
      this.locks.delete(memoId);
      this.server.to(roomName).emit('memoUnlocked', { memoId });
      this.logger.log(
        `Memo ${memoId} auto-unlocked on leave/disconnect (${client.id})`,
      );
    }
  }

  private stopScreenShare(projectId: string) {
    this.screenShares.delete(projectId);
    this.server.to(`project:${projectId}`).emit('screenShareStopped', {
      projectId,
    });
  }
}
