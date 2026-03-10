import { IsString } from 'class-validator';

export class PublishArticleInput {
  @IsString()
  memoId!: string;
}
