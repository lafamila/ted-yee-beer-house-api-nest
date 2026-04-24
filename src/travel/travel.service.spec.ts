import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { CreateCourseInput } from './dtos/create-course.input';
import { CreatePlaceInput } from './dtos/create-place.input';
import { ExportCourseInput } from './dtos/export-course.input';
import { TravelService } from './travel.service';

describe('TravelService', () => {
  let service: TravelService;

  const httpService = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    axiosRef: {
      interceptors: {
        request: {
          use: jest.fn(),
        },
        response: {
          use: jest.fn(),
        },
      },
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: HttpService, useValue: httpService }, TravelService],
    }).compile();

    service = module.get<TravelService>(TravelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('proxies place listing to the travel upstream', async () => {
    const places = [
      {
        id: 'place-1',
        name: 'Nijo Market',
        latitude: 43.0621,
        longitude: 141.3544,
        createdAt: '2026-04-23T00:00:00.000Z',
        updatedAt: '2026-04-23T00:00:00.000Z',
      },
    ];
    httpService.get.mockReturnValue(of({ data: places }));

    await expect(service.getPlaces('Bearer travel')).resolves.toEqual(places);
    expect(httpService.get).toHaveBeenCalledWith('/api/places', {
      headers: { Authorization: 'Bearer travel' },
      params: {},
    });
  });

  it('proxies course creation to the travel upstream', async () => {
    const body: CreateCourseInput = {
      title: 'Hokkaido weekend course',
      stops: [{ placeId: 'place-1', placeName: 'Nijo Market', order: 1 }],
    };
    const course = {
      id: 'course-1',
      ...body,
      createdAt: '2026-04-23T00:00:00.000Z',
      updatedAt: '2026-04-23T00:00:00.000Z',
    };
    httpService.post.mockReturnValue(of({ data: course }));

    await expect(service.createCourse(body, 'Bearer travel')).resolves.toEqual(
      course,
    );
    expect(httpService.post).toHaveBeenCalledWith('/api/courses', body, {
      headers: { Authorization: 'Bearer travel' },
    });
  });

  it('proxies place creation without auth headers when none are provided', async () => {
    const body: CreatePlaceInput = {
      name: 'Otaru Canal',
      latitude: 43.1979,
      longitude: 140.9947,
    };
    const place = {
      id: 'place-2',
      ...body,
      createdAt: '2026-04-23T00:00:00.000Z',
      updatedAt: '2026-04-23T00:00:00.000Z',
    };
    httpService.post.mockReturnValue(of({ data: place }));

    await expect(service.createPlace(body)).resolves.toEqual(place);
    expect(httpService.post).toHaveBeenCalledWith('/api/places', body, undefined);
  });

  it('proxies course export to the travel upstream', async () => {
    const body: ExportCourseInput = {
      tripWindow: {
        startAt: '2026-05-01T09:00:00Z',
        endAt: '2026-05-01T22:00:00Z',
      },
      courseStart: {
        label: '삿포로역',
      },
      selectedPlaces: [],
    };
    const exportResponse = {
      outputFormatVersion: '1.0',
      payload: {},
      promptText: 'prompt',
    };
    httpService.post.mockReturnValue(of({ data: exportResponse }));

    await expect(service.exportCourse(body, 'Bearer travel')).resolves.toEqual(
      exportResponse,
    );
    expect(httpService.post).toHaveBeenCalledWith('/api/courses/export', body, {
      headers: { Authorization: 'Bearer travel' },
    });
  });
});
