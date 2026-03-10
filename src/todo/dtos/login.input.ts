import { IsString } from 'class-validator';

export class LoginInput {
  @IsString()
  username!: string;

  @IsString()
  password!: string;
}
