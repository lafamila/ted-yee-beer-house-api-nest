import { IsString, MinLength } from 'class-validator';

export class ChangePasswordInput {
  @IsString()
  oldPassword!: string;

  @IsString()
  @MinLength(1)
  newPassword!: string;
}
