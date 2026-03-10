import { IsOptional, IsString } from 'class-validator';

export class InviteMemberInput {
  @IsString()
  userId!: string;

  @IsOptional()
  @IsString()
  role?: string;
}
