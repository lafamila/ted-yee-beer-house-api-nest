import {
  IsArray,
  IsDateString,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class TripWindowInput {
  @IsDateString()
  startAt!: string;

  @IsDateString()
  endAt!: string;
}

class CourseStartInput {
  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;
}

class SelectedPlaceInput {
  @IsString()
  placeId!: string;

  @IsString()
  name!: string;

  @Type(() => Number)
  @IsNumber()
  latitude!: number;

  @Type(() => Number)
  @IsNumber()
  longitude!: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  openingHours?: string;

  @IsOptional()
  @IsString()
  specialNotes?: string;

  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  reviewSummary?: string[];
}

export class ExportCourseInput {
  @ValidateNested()
  @Type(() => TripWindowInput)
  tripWindow!: TripWindowInput;

  @ValidateNested()
  @Type(() => CourseStartInput)
  courseStart!: CourseStartInput;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectedPlaceInput)
  selectedPlaces!: SelectedPlaceInput[];

  @IsOptional()
  @IsObject()
  selectionContext?: Record<string, unknown>;
}
