import {
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCourseStopInput {
  @IsString()
  placeId!: string;

  @IsString()
  placeName!: string;

  @Type(() => Number)
  order!: number;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  reasoningText?: string;

  @IsOptional()
  @IsString()
  transitHint?: string;
}

export class CreateCourseInput {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  startLocation?: string;

  @IsOptional()
  @IsDateString()
  tripStartAt?: string;

  @IsOptional()
  @IsDateString()
  tripEndAt?: string;

  @IsOptional()
  @IsString()
  transportMode?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  promptText?: string;

  @IsOptional()
  @IsString()
  outputFormatVersion?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCourseStopInput)
  stops!: CreateCourseStopInput[];
}
