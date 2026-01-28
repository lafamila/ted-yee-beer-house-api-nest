import { IsString } from 'class-validator';
export class CreateMemoInput {
  @IsString()
  projectId!: string;

  @IsString()
  title!: string;
}
