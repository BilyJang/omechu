export interface MenuRecommendationRequest {
  mood: string;
}

export interface MenuRecommendationResponse {
  recommendation: string;
}

export interface ApiErrorResponse {
  message: string;
  error?: any;
}

export interface Restaurant {
  name: string;
  distance: number;
  rating: number;
  address?: string;
  category?: string;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface RestaurantsRequest {
  lat: string;
  lng: string;
}

export type RestaurantsResponse = Restaurant[];
