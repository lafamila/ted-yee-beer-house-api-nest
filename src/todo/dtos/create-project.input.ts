import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateProjectInput {
  @IsString()
  name!: string;

  @IsString()
  icon!: string;

  @IsBoolean()
  isSecret!: boolean;

  @IsOptional()
  @IsString()
  password?: string;
}

export class VerifyPasswordInput {
  @IsString()
  password!: string;
}
