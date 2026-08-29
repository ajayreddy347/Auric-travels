import { DESTINATIONS } from '../src/data/mockData';
import { Destination, DestinationCategory, WorldRegion } from '../src/types';
import { getPool, isDbConfigured } from './config/db';

/**
 * Destinations Repository Layer
 * 
 * Provides backend data access for Auric Travel Destinations.
 * Automatically queries PostgreSQL if available and initialized,
 * while falling back gracefully to the rich curated in-memory dataset
 * when PostgreSQL is offline or unseeded.
 */

export interface DestinationFilterOptions {
  category?: string;
  region?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

/**
 * Helper to map a database row from the `destinations` table into the TypeScript `Destination` interface
 */
function mapRowToDestination(row: any): Destination {
  const rowId = (row.id || '').toLowerCase();
  const rowName = (row.name || '').toLowerCase();
  const matchingMock = DESTINATIONS.find(
    (d) =>
      d.id.toLowerCase() === rowId ||
      d.name.toLowerCase() === rowName ||
      (rowName && d.name.toLowerCase().includes(rowName)) ||
      (row.city && d.name.toLowerCase().includes(row.city.toLowerCase()))
  );

  const rawLat = row.latitude ?? row.lat;
  const rawLng = row.longitude ?? row.lng;
  const parsedLat = typeof rawLat === 'number' ? rawLat : rawLat ? parseFloat(rawLat) : undefined;
  const parsedLng = typeof rawLng === 'number' ? rawLng : rawLng ? parseFloat(rawLng) : undefined;

  const validLat = parsedLat !== undefined && !isNaN(parsedLat) ? parsedLat : matchingMock?.coordinates?.lat;
  const validLng = parsedLng !== undefined && !isNaN(parsedLng) ? parsedLng : matchingMock?.coordinates?.lng;

  const coordinates = validLat !== undefined && validLng !== undefined 
    ? { lat: validLat, lng: validLng } 
    : matchingMock?.coordinates;

  return {
    id: row.id,
    name: row.name || matchingMock?.name || 'Sanctuary',
    country: row.country || matchingMock?.country || 'India',
    city: row.city || matchingMock?.city || undefined,
    region: (row.region as WorldRegion) || matchingMock?.region || 'India',
    state: row.state || matchingMock?.state || undefined,
    category: (row.category as DestinationCategory) || matchingMock?.category || 'Heritage',
    additionalCategories: Array.isArray(row.additional_categories) ? row.additional_categories : matchingMock?.additionalCategories,
    image: row.image_url || row.image || matchingMock?.image || 'https://images.unsplash.com/photo-1600100397608-f010e58f334a?auto=format&fit=crop&w=1600&q=85',
    cinematicImage: matchingMock?.cinematicImage || row.image_url,
    gallery: Array.isArray(row.gallery_urls) && row.gallery_urls.length > 0 ? row.gallery_urls : (matchingMock?.gallery || []),
    tagline: row.tagline || matchingMock?.tagline || 'Experience extraordinary luxury and authentic discovery.',
    description: row.description || matchingMock?.description || '',
    overviewLong: matchingMock?.overviewLong || row.description,
    rating: typeof row.rating === 'string' ? parseFloat(row.rating) : (row.rating ?? matchingMock?.rating ?? 4.9),
    reviewsCount: typeof row.reviews_count === 'string' ? parseInt(row.reviews_count, 10) : (row.reviews_count ?? matchingMock?.reviewsCount ?? 120),
    bestTimeToVisit: row.best_time_to_visit || matchingMock?.bestTimeToVisit || 'October to March',
    averageTemperature: row.average_temperature || matchingMock?.averageTemperature || '22°C - 28°C',
    startingPrice: row.starting_price || matchingMock?.startingPrice || '₹55,000',
    vibe: Array.isArray(row.vibe) && row.vibe.length > 0 ? row.vibe : (matchingMock?.vibe || ['Luxury Haven', 'Cultural Heritage']),
    coordinates,
    formattedAddress: row.formatted_address || row.address || matchingMock?.formattedAddress || `${row.name}, ${row.country}`,
    googleMapsUri: row.google_maps_uri || matchingMock?.googleMapsUri || (coordinates ? `https://maps.google.com/?q=${coordinates.lat},${coordinates.lng}` : undefined),
    highlights: matchingMock?.highlights || ['Private Heritage Tour', 'Curated Gastronomy', 'Luxury Accommodation'],
    topAttractions: matchingMock?.topAttractions || [],
    thingsToDo: matchingMock?.thingsToDo || [],
    foodAndCulture: matchingMock?.foodAndCulture || {
      overview: 'Refined local flavours and timeless cultural traditions.',
      signatureDishes: [],
      culturalTraditions: [],
    },
    estimatedBudget: matchingMock?.estimatedBudget || {
      startingPrice: row.starting_price || '₹55,000',
      tier: 'Luxury',
      dailyEstimate: row.estimated_budget || '₹15,000 / day',
      accommodation: 'Luxury Suites & Villas',
      activities: 'Private Guided Excursions',
      dining: 'Chef-Led Gastronomic Experiences',
      privateTransport: 'Chauffeured Vehicles',
    },
    sampleItinerary: matchingMock?.sampleItinerary || [],
  };
}

export class DestinationsRepository {
  /**
   * Fetch all destinations from curated dataset (and PostgreSQL when synced)
   */
  public static async getAll(filters: DestinationFilterOptions = {}): Promise<{
    destinations: Destination[];
    total: number;
    source: 'in-memory' | 'postgres';
  }> {
    // Curated in-memory destination database as primary source of truth
    let results: Destination[] = [...DESTINATIONS];

    if (filters.category && filters.category !== 'All') {
      const catLower = filters.category.toLowerCase();
      results = results.filter((d) => {
        if (catLower === 'heritage') {
          return d.category.toLowerCase() === 'heritage' || d.vibe?.some((v) => v.toLowerCase().includes('unesco'));
        }
        return d.category.toLowerCase() === catLower || d.additionalCategories?.some((c) => c.toLowerCase() === catLower);
      });
    }

    if (filters.region && filters.region !== 'All') {
      const regLower = filters.region.toLowerCase();
      results = results.filter((d) => {
        return (
          d.region.toLowerCase() === regLower ||
          d.country.toLowerCase() === regLower
        );
      });
    }

    if (filters.search && filters.search.trim().length > 0) {
      const q = filters.search.toLowerCase().trim();
      results = results.filter((d) => {
        const isWildlife = (q.includes('wildlife') || q.includes('safari')) && (d.category === 'Nature' || d.category === 'Adventure' || d.id === 'serengeti' || d.id === 'kabini');
        const isBeach = (q.includes('beach') || q.includes('coast') || q.includes('island')) && (d.category === 'Beach' || d.additionalCategories?.includes('Beach'));
        return (
          d.name.toLowerCase().includes(q) ||
          d.country.toLowerCase().includes(q) ||
          (d.city && d.city.toLowerCase().includes(q)) ||
          (d.state && d.state.toLowerCase().includes(q)) ||
          d.region.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q) ||
          (d.additionalCategories && d.additionalCategories.some(c => c.toLowerCase().includes(q))) ||
          d.tagline.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.vibe?.some((v) => v.toLowerCase().includes(q)) ||
          isWildlife ||
          isBeach
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
      destinations: results,
      total,
      source: 'in-memory',
    };
  }

  /**
   * Find destination by ID or slug
   */
  public static async getById(id: string): Promise<Destination | null> {
    if (!id) return null;
    const cleanId = id.toLowerCase().trim();

    if (isDbConfigured()) {
      try {
        const pool = getPool();
        const res = await pool.query('SELECT * FROM destinations WHERE LOWER(id) = $1 OR LOWER(name) = $1 LIMIT 1;', [cleanId]);
        if (res.rows && res.rows.length > 0) {
          return mapRowToDestination(res.rows[0]);
        }
      } catch (dbErr: any) {
        console.warn('[DestinationsRepository] Postgres getById fallback:', dbErr.message);
      }
    }

    const found = DESTINATIONS.find(
      (d) => d.id.toLowerCase() === cleanId || d.name.toLowerCase() === cleanId
    );
    return found || null;
  }
}
