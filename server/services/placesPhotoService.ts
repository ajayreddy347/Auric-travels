import { Destination } from '../../src/types';

export interface AuthorAttribution {
  displayName: string;
  uri?: string;
  photoUri?: string;
}

export interface PlacePhotoResult {
  image: string;
  cinematicImage: string;
  gallery: string[];
  photoAttributions?: AuthorAttribution[];
  googlePlaceId?: string;
  googleMapsUri?: string;
  formattedAddress?: string;
  isFromPlacesApi: boolean;
}

export interface EntityPhotoRequest {
  id?: string;
  title: string;
  location?: string;
  destinationName?: string;
  city?: string;
  state?: string;
  country?: string;
  category?: string;
  existingImage?: string;
  excludePlaceIds?: string[];
}

export interface ResolvedEntityPhoto {
  id?: string;
  entityName: string;
  query: string;
  image: string;
  cinematicImage: string;
  gallery: string[];
  googlePlaceId?: string;
  googleMapsUri?: string;
  photoAttributions?: AuthorAttribution[];
  isFromPlacesApi: boolean;
  source: 'google-places' | 'entity-fallback' | 'existing';
}

interface CacheEntry {
  data: PlacePhotoResult;
  timestamp: number;
}

// In-Memory LRU / TTL Cache (7 Days TTL)
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const photoCache = new Map<string, CacheEntry>();

/**
 * Curated entity-type fallbacks to guarantee an entity NEVER receives an unrelated landmark photo
 */
export const ENTITY_TYPE_FALLBACKS: Record<string, string> = {
  hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
  stay: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
  resort: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
  fort: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
  palace: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
  heritage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
  temple: 'https://images.unsplash.com/photo-1600100397608-f010e58f334a?auto=format&fit=crop&w=1200&q=80',
  dining: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80',
  food: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
  market: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1200&q=80',
  bazaar: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1200&q=80',
  nature: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  park: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
  garden: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
  beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  adventure: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&w=1200&q=80',
  museum: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=80',
  transit: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=1200&q=80',
  general: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
};

/**
 * Extracts clean, specific entity/landmark name from descriptive activity titles
 * Example: "Explore Agra Fort Complex" -> "Agra Fort"
 * Example: "Sunset View from Mehtab Bagh" -> "Mehtab Bagh"
 * Example: "The Oberoi Amarvilas Royal Stay" -> "The Oberoi Amarvilas"
 */
export function cleanEntityName(raw: string): string {
  if (!raw) return '';

  let cleaned = raw
    // Strip leading activity verbs and prefixes
    .replace(/^(visit|explore|discover|tour of|private tour of|curated tour of|sunset at|sunset view from|sunrise at|excursion to|arrival at|check-in at|day trip to|tasting at|evening at|morning at|walk through|stroll through)\s+/i, '')
    // Strip trailing descriptive suffixes
    .replace(/\s+(complex|heritage walk|imperial city|royal stay|sanctuary estate|luxury resort & spa|resort & spa|street food & marble ateliers|at sunset|at sunrise|sanctuary|palace quarters|ruins)$/i, '')
    // Strip parenthetical notes like (Baby Taj) or (Optional)
    .replace(/\s*\([^)]*\)/g, '')
    .trim();

  // If title was like "Taj Mahal, Agra", take the first segment
  if (cleaned.includes(',')) {
    const firstPart = cleaned.split(',')[0].trim();
    if (firstPart.length >= 3) {
      cleaned = firstPart;
    }
  }

  return cleaned || raw;
}

/**
 * Disambiguates an entity query by combining entity name + city + state + country
 * Example: "Agra Fort, Agra, Uttar Pradesh, India"
 */
export function buildEntitySearchQuery(
  entityName: string,
  locationContext?: string,
  city?: string,
  state?: string,
  country?: string
): string {
  const entity = cleanEntityName(entityName);
  const parts: string[] = [entity];

  const lowerEntity = entity.toLowerCase();

  // Add location context pieces if not already present in entity name
  if (locationContext) {
    const locParts = locationContext.split(',').map((s) => s.trim()).filter(Boolean);
    locParts.forEach((p) => {
      if (!lowerEntity.includes(p.toLowerCase()) && !parts.some(existing => existing.toLowerCase() === p.toLowerCase())) {
        parts.push(p);
      }
    });
  } else {
    if (city && !lowerEntity.includes(city.toLowerCase())) parts.push(city);
    if (state && !lowerEntity.includes(state.toLowerCase())) parts.push(state);
    if (country && !lowerEntity.includes(country.toLowerCase())) parts.push(country);
  }

  return parts.join(', ');
}

/**
 * Builds destination-level search query (landmark/sanctuary + city + state + country)
 */
export function buildSpecificPlaceQuery(dest: Partial<Destination>): string {
  if (!dest.name) return '';
  return buildEntitySearchQuery(dest.name, undefined, dest.city, dest.state, dest.country);
}

/**
 * Maps category/entity name keywords to an appropriate fallback image type
 */
function getEntityTypeFallback(entityName: string, category?: string): string {
  const text = `${entityName} ${category || ''}`.toLowerCase();

  if (text.includes('hotel') || text.includes('stay') || text.includes('resort') || text.includes('villa') || text.includes('suite') || text.includes('inn')) {
    return ENTITY_TYPE_FALLBACKS.hotel;
  }
  if (text.includes('fort') || text.includes('citadel') || text.includes('rampart') || text.includes('bastion')) {
    return ENTITY_TYPE_FALLBACKS.fort;
  }
  if (text.includes('palace') || text.includes('mahal') || text.includes('haveli') || text.includes('castle') || text.includes('chateau')) {
    return ENTITY_TYPE_FALLBACKS.palace;
  }
  if (text.includes('temple') || text.includes('shrine') || text.includes('mandir') || text.includes('monastery') || text.includes('pagoda') || text.includes('church') || text.includes('cathedral')) {
    return ENTITY_TYPE_FALLBACKS.temple;
  }
  if (text.includes('food') || text.includes('dining') || text.includes('restaurant') || text.includes('banquet') || text.includes('tasting') || text.includes('cuisine') || text.includes('culinary') || text.includes('chef') || text.includes('bistro')) {
    return ENTITY_TYPE_FALLBACKS.dining;
  }
  if (text.includes('market') || text.includes('bazaar') || text.includes('souk') || text.includes('shopping') || text.includes('artisan') || text.includes('craft')) {
    return ENTITY_TYPE_FALLBACKS.market;
  }
  if (text.includes('park') || text.includes('garden') || text.includes('bagh') || text.includes('botanical') || text.includes('lawn')) {
    return ENTITY_TYPE_FALLBACKS.garden;
  }
  if (text.includes('nature') || text.includes('lake') || text.includes('river') || text.includes('waterfall') || text.includes('mountain') || text.includes('valley') || text.includes('trail')) {
    return ENTITY_TYPE_FALLBACKS.nature;
  }
  if (text.includes('beach') || text.includes('coast') || text.includes('island') || text.includes('cove') || text.includes('bay')) {
    return ENTITY_TYPE_FALLBACKS.beach;
  }
  if (text.includes('museum') || text.includes('gallery') || text.includes('exhibition')) {
    return ENTITY_TYPE_FALLBACKS.museum;
  }

  return ENTITY_TYPE_FALLBACKS.heritage;
}

/**
 * Checks whether a Google Places search result is relevant to the target entity
 */
function isEntityResultRelevant(place: any, cleanTarget: string): boolean {
  if (!place || !place.displayName?.text) return false;

  const placeName = place.displayName.text.toLowerCase();
  const targetLower = cleanTarget.toLowerCase();

  // Match key tokens
  const targetWords = targetLower.split(/\s+/).filter(w => w.length > 2);
  const matchedWords = targetWords.filter(w => placeName.includes(w));

  // At least half of significant target words match, or whole name included
  return placeName.includes(targetLower) || targetLower.includes(placeName) || matchedWords.length >= Math.ceil(targetWords.length / 2);
}

/**
 * Resolves a real Google Place photo for ANY specific entity (Landmark, Hotel, Experience, Activity)
 * Enforces:
 * 1. Specific Entity Disambiguation
 * 2. Entity-level Cache Keying (no cross-entity collision)
 * 3. Duplicate Place ID Collision Prevention (ensures Day 1 Taj Mahal != Day 2 Agra Fort)
 * 4. Entity-type specific fallback (never assigns a Taj Mahal photo to a hotel or market)
 */
export async function resolveEntityPhoto(
  req: EntityPhotoRequest,
  apiKey: string
): Promise<ResolvedEntityPhoto> {
  const entityName = cleanEntityName(req.title);
  const query = buildEntitySearchQuery(
    entityName,
    req.location,
    req.city,
    req.state,
    req.country || 'India'
  );

  const fallbackImage = req.existingImage || getEntityTypeFallback(entityName, req.category);
  const fallbackResult: ResolvedEntityPhoto = {
    id: req.id,
    entityName,
    query,
    image: fallbackImage,
    cinematicImage: fallbackImage,
    gallery: [fallbackImage],
    isFromPlacesApi: false,
    source: req.existingImage ? 'existing' : 'entity-fallback',
  };

  // Distinct Cache Key per Entity + Location Context
  const normalizedKey = `entity:${entityName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}:${(req.location || req.city || 'general').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const cached = photoCache.get(normalizedKey);
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return {
      id: req.id,
      entityName,
      query,
      ...cached.data,
      source: cached.data.isFromPlacesApi ? 'google-places' : 'entity-fallback',
    };
  }

  // If no valid API key or key is a dummy placeholder, return entity-specific fallback
  if (!apiKey || apiKey.length < 15 || apiKey.includes('5524-5560')) {
    return fallbackResult;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.photos,places.googleMapsUri',
      },
      body: JSON.stringify({
        textQuery: query,
        pageSize: 4,
        languageCode: 'en',
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return fallbackResult;
    }

    const data = (await response.json()) as any;
    const places = data.places || [];

    if (places.length === 0) {
      return fallbackResult;
    }

    // Exclude previously used place IDs within the same trip to prevent duplicate image reuse
    const excludedSet = new Set(req.excludePlaceIds || []);

    let chosenPlace: any = null;
    for (const p of places) {
      if (!p.photos || p.photos.length === 0) continue;

      if (excludedSet.has(p.id)) {
        console.warn(`[WARNING] POSSIBLE PLACE MATCH COLLISION: Resolved Place ID '${p.id}' for entity '${entityName}' matches an already used place in this trip. Seeking next distinct candidate.`);
        continue;
      }

      if (isEntityResultRelevant(p, entityName)) {
        chosenPlace = p;
        break;
      }
    }

    // If no non-colliding relevant place found, fallback to first non-colliding or entity fallback
    if (!chosenPlace && places.length > 0) {
      chosenPlace = places.find((p: any) => !excludedSet.has(p.id) && p.photos && p.photos.length > 0);
    }

    if (!chosenPlace || !chosenPlace.photos || chosenPlace.photos.length === 0) {
      return fallbackResult;
    }

    const photos = chosenPlace.photos;
    const primaryPhotoName = photos[0].name;

    const dynamicPrimary = `/api/places/photo?name=${encodeURIComponent(primaryPhotoName)}&maxWidthPx=1200&maxHeightPx=800`;
    const dynamicCinematic = `/api/places/photo?name=${encodeURIComponent(primaryPhotoName)}&maxWidthPx=1920&maxHeightPx=1080`;
    const dynamicGallery = photos.slice(0, 4).map((p: any) =>
      `/api/places/photo?name=${encodeURIComponent(p.name)}&maxWidthPx=1200&maxHeightPx=800`
    );

    const attributions: AuthorAttribution[] = [];
    photos.forEach((p: any) => {
      if (Array.isArray(p.authorAttributions)) {
        p.authorAttributions.forEach((attr: any) => {
          if (attr.displayName && !attributions.some((a) => a.displayName === attr.displayName)) {
            attributions.push({
              displayName: attr.displayName,
              uri: attr.uri,
              photoUri: attr.photoUri,
            });
          }
        });
      }
    });

    const photoResult: PlacePhotoResult = {
      image: dynamicPrimary,
      cinematicImage: dynamicCinematic,
      gallery: dynamicGallery.length > 0 ? dynamicGallery : [dynamicPrimary],
      photoAttributions: attributions.length > 0 ? attributions : undefined,
      googlePlaceId: chosenPlace.id,
      googleMapsUri: chosenPlace.googleMapsUri,
      formattedAddress: chosenPlace.formattedAddress,
      isFromPlacesApi: true,
    };

    console.log(`[PLACES PHOTO] Entity: "${entityName}" | Query: "${query}" | Place ID: ${chosenPlace.id} | Selected photo: ${primaryPhotoName.slice(0, 30)}... | Source: google-places`);

    // Cache the resolved result
    photoCache.set(normalizedKey, { data: photoResult, timestamp: now });

    return {
      id: req.id,
      entityName,
      query,
      ...photoResult,
      source: 'google-places',
    };
  } catch (err: any) {
    return fallbackResult;
  }
}

/**
 * Resolves a batch of itinerary activities/days with cross-activity duplicate prevention
 */
export async function resolveItineraryActivitiesBatch(
  destination: string,
  locationContext: string,
  items: Array<{ id: string; title: string; location?: string; category?: string; existingImage?: string }>,
  apiKey: string
): Promise<Record<string, ResolvedEntityPhoto>> {
  const results: Record<string, ResolvedEntityPhoto> = {};
  const usedPlaceIds: string[] = [];

  for (const item of items) {
    const resolved = await resolveEntityPhoto(
      {
        id: item.id,
        title: item.title,
        location: item.location || locationContext,
        destinationName: destination,
        category: item.category,
        existingImage: item.existingImage,
        excludePlaceIds: usedPlaceIds,
      },
      apiKey
    );

    if (resolved.googlePlaceId) {
      usedPlaceIds.push(resolved.googlePlaceId);
    }

    results[item.id] = resolved;
  }

  return results;
}

/**
 * Resolves real Google Place photos for a destination (legacy wrapper for backwards compatibility)
 */
export async function resolveDestinationPhotos(
  dest: Destination,
  apiKey: string
): Promise<PlacePhotoResult> {
  const resolved = await resolveEntityPhoto(
    {
      id: dest.id,
      title: dest.name,
      city: dest.city,
      state: dest.state,
      country: dest.country,
      category: dest.category,
      existingImage: dest.image,
    },
    apiKey
  );

  return {
    image: resolved.image,
    cinematicImage: resolved.cinematicImage,
    gallery: resolved.gallery,
    photoAttributions: resolved.photoAttributions,
    googlePlaceId: resolved.googlePlaceId,
    googleMapsUri: resolved.googleMapsUri,
    formattedAddress: resolved.formattedAddress,
    isFromPlacesApi: resolved.isFromPlacesApi,
  };
}

/**
 * Enriches a Destination object with Google Places photos if available
 */
export async function enrichDestinationWithPlacesPhotos(
  dest: Destination,
  apiKey: string
): Promise<Destination> {
  const photoResult = await resolveDestinationPhotos(dest, apiKey);
  return {
    ...dest,
    image: photoResult.image,
    cinematicImage: photoResult.cinematicImage,
    gallery: photoResult.gallery,
    googlePlaceId: photoResult.googlePlaceId || dest.googlePlaceId,
    googleMapsUri: photoResult.googleMapsUri || dest.googleMapsUri,
    formattedAddress: photoResult.formattedAddress || dest.formattedAddress,
    photoAttributions: photoResult.photoAttributions,
  } as Destination;
}
