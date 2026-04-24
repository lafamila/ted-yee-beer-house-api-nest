export interface TravelPlaceInterface {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  address?: string;
  description?: string;
  openingHours?: string | null;
  specialNotes?: string;
  coverImageUrl?: string;
  photoUrls?: string[];
  tags?: string[];
  reviews?: TravelReviewInterface[];
  createdAt: string;
  updatedAt: string;
}

export interface TravelReviewInterface {
  id: string;
  placeId: string;
  rating: number;
  headline?: string | null;
  body: string;
  visitedAt?: string | null;
  photoUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GoogleMapsLinkResolutionInterface {
  resolvedUrl: string;
  googlePlaceId?: string | null;
  googleMapsUri?: string | null;
  name: string;
  address?: string | null;
  latitude: number;
  longitude: number;
  openingHours?: string | null;
  primaryType?: string | null;
}

export interface TravelCourseStopInterface {
  placeId: string;
  placeName: string;
  order: number;
  scheduledAt?: string;
  note?: string;
  reasoningText?: string | null;
  transitHint?: string | null;
}

export interface TravelCourseInterface {
  id: string;
  title: string;
  startLocation?: string;
  tripStartAt?: string;
  tripEndAt?: string;
  transportMode?: string | null;
  summary?: string | null;
  promptText?: string | null;
  outputFormatVersion: string;
  stops: TravelCourseStopInterface[];
  createdAt: string;
  updatedAt: string;
}

export interface TravelCourseExportInterface {
  outputFormatVersion: string;
  payload: Record<string, unknown>;
  promptText: string;
}
