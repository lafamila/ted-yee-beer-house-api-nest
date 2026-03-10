import { IsString } from 'class-validator';

export class LiveKitTokenInput {
  @IsString()
  roomName!: string;
}
