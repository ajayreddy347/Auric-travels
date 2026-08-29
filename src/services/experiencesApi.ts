import { ExperienceItem } from '../types';
import { EXPERIENCES } from '../data/experiencesData';

export interface ExperiencesApiResponse {
  success: boolean;
  experiences: ExperienceItem[];
  total: number;
  source?: 'in-memory' | 'postgres' | 'client-fallback';
  error?: string;
  isFallback?: boolean;
}

export interface ExperienceFilterParams {
  category?: string;
  region?: string;
  destinationId?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

/**
 * Fetch curated experiences list from Node.js + Express backend (GET /api/experiences)
 */
export async function fetchExperiences(
  params: ExperienceFilterParams = {}
): Promise<ExperiencesApiResponse> {
  const query = new URLSearchParams();

  if (params.category && params.category !== 'All') {
    query.set('category', params.category);
  }
  if (params.region && params.region !== 'All') {
    query.set('region', params.region);
  }
  if (params.destinationId && params.destinationId.trim()) {
    query.set('destinationId', params.destinationId.trim());
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

  const url = `/api/experiences${query.toString() ? `?${query.toString()}` : ''}`;

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
      experiences: data.experiences || [],
      total: data.total ?? data.experiences?.length ?? 0,
      source: data.source || 'in-memory',
      isFallback: false,
    };
  } catch (error: any) {
    console.warn('[ExperiencesApi] Error fetching from backend, utilizing client fallback:', error);

    // Return fallback with error flag
    return {
      success: false,
      error: error.message || 'Unable to connect to backend server',
      experiences: EXPERIENCES,
      total: EXPERIENCES.length,
      source: 'client-fallback',
      isFallback: true,
    };
  }
}

/**
 * Fetch single experience details from backend (GET /api/experiences/:id)
 */
export async function fetchExperienceById(id: string): Promise<ExperienceItem | null> {
  if (!id) return null;

  try {
    const response = await fetch(`/api/experiences/${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.experience) return data.experience;
    }
  } catch (error) {
    console.warn(`[ExperiencesApi] Error fetching experience ${id}:`, error);
  }

  // Fallback to local
  const localMatch = EXPERIENCES.find(
    (e) => e.id.toLowerCase() === id.toLowerCase() || e.name.toLowerCase() === id.toLowerCase()
  );
  return localMatch || null;
}
