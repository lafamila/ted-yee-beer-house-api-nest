import { IsArray, IsString } from 'class-validator';

export class BulkDeleteMemosInput {
  @IsArray()
  @IsString({ each: true })
  memoIds!: string[];
}
