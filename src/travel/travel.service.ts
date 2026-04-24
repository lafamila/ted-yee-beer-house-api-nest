/* eslint-disable @typescript-eslint/no-unsafe-return */
import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';
import { CreateCourseInput } from './dtos/create-course.input';
import { CreatePlaceInput } from './dtos/create-place.input';
import { CreateReviewInput } from './dtos/create-review.input';
import { ExportCourseInput } from './dtos/export-course.input';
import { ImportCourseInput } from './dtos/import-course.input';
import { ResolveGoogleLinkInput } from './dtos/resolve-google-link.input';
import { UpdatePlaceInput } from './dtos/update-place.input';
import {
  GoogleMapsLinkResolutionInterface,
  TravelCourseExportInterface,
  TravelCourseInterface,
  TravelPlaceInterface,
  TravelReviewInterface,
} from './interfaces/travel.interface';
import { TravelUploadFileInterface } from './interfaces/upload-file.interface';
import { TravelUploadedFileInterface } from './interfaces/upload.interface';

@Injectable()
export class TravelService {
  constructor(private readonly http: HttpService) {
    http.axiosRef.interceptors.request.use((config) => {
      console.log(
        `[OUT] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
      );
      return config;
    });

    http.axiosRef.interceptors.response.use(
      (res) => {
        console.log(`[IN ] ${res.status} ${res.config.url}`);
        return res;
      },
      (err) => {
        console.error('[IN ] ERROR', err.response?.status);
        throw err;
      },
    );
  }

  private handleAxiosError(err: unknown): never {
    const error = err as AxiosError<any>;
    if (error?.response) {
      throw new HttpException(
        error.response.data ?? 'Upstream error',
        error.response.status,
      );
    }

    throw new HttpException('Upstream connection failed', 502);
  }

  private getRequestConfig(authHeader?: string): AxiosRequestConfig | undefined {
    if (!authHeader) {
      return undefined;
    }

    return {
      headers: {
        Authorization: authHeader,
      },
    };
  }

  async getPlaces(
    authHeader?: string,
    bbox?: { swLat?: string; swLng?: string; neLat?: string; neLng?: string },
  ): Promise<TravelPlaceInterface[]> {
    try {
      const params: Record<string, string> = {};
      if (bbox?.swLat && bbox?.swLng && bbox?.neLat && bbox?.neLng) {
        params.sw_lat = bbox.swLat;
        params.sw_lng = bbox.swLng;
        params.ne_lat = bbox.neLat;
        params.ne_lng = bbox.neLng;
      }
      const res = await firstValueFrom(
        this.http.get('/api/places', { ...this.getRequestConfig(authHeader), params }),
      );
      return res.data as TravelPlaceInterface[];
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async createPlace(
    body: CreatePlaceInput,
    authHeader?: string,
  ): Promise<TravelPlaceInterface> {
    try {
      const res = await firstValueFrom(
        this.http.post('/api/places', body, this.getRequestConfig(authHeader)),
      );
      return res.data as TravelPlaceInterface;
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async uploadFiles(
    files: TravelUploadFileInterface[],
    folder = 'travel',
    authHeader?: string,
  ): Promise<TravelUploadedFileInterface[]> {
    try {
      const formData = new FormData();
      for (const file of files) {
        formData.append(
          'files',
          new Blob([new Uint8Array(file.buffer)], {
            type: file.mimetype || 'application/octet-stream',
          }),
          file.originalname,
        );
      }
      formData.append('folder', folder);

      const headers = authHeader
        ? {
            Authorization: authHeader,
          }
        : undefined;

      const res = await firstValueFrom(
        this.http.post('/api/uploads', formData, {
          headers,
        }),
      );
      return res.data as TravelUploadedFileInterface[];
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async resolveGoogleLink(
    body: ResolveGoogleLinkInput,
    authHeader?: string,
  ): Promise<GoogleMapsLinkResolutionInterface> {
    try {
      const res = await firstValueFrom(
        this.http.post(
          '/api/places/resolve-google-link',
          body,
          this.getRequestConfig(authHeader),
        ),
      );
      return res.data as GoogleMapsLinkResolutionInterface;
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async getPlace(
    placeId: string,
    authHeader?: string,
  ): Promise<TravelPlaceInterface> {
    try {
      const res = await firstValueFrom(
        this.http.get(`/api/places/${placeId}`, this.getRequestConfig(authHeader)),
      );
      return res.data as TravelPlaceInterface;
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async updatePlace(
    placeId: string,
    body: UpdatePlaceInput,
    authHeader?: string,
  ): Promise<TravelPlaceInterface> {
    try {
      const res = await firstValueFrom(
        this.http.put(
          `/api/places/${placeId}`,
          body,
          this.getRequestConfig(authHeader),
        ),
      );
      return res.data as TravelPlaceInterface;
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async createReview(
    placeId: string,
    body: CreateReviewInput,
    authHeader?: string,
  ): Promise<TravelReviewInterface> {
    try {
      const res = await firstValueFrom(
        this.http.post(
          `/api/places/${placeId}/reviews`,
          body,
          this.getRequestConfig(authHeader),
        ),
      );
      return res.data as TravelReviewInterface;
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async deletePlace(
    placeId: string,
    authHeader?: string,
  ): Promise<{ message: string }> {
    try {
      const res = await firstValueFrom(
        this.http.delete(
          `/api/places/${placeId}`,
          this.getRequestConfig(authHeader),
        ),
      );
      return res.data as { message: string };
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async getCourses(authHeader?: string): Promise<TravelCourseInterface[]> {
    try {
      const res = await firstValueFrom(
        this.http.get('/api/courses', this.getRequestConfig(authHeader)),
      );
      return res.data as TravelCourseInterface[];
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async createCourse(
    body: CreateCourseInput,
    authHeader?: string,
  ): Promise<TravelCourseInterface> {
    try {
      const res = await firstValueFrom(
        this.http.post('/api/courses', body, this.getRequestConfig(authHeader)),
      );
      return res.data as TravelCourseInterface;
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async exportCourse(
    body: ExportCourseInput,
    authHeader?: string,
  ): Promise<TravelCourseExportInterface> {
    try {
      const res = await firstValueFrom(
        this.http.post(
          '/api/courses/export',
          body,
          this.getRequestConfig(authHeader),
        ),
      );
      return res.data as TravelCourseExportInterface;
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async importCourse(
    body: ImportCourseInput,
    authHeader?: string,
  ): Promise<TravelCourseInterface> {
    try {
      const res = await firstValueFrom(
        this.http.post(
          '/api/courses/import',
          body,
          this.getRequestConfig(authHeader),
        ),
      );
      return res.data as TravelCourseInterface;
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async getCourse(
    courseId: string,
    authHeader?: string,
  ): Promise<TravelCourseInterface> {
    try {
      const res = await firstValueFrom(
        this.http.get(
          `/api/courses/${courseId}`,
          this.getRequestConfig(authHeader),
        ),
      );
      return res.data as TravelCourseInterface;
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async deleteCourse(
    courseId: string,
    authHeader?: string,
  ): Promise<{ message: string }> {
    try {
      const res = await firstValueFrom(
        this.http.delete(
          `/api/courses/${courseId}`,
          this.getRequestConfig(authHeader),
        ),
      );
      return res.data as { message: string };
    } catch (e) {
      this.handleAxiosError(e);
    }
  }
}
