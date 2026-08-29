import { EXPERIENCES } from '../src/data/experiencesData';
import { ExperienceItem, ExperienceCategoryType } from '../src/types';
import { getPool, isDbConfigured } from './config/db';

/**
 * Experiences Repository Layer
 * 
 * Provides robust backend data access for Auric Travel Curated Experiences.
 * Automatically queries PostgreSQL when available, while providing seamless fallback
 * to curated in-memory datasets when PostgreSQL is offline or transitioning.
 */

export interface ExperienceFilterOptions {
  category?: string;
  region?: string;
  destinationId?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

/**
 * Helper to map a PostgreSQL row from the `experiences` table into the TypeScript `ExperienceItem` interface
 */
function mapRowToExperience(row: any): ExperienceItem {
  const rowId = (row.id || '').toLowerCase();
  const rowTitle = (row.title || row.name || '').toLowerCase();
  const rowLoc = (row.location || '').toLowerCase();

  const matchingMock = EXPERIENCES.find(
    (e) =>
      e.id.toLowerCase() === rowId ||
      e.name.toLowerCase() === rowTitle ||
      (rowTitle && e.name.toLowerCase().includes(rowTitle)) ||
      (rowLoc && e.location.toLowerCase().includes(rowLoc))
  );

  const rawLat = row.latitude ?? row.lat;
  const rawLng = row.longitude ?? row.lng;
  const parsedLat = typeof rawLat === 'number' ? rawLat : rawLat ? parseFloat(rawLat) : undefined;
  const parsedLng = typeof rawLng === 'number' ? rawLng : rawLng ? parseFloat(rawLng) : undefined;

  const validLat = parsedLat !== undefined && !isNaN(parsedLat) ? parsedLat : matchingMock?.coordinates?.lat;
  const validLng = parsedLng !== undefined && !isNaN(parsedLng) ? parsedLng : matchingMock?.coordinates?.lng;

  const coordinates = validLat !== undefined && validLng !== undefined ? { lat: validLat, lng: validLng } : matchingMock?.coordinates;

  return {
    id: row.id,
    name: row.title || row.name || matchingMock?.name || 'Curated Experience',
    category: (row.category as ExperienceCategoryType) || matchingMock?.category || 'Adventure',
    location: row.location || matchingMock?.location || 'Curated Location',
    country: row.country || matchingMock?.country || undefined,
    region: row.region || matchingMock?.region || undefined,
    destinationId: row.destination_id || row.destinationId || matchingMock?.destinationId || undefined,
    shortDescription: row.short_description || matchingMock?.shortDescription || (row.description ? `${row.description.slice(0, 140)}...` : ''),
    description: row.description || matchingMock?.description || '',
    image: row.image_url || row.image || matchingMock?.image || 'https://images.unsplash.com/photo-1600100397608-f010e58f334a?auto=format&fit=crop&w=1200&q=80',
    cinematicImage: matchingMock?.cinematicImage || row.image_url,
    gallery: Array.isArray(row.gallery_urls) && row.gallery_urls.length > 0 ? row.gallery_urls : (matchingMock?.gallery || []),
    estimatedPrice: row.price || row.estimated_price || matchingMock?.estimatedPrice || '₹5,000 per guest',
    duration: row.duration || matchingMock?.duration || '3 Hours',
    highlights: Array.isArray(row.highlights) && row.highlights.length > 0 ? row.highlights : (matchingMock?.highlights || ['Private guided access', 'Local master accompaniment', 'Curated refreshments']),
    included: Array.isArray(row.included) && row.included.length > 0 ? row.included : (matchingMock?.included || ['Expert Guide', 'All Entry Passes', 'Signature Refreshments']),
    bestTime: row.best_time || matchingMock?.bestTime || 'October – March',
    groupType: row.group_type || matchingMock?.groupType || 'Private / Small Group',
    physicalLevel: row.physical_level || matchingMock?.physicalLevel || 'Gentle',
    rating: typeof row.rating === 'string' ? parseFloat(row.rating) : (row.rating ?? matchingMock?.rating ?? 4.95),
    reviewsCount: typeof row.reviews_count === 'string' ? parseInt(row.reviews_count, 10) : (row.reviews_count ?? matchingMock?.reviewsCount ?? 120),
    coordinates,
    googlePlaceId: row.google_place_id || matchingMock?.googlePlaceId,
    formattedAddress: row.formatted_address || row.address || matchingMock?.formattedAddress || row.location || matchingMock?.location,
    googleMapsUri: row.google_maps_uri || matchingMock?.googleMapsUri || (coordinates ? `https://maps.google.com/?q=${coordinates.lat},${coordinates.lng}` : undefined),
  };
}

export class ExperiencesRepository {
  /**
   * Fetch all experiences with filtering (PostgreSQL with in-memory fallback)
   */
  public static async getAll(filters: ExperienceFilterOptions = {}): Promise<{
    experiences: ExperienceItem[];
    total: number;
    source: 'in-memory' | 'postgres';
  }> {
    // 1. Try querying PostgreSQL database if configured
    if (isDbConfigured()) {
      try {
        const pool = getPool();
        const conditions: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        // Filter by category
        if (filters.category && filters.category !== 'All') {
          conditions.push(`LOWER(category) = $${paramIndex}`);
          values.push(filters.category.toLowerCase());
          paramIndex++;
        }

        // Filter by destination ID
        if (filters.destinationId && filters.destinationId.trim()) {
          conditions.push(`LOWER(destination_id) = $${paramIndex}`);
          values.push(filters.destinationId.toLowerCase().trim());
          paramIndex++;
        }

        // Filter by search query
        if (filters.search && filters.search.trim().length > 0) {
          const q = `%${filters.search.toLowerCase().trim()}%`;
          conditions.push(`(
            LOWER(title) LIKE $${paramIndex} OR
            LOWER(description) LIKE $${paramIndex} OR
            LOWER(COALESCE(location, '')) LIKE $${paramIndex} OR
            LOWER(category) LIKE $${paramIndex}
          )`);
          values.push(q);
          paramIndex++;
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        // Count query
        const countSql = `SELECT COUNT(*) as count FROM experiences ${whereClause};`;
        const countRes = await pool.query(countSql, values);
        const total = parseInt(countRes.rows[0]?.count || '0', 10);

        let dataSql = `SELECT * FROM experiences ${whereClause} ORDER BY created_at ASC`;
        if (filters.limit) {
          dataSql += ` LIMIT ${filters.limit}`;
        }
        if (filters.offset) {
          dataSql += ` OFFSET ${filters.offset}`;
        }

        const dataRes = await pool.query(dataSql, values);

        if (dataRes.rows && dataRes.rows.length > 0) {
          return {
            experiences: dataRes.rows.map(mapRowToExperience),
            total,
            source: 'postgres',
          };
        }
      } catch (dbErr: any) {
        console.warn('[ExperiencesRepository] Postgres query bypassed, serving curated dataset:', dbErr.message);
      }
    }

    // 2. Default fallback in-memory dataset
    let results: ExperienceItem[] = [...EXPERIENCES];

    // Filter by category
    if (filters.category && filters.category !== 'All') {
      const catLower = filters.category.toLowerCase();
      results = results.filter((e) => e.category.toLowerCase() === catLower);
    }

    // Filter by region or state / location keyword
    if (filters.region && filters.region !== 'All') {
      const regLower = filters.region.toLowerCase();
      results = results.filter((e) => {
        if (regLower === 'karnataka') {
          return (
            e.location.toLowerCase().includes('karnataka') ||
            (e.region && e.region.toLowerCase() === 'karnataka')
          );
        }
        return (
          (e.region && e.region.toLowerCase() === regLower) ||
          (e.country && e.country.toLowerCase() === regLower) ||
          e.location.toLowerCase().includes(regLower)
        );
      });
    }

    // Filter by destination ID
    if (filters.destinationId && filters.destinationId.trim()) {
      const destId = filters.destinationId.toLowerCase().trim();
      results = results.filter(
        (e) => e.destinationId && e.destinationId.toLowerCase() === destId
      );
    }

    // Search query match
    if (filters.search && filters.search.trim().length > 0) {
      const q = filters.search.toLowerCase().trim();
      results = results.filter((e) => {
        return (
          e.name.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          (e.country && e.country.toLowerCase().includes(q)) ||
          e.shortDescription.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.highlights?.some((h) => h.toLowerCase().includes(q))
        );
      });
    }

    const total = results.length;

    if (filters.offset !== undefined && filters.offset > 0) {
      results = results.slice(filters.offset);
    }
    if (filters.limit !== undefined && filters.limit > 0) {
      results = results.slice(0, filters.limit);
    }

    return {
      experiences: results,
      total,
      source: 'in-memory',
    };
  }

  /**
   * Find experience by ID
   */
  public static async getById(id: string): Promise<ExperienceItem | null> {
    if (!id) return null;
    const cleanId = id.toLowerCase().trim();

    if (isDbConfigured()) {
      try {
        const pool = getPool();
        const res = await pool.query('SELECT * FROM experiences WHERE LOWER(id) = $1 OR LOWER(title) = $1 LIMIT 1;', [cleanId]);
        if (res.rows && res.rows.length > 0) {
          return mapRowToExperience(res.rows[0]);
        }
      } catch (dbErr: any) {
        console.warn('[ExperiencesRepository] Postgres getById fallback:', dbErr.message);
      }
    }

    const found = EXPERIENCES.find(
      (e) => e.id.toLowerCase() === cleanId || e.name.toLowerCase() === cleanId
    );
    return found || null;
  }

  /**
   * Find experiences relevant to a specific destination
   */
  public static async getByDestination(destinationId: string): Promise<ExperienceItem[]> {
    if (!destinationId) return [];
    const cleanId = destinationId.toLowerCase().trim();

    try {
      const pool = getPool();
      const res = await pool.query('SELECT * FROM experiences WHERE LOWER(destination_id) = $1 ORDER BY created_at ASC;', [cleanId]);
      if (res.rows && res.rows.length > 0) {
        return res.rows.map(mapRowToExperience);
      }
    } catch (dbErr: any) {
      console.warn('[ExperiencesRepository] Postgres getByDestination fallback:', dbErr.message);
    }

    return EXPERIENCES.filter(
      (e) => e.destinationId && e.destinationId.toLowerCase() === cleanId
    );
  }
}
