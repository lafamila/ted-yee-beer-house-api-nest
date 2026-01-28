import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { TodoService } from './todo.service';
import {
  CreateProjectInput,
  VerifyPasswordInput,
} from './dtos/create-project.input';
import { CreateMemoInput } from './dtos/create-memo.input';
import { UpdateMemoInput } from './dtos/update-memo.input';

@Controller('/todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get('/projects')
  getProjects() {
    return this.todoService.getProjects();
  }

  @Post('/projects')
  createProject(@Body() body: CreateProjectInput) {
    return this.todoService.createProject(body);
  }

  @Post('/projects/:projectId/verify')
  verifyProject(
    @Param('projectId') projectId: string,
    @Body() body: VerifyPasswordInput,
  ) {
    return this.todoService.verifyProject(projectId, body);
  }

  @Get('/projects/:projectId/memos')
  getProjectMemos(@Param('projectId') projectId: string) {
    return this.todoService.getProjectMemos(projectId);
  }

  @Post('/memos')
  createMemo(@Body() body: CreateMemoInput) {
    return this.todoService.createMemo(body);
  }

  @Get('/memos/:memoId')
  getMemo(@Param('memoId') memoId: string) {
    return this.todoService.getMemo(memoId);
  }

  @Put('/memos/:memoId')
  updateMemo(@Param('memoId') memoId: string, @Body() body: UpdateMemoInput) {
    return this.todoService.updateMemo(memoId, body);
  }

  @Get('/memos/:memoId/versions')
  getMemoVersions(@Param('memoId') memoId: string) {
    return this.todoService.getMemoVersions(memoId);
  }

  @Get('/memos/:memoId/versions/:version')
  getMemoVersion(
    @Param('memoId') memoId: string,
    @Param('version') version: string,
  ) {
    return this.todoService.getMemoVersion(memoId, Number(version));
  }
}
