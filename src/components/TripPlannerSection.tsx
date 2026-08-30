import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Calendar,
  MapPin,
  Compass,
  Clock,
  Check,
  Plus,
  Trash2,
  ChevronRight,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  DollarSign,
  Share2,
  Printer,
  Download,
  Bookmark,
  BookmarkCheck,
  RotateCcw,
  SlidersHorizontal,
  Landmark,
  Trees,
  Utensils,
  Camera,
  HeartPulse,
  Users,
  ShieldCheck,
  Eye,
  Info,
  Car,
  BedDouble,
  Coffee,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Loader2,
  Globe,
  Navigation,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DESTINATIONS } from '../data/mockData';
import { EXPERIENCES } from '../data/experiencesData';
import {
  TripPlan,
  ItineraryDay,
  ItineraryActivity,
  TimeSlot,
  ExperienceCategoryType,
  SelectedPlaceLocation,
} from '../types';
import {
  generateItinerary,
  calculateTripBudget,
  saveTripToStorage,
  getSavedTripsFromStorage,
  deleteSavedTripFromStorage,
  getActiveTripFromStorage,
  setActiveTripInStorage,
  storeSelectedTripLocation,
  getStoredSelectedTripLocation,
  formatBilingualPrice,
  formatINR,
  formatUSD,
  BUDGET_TIER_CONFIG,
  enrichTripWithPlacesPhotos,
} from '../utils/tripGenerator';
import {
  fetchPlaceAutocomplete,
  fetchPlaceDetails,
  fetchNearbyAttractions,
  AutocompletePrediction,
} from '../services/placesService';
import { AddActivityModal } from './AddActivityModal';
import { SafeImage } from './SafeImage';
import { createTripOnServer } from '../services/tripsApi';
import { getStoredAuthToken } from '../utils/authStore';

interface TripPlannerSectionProps {
  initialDestination?: string;
  initialStyle?: string;
  initialLocationDetails?: SelectedPlaceLocation;
  onExploreDestinations?: () => void;
  onOpenExperienceDetail?: (expId: string) => void;
  onBookStay?: (destinationName?: string) => void;
  onBookExperience?: (expTitle?: string, location?: string) => void;
}

export const TripPlannerSection: React.FC<TripPlannerSectionProps> = ({
  initialDestination = 'Hampi',
  initialStyle = 'Cultural & Heritage',
  initialLocationDetails,
  onExploreDestinations,
  onOpenExperienceDetail,
  onBookStay,
  onBookExperience,
}) => {
  // Navigation sub-views: 'planner' (creation form), 'mytrip' (active itinerary view), 'saved' (saved itineraries list)
  const [activeTab, setActiveTab] = useState<'planner' | 'mytrip' | 'saved'>('planner');

  // FORM INPUTS
  const [destinationInput, setDestinationInput] = useState<string>(initialDestination || 'Hampi');
  const [selectedLocation, setSelectedLocation] = useState<SelectedPlaceLocation | null>(
    initialLocationDetails || null
  );

  // Google Places Autocomplete States
  const [autocompletePredictions, setAutocompletePredictions] = useState<AutocompletePrediction[]>([]);
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState<boolean>(false);
  const [isLoadingPredictions, setIsLoadingPredictions] = useState<boolean>(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState<boolean>(false);
  const [autocompleteError, setAutocompleteError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [durationDays, setDurationDays] = useState<number>(5);
  const [budgetTier, setBudgetTier] = useState<
    'Ultra-Luxury Bespoke' | 'Signature Luxury' | 'Premium Boutique' | 'Curated Explorer'
  >('Signature Luxury');
  const [travelInterests, setTravelInterests] = useState<string[]>([
    'Royal Heritage & Monuments',
    'Fine Gastronomy & Wine',
    'Nature & High Scenic',
  ]);
  const [travelStyle, setTravelStyle] = useState<
    'Relaxed & Unhurried' | 'Balanced Luxury' | 'High-Energy Explorer' | 'Deep Cultural Immersion' | 'Romantic Sanctuary'
  >('Balanced Luxury');
  const [partyType, setPartyType] = useState<
    'Solo Voyager' | 'Romantic Couple' | 'Family & Kin' | 'Private Circle'
  >('Romantic Couple');
  const [numberOfGuests, setNumberOfGuests] = useState<number>(2);
  const [customNotes, setCustomNotes] = useState<string>('');

  // ACTIVE ITINERARY STATE
  const [activeTrip, setActiveTrip] = useState<TripPlan | null>(null);
  const [savedTrips, setSavedTrips] = useState<TripPlan[]>([]);
  const [selectedDayFilter, setSelectedDayFilter] = useState<number | 'all'>('all');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // UI / MODAL STATES
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState<boolean>(false);
  const [targetDayForAdd, setTargetDayForAdd] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSavedToast, setIsSavedToast] = useState<boolean>(false);
  const [isBudgetDetailsOpen, setIsBudgetDetailsOpen] = useState<boolean>(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAutocompleteOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize or load trips & stored location on mount
  useEffect(() => {
    const loadedSaved = getSavedTripsFromStorage();
    setSavedTrips(loadedSaved);

    // Check stored location from Google Places
    const storedLoc = getStoredSelectedTripLocation();
    if (storedLoc) {
      setSelectedLocation(storedLoc);
      setDestinationInput(storedLoc.name);
    }

    const active = getActiveTripFromStorage();
    if (active) {
      setActiveTrip(active);
      setActiveTab('mytrip');
    } else {
      // Create initial sample default trip
      const initialPlan = generateItinerary({
        destination: storedLoc?.name || initialDestination || 'Hampi',
        locationDetails: storedLoc || undefined,
        durationDays: 4,
        budgetTier: 'Signature Luxury',
        travelInterests: ['Royal Heritage & Monuments', 'Fine Gastronomy & Wine'],
        travelStyle: 'Balanced Luxury',
        partyType: 'Romantic Couple',
        numberOfGuests: 2,
      });
      setActiveTrip(initialPlan);
      setActiveTripInStorage(initialPlan);
    }
  }, []);

  // Update destination if passed from external props
  useEffect(() => {
    if (initialDestination) {
      setDestinationInput(initialDestination);
    }
  }, [initialDestination]);

  useEffect(() => {
    if (initialLocationDetails) {
      setSelectedLocation(initialLocationDetails);
      setDestinationInput(initialLocationDetails.name);
    }
  }, [initialLocationDetails]);

  // Google Places Autocomplete search debounce in Trip Planner
  useEffect(() => {
    const q = destinationInput.trim();
    if (!q || q.length < 2) {
      setAutocompletePredictions([]);
      setIsLoadingPredictions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoadingPredictions(true);
      setAutocompleteError(null);

      try {
        const res = await fetchPlaceAutocomplete(q);
        setAutocompletePredictions(res.predictions || []);
        if (res.predictions && res.predictions.length > 0) {
          setIsAutocompleteOpen(true);
        }
      } catch (err) {
        console.warn('Autocomplete fetch error in trip planner:', err);
        setAutocompleteError('Could not connect to Google Places API.');
      } finally {
        setIsLoadingPredictions(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [destinationInput]);

  // Handle Selection from Google Places Suggestions
  const handleSelectGooglePlace = async (prediction: AutocompletePrediction) => {
    setIsFetchingDetails(true);
    setDestinationInput(prediction.mainText);
    setIsAutocompleteOpen(false);
    setAutocompleteError(null);

    try {
      const detailed = await fetchPlaceDetails(prediction.placeId);
      if (detailed && detailed.coordinates) {
        const newLoc: SelectedPlaceLocation = {
          name: detailed.name,
          city: detailed.city || detailed.name,
          state: detailed.state,
          country: detailed.country,
          region: detailed.region,
          coordinates: detailed.coordinates,
          formattedAddress: detailed.formattedAddress || `${detailed.name}, ${detailed.country}`,
          placeId: detailed.googlePlaceId || prediction.placeId,
          image: detailed.cinematicImage || detailed.image,
        };

        setSelectedLocation(newLoc);
        storeSelectedTripLocation(newLoc);
        setDestinationInput(newLoc.name);
        showToast(`📍 Selected ${newLoc.name}, ${newLoc.country}`);

        // Fetch nearby attractions using coordinates
        fetchNearbyAttractions(detailed.coordinates.lat, detailed.coordinates.lng, 30000)
          .then((attractions) => {
            if (attractions && attractions.length > 0) {
              const updatedWithAttractions: SelectedPlaceLocation = {
                ...newLoc,
                nearbyAttractions: attractions,
              };
              setSelectedLocation(updatedWithAttractions);
              storeSelectedTripLocation(updatedWithAttractions);
            }
          })
          .catch((e) => console.warn('Nearby attractions fetch non-blocking error:', e));
      } else {
        // Fallback if coordinates couldn't be resolved
        const fallbackLoc: SelectedPlaceLocation = {
          name: prediction.mainText,
          city: prediction.secondaryText.split(',')[0]?.trim() || prediction.mainText,
          country: prediction.secondaryText.split(',').pop()?.trim() || 'Global',
          placeId: prediction.placeId,
        };
        setSelectedLocation(fallbackLoc);
        storeSelectedTripLocation(fallbackLoc);
      }
    } catch (e) {
      console.warn('Error fetching place details in planner:', e);
      setAutocompleteError('Could not load place details. Using typed name.');
    } finally {
      setIsFetchingDetails(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Interest options
  const interestOptions = [
    { name: 'Royal Heritage & Monuments', icon: Landmark },
    { name: 'Nature & High Scenic', icon: Trees },
    { name: 'Adventure Trails & Water', icon: Compass },
    { name: 'Fine Gastronomy & Wine', icon: Utensils },
    { name: 'Iconic Sightseeing & Vistas', icon: Camera },
    { name: 'Ayurvedic Wellness & Spas', icon: HeartPulse },
    { name: 'Photography & Sunsets', icon: Camera },
    { name: 'Bespoke Artisan Guilds', icon: Sparkles },
  ];

  const toggleInterest = (interest: string) => {
    setTravelInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  // SUBMIT FORM TO GENERATE ITINERARY
  const handleGenerateItinerary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destinationInput.trim()) return;

    setIsGenerating(true);

    setTimeout(() => {
      const generated = generateItinerary({
        destination: destinationInput.trim(),
        locationDetails: selectedLocation || undefined,
        durationDays,
        budgetTier,
        travelInterests,
        travelStyle,
        partyType,
        numberOfGuests,
        customNotes,
      });

      setActiveTrip(generated);
      setActiveTripInStorage(generated);
      setIsGenerating(false);
      setActiveTab('mytrip');
      setSelectedDayFilter('all');
      showToast(`Generated custom ${durationDays}-day itinerary for ${generated.destinationName}!`);

      // Asynchronously enrich all activities with distinct Google Places photos
      enrichTripWithPlacesPhotos(generated).then((enriched) => {
        if (enriched) {
          setActiveTrip(enriched);
          setActiveTripInStorage(enriched);
        }
      });
    }, 900);
  };

  // SAVE ITINERARY
  const handleSaveActiveTrip = () => {
    if (!activeTrip) return;
    saveTripToStorage(activeTrip);
    setSavedTrips(getSavedTripsFromStorage());
    setIsSavedToast(true);
    showToast(`Itinerary for "${activeTrip.destinationName}" saved to your Travel Vault.`);
    setTimeout(() => setIsSavedToast(false), 2500);

    // If authenticated, sync trip to Supabase PostgreSQL database
    if (getStoredAuthToken()) {
      try {
        const payload = {
          id: activeTrip.id,
          destinationId: activeTrip.destinationId || 'hampi',
          title: activeTrip.title,
          numberOfDays: activeTrip.durationDays,
          budget: activeTrip.budgetTier,
          travelStyle: activeTrip.travelStyle,
          interests: activeTrip.travelInterests,
          totalEstimatedCost: String(activeTrip.dailyBudgetNum * activeTrip.durationDays),
          items: activeTrip.days.flatMap((day) =>
            day.activities.map((act) => ({
              id: act.id,
              dayNumber: day.dayNumber,
              title: act.title,
              description: act.description,
              startTime: act.time,
              estimatedCost: act.costDisplay || String(act.estimatedCost || 0),
            }))
          ),
        };
        createTripOnServer(payload).catch((err) => {
          console.warn('[TripPlannerSection] Server sync notice:', err);
        });
      } catch (err) {
        console.warn('[TripPlannerSection] Error creating trip payload:', err);
      }
    }
  };

  // REMOVE ACTIVITY
  const handleRemoveActivity = (dayNumber: number, activityId: string) => {
    if (!activeTrip) return;
    const updatedDays = activeTrip.days.map((day) => {
      if (day.dayNumber === dayNumber) {
        return {
          ...day,
          activities: day.activities.filter((act) => act.id !== activityId),
        };
      }
      return day;
    });

    const updatedTrip: TripPlan = {
      ...activeTrip,
      days: updatedDays,
      updatedAt: new Date().toISOString(),
    };

    setActiveTrip(updatedTrip);
    setActiveTripInStorage(updatedTrip);
    showToast('Activity removed from itinerary.');
  };

  // ADD ACTIVITY HANDLER FROM MODAL
  const handleAddActivity = (dayNumber: number, newActivity: ItineraryActivity) => {
    if (!activeTrip) return;
    const updatedDays = activeTrip.days.map((day) => {
      if (day.dayNumber === dayNumber) {
        return {
          ...day,
          activities: [...day.activities, newActivity],
        };
      }
      return day;
    });

    const updatedTrip: TripPlan = {
      ...activeTrip,
      days: updatedDays,
      updatedAt: new Date().toISOString(),
    };

    setActiveTrip(updatedTrip);
    setActiveTripInStorage(updatedTrip);
    showToast(`Added "${newActivity.title}" to Day ${dayNumber}.`);
  };

  // REORDER ACTIVITIES
  const handleMoveActivity = (dayNumber: number, activityIndex: number, direction: 'up' | 'down') => {
    if (!activeTrip) return;
    const day = activeTrip.days.find((d) => d.dayNumber === dayNumber);
    if (!day) return;

    const newIndex = direction === 'up' ? activityIndex - 1 : activityIndex + 1;
    if (newIndex < 0 || newIndex >= day.activities.length) return;

    const updatedActivities = [...day.activities];
    const [moved] = updatedActivities.splice(activityIndex, 1);
    updatedActivities.splice(newIndex, 0, moved);

    const updatedDays = activeTrip.days.map((d) =>
      d.dayNumber === dayNumber ? { ...d, activities: updatedActivities } : d
    );

    const updatedTrip = { ...activeTrip, days: updatedDays, updatedAt: new Date().toISOString() };
    setActiveTrip(updatedTrip);
    setActiveTripInStorage(updatedTrip);
  };

  // MOVE ACTIVITY TO ANOTHER DAY
  const handleMoveToDay = (currentDayNum: number, activityId: string, targetDayNum: number) => {
    if (!activeTrip || currentDayNum === targetDayNum) return;
    const currentDay = activeTrip.days.find((d) => d.dayNumber === currentDayNum);
    const targetActivity = currentDay?.activities.find((a) => a.id === activityId);
    if (!targetActivity) return;

    const updatedDays = activeTrip.days.map((d) => {
      if (d.dayNumber === currentDayNum) {
        return { ...d, activities: d.activities.filter((a) => a.id !== activityId) };
      }
      if (d.dayNumber === targetDayNum) {
        return { ...d, activities: [...d.activities, targetActivity] };
      }
      return d;
    });

    const updatedTrip = { ...activeTrip, days: updatedDays, updatedAt: new Date().toISOString() };
    setActiveTrip(updatedTrip);
    setActiveTripInStorage(updatedTrip);
    showToast(`Moved activity to Day ${targetDayNum}.`);
  };

  // COPY ITINERARY TO CLIPBOARD
  const handleShareItinerary = () => {
    if (!activeTrip) return;
    const budget = calculateTripBudget(activeTrip);
    const lines = [
      `🏛️ AURIC TRAVELS — BESPOKE ITINERARY`,
      `Destination: ${activeTrip.destinationName} (${activeTrip.country})`,
      `Duration: ${activeTrip.durationDays} Days | Style: ${activeTrip.travelStyle}`,
      `Budget Tier: ${activeTrip.budgetTier} (${currency === 'INR' ? formatINR(budget.grandTotalUSD) : formatUSD(budget.grandTotalUSD)})`,
      `Party: ${activeTrip.partyType} (${activeTrip.numberOfGuests} Guests)`,
      `-----------------------------------------`,
      ...activeTrip.days.flatMap((day) => [
        `\n📅 ${day.title.toUpperCase()}`,
        `Theme: ${day.theme}`,
        ...day.activities.map(
          (act) => ` • [${act.timeLabel}] ${act.title} - ${act.location} (${act.costDisplay})`
        ),
      ]),
      `\n-----------------------------------------`,
      `Total Estimated Budget: ${currency === 'INR' ? formatINR(budget.grandTotalUSD) : formatUSD(budget.grandTotalUSD)}`,
      `Designed with Auric Vista Trip Architect`,
    ];

    navigator.clipboard?.writeText(lines.join('\n'));
    showToast('Complete itinerary copied to clipboard!');
  };

  // PRINT ITINERARY
  const handlePrint = () => {
    window.print();
  };

  // LOAD SAVED TRIP
  const handleLoadSavedTrip = (trip: TripPlan) => {
    setActiveTrip(trip);
    setActiveTripInStorage(trip);
    setActiveTab('mytrip');
    showToast(`Loaded "${trip.destinationName}" itinerary.`);
  };

  // DELETE SAVED TRIP
  const handleDeleteSavedTrip = (tripId: string) => {
    deleteSavedTripFromStorage(tripId);
    setSavedTrips(getSavedTripsFromStorage());
    showToast('Itinerary removed from saved trips.');
  };

  // Calculate current active budget
  const activeBudget = activeTrip ? calculateTripBudget(activeTrip) : null;

  // Destination suggestions
  const popularDestinations = [
    { name: 'Bengaluru', badge: 'Karnataka', tag: 'Garden City' },
    { name: 'Hampi', badge: 'Karnataka', tag: 'UNESCO' },
    { name: 'Coorg (Kodagu)', badge: 'Karnataka', tag: 'Rainforest' },
    { name: 'Kabini & Nagarhole', badge: 'Karnataka', tag: 'Safari' },
    { name: 'Chikmagalur', badge: 'Karnataka', tag: 'Coffee' },
    { name: 'Gokarna', badge: 'Karnataka', tag: 'Coastal' },
    { name: 'Mysore (Mysuru)', badge: 'Karnataka', tag: 'Royal' },
    { name: 'Udaipur', badge: 'Rajasthan', tag: 'Palaces' },
    { name: 'Kerala', badge: 'Kerala', tag: 'Backwaters' },
    { name: 'Ladakh', badge: 'Himalayas', tag: 'High Altitude' },
    { name: 'Amalfi Coast', badge: 'Italy', tag: 'Cliffside' },
    { name: 'Swiss Alps (Zermatt)', badge: 'Switzerland', tag: 'Glacier' },
    { name: 'Kyoto', badge: 'Japan', tag: 'Zen' },
    { name: 'Serengeti', badge: 'Tanzania', tag: 'Wildlife' },
    { name: 'Santorini', badge: 'Greece', tag: 'Caldera' },
    { name: 'Bali (Ubud)', badge: 'Indonesia', tag: 'Jungle' },
  ];

  return (
    <div className="space-y-8">
      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-18 right-6 z-50 px-4 py-3 rounded-2xl bg-[#0F0E0A] border border-[#C5A059] text-[#F3E5AB] text-xs sm:text-sm font-semibold shadow-2xl flex items-center gap-2 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP SUB-NAVIGATION TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#8B6B23] dark:text-[#F3E5AB] text-xs font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>AI-Ready Itinerary Architect</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-neutral-900 dark:text-white tracking-tight">
            Trip Planner & Itinerary Engine
          </h2>
          <p className="text-neutral-600 dark:text-gray-400 text-xs sm:text-sm mt-1">
            Build, customize, budget, and save tailored day-by-day journeys.
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-[#0A0A0A] border border-neutral-200 dark:border-white/10 rounded-2xl self-start sm:self-auto overflow-x-auto max-w-full no-scrollbar">
          <button
            id="tab-plan-new-trip-btn"
            onClick={() => setActiveTab('planner')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'planner'
                ? 'bg-[#C5A059] text-black shadow-md shadow-[#C5A059]/25'
                : 'text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Plan New Trip</span>
          </button>

          <button
            id="tab-my-trip-btn"
            onClick={() => {
              if (activeTrip) setActiveTab('mytrip');
              else showToast('Please generate an itinerary first.');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === 'mytrip'
                ? 'bg-[#C5A059] text-black shadow-md shadow-[#C5A059]/25'
                : 'text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>My Active Trip</span>
            {activeTrip && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          <button
            id="tab-saved-trips-btn"
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === 'saved'
                ? 'bg-[#C5A059] text-black shadow-md shadow-[#C5A059]/25'
                : 'text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved ({savedTrips.length})</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: TRIP PLANNER CONFIGURATION FORM
      ========================================================================== */}
      {activeTab === 'planner' && (
        <motion.div
          key="planner-view"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-8"
        >
          <form
            onSubmit={handleGenerateItinerary}
            className="rounded-3xl p-6 sm:p-10 bg-white dark:bg-[#0A0A0A] border border-neutral-200 dark:border-white/10 space-y-8 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Cinematic Trip Planner Video Showcase Banner */}
            <div className="relative h-48 sm:h-64 lg:h-72 w-full overflow-hidden rounded-3xl border border-neutral-200 dark:border-[#C5A059]/40 bg-black shadow-xl">
              <video
                src="/videos/trip-planner.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80"
                className="w-full h-full object-cover block"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between z-10">
                <div className="space-y-1 max-w-xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/30 backdrop-blur-md border border-[#C5A059]/50 text-[#F3E5AB] text-xs font-mono uppercase font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Intelligent Route Architect</span>
                  </div>
                  <h3 className="text-xl sm:text-3xl font-serif font-bold text-white drop-shadow-md">
                    Craft Your Personalized Multi-Day Journey
                  </h3>
                  <p className="text-gray-200 text-xs sm:text-sm drop-shadow line-clamp-1">
                    Custom-sequenced days, certified naturalist guides & handpicked boutique stays.
                  </p>
                </div>
              </div>
            </div>

            {/* STEP 1: DESTINATION WITH GOOGLE PLACES AUTOCOMPLETE */}
            <div className="space-y-3" ref={dropdownRef}>
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-[#9E7A2E] dark:text-[#C5A059] flex items-center gap-1.5 font-bold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>1. Select Destination (Google Places Powered)</span>
                </label>
                <div className="flex items-center gap-2">
                  {selectedLocation?.coordinates && (
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>GPS Verified ({selectedLocation.coordinates.lat.toFixed(2)}°, {selectedLocation.coordinates.lng.toFixed(2)}°)</span>
                    </span>
                  )}
                  <span className="text-[11px] text-neutral-500 dark:text-gray-500 font-mono hidden sm:inline">Karnataka & Worldwide</span>
                </div>
              </div>

              <div className="relative">
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-neutral-400 dark:text-gray-400 pointer-events-none">
                    <Navigation className="w-4 h-4 text-[#C5A059]" />
                  </span>

                  <input
                    id="planner-destination-input"
                    type="text"
                    required
                    placeholder="Search any destination worldwide (e.g. Hampi, Kyoto, Florence, Amalfi Coast, Serengeti)..."
                    value={destinationInput}
                    onChange={(e) => {
                      setDestinationInput(e.target.value);
                      if (selectedLocation && e.target.value !== selectedLocation.name) {
                        setSelectedLocation(null);
                      }
                    }}
                    onFocus={() => {
                      if (autocompletePredictions.length > 0) {
                        setIsAutocompleteOpen(true);
                      }
                    }}
                    className="w-full pl-11 pr-20 py-3.5 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/15 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 text-sm sm:text-base focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all"
                  />

                  <div className="absolute right-3 flex items-center gap-1.5">
                    {isLoadingPredictions || isFetchingDetails ? (
                      <Loader2 className="w-4 h-4 text-[#C5A059] animate-spin" />
                    ) : destinationInput ? (
                      <button
                        type="button"
                        onClick={() => {
                          setDestinationInput('');
                          setSelectedLocation(null);
                          setAutocompletePredictions([]);
                          setIsAutocompleteOpen(false);
                        }}
                        className="p-1 rounded-lg text-neutral-400 dark:text-gray-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors"
                        title="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    ) : null}
                  </div>
                </div>

                {/* Google Places Autocomplete Dropdown */}
                <AnimatePresence>
                  {isAutocompleteOpen && autocompletePredictions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl bg-white dark:bg-[#0F0F0F] border border-[#C5A059]/40 shadow-2xl overflow-hidden backdrop-blur-xl max-h-80 overflow-y-auto divide-y divide-neutral-100 dark:divide-white/5"
                    >
                      <div className="px-4 py-2 bg-neutral-50 dark:bg-black/60 flex items-center justify-between text-[11px] font-mono text-[#9E7A2E] dark:text-[#C5A059] border-b border-neutral-200 dark:border-white/5">
                        <span className="flex items-center gap-1.5">
                          <Globe className="w-3 h-3" />
                          <span>Google Places Suggestions</span>
                        </span>
                        <span className="text-[10px] text-neutral-500 dark:text-gray-500">Select to scope itinerary</span>
                      </div>

                      {autocompletePredictions.map((pred) => (
                        <button
                          key={pred.placeId}
                          type="button"
                          onClick={() => handleSelectGooglePlace(pred)}
                          className="w-full px-4 py-3 text-left hover:bg-neutral-50 dark:hover:bg-white/10 transition-colors flex items-center gap-3 group"
                        >
                          <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 flex items-center justify-center text-neutral-500 dark:text-gray-400 group-hover:text-[#C5A059] group-hover:border-[#C5A059]/40 transition-colors shrink-0">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-neutral-900 dark:text-white group-hover:text-[#C5A059] transition-colors truncate">
                              {pred.mainText}
                            </div>
                            <div className="text-xs text-neutral-500 dark:text-gray-400 truncate">
                              {pred.secondaryText || pred.description}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-neutral-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 text-[#C5A059]" />
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Autocomplete Error banner if any */}
                {autocompleteError && (
                  <div className="mt-2 text-xs text-amber-800 dark:text-amber-300/80 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-xl p-2.5 flex items-center gap-2 font-mono">
                    <AlertCircle className="w-4 h-4 shrink-0 text-[#C5A059]" />
                    <span>{autocompleteError}</span>
                  </div>
                )}
              </div>

              {/* Active Selected Location Confirmation Card */}
              {selectedLocation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="rounded-2xl bg-[#C5A059]/5 dark:bg-white/[0.03] border border-[#C5A059]/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900 dark:text-white text-sm">{selectedLocation.name}</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#C5A059]/20 text-[#8B6B23] dark:text-[#F3E5AB] font-mono text-[10px]">
                          {selectedLocation.country || 'Worldwide'}
                        </span>
                      </div>
                      <p className="text-neutral-500 dark:text-gray-400 text-[11px] truncate max-w-md mt-0.5">
                        {selectedLocation.formattedAddress || `${selectedLocation.city || selectedLocation.name}, ${selectedLocation.country}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-500 dark:text-gray-400 self-end sm:self-center">
                    {selectedLocation.coordinates && (
                      <span className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-black/60 border border-neutral-200 dark:border-white/5 text-[#8B6B23] dark:text-[#F3E5AB]">
                        Lat: {selectedLocation.coordinates.lat.toFixed(4)}° / Lng: {selectedLocation.coordinates.lng.toFixed(4)}°
                      </span>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Quick Pick Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1">
                <span className="text-[11px] font-mono text-neutral-500 dark:text-gray-500 shrink-0">Curated:</span>
                {popularDestinations.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => {
                      setDestinationInput(p.name);
                      // Find matched destination in mockData if available
                      const matched = DESTINATIONS.find(
                        (d) => d.name.toLowerCase() === p.name.toLowerCase()
                      );
                      if (matched && matched.coordinates) {
                        const loc: SelectedPlaceLocation = {
                          name: matched.name,
                          city: matched.city || matched.name,
                          state: matched.state,
                          country: matched.country,
                          region: matched.region,
                          coordinates: matched.coordinates,
                          formattedAddress: matched.formattedAddress || `${matched.name}, ${matched.country}`,
                          placeId: matched.googlePlaceId,
                          image: matched.image,
                        };
                        setSelectedLocation(loc);
                        storeSelectedTripLocation(loc);
                      } else {
                        setSelectedLocation(null);
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-mono transition-all shrink-0 flex items-center gap-1.5 ${
                      destinationInput.toLowerCase().includes(p.name.toLowerCase())
                        ? 'bg-[#C5A059] text-black font-bold'
                        : 'bg-neutral-100 dark:bg-white/5 text-neutral-700 dark:text-gray-300 hover:bg-neutral-200 dark:hover:bg-white/10 border border-neutral-200 dark:border-white/5'
                    }`}
                  >
                    <span>{p.name}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full ${
                        p.badge === 'Karnataka'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40'
                          : 'bg-neutral-200 dark:bg-white/10 text-neutral-600 dark:text-gray-400'
                      }`}
                    >
                      {p.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 2: DURATION & GUESTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Number of Days */}
              <div className="space-y-3 p-5 rounded-2xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#9E7A2E] dark:text-[#C5A059] flex items-center gap-1.5 font-semibold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>2. Duration (Days)</span>
                  </label>
                  <span className="text-sm font-bold font-mono text-neutral-900 dark:text-white">
                    {durationDays} {durationDays === 1 ? 'Day' : 'Days'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setDurationDays((prev) => Math.max(1, prev - 1))}
                    className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-neutral-300 dark:border-white/10 text-neutral-900 dark:text-white font-bold hover:bg-neutral-100 dark:hover:bg-white/10 flex items-center justify-center transition-colors shadow-sm"
                  >
                    -
                  </button>

                  <input
                    type="range"
                    min={1}
                    max={14}
                    value={durationDays}
                    onChange={(e) => setDurationDays(parseInt(e.target.value))}
                    className="flex-1 accent-[#C5A059] cursor-pointer"
                  />

                  <button
                    type="button"
                    onClick={() => setDurationDays((prev) => Math.min(14, prev + 1))}
                    className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-neutral-300 dark:border-white/10 text-neutral-900 dark:text-white font-bold hover:bg-neutral-100 dark:hover:bg-white/10 flex items-center justify-center transition-colors shadow-sm"
                  >
                    +
                  </button>
                </div>

                {/* Duration presets */}
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {[
                    { days: 3, label: '3D Weekend' },
                    { days: 5, label: '5D Sanctuary' },
                    { days: 7, label: '7D Grand' },
                    { days: 10, label: '10D Odyssey' },
                  ].map((preset) => (
                    <button
                      key={preset.days}
                      type="button"
                      onClick={() => setDurationDays(preset.days)}
                      className={`py-1.5 rounded-lg text-[11px] font-mono transition-all text-center ${
                        durationDays === preset.days
                          ? 'bg-[#C5A059]/20 text-[#8B6B23] dark:text-[#F3E5AB] border border-[#C5A059]/50 font-bold'
                          : 'bg-white dark:bg-white/5 text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-transparent'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Party & Travelers */}
              <div className="space-y-3 p-5 rounded-2xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#9E7A2E] dark:text-[#C5A059] flex items-center gap-1.5 font-semibold">
                    <Users className="w-3.5 h-3.5" />
                    <span>Travel Party</span>
                  </label>
                  <span className="text-xs font-mono text-neutral-500 dark:text-gray-400">
                    {numberOfGuests} {numberOfGuests === 1 ? 'Guest' : 'Guests'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { type: 'Solo Voyager' as const, count: 1, label: 'Solo Voyager' },
                    { type: 'Romantic Couple' as const, count: 2, label: 'Romantic Couple' },
                    { type: 'Family & Kin' as const, count: 4, label: 'Family & Kin' },
                    { type: 'Private Circle' as const, count: 6, label: 'Private Circle' },
                  ].map((p) => (
                    <button
                      key={p.type}
                      type="button"
                      onClick={() => {
                        setPartyType(p.type);
                        setNumberOfGuests(p.count);
                      }}
                      className={`p-2.5 rounded-xl text-xs font-mono text-left transition-all border ${
                        partyType === p.type
                          ? 'bg-[#C5A059]/20 border-[#C5A059] text-neutral-900 dark:text-white font-bold'
                          : 'bg-white dark:bg-white/5 border-neutral-200 dark:border-white/5 text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="font-semibold">{p.label}</div>
                      <div className="text-[10px] text-neutral-400 dark:text-gray-500">{p.count} Guests</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* STEP 3: BUDGET TIER */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-[#9E7A2E] dark:text-[#C5A059] flex items-center gap-1.5 font-semibold">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>3. Budget & Hospitality Tier</span>
                </label>
                <span className="text-[11px] text-neutral-500 dark:text-gray-400 font-mono">Calibrated daily benchmark</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {(
                  [
                    'Ultra-Luxury Bespoke',
                    'Signature Luxury',
                    'Premium Boutique',
                    'Curated Explorer',
                  ] as const
                ).map((tier) => {
                  const cfg = BUDGET_TIER_CONFIG[tier];
                  const isSelected = budgetTier === tier;
                  return (
                    <div
                      key={tier}
                      onClick={() => setBudgetTier(tier)}
                      className={`p-4 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? 'bg-gradient-to-b from-[#C5A059]/10 to-transparent dark:from-[#18140B] dark:to-[#0A0A0A] border-[#C5A059] shadow-lg shadow-[#C5A059]/10'
                          : 'bg-neutral-50 dark:bg-[#050505] border-neutral-200 dark:border-white/5 hover:border-neutral-300 dark:hover:border-white/20'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              isSelected
                                ? 'bg-[#C5A059] text-black'
                                : 'bg-neutral-200 dark:bg-white/10 text-neutral-700 dark:text-gray-400'
                            }`}
                          >
                            {cfg.badge}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-[#C5A059]" />}
                        </div>
                        <h4 className="font-serif font-bold text-sm text-neutral-900 dark:text-white">{cfg.label}</h4>
                        <p className="text-[11px] text-neutral-500 dark:text-gray-400 mt-1 leading-snug">
                          {cfg.hotelTier}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-neutral-200 dark:border-white/5">
                        <span className="text-xs font-mono font-bold text-[#8B6B23] dark:text-[#F3E5AB]">
                          {formatBilingualPrice(cfg.dailyBaseUSD)} / day
                        </span>
                        <span className="text-[10px] text-neutral-400 dark:text-gray-500 block font-mono">
                          {cfg.transitType.split('&')[0]}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 4: TRAVEL STYLE */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase tracking-wider text-[#9E7A2E] dark:text-[#C5A059] flex items-center gap-1.5 font-semibold">
                <Compass className="w-3.5 h-3.5" />
                <span>4. Travel Style & Rhythm</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {[
                  {
                    style: 'Relaxed & Unhurried' as const,
                    desc: 'Slow mornings, 1-2 curated highlights & leisurely verandas.',
                  },
                  {
                    style: 'Balanced Luxury' as const,
                    desc: 'Golden mean between active discovery & gourmet dining.',
                  },
                  {
                    style: 'High-Energy Explorer' as const,
                    desc: 'Early dawn treks, multiple monuments & full days.',
                  },
                  {
                    style: 'Deep Cultural Immersion' as const,
                    desc: 'Historian guides, ancient temples & local artisans.',
                  },
                  {
                    style: 'Romantic Sanctuary' as const,
                    desc: 'Scenic sundowners, couple spa & private candlelit dinners.',
                  },
                ].map((item) => (
                  <button
                    key={item.style}
                    type="button"
                    onClick={() => setTravelStyle(item.style)}
                    className={`p-3.5 rounded-2xl text-left transition-all border flex flex-col justify-between ${
                      travelStyle === item.style
                        ? 'bg-[#C5A059]/20 border-[#C5A059] text-neutral-900 dark:text-white shadow-md'
                        : 'bg-neutral-50 dark:bg-[#050505] border-neutral-200 dark:border-white/5 text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-xs text-neutral-900 dark:text-white mb-1">{item.style}</div>
                    <p className="text-[10px] text-neutral-500 dark:text-gray-400 leading-snug">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 5: TRAVEL INTERESTS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-[#9E7A2E] dark:text-[#C5A059] flex items-center gap-1.5 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>5. Travel Interests & Pursuits</span>
                </label>
                <span className="text-[11px] text-neutral-500 dark:text-gray-400 font-mono">
                  {travelInterests.length} Selected
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {interestOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = travelInterests.includes(opt.name);
                  return (
                    <button
                      key={opt.name}
                      type="button"
                      onClick={() => toggleInterest(opt.name)}
                      className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all border text-left ${
                        isSelected
                          ? 'bg-[#C5A059]/20 border-[#C5A059] text-[#8B6B23] dark:text-[#F3E5AB]'
                          : 'bg-neutral-50 dark:bg-[#050505] border-neutral-200 dark:border-white/5 text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#C5A059]' : 'text-neutral-400 dark:text-gray-500'}`}
                      />
                      <span className="leading-tight text-xs">{opt.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* OPTIONAL NOTES */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-gray-400">
                Special Requests & Notes (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Vegetarian royal cuisine, anniversary celebration, private archaeologist guide preferred..."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-200 dark:border-white/10">
              <div className="text-xs text-neutral-600 dark:text-gray-400">
                <span>Tailored for: </span>
                <span className="text-neutral-900 dark:text-white font-semibold">{destinationInput}</span> •{' '}
                <span className="text-neutral-900 dark:text-white font-semibold">{durationDays} Days</span> •{' '}
                <span className="text-[#9E7A2E] dark:text-[#C5A059] font-semibold">{budgetTier}</span>
              </div>

              <button
                id="generate-itinerary-submit-btn"
                type="submit"
                disabled={isGenerating}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#C5A059] to-[#F3E5AB] hover:from-[#d4b068] hover:to-[#fff2cc] text-black font-bold uppercase tracking-wider text-xs sm:text-sm transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-[#C5A059]/25 hover:scale-[1.02] disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin" />
                    <span>Architecting Sanctuary Itinerary...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Day-by-Day Itinerary</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* =========================================================================
          VIEW 2: "MY TRIP" ITINERARY VIEW (ACTIVE TRIP)
      ========================================================================== */}
      {activeTab === 'mytrip' && activeTrip && (
        <motion.div
          key="mytrip-view"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-8"
        >
          {/* TRIP HERO BANNER */}
          <div className="relative rounded-3xl overflow-hidden border border-neutral-200 dark:border-white/15 min-h-[340px] sm:min-h-[400px] flex flex-col justify-end p-6 sm:p-10 shadow-2xl bg-black">
            {/* Cinematic Trip Planner Video Background */}
            <video
              src="/videos/trip-planner.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={activeTrip.heroImage}
              className="absolute inset-0 w-full h-full object-cover block z-0"
            />
            {/* Subtle Gradient Overlays for High-Contrast Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/30 pointer-events-none z-0" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent pointer-events-none z-0" />

            <div className="relative z-10 space-y-4 max-w-4xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#C5A059] text-black text-xs font-mono font-bold tracking-wider uppercase">
                  {activeTrip.destinationName}
                </span>
                {activeTrip.country && (
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[#F3E5AB] text-xs font-mono">
                    {activeTrip.country}
                  </span>
                )}
                {activeTrip.coordinates && (
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>GPS {activeTrip.coordinates.lat.toFixed(2)}°, {activeTrip.coordinates.lng.toFixed(2)}°</span>
                  </span>
                )}
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-mono">
                  {activeTrip.durationDays} Days Journey
                </span>
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[#F3E5AB] text-xs font-mono">
                  {activeTrip.budgetTier}
                </span>
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-gray-300 text-xs font-mono">
                  {activeTrip.partyType} ({activeTrip.numberOfGuests} Guests)
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
                {activeTrip.title}
              </h1>

              {activeTrip.formattedAddress && (
                <div className="flex items-center gap-1.5 text-xs text-gray-300 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                  <span>{activeTrip.formattedAddress}</span>
                </div>
              )}

              <p className="text-gray-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Paced for {activeTrip.travelStyle} with curated focus on{' '}
                {activeTrip.travelInterests.join(', ')}.
              </p>

              {activeTrip.hasNoNearbyCommercialPlaces && (
                <div className="rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/30 p-3.5 text-xs text-[#F3E5AB] flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>
                    <strong>Private Bespoke Schedule:</strong> Strict geographical isolation applied for {activeTrip.destinationName}. Activities are scoped entirely to the selected sanctuary and its immediate wilderness perimeter.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ACTION TOOLBAR & TOTAL BUDGET WIDGET */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Real-time Budget Card */}
            <div className="lg:col-span-2 rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-[#C5A059]/30 relative overflow-hidden shadow-xl flex flex-col justify-between space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#9E7A2E] dark:text-[#C5A059] font-bold">
                      Estimated Total Budget
                    </span>
                    <button
                      onClick={() => setIsBudgetDetailsOpen(!isBudgetDetailsOpen)}
                      className="text-[11px] text-neutral-500 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1 font-mono underline"
                    >
                      {isBudgetDetailsOpen ? 'Hide Breakdown' : 'View Breakdown'}
                      {isBudgetDetailsOpen ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 dark:text-white tracking-tight">
                      {currency === 'INR'
                        ? formatINR(activeBudget?.grandTotalUSD || 0)
                        : formatUSD(activeBudget?.grandTotalUSD || 0)}
                    </span>
                    <span className="text-xs sm:text-sm font-mono text-neutral-500 dark:text-gray-400">
                      ({currency === 'INR'
                        ? formatINR(activeBudget?.perPersonUSD || 0)
                        : formatUSD(activeBudget?.perPersonUSD || 0)}{' '}
                      / guest)
                    </span>
                  </div>
                </div>

                {/* Currency Toggle */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 self-start sm:self-auto font-mono text-xs">
                  <button
                    onClick={() => setCurrency('INR')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      currency === 'INR'
                        ? 'bg-[#C5A059] text-black shadow-sm'
                        : 'text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    INR (₹)
                  </button>
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      currency === 'USD'
                        ? 'bg-[#C5A059] text-black shadow-sm'
                        : 'text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    USD ($)
                  </button>
                </div>
              </div>

              {/* Dynamic Budget Breakdown Drawer */}
              <AnimatePresence>
                {isBudgetDetailsOpen && activeBudget && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-4 border-t border-neutral-200 dark:border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono"
                  >
                    <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/5">
                      <div className="text-neutral-600 dark:text-gray-400 flex items-center gap-1">
                        <BedDouble className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Accommodation</span>
                      </div>
                      <div className="text-neutral-900 dark:text-white font-bold text-sm mt-1">
                        {currency === 'INR'
                          ? formatINR(activeBudget.accommodationUSD)
                          : formatUSD(activeBudget.accommodationUSD)}
                      </div>
                      <div className="text-[10px] text-neutral-500 dark:text-gray-500">
                        {activeTrip.durationDays} nights luxury
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/5">
                      <div className="text-neutral-600 dark:text-gray-400 flex items-center gap-1">
                        <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Experiences</span>
                      </div>
                      <div className="text-neutral-900 dark:text-white font-bold text-sm mt-1">
                        {currency === 'INR'
                          ? formatINR(activeBudget.activitiesUSD)
                          : formatUSD(activeBudget.activitiesUSD)}
                      </div>
                      <div className="text-[10px] text-neutral-500 dark:text-gray-500">
                        {activeTrip.days.reduce((acc, d) => acc + d.activities.length, 0)} pursuits
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/5">
                      <div className="text-neutral-600 dark:text-gray-400 flex items-center gap-1">
                        <Utensils className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span>Gastronomy</span>
                      </div>
                      <div className="text-neutral-900 dark:text-white font-bold text-sm mt-1">
                        {currency === 'INR'
                          ? formatINR(activeBudget.diningUSD)
                          : formatUSD(activeBudget.diningUSD)}
                      </div>
                      <div className="text-[10px] text-neutral-500 dark:text-gray-500">Chef tables & wines</div>
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/5">
                      <div className="text-neutral-600 dark:text-gray-400 flex items-center gap-1">
                        <Car className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                        <span>Transit & Permits</span>
                      </div>
                      <div className="text-neutral-900 dark:text-white font-bold text-sm mt-1">
                        {currency === 'INR'
                          ? formatINR(activeBudget.transitUSD + activeBudget.conciergeFeeUSD)
                          : formatUSD(activeBudget.transitUSD + activeBudget.conciergeFeeUSD)}
                      </div>
                      <div className="text-[10px] text-neutral-500 dark:text-gray-500">Private chauffeur</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Actions Panel */}
            <div className="rounded-3xl p-6 bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 flex flex-col justify-between space-y-4 shadow-xl">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-gray-400 font-semibold">
                Itinerary Management
              </span>

              <div className="space-y-2">
                {onBookStay && (
                  <button
                    id="book-stay-itinerary-action-btn"
                    onClick={() => onBookStay(activeTrip.destination)}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#F3E5AB] text-black font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-md shadow-[#C5A059]/20 hover:scale-102 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Book Stays for {activeTrip.destination}</span>
                  </button>
                )}

                <div className="grid grid-cols-2 gap-2.5">
                  {/* Save Itinerary Button */}
                  <button
                    id="save-active-itinerary-btn"
                    onClick={handleSaveActiveTrip}
                    className={`p-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 border ${
                      isSavedToast
                        ? 'bg-emerald-500 text-black border-emerald-400'
                        : 'bg-neutral-100 dark:bg-white/10 hover:bg-neutral-200 dark:hover:bg-white/20 text-neutral-800 dark:text-white border-neutral-200 dark:border-white/10'
                    }`}
                  >
                    <BookmarkCheck className="w-3.5 h-3.5" />
                    <span>{isSavedToast ? 'Saved!' : 'Save Trip'}</span>
                  </button>

                  {/* Add Activity global button */}
                  <button
                    id="open-add-activity-modal-btn"
                    onClick={() => {
                      setTargetDayForAdd(1);
                      setIsAddActivityOpen(true);
                    }}
                    className="p-2.5 rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-800 dark:text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Add Activity</span>
                  </button>

                  {/* Copy Text Summary */}
                  <button
                    id="copy-share-itinerary-btn"
                    onClick={handleShareItinerary}
                    className="p-2.5 rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-700 dark:text-gray-300 hover:text-neutral-900 dark:hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Copy</span>
                  </button>

                  {/* Print / PDF */}
                  <button
                    id="print-itinerary-btn"
                    onClick={handlePrint}
                    className="p-2.5 rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-700 dark:text-gray-300 hover:text-neutral-900 dark:hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              {/* Redesign Trip Button */}
              <button
                onClick={() => setActiveTab('planner')}
                className="w-full py-2.5 rounded-xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/5 hover:border-neutral-300 dark:hover:border-white/20 text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Adjust Parameters & Re-Architect</span>
              </button>
            </div>
          </div>

          {/* DAY FILTER TABS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-200 dark:border-white/10">
            <span className="text-xs font-mono text-neutral-500 dark:text-gray-400 shrink-0 mr-2">Timeline:</span>
            <button
              onClick={() => setSelectedDayFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all shrink-0 ${
                selectedDayFilter === 'all'
                  ? 'bg-[#C5A059] text-black shadow-sm'
                  : 'bg-neutral-100 dark:bg-[#0D0D0D] text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-white/5'
              }`}
            >
              All Days ({activeTrip.durationDays})
            </button>

            {activeTrip.days.map((d) => (
              <button
                key={d.dayNumber}
                onClick={() => setSelectedDayFilter(d.dayNumber)}
                className={`px-4 py-2 rounded-xl text-xs font-mono transition-all shrink-0 flex items-center gap-1.5 ${
                  selectedDayFilter === d.dayNumber
                    ? 'bg-[#C5A059] text-black font-bold shadow-sm'
                    : 'bg-neutral-100 dark:bg-[#0D0D0D] text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-white/5'
                }`}
              >
                <span>Day {d.dayNumber}</span>
                <span className="text-[10px] opacity-70">({d.activities.length})</span>
              </button>
            ))}
          </div>

          {/* DAY-BY-DAY ITINERARY TIMELINE */}
          <div className="space-y-8">
            {activeTrip.days
              .filter((d) => selectedDayFilter === 'all' || d.dayNumber === selectedDayFilter)
              .map((day) => {
                const dayActivitiesCostUSD = day.activities.reduce(
                  (acc, curr) => acc + (curr.estimatedCost || 50),
                  0
                );

                return (
                  <div
                    key={day.dayNumber}
                    className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#0A0A0A] border border-neutral-200 dark:border-white/10 space-y-6 shadow-xl relative"
                  >
                    {/* Day Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-white/10 pb-5">
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#8B6B23] dark:text-[#C5A059] flex items-center justify-center font-serif text-xl font-bold shrink-0">
                          {day.dayNumber}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono text-[#8B6B23] dark:text-[#C5A059] uppercase tracking-wider font-semibold">
                              Day {day.dayNumber} of {activeTrip.durationDays}
                            </span>
                            <span className="text-neutral-300 dark:text-gray-600">•</span>
                            <span className="text-[11px] font-mono text-neutral-500 dark:text-gray-400">
                              {day.activities.length} Pursuits Planned
                            </span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900 dark:text-white">
                            {day.title}
                          </h3>
                          <p className="text-xs text-neutral-500 dark:text-gray-400 mt-0.5">{day.theme}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                          <span className="text-[10px] font-mono text-neutral-400 dark:text-gray-500 uppercase block">
                            Day Est. Cost
                          </span>
                          <span className="text-xs font-mono font-bold text-[#8B6B23] dark:text-[#F3E5AB]">
                            {currency === 'INR'
                              ? formatINR(dayActivitiesCostUSD)
                              : formatUSD(dayActivitiesCostUSD)}
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            setTargetDayForAdd(day.dayNumber);
                            setIsAddActivityOpen(true);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-white/5 hover:bg-[#C5A059] hover:text-black border border-neutral-200 dark:border-white/10 text-neutral-800 dark:text-white text-xs font-mono font-semibold transition-all flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Day {day.dayNumber}</span>
                        </button>
                      </div>
                    </div>

                    {/* Activities List */}
                    {day.activities.length === 0 ? (
                      <div className="p-8 rounded-2xl bg-neutral-50 dark:bg-[#050505] border border-dashed border-neutral-200 dark:border-white/10 text-center space-y-3">
                        <Compass className="w-8 h-8 text-neutral-400 dark:text-gray-600 mx-auto" />
                        <p className="text-sm text-neutral-500 dark:text-gray-400">No activities scheduled for this day.</p>
                        <button
                          onClick={() => {
                            setTargetDayForAdd(day.dayNumber);
                            setIsAddActivityOpen(true);
                          }}
                          className="px-4 py-2 rounded-xl bg-[#C5A059] text-black text-xs font-bold uppercase tracking-wider"
                        >
                          Add an Experience or Attraction
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {day.activities.map((act, actIdx) => {
                          const timeSlotBadge =
                            act.timeSlot === 'morning'
                              ? { label: 'Morning', color: 'text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-400/10' }
                              : act.timeSlot === 'afternoon'
                              ? { label: 'Afternoon', color: 'text-orange-700 dark:text-orange-400 bg-orange-100 dark:bg-orange-400/10' }
                              : act.timeSlot === 'evening'
                              ? { label: 'Evening', color: 'text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-400/10' }
                              : { label: 'Night', color: 'text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-400/10' };

                          return (
                            <div
                              key={act.id}
                              className="group p-4 sm:p-5 rounded-2xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/10 hover:border-[#C5A059]/40 transition-all flex flex-col md:flex-row gap-4 items-start justify-between"
                            >
                              {/* Left: Thumbnail & Core Details */}
                              <div className="flex flex-col sm:flex-row gap-4 items-start flex-1">
                                {act.image ? (
                                  <SafeImage
                                    src={act.image}
                                    alt={act.title}
                                    categoryHint={act.category || act.location || activeTrip.destinationName}
                                    className="w-full sm:w-28 h-32 sm:h-28 rounded-xl object-cover shrink-0 border border-neutral-200 dark:border-white/10 group-hover:scale-[1.02] transition-transform"
                                  />
                                ) : (
                                  <div className="w-full sm:w-28 h-24 rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 flex items-center justify-center text-neutral-400 dark:text-gray-600 shrink-0">
                                    <Sparkles className="w-6 h-6 text-[#C5A059]" />
                                  </div>
                                )}

                                <div className="space-y-1.5 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span
                                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${timeSlotBadge.color}`}
                                    >
                                      {timeSlotBadge.label}
                                    </span>
                                    <span className="text-[11px] font-mono text-neutral-700 dark:text-gray-300 flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-neutral-400 dark:text-gray-400" />
                                      {act.timeLabel}
                                    </span>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-200 dark:bg-white/5 text-neutral-600 dark:text-gray-400">
                                      {act.category}
                                    </span>
                                    <span className="text-[10px] font-mono text-[#8B6B23] dark:text-[#C5A059] bg-[#C5A059]/10 px-2 py-0.5 rounded font-semibold">
                                      {act.sourceType === 'experience'
                                        ? 'Curated Experience'
                                        : act.sourceType === 'attraction'
                                        ? 'Top Monument'
                                        : act.sourceType === 'custom'
                                        ? 'Custom Pursuit'
                                        : 'AI Curated'}
                                    </span>
                                  </div>

                                  <h4 className="font-serif font-bold text-base sm:text-lg text-neutral-900 dark:text-white group-hover:text-[#8B6B23] dark:group-hover:text-[#F3E5AB] transition-colors">
                                    {act.title}
                                  </h4>

                                  <p className="text-xs text-neutral-600 dark:text-gray-400 leading-relaxed max-w-2xl">
                                    {act.description}
                                  </p>

                                  <div className="flex items-center gap-3 pt-1 text-[11px] text-neutral-600 dark:text-gray-400 flex-wrap">
                                    <span className="flex items-center gap-1 text-neutral-700 dark:text-gray-300">
                                      <MapPin className="w-3 h-3 text-[#C5A059]" />
                                      {act.location}
                                    </span>
                                    {act.duration && (
                                      <span className="flex items-center gap-1 text-neutral-500 dark:text-gray-400">
                                        <Clock className="w-3 h-3" />
                                        {act.duration}
                                      </span>
                                    )}
                                    <span className="font-mono font-bold text-[#8B6B23] dark:text-[#F3E5AB]">
                                      Est: {currency === 'INR' ? formatINR(act.estimatedCost) : formatUSD(act.estimatedCost)}
                                    </span>
                                  </div>

                                  {/* Transit / Logistics Note */}
                                  {act.notes && (
                                    <div className="text-[11px] font-mono text-[#8B6B23] dark:text-[#F3E5AB] bg-[#C5A059]/10 px-2.5 py-1 rounded-lg border border-[#C5A059]/20 inline-flex items-center gap-1.5 mt-1">
                                      <span>{act.notes}</span>
                                    </div>
                                  )}

                                  {/* Inclusions Chips */}
                                  {act.included && act.included.length > 0 && (
                                    <div className="flex items-center gap-1.5 flex-wrap pt-1.5">
                                      {act.included.slice(0, 3).map((inc, i) => (
                                        <span
                                          key={i}
                                          className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-200/60 dark:bg-white/5 text-neutral-600 dark:text-gray-400 border border-neutral-200 dark:border-white/5 flex items-center gap-1"
                                        >
                                          <Check className="w-2.5 h-2.5 text-emerald-500 dark:text-emerald-400" />
                                          <span>{inc}</span>
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Right: Activity Controls */}
                              <div className="flex md:flex-col items-center justify-end gap-1.5 shrink-0 self-end md:self-center border-t md:border-t-0 md:border-l border-neutral-200 dark:border-white/10 pt-3 md:pt-0 md:pl-4 w-full md:w-auto">
                                <div className="flex items-center gap-1">
                                  {/* Move Up */}
                                  <button
                                    onClick={() => handleMoveActivity(day.dayNumber, actIdx, 'up')}
                                    disabled={actIdx === 0}
                                    className="p-1.5 rounded-lg bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                                    title="Move Earlier"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Move Down */}
                                  <button
                                    onClick={() => handleMoveActivity(day.dayNumber, actIdx, 'down')}
                                    disabled={actIdx === day.activities.length - 1}
                                    className="p-1.5 rounded-lg bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                                    title="Move Later"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                {/* Move to another Day selector */}
                                {activeTrip.durationDays > 1 && (
                                  <select
                                    value={day.dayNumber}
                                    onChange={(e) =>
                                      handleMoveToDay(
                                        day.dayNumber,
                                        act.id,
                                        parseInt(e.target.value)
                                      )
                                    }
                                    className="text-[10px] font-mono bg-white dark:bg-[#111] border border-neutral-300 dark:border-white/10 rounded-lg px-2 py-1 text-neutral-700 dark:text-gray-300 focus:outline-none focus:border-[#C5A059]"
                                    title="Transfer to another Day"
                                  >
                                    {activeTrip.days.map((d) => (
                                      <option key={d.dayNumber} value={d.dayNumber}>
                                        Day {d.dayNumber}
                                      </option>
                                    ))}
                                  </select>
                                )}

                                {/* Remove Activity */}
                                <button
                                  onClick={() => handleRemoveActivity(day.dayNumber, act.id)}
                                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors"
                                  title="Remove Activity"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Day Transit & Logistics Summary */}
                    {day.dayNotes && (
                      <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/5 flex items-start gap-2.5 text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                        <Compass className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <span className="text-[10px] uppercase tracking-wider text-[#9E7A2E] dark:text-[#C5A059] font-bold block">
                            Logistics & Transit Architecture
                          </span>
                          <span className="text-neutral-700 dark:text-gray-300 leading-relaxed">{day.dayNotes}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </motion.div>
      )}

      {/* =========================================================================
          VIEW 3: SAVED TRIPS ARCHIVE (VAULT)
      ========================================================================== */}
      {activeTab === 'saved' && (
        <motion.div
          key="saved-view"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900 dark:text-white">
                Saved Itinerary Vault ({savedTrips.length})
              </h3>
              <p className="text-xs text-neutral-600 dark:text-gray-400 mt-1">
                Access, load, or print all previously architected trips.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('planner')}
              className="px-4 py-2 rounded-xl bg-[#C5A059] text-black text-xs font-bold uppercase tracking-wider"
            >
              Plan New Trip
            </button>
          </div>

          {savedTrips.length === 0 ? (
            <div className="rounded-3xl p-12 bg-white dark:bg-[#0A0A0A] border border-dashed border-neutral-200 dark:border-white/10 text-center space-y-4 shadow-xl">
              <Bookmark className="w-10 h-10 text-neutral-400 dark:text-gray-600 mx-auto" />
              <h4 className="text-lg font-serif font-bold text-neutral-900 dark:text-white">No Saved Itineraries Yet</h4>
              <p className="text-xs text-neutral-600 dark:text-gray-400 max-w-md mx-auto">
                Generate a custom trip in the Trip Planner and click "Save Trip" to store your day-by-day plans here.
              </p>
              <button
                onClick={() => setActiveTab('planner')}
                className="px-6 py-3 rounded-2xl bg-[#C5A059] text-black text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#C5A059]/20"
              >
                Launch Trip Planner
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedTrips.map((trip) => {
                const tripBudget = calculateTripBudget(trip);
                const isCurrentActive = activeTrip?.id === trip.id;

                return (
                  <div
                    key={trip.id}
                    className="rounded-3xl bg-white dark:bg-[#0A0A0A] border border-neutral-200 dark:border-white/10 hover:border-[#C5A059]/50 overflow-hidden transition-all flex flex-col justify-between group shadow-xl"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <SafeImage
                        src={trip.heroImage}
                        alt={trip.destinationName}
                        categoryHint={trip.destinationName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-[#F3E5AB] border border-white/10">
                        {trip.destinationName}
                      </span>
                      {isCurrentActive && (
                        <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-emerald-500 text-black text-[10px] font-mono font-bold">
                          Active
                        </span>
                      )}
                      <span className="absolute bottom-3 right-3 text-xs font-mono font-bold text-white bg-black/70 px-2 py-0.5 rounded">
                        {currency === 'INR'
                          ? formatINR(tripBudget.grandTotalUSD)
                          : formatUSD(tripBudget.grandTotalUSD)}
                      </span>
                    </div>

                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500 dark:text-gray-400">
                          <span>{trip.durationDays} Days</span> • <span>{trip.travelStyle}</span>
                        </div>
                        <h4 className="font-serif font-bold text-lg text-neutral-900 dark:text-white group-hover:text-[#8B6B23] dark:group-hover:text-[#F3E5AB] transition-colors mt-1">
                          {trip.title}
                        </h4>
                        <p className="text-xs text-neutral-600 dark:text-gray-400 line-clamp-2 mt-1">
                          {trip.travelInterests.join(' • ')}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-neutral-200 dark:border-white/5 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleLoadSavedTrip(trip)}
                          className="flex-1 py-2 rounded-xl bg-[#C5A059] hover:bg-[#F3E5AB] text-black text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Load Trip</span>
                        </button>

                        <button
                          onClick={() => handleDeleteSavedTrip(trip.id)}
                          className="p-2 rounded-xl bg-neutral-100 dark:bg-white/5 hover:bg-rose-500/20 text-neutral-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                          title="Delete Saved Trip"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {/* ADD ACTIVITY MODAL */}
      <AddActivityModal
        isOpen={isAddActivityOpen}
        onClose={() => setIsAddActivityOpen(false)}
        targetDayNumber={targetDayForAdd}
        destinationName={activeTrip?.destinationName}
        onAddActivity={handleAddActivity}
      />
    </div>
  );
};
