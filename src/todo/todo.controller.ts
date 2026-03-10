import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Body,
  Query,
  Headers,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import {
  CreateProjectInput,
  VerifyPasswordInput,
} from './dtos/create-project.input';
import { CreateMemoInput } from './dtos/create-memo.input';
import { UpdateMemoInput } from './dtos/update-memo.input';
import { PublishArticleInput } from './dtos/publish-article.input';
import { BulkDeleteMemosInput } from './dtos/delete-memos.input';
import { LoginInput } from './dtos/login.input';
import { InviteMemberInput } from './dtos/invite-member.input';
import { RegisterInput } from './dtos/register.input';
import { UpdateAdminInput } from './dtos/update-admin.input';
import { ChangePasswordInput } from './dtos/change-password.input';

@Controller('/todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get('/projects')
  getProjects(@Headers('authorization') authHeader: string) {
    return this.todoService.getProjects(authHeader);
  }

  @Post('/projects')
  createProject(
    @Body() body: CreateProjectInput,
    @Headers('authorization') authHeader: string,
  ) {
    return this.todoService.createProject(body, authHeader);
  }

  @Post('/projects/:projectId/verify')
  verifyProject(
    @Param('projectId') projectId: string,
    @Body() body: VerifyPasswordInput,
    @Headers('authorization') authHeader: string,
  ) {
    return this.todoService.verifyProject(projectId, body, authHeader);
  }

  @Get('/projects/:projectId/memos')
  getProjectMemos(
    @Param('projectId') projectId: string,
    @Headers('authorization') authHeader: string,
  ) {
    return this.todoService.getProjectMemos(projectId, authHeader);
  }

  @Post('/memos')
  createMemo(
    @Body() body: CreateMemoInput,
    @Headers('authorization') authHeader: string,
  ) {
    return this.todoService.createMemo(body, authHeader);
  }

  @Post('/memos/bulk-delete')
  bulkDeleteMemos(
    @Body() body: BulkDeleteMemosInput,
    @Headers('authorization') authHeader: string,
  ) {
    return this.todoService.bulkDeleteMemos(body, authHeader);
  }

  @Delete('/memos/:memoId')
  deleteMemo(
    @Param('memoId') memoId: string,
    @Headers('authorization') authHeader: string,
  ) {
    return this.todoService.deleteMemo(memoId, authHeader);
  }

  @Get('/memos/:memoId')
  getMemo(
    @Param('memoId') memoId: string,
    @Headers('authorization') authHeader: string,
  ) {
    return this.todoService.getMemo(memoId, authHeader);
  }

  @Put('/memos/:memoId')
  updateMemo(
    @Param('memoId') memoId: string,
    @Body() body: UpdateMemoInput,
    @Headers('authorization') authHeader: string,
  ) {
    return this.todoService.updateMemo(memoId, body, authHeader);
  }

  @Get('/memos/:memoId/versions')
  getMemoVersions(
    @Param('memoId') memoId: string,
    @Headers('authorization') authHeader: string,
  ) {
    return this.todoService.getMemoVersions(memoId, authHeader);
  }

  @Get('/memos/:memoId/versions/:version')
  getMemoVersion(
    @Param('memoId') memoId: string,
    @Param('version') version: string,
    @Headers('authorization') authHeader: string,
  ) {
    return this.todoService.getMemoVersion(memoId, Number(version), authHeader);
  }

  // Article (게시글) 라우트
  @Post('/articles')
  publishArticle(
    @Body() body: PublishArticleInput,
    @Headers('authorization') authHeader: string,
  ) {
    return this.todoService.publishArticle(body, authHeader);
  }

  @Get('/articles')
  getArticles(@Query('projectId') projectId?: string) {
    return this.todoService.getArticles(projectId);
  }

  @Get('/articles/:articleId')
  getArticle(@Param('articleId') articleId: string) {
    return this.todoService.getArticle(articleId);
  }

  @Delete('/articles/:articleId')
  deleteArticle(
    @Param('articleId') articleId: string,
    @Headers('authorization') authHeader: string,
  ) {
    return this.todoService.deleteArticle(articleId, authHeader);
  }

  @Get('/memos/:memoId/article')
  getMemoArticle(
    @Param('memoId') memoId: string,
    @Headers('authorization') authHeader: string,
  ) {
    return this.todoService.getMemoArticle(memoId, authHeader);
  }

  @Post('/auth/login')
  login(@Body() body: LoginInput) {
    return this.todoService.login(body);
  }

  @Get('/auth/me')
  getMe(@Headers('authorization') authHeader: string) {
    return this.todoService.getMe(authHeader);
  }

  @Get('/users/search')
  searchUsers(
    @Query('q') q: string,
    @Headers('authorization') authHeader: string,
  ) {
    return this.todoService.searchUsers(q, authHeader);
  }

  @Post('/projects/:projectId/members')
  inviteMember(
    @Param('projectId') projectId: string,
    @Body() body: InviteMemberInput,
    @Headers('authorization') authHeader: string,
  ) {
    return this.todoService.inviteMember(projectId, body, authHeader);
  }

  @Delete('/projects/:projectId/members/:userId')
  removeMember(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
    @Headers('authorization') authHeader: string,
  ) {
    return this.todoService.removeMember(projectId, userId, authHeader);
  }

  @Get('/projects/:projectId/members')
  getProjectMembers(
    @Param('projectId') projectId: string,
    @Headers('authorization') authHeader: string,
  ) {
    return this.todoService.getProjectMembers(projectId, authHeader);
  }

  @Post('/auth/register')
  register(@Body() body: RegisterInput) {
    return this.todoService.register(body);
  }

  @Patch('/users/:userId/admin')
  updateUserAdmin(
    @Param('userId') userId: string,
    @Body() body: UpdateAdminInput,
    @Headers('authorization') authHeader: string,
  ) {
    return this.todoService.updateUserAdmin(userId, body, authHeader);
  }

  @Post('/users/:userId/reset-password')
  resetUserPassword(
    @Param('userId') userId: string,
    @Headers('authorization') authHeader: string,
  ) {
    return this.todoService.resetUserPassword(userId, authHeader);
  }

  @Post('/auth/change-password')
  changePassword(
    @Body() body: ChangePasswordInput,
    @Headers('authorization') authHeader: string,
  ) {
    return this.todoService.changePassword(body, authHeader);
  }
}
