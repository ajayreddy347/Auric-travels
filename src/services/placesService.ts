import { Destination, DestinationCategory, WorldRegion, AttractionItem } from '../types';
import { DESTINATIONS } from '../data/mockData';

const WORLDWIDE_PLACES = [
  { id: 'mock-ww-tokyo', name: 'Tokyo', country: 'Japan', state: 'Tokyo Prefecture', lat: 35.6762, lng: 139.6503, category: 'Culture', type: 'Neon Metropolis' },
  { id: 'mock-ww-kyoto', name: 'Kyoto', country: 'Japan', state: 'Kyoto Prefecture', lat: 35.0116, lng: 135.7681, category: 'Heritage', type: 'Imperial History' },
  { id: 'mock-ww-osaka', name: 'Osaka', country: 'Japan', state: 'Kansai', lat: 34.6937, lng: 135.5023, category: 'Food', type: 'Street Gastronomy' },
  { id: 'mock-ww-paris', name: 'Paris', country: 'France', state: 'Île-de-France', lat: 48.8566, lng: 2.3522, category: 'Culture', type: 'City of Light' },
  { id: 'mock-ww-eiffel', name: 'Eiffel Tower', country: 'France', state: 'Paris', lat: 48.8584, lng: 2.2945, category: 'Heritage', type: 'Iconic Landmark' },
  { id: 'mock-ww-london', name: 'London', country: 'United Kingdom', state: 'England', lat: 51.5074, lng: -0.1278, category: 'Heritage', type: 'Royal Capital' },
  { id: 'mock-ww-newyork', name: 'New York', country: 'USA', state: 'NY', lat: 40.7128, lng: -74.0060, category: 'Culture', type: 'Big Apple' },
  { id: 'mock-ww-bali', name: 'Bali', country: 'Indonesia', state: 'Bali Province', lat: -8.4095, lng: 115.1889, category: 'Beach', type: 'Tropical Sanctuary' },
  { id: 'mock-ww-dubai', name: 'Dubai', country: 'United Arab Emirates', state: 'Dubai Emirate', lat: 25.2048, lng: 55.2708, category: 'Adventure', type: 'Desert Oasis' },
  { id: 'mock-ww-singapore', name: 'Singapore', country: 'Singapore', state: 'Singapore', lat: 1.3521, lng: 103.8198, category: 'Wellness', type: 'Garden City' },
  { id: 'mock-ww-sydney', name: 'Sydney', country: 'Australia', state: 'New South Wales', lat: -33.8688, lng: 151.2093, category: 'Beach', type: 'Harbor City' },
  { id: 'mock-ww-zermatt', name: 'Zermatt', country: 'Switzerland', state: 'Valais', lat: 46.0207, lng: 7.7491, category: 'Adventure', type: 'Alpine Serenity' },
  { id: 'mock-ww-rio', name: 'Rio de Janeiro', country: 'Brazil', state: 'Rio State', lat: -22.9068, lng: -43.1729, category: 'Beach', type: 'Carnival City' },
  { id: 'mock-ww-capetown', name: 'Cape Town', country: 'South Africa', state: 'Western Cape', lat: -33.9249, lng: 18.4241, category: 'Nature', type: 'Table Mountain' },
  { id: 'mock-ww-rome', name: 'Rome', country: 'Italy', state: 'Lazio', lat: 41.9028, lng: 12.4964, category: 'Heritage', type: 'Eternal City' }
];

export interface GooglePlacePhoto {
  name: string;
  widthPx: number;
  heightPx: number;
  authorAttributions?: {
    displayName: string;
    uri?: string;
    photoUri?: string;
  }[];
}

export interface GooglePlaceResult {
  id: string;
  displayName?: {
    text: string;
    languageCode?: string;
  };
  formattedAddress?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  rating?: number;
  userRatingCount?: number;
  photos?: GooglePlacePhoto[];
  types?: string[];
  editorialSummary?: {
    text: string;
    languageCode?: string;
  };
  priceLevel?: string;
  googleMapsUri?: string;
  websiteUri?: string;
}

export interface NearbyAttraction {
  id: string;
  name: string;
  address: string;
  rating?: number;
  userRatingCount?: number;
  types: string[];
  photoUrl?: string;
  googleMapsUri?: string;
  location: {
    lat: number;
    lng: number;
  };
  distanceKm?: number;
}

/**
 * Calculates distance between two coordinates in kilometers using Haversine formula
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Maps Google Place Types to Auric Destination Categories
 */
export function mapPlaceTypesToCategory(types: string[] = []): DestinationCategory {
  const typeSet = new Set(types);
  if (typeSet.has('beach') || typeSet.has('resort_hotel') && types.some(t => t.includes('beach') || t.includes('coastal'))) {
    return 'Beach';
  }
  if (typeSet.has('historical_landmark') || typeSet.has('museum') || typeSet.has('monument') || typeSet.has('castle') || typeSet.has('church') || typeSet.has('hindu_temple')) {
    return 'Heritage';
  }
  if (typeSet.has('park') || typeSet.has('national_park') || typeSet.has('natural_feature') || typeSet.has('botanical_garden')) {
    return 'Nature';
  }
  if (typeSet.has('hiking_area') || typeSet.has('campground') || typeSet.has('mountain_pass')) {
    return 'Adventure';
  }
  if (typeSet.has('spa') || typeSet.has('wellness_center')) {
    return 'Wellness';
  }
  if (typeSet.has('restaurant') || typeSet.has('food') || typeSet.has('cafe') || typeSet.has('bar') || typeSet.has('winery')) {
    return 'Food';
  }
  return 'Culture';
}

/**
 * Returns safe proxied photo URL for Google Place photo
 */
export function getGooglePlacePhotoUrl(photoName: string, maxWidth = 1200, maxHeight = 800): string {
  if (!photoName) return '';
  return `/api/places/photo?name=${encodeURIComponent(photoName)}&maxWidthPx=${maxWidth}&maxHeightPx=${maxHeight}`;
}

/**
 * Converts a raw Google Place API result into Auric's Destination schema
 */
export function transformPlaceToDestination(place: GooglePlaceResult): Destination {
  const category = mapPlaceTypesToCategory(place.types || []);
  const name = place.displayName?.text || 'Bespoke Sanctuary';
  const address = place.formattedAddress || '';
  
  // Extract country, state, and city accurately from formatted address
  const addressParts = address.split(',').map(s => s.trim()).filter(Boolean);
  const country = addressParts.length > 0 ? addressParts[addressParts.length - 1] : 'International';
  const state = addressParts.length > 2 ? addressParts[addressParts.length - 2] : undefined;
  const city = addressParts.length > 2 ? addressParts[0] : (addressParts.length > 1 ? addressParts[0] : name);
  
  let region: WorldRegion = 'India';
  const lowerCountry = country.toLowerCase();
  const lowerAddress = address.toLowerCase();
  const lowerName = name.toLowerCase();

  if (lowerCountry.includes('india') || lowerAddress.includes('india') || lowerAddress.includes('karnataka') || lowerAddress.includes('rajasthan') || lowerAddress.includes('kerala')) {
    region = 'India';
  } else if (['italy', 'switzerland', 'france', 'greece', 'spain', 'germany', 'uk', 'austria', 'norway', 'portugal', 'paris', 'rome', 'london', 'zermatt', 'amalfi', 'positano'].some(c => lowerCountry.includes(c) || lowerAddress.includes(c) || lowerName.includes(c))) {
    region = 'Europe';
  } else if (['japan', 'indonesia', 'thailand', 'vietnam', 'singapore', 'malaysia', 'maldives', 'south korea', 'bali', 'tokyo', 'kyoto'].some(c => lowerCountry.includes(c) || lowerAddress.includes(c) || lowerName.includes(c))) {
    region = 'Asia';
  } else if (['tanzania', 'kenya', 'south africa', 'morocco', 'egypt', 'rwanda', 'namibia', 'serengeti'].some(c => lowerCountry.includes(c) || lowerAddress.includes(c) || lowerName.includes(c))) {
    region = 'Africa';
  } else if (['usa', 'canada', 'mexico', 'brazil', 'peru', 'costa rica', 'chile', 'argentina', 'new york', 'banff'].some(c => lowerCountry.includes(c) || lowerAddress.includes(c) || lowerName.includes(c))) {
    region = 'Americas';
  } else if (['australia', 'new zealand', 'fiji', 'polynesia', 'sydney'].some(c => lowerCountry.includes(c) || lowerAddress.includes(c) || lowerName.includes(c))) {
    region = 'Oceania';
  } else if (['uae', 'dubai', 'oman', 'saudi arabia', 'qatar', 'jordan'].some(c => lowerCountry.includes(c) || lowerAddress.includes(c) || lowerName.includes(c))) {
    region = 'Middle East';
  } else {
    region = 'Europe';
  }

  const primaryPhoto = place.photos && place.photos.length > 0
    ? getGooglePlacePhotoUrl(place.photos[0].name, 1600, 1000)
    : '';

  const galleryPhotos = place.photos
    ? place.photos.slice(0, 4).map(p => getGooglePlacePhotoUrl(p.name, 1200, 800))
    : [];

  const tagline = place.editorialSummary?.text || `Discover ${name} in ${country} — a world-class luxury sanctuary.`;
  const description = place.editorialSummary?.text || `${name} offers an unparalleled sanctuary in ${address}, featuring bespoke luxury, rich cultural heritage, and curated experiences.`;

  const hasCoords = place.location && typeof place.location.latitude === 'number' && typeof place.location.longitude === 'number';

  return {
    id: place.id,
    name,
    city,
    country,
    region,
    state,
    category,
    image: primaryPhoto,
    cinematicImage: primaryPhoto,
    gallery: galleryPhotos.length > 0 ? galleryPhotos : (primaryPhoto ? [primaryPhoto] : []),
    tagline,
    description,
    overviewLong: `${name} is located at ${address || `${name}, ${country}`}. It offers an exceptional luxury sanctuary experience with an average rating of ${place.rating || 4.9} out of 5 stars from ${place.userRatingCount || 100}+ travelers worldwide.`,
    rating: place.rating || 4.9,
    reviewsCount: place.userRatingCount || 150,
    bestTimeToVisit: 'October – April',
    averageTemperature: '24°C / 75°F',
    startingPrice: '₹45,000 / $540',
    vibe: ['Curated Sanctuary', category, 'Luxury Retreat', country],
    highlights: [
      `Private concierge access to ${name}`,
      `Scenic grounds and architectural highlights at ${address || name}`,
      'Bespoke chauffeured private transfers and VIP reservations'
    ],
    coordinates: hasCoords ? {
      lat: place.location!.latitude,
      lng: place.location!.longitude
    } : undefined,
    googlePlaceId: place.id,
    googleMapsUri: place.googleMapsUri || (hasCoords ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}&query_place_id=${place.id}` : undefined),
    formattedAddress: place.formattedAddress || `${name}, ${country}`,
    topAttractions: [
      {
        name: name,
        description: tagline,
        image: primaryPhoto,
        tag: category
      }
    ],
    thingsToDo: [
      {
        title: `Curated Heritage & Surroundings Tour at ${name}`,
        description: `Explore the architectural elegance, grounds, and highlights of ${name} with an expert private guide.`,
        duration: '2.5 Hours',
        type: 'Private Guided Tour'
      },
      {
        title: 'Sunset Dining & Scenic Views',
        description: 'Enjoy private rooftop or garden dining with panoramic skyline and nature views.',
        duration: '2 Hours',
        type: 'Exclusive Dining'
      }
    ],
    foodAndCulture: {
      overview: `Experience authentic ${country} culinary heritage with private chef tables, regional specialties, and fine wine pairings.`,
      signatureDishes: [
        { name: 'Chef Signature Tasting Menu', description: 'Multi-course regional delicacies crafted with fresh local seasonal ingredients.' },
        { name: 'Artisanal Cellar Wine Pairing', description: 'Sommelier-selected reserve wines complementing local flavor notes.' }
      ],
      culturalTraditions: [
        `Local artisanal craft workshops and historical exhibitions in ${country}.`,
        'Seasonal music and cultural twilight celebrations.'
      ]
    },
    estimatedBudget: {
      startingPrice: '₹45,000 / $540',
      tier: 'Luxury',
      dailyEstimate: '₹15,000 / $180 per day (couple)',
      accommodation: 'Luxury private sanctuary suite with dedicated butler service',
      activities: 'Private curator guides, VIP monument entry & priority reservations',
      dining: 'Gourmet regional tasting menus and signature champagne sundowners',
      privateTransport: 'Chauffeured luxury vehicle for all private circuits'
    },
    sampleItinerary: [
      { day: 1, title: 'Arrival & Grand Welcome', description: `Check in to luxury quarters at ${name}. Evening welcome toast and private dining.` },
      { day: 2, title: 'Private Exploration & Highlights', description: 'Curator-led private tour through premier sights and architectural landmarks.' },
      { day: 3, title: 'Artisanal Gastronomy & Sunset', description: 'Local gastronomy tasting followed by an exclusive twilight viewing.' },
      { day: 4, title: 'Farewell Leisure & Departure', description: 'Morning wellness or spa session before private chauffeured departure.' }
    ]
  };
}

/**
 * Searches real places using curated Auric Travels destination database as primary source,
 * with optional supplementary Google Places discovery
 */
export async function searchPlaces(query: string): Promise<Destination[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return DESTINATIONS;
  }

  const qLower = trimmed.toLowerCase();

  // 1. Primary Curated Database Search across name, country, region, category, vibe, state, and address
  const localMatches = DESTINATIONS.filter(d => {
    const nameMatch = d.name.toLowerCase().includes(qLower);
    const idMatch = d.id.toLowerCase().includes(qLower);
    const cityMatch = d.city ? d.city.toLowerCase().includes(qLower) : false;
    const stateMatch = d.state ? d.state.toLowerCase().includes(qLower) : false;
    const countryMatch = d.country ? d.country.toLowerCase().includes(qLower) : false;
    const regionMatch = d.region ? d.region.toLowerCase().includes(qLower) : false;
    const categoryMatch = d.category ? d.category.toLowerCase().includes(qLower) : false;
    const addCatMatch = d.additionalCategories ? d.additionalCategories.some(c => c.toLowerCase().includes(qLower)) : false;
    const vibeMatch = d.vibe ? d.vibe.some(v => v.toLowerCase().includes(qLower)) : false;
    const taglineMatch = d.tagline ? d.tagline.toLowerCase().includes(qLower) : false;
    const addressMatch = d.formattedAddress ? d.formattedAddress.toLowerCase().includes(qLower) : false;

    // Special category keywords mapping
    const isWildlifeQuery = (qLower.includes('wildlife') || qLower.includes('safari')) && (d.category === 'Nature' || d.category === 'Adventure' || d.id === 'serengeti' || d.id === 'kabini');
    const isBeachQuery = (qLower.includes('beach') || qLower.includes('coast') || qLower.includes('island')) && (d.category === 'Beach' || d.additionalCategories?.includes('Beach'));

    return nameMatch || idMatch || cityMatch || stateMatch || countryMatch || regionMatch || categoryMatch || addCatMatch || vibeMatch || taglineMatch || addressMatch || isWildlifeQuery || isBeachQuery;
  });

  // If matches found in curated destination database, return them immediately
  if (localMatches.length > 0) {
    return localMatches;
  }

  // 2. Supplementary Google Places Search if no curated destination matched directly
  try {
    const res = await fetch(`/api/places/search?query=${encodeURIComponent(trimmed)}&pageSize=12`);
    if (res.ok) {
      const data = await res.json();
      if (data.places && data.places.length > 0) {
        return data.places.map((p: GooglePlaceResult) => transformPlaceToDestination(p));
      }
    }
  } catch (err) {
    console.warn('[PlacesService Search Warning]:', err);
  }

  return localMatches;
}

/**
 * Searches nearby points of interest for a given coordinate
 */
export async function fetchNearbyAttractions(
  lat: number,
  lng: number,
  radius = 20000
): Promise<NearbyAttraction[]> {
  try {
    const res = await fetch(`/api/places/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
    if (res.ok) {
      const data = await res.json();
      if (data.places && data.places.length > 0) {
        return data.places.map((p: GooglePlaceResult) => {
          const pLat = p.location?.latitude || lat;
          const pLng = p.location?.longitude || lng;
          return {
            id: p.id,
            name: p.displayName?.text || 'Attraction',
            address: p.formattedAddress || '',
            rating: p.rating,
            userRatingCount: p.userRatingCount,
            types: p.types || [],
            photoUrl: p.photos && p.photos.length > 0
              ? getGooglePlacePhotoUrl(p.photos[0].name, 600, 400)
              : undefined,
            googleMapsUri: p.googleMapsUri,
            location: { lat: pLat, lng: pLng },
            distanceKm: calculateDistanceKm(lat, lng, pLat, pLng)
          };
        });
      }
    }
  } catch (err) {
    console.warn('[PlacesService Nearby Warning]:', err);
  }

  return [];
}

export interface AutocompletePrediction {
  placeId: string;
  mainText: string;
  secondaryText: string;
  types: string[];
  isCurated?: boolean;
}

/**
 * Fetches real-time Google Places Autocomplete predictions with error handling
 */
export async function fetchPlaceAutocomplete(
  input: string,
  sessionToken?: string
): Promise<{ predictions: AutocompletePrediction[]; error?: string; isFallback?: boolean }> {
  if (!input || input.trim().length < 2) return { predictions: [] };

  const q = input.toLowerCase().trim();

  // Curated destinations as supplementary/fallback results
  const localMatches = DESTINATIONS
    .filter(d => 
      d.name.toLowerCase().includes(q) || 
      d.country.toLowerCase().includes(q) || 
      (d.state && d.state.toLowerCase().includes(q)) ||
      (d.city && d.city.toLowerCase().includes(q)) ||
      (d.region && d.region.toLowerCase().includes(q)) ||
      (d.category && d.category.toLowerCase().includes(q)) ||
      (d.vibe && d.vibe.some(v => v.toLowerCase().includes(q)))
    )
    .slice(0, 4)
    .map(d => ({
      placeId: d.id,
      mainText: d.name,
      secondaryText: `${d.state ? d.state + ', ' : ''}${d.country}`,
      types: [d.category.toLowerCase()],
      isCurated: true
    }));

  // Curated mock worldwide matches as supplement/fallback
  const mockMatches = WORLDWIDE_PLACES
    .filter(w => 
      w.name.toLowerCase().includes(q) || 
      w.country.toLowerCase().includes(q) || 
      w.state.toLowerCase().includes(q) ||
      w.type.toLowerCase().includes(q)
    )
    .map(w => ({
      placeId: w.id,
      mainText: w.name,
      secondaryText: `${w.state ? w.state + ', ' : ''}${w.country}`,
      types: [w.category.toLowerCase()],
      isCurated: false
    }));

  const baseUrl = typeof window !== 'undefined' ? '' : 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/places/autocomplete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: input.trim(), sessionToken })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.suggestions && data.suggestions.length > 0) {
        const googlePredictions = data.suggestions
          .filter((s: any) => s.placePrediction)
          .map((s: any) => {
            const pred = s.placePrediction;
            return {
              placeId: pred.placeId,
              mainText: pred.structuredFormat?.mainText?.text || pred.text?.text || '',
              secondaryText: pred.structuredFormat?.secondaryText?.text || '',
              types: pred.types || [],
              isCurated: false
            };
          });

        // Merge: Google results first, then Curated Picks, then Mock Worldwide (avoid duplicates)
        const merged = [...googlePredictions];
        
        for (const local of localMatches) {
          const exists = merged.some(
            g => g.mainText.toLowerCase() === local.mainText.toLowerCase() || 
                 g.placeId === local.placeId
          );
          if (!exists) {
            merged.push(local);
          }
        }

        for (const mock of mockMatches) {
          const exists = merged.some(
            g => g.mainText.toLowerCase() === mock.mainText.toLowerCase() || 
                 g.placeId === mock.placeId
          );
          if (!exists) {
            merged.push(mock);
          }
        }
        return { predictions: merged, isFallback: false };
      }
    }
  } catch (err: any) {
    console.warn('[Places Autocomplete Warning]:', err);
  }

  // Merge fallbacks if Google Autocomplete is offline / invalid API key
  const fallbackMerged = [...mockMatches];
  for (const local of localMatches) {
    const exists = fallbackMerged.some(
      f => f.mainText.toLowerCase() === local.mainText.toLowerCase()
    );
    if (!exists) {
      fallbackMerged.push(local);
    }
  }

  return { predictions: fallbackMerged, isFallback: true };
}

/**
 * Fetches comprehensive place details by Place ID using Google Places API (New)
 */
export async function fetchPlaceDetails(placeId: string): Promise<Destination | null> {
  if (!placeId) return null;

  // 0. Check if matches mock worldwide places
  if (placeId.startsWith('mock-ww-')) {
    const item = WORLDWIDE_PLACES.find(w => w.id === placeId);
    if (item) {
      const category = item.category as any;
      const name = item.name;
      const country = item.country;
      const state = item.state;
      const primaryPhoto = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80';
      return {
        id: item.id,
        name,
        city: name,
        country,
        region: (country === 'Japan' || country === 'Singapore' || country === 'Indonesia') ? 'Asia' : 
                (country === 'France' || country === 'United Kingdom' || country === 'Switzerland' || country === 'Italy') ? 'Europe' : 
                (country === 'USA' || country === 'Brazil') ? 'Americas' : 
                (country === 'Australia') ? 'Oceania' : 
                (country === 'United Arab Emirates') ? 'Middle East' : 'Africa',
        state,
        category,
        image: primaryPhoto,
        cinematicImage: primaryPhoto,
        gallery: [primaryPhoto],
        tagline: `Discover the luxury of ${name}, ${country}.`,
        description: `${name} offers an unparalleled sanctuary, featuring bespoke luxury, rich cultural heritage, and curated experiences.`,
        overviewLong: `${name} is located in ${country}. It offers an exceptional luxury sanctuary experience with bespoke concierge access.`,
        rating: 4.9,
        reviewsCount: 180,
        bestTimeToVisit: 'October – April',
        averageTemperature: '24°C / 75°F',
        startingPrice: '₹45,000 / $540',
        vibe: ['Curated Sanctuary', category, 'Luxury Retreat', country],
        highlights: [
          `Private concierge access to ${name}`,
          `Scenic grounds and architectural highlights`,
          'Bespoke chauffeured private transfers and VIP reservations'
        ],
        coordinates: { lat: item.lat, lng: item.lng },
        googlePlaceId: item.id,
        googleMapsUri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ', ' + country)}`,
        formattedAddress: `${name}, ${country}`,
        topAttractions: [
          {
            name: name,
            description: `Primary attraction in ${name}`,
            image: primaryPhoto,
            tag: category
          }
        ],
        thingsToDo: [
          {
            title: `Curated Heritage & Surroundings Tour`,
            description: `Explore the architectural elegance, grounds, and highlights of ${name} with an expert private guide.`,
            duration: '2.5 Hours',
            type: 'Private Guided Tour'
          }
        ],
        foodAndCulture: {
          overview: `Experience authentic ${country} culinary heritage with private chef tables and sommelier-selected reserve wines.`,
          signatureDishes: [
            { name: 'Chef Signature Tasting Menu', description: 'Multi-course regional delicacies crafted with fresh local seasonal ingredients.' }
          ],
          culturalTraditions: [
            `Local artisanal craft workshops and historical exhibitions.`
          ]
        },
        estimatedBudget: {
          startingPrice: '₹45,000 / $540',
          tier: 'Luxury',
          dailyEstimate: '₹15,000 / $180 per day (couple)',
          accommodation: 'Luxury private sanctuary suite',
          activities: 'Private curator guides, VIP monument entry & priority reservations',
          dining: 'Gourmet regional tasting menus',
          privateTransport: 'Chauffeured luxury vehicle'
        },
        sampleItinerary: [
          { day: 1, title: 'Arrival & Grand Welcome', description: `Check in to luxury quarters in ${name}. Evening welcome toast.` },
          { day: 2, title: 'Private Exploration & Highlights', description: 'Curator-led private tour through premier sights and architectural landmarks.' }
        ]
      };
    }
  }

  // 1. Check if matches local destination directly
  const localMatch = DESTINATIONS.find(d => d.id === placeId || d.googlePlaceId === placeId);
  if (localMatch) {
    return localMatch;
  }

  // 2. Fetch from Google Places API proxy
  try {
    const baseUrl = typeof window !== 'undefined' ? '' : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/places/details?placeId=${encodeURIComponent(placeId)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.place) {
        return transformPlaceToDestination(data.place);
      }
    }
  } catch (err) {
    console.warn('[Places Details Exception]:', err);
  }

  // 3. If placeId might be a name or search keyword, try searchPlaces
  try {
    const searchResults = await searchPlaces(placeId);
    if (searchResults && searchResults.length > 0) {
      return searchResults[0];
    }
  } catch (err) {
    console.warn('[Places Fallback Search Exception]:', err);
  }

  return null;
}

export interface RouteDirectionsResult {
  distanceMeters: number;
  durationString: string;
  description?: string;
  distanceKm: number;
}

/**
 * Computes directions & distance between coordinates via Routes API
 */
export async function computeRouteDirections(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): Promise<RouteDirectionsResult> {
  const distKm = calculateDistanceKm(origin.lat, origin.lng, destination.lat, destination.lng);

  // If points are on different continents or very far (> 2000 km), direct driving routes are not possible
  if (distKm > 2000) {
    const estFlightHours = Math.max(1, Math.round((distKm / 750) * 10) / 10);
    return {
      distanceMeters: distKm * 1000,
      distanceKm: distKm,
      durationString: `~${estFlightHours} hr flight corridor`,
      description: 'Direct geodesic air corridor'
    };
  }

  try {
    const res = await fetch('/api/routes/directions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ origin, destination, travelMode: 'DRIVE' })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const distMeters = route.distanceMeters || 0;
        const durSeconds = parseInt(route.duration?.replace('s', '') || '0', 10);
        const hours = Math.floor(durSeconds / 3600);
        const minutes = Math.floor((durSeconds % 3600) / 60);
        const durText = hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;

        return {
          distanceMeters: distMeters,
          distanceKm: Math.round((distMeters / 1000) * 10) / 10,
          durationString: durText,
          description: route.description || 'Navigable driving route'
        };
      }
    }
  } catch (err) {
    // Non-blocking fallback
  }

  // Geodesic fallback calculation
  const estFlightHours = Math.max(1, Math.round((distKm / 750) * 10) / 10);
  return {
    distanceMeters: distKm * 1000,
    distanceKm: distKm,
    durationString: distKm < 150 ? `~${Math.round(distKm * 1.3)} min private transfer` : `~${estFlightHours} hr flight / transit`,
    description: 'Direct geodesic flight corridor'
  };
}

/**
 * Checks Maps configuration status from server
 */
export async function fetchMapsConfig(): Promise<{ hasApiKey: boolean; apiKey?: string }> {
  try {
    const res = await fetch('/api/maps/config');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[Maps Config Check Warning]:', err);
  }
  return { hasApiKey: false };
}

