import { getStoredAuthToken } from '../utils/authStore';

export interface ApiBookingRecord {
  id: string;
  user_id: string;
  destination_id: string;
  stay_id: string | null;
  room_type: string | null;
  experience_id: string | null;
  trip_id: string | null;
  booking_date: string;
  check_in_date: string | null;
  check_out_date: string | null;
  number_of_nights: number;
  booking_status: string;
  number_of_people: number;
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  special_requests: string | null;
  base_rate_per_unit: number | null;
  taxes_and_fees: number | null;
  total_amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBookingPayload {
  id?: string;
  destinationId?: string;
  destination_id?: string;
  stayId?: string | null;
  stay_id?: string | null;
  roomType?: string | null;
  room_type?: string | null;
  experienceId?: string | null;
  experience_id?: string | null;
  tripId?: string | null;
  trip_id?: string | null;
  bookingDate?: string;
  booking_date?: string;
  checkInDate?: string | null;
  check_in_date?: string | null;
  checkOutDate?: string | null;
  check_out_date?: string | null;
  startDate?: string;
  endDate?: string;
  numberOfNights?: number;
  number_of_nights?: number;
  numberOfPeople?: number;
  number_of_people?: number;
  numberOfGuests?: number;
  guestName?: string | null;
  guest_name?: string | null;
  guestEmail?: string | null;
  guest_email?: string | null;
  guestPhone?: string | null;
  guest_phone?: string | null;
  specialRequests?: string | null;
  special_requests?: string | null;
  baseRatePerUnit?: number | null;
  taxesAndFees?: number | null;
  totalAmount?: number;
  total_amount?: number;
  totalCost?: number;
  currency?: string;
  bookingStatus?: string;
  status?: string;
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
 * Fetch authenticated user's bookings from backend
 */
export async function fetchUserBookings(params?: {
  destinationId?: string;
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<{ bookings: ApiBookingRecord[]; total: number; source: string }> {
  const query = new URLSearchParams();
  if (params?.destinationId) query.set('destinationId', params.destinationId);
  if (params?.status) query.set('status', params.status);
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.offset) query.set('offset', String(params.offset));

  const url = `/api/bookings${query.toString() ? `?${query.toString()}` : ''}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Failed to fetch bookings (${res.status})`);
  }

  return {
    bookings: data.bookings || [],
    total: data.total || 0,
    source: data.source || 'postgres',
  };
}

/**
 * Fetch single booking by ID (strictly protected by backend ownership)
 */
export async function fetchBookingById(bookingId: string): Promise<ApiBookingRecord> {
  const res = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Failed to fetch booking (${res.status})`);
  }

  return data.booking;
}

/**
 * Create a new booking (automatically owned by the authenticated user's JWT)
 */
export async function createBookingOnServer(payload: CreateBookingPayload): Promise<ApiBookingRecord> {
  const res = await fetch('/api/bookings', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Failed to create booking (${res.status})`);
  }

  return data.booking;
}

/**
 * Cancel a booking (protected by ownership check)
 */
export async function cancelBookingOnServer(bookingId: string): Promise<ApiBookingRecord> {
  const res = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}/cancel`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Failed to cancel booking (${res.status})`);
  }

  return data.booking;
}
