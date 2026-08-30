import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Mountain,
  Palmtree,
  Landmark,
  Trees,
  Star,
  ArrowRight,
  Heart,
  Search,
  MapPin,
  SlidersHorizontal,
  X,
  Sparkles,
  Loader2,
  Navigation,
  Globe,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Destination, SelectedPlaceLocation } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { DestinationDetailView } from './DestinationDetailView';
import { SafeImage } from './SafeImage';
import {
  searchPlaces,
  fetchPlaceAutocomplete,
  fetchPlaceDetails,
  fetchNearbyAttractions,
  AutocompletePrediction,
} from '../services/placesService';
import { fetchDestinations } from '../services/destinationsApi';
import { storeSelectedTripLocation } from '../utils/tripGenerator';

interface DestinationsSectionProps {
  destinations?: Destination[];
  onSelectDestination: (destination: Destination) => void;
  savedIds?: string[];
  onToggleSave?: (destId: string) => void;
  searchFilter?: string;
  onClearFilter?: () => void;
  onAddToTrip?: (destName: string) => void;
  onOpenGlobalMap?: () => void;
  onBookStay?: (destinationNameOrStay: string | any) => void;
}

export const DestinationsSection: React.FC<DestinationsSectionProps> = ({
  destinations = [],
  onSelectDestination,
  savedIds = [],
  onToggleSave = (_destId: string) => {},
  searchFilter = '',
  onClearFilter,
  onAddToTrip,
  onOpenGlobalMap,
  onBookStay,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [localSearch, setLocalSearch] = useState<string>(searchFilter);
  const [activeDetailDest, setActiveDetailDest] = useState<Destination | null>(null);
  const [dynamicDestinations, setDynamicDestinations] = useState<Destination[]>(destinations);
  const [isSearchingPlaces, setIsSearchingPlaces] = useState(false);

  // Backend API States
  const [backendDestinations, setBackendDestinations] = useState<Destination[]>(destinations);
  const [isLoadingBackend, setIsLoadingBackend] = useState<boolean>(true);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [backendSource, setBackendSource] = useState<string | null>(null);

  // Google Places Autocomplete States
  const [autocompletePredictions, setAutocompletePredictions] = useState<AutocompletePrediction[]>([]);
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const [isLoadingPredictions, setIsLoadingPredictions] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [autocompleteError, setAutocompleteError] = useState<string | null>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);

  // 1. Fetch destination data from Node.js + Express backend (GET /api/destinations)
  const loadBackendDestinations = async () => {
    setIsLoadingBackend(true);
    setBackendError(null);
    try {
      const res = await fetchDestinations();
      if (res.destinations && res.destinations.length > 0) {
        setBackendDestinations(res.destinations);
        if (!localSearch.trim()) {
          setDynamicDestinations(res.destinations);
        }
      }
      setBackendSource(res.source || null);
      if (!res.success && res.error) {
        setBackendError(res.error);
      }
    } catch (err: any) {
      console.warn('Failed to load destinations from backend:', err);
      setBackendError(err?.message || 'Failed to connect to /api/destinations');
    } finally {
      setIsLoadingBackend(false);
    }
  };

  useEffect(() => {
    loadBackendDestinations();
  }, []);

  // Reset scroll when entering or exiting destination detail view
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [activeDetailDest]);

  // Sync external search filter
  useEffect(() => {
    setLocalSearch(searchFilter);
  }, [searchFilter]);

  // Sync base destinations when no search is active
  useEffect(() => {
    if (!localSearch.trim()) {
      const base = backendDestinations.length > 0 ? backendDestinations : destinations;
      setDynamicDestinations(base);
      setAutocompletePredictions([]);
    }
  }, [destinations, backendDestinations, localSearch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setIsAutocompleteOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Google Places Autocomplete & Search Debounce (Kept completely separate as requested)
  useEffect(() => {
    const q = localSearch.trim();
    if (!q) {
      const base = backendDestinations.length > 0 ? backendDestinations : destinations;
      setDynamicDestinations(base);
      setAutocompletePredictions([]);
      setIsSearchingPlaces(false);
      setIsLoadingPredictions(false);
      setAutocompleteError(null);
      return;
    }

    if (q.length < 2) {
      setAutocompletePredictions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoadingPredictions(true);
      setIsSearchingPlaces(true);
      setAutocompleteError(null);

      try {
        // 1. Fetch real-time Google Places Autocomplete predictions
        const autocompleteResult = await fetchPlaceAutocomplete(q);
        setAutocompletePredictions(autocompleteResult.predictions || []);

        // 2. Concurrently update destination grid results
        const results = await searchPlaces(q);
        setDynamicDestinations(results);
      } catch (err: any) {
        console.warn('Places search failed, using fallback:', err);
        setAutocompleteError('Unable to connect to Google Places. Showing curated sanctuaries.');
      } finally {
        setIsLoadingPredictions(false);
        setIsSearchingPlaces(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [localSearch, destinations, backendDestinations]);

  // Handle Autocomplete Selection
  const handleSelectSuggestion = async (prediction: AutocompletePrediction) => {
    setIsFetchingDetails(true);
    setLocalSearch(prediction.mainText);
    setIsAutocompleteOpen(false);

    try {
      // Fetch full place details and coordinates
      const detailedDestination = await fetchPlaceDetails(prediction.placeId);
      if (detailedDestination) {
        // Store selected location for trip planner
        if (detailedDestination.coordinates) {
          storeSelectedTripLocation({
            name: detailedDestination.name,
            city: detailedDestination.city || detailedDestination.name,
            state: detailedDestination.state,
            country: detailedDestination.country,
            region: detailedDestination.region,
            coordinates: detailedDestination.coordinates,
            formattedAddress: detailedDestination.formattedAddress || `${detailedDestination.name}, ${detailedDestination.country}`,
            placeId: detailedDestination.googlePlaceId || prediction.placeId,
            image: detailedDestination.cinematicImage || detailedDestination.image,
          });

          // Fetch nearby attractions asynchronously to enrich planner
          fetchNearbyAttractions(
            detailedDestination.coordinates.lat,
            detailedDestination.coordinates.lng,
            30000
          ).then((attractions) => {
            if (attractions && attractions.length > 0) {
              storeSelectedTripLocation({
                name: detailedDestination.name,
                city: detailedDestination.city || detailedDestination.name,
                state: detailedDestination.state,
                country: detailedDestination.country,
                region: detailedDestination.region,
                coordinates: detailedDestination.coordinates!,
                formattedAddress: detailedDestination.formattedAddress,
                placeId: detailedDestination.googlePlaceId || prediction.placeId,
                image: detailedDestination.cinematicImage || detailedDestination.image,
                nearbyAttractions: attractions,
              });
            }
          }).catch((err) => console.warn('Nearby attractions fetch non-blocking error:', err));
        }

        // Add to dynamic list if not already present
        setDynamicDestinations((prev) => {
          const exists = prev.some((d) => d.id === detailedDestination.id || d.name.toLowerCase() === detailedDestination.name.toLowerCase());
          if (!exists) {
            return [detailedDestination, ...prev];
          }
          return prev;
        });

        // Open destination details view with interactive map immediately
        setActiveDetailDest(detailedDestination);
      } else {
        // Fallback: search by name
        const searchResults = await searchPlaces(prediction.mainText);
        if (searchResults.length > 0) {
          setActiveDetailDest(searchResults[0]);
        }
      }
    } catch (err) {
      console.warn('Error fetching place details:', err);
    } finally {
      setIsFetchingDetails(false);
    }
  };

  const categories = [
    { id: 'All', label: 'All Sanctuaries', icon: Compass },
    { id: 'Heritage', label: 'UNESCO Heritage', icon: Landmark },
    { id: 'Nature', label: 'Alpine & Nature', icon: Trees },
    { id: 'Adventure', label: 'Wild Safari & Peaks', icon: Mountain },
    { id: 'Culture', label: 'Ancient Culture', icon: Landmark },
    { id: 'Beach', label: 'Coastal Havens', icon: Palmtree },
  ];

  const regions = ['All', 'India', 'Europe', 'Asia', 'Americas', 'Africa'];

  // Advanced Filtering
  const filteredDestinations = dynamicDestinations.filter((dest) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      dest.category.toLowerCase() === selectedCategory.toLowerCase() ||
      (selectedCategory === 'Heritage' && (dest.category === 'Heritage' || dest.vibe?.includes('UNESCO')));

    const matchesRegion =
      selectedRegion === 'All' ||
      (selectedRegion === 'India' && (dest.country === 'India' || dest.region === 'India')) ||
      (selectedRegion === 'Europe' && (dest.region === 'Europe' || ['Italy', 'Switzerland', 'Greece', 'France', 'Spain'].includes(dest.country))) ||
      (selectedRegion === 'Asia' && (dest.region === 'Asia' || ['Japan', 'Indonesia', 'Thailand', 'Vietnam', 'Maldives'].includes(dest.country))) ||
      (selectedRegion === 'Americas' && (dest.region === 'Americas' || ['Canada', 'USA', 'Peru', 'Costa Rica'].includes(dest.country))) ||
      (selectedRegion === 'Africa' && (dest.region === 'Africa' || ['Tanzania', 'Morocco', 'South Africa', 'Kenya'].includes(dest.country)));

    return matchesCategory && matchesRegion;
  });

  const getCategoryCount = (catId: string) => {
    if (catId === 'All') return dynamicDestinations.length;
    return dynamicDestinations.filter((d) => {
      if (catId === 'Heritage') return d.category === 'Heritage' || d.vibe?.includes('UNESCO');
      return d.category.toLowerCase() === catId.toLowerCase();
    }).length;
  };

  // If a destination is currently being inspected in-depth
  if (activeDetailDest) {
    return (
      <section id="destinations-detail-view" className="py-2">
        <DestinationDetailView
          destination={activeDetailDest}
          onBack={() => setActiveDetailDest(null)}
          onBookStay={onBookStay ? (destName) => onBookStay(destName || activeDetailDest) : undefined}
          onAddToTrip={(destName) => {
            if (onAddToTrip) {
              onAddToTrip(destName);
            } else {
              onSelectDestination(activeDetailDest);
            }
          }}
          isSaved={savedIds.includes(activeDetailDest.id)}
          onToggleSave={onToggleSave}
        />
      </section>
    );
  }

  return (
    <section id="destinations" className="py-2 relative">
      <div className="relative z-10 space-y-8">
        {/* 1. SECTION HERO & HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-neutral-200 dark:border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 font-mono text-xs text-[#C5A059] tracking-widest uppercase font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Sanctuaries</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-neutral-900 dark:text-white tracking-tight">
              Global <span className="text-[#C5A059] italic font-normal">Destinations</span>
            </h1>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Explore handpicked wonders categorized across Nature, Adventure, Culture, Beach, and Heritage. Each sanctuary is paired with private villas and bespoke local access.
            </p>
          </div>

          {/* Search Input Bar & Map Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            {onOpenGlobalMap && (
              <button
                id="destinations-open-map-view-btn"
                onClick={onOpenGlobalMap}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#C5A059] hover:bg-[#F3E5AB] text-black font-semibold text-xs transition-all shadow-md shadow-[#C5A059]/20 shrink-0"
              >
                <Compass className="w-4 h-4" />
                <span>Interactive World Map</span>
              </button>
            )}

            <div ref={searchDropdownRef} className="relative w-full lg:w-96">
              <div className="relative">
                {isSearchingPlaces || isLoadingPredictions || isFetchingDetails ? (
                  <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059] animate-spin" />
                ) : (
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                )}
                <input
                  type="text"
                  id="destination-search-input"
                  value={localSearch}
                  onChange={(e) => {
                    setLocalSearch(e.target.value);
                    setIsAutocompleteOpen(true);
                  }}
                  onFocus={() => setIsAutocompleteOpen(true)}
                  placeholder="Search real destinations (e.g. Bengaluru, Amalfi, Kyoto)..."
                  className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white dark:bg-[#0D0D0D] border border-neutral-300 dark:border-white/10 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] text-xs text-neutral-900 dark:text-white placeholder-neutral-400 transition-all outline-none shadow-sm"
                  autoComplete="off"
                />
                {localSearch && (
                  <button
                    id="destination-search-clear-btn"
                    onClick={() => {
                      setLocalSearch('');
                      setAutocompletePredictions([]);
                      setIsAutocompleteOpen(false);
                      if (onClearFilter) onClearFilter();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Google Places Autocomplete Dropdown */}
              <AnimatePresence>
                {isAutocompleteOpen && localSearch.trim().length >= 2 && (
                  <motion.div
                    id="places-autocomplete-dropdown"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-0 right-0 mt-2 p-2 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-white/20 rounded-2xl shadow-2xl z-50 max-h-80 overflow-y-auto custom-scrollbar"
                  >
                    {/* Header Strip */}
                    <div className="px-3 py-1.5 flex items-center justify-between border-b border-neutral-100 dark:border-white/10 mb-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-[#C5A059]">
                        <Globe className="w-3 h-3" />
                        <span>Google Places Suggestions</span>
                      </div>
                      {isLoadingPredictions && (
                        <span id="places-autocomplete-loading" className="flex items-center gap-1 text-[10px] text-neutral-500 font-mono">
                          <Loader2 className="w-3 h-3 animate-spin text-[#C5A059]" />
                          <span>Searching...</span>
                        </span>
                      )}
                    </div>

                    {/* Autocomplete Suggestions List */}
                    {autocompletePredictions.length > 0 ? (
                      <div className="space-y-1">
                        {autocompletePredictions.map((pred, idx) => (
                          <button
                            key={pred.placeId || idx}
                            id={`places-suggestion-item-${idx}`}
                            type="button"
                            onClick={() => handleSelectSuggestion(pred)}
                            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/10 text-left transition-colors group"
                          >
                            <div className="flex items-start gap-2.5 min-w-0">
                              <div className="w-6 h-6 rounded-lg bg-[#C5A059]/10 group-hover:bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059] shrink-0 mt-0.5">
                                <MapPin className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                                  {pred.mainText}
                                </div>
                                {pred.secondaryText && (
                                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                                    {pred.secondaryText}
                                  </div>
                                )}
                              </div>
                            </div>

                            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-[#F3E5AB] shrink-0 ml-2">
                              Explore
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : !isLoadingPredictions ? (
                      <div id="places-autocomplete-empty" className="p-4 text-center space-y-1">
                        <MapPin className="w-5 h-5 text-neutral-400 mx-auto opacity-60" />
                        <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                          No places found matching &ldquo;{localSearch}&rdquo;
                        </p>
                        <p className="text-[11px] text-neutral-500">
                          Try searching for a city, sanctuary, or region name.
                        </p>
                      </div>
                    ) : null}

                    {/* Error Notice if any */}
                    {autocompleteError && (
                      <div className="mt-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-2">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{autocompleteError}</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* 2. CATEGORY FILTERS (Nature, Adventure, Culture, Beach, Heritage) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-semibold">
              Filter by Category
            </span>
            <span className="text-[11px] font-mono text-[#C5A059] font-bold">
              Showing {filteredDestinations.length} of {destinations.length} Escapes
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              const count = getCategoryCount(cat.id);

              return (
                <button
                  key={cat.id}
                  id={`filter-category-${cat.id.toLowerCase()}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all flex items-center gap-2 border ${
                    isActive
                      ? 'bg-gradient-to-r from-[#C5A059] to-[#F3E5AB] text-black border-[#C5A059] shadow-lg shadow-[#C5A059]/20 font-bold scale-[1.02]'
                      : 'bg-white dark:bg-[#0D0D0D] text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white border-neutral-200 dark:border-white/10 hover:border-[#C5A059]/40 shadow-sm'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      isActive ? 'bg-black/20 text-black' : 'bg-neutral-100 dark:bg-white/10 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. SECONDARY REGION TABS */}
        <div className="flex flex-wrap items-center gap-2 bg-neutral-100 dark:bg-[#0A0A0A] p-1.5 rounded-2xl border border-neutral-200 dark:border-white/5 w-fit">
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 px-3 hidden sm:inline-block">
            Region:
          </span>
          {regions.map((region) => (
            <button
              key={region}
              id={`filter-dest-region-${region.toLowerCase()}`}
              onClick={() => setSelectedRegion(region)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedRegion === region
                  ? 'bg-white dark:bg-white/15 text-neutral-900 dark:text-white font-bold shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        {/* 4. ACTIVE SEARCH NOTIFICATION IF FILTERED */}
        {(localSearch || selectedCategory !== 'All' || selectedRegion !== 'All') && (
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 text-xs shadow-sm">
            <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>
                Active filters:
                {selectedCategory !== 'All' && <strong className="text-[#C5A059] ml-1">Category: {selectedCategory}</strong>}
                {selectedRegion !== 'All' && <strong className="text-[#C5A059] ml-2">Region: {selectedRegion}</strong>}
                {localSearch && <strong className="text-[#C5A059] ml-2">"{localSearch}"</strong>}
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedRegion('All');
                setLocalSearch('');
                if (onClearFilter) onClearFilter();
              }}
              className="text-[#C5A059] underline hover:text-neutral-900 dark:hover:text-white text-xs font-medium cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Backend Error / Offline Fallback Status Banner */}
        {backendError && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-800 dark:text-[#F3E5AB]">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-[#C5A059] shrink-0" />
              <div>
                <span className="font-semibold">Backend Service Notice: </span>
                <span className="text-neutral-600 dark:text-neutral-300">
                  {backendError}. Displaying curated sanctuaries backup.
                </span>
              </div>
            </div>
            <button
              id="retry-backend-destinations-btn"
              onClick={() => loadBackendDestinations()}
              className="px-3.5 py-1.5 rounded-xl bg-[#C5A059] hover:bg-[#F3E5AB] text-black font-semibold font-mono text-[11px] transition-all self-start sm:self-auto shrink-0 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry Backend</span>
            </button>
          </div>
        )}

        {/* 5. DESTINATION CARDS GRID / LOADING SKELETON */}
        {isLoadingBackend && dynamicDestinations.length === 0 && !localSearch.trim() ? (
          <div id="destinations-loading-skeleton" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-3xl bg-neutral-100 dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 overflow-hidden flex flex-col h-[460px]"
              >
                <div className="h-64 bg-neutral-200 dark:bg-white/5 w-full relative">
                  <div className="absolute top-4 left-4 w-24 h-6 rounded-full bg-neutral-300 dark:bg-white/10" />
                </div>
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="h-6 bg-neutral-200 dark:bg-white/10 rounded-lg w-3/4" />
                    <div className="h-4 bg-neutral-200 dark:bg-white/5 rounded-lg w-full" />
                    <div className="h-4 bg-neutral-200 dark:bg-white/5 rounded-lg w-2/3" />
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-white/5">
                    <div className="h-4 bg-neutral-200 dark:bg-white/10 rounded w-1/3" />
                    <div className="h-8 bg-neutral-200 dark:bg-white/10 rounded-full w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredDestinations.length === 0 ? (
          <div className="text-center py-20 px-4 bg-white dark:bg-[#0D0D0D] rounded-3xl border border-neutral-200 dark:border-white/5 space-y-4 shadow-sm">
            <Compass className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto" />
            <h3 className="text-xl font-serif font-bold text-neutral-900 dark:text-white">No Sanctuaries Found</h3>
            <p className="text-neutral-500 dark:text-neutral-400 text-xs max-w-md mx-auto leading-relaxed">
              We couldn't find any destinations matching "{localSearch || selectedCategory}". Try resetting the category or searching for another keyword.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedRegion('All');
                setLocalSearch('');
              }}
              className="px-5 py-2.5 rounded-full bg-[#C5A059] hover:bg-[#F3E5AB] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#C5A059]/20"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((dest, idx) => {
              const isSaved = savedIds.includes(dest.id);

              return (
                <motion.div
                  key={dest.id}
                  id={`destination-card-${dest.id}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  className="group relative flex flex-col rounded-3xl bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 hover:border-[#C5A059]/40 overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl flex-1 justify-between"
                >
                  {/* Card Image Banner */}
                  <div className="relative h-60 sm:h-64 w-full overflow-hidden bg-neutral-100 dark:bg-[#050505]">
                    <SafeImage
                      src={dest.image}
                      alt={dest.name}
                      categoryHint={dest.category || dest.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    {/* Top Floating Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-gray-200 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#C5A059]" />
                          <span>{dest.country}</span>
                        </span>
                        <span className="px-2 py-1 rounded-full bg-[#C5A059]/90 backdrop-blur-md text-black font-mono font-bold text-[10px] uppercase">
                          {dest.category}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSave(dest.id);
                        }}
                        className={`p-2 rounded-full backdrop-blur-md border transition-all ${
                          isSaved
                            ? 'bg-rose-500/20 border-rose-500/60 text-rose-400'
                            : 'bg-black/60 border-white/10 text-gray-300 hover:text-rose-400'
                        }`}
                        title={isSaved ? 'Remove from saved' : 'Save to wishlist'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500' : ''}`} />
                      </button>
                    </div>

                    {/* Bottom Floating Stats */}
                    <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-sm border border-white/10 text-[#F3E5AB]">
                        <Star className="w-3 h-3 fill-[#C5A059] text-[#C5A059]" />
                        <span className="font-bold text-xs">{dest.rating}</span>
                        <span className="text-[10px] text-gray-400">({dest.reviewsCount})</span>
                      </div>

                      <span className="text-[10px] uppercase font-mono font-semibold text-gray-300 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-sm border border-white/10">
                        {dest.bestTimeToVisit.split('(')[0]}
                      </span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#C5A059] font-bold block">
                        {dest.country} {dest.state ? `· ${dest.state}` : ''}
                      </span>
                      <h3 className="text-xl font-serif font-bold text-neutral-900 dark:text-white group-hover:text-[#C5A059] transition-colors mt-0.5">
                        {dest.name}
                      </h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed mt-1.5 font-normal">
                        {dest.description}
                      </p>
                    </div>

                    {/* Vibe Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {dest.vibe.slice(0, 3).map((v, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-white/5 text-[10px] text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-white/5 font-medium"
                        >
                          ✦ {v}
                        </span>
                      ))}
                    </div>

                    {/* Card Action Footer */}
                    <div className="pt-4 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase text-neutral-500 font-mono block">From</span>
                        <span className="text-sm font-bold text-neutral-900 dark:text-white font-mono">{dest.startingPrice}</span>
                      </div>

                      {/* Required "Explore" Button */}
                      <button
                        id={`explore-btn-${dest.id}`}
                        onClick={() => {
                          setActiveDetailDest(dest);
                          onSelectDestination(dest);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C5A059] hover:bg-[#F3E5AB] text-black text-xs font-bold uppercase tracking-wider transition-all group-hover:scale-105 shadow-md shadow-[#C5A059]/20"
                      >
                        <span>Explore</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
