/* eslint-disable @typescript-eslint/no-unsafe-return */
import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { CreateMemoInput } from './dtos/create-memo.input';
import {
  CreateProjectInput,
  VerifyPasswordInput,
} from './dtos/create-project.input';
import { UpdateMemoInput } from './dtos/update-memo.input';
import {
  MemoInterface,
  MemoVersionInterface,
  ProjectInterface,
  ArticleInterface,
  LoginResponseInterface,
  ProjectMemberInterface,
  UserInterface,
} from './interfaces/todo.interface';
import { PublishArticleInput } from './dtos/publish-article.input';
import { BulkDeleteMemosInput } from './dtos/delete-memos.input';
import { LoginInput } from './dtos/login.input';
import { InviteMemberInput } from './dtos/invite-member.input';
import { RegisterInput } from './dtos/register.input';
import { UpdateAdminInput } from './dtos/update-admin.input';
import { ChangePasswordInput } from './dtos/change-password.input';

@Injectable()
export class TodoService {
  constructor(private readonly http: HttpService) {
    http.axiosRef.interceptors.request.use((config) => {
      console.log(
        `[OUT] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
      );
      return config;
    });

    http.axiosRef.interceptors.response.use(
      (res) => {
        console.log(`[IN ] ${res.status} ${res.config.url}`);
        return res;
      },
      (err) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.error('[IN ] ERROR', err.response?.status);
        throw err;
      },
    );
  }

  private handleAxiosError(err: unknown): never {
    const e = err as AxiosError<any>;
    if (e?.response) {
      // FastAPI가 준 status/메시지를 그대로 전달
      throw new HttpException(
        e.response.data ?? 'Upstream error',
        e.response.status,
      );
    }
    throw new HttpException('Upstream connection failed', 502);
  }

  async getProjects(authHeader: string): Promise<ProjectInterface[]> {
    try {
      const headers = { Authorization: authHeader };
      const res = await firstValueFrom(
        this.http.get('/api/projects', { headers }),
      );
      return res.data as ProjectInterface[];
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async createProject(
    body: CreateProjectInput,
    authHeader: string,
  ): Promise<ProjectInterface> {
    try {
      const headers = { Authorization: authHeader };
      const res = await firstValueFrom(
        this.http.post('/api/projects', body, { headers }),
      );
      return res.data as ProjectInterface;
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async verifyProject(
    projectId: string,
    body: VerifyPasswordInput,
    authHeader: string,
  ): Promise<{ verified: boolean }> {
    try {
      const headers = { Authorization: authHeader };
      const res = await firstValueFrom(
        this.http.post(`/api/projects/${projectId}/verify`, body, { headers }),
      );
      return res.data as { verified: boolean };
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async getProjectMemos(
    projectId: string,
    authHeader: string,
  ): Promise<MemoInterface[]> {
    try {
      const headers = { Authorization: authHeader };
      const res = await firstValueFrom(
        this.http.get(`/api/projects/${projectId}/memos`, { headers }),
      );
      return res.data as MemoInterface[];
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async createMemo(
    body: CreateMemoInput,
    authHeader: string,
  ): Promise<MemoInterface> {
    try {
      const headers = { Authorization: authHeader };
      const res = await firstValueFrom(
        this.http.post('/api/memos', body, { headers }),
      );
      return res.data as MemoInterface;
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async getMemo(memoId: string, authHeader: string): Promise<MemoInterface> {
    try {
      const headers = { Authorization: authHeader };
      const res = await firstValueFrom(
        this.http.get(`/api/memos/${memoId}`, { headers }),
      );
      return res.data as MemoInterface;
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async updateMemo(
    memoId: string,
    body: UpdateMemoInput,
    authHeader: string,
  ): Promise<MemoInterface> {
    try {
      const headers = { Authorization: authHeader };
      const res = await firstValueFrom(
        this.http.put(`/api/memos/${memoId}`, body, { headers }),
      );
      return res.data as MemoInterface;
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async getMemoVersions(
    memoId: string,
    authHeader: string,
  ): Promise<MemoVersionInterface[]> {
    try {
      const headers = { Authorization: authHeader };
      const res = await firstValueFrom(
        this.http.get(`/api/memos/${memoId}/versions`, { headers }),
      );
      return res.data as MemoVersionInterface[];
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async getMemoVersion(
    memoId: string,
    version: number,
    authHeader: string,
  ): Promise<MemoVersionInterface> {
    try {
      const headers = { Authorization: authHeader };
      const res = await firstValueFrom(
        this.http.get(`/api/memos/${memoId}/versions/${version}`, { headers }),
      );
      return res.data as MemoVersionInterface;
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  // Article (게시글) 프록시 메서드
  async publishArticle(
    body: PublishArticleInput,
    authHeader: string,
  ): Promise<ArticleInterface> {
    try {
      const headers = { Authorization: authHeader };
      const res = await firstValueFrom(
        this.http.post('/api/articles', body, { headers }),
      );
      return res.data as ArticleInterface;
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async getArticles(projectId?: string): Promise<ArticleInterface[]> {
    try {
      const url = projectId
        ? `/api/articles?projectId=${projectId}`
        : '/api/articles';
      const res = await firstValueFrom(this.http.get(url));
      return res.data as ArticleInterface[];
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async getArticle(articleId: string): Promise<ArticleInterface> {
    try {
      const res = await firstValueFrom(
        this.http.get(`/api/articles/${articleId}`),
      );
      return res.data as ArticleInterface;
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async deleteArticle(
    articleId: string,
    authHeader: string,
  ): Promise<{ message: string }> {
    try {
      const headers = { Authorization: authHeader };
      const res = await firstValueFrom(
        this.http.delete(`/api/articles/${articleId}`, { headers }),
      );
      return res.data as { message: string };
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async deleteMemo(
    memoId: string,
    authHeader: string,
  ): Promise<{ message: string }> {
    try {
      const headers = { Authorization: authHeader };
      const res = await firstValueFrom(
        this.http.delete(`/api/memos/${memoId}`, { headers }),
      );
      return res.data as { message: string };
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async bulkDeleteMemos(
    body: BulkDeleteMemosInput,
    authHeader: string,
  ): Promise<{ message: string; deletedCount: number }> {
    try {
      const headers = { Authorization: authHeader };
      const res = await firstValueFrom(
        this.http.post('/api/memos/bulk-delete', body, { headers }),
      );
      return res.data as { message: string; deletedCount: number };
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async getMemoArticle(
    memoId: string,
    authHeader: string,
  ): Promise<ArticleInterface | null> {
    try {
      const headers = { Authorization: authHeader };
      const res = await firstValueFrom(
        this.http.get(`/api/memos/${memoId}/article`, { headers }),
      );
      return res.data as ArticleInterface | null;
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async login(body: LoginInput): Promise<LoginResponseInterface> {
    try {
      const res = await firstValueFrom(this.http.post('/api/auth/login', body));
      return res.data as LoginResponseInterface;
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async getMe(authHeader: string): Promise<UserInterface> {
    try {
      const headers = { Authorization: authHeader };
      const res = await firstValueFrom(
        this.http.get('/api/auth/me', { headers }),
      );
      return res.data as UserInterface;
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async searchUsers(q: string, authHeader: string): Promise<UserInterface[]> {
    try {
      const headers = { Authorization: authHeader };
      const res = await firstValueFrom(
        this.http.get(`/api/users/search?q=${encodeURIComponent(q)}`, {
          headers,
        }),
      );
      return res.data as UserInterface[];
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async inviteMember(
    projectId: string,
    body: InviteMemberInput,
    authHeader: string,
  ): Promise<ProjectMemberInterface> {
    try {
      const headers = { Authorization: authHeader };
      const res = await firstValueFrom(
        this.http.post(`/api/projects/${projectId}/members`, body, { headers }),
      );
      return res.data as ProjectMemberInterface;
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async removeMember(
    projectId: string,
    userId: string,
    authHeader: string,
  ): Promise<{ message: string }> {
    try {
      const headers = { Authorization: authHeader };
      const res = await firstValueFrom(
        this.http.delete(`/api/projects/${projectId}/members/${userId}`, {
          headers,
        }),
      );
      return res.data as { message: string };
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async getProjectMembers(
    projectId: string,
    authHeader: string,
  ): Promise<ProjectMemberInterface[]> {
    try {
      const headers = { Authorization: authHeader };
      const res = await firstValueFrom(
        this.http.get(`/api/projects/${projectId}/members`, { headers }),
      );
      return res.data as ProjectMemberInterface[];
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async register(body: RegisterInput): Promise<LoginResponseInterface> {
    try {
      const res = await firstValueFrom(
        this.http.post('/api/auth/register', body),
      );
      return res.data as LoginResponseInterface;
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async updateUserAdmin(
    userId: string,
    body: UpdateAdminInput,
    authHeader: string,
  ): Promise<UserInterface> {
    try {
      const headers = { Authorization: authHeader };
      const res = await firstValueFrom(
        this.http.patch(`/api/users/${userId}/admin`, body, { headers }),
      );
      return res.data as UserInterface;
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async resetUserPassword(
    userId: string,
    authHeader: string,
  ): Promise<{
    id: string;
    username: string;
    displayName: string;
    message: string;
  }> {
    try {
      const headers = { Authorization: authHeader };
      const res = await firstValueFrom(
        this.http.post(`/api/users/${userId}/reset-password`, {}, { headers }),
      );
      return res.data;
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async changePassword(
    body: ChangePasswordInput,
    authHeader: string,
  ): Promise<{ message: string }> {
    try {
      const headers = { Authorization: authHeader };
      const res = await firstValueFrom(
        this.http.post('/api/auth/change-password', body, { headers }),
      );
      return res.data;
    } catch (e) {
      this.handleAxiosError(e);
    }
  }
}
