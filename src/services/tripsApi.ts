import { getStoredAuthToken } from '../utils/authStore';

export interface ApiTripItem {
  id?: string;
  trip_id?: string;
  experience_id?: string | null;
  destination_id?: string | null;
  day_number: number;
  title: string;
  description?: string | null;
  start_time?: string | null;
  estimated_cost?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  created_at?: string;
}

export interface ApiTripRecord {
  id: string;
  user_id: string | null;
  destination_id: string | null;
  title: string;
  number_of_days: number;
  budget: string | null;
  travel_style: string | null;
  interests: string[];
  total_estimated_cost: string | null;
  created_at: string;
  updated_at: string;
  items: ApiTripItem[];
}

export interface CreateTripPayload {
  id?: string;
  destinationId?: string | null;
  title: string;
  numberOfDays?: number;
  budget?: string | null;
  travelStyle?: string | null;
  interests?: string[];
  totalEstimatedCost?: string | null;
  items?: Array<{
    id?: string;
    experienceId?: string | null;
    destinationId?: string | null;
    dayNumber: number;
    title: string;
    description?: string | null;
    startTime?: string | null;
    estimatedCost?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  }>;
}

export interface UpdateTripPayload {
  destinationId?: string | null;
  title?: string;
  numberOfDays?: number;
  budget?: string | null;
  travelStyle?: string | null;
  interests?: string[];
  totalEstimatedCost?: string | null;
  items?: Array<{
    id?: string;
    experienceId?: string | null;
    destinationId?: string | null;
    dayNumber: number;
    title: string;
    description?: string | null;
    startTime?: string | null;
    estimatedCost?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  }>;
}

/**
 * Helper to build auth headers
 */
function getAuthHeaders(): HeadersInit {
  const token = getStoredAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Fetch authenticated user's trips from backend
 */
export async function fetchUserTrips(params?: {
  destinationId?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ trips: ApiTripRecord[]; total: number; source: string }> {
  const query = new URLSearchParams();
  if (params?.destinationId) query.set('destinationId', params.destinationId);
  if (params?.search) query.set('search', params.search);
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.offset) query.set('offset', String(params.offset));

  const url = `/api/trips${query.toString() ? `?${query.toString()}` : ''}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Failed to fetch trips (${res.status})`);
  }

  return {
    trips: data.trips || [],
    total: data.total || 0,
    source: data.source || 'postgres',
  };
}

/**
 * Fetch single trip by ID (strictly protected by backend ownership)
 */
export async function fetchTripById(tripId: string): Promise<ApiTripRecord> {
  const res = await fetch(`/api/trips/${encodeURIComponent(tripId)}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Failed to fetch trip (${res.status})`);
  }

  return data.trip;
}

/**
 * Create a new trip (automatically owned by the authenticated user's JWT)
 */
export async function createTripOnServer(payload: CreateTripPayload): Promise<ApiTripRecord> {
  const res = await fetch('/api/trips', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Failed to create trip (${res.status})`);
  }

  return data.trip;
}

/**
 * Update an existing trip (protected by ownership check)
 */
export async function updateTripOnServer(tripId: string, payload: UpdateTripPayload): Promise<ApiTripRecord> {
  const res = await fetch(`/api/trips/${encodeURIComponent(tripId)}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Failed to update trip (${res.status})`);
  }

  return data.trip;
}

/**
 * Delete a trip (protected by ownership check)
 */
export async function deleteTripOnServer(tripId: string): Promise<boolean> {
  const res = await fetch(`/api/trips/${encodeURIComponent(tripId)}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Failed to delete trip (${res.status})`);
  }

  return true;
}
