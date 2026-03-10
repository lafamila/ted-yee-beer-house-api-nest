import { IsBoolean } from 'class-validator';

export class UpdateAdminInput {
  @IsBoolean()
  isAdmin!: boolean;
}
