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
} from './interfaces/todo.interface';

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

  async getProjects(): Promise<ProjectInterface[]> {
    try {
      const res = await firstValueFrom(this.http.get('/api/projects'));
      return res.data as ProjectInterface[];
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async createProject(body: CreateProjectInput): Promise<ProjectInterface> {
    try {
      const res = await firstValueFrom(this.http.post('/api/projects', body));
      return res.data as ProjectInterface;
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async verifyProject(
    projectId: string,
    body: VerifyPasswordInput,
  ): Promise<{ verified: boolean }> {
    try {
      const res = await firstValueFrom(
        this.http.post(`/api/projects/${projectId}/verify`, body),
      );
      return res.data as { verified: boolean };
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async getProjectMemos(projectId: string): Promise<MemoInterface[]> {
    try {
      const res = await firstValueFrom(
        this.http.get(`/api/projects/${projectId}/memos`),
      );
      return res.data as MemoInterface[];
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async createMemo(body: CreateMemoInput): Promise<MemoInterface> {
    try {
      const res = await firstValueFrom(this.http.post('/api/memos', body));
      return res.data as MemoInterface;
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async getMemo(memoId: string): Promise<MemoInterface> {
    try {
      const res = await firstValueFrom(this.http.get(`/api/memos/${memoId}`));
      return res.data as MemoInterface;
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async updateMemo(
    memoId: string,
    body: UpdateMemoInput,
  ): Promise<MemoInterface> {
    try {
      const res = await firstValueFrom(
        this.http.put(`/api/memos/${memoId}`, body),
      );
      return res.data as MemoInterface;
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async getMemoVersions(memoId: string): Promise<MemoVersionInterface[]> {
    try {
      const res = await firstValueFrom(
        this.http.get(`/api/memos/${memoId}/versions`),
      );
      return res.data as MemoVersionInterface[];
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async getMemoVersion(
    memoId: string,
    version: number,
  ): Promise<MemoVersionInterface> {
    try {
      const res = await firstValueFrom(
        this.http.get(`/api/memos/${memoId}/versions/${version}`),
      );
      return res.data as MemoVersionInterface;
    } catch (e) {
      this.handleAxiosError(e);
    }
  }
}
