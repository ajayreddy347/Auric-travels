import { getPool, isDbConfigured } from './config/db';

export interface BookingRecord {
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

export interface CreateBookingDTO {
  id?: string;
  userId: string;
  destinationId: string;
  stayId?: string | null;
  roomType?: string | null;
  experienceId?: string | null;
  tripId?: string | null;
  bookingDate: string;
  checkInDate?: string | null;
  checkOutDate?: string | null;
  numberOfNights?: number;
  bookingStatus?: string;
  numberOfPeople: number;
  guestName?: string | null;
  guestEmail?: string | null;
  guestPhone?: string | null;
  specialRequests?: string | null;
  baseRatePerUnit?: number | null;
  taxesAndFees?: number | null;
  totalAmount: number;
  currency?: string;
}

export interface BookingFilters {
  userId?: string;
  destinationId?: string;
  stayId?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

// In-memory fallback map for high resilience
const inMemoryBookings: Map<string, BookingRecord> = new Map();

function generateBookingId(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `book-${Date.now().toString(36)}-${randomNum}`;
}

function formatDateString(val: any): string | null {
  if (!val) return null;
  if (typeof val === 'string') {
    return val.split('T')[0];
  }
  if (val instanceof Date) {
    const year = val.getFullYear();
    const month = String(val.getMonth() + 1).padStart(2, '0');
    const day = String(val.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return String(val).split('T')[0];
}

function mapRowToBooking(row: any): BookingRecord {
  return {
    id: row.id,
    user_id: row.user_id,
    destination_id: row.destination_id,
    stay_id: row.stay_id || null,
    room_type: row.room_type || null,
    experience_id: row.experience_id || null,
    trip_id: row.trip_id || null,
    booking_date: formatDateString(row.booking_date) || new Date().toISOString().split('T')[0],
    check_in_date: formatDateString(row.check_in_date),
    check_out_date: formatDateString(row.check_out_date),
    number_of_nights: row.number_of_nights ? Number(row.number_of_nights) : 1,
    booking_status: row.booking_status || 'confirmed',
    number_of_people: Number(row.number_of_people) || 1,
    guest_name: row.guest_name || null,
    guest_email: row.guest_email || null,
    guest_phone: row.guest_phone || null,
    special_requests: row.special_requests || null,
    base_rate_per_unit: row.base_rate_per_unit !== null && row.base_rate_per_unit !== undefined ? Number(row.base_rate_per_unit) : null,
    taxes_and_fees: row.taxes_and_fees !== null && row.taxes_and_fees !== undefined ? Number(row.taxes_and_fees) : null,
    total_amount: Number(row.total_amount),
    currency: row.currency || 'INR',
    created_at: row.created_at ? (row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at)) : new Date().toISOString(),
    updated_at: row.updated_at ? (row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at)) : new Date().toISOString(),
  };
}

export class BookingsRepository {
  public static getAll = (filters: BookingFilters = {}) => BookingsRepository.find(filters);
  public static findById = (id: string) => BookingsRepository.getById(id);
  public static cancel = (id: string) => BookingsRepository.updateStatus(id, 'cancelled');

  /**
   * Find bookings with optional filtering by user, destination, and status
   */
  public static async find(filters: BookingFilters = {}): Promise<{
    bookings: BookingRecord[];
    total: number;
    source: 'postgres' | 'in-memory';
  }> {
    if (isDbConfigured()) {
      try {
        const pool = getPool();
        const conditions: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (filters.userId) {
          conditions.push(`user_id = $${paramIndex}`);
          values.push(filters.userId);
          paramIndex++;
        }

        if (filters.destinationId) {
          conditions.push(`LOWER(destination_id) = $${paramIndex}`);
          values.push(filters.destinationId.toLowerCase());
          paramIndex++;
        }

        if (filters.stayId) {
          conditions.push(`LOWER(stay_id) = $${paramIndex}`);
          values.push(filters.stayId.toLowerCase());
          paramIndex++;
        }

        if (filters.status) {
          conditions.push(`LOWER(booking_status) = $${paramIndex}`);
          values.push(filters.status.toLowerCase());
          paramIndex++;
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        const countRes = await pool.query(`SELECT COUNT(*) as count FROM bookings ${whereClause};`, values);
        const total = parseInt(countRes.rows[0]?.count || '0', 10);

        let sql = `SELECT * FROM bookings ${whereClause} ORDER BY created_at DESC`;
        if (filters.limit) sql += ` LIMIT ${filters.limit}`;
        if (filters.offset) sql += ` OFFSET ${filters.offset}`;

        const bookingsRes = await pool.query(sql, values);
        const bookings: BookingRecord[] = (bookingsRes.rows || []).map(mapRowToBooking);

        return {
          bookings,
          total,
          source: 'postgres',
        };
      } catch (dbErr: any) {
        console.warn('[BookingsRepository] Postgres find query fallback:', dbErr.message);
      }
    }

    // In-memory fallback
    let all = Array.from(inMemoryBookings.values());

    if (filters.userId) {
      all = all.filter(b => b.user_id === filters.userId);
    }
    if (filters.destinationId) {
      all = all.filter(b => b.destination_id.toLowerCase() === filters.destinationId!.toLowerCase());
    }
    if (filters.stayId) {
      all = all.filter(b => b.stay_id && b.stay_id.toLowerCase() === filters.stayId!.toLowerCase());
    }
    if (filters.status) {
      all = all.filter(b => b.booking_status.toLowerCase() === filters.status!.toLowerCase());
    }

    all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const total = all.length;
    const offset = filters.offset || 0;
    const limit = filters.limit || total;
    const paginated = all.slice(offset, offset + limit);

    return {
      bookings: paginated,
      total,
      source: 'in-memory',
    };
  }

  /**
   * Get single booking by ID
   */
  public static async getById(id: string): Promise<BookingRecord | null> {
    if (!id) return null;
    const cleanId = id.trim();

    if (isDbConfigured()) {
      try {
        const pool = getPool();
        const res = await pool.query('SELECT * FROM bookings WHERE id = $1 LIMIT 1;', [cleanId]);
        if (res.rows && res.rows.length > 0) {
          return mapRowToBooking(res.rows[0]);
        }
      } catch (dbErr: any) {
        console.warn('[BookingsRepository] Postgres getById fallback:', dbErr.message);
      }
    }

    return inMemoryBookings.get(cleanId) || null;
  }

  /**
   * Create a new booking
   */
  public static async create(dto: CreateBookingDTO): Promise<BookingRecord> {
    const id = dto.id || generateBookingId();
    const now = new Date().toISOString();
    const status = dto.bookingStatus || 'confirmed';
    const currency = dto.currency || 'INR';

    const checkIn = dto.checkInDate || dto.bookingDate;
    const checkOut = dto.checkOutDate || null;
    const nights = dto.numberOfNights || 1;

    const record: BookingRecord = {
      id,
      user_id: dto.userId,
      destination_id: dto.destinationId,
      stay_id: dto.stayId || null,
      room_type: dto.roomType || null,
      experience_id: dto.experienceId || null,
      trip_id: dto.tripId || null,
      booking_date: dto.bookingDate,
      check_in_date: checkIn,
      check_out_date: checkOut,
      number_of_nights: nights,
      booking_status: status,
      number_of_people: dto.numberOfPeople,
      guest_name: dto.guestName || null,
      guest_email: dto.guestEmail || null,
      guest_phone: dto.guestPhone || null,
      special_requests: dto.specialRequests || null,
      base_rate_per_unit: dto.baseRatePerUnit !== undefined && dto.baseRatePerUnit !== null ? Number(dto.baseRatePerUnit) : null,
      taxes_and_fees: dto.taxesAndFees !== undefined && dto.taxesAndFees !== null ? Number(dto.taxesAndFees) : null,
      total_amount: Number(dto.totalAmount),
      currency,
      created_at: now,
      updated_at: now,
    };

    inMemoryBookings.set(id, record);

    if (isDbConfigured()) {
      try {
        const pool = getPool();
        const sql = `
          INSERT INTO bookings (
            id, user_id, destination_id, stay_id, room_type, experience_id, trip_id,
            booking_date, check_in_date, check_out_date, number_of_nights, booking_status,
            number_of_people, guest_name, guest_email, guest_phone, special_requests,
            base_rate_per_unit, taxes_and_fees, total_amount, currency, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
          RETURNING *;
        `;
        const values = [
          record.id,
          record.user_id,
          record.destination_id,
          record.stay_id,
          record.room_type,
          record.experience_id,
          record.trip_id,
          record.booking_date,
          record.check_in_date,
          record.check_out_date,
          record.number_of_nights,
          record.booking_status,
          record.number_of_people,
          record.guest_name,
          record.guest_email,
          record.guest_phone,
          record.special_requests,
          record.base_rate_per_unit,
          record.taxes_and_fees,
          record.total_amount,
          record.currency,
          record.created_at,
          record.updated_at,
        ];

        const res = await pool.query(sql, values);
        if (res.rows && res.rows.length > 0) {
          return mapRowToBooking(res.rows[0]);
        }
      } catch (dbErr: any) {
        console.warn('[BookingsRepository] Postgres insert fallback:', dbErr.message);
      }
    }

    return record;
  }

  /**
   * Update booking status (e.g. Cancel booking)
   */
  public static async updateStatus(id: string, status: string): Promise<BookingRecord | null> {
    if (!id) return null;
    const cleanId = id.trim();
    const now = new Date().toISOString();

    if (isDbConfigured()) {
      try {
        const pool = getPool();
        const res = await pool.query(
          `UPDATE bookings SET booking_status = $1, updated_at = $2 WHERE id = $3 RETURNING *;`,
          [status, now, cleanId]
        );
        if (res.rows && res.rows.length > 0) {
          const updated = mapRowToBooking(res.rows[0]);
          inMemoryBookings.set(cleanId, updated);
          return updated;
        }
      } catch (dbErr: any) {
        console.warn('[BookingsRepository] Postgres updateStatus fallback:', dbErr.message);
      }
    }

    const inMem = inMemoryBookings.get(cleanId);
    if (inMem) {
      inMem.booking_status = status;
      inMem.updated_at = now;
      return inMem;
    }

    return null;
  }

  /**
   * Delete booking
   */
  public static async delete(id: string): Promise<boolean> {
    if (!id) return false;
    const cleanId = id.trim();

    if (isDbConfigured()) {
      try {
        const pool = getPool();
        const res = await pool.query('DELETE FROM bookings WHERE id = $1;', [cleanId]);
        inMemoryBookings.delete(cleanId);
        return (res.rowCount ?? 0) > 0;
      } catch (dbErr: any) {
        console.warn('[BookingsRepository] Postgres delete fallback:', dbErr.message);
      }
    }

    return inMemoryBookings.delete(cleanId);
  }
}
