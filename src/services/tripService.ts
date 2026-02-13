import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { Trip, TripItem, TripStatus, TripItemType } from '../types';

// Mock Data for Demo
const MOCK_TRIPS: Trip[] = [
  {
    id: '1',
    user_id: 'mock-user-1',
    title: 'Summer in Tokyo',
    destination_city: 'Tokyo',
    destination_country: 'Japan',
    start_date: '2024-07-10',
    end_date: '2024-07-24',
    cover_image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26',
    status: TripStatus.PLANNING,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    user_id: 'mock-user-1',
    title: 'Business in NYC',
    destination_city: 'New York',
    destination_country: 'USA',
    start_date: '2023-11-05',
    end_date: '2023-11-10',
    cover_image: 'https://images.unsplash.com/photo-1496442226666-8d4a0e62e6e9',
    status: TripStatus.COMPLETED,
    created_at: new Date().toISOString()
  }
];

const MOCK_ITEMS: TripItem[] = [
  {
    id: '101',
    trip_id: '1',
    type: TripItemType.FLIGHT,
    title: 'Flight to Narita (JL 408)',
    start_time: '2024-07-10T13:00:00',
    end_time: '2024-07-11T16:00:00',
    location: 'FRA -> NRT',
    status: 'confirmed',
    metadata: { airline: 'JAL', flightNumber: 'JL408' }
  },
  {
    id: '102',
    trip_id: '1',
    type: TripItemType.HOTEL,
    title: 'Shinjuku Prince Hotel',
    start_time: '2024-07-11T17:00:00',
    end_time: '2024-07-15T11:00:00',
    location: 'Shinjuku, Tokyo',
    status: 'confirmed'
  },
  {
    id: '103',
    trip_id: '1',
    type: TripItemType.ACTIVITY,
    title: 'TeamLabs Borderless',
    start_time: '2024-07-12T10:00:00',
    end_time: '2024-07-12T13:00:00',
    location: 'Azabudai Hills',
    status: 'confirmed'
  }
];

export const getTrips = async (): Promise<Trip[]> => {
  if (!isSupabaseConfigured()) return Promise.resolve(MOCK_TRIPS);
  
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .order('start_date', { ascending: false });
    
  if (error) throw error;
  return data as Trip[];
};

export const getTripById = async (id: string): Promise<Trip | undefined> => {
  if (!isSupabaseConfigured()) return Promise.resolve(MOCK_TRIPS.find(t => t.id === id));
  
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) throw error;
  return data as Trip;
};

export const getTripItems = async (tripId: string): Promise<TripItem[]> => {
  if (!isSupabaseConfigured()) return Promise.resolve(MOCK_ITEMS.filter(i => i.trip_id === tripId));
  
  const { data, error } = await supabase
    .from('trip_items')
    .select('*')
    .eq('trip_id', tripId)
    .order('start_time', { ascending: true });
    
  if (error) throw error;
  return data as TripItem[];
};

export const createTrip = async (trip: Partial<Trip>): Promise<Trip> => {
  if (!isSupabaseConfigured()) {
    const newTrip = { ...trip, id: Math.random().toString(), user_id: 'mock', created_at: new Date().toISOString() } as Trip;
    MOCK_TRIPS.unshift(newTrip);
    return Promise.resolve(newTrip);
  }
  
  const { data, error } = await supabase
    .from('trips')
    .insert([trip])
    .select()
    .single();
    
  if (error) throw error;
  return data as Trip;
};
