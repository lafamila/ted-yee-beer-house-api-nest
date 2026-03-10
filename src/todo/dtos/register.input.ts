import { IsString } from 'class-validator';

export class RegisterInput {
  @IsString()
  username!: string;

  @IsString()
  password!: string;

  @IsString()
  displayName!: string;
}
