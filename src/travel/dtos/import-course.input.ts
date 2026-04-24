import { IsObject, IsOptional, IsString } from 'class-validator';

export class ImportCourseInput {
  @IsString()
  outputFormatVersion!: string;

  @IsObject()
  course!: {
    title: string;
    startLocation?: string;
    tripWindow?: {
      startAt?: string;
      endAt?: string;
    };
    transportMode?: string;
    summary?: string;
    promptText?: string;
    stops: Array<{
      placeId: string;
      placeName: string;
      scheduledAt?: string;
      note?: string;
      reasoningText?: string;
      transitHint?: string;
    }>;
  };

  @IsOptional()
  @IsObject()
  validation?: Record<string, unknown>;
}
