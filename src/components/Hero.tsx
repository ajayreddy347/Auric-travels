import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Search, Calendar, Compass, ArrowRight, Sparkles, MapPin, ShieldCheck, Star, Loader2, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HERO_SLIDES } from '../data/mockData';
import { fetchPlaceAutocomplete, AutocompletePrediction, fetchPlaceDetails } from '../services/placesService';

interface HeroProps {
  onExploreDestinations: () => void;
  onPlanTrip: () => void;
  onSearch: (destinationQuery: string, season: string, style: string) => void;
  onOpenGlobalMap?: () => void;
  onSelectDestination?: (dest: any) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreDestinations,
  onPlanTrip,
  onSearch,
  onOpenGlobalMap,
  onSelectDestination,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('All Seasons');
  const [selectedStyle, setSelectedStyle] = useState('All Styles');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [autocompletePredictions, setAutocompletePredictions] = useState<AutocompletePrediction[]>([]);
  const [isLoadingPredictions, setIsLoadingPredictions] = useState(false);

  // Ref for the input wrapper — used to compute portal dropdown position
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  // Ref for the portal dropdown itself — used for click-outside detection
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Portal dropdown position state
  const [dropdownRect, setDropdownRect] = useState<{ top: number; left: number; width: number } | null>(null);

  const popularSuggestions = [
    { name: 'Amalfi Coast', country: 'Italy', type: 'Coastal Luxury' },
    { name: 'Kyoto', country: 'Japan', type: 'Cultural Odyssey' },
    { name: 'Zermatt', country: 'Switzerland', type: 'Alpine Serenity' },
    { name: 'Serengeti', country: 'Tanzania', type: 'Wild Safari' },
    { name: 'Banff', country: 'Canada', type: 'Glacial Lakes' },
    { name: 'Santorini', country: 'Greece', type: 'Cycladic Romance' },
    { name: 'Hampi', country: 'India', type: 'UNESCO Heritage' },
    { name: 'Coorg', country: 'India', type: 'Coffee Highlands' },
  ];

  // Compute portal dropdown position from the input wrapper's bounding rect
  const updateDropdownPosition = useCallback(() => {
    if (inputWrapperRef.current) {
      const rect = inputWrapperRef.current.getBoundingClientRect();
      setDropdownRect({
        top: rect.bottom + 8, // 8px gap below the input
        left: rect.left,
        width: rect.width,
      });
    }
  }, []);

  // Update position when dropdown opens or on scroll/resize/layout shifts
  useEffect(() => {
    if (!isLocationDropdownOpen) return;

    let animationFrameId: number;

    const checkAndPosition = () => {
      updateDropdownPosition();
      animationFrameId = requestAnimationFrame(checkAndPosition);
    };

    // Run positioning loop
    checkAndPosition();

    window.addEventListener('scroll', updateDropdownPosition, true);
    window.addEventListener('resize', updateDropdownPosition);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', updateDropdownPosition, true);
      window.removeEventListener('resize', updateDropdownPosition);
    };
  }, [isLocationDropdownOpen, updateDropdownPosition]);

  // Fetch Autocomplete on typing
  useEffect(() => {
    if (!searchLocation.trim() || searchLocation.trim().length < 2) {
      setAutocompletePredictions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoadingPredictions(true);
      try {
        const result = await fetchPlaceAutocomplete(searchLocation);
        setAutocompletePredictions(result.predictions || []);
      } catch (err) {
        console.warn('Hero autocomplete failed:', err);
      } finally {
        setIsLoadingPredictions(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchLocation]);

  // Auto-advance cinematic background slowly
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  // Close location dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      const clickedInsideInput = inputWrapperRef.current?.contains(target);
      const clickedInsideDropdown = dropdownRef.current?.contains(target);
      if (!clickedInsideInput && !clickedInsideDropdown) {
        setIsLocationDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLocationDropdownOpen(false);
    onSearch(searchLocation, selectedSeason, selectedStyle);
    const destElem = document.querySelector('#destinations');
    if (destElem) {
      destElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectSuggestion = async (pred: AutocompletePrediction) => {
    setSearchLocation(pred.mainText);
    setIsLocationDropdownOpen(false);
    
    // If it's a curated pick, we can search normally or open detail directly
    if (pred.isCurated) {
      onSearch(pred.mainText, selectedSeason, selectedStyle);
      const destElem = document.querySelector('#destinations');
      if (destElem) {
        destElem.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    // Google Place Result: Resolve place details dynamically
    setIsLoadingPredictions(true);
    try {
      const detailedDest = await fetchPlaceDetails(pred.placeId);
      if (detailedDest && onSelectDestination) {
        onSelectDestination(detailedDest);
      } else {
        onSearch(pred.mainText, selectedSeason, selectedStyle);
        const destElem = document.querySelector('#destinations');
        if (destElem) {
          destElem.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } catch (err) {
      console.warn('Failed to resolve place details:', err);
      onSearch(pred.mainText, selectedSeason, selectedStyle);
    } finally {
      setIsLoadingPredictions(false);
    }
  };

  // The portal dropdown — rendered at document.body level to escape all stacking contexts
  const googleResults = autocompletePredictions.filter(p => !p.isCurated);
  const curatedResults = autocompletePredictions.filter(p => p.isCurated);

  const dropdownPortal = isLocationDropdownOpen && dropdownRect
    ? createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: 'fixed',
            top: dropdownRect.top,
            left: dropdownRect.left,
            width: dropdownRect.width,
            zIndex: 99999,
          }}
          className="p-2 bg-[#121212] border border-white/20 rounded-2xl shadow-2xl shadow-black/80 max-h-72 overflow-y-auto custom-scrollbar"
        >
          {/* Live Autocomplete Results if user typed */}
          {googleResults.length > 0 && (
            <div className="mb-2">
              <div className="text-[10px] font-semibold text-[#C5A059] px-3 py-1 uppercase tracking-wider font-mono flex items-center justify-between">
                <span>Google Results</span>
                <span className="text-[9px] text-gray-500 font-normal">Worldwide Search</span>
              </div>
              {googleResults.map((pred) => (
                <button
                  key={pred.placeId}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectSuggestion(pred);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/10 text-left transition-colors text-xs text-gray-200"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                    <div className="truncate">
                      <span className="font-medium text-white">{pred.mainText}</span>
                      {pred.secondaryText && (
                        <span className="text-gray-400 text-[11px]"> · {pred.secondaryText}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#C5A059]/10 text-[#F3E5AB] shrink-0 ml-2 font-mono border border-[#C5A059]/20">
                    Worldwide Place
                  </span>
                </button>
              ))}
            </div>
          )}

          {curatedResults.length > 0 && (
            <div className="mb-2">
              <div className="text-[10px] font-semibold text-[#C5A059] px-3 py-1 uppercase tracking-wider font-mono flex items-center justify-between">
                <span>Auric Travels Picks</span>
                <span className="text-[9px] text-gray-500 font-normal">Curated Sanctuaries</span>
              </div>
              {curatedResults.map((pred) => (
                <button
                  key={pred.placeId}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectSuggestion(pred);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#C5A059]/10 text-left transition-colors text-xs text-gray-200"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                    <div className="truncate">
                      <span className="font-medium text-[#F3E5AB]">{pred.mainText}</span>
                      {pred.secondaryText && (
                        <span className="text-gray-400 text-[11px]"> · {pred.secondaryText}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#C5A059]/20 text-[#F3E5AB] shrink-0 ml-2 font-mono border border-[#C5A059]/40 font-bold">
                    Curated Pick
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Empty State: user typed but no results found */}
          {searchLocation.trim().length >= 2 && !isLoadingPredictions && autocompletePredictions.length === 0 && (
            <div className="p-4 text-center text-xs text-gray-400">
              <MapPin className="w-5 h-5 mx-auto mb-1.5 text-gray-500 opacity-60" />
              <p className="font-medium text-gray-300">No locations found</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Try searching another global city, country or landmark</p>
            </div>
          )}

          {/* Popular Curations (shown when query is empty or < 2 characters) */}
          {searchLocation.trim().length < 2 && (
            <>
              <div className="text-[10px] font-semibold text-gray-400 px-3 py-1 uppercase tracking-wider font-mono">
                Popular Curated Sanctuaries
              </div>
              {popularSuggestions.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectSuggestion({
                      placeId: item.name.toLowerCase().replace(/\s+/g, '-'),
                      mainText: item.name,
                      secondaryText: item.country,
                      types: [],
                      isCurated: true
                    });
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/10 text-left transition-colors text-xs text-gray-200"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span className="font-medium text-white">{item.name}</span>
                    <span className="text-gray-400">· {item.country}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#F3E5AB]">
                    {item.type}
                  </span>
                </button>
              ))}
            </>
          )}
        </div>,
        document.body
      )
    : null;

  return (
    <section
      id="home"
      className="relative w-full rounded-3xl overflow-hidden bg-[#050505] border border-neutral-200 dark:border-white/10 shadow-2xl flex flex-col justify-between p-6 sm:p-10 lg:p-12 min-h-[620px] lg:min-h-[680px]"
    >
      {/* Background Cinematic Video with Image Fallback */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          src="/videos/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={HERO_SLIDES[0].image}
          className="w-full h-full object-cover"
        >
          {/* Fallback to carousel if browser cannot render video */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${HERO_SLIDES[currentSlide].image})`,
              }}
            />
          </AnimatePresence>
        </video>

        {/* Cinematic Multi-layer Gradient Overlays for contrast & readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/75 to-[#050505]/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-[#050505]/60 to-transparent pointer-events-none" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#C5A059] blur-[140px] opacity-15 pointer-events-none" />
      </div>

      {/* Main Hero Content Container */}
      <div className="relative z-10 w-full max-w-4xl space-y-6 sm:space-y-8 my-auto">
        <div className="space-y-4">
          {/* Top Pill / Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2"
          >
            <div className="px-3 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#C5A059] text-xs font-mono tracking-widest uppercase flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Curated Global Journeys</span>
            </div>
          </motion.div>

          {/* Core Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-serif text-white leading-[1.05] tracking-tight font-bold"
          >
            Discover. Explore.<br />
            <span className="text-[#C5A059]">Plan.</span> Travel.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base text-gray-300 font-normal leading-relaxed max-w-2xl"
          >
            Experience the world through curated lenses. Auric Travels helps you craft personalized itineraries that go beyond the ordinary with handpicked sanctuaries and bespoke local access.
          </motion.p>

          {/* Primary Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-3.5 pt-2"
          >
            <button
              id="hero-explore-destinations-btn"
              onClick={onExploreDestinations}
              className="group inline-flex items-center gap-2.5 h-12 sm:h-13 px-6 sm:px-7 rounded-full bg-[#C5A059] hover:bg-[#F3E5AB] text-black font-bold text-xs sm:text-sm tracking-wide shadow-xl shadow-[#C5A059]/20 hover:scale-105 active:scale-[0.98] transition-all duration-200"
            >
              <span>Explore Destinations</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {onOpenGlobalMap && (
              <button
                id="hero-open-world-map-btn"
                onClick={onOpenGlobalMap}
                className="inline-flex items-center gap-2 h-12 sm:h-13 px-5 sm:px-6 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs sm:text-sm backdrop-blur-md transition-all duration-200"
              >
                <Compass className="w-4 h-4 text-[#C5A059]" />
                <span>Interactive World Map</span>
              </button>
            )}

            <button
              id="hero-plan-my-trip-btn"
              onClick={onPlanTrip}
              className="inline-flex items-center gap-2 h-12 sm:h-13 px-6 sm:px-7 rounded-full border border-[#C5A059]/60 text-[#C5A059] hover:bg-[#C5A059] hover:text-black font-semibold text-xs sm:text-sm backdrop-blur-md transition-all duration-200"
            >
              <Sparkles className="w-4 h-4" />
              <span>Plan My Trip</span>
            </button>
          </motion.div>
        </div>

        {/* Integrated Intelligent Search Bar Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="w-full pt-2"
        >
          <form
            id="hero-search-form"
            onSubmit={handleSearchSubmit}
            className="p-3 sm:p-4 rounded-3xl bg-[#0A0A0A]/95 border border-white/15 backdrop-blur-xl shadow-2xl shadow-black/90"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-stretch">
              {/* 1. Location Input (Where to?) */}
              <div
                ref={inputWrapperRef}
                className="relative col-span-1 sm:col-span-2 lg:col-span-4 px-4 py-2.5 rounded-2xl bg-[#141414] border border-white/10 hover:border-[#C5A059]/60 transition-colors flex flex-col justify-center min-h-[58px]"
              >
                <label
                  htmlFor="hero-search-destination-input"
                  className="block text-[10px] uppercase font-bold tracking-widest text-[#C5A059] mb-1 font-mono cursor-pointer"
                >
                  Where to?
                </label>
                <div className="flex items-center gap-2 min-w-0">
                  {isLoadingPredictions ? (
                    <Loader2 className="w-4 h-4 text-[#C5A059] animate-spin shrink-0" />
                  ) : (
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  )}
                  <input
                    id="hero-search-destination-input"
                    type="text"
                    value={searchLocation}
                    onChange={(e) => {
                      setSearchLocation(e.target.value);
                      setIsLocationDropdownOpen(true);
                    }}
                    onFocus={() => {
                      setIsLocationDropdownOpen(true);
                      updateDropdownPosition();
                    }}
                    placeholder="Search any destination on Earth..."
                    className="w-full bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none truncate"
                    autoComplete="off"
                  />
                </div>
                {/* Dropdown is rendered via portal — see dropdownPortal below */}
              </div>

              {/* 2. Season Selection (When?) */}
              <div className="relative col-span-1 sm:col-span-1 lg:col-span-3 px-4 py-2.5 rounded-2xl bg-[#141414] border border-white/10 hover:border-[#C5A059]/60 transition-colors flex flex-col justify-center min-h-[58px]">
                <label
                  htmlFor="hero-season-select"
                  className="block text-[10px] uppercase font-bold tracking-widest text-[#C5A059] mb-1 font-mono cursor-pointer"
                >
                  When?
                </label>
                <div className="flex items-center gap-2 min-w-0">
                  <Calendar className="w-4 h-4 text-[#C5A059]/80 shrink-0" />
                  <select
                    id="hero-season-select"
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm text-white focus:outline-none cursor-pointer font-medium truncate"
                  >
                    <option value="All Seasons" className="bg-[#121212] text-white">All Seasons</option>
                    <option value="Spring (Mar – May)" className="bg-[#121212] text-white">Spring (Mar – May)</option>
                    <option value="Summer (Jun – Aug)" className="bg-[#121212] text-white">Summer (Jun – Aug)</option>
                    <option value="Autumn (Sep – Nov)" className="bg-[#121212] text-white">Autumn (Sep – Nov)</option>
                    <option value="Winter (Dec – Feb)" className="bg-[#121212] text-white">Winter (Dec – Feb)</option>
                  </select>
                </div>
              </div>

              {/* 3. Travel Style Selection (Travel Tribe) */}
              <div className="relative col-span-1 sm:col-span-1 lg:col-span-3 px-4 py-2.5 rounded-2xl bg-[#141414] border border-white/10 hover:border-[#C5A059]/60 transition-colors flex flex-col justify-center min-h-[58px]">
                <label
                  htmlFor="hero-style-select"
                  className="block text-[10px] uppercase font-bold tracking-widest text-[#C5A059] mb-1 font-mono cursor-pointer"
                >
                  Travel Tribe
                </label>
                <div className="flex items-center gap-2 min-w-0">
                  <Compass className="w-4 h-4 text-[#C5A059]/80 shrink-0" />
                  <select
                    id="hero-style-select"
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm text-white focus:outline-none cursor-pointer font-medium truncate"
                  >
                    <option value="All Styles" className="bg-[#121212] text-white">All Styles</option>
                    <option value="Coastal Luxury" className="bg-[#121212] text-white">Coastal Luxury</option>
                    <option value="Alpine & Nature" className="bg-[#121212] text-white">Alpine & Nature</option>
                    <option value="Ancient Culture" className="bg-[#121212] text-white">Ancient Culture</option>
                    <option value="Wild Safari" className="bg-[#121212] text-white">Wild Safari</option>
                    <option value="Gastronomy & Wine" className="bg-[#121212] text-white">Gastronomy & Wine</option>
                    <option value="UNESCO Heritage" className="bg-[#121212] text-white">UNESCO Heritage</option>
                  </select>
                </div>
              </div>

              {/* 4. Search Action Button */}
              <div className="col-span-1 sm:col-span-2 lg:col-span-2 flex items-center min-h-[58px]">
                <button
                  id="hero-search-submit-btn"
                  type="submit"
                  className="w-full h-full min-h-[48px] rounded-2xl bg-[#C5A059] hover:bg-[#F3E5AB] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#C5A059]/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  <Search className="w-4 h-4 text-black" />
                  <span>Explore</span>
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Hero Bottom Bar: Slide Switchers & Key Highlights */}
      <div className="relative z-10 w-full pt-6 mt-6 border-t border-white/10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Current Slide Indicator */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#C5A059]">0{currentSlide + 1}</span>
            <div className="flex gap-2">
              {HERO_SLIDES.map((slide, index) => (
                <button
                  key={slide.title}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentSlide === index ? 'w-8 bg-[#C5A059]' : 'w-2 bg-gray-700 hover:bg-gray-500'
                  }`}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
            <span className="text-xs font-mono text-gray-400">0{HERO_SLIDES.length}</span>
            <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-white/15 text-xs text-gray-200">
              <span className="text-[#C5A059] font-semibold">{HERO_SLIDES[currentSlide].badge}:</span>
              <span>{HERO_SLIDES[currentSlide].title}, {HERO_SLIDES[currentSlide].country}</span>
            </div>
          </div>

          {/* Highlights */}
          <div className="flex items-center gap-6 text-xs text-gray-300">
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
              <span className="text-white font-semibold">4.98/5</span>
              <span>Curated Reviews</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>100% Handcrafted Itineraries</span>
            </div>
          </div>
        </div>
      </div>

      {/* Portal dropdown — rendered at document.body level, escapes all stacking contexts */}
      {dropdownPortal}
    </section>
  );
};
