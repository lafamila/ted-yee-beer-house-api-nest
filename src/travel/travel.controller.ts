import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CreateCourseInput } from './dtos/create-course.input';
import { CreatePlaceInput } from './dtos/create-place.input';
import { CreateReviewInput } from './dtos/create-review.input';
import { ExportCourseInput } from './dtos/export-course.input';
import { ImportCourseInput } from './dtos/import-course.input';
import { ResolveGoogleLinkInput } from './dtos/resolve-google-link.input';
import { TravelUploadFileInterface } from './interfaces/upload-file.interface';
import { UpdatePlaceInput } from './dtos/update-place.input';
import { TravelService } from './travel.service';

@Controller('/travel')
export class TravelController {
  constructor(private readonly travelService: TravelService) {}

  @Get('/places')
  getPlaces(
    @Headers('authorization') authHeader?: string,
    @Query('sw_lat') swLat?: string,
    @Query('sw_lng') swLng?: string,
    @Query('ne_lat') neLat?: string,
    @Query('ne_lng') neLng?: string,
  ) {
    return this.travelService.getPlaces(authHeader, { swLat, swLng, neLat, neLng });
  }

  @Post('/places')
  createPlace(
    @Body() body: CreatePlaceInput,
    @Headers('authorization') authHeader?: string,
  ) {
    return this.travelService.createPlace(body, authHeader);
  }

  @Post('/uploads')
  @UseInterceptors(AnyFilesInterceptor())
  uploadFiles(
    @UploadedFiles() files: TravelUploadFileInterface[],
    @Body('folder') folder: string,
    @Headers('authorization') authHeader?: string,
  ) {
    return this.travelService.uploadFiles(files, folder, authHeader);
  }

  @Post('/places/resolve-google-link')
  resolveGoogleLink(
    @Body() body: ResolveGoogleLinkInput,
    @Headers('authorization') authHeader?: string,
  ) {
    return this.travelService.resolveGoogleLink(body, authHeader);
  }

  @Get('/places/:placeId')
  getPlace(
    @Param('placeId') placeId: string,
    @Headers('authorization') authHeader?: string,
  ) {
    return this.travelService.getPlace(placeId, authHeader);
  }

  @Put('/places/:placeId')
  updatePlace(
    @Param('placeId') placeId: string,
    @Body() body: UpdatePlaceInput,
    @Headers('authorization') authHeader?: string,
  ) {
    return this.travelService.updatePlace(placeId, body, authHeader);
  }

  @Post('/places/:placeId/reviews')
  createReview(
    @Param('placeId') placeId: string,
    @Body() body: CreateReviewInput,
    @Headers('authorization') authHeader?: string,
  ) {
    return this.travelService.createReview(placeId, body, authHeader);
  }

  @Delete('/places/:placeId')
  deletePlace(
    @Param('placeId') placeId: string,
    @Headers('authorization') authHeader?: string,
  ) {
    return this.travelService.deletePlace(placeId, authHeader);
  }

  @Get('/courses')
  getCourses(@Headers('authorization') authHeader?: string) {
    return this.travelService.getCourses(authHeader);
  }

  @Post('/courses')
  createCourse(
    @Body() body: CreateCourseInput,
    @Headers('authorization') authHeader?: string,
  ) {
    return this.travelService.createCourse(body, authHeader);
  }

  @Post('/courses/export')
  exportCourse(
    @Body() body: ExportCourseInput,
    @Headers('authorization') authHeader?: string,
  ) {
    return this.travelService.exportCourse(body, authHeader);
  }

  @Post('/courses/import')
  importCourse(
    @Body() body: ImportCourseInput,
    @Headers('authorization') authHeader?: string,
  ) {
    return this.travelService.importCourse(body, authHeader);
  }

  @Get('/courses/:courseId')
  getCourse(
    @Param('courseId') courseId: string,
    @Headers('authorization') authHeader?: string,
  ) {
    return this.travelService.getCourse(courseId, authHeader);
  }

  @Delete('/courses/:courseId')
  deleteCourse(
    @Param('courseId') courseId: string,
    @Headers('authorization') authHeader?: string,
  ) {
    return this.travelService.deleteCourse(courseId, authHeader);
  }
}
