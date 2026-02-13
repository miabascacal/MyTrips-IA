export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}

export enum TripStatus {
  PLANNING = 'planning',
  BOOKED = 'booked',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface Trip {
  id: string;
  user_id: string;
  title: string;
  destination_city: string;
  destination_country: string;
  start_date: string;
  end_date: string;
  cover_image?: string;
  status: TripStatus;
  created_at: string;
}

export enum TripItemType {
  FLIGHT = 'flight',
  HOTEL = 'hotel',
  ACTIVITY = 'activity',
  TRANSPORT = 'transport',
  NOTE = 'note',
  MEAL = 'meal'
}

export interface TripItem {
  id: string;
  trip_id: string;
  type: TripItemType;
  title: string;
  description?: string;
  start_time: string;
  end_time?: string;
  location?: string;
  metadata?: Record<string, any>; // For flight numbers, booking refs
  cost?: number;
  currency?: string;
  status?: 'confirmed' | 'pending' | 'cancelled';
}

export interface Document {
  id: string;
  trip_id: string;
  file_path: string;
  file_name: string;
  mime_type: string;
  status: 'uploading' | 'processing' | 'processed' | 'error';
  created_at: string;
}

export interface FlightStats {
  totalKm: number;
  countriesVisited: number;
  citiesVisited: number;
  hoursInTransport: number;
  flightsPerYear: Record<number, number>;
}
