import { getPool, isDbConfigured } from './config/db';

export interface TripItemRecord {
  id: string;
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

export interface TripRecord {
  id: string;
  user_id?: string | null;
  destination_id?: string | null;
  title: string;
  number_of_days: number;
  budget?: string | null;
  travel_style?: string | null;
  interests?: string[] | null;
  total_estimated_cost?: string | null;
  created_at?: string;
  updated_at?: string;
  items?: TripItemRecord[];
}

export interface CreateTripDto {
  id?: string;
  userId?: string | null;
  destinationId?: string | null;
  title: string;
  numberOfDays?: number;
  budget?: string | null;
  travelStyle?: string | null;
  interests?: string[] | null;
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

export interface UpdateTripDto {
  destinationId?: string | null;
  title?: string;
  numberOfDays?: number;
  budget?: string | null;
  travelStyle?: string | null;
  interests?: string[] | null;
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

// In-memory store for fallback if Postgres is unreachable
const inMemoryTrips: Map<string, TripRecord> = new Map([
  [
    'trip-hampi-royal-heritage-4d',
    {
      id: 'trip-hampi-royal-heritage-4d',
      user_id: 'user-demo-voyager-1',
      destination_id: 'hampi',
      title: 'Royal Vijayanagara & Boulder Sanctuary 4-Day Journey',
      number_of_days: 4,
      budget: 'Signature Luxury',
      travel_style: 'Deep Cultural Immersion',
      interests: ['Heritage Architecture', 'Riverside Bouldering', 'Private Coracle Drift', 'Royal Gastronomy'],
      total_estimated_cost: '₹56,000 ($680)',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: [
        {
          id: 'item-hampi-d1-1',
          trip_id: 'trip-hampi-royal-heritage-4d',
          experience_id: null,
          destination_id: 'hampi',
          day_number: 1,
          title: 'Arrival & Kamalapura Royal Welcome',
          description: 'Private luxury check-in to heritage palace suite followed by sunset tea overlooking royal ruins.',
          start_time: '14:00',
          estimated_cost: 'Included in Stay',
          latitude: 15.3350,
          longitude: 76.4600,
          created_at: new Date().toISOString(),
        },
        {
          id: 'item-hampi-d1-2',
          trip_id: 'trip-hampi-royal-heritage-4d',
          experience_id: 'hampi-coracle-sunset-drift',
          destination_id: 'hampi',
          day_number: 1,
          title: 'Tungabhadra Sacred Coracle & Bouldering Sunset Glide',
          description: 'Glide in traditional wicker boats past ancient granite boulder canyons as evening temple bells echo.',
          start_time: '16:30',
          estimated_cost: '₹4,500 ($55)',
          latitude: 15.3350,
          longitude: 76.4600,
          created_at: new Date().toISOString(),
        },
        {
          id: 'item-hampi-d2-1',
          trip_id: 'trip-hampi-royal-heritage-4d',
          experience_id: null,
          destination_id: 'hampi',
          day_number: 2,
          title: 'Vijaya Vittala Temple & Stone Chariot Dawn Walk',
          description: 'Private historian-guided exploration of the 15th-century musical pillars before public entry.',
          start_time: '06:30',
          estimated_cost: '₹2,800 ($34)',
          latitude: 15.3350,
          longitude: 76.4600,
          created_at: new Date().toISOString(),
        },
        {
          id: 'item-hampi-d3-1',
          trip_id: 'trip-hampi-royal-heritage-4d',
          experience_id: null,
          destination_id: 'hampi',
          day_number: 3,
          title: 'Virupaksha Temple Aarti & River Ghats',
          description: 'Witness morning spiritual ceremonies and explore the vibrant ancient temple market.',
          start_time: '08:00',
          estimated_cost: '₹1,500 ($18)',
          latitude: 15.3350,
          longitude: 76.4600,
          created_at: new Date().toISOString(),
        },
      ],
    },
  ],
  [
    'trip-coorg-coffee-wellness-3d',
    {
      id: 'trip-coorg-coffee-wellness-3d',
      user_id: 'user-demo-voyager-1',
      destination_id: 'coorg',
      title: 'Cloud-Forest Coffee Estates & Ayurvedic Sanctuary 3-Day Retreat',
      number_of_days: 3,
      budget: 'Ultra-Luxury Bespoke',
      travel_style: 'Relaxed & Unhurried',
      interests: ['Private Estate Villas', 'Cupping Masterclass', 'Ayurvedic Sound Sanctuary', 'Spice Trails'],
      total_estimated_cost: '₹42,500 ($515)',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: [
        {
          id: 'item-coorg-d1-1',
          trip_id: 'trip-coorg-coffee-wellness-3d',
          experience_id: 'coorg-artisan-coffee-roast',
          destination_id: 'coorg',
          day_number: 1,
          title: 'Private Cloud-Forest Estate Coffee Masterclass & Cupping',
          description: 'Harvest cherries in a 150-year estate and roast single-origin beans with a certified Q-grader.',
          start_time: '09:30',
          estimated_cost: '₹3,800 ($46)',
          latitude: 12.3375,
          longitude: 75.8069,
          created_at: new Date().toISOString(),
        },
      ],
    },
  ],
]);

function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export class TripsRepository {
  /**
   * Fetch all trips with optional filtering
   */
  public static async getAll(filters: {
    userId?: string;
    destinationId?: string;
    search?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{
    trips: TripRecord[];
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

        if (filters.search && filters.search.trim()) {
          const q = `%${filters.search.toLowerCase().trim()}%`;
          conditions.push(`(
            LOWER(title) LIKE $${paramIndex} OR
            LOWER(COALESCE(travel_style, '')) LIKE $${paramIndex} OR
            LOWER(COALESCE(budget, '')) LIKE $${paramIndex}
          )`);
          values.push(q);
          paramIndex++;
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        const countRes = await pool.query(`SELECT COUNT(*) as count FROM trips ${whereClause};`, values);
        const total = parseInt(countRes.rows[0]?.count || '0', 10);

        let sql = `SELECT * FROM trips ${whereClause} ORDER BY created_at DESC`;
        if (filters.limit) sql += ` LIMIT ${filters.limit}`;
        if (filters.offset) sql += ` OFFSET ${filters.offset}`;

        const tripsRes = await pool.query(sql, values);

        if (tripsRes.rows && tripsRes.rows.length > 0) {
          const tripIds = tripsRes.rows.map((r: any) => r.id);
          const itemsRes = await pool.query(
            `SELECT * FROM trip_items WHERE trip_id = ANY($1) ORDER BY day_number ASC, created_at ASC;`,
            [tripIds]
          );

          const itemsByTrip = new Map<string, TripItemRecord[]>();
          for (const item of itemsRes.rows) {
            const list = itemsByTrip.get(item.trip_id) || [];
            list.push({
              id: item.id,
              trip_id: item.trip_id,
              experience_id: item.experience_id,
              destination_id: item.destination_id,
              day_number: item.day_number,
              title: item.title,
              description: item.description,
              start_time: item.start_time,
              estimated_cost: item.estimated_cost,
              latitude: item.latitude ? parseFloat(item.latitude) : null,
              longitude: item.longitude ? parseFloat(item.longitude) : null,
              created_at: item.created_at,
            });
            itemsByTrip.set(item.trip_id, list);
          }

          const trips: TripRecord[] = tripsRes.rows.map((row: any) => ({
            id: row.id,
            user_id: row.user_id,
            destination_id: row.destination_id,
            title: row.title,
            number_of_days: row.number_of_days,
            budget: row.budget,
            travel_style: row.travel_style,
            interests: Array.isArray(row.interests) ? row.interests : [],
            total_estimated_cost: row.total_estimated_cost,
            created_at: row.created_at,
            updated_at: row.updated_at,
            items: itemsByTrip.get(row.id) || [],
          }));

          return {
            trips,
            total,
            source: 'postgres',
          };
        }
      } catch (dbErr: any) {
        console.warn('[TripsRepository] Postgres query bypassed, using in-memory store:', dbErr.message);
      }
    }

    // In-memory fallback
    let results = Array.from(inMemoryTrips.values());
    if (filters.userId) {
      results = results.filter((t) => t.user_id === filters.userId);
    }
    if (filters.destinationId) {
      results = results.filter((t) => t.destination_id?.toLowerCase() === filters.destinationId?.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      results = results.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.travel_style?.toLowerCase().includes(q) ||
          t.budget?.toLowerCase().includes(q)
      );
    }

    const total = results.length;
    if (filters.offset) results = results.slice(filters.offset);
    if (filters.limit) results = results.slice(0, filters.limit);

    return {
      trips: results,
      total,
      source: 'in-memory',
    };
  }

  /**
   * Fetch single trip by ID with all its itinerary items
   */
  public static async getById(id: string): Promise<TripRecord | null> {
    if (!id) return null;
    const cleanId = id.trim();

    if (isDbConfigured()) {
      try {
        const pool = getPool();
        const tripRes = await pool.query('SELECT * FROM trips WHERE id = $1 LIMIT 1;', [cleanId]);
        if (tripRes.rows && tripRes.rows.length > 0) {
          const row = tripRes.rows[0];
          const itemsRes = await pool.query(
            'SELECT * FROM trip_items WHERE trip_id = $1 ORDER BY day_number ASC, created_at ASC;',
            [cleanId]
          );

          const items: TripItemRecord[] = itemsRes.rows.map((item: any) => ({
            id: item.id,
            trip_id: item.trip_id,
            experience_id: item.experience_id,
            destination_id: item.destination_id,
            day_number: item.day_number,
            title: item.title,
            description: item.description,
            start_time: item.start_time,
            estimated_cost: item.estimated_cost,
            latitude: item.latitude ? parseFloat(item.latitude) : null,
            longitude: item.longitude ? parseFloat(item.longitude) : null,
            created_at: item.created_at,
          }));

          return {
            id: row.id,
            user_id: row.user_id,
            destination_id: row.destination_id,
            title: row.title,
            number_of_days: row.number_of_days,
            budget: row.budget,
            travel_style: row.travel_style,
            interests: Array.isArray(row.interests) ? row.interests : [],
            total_estimated_cost: row.total_estimated_cost,
            created_at: row.created_at,
            updated_at: row.updated_at,
            items,
          };
        }
      } catch (dbErr: any) {
        console.warn('[TripsRepository] Postgres getById fallback:', dbErr.message);
      }
    }

    return inMemoryTrips.get(cleanId) || null;
  }

  /**
   * Create a new trip with optional itinerary items
   */
  public static async create(dto: CreateTripDto): Promise<TripRecord> {
    const tripId = dto.id?.trim() || generateId('trip');
    const userId = dto.userId || null;
    const destinationId = dto.destinationId || null;
    const title = dto.title.trim();
    const numberOfDays = dto.numberOfDays || (dto.items && dto.items.length > 0 ? Math.max(...dto.items.map(i => i.dayNumber)) : 3);
    const budget = dto.budget || null;
    const travelStyle = dto.travelStyle || null;
    const interests = dto.interests || [];
    const totalEstimatedCost = dto.totalEstimatedCost || null;
    const now = new Date().toISOString();

    const tripRecord: TripRecord = {
      id: tripId,
      user_id: userId,
      destination_id: destinationId,
      title,
      number_of_days: numberOfDays,
      budget,
      travel_style: travelStyle,
      interests,
      total_estimated_cost: totalEstimatedCost,
      created_at: now,
      updated_at: now,
      items: [],
    };

    const itemsToInsert: TripItemRecord[] = (dto.items || []).map((item, idx) => ({
      id: item.id || generateId(`item-d${item.dayNumber}-${idx + 1}`),
      trip_id: tripId,
      experience_id: item.experienceId || null,
      destination_id: item.destinationId || destinationId,
      day_number: item.dayNumber || 1,
      title: item.title,
      description: item.description || null,
      start_time: item.startTime || null,
      estimated_cost: item.estimatedCost || null,
      latitude: item.latitude ?? null,
      longitude: item.longitude ?? null,
      created_at: now,
    }));

    tripRecord.items = itemsToInsert;

    // Save to in-memory cache
    inMemoryTrips.set(tripId, tripRecord);

    // Save to PostgreSQL if connected
    if (isDbConfigured()) {
      try {
        const pool = getPool();
        await pool.query(
          `INSERT INTO trips (
            id, user_id, destination_id, title, number_of_days,
            budget, travel_style, interests, total_estimated_cost, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (id) DO UPDATE SET
            destination_id = EXCLUDED.destination_id,
            title = EXCLUDED.title,
            number_of_days = EXCLUDED.number_of_days,
            budget = EXCLUDED.budget,
            travel_style = EXCLUDED.travel_style,
            interests = EXCLUDED.interests,
            total_estimated_cost = EXCLUDED.total_estimated_cost,
            updated_at = EXCLUDED.updated_at;`,
          [
            tripId,
            userId,
            destinationId,
            title,
            numberOfDays,
            budget,
            travelStyle,
            interests,
            totalEstimatedCost,
            now,
            now,
          ]
        );

        for (const item of itemsToInsert) {
          await pool.query(
            `INSERT INTO trip_items (
              id, trip_id, experience_id, destination_id, day_number,
              title, description, start_time, estimated_cost, latitude, longitude, created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            ON CONFLICT (id) DO UPDATE SET
              experience_id = EXCLUDED.experience_id,
              destination_id = EXCLUDED.destination_id,
              day_number = EXCLUDED.day_number,
              title = EXCLUDED.title,
              description = EXCLUDED.description,
              start_time = EXCLUDED.start_time,
              estimated_cost = EXCLUDED.estimated_cost,
              latitude = EXCLUDED.latitude,
              longitude = EXCLUDED.longitude;`,
            [
              item.id,
              item.trip_id,
              item.experience_id,
              item.destination_id,
              item.day_number,
              item.title,
              item.description,
              item.start_time,
              item.estimated_cost,
              item.latitude,
              item.longitude,
              item.created_at,
            ]
          );
        }
      } catch (dbErr: any) {
        console.warn('[TripsRepository] Postgres create failed, kept in-memory record:', dbErr.message);
      }
    }

    return tripRecord;
  }

  /**
   * Update an existing trip and its itinerary items
   */
  public static async update(id: string, dto: UpdateTripDto): Promise<TripRecord | null> {
    const existing = await TripsRepository.getById(id);
    if (!existing) return null;

    const now = new Date().toISOString();
    const updatedRecord: TripRecord = {
      ...existing,
      destination_id: dto.destinationId !== undefined ? dto.destinationId : existing.destination_id,
      title: dto.title !== undefined ? dto.title.trim() : existing.title,
      number_of_days: dto.numberOfDays !== undefined ? dto.numberOfDays : existing.number_of_days,
      budget: dto.budget !== undefined ? dto.budget : existing.budget,
      travel_style: dto.travelStyle !== undefined ? dto.travelStyle : existing.travel_style,
      interests: dto.interests !== undefined ? dto.interests : existing.interests,
      total_estimated_cost: dto.totalEstimatedCost !== undefined ? dto.totalEstimatedCost : existing.total_estimated_cost,
      updated_at: now,
    };

    if (dto.items) {
      updatedRecord.items = dto.items.map((item, idx) => ({
        id: item.id || generateId(`item-d${item.dayNumber}-${idx + 1}`),
        trip_id: id,
        experience_id: item.experienceId || null,
        destination_id: item.destinationId || updatedRecord.destination_id,
        day_number: item.dayNumber || 1,
        title: item.title,
        description: item.description || null,
        start_time: item.startTime || null,
        estimated_cost: item.estimatedCost || null,
        latitude: item.latitude ?? null,
        longitude: item.longitude ?? null,
        created_at: now,
      }));
    }

    inMemoryTrips.set(id, updatedRecord);

    if (isDbConfigured()) {
      try {
        const pool = getPool();
        await pool.query(
          `UPDATE trips SET
            destination_id = $1,
            title = $2,
            number_of_days = $3,
            budget = $4,
            travel_style = $5,
            interests = $6,
            total_estimated_cost = $7,
            updated_at = $8
          WHERE id = $9;`,
          [
            updatedRecord.destination_id,
            updatedRecord.title,
            updatedRecord.number_of_days,
            updatedRecord.budget,
            updatedRecord.travel_style,
            updatedRecord.interests,
            updatedRecord.total_estimated_cost,
            now,
            id,
          ]
        );

        if (dto.items) {
          // Delete old items and insert fresh items
          await pool.query('DELETE FROM trip_items WHERE trip_id = $1;', [id]);
          for (const item of updatedRecord.items || []) {
            await pool.query(
              `INSERT INTO trip_items (
                id, trip_id, experience_id, destination_id, day_number,
                title, description, start_time, estimated_cost, latitude, longitude, created_at
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);`,
              [
                item.id,
                item.trip_id,
                item.experience_id,
                item.destination_id,
                item.day_number,
                item.title,
                item.description,
                item.start_time,
                item.estimated_cost,
                item.latitude,
                item.longitude,
                item.created_at,
              ]
            );
          }
        }
      } catch (dbErr: any) {
        console.warn('[TripsRepository] Postgres update failed, updated in-memory record:', dbErr.message);
      }
    }

    return updatedRecord;
  }

  /**
   * Delete a trip and cascade delete all its itinerary items
   */
  public static async delete(id: string): Promise<boolean> {
    const cleanId = id.trim();
    const hadInMemory = inMemoryTrips.delete(cleanId);

    let deletedInPg = false;
    if (isDbConfigured()) {
      try {
        const pool = getPool();
        const res = await pool.query('DELETE FROM trips WHERE id = $1;', [cleanId]);
        deletedInPg = (res.rowCount ?? 0) > 0;
      } catch (dbErr: any) {
        console.warn('[TripsRepository] Postgres delete failed:', dbErr.message);
      }
    }

    return hadInMemory || deletedInPg;
  }
}
