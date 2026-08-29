import { BookingRecord, LuxuryStayItem, ExperienceItem } from '../types';

const BOOKINGS_STORAGE_KEY = 'auric_bookings_records_v1';

export const generateBookingReferenceId = (type: 'stay' | 'experience'): string => {
  const prefix = type === 'stay' ? 'AUR-STAY' : 'AUR-EXP';
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${randomNum}`;
};

export const getStoredBookings = (): BookingRecord[] => {
  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch {
    return [];
  }
};

export const clearStoredBookings = (): void => {
  try {
    localStorage.removeItem(BOOKINGS_STORAGE_KEY);
  } catch {
    // ignore
  }
};

export const saveNewBooking = (booking: BookingRecord): BookingRecord[] => {
  try {
    const existing = getStoredBookings();
    const updated = [booking, ...existing.filter(b => b.id !== booking.id)];
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving booking:', e);
    return [booking];
  }
};

export const cancelBookingRecord = (bookingId: string): BookingRecord[] => {
  try {
    const existing = getStoredBookings();
    const updated = existing.map(b => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b));
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};

export const deleteBookingRecord = (bookingId: string): BookingRecord[] => {
  try {
    const existing = getStoredBookings();
    const updated = existing.filter(b => b.id !== bookingId);
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};
