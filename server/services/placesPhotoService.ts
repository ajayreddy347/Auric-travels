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

interface CacheEntry {
  data: PlacePhotoResult;
  timestamp: number;
}

// In-Memory LRU / TTL Cache (7 Days TTL)
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const photoCache = new Map<string, CacheEntry>();

/**
 * Builds a highly specific, disambiguated search query for Google Places (New) API
 * Example: "Taj Mahal, Agra, Uttar Pradesh, India"
 */
export function buildSpecificPlaceQuery(dest: Partial<Destination>): string {
  if (!dest.name) return '';

  // Clean primary landmark name (e.g. "Taj Mahal & Mughal Agra" -> "Taj Mahal")
  const primaryName = dest.name
    .split('&')[0]
    .split('—')[0]
    .split('-')[0]
    .trim();

  const parts: string[] = [primaryName];

  if (dest.city && !primaryName.toLowerCase().includes(dest.city.toLowerCase())) {
    parts.push(dest.city);
  }

  if (dest.state && !primaryName.toLowerCase().includes(dest.state.toLowerCase())) {
    parts.push(dest.state);
  }

  if (dest.country && !primaryName.toLowerCase().includes(dest.country.toLowerCase())) {
    parts.push(dest.country);
  }

  return parts.filter(Boolean).join(', ');
}

/**
 * Checks whether a Google Places search result is sufficiently relevant to the destination
 */
function isResultRelevant(place: any, dest: Partial<Destination>): boolean {
  if (!place || !place.displayName?.text) return false;

  const placeName = place.displayName.text.toLowerCase();
  const address = (place.formattedAddress || '').toLowerCase();
  const destName = (dest.name || '').toLowerCase();
  const destCity = (dest.city || '').toLowerCase();
  const destCountry = (dest.country || '').toLowerCase();

  // Match landmark name, city, or country
  const primaryWord = destName.split(' ')[0].toLowerCase();
  const nameMatches = placeName.includes(primaryWord) || destName.includes(placeName);
  const cityMatches = destCity ? address.includes(destCity) || placeName.includes(destCity) : true;
  const countryMatches = destCountry ? address.includes(destCountry) : true;

  return (nameMatches || cityMatches) && countryMatches;
}

/**
 * Resolves real Google Place photos for a destination using Places API (New)
 * Falls back safely to existing static images if Google API is unavailable or returns 0 photos.
 */
export async function resolveDestinationPhotos(
  dest: Destination,
  apiKey: string
): Promise<PlacePhotoResult> {
  const fallbackResult: PlacePhotoResult = {
    image: dest.image,
    cinematicImage: dest.cinematicImage || dest.image,
    gallery: Array.isArray(dest.gallery) && dest.gallery.length > 0 ? dest.gallery : [dest.image],
    photoAttributions: (dest as any).photoAttributions,
    googlePlaceId: dest.googlePlaceId,
    googleMapsUri: dest.googleMapsUri,
    formattedAddress: dest.formattedAddress,
    isFromPlacesApi: false,
  };

  const cacheKey = dest.id || dest.name;
  const cached = photoCache.get(cacheKey);
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  // If no valid API key or key is a dummy placeholder, return fallback immediately
  if (!apiKey || apiKey.length < 15 || apiKey.includes('5524-5560')) {
    return fallbackResult;
  }

  const query = buildSpecificPlaceQuery(dest);
  if (!query) {
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
        pageSize: 3,
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

    // Find first relevant place with photos
    const matchingPlace = places.find((p: any) => isResultRelevant(p, dest) && p.photos && p.photos.length > 0) || places[0];

    if (!matchingPlace || !matchingPlace.photos || matchingPlace.photos.length === 0) {
      return fallbackResult;
    }

    const photos = matchingPlace.photos;
    const primaryPhotoName = photos[0].name;

    // Use our high-performance backend proxy /api/places/photo
    const dynamicPrimary = `/api/places/photo?name=${encodeURIComponent(primaryPhotoName)}&maxWidthPx=1600&maxHeightPx=1000`;
    const dynamicCinematic = `/api/places/photo?name=${encodeURIComponent(primaryPhotoName)}&maxWidthPx=1920&maxHeightPx=1080`;
    
    const dynamicGallery = photos.slice(0, 5).map((p: any) => 
      `/api/places/photo?name=${encodeURIComponent(p.name)}&maxWidthPx=1200&maxHeightPx=800`
    );

    // Extract Google Author Attributions
    const attributions: AuthorAttribution[] = [];
    photos.forEach((p: any) => {
      if (Array.isArray(p.authorAttributions)) {
        p.authorAttributions.forEach((attr: any) => {
          if (attr.displayName && !attributions.some(a => a.displayName === attr.displayName)) {
            attributions.push({
              displayName: attr.displayName,
              uri: attr.uri,
              photoUri: attr.photoUri,
            });
          }
        });
      }
    });

    const result: PlacePhotoResult = {
      image: dynamicPrimary,
      cinematicImage: dynamicCinematic,
      gallery: dynamicGallery.length > 0 ? dynamicGallery : [dynamicPrimary],
      photoAttributions: attributions.length > 0 ? attributions : undefined,
      googlePlaceId: matchingPlace.id,
      googleMapsUri: matchingPlace.googleMapsUri,
      formattedAddress: matchingPlace.formattedAddress,
      isFromPlacesApi: true,
    };

    // Cache the result
    photoCache.set(cacheKey, { data: result, timestamp: now });
    return result;
  } catch (err: any) {
    return fallbackResult;
  }
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
