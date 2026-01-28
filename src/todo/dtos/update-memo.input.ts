import { IsString } from 'class-validator';
export class UpdateMemoInput {
  @IsString()
  content!: string;
}
