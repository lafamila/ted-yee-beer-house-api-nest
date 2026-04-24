import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateTaskTypeInput {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  color?: string;
}

export class UpdateTaskTypeInput {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  displayOrder?: number;
}

export class CompleteTaskInput {
  @IsString()
  taskTypeId!: string;

  @IsString()
  completedDate!: string;
}
