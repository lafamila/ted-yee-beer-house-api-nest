import { Test, TestingModule } from '@nestjs/testing';
import { CreateCourseInput } from './dtos/create-course.input';
import { CreatePlaceInput } from './dtos/create-place.input';
import { CreateReviewInput } from './dtos/create-review.input';
import { ExportCourseInput } from './dtos/export-course.input';
import { ImportCourseInput } from './dtos/import-course.input';
import { TravelController } from './travel.controller';
import { TravelUploadFileInterface } from './interfaces/upload-file.interface';
import { TravelService } from './travel.service';

describe('TravelController', () => {
  let controller: TravelController;

  const travelService = {
    getPlaces: jest.fn(),
    createPlace: jest.fn(),
    uploadFiles: jest.fn(),
    resolveGoogleLink: jest.fn(),
    getPlace: jest.fn(),
    updatePlace: jest.fn(),
    deletePlace: jest.fn(),
    getCourses: jest.fn(),
    createCourse: jest.fn(),
    exportCourse: jest.fn(),
    importCourse: jest.fn(),
    getCourse: jest.fn(),
    deleteCourse: jest.fn(),
    createReview: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TravelController],
      providers: [{ provide: TravelService, useValue: travelService }],
    }).compile();

    controller = module.get<TravelController>(TravelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates place creation to the service', () => {
    const body: CreatePlaceInput = {
      name: 'Sapporo Beer Museum',
      latitude: 43.0717,
      longitude: 141.3724,
    };
    controller.createPlace(body, 'Bearer test');

    expect(travelService.createPlace).toHaveBeenCalledWith(body, 'Bearer test');
  });

  it('delegates Google Maps link resolution to the service', () => {
    const body = {
      url: 'https://maps.app.goo.gl/example',
    };

    controller.resolveGoogleLink(body, 'Bearer test');

    expect(travelService.resolveGoogleLink).toHaveBeenCalledWith(
      body,
      'Bearer test',
    );
  });

  it('delegates file upload to the service', () => {
    const files = [
      {
        originalname: 'sample.jpg',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('sample'),
      },
    ] as TravelUploadFileInterface[];

    controller.uploadFiles(files, 'places', 'Bearer test');

    expect(travelService.uploadFiles).toHaveBeenCalledWith(
      files,
      'places',
      'Bearer test',
    );
  });

  it('delegates course creation to the service', () => {
    const body: CreateCourseInput = {
      title: 'Sapporo evening route',
      stops: [{ placeId: 'place-1', placeName: 'Sapporo TV Tower', order: 1 }],
    };
    controller.createCourse(body, 'Bearer test');

    expect(travelService.createCourse).toHaveBeenCalledWith(
      body,
      'Bearer test',
    );
  });

  it('delegates review creation to the service', () => {
    const body: CreateReviewInput = {
      rating: 5,
      body: '좋았음',
    };

    controller.createReview('place-1', body, 'Bearer test');

    expect(travelService.createReview).toHaveBeenCalledWith(
      'place-1',
      body,
      'Bearer test',
    );
  });

  it('delegates export/import flows to the service', () => {
    const exportBody: ExportCourseInput = {
      tripWindow: {
        startAt: '2026-05-01T09:00:00Z',
        endAt: '2026-05-01T22:00:00Z',
      },
      courseStart: {
        label: '삿포로역',
      },
      selectedPlaces: [],
    };
    const importBody: ImportCourseInput = {
      outputFormatVersion: '1.0',
      course: {
        title: '테스트',
        stops: [{ placeId: 'place-1', placeName: 'A' }],
      },
      validation: {
        warnings: [],
      },
    };

    controller.exportCourse(exportBody, 'Bearer test');
    controller.importCourse(importBody, 'Bearer test');

    expect(travelService.exportCourse).toHaveBeenCalledWith(
      exportBody,
      'Bearer test',
    );
    expect(travelService.importCourse).toHaveBeenCalledWith(
      importBody,
      'Bearer test',
    );
  });
});
