import { Destination } from '../types';
import { DESTINATIONS } from '../data/mockData';

export interface DestinationsApiResponse {
  success: boolean;
  destinations: Destination[];
  total: number;
  source?: 'in-memory' | 'postgres' | 'client-fallback';
  error?: string;
  isFallback?: boolean;
}

export interface DestinationFilterParams {
  category?: string;
  region?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

/**
 * Fetch destinations list from Node.js + Express backend (GET /api/destinations)
 */
export async function fetchDestinations(
  params: DestinationFilterParams = {}
): Promise<DestinationsApiResponse> {
  const query = new URLSearchParams();

  if (params.category && params.category !== 'All') {
    query.set('category', params.category);
  }
  if (params.region && params.region !== 'All') {
    query.set('region', params.region);
  }
  if (params.search && params.search.trim()) {
    query.set('search', params.search.trim());
  }
  if (params.limit) {
    query.set('limit', String(params.limit));
  }
  if (params.offset) {
    query.set('offset', String(params.offset));
  }

  const url = `/api/destinations${query.toString() ? `?${query.toString()}` : ''}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Backend responded with HTTP status ${response.status}`
      );
    }

    const data = await response.json();
    return {
      success: true,
      destinations: data.destinations || [],
      total: data.total ?? data.destinations?.length ?? 0,
      source: data.source || 'in-memory',
      isFallback: false,
    };
  } catch (error: any) {
    console.warn('[DestinationsApi] Error fetching from backend, utilizing client fallback:', error);
    
    // Return fallback with error flag
    return {
      success: false,
      error: error.message || 'Unable to connect to backend server',
      destinations: DESTINATIONS,
      total: DESTINATIONS.length,
      source: 'client-fallback',
      isFallback: true,
    };
  }
}

/**
 * Fetch single destination details from backend (GET /api/destinations/:id)
 */
export async function fetchDestinationById(id: string): Promise<Destination | null> {
  if (!id) return null;

  try {
    const response = await fetch(`/api/destinations/${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.destination) return data.destination;
    }
  } catch (error) {
    console.warn(`[DestinationsApi] Error fetching destination ${id}:`, error);
  }

  // Fallback to local
  const localMatch = DESTINATIONS.find(
    (d) => d.id.toLowerCase() === id.toLowerCase() || d.name.toLowerCase() === id.toLowerCase()
  );
  return localMatch || null;
}
