export type DestinationCategory = 'Nature' | 'Adventure' | 'Culture' | 'Beach' | 'Heritage' | 'Food' | 'Wellness';

export interface AttractionItem {
  name: string;
  description: string;
  image?: string;
  tag?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  distanceKm?: number;
}

export interface ActivityItem {
  title: string;
  description: string;
  duration?: string;
  type?: string;
}

export interface FoodAndCulture {
  overview: string;
  signatureDishes: { name: string; description: string }[];
  culturalTraditions: string[];
}

export interface BudgetBreakdown {
  startingPrice: string;
  tier: 'Luxury' | 'Ultra-Luxe' | 'Bespoke Private';
  dailyEstimate: string;
  accommodation: string;
  activities: string;
  dining: string;
  privateTransport: string;
}

export type WorldRegion = 'India' | 'Europe' | 'Asia' | 'Americas' | 'Africa' | 'Oceania' | 'Middle East';

export interface Destination {
  id: string;
  name: string;
  country: string;
  city?: string;
  region: WorldRegion;
  state?: string;
  category: DestinationCategory;
  additionalCategories?: DestinationCategory[];
  image: string;
  cinematicImage?: string;
  gallery: string[];
  tagline: string;
  description: string;
  overviewLong?: string;
  rating: number;
  reviewsCount: number;
  bestTimeToVisit: string;
  averageTemperature: string;
  startingPrice: string;
  vibe: string[];
  highlights: string[];
  topAttractions: AttractionItem[];
  thingsToDo: ActivityItem[];
  foodAndCulture: FoodAndCulture;
  estimatedBudget: BudgetBreakdown;
  coordinates?: {
    lat: number;
    lng: number;
  };
  googlePlaceId?: string;
  googleMapsUri?: string;
  formattedAddress?: string;
  photoAttributions?: {
    displayName: string;
    uri?: string;
    photoUri?: string;
  }[];
  sampleItinerary: {
    day: number;
    title: string;
    description: string;
  }[];
}

export interface ExperienceCategory {
  id: 'adventure' | 'nature' | 'food' | 'culture' | 'sightseeing' | 'wellness';
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  image: string;
  accentColor: string;
  featuredActivities: {
    title: string;
    location: string;
    duration: string;
    tag: string;
    image: string;
  }[];
}

export type ExperienceCategoryType =
  | 'Adventure'
  | 'Nature'
  | 'Culture'
  | 'Food'
  | 'Sightseeing'
  | 'Wellness';

export interface ExperienceItem {
  id: string;
  name: string;
  category: ExperienceCategoryType;
  location: string;
  country?: string;
  region?: string;
  shortDescription: string;
  description: string;
  image: string;
  cinematicImage?: string;
  gallery?: string[];
  estimatedPrice: string;
  duration: string;
  highlights: string[];
  included?: string[];
  bestTime?: string;
  groupType?: string;
  physicalLevel?: 'Gentle' | 'Moderate' | 'High Energy' | 'Meditative' | 'Relaxed';
  rating?: number;
  reviewsCount?: number;
  destinationId?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  googlePlaceId?: string;
  formattedAddress?: string;
  googleMapsUri?: string;
}

export interface TravelMood {
  id: string;
  name: string;
  icon: string;
  description: string;
  recommendedDestinationIds: string[];
  bannerImage: string;
}

export interface PlannedTripSummary {
  destination: string;
  days: number;
  travelStyle: string;
  travelers: string;
  budgetTier: string;
}

export type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'night';

export interface ItineraryActivity {
  id: string;
  timeSlot: TimeSlot;
  timeLabel: string;
  title: string;
  description: string;
  category: ExperienceCategoryType | 'Dining' | 'Transit' | 'Leisure' | 'Sightseeing';
  location: string;
  estimatedCost: number; // in USD base
  costDisplay: string;
  sourceType: 'attraction' | 'experience' | 'custom' | 'ai-curated';
  image?: string;
  included?: string[];
  duration?: string;
  notes?: string;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  theme: string;
  dateLabel?: string;
  activities: ItineraryActivity[];
  dayNotes?: string;
}

export interface SelectedPlaceLocation {
  placeId?: string;
  name: string;
  city?: string;
  country?: string;
  state?: string;
  region?: string;
  formattedAddress?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  category?: string;
  image?: string;
  rating?: number;
  reviewsCount?: number;
  googleMapsUri?: string;
  nearbyAttractions?: Array<{
    id: string;
    name: string;
    address?: string;
    rating?: number;
    userRatingCount?: number;
    types?: string[];
    photoUrl?: string;
    googleMapsUri?: string;
    location?: { lat: number; lng: number };
    distanceKm?: number;
  }>;
}

export interface TripPlan {
  id: string;
  title: string;
  destinationId?: string;
  destinationName: string;
  city?: string;
  country?: string;
  state?: string;
  region?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  googlePlaceId?: string;
  formattedAddress?: string;
  selectedLocation?: SelectedPlaceLocation;
  hasNoNearbyCommercialPlaces?: boolean;
  heroImage: string;
  durationDays: number;
  budgetTier: 'Ultra-Luxury Bespoke' | 'Signature Luxury' | 'Premium Boutique' | 'Curated Explorer';
  dailyBudgetNum: number;
  travelStyle: 'Relaxed & Unhurried' | 'Balanced Luxury' | 'High-Energy Explorer' | 'Deep Cultural Immersion' | 'Romantic Sanctuary';
  travelInterests: string[];
  partyType: 'Solo Voyager' | 'Romantic Couple' | 'Family & Kin' | 'Private Circle';
  numberOfGuests: number;
  days: ItineraryDay[];
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'draft' | 'saved';
  notes?: string;
}

export type BookingType = 'stay' | 'experience';

export interface LuxuryStayItem {
  id: string;
  name: string;
  tagline: string;
  location: string;
  destinationId: string;
  destinationName: string;
  region: string;
  country: string;
  rating: number;
  reviewsCount: number;
  image: string;
  gallery: string[];
  pricePerNightINR: number;
  pricePerNightUSD: number;
  startingPriceDisplay: string;
  roomTypes: {
    name: string;
    description: string;
    priceMultiplier: number;
    image?: string;
  }[];
  amenities: string[];
  curatedHighlights: string[];
  badge?: string;
}

export interface BookingRecord {
  id: string;
  referenceId: string; // e.g. "AUR-2026-89421"
  type: 'stay' | 'experience';
  itemId: string;
  title: string;
  subtitle: string;
  location: string;
  imageUrl: string;
  destinationName?: string;
  category?: string;
  
  // Dates
  startDate: string; // YYYY-MM-DD
  endDate?: string; // for stays: Check-out date
  numberOfNights?: number; // for stays
  timeSlot?: string; // for experiences: e.g. "Dawn / Sunrise (06:00 AM)"
  
  // Party & Customization
  numberOfGuests: number;
  roomType?: string; // for stays
  experienceFormat?: string; // for experiences
  
  // Guest Details
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
  
  // Economics
  currency: 'INR' | 'USD';
  baseRatePerUnit: number;
  totalCost: number;
  totalCostDisplay: string;
  taxesAndFees: number;
  
  // Meta
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  memberId: string;
  memberTier: 'Founding Sovereign' | 'Grand Voyager' | 'Private Circle';
  joinedDate: string;
  phone?: string;
  homeCity?: string;
  preferredCurrency?: 'INR' | 'USD';
  avatar?: string;
  travelPreferences?: {
    travelStyle: string;
    interests: string[];
    dietary?: string;
  };
}
