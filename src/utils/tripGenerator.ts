import { DESTINATIONS } from '../data/mockData';
import { EXPERIENCES } from '../data/experiencesData';
import {
  TripPlan,
  ItineraryDay,
  ItineraryActivity,
  Destination,
  ExperienceItem,
  ExperienceCategoryType,
  SelectedPlaceLocation,
} from '../types';
import { formatCurrency, parsePriceToINR } from './currency';
import { calculateDistanceKm } from '../services/placesService';

export interface TripGenerationParams {
  destination: string;
  locationDetails?: SelectedPlaceLocation;
  durationDays: number;
  budgetTier: 'Ultra-Luxury Bespoke' | 'Signature Luxury' | 'Premium Boutique' | 'Curated Explorer';
  travelInterests: string[];
  travelStyle: 'Relaxed & Unhurried' | 'Balanced Luxury' | 'High-Energy Explorer' | 'Deep Cultural Immersion' | 'Romantic Sanctuary';
  partyType: 'Solo Voyager' | 'Romantic Couple' | 'Family & Kin' | 'Private Circle';
  numberOfGuests?: number;
  customNotes?: string;
}

// Storage key for active selected Google Place destination
export const SELECTED_LOCATION_STORAGE_KEY = 'auric_selected_trip_location';

export function storeSelectedTripLocation(location: SelectedPlaceLocation): void {
  try {
    localStorage.setItem(SELECTED_LOCATION_STORAGE_KEY, JSON.stringify(location));
  } catch (e) {
    console.warn('Failed to store selected trip location:', e);
  }
}

export function getStoredSelectedTripLocation(): SelectedPlaceLocation | null {
  try {
    const raw = localStorage.getItem(SELECTED_LOCATION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function clearStoredSelectedTripLocation(): void {
  try {
    localStorage.removeItem(SELECTED_LOCATION_STORAGE_KEY);
  } catch (e) {
    // Ignore
  }
}

// Convert price strings or estimates to numerical USD values
export function parseEstimatedCostToUSD(priceStr?: string): number {
  if (!priceStr) return 60;
  const inrAmount = parsePriceToINR(priceStr);
  if (inrAmount > 0) {
    return Math.round(inrAmount / 83.5);
  }
  const match = priceStr.match(/\$(\d+)/);
  if (match) {
    return parseInt(match[1], 10);
  }
  return 75;
}

export function formatUSD(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}

export function formatINR(usdAmount: number): string {
  const inr = Math.round(usdAmount * 83.5);
  return formatCurrency(inr, 'INR');
}

export function formatBilingualPrice(usdAmount: number): string {
  const inr = Math.round(usdAmount * 83.5);
  return `${formatCurrency(inr, 'INR')} / $${usdAmount.toLocaleString('en-US')}`;
}

// Budget tier multipliers, transit modes, and daily benchmarks
export const BUDGET_TIER_CONFIG = {
  'Ultra-Luxury Bespoke': {
    dailyBaseUSD: 850,
    hotelTier: 'Palace Suite / Private Villa with Dedicated Butler',
    diningMultiplier: 2.2,
    transitType: 'Private Maybach / Helicopter Transfer & Dedicated Chauffeur',
    label: 'Ultra-Luxury Bespoke',
    badge: 'Royal Class',
    morningCostMultiplier: 1.8,
    diningCostMultiplier: 2.0,
    eveningCostMultiplier: 1.6,
    perks: ['24/7 Dedicated Butler', 'Champagne Welcome', 'Skip-the-line VIP Curator Access'],
  },
  'Signature Luxury': {
    dailyBaseUSD: 480,
    hotelTier: '5-Star Heritage Sanctuary / Boutique Luxury Resort',
    diningMultiplier: 1.5,
    transitType: 'Private Mercedes-Benz SUV Chauffeur',
    label: 'Signature Luxury',
    badge: 'Premier',
    morningCostMultiplier: 1.2,
    diningCostMultiplier: 1.3,
    eveningCostMultiplier: 1.2,
    perks: ['Private Scholar Historian', 'Executive Vehicle', 'Reserved Priority Vantage'],
  },
  'Premium Boutique': {
    dailyBaseUSD: 280,
    hotelTier: 'Curated 4-Star Boutique & Plantation Estates',
    diningMultiplier: 1.1,
    transitType: 'Private Premium Sedan Chauffeur',
    label: 'Premium Boutique',
    badge: 'Boutique',
    morningCostMultiplier: 1.0,
    diningCostMultiplier: 1.0,
    eveningCostMultiplier: 1.0,
    perks: ['Local Expert Guide', 'Boutique Estate Stays', 'Artisanal Tastings'],
  },
  'Curated Explorer': {
    dailyBaseUSD: 160,
    hotelTier: 'Charming Heritage Bungalows & Authentic Homestays',
    diningMultiplier: 0.8,
    transitType: 'Air-Conditioned Private Cab',
    label: 'Curated Explorer',
    badge: 'Essential Luxe',
    morningCostMultiplier: 0.7,
    diningCostMultiplier: 0.7,
    eveningCostMultiplier: 0.7,
    perks: ['Certified Local Guide', 'Historic Homestays', 'Authentic Dining'],
  },
};

export function calculateTripBudget(trip: TripPlan) {
  const guests = Math.max(
    1,
    trip.numberOfGuests ||
      (trip.partyType === 'Romantic Couple' ? 2 : trip.partyType === 'Family & Kin' ? 4 : 1)
  );
  const days = Math.max(1, trip.durationDays);
  const tierConfig =
    BUDGET_TIER_CONFIG[trip.budgetTier] || BUDGET_TIER_CONFIG['Signature Luxury'];

  // Calculate sum of individual activities
  let activitiesTotalUSD = 0;
  trip.days.forEach((d) => {
    d.activities.forEach((act) => {
      activitiesTotalUSD += (act.estimatedCost || 50) * guests;
    });
  });

  // Base estimations based on tier and duration
  const accommodationTotalUSD = Math.round(
    tierConfig.dailyBaseUSD * 0.48 * days * (guests > 2 ? 1.5 : 1)
  );
  const diningTotalUSD = Math.round(tierConfig.dailyBaseUSD * 0.28 * days * guests);
  const transitTotalUSD = Math.round(tierConfig.dailyBaseUSD * 0.18 * days);
  const conciergeFeeUSD = Math.round(tierConfig.dailyBaseUSD * 0.06 * days);

  const grandTotalUSD =
    activitiesTotalUSD + accommodationTotalUSD + diningTotalUSD + transitTotalUSD + conciergeFeeUSD;

  return {
    guests,
    days,
    activitiesUSD: activitiesTotalUSD,
    accommodationUSD: accommodationTotalUSD,
    diningUSD: diningTotalUSD,
    transitUSD: transitTotalUSD,
    conciergeFeeUSD,
    grandTotalUSD,
    perPersonUSD: Math.round(grandTotalUSD / guests),
    grandTotalINR: Math.round(grandTotalUSD * 83),
    perPersonINR: Math.round((grandTotalUSD / guests) * 83),
  };
}

/**
 * Destination Normalizer and Alias Matcher
 * Maps common destination queries to registered destinations
 */
export function findMatchedDestination(input: string): Destination | undefined {
  const clean = input.toLowerCase().trim();

  // Alias lookup map
  const aliases: Record<string, string> = {
    bengaluru: 'bengaluru',
    bangalore: 'bengaluru',
    blr: 'bengaluru',
    mysore: 'mysore',
    mysuru: 'mysore',
    coorg: 'coorg',
    kodagu: 'coorg',
    madikeri: 'coorg',
    kabini: 'kabini',
    nagarhole: 'kabini',
    gokarna: 'gokarna',
    hampi: 'hampi',
    vijayanagara: 'hampi',
    chikmagalur: 'chikmagalur',
    chikkamagaluru: 'chikmagalur',
    udaipur: 'udaipur',
    pichola: 'udaipur',
    kerala: 'kerala',
    alleppey: 'kerala',
    alappuzha: 'kerala',
    kumarakom: 'kerala',
    kochi: 'kerala',
    cochin: 'kerala',
    munnar: 'kerala',
    wayanad: 'kerala',
    ladakh: 'ladakh',
    leh: 'ladakh',
    nubra: 'ladakh',
    pangong: 'ladakh',
    amalfi: 'amalfi-coast',
    positano: 'amalfi-coast',
    ravello: 'amalfi-coast',
    capri: 'amalfi-coast',
    kyoto: 'kyoto',
    gion: 'kyoto',
    arashiyama: 'kyoto',
    swiss: 'swiss-alps',
    switzerland: 'swiss-alps',
    zermatt: 'swiss-alps',
    matterhorn: 'swiss-alps',
    interlaken: 'swiss-alps',
    serengeti: 'serengeti',
    tanzania: 'serengeti',
    ngorongoro: 'serengeti',
    santorini: 'santorini',
    oia: 'santorini',
    greece: 'santorini',
    bali: 'bali',
    ubud: 'bali',
    indonesia: 'bali',
  };

  for (const [key, destId] of Object.entries(aliases)) {
    if (clean.includes(key) || key.includes(clean)) {
      const match = DESTINATIONS.find((d) => d.id === destId);
      if (match) return match;
    }
  }

  // Exact or partial name match in DESTINATIONS
  return DESTINATIONS.find(
    (d) =>
      d.name.toLowerCase().includes(clean) ||
      clean.includes(d.name.toLowerCase()) ||
      d.id.toLowerCase() === clean
  );
}

/**
 * Filter experiences STRICTLY for a target destination.
 * Uses exact coordinates proximity (radius <= 60km) or exact destination ID / city / state.
 * NEVER leaks experiences from other countries or distant cities!
 */
export function getStrictExperiencesForDestination(
  matchedDest: Destination | undefined,
  destinationQuery: string,
  targetCoordinates?: { lat: number; lng: number },
  targetCountry?: string
): ExperienceItem[] {
  const queryClean = destinationQuery.toLowerCase().trim();
  const effectiveCountry = (targetCountry || matchedDest?.country || '').toLowerCase();

  return EXPERIENCES.filter((exp) => {
    // 1. Strict Country Filter: If target country is specified or known, reject experiences in different countries
    if (effectiveCountry) {
      const expCountry = (exp.country || '').toLowerCase();
      if (expCountry && !effectiveCountry.includes(expCountry) && !expCountry.includes(effectiveCountry)) {
        return false;
      }
    }

    // 2. Coordinate-based distance filtering (if coordinates are known)
    if (targetCoordinates) {
      // Find destination coordinates of the experience
      const expDest = DESTINATIONS.find((d) => d.id === exp.destinationId);
      if (expDest?.coordinates) {
        const distKm = calculateDistanceKm(
          targetCoordinates.lat,
          targetCoordinates.lng,
          expDest.coordinates.lat,
          expDest.coordinates.lng
        );
        // If distance is within 60km, it's a valid local experience in the destination region
        if (distKm <= 60) {
          return true;
        } else {
          // If further than 60km, reject it even if in same country
          return false;
        }
      }
    }

    // 3. Matched destination ID check
    if (matchedDest && exp.destinationId === matchedDest.id) {
      return true;
    }

    // 4. Exact City or destination name in experience location
    const locClean = exp.location.toLowerCase();
    const nameClean = exp.name.toLowerCase();

    if (matchedDest) {
      const destNameClean = matchedDest.name.toLowerCase();
      if (locClean.includes(matchedDest.id)) return true;
      if (locClean.includes(destNameClean)) return true;

      const firstWord = destNameClean.split(' ')[0]?.replace(/[^a-z]/g, '');
      if (firstWord && firstWord.length > 3 && (locClean.includes(firstWord) || nameClean.includes(firstWord))) {
        return true;
      }
    }

    // 5. Query matching only if country/region matches
    if (queryClean.length >= 3) {
      const isLocMatch = locClean.includes(queryClean) || queryClean.includes(locClean);
      if (isLocMatch) return true;
    }

    return false;
  });
}

// Interest Tag matching helper
function getInterestScore(
  category: string,
  title: string,
  description: string,
  userInterests: string[]
): number {
  if (!userInterests || userInterests.length === 0) return 1;

  let score = 1;
  const text = `${category} ${title} ${description}`.toLowerCase();

  for (const interest of userInterests) {
    const iLower = interest.toLowerCase();
    if (iLower.includes('heritage') || iLower.includes('monument') || iLower.includes('royal')) {
      if (text.includes('palace') || text.includes('heritage') || text.includes('temple') || text.includes('ruins') || text.includes('museum') || text.includes('fort') || text.includes('unesco')) {
        score += 3;
      }
    }
    if (iLower.includes('nature') || iLower.includes('scenic')) {
      if (text.includes('botanical') || text.includes('garden') || text.includes('peak') || text.includes('lake') || text.includes('waterfall') || text.includes('forest') || text.includes('mountain') || text.includes('valley')) {
        score += 3;
      }
    }
    if (iLower.includes('gastronomy') || iLower.includes('food') || iLower.includes('wine')) {
      if (text.includes('coffee') || text.includes('vineyard') || text.includes('culinary') || text.includes('tasting') || text.includes('dining') || text.includes('brewery') || text.includes('tiffin') || text.includes('chef')) {
        score += 3;
      }
    }
    if (iLower.includes('wellness') || iLower.includes('spa')) {
      if (text.includes('ayurvedic') || text.includes('spa') || text.includes('yoga') || text.includes('meditation') || text.includes('onsen') || text.includes('wellness') || text.includes('healing')) {
        score += 3;
      }
    }
    if (iLower.includes('adventure') || iLower.includes('water')) {
      if (text.includes('trek') || text.includes('safari') || text.includes('rafting') || text.includes('coracle') || text.includes('4x4') || text.includes('ridge') || text.includes('cruise')) {
        score += 3;
      }
    }
    if (iLower.includes('artisan') || iLower.includes('guild')) {
      if (text.includes('artisan') || text.includes('silk') || text.includes('sandalwood') || text.includes('craft') || text.includes('painting') || text.includes('pottery') || text.includes('market')) {
        score += 3;
      }
    }
    if (iLower.includes('photography') || iLower.includes('sunset')) {
      if (text.includes('sunset') || text.includes('sunrise') || text.includes('overlook') || text.includes('panoramic') || text.includes('viewpoint') || text.includes('golden hour')) {
        score += 3;
      }
    }
  }

  return score;
}

/**
 * Intelligent Itinerary Generator
 * Builds realistic, day-by-day tailored itineraries strictly scoped to the selected destination and reasonable nearby areas.
 * - Uses exact Google Places coordinates and nearby attractions
 * - Strictly prevents mixing unrelated cities or countries
 * - Avoids repeating places unnecessarily
 * - Handles custom/remote destinations with a clear dedicated notice
 */
export function generateItinerary(params: TripGenerationParams): TripPlan {
  const {
    destination,
    locationDetails,
    durationDays,
    budgetTier,
    travelInterests,
    travelStyle,
    partyType,
    numberOfGuests,
    customNotes,
  } = params;

  const guests =
    numberOfGuests ||
    (partyType === 'Romantic Couple' ? 2 : partyType === 'Family & Kin' ? 4 : 1);

  // 1. Locate matched destination or build from locationDetails
  const matchedDest = findMatchedDestination(destination);
  const destClean = (locationDetails?.name || destination).trim();
  const destTitle = destClean || (matchedDest ? matchedDest.name : 'Curated Destination');
  
  const countryName =
    locationDetails?.country ||
    matchedDest?.country ||
    (destination.toLowerCase().includes('india') ? 'India' : 'Curated Destination');
    
  const stateName = locationDetails?.state || matchedDest?.state;
  const cityName = locationDetails?.city || matchedDest?.name;
  const regionName = locationDetails?.region || matchedDest?.region || (countryName === 'India' ? 'Asia' : 'Global');
  
  const coordinates = locationDetails?.coordinates || matchedDest?.coordinates;
  const googlePlaceId = locationDetails?.placeId || matchedDest?.googlePlaceId;
  const formattedAddress = locationDetails?.formattedAddress || matchedDest?.formattedAddress;

  // 2. Strictly filter experiences for THIS destination & coordinates only (no foreign leakage!)
  const destinationExperiences = getStrictExperiencesForDestination(
    matchedDest,
    destination,
    coordinates,
    countryName
  );

  const tierConfig =
    BUDGET_TIER_CONFIG[budgetTier] || BUDGET_TIER_CONFIG['Signature Luxury'];

  const heroImg =
    locationDetails?.image ||
    matchedDest?.cinematicImage ||
    matchedDest?.image ||
    destinationExperiences[0]?.image ||
    'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=2400&q=85';

  // 3. Extract destination assets (Attractions, Things To Do, Signature Dishes)
  const rawAttractions = [
    ...(locationDetails?.nearbyAttractions?.map(a => ({
      name: a.name,
      description: a.address ? `${a.name} located at ${a.address}. Rating: ${a.rating || 4.8}★` : `${a.name} in ${destTitle}`,
      image: a.photoUrl || heroImg,
      tag: (a.types && a.types[0]) || 'Attraction',
      distanceKm: a.distanceKm,
      location: a.location,
      googleMapsUri: a.googleMapsUri
    })) || []),
    ...(matchedDest?.topAttractions || [])
  ];

  const rawThingsToDo = matchedDest?.thingsToDo || [];
  const signatureDishes = matchedDest?.foodAndCulture?.signatureDishes || [];
  const galleryImages = matchedDest?.gallery && matchedDest.gallery.length > 0 ? matchedDest.gallery : [heroImg];

  // Check if we have real registered experiences or nearby attractions
  const hasLocalExperiences = destinationExperiences.length > 0;
  const hasLocalAttractions = rawAttractions.length > 0;
  const hasNoNearbyCommercialPlaces = !hasLocalExperiences && !hasLocalAttractions;

  // 4. Sort experiences and attractions by user travel interests
  const sortedExperiences = [...destinationExperiences].sort((a, b) => {
    const scoreA = getInterestScore(a.category, a.name, a.description, travelInterests);
    const scoreB = getInterestScore(b.category, b.name, b.description, travelInterests);
    return scoreB - scoreA;
  });

  const sortedAttractions = [...rawAttractions].sort((a, b) => {
    const scoreA = getInterestScore(a.tag, a.name, a.description, travelInterests);
    const scoreB = getInterestScore(b.tag, b.name, b.description, travelInterests);
    return scoreB - scoreA;
  });

  // Track used places to avoid repeating attractions or locations across the entire trip
  const usedPlaceNames = new Set<string>();
  const usedActivityIds = new Set<string>();

  // 5. Generate Day-by-Day sequence
  const days: ItineraryDay[] = [];

  for (let dayIndex = 1; dayIndex <= durationDays; dayIndex++) {
    const isFirstDay = dayIndex === 1;
    const isLastDay = dayIndex === durationDays;

    let dayTitle = `Day ${dayIndex}: Discovery & Immersion in ${destTitle.split('&')[0].trim()}`;
    let dayTheme = 'Curated Exploration & Cultural Encounters';
    let transitNote = '🚗 15–20 mins private chauffeur transit between districts.';

    if (isFirstDay) {
      dayTitle = `Day 1: Arrival & Sanctuary Welcome`;
      dayTheme = `Check-in at ${destTitle.split('&')[0].trim()}, Acclimatization & Sunset Welcome`;
      transitNote = `🚗 Priority VIP airport/station greeting with private chauffeur transfer directly to your sanctuary.`;
    } else if (isLastDay) {
      dayTitle = `Day ${dayIndex}: Dawn Reflection & Grand Departure`;
      dayTheme = `Heirloom Souvenirs, Final Regional Tastings & Chauffeur Transit`;
      transitNote = `🚗 Luggage concierge standing by for seamless departure transfer.`;
    } else if (dayIndex === 2) {
      dayTitle = `Day 2: Iconic Landmarks & Master Heritage`;
      dayTheme = 'Private Historian Walk & Exclusive Access Monuments';
      transitNote = `🚗 ~15 mins transit between central heritage quarter and lunchtime veranda.`;
    } else if (dayIndex === 3) {
      dayTitle = `Day 3: Scenic Nature & Epicurean Atelier`;
      dayTheme = 'Highland Wilderness, Botanic Trails & Chef Tastings';
      transitNote = `🚗 ~25 mins scenic drive to botanical pavilions and nature viewpoints.`;
    } else if (dayIndex === 4) {
      dayTitle = `Day 4: Secret Sanctuaries & Artisan Guilds`;
      dayTheme = 'Local Heritage Ateliers, Craft Workshops & Panoramic Vistas';
      transitNote = `🚗 ~20 mins transit through historic artisan quarters.`;
    } else if (dayIndex === 5) {
      dayTitle = `Day 5: Rejuvenation & Sundowner Vista`;
      dayTheme = 'Wellness Sanctuaries, Golden Hour Views & Fine Dining';
      transitNote = `🚗 ~30 mins scenic drive to panoramic sunset ridgelines.`;
    } else if (dayIndex === 6) {
      dayTitle = `Day 6: Surrounding Trails & Nearby Excursions`;
      dayTheme = 'Scenic Excursions, Heritage Shrines & Starlit Melodies';
      transitNote = `🚗 ~45 mins excursion to picturesque neighboring scenic pass.`;
    } else {
      dayTitle = `Day ${dayIndex}: Bespoke Local Encounters`;
      dayTheme = 'Curated Pursuits, Panoramic Lookouts & Starry Night Dining';
      transitNote = `🚗 ~20 mins flexible on-demand chauffeur transit throughout the district.`;
    }

    const activities: ItineraryActivity[] = [];

    // ==========================================
    // SLOT 1: MORNING ACTIVITY (08:00 AM – 11:30 AM)
    // ==========================================
    if (isFirstDay) {
      const baseCost = Math.round(65 * tierConfig.morningCostMultiplier);
      activities.push({
        id: `day-${dayIndex}-act-1`,
        timeSlot: 'morning',
        timeLabel: '10:00 AM – 12:30 PM',
        title: `Private Chauffeur Arrival & Check-In at ${destTitle.split('&')[0].trim()} Sanctuary`,
        description: `Executive greeting with welcome elixirs, fragrant floral garlands, and seamless priority check-in to your suite overlooking ${destTitle}. Accommodation: ${tierConfig.hotelTier}.`,
        category: 'Transit',
        location: `${destTitle.split('&')[0].trim()} Sanctuary Estate, ${countryName}`,
        estimatedCost: baseCost,
        costDisplay: formatBilingualPrice(baseCost),
        sourceType: 'ai-curated',
        image: heroImg,
        duration: '2.5 Hours',
        included: ['VIP luggage concierge', 'Herbal welcome infusions', 'Personalized suite briefing'],
        notes: `🚗 Private chauffeur transfer from airport/station to ${destTitle}.`,
      });
    } else {
      // Find unused matching experience first, or unused attraction
      const chosenExp = sortedExperiences.find((e) => !usedPlaceNames.has(e.name) && !usedActivityIds.has(e.id));
      const chosenAttr = sortedAttractions.find((a) => !usedPlaceNames.has(a.name));

      if (chosenExp && (dayIndex % 2 === 1 || !chosenAttr)) {
        usedPlaceNames.add(chosenExp.name);
        usedActivityIds.add(chosenExp.id);
        const expCost = Math.round(parseEstimatedCostToUSD(chosenExp.estimatedPrice) * (tierConfig.morningCostMultiplier / 1.2));
        activities.push({
          id: `day-${dayIndex}-act-1`,
          timeSlot: 'morning',
          timeLabel: '08:00 AM – 11:30 AM',
          title: chosenExp.name,
          description: chosenExp.shortDescription || chosenExp.description,
          category: chosenExp.category,
          location: chosenExp.location,
          estimatedCost: expCost,
          costDisplay: chosenExp.estimatedPrice || formatBilingualPrice(expCost),
          sourceType: 'experience',
          image: chosenExp.image || heroImg,
          duration: chosenExp.duration || '3.5 Hours',
          included: chosenExp.included || ['Private scholar guide', 'All site permits & hydration pack'],
          notes: '🚗 15–20 mins private chauffeur transit from morning sanctuary.',
        });
      } else if (chosenAttr) {
        usedPlaceNames.add(chosenAttr.name);
        const attrCost = Math.round(55 * tierConfig.morningCostMultiplier);
        const distanceStr = chosenAttr.distanceKm ? ` (🚗 ${chosenAttr.distanceKm} km away)` : '';
        activities.push({
          id: `day-${dayIndex}-act-1`,
          timeSlot: 'morning',
          timeLabel: '08:30 AM – 11:30 AM',
          title: `Curated Exploration of ${chosenAttr.name}`,
          description: chosenAttr.description || `Exclusive early morning guided exploration of ${chosenAttr.name} with a senior cultural scholar before public hours.`,
          category: (chosenAttr.tag as any) || 'Culture',
          location: `${chosenAttr.name}, ${destTitle.split('&')[0].trim()}`,
          estimatedCost: attrCost,
          costDisplay: formatBilingualPrice(attrCost),
          sourceType: 'attraction',
          image: chosenAttr.image || galleryImages[dayIndex % galleryImages.length],
          duration: '3.0 Hours',
          included: ['Skip-the-line VIP permits', 'Licensed scholar historian guide', 'Artisanal morning refreshments'],
          notes: `🚗 15 mins private transfer from hotel to ${chosenAttr.name}${distanceStr}.`,
        });
      } else {
        const genericCost = Math.round(50 * tierConfig.morningCostMultiplier);
        const spotName = `Private Heritage Atelier & Promenade in ${destTitle.split('&')[0].trim()}`;
        activities.push({
          id: `day-${dayIndex}-act-1`,
          timeSlot: 'morning',
          timeLabel: '08:30 AM – 11:00 AM',
          title: spotName,
          description: `Guided morning discovery through hidden historical lanes, architectural landmarks, and scenic pavilions in ${destTitle}, ${countryName}.`,
          category: 'Sightseeing',
          location: `${destTitle.split('&')[0].trim()}, ${countryName}`,
          estimatedCost: genericCost,
          costDisplay: formatBilingualPrice(genericCost),
          sourceType: 'ai-curated',
          image: heroImg,
          duration: '2.5 Hours',
          included: ['Private local guide', 'Morning botanical tea', 'Transit in private vehicle'],
          notes: `🚗 15 mins private transfer through ${destTitle} central avenue.`,
        });
      }
    }

    // ==========================================
    // SLOT 2: AFTERNOON / LUNCH (12:30 PM – 03:30 PM)
    // ==========================================
    const dishIndex = (dayIndex - 1) % (signatureDishes.length || 1);
    const dish = signatureDishes.length > 0 ? signatureDishes[dishIndex] : undefined;

    const unusedThing = rawThingsToDo.find((t) => !usedPlaceNames.has(t.title));
    if (unusedThing) usedPlaceNames.add(unusedThing.title);

    const lunchCost = Math.round(60 * tierConfig.diningCostMultiplier);
    activities.push({
      id: `day-${dayIndex}-act-2`,
      timeSlot: 'afternoon',
      timeLabel: '12:30 PM – 03:30 PM',
      title: dish
        ? `Curated Chef's Table: ${dish.name} & ${destTitle.split('&')[0].trim()} Gastronomy`
        : (unusedThing ? unusedThing.title : `Artisanal Tasting Luncheon & Estate Promenade in ${destTitle.split('&')[0].trim()}`),
      description: dish
        ? `${dish.description}. Enjoy a private 4-course sensory culinary journey celebrating local recipes and paired with artisanal beverages.`
        : (unusedThing?.description || `Savor an unhurried regional luncheon in ${destTitle} at a scenic courtyard veranda celebrating ${countryName} culinary heritage.`),
      category: 'Food',
      location: `${destTitle.split('&')[0].trim()} Culinary Pavilion, ${countryName}`,
      estimatedCost: lunchCost,
      costDisplay: formatBilingualPrice(lunchCost),
      sourceType: 'ai-curated',
      image: galleryImages[(dayIndex + 1) % galleryImages.length] || heroImg,
      duration: '3.0 Hours',
      included: ['Private table reservation', '4-course tasting menu', 'Artisanal beverage pairing'],
      notes: '🚗 15–20 mins transfer from morning activity to culinary courtyard.',
    });

    // ==========================================
    // SLOT 3: EVENING ACTIVITY (05:00 PM – 07:30 PM)
    // ==========================================
    if (!isLastDay) {
      const altExp = sortedExperiences.find((e) => !usedPlaceNames.has(e.name) && !usedActivityIds.has(e.id));
      const altAttr = sortedAttractions.find((a) => !usedPlaceNames.has(a.name));

      if (altExp) {
        usedPlaceNames.add(altExp.name);
        usedActivityIds.add(altExp.id);
        const eveningCost = Math.round(parseEstimatedCostToUSD(altExp.estimatedPrice) * (tierConfig.eveningCostMultiplier / 1.2));
        activities.push({
          id: `day-${dayIndex}-act-3`,
          timeSlot: 'evening',
          timeLabel: '05:00 PM – 07:30 PM',
          title: altExp.name,
          description: altExp.shortDescription || altExp.description,
          category: altExp.category,
          location: altExp.location,
          estimatedCost: eveningCost,
          costDisplay: altExp.estimatedPrice || formatBilingualPrice(eveningCost),
          sourceType: 'experience',
          image: altExp.image || galleryImages[(dayIndex + 2) % galleryImages.length],
          duration: altExp.duration || '2.5 Hours',
          included: altExp.included || ['Private vantage reservation', 'Chilled sunset refreshments'],
          notes: '🚗 20 mins scenic transfer to sunset vantage overlook.',
        });
      } else if (altAttr) {
        usedPlaceNames.add(altAttr.name);
        const eveningCost = Math.round(50 * tierConfig.eveningCostMultiplier);
        const distStr = altAttr.distanceKm ? ` (🚗 ${altAttr.distanceKm} km away)` : '';
        activities.push({
          id: `day-${dayIndex}-act-3`,
          timeSlot: 'evening',
          timeLabel: '05:00 PM – 07:30 PM',
          title: `Golden Hour Sunset at ${altAttr.name}`,
          description: `Bask in the amber twilight as the sun descends over ${altAttr.name} and the scenic skyline of ${destTitle.split('&')[0].trim()}.`,
          category: 'Sightseeing',
          location: `${altAttr.name}, ${destTitle.split('&')[0].trim()}`,
          estimatedCost: eveningCost,
          costDisplay: formatBilingualPrice(eveningCost),
          sourceType: 'attraction',
          image: altAttr.image || galleryImages[(dayIndex + 2) % galleryImages.length],
          duration: '2.5 Hours',
          included: ['Reserved sunset overlook permits', 'Chauffeured transit', 'Artisanal canapés'],
          notes: `🚗 25 mins transit to ${altAttr.name}${distStr}.`,
        });
      } else {
        const eveningCost = Math.round(45 * tierConfig.eveningCostMultiplier);
        activities.push({
          id: `day-${dayIndex}-act-3`,
          timeSlot: 'evening',
          timeLabel: '05:00 PM – 07:30 PM',
          title: `Golden Hour Sunset & Twilight Vista in ${destTitle.split('&')[0].trim()}`,
          description: `Witness the warm golden hues across the historic architecture and natural ridgelines of ${destTitle}, ${countryName}.`,
          category: 'Sightseeing',
          location: `${destTitle.split('&')[0].trim()} Panoramic Overlook`,
          estimatedCost: eveningCost,
          costDisplay: formatBilingualPrice(eveningCost),
          sourceType: 'ai-curated',
          image: galleryImages[0] || heroImg,
          duration: '2.5 Hours',
          included: ['Private lookout access', 'Sparkling elixirs & light bites'],
          notes: '🚗 15 mins transit to panoramic sunset terrace.',
        });
      }
    } else {
      const eveningCost = Math.round(40 * tierConfig.eveningCostMultiplier);
      activities.push({
        id: `day-${dayIndex}-act-3`,
        timeSlot: 'evening',
        timeLabel: '04:30 PM – 07:00 PM',
        title: `Curated Souvenir & Heirloom Artisan Atelier in ${destTitle.split('&')[0].trim()}`,
        description: `Private after-hours access to master craft guilds for authentic textiles, rare single-origin spices, and handcrafted regional keepsakes from ${countryName}.`,
        category: 'Culture',
        location: `${destTitle.split('&')[0].trim()} Artisan Guilds, ${countryName}`,
        estimatedCost: eveningCost,
        costDisplay: formatBilingualPrice(eveningCost),
        sourceType: 'ai-curated',
        image: galleryImages[dayIndex % galleryImages.length] || heroImg,
        duration: '2.5 Hours',
        included: ['Master artisan demonstration', 'Private shopping concierge', 'Gift packaging'],
        notes: '🚗 15 mins chauffeur drive through artisan bazaar quarter.',
      });
    }

    // ==========================================
    // SLOT 4: NIGHT / STARLIT DINNER (08:00 PM – 10:30 PM)
    // ==========================================
    const dinnerCost = Math.round(80 * tierConfig.diningCostMultiplier);
    activities.push({
      id: `day-${dayIndex}-act-4`,
      timeSlot: 'night',
      timeLabel: '08:00 PM – 10:30 PM',
      title: isLastDay
        ? `Grand Farewell Gala & Starlit Toast to ${destTitle.split('&')[0].trim()}`
        : `Candlelit Royal Dining & Acoustic Melodies in ${destTitle.split('&')[0].trim()}`,
      description: isLastDay
        ? `Celebratory multi-course banquet commemorating your journey across ${destTitle}, ${countryName}, hosted in an exclusive starlit terrace.`
        : `Private candlelit dinner set in an illuminated courtyard or waterside pavilion in ${destTitle}, serenaded by gentle classical acoustic music.`,
      category: 'Dining',
      location: `${destTitle.split('&')[0].trim()} Fine Dining Pavilion, ${countryName}`,
      estimatedCost: dinnerCost,
      costDisplay: formatBilingualPrice(dinnerCost),
      sourceType: 'ai-curated',
      image: galleryImages[0] || heroImg,
      duration: '2.5 Hours',
      included: ['Private acoustic performance', 'Chef signature dessert', 'Digestifs & artisanal tea'],
      notes: '🚗 10 mins private transfer back to your suite after dinner.',
    });

    days.push({
      dayNumber: dayIndex,
      title: dayTitle,
      theme: dayTheme,
      dateLabel: `Day ${dayIndex}`,
      activities,
      dayNotes: `Pace calibrated for ${travelStyle}. ${tierConfig.transitType} standing by 15 mins prior to each time slot. ${transitNote}`,
    });
  }

  const newPlan: TripPlan = {
    id: `trip-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    title: `${destTitle} ${durationDays}-Day ${travelStyle} Sanctuary`,
    destinationId: matchedDest?.id,
    destinationName: destTitle,
    city: cityName,
    state: stateName,
    country: countryName,
    region: regionName,
    coordinates,
    googlePlaceId,
    formattedAddress,
    selectedLocation: locationDetails,
    hasNoNearbyCommercialPlaces,
    heroImage: heroImg,
    durationDays,
    budgetTier,
    dailyBudgetNum: tierConfig.dailyBaseUSD,
    travelStyle,
    travelInterests:
      travelInterests.length > 0
        ? travelInterests
        : ['Royal Heritage & Monuments', 'Fine Gastronomy & Wine', 'Nature & High Scenic'],
    partyType,
    numberOfGuests: guests,
    days,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active',
    notes: customNotes || '',
  };

  return newPlan;
}

/**
 * AI Schema Generator
 * Prepares clean structured prompt parameters for future Gemini AI integration
 */
export function generateAIPromptSchema(plan: TripPlan) {
  return {
    system_instruction: `You are Auric Vista's Senior Luxury Travel Architect. Create ultra-exclusive, culturally immersive, Michelin-caliber itineraries with minute-by-minute logistical elegance.`,
    prompt_payload: {
      destination: plan.destinationName,
      country: plan.country,
      duration_days: plan.durationDays,
      budget_tier: plan.budgetTier,
      travel_style: plan.travelStyle,
      interests: plan.travelInterests,
      party_structure: `${plan.numberOfGuests} guests (${plan.partyType})`,
      client_notes: plan.notes,
      required_schema:
        'Array<{day: number, title: string, theme: string, activities: Array<{time: string, title: string, location: string, description: string, cost_usd: number}>}>',
    },
  };
}

// Local Storage helpers for persisting multiple trips
const STORAGE_KEY = 'auric_travel_saved_trips';
const ACTIVE_TRIP_KEY = 'auric_travel_active_trip';

export function getSavedTripsFromStorage(): TripPlan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load saved trips:', err);
    return [];
  }
}

export function saveTripToStorage(trip: TripPlan): void {
  try {
    const trips = getSavedTripsFromStorage();
    const existingIndex = trips.findIndex((t) => t.id === trip.id);
    if (existingIndex >= 0) {
      trips[existingIndex] = { ...trip, updatedAt: new Date().toISOString(), status: 'saved' };
    } else {
      trips.unshift({ ...trip, status: 'saved' });
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    localStorage.setItem(ACTIVE_TRIP_KEY, JSON.stringify(trip));
  } catch (err) {
    console.error('Failed to save trip:', err);
  }
}

export function deleteSavedTripFromStorage(tripId: string): void {
  try {
    const trips = getSavedTripsFromStorage().filter((t) => t.id !== tripId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  } catch (err) {
    console.error('Failed to delete trip:', err);
  }
}

export function getActiveTripFromStorage(): TripPlan | null {
  try {
    const raw = localStorage.getItem(ACTIVE_TRIP_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load active trip:', err);
    return null;
  }
}

export function setActiveTripInStorage(trip: TripPlan): void {
  try {
    localStorage.setItem(ACTIVE_TRIP_KEY, JSON.stringify(trip));
  } catch (err) {
    console.error('Failed to set active trip:', err);
  }
}
