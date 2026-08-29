import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Thermometer,
  Star,
  Sparkles,
  Heart,
  ArrowLeft,
  Share2,
  Check,
  Compass,
  Utensils,
  Landmark,
  Coins,
  Clock,
  ChevronRight,
  PlusCircle,
  CheckCircle2,
  Camera,
  Layers,
  Award,
  Map as MapIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Destination, SelectedPlaceLocation } from '../types';
import { SafeImage } from './SafeImage';
import { DestinationMap } from './DestinationMap';
import { storeSelectedTripLocation } from '../utils/tripGenerator';

interface DestinationDetailViewProps {
  destination: Destination;
  onBack: () => void;
  onAddToTrip: (destinationName: string) => void;
  onBookStay?: (destinationName: string) => void;
  isSaved: boolean;
  onToggleSave: (destId: string) => void;
}

export const DestinationDetailView: React.FC<DestinationDetailViewProps> = ({
  destination,
  onBack,
  onAddToTrip,
  onBookStay,
  isSaved,
  onToggleSave,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeSection, setActiveSection] = useState<'overview' | 'map' | 'attractions' | 'things-to-do' | 'food-culture' | 'budget'>('overview');
  const [isAddedToTrip, setIsAddedToTrip] = useState(false);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    setActiveImageIndex(0);
    setActiveSection('overview');
  }, [destination?.id]);

  const images = [
    destination.cinematicImage || destination.image,
    ...destination.gallery.filter((g) => g !== destination.image),
  ];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddTripClick = () => {
    setIsAddedToTrip(true);
    if (destination.coordinates) {
      storeSelectedTripLocation({
        name: destination.name,
        city: destination.city || destination.name,
        state: destination.state,
        country: destination.country,
        region: destination.region,
        coordinates: destination.coordinates,
        formattedAddress: destination.formattedAddress || `${destination.name}, ${destination.state ? destination.state + ', ' : ''}${destination.country}`,
        placeId: destination.googlePlaceId,
        image: destination.cinematicImage || destination.image,
      });
    }
    onAddToTrip(destination.name);
    setTimeout(() => setIsAddedToTrip(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-10 pb-16"
    >
      {/* 1. TOP BREADCRUMB / ACTION BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 dark:border-white/10 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 text-neutral-700 dark:text-gray-300 hover:text-neutral-900 dark:hover:text-white text-xs font-semibold transition-all group shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#C5A059]" />
          <span>Back to All Destinations</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onToggleSave(destination.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all shadow-sm ${
              isSaved
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-300'
                : 'bg-white dark:bg-[#0D0D0D] border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-gray-300 hover:text-rose-500 hover:border-rose-500/30'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{isSaved ? 'Saved in Vault' : 'Save to Vault'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 text-neutral-700 dark:text-gray-300 hover:text-neutral-900 dark:hover:text-white text-xs font-semibold transition-all shadow-sm"
            title="Share Destination"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="text-[#C5A059]">Link Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </>
            )}
          </button>

          {/* Primary "Add to Trip" Button */}
          <button
            id="detail-add-to-trip-top"
            onClick={handleAddTripClick}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#F3E5AB] hover:from-[#d4b068] hover:to-[#fff2cc] text-black text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#C5A059]/20"
          >
            {isAddedToTrip ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Added to Trip Architect!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Add to Trip</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. LARGE CINEMATIC IMAGE BANNER */}
      <div className="relative rounded-3xl overflow-hidden border border-neutral-200 dark:border-white/10 bg-neutral-900 shadow-2xl">
        <div className="relative h-80 sm:h-[480px] w-full overflow-hidden">
          <SafeImage
            src={images[activeImageIndex] || destination.cinematicImage || destination.image}
            alt={destination.name}
            categoryHint={destination.name}
            className="w-full h-full object-cover transition-all duration-700 ease-out"
          />
          {/* Deep Cinematic Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent hidden md:block" />

          {/* Category & Region Pill Top Left */}
          <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
            <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-[#C5A059]/40 text-[#F3E5AB] text-xs font-mono font-bold tracking-wider uppercase">
              {destination.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-medium flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{destination.country} {destination.state ? `· ${destination.state}` : ''}</span>
            </span>
          </div>

          {/* Hero Content Overlay Bottom Left */}
          <div className="absolute bottom-6 left-6 right-6 md:right-auto md:max-w-2xl z-10 space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-[#F3E5AB] text-xs font-mono">
                <Star className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
                <span className="font-bold">{destination.rating}</span>
                <span className="text-gray-400">({destination.reviewsCount} Curated Reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-none drop-shadow-md">
              {destination.name}
            </h1>
            <p className="text-sm sm:text-base text-gray-200 font-light leading-relaxed max-w-xl drop-shadow">
              {destination.tagline}
            </p>
          </div>

          {/* Gallery Thumbnails Overlay Bottom Right */}
          {images.length > 1 && (
            <div className="absolute bottom-6 right-6 hidden sm:flex items-center gap-2.5 z-10 bg-black/60 backdrop-blur-md p-2 rounded-2xl border border-white/10">
              <Camera className="w-4 h-4 text-gray-400 ml-1" />
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-14 h-10 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx
                      ? 'border-[#C5A059] scale-105 shadow-md shadow-[#C5A059]/30'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <SafeImage src={img} alt={`${destination.name} gallery thumbnail ${idx + 1}`} categoryHint={destination.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Vitals Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 sm:p-6 bg-neutral-900 border-t border-white/5 text-xs text-white">
          <div className="p-3 rounded-2xl bg-black/60 border border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/30 flex items-center justify-center text-[#F3E5AB]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-mono block">Best Time to Visit</span>
              <span className="font-semibold text-white text-xs sm:text-sm">{destination.bestTimeToVisit}</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-black/60 border border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/30 flex items-center justify-center text-[#F3E5AB]">
              <Thermometer className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-mono block">Average Climate</span>
              <span className="font-semibold text-white text-xs sm:text-sm">{destination.averageTemperature}</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-black/60 border border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/30 flex items-center justify-center text-[#F3E5AB]">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-mono block">Estimated Budget</span>
              <span className="font-semibold text-white text-xs sm:text-sm">{destination.startingPrice}</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-black/60 border border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/30 flex items-center justify-center text-[#F3E5AB]">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-mono block">Experience Tier</span>
              <span className="font-semibold text-white text-xs sm:text-sm">{destination.estimatedBudget?.tier || 'Luxury'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SECTION NAVIGATION PILLS */}
      <div className="sticky top-16 z-20 bg-[#F8F7F4]/95 dark:bg-[#050505]/95 backdrop-blur-md py-3 border-y border-neutral-200 dark:border-white/10 flex items-center gap-2 overflow-x-auto custom-scrollbar">
        {[
          { id: 'overview', label: 'Overview', icon: Compass },
          { id: 'map', label: 'Interactive Map & Surroundings', icon: MapIcon },
          { id: 'attractions', label: 'Top Attractions', icon: Landmark, count: destination.topAttractions?.length },
          { id: 'things-to-do', label: 'Things to Do', icon: Clock, count: destination.thingsToDo?.length },
          { id: 'food-culture', label: 'Local Food & Culture', icon: Utensils },
          { id: 'budget', label: 'Estimated Budget & Best Season', icon: Coins },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-[#C5A059] text-black shadow-md shadow-[#C5A059]/20 font-bold'
                  : 'bg-white dark:bg-[#0D0D0D] text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-white/5 hover:border-neutral-300 dark:hover:border-white/15'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                    isActive ? 'bg-black/20 text-black' : 'bg-neutral-100 dark:bg-white/10 text-neutral-700 dark:text-gray-300'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 4. DYNAMIC SECTION CONTENTS */}
      <div className="space-y-12">
        {/* SECTION A: OVERVIEW & HIGHLIGHTS */}
        {activeSection === 'overview' && (
          <motion.div
            key="overview-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Overview Column */}
              <div className="lg:col-span-2 space-y-6">
                <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 font-mono text-xs text-[#C5A059] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Sanctuary Narrative</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 dark:text-white">
                    The Essence of {destination.name}
                  </h2>
                  <p className="text-neutral-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base font-light">
                    {destination.overviewLong || destination.description}
                  </p>

                  {/* Vibe Chips */}
                  <div className="pt-2">
                    <span className="text-xs uppercase font-mono tracking-wider text-neutral-500 dark:text-gray-400 block mb-2 font-semibold">
                      Atmospheric Character
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {destination.vibe.map((v, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-[#141414] border border-[#C5A059]/30 text-[#C5A059] dark:text-[#F3E5AB] text-xs font-medium"
                        >
                          ✦ {v}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Curated Moments */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 space-y-4 shadow-sm">
                  <h3 className="text-xl font-serif font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C5A059]" />
                    <span>Auric Curated Signature Moments</span>
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {destination.highlights.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3.5 p-4 rounded-2xl bg-neutral-50 dark:bg-[#080808] border border-neutral-200/60 dark:border-white/5 hover:border-[#C5A059]/30 transition-all"
                      >
                        <div className="w-7 h-7 rounded-xl bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono font-bold">
                          {i + 1}
                        </div>
                        <span className="text-neutral-800 dark:text-gray-200 text-sm font-medium leading-relaxed">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Quick Summary & CTA Card */}
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-neutral-900 dark:bg-gradient-to-br dark:from-[#121008] dark:to-[#0A0A0A] border border-[#C5A059]/40 space-y-5 sticky top-36 text-white shadow-xl">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
                      Bespoke Expedition
                    </span>
                    <h3 className="text-xl font-serif font-bold text-white mt-1">
                      Craft Your {destination.name} Journey
                    </h3>
                    <p className="text-xs text-gray-300 mt-1">
                      Seamlessly add this sanctuary to your custom trip itinerary with private chauffeured transfers and exclusive access.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-white/10 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Starting Price</span>
                      <span className="font-bold text-white text-sm">{destination.startingPrice}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Best Window</span>
                      <span className="font-semibold text-[#F3E5AB]">{destination.bestTimeToVisit}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Atmosphere</span>
                      <span className="font-medium text-gray-200">{destination.category}</span>
                    </div>
                  </div>

                  <button
                    id="detail-add-to-trip-sidebar"
                    onClick={handleAddTripClick}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#C5A059] to-[#F3E5AB] hover:from-[#d4b068] hover:to-[#fff2cc] text-black font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#C5A059]/20"
                  >
                    {isAddedToTrip ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Added to Trip Architect!</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Add to Trip Itinerary</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Embedded Geospatial Map Explorer in Overview */}
            <div className="pt-4">
              <DestinationMap destination={destination} />
            </div>
          </motion.div>
        )}

        {/* SECTION: DEDICATED INTERACTIVE MAP VIEW */}
        {activeSection === 'map' && (
          <motion.div
            key="map-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#C5A059]">
                <MapIcon className="w-3.5 h-3.5" />
                <span>Geospatial Exploration</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 dark:text-white mt-1">
                Map View & Nearby Attractions
              </h2>
              <p className="text-neutral-600 dark:text-gray-400 text-xs sm:text-sm mt-1 max-w-2xl">
                Explore the exact location of {destination.name}, inspect nearby cultural landmarks, scenic routes, and open directions directly in Google Maps.
              </p>
            </div>

            <DestinationMap destination={destination} />
          </motion.div>
        )}

            {/* SECTION B: TOP ATTRACTIONS */}
            {activeSection === 'attractions' && (
              <motion.div
                key="attractions-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#C5A059]">
                    <Landmark className="w-3.5 h-3.5" />
                    <span>Must-Visit Landmarks</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 dark:text-white mt-1">
                    Top Attractions in {destination.name}
                  </h2>
                  <p className="text-neutral-600 dark:text-gray-400 text-xs sm:text-sm mt-1 max-w-2xl">
                    Iconic monuments, ancient sanctuaries, and panoramic vantage points handpicked by our travel architects.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {destination.topAttractions?.map((attraction, idx) => (
                    <div
                      key={idx}
                      className="group rounded-3xl bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 hover:border-[#C5A059]/50 overflow-hidden transition-all duration-300 flex flex-col shadow-sm"
                    >
                      <div className="relative h-56 w-full overflow-hidden bg-neutral-900">
                        <SafeImage
                          src={attraction.image || destination.image}
                          alt={attraction.name}
                          categoryHint={attraction.tag || destination.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        {attraction.tag && (
                          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-[#F3E5AB]">
                            {attraction.tag}
                          </span>
                        )}
                        <span className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#C5A059] text-black font-mono font-bold text-xs flex items-center justify-center shadow">
                          0{idx + 1}
                        </span>
                      </div>

                      <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-serif font-bold text-neutral-900 dark:text-white group-hover:text-[#C5A059] dark:group-hover:text-[#F3E5AB] transition-colors">
                            {attraction.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-neutral-600 dark:text-gray-300 leading-relaxed mt-1">
                            {attraction.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* SECTION C: THINGS TO DO */}
            {activeSection === 'things-to-do' && (
              <motion.div
                key="things-to-do-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#C5A059]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Curated Activities</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 dark:text-white mt-1">
                    Things to Do & Signature Experiences
                  </h2>
                  <p className="text-neutral-600 dark:text-gray-400 text-xs sm:text-sm mt-1 max-w-2xl">
                    Immersive pursuits curated for discerning voyagers, from private historian tours to sunrise helicopter flights.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {destination.thingsToDo?.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-6 rounded-3xl bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 hover:border-[#C5A059]/40 transition-all space-y-4 flex flex-col justify-between shadow-sm"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-lg bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#C5A059] dark:text-[#F3E5AB] text-[10px] font-mono font-bold">
                            {item.type || 'Signature Experience'}
                          </span>
                          {item.duration && (
                            <span className="text-[10px] font-mono text-neutral-500 dark:text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#C5A059]" />
                              {item.duration}
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-serif font-bold text-neutral-900 dark:text-white">{item.title}</h3>
                        <p className="text-xs text-neutral-600 dark:text-gray-300 leading-relaxed">{item.description}</p>
                      </div>

                      <button
                        onClick={handleAddTripClick}
                        className="w-full py-2 rounded-xl bg-neutral-100 hover:bg-[#C5A059] dark:bg-white/5 dark:hover:bg-[#C5A059] text-neutral-800 hover:text-black dark:text-gray-300 dark:hover:text-black text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Include in Itinerary</span>
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* SECTION D: LOCAL FOOD AND CULTURE */}
            {activeSection === 'food-culture' && (
              <motion.div
                key="food-culture-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#C5A059]">
                    <Utensils className="w-3.5 h-3.5" />
                    <span>Epicurean & Living Heritage</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 dark:text-white mt-1">
                    Local Food & Cultural Traditions
                  </h2>
                  <p className="text-neutral-600 dark:text-gray-400 text-xs sm:text-sm mt-1 max-w-2xl">
                    {destination.foodAndCulture?.overview || 'Explore authentic regional delicacies and centuries-old living traditions.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Signature Culinary Dishes */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 space-y-4 shadow-sm">
                    <h3 className="text-xl font-serif font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-[#C5A059]" />
                      <span>Must-Try Signature Dishes</span>
                    </h3>

                    <div className="space-y-3">
                      {destination.foodAndCulture?.signatureDishes.map((dish, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#080808] border border-neutral-200/60 dark:border-white/5 space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-[#C5A059] dark:text-[#F3E5AB]">{dish.name}</h4>
                            <span className="text-[10px] font-mono text-neutral-500 uppercase">Specialty</span>
                          </div>
                          <p className="text-xs text-neutral-600 dark:text-gray-300 leading-relaxed">{dish.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cultural Traditions & Festivals */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 space-y-4 shadow-sm">
                    <h3 className="text-xl font-serif font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                      <Landmark className="w-4 h-4 text-[#C5A059]" />
                      <span>Living Cultural Traditions</span>
                    </h3>

                    <div className="space-y-3">
                      {destination.foodAndCulture?.culturalTraditions.map((tradition, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3.5 p-4 rounded-2xl bg-neutral-50 dark:bg-[#080808] border border-neutral-200/60 dark:border-white/5"
                        >
                          <div className="w-6 h-6 rounded-lg bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono font-bold">
                            ✦
                          </div>
                          <p className="text-xs sm:text-sm text-neutral-700 dark:text-gray-200 leading-relaxed font-light">{tradition}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SECTION E: ESTIMATED BUDGET & BEST TIME TO VISIT */}
            {activeSection === 'budget' && (
              <motion.div
                key="budget-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#C5A059]">
                    <Coins className="w-3.5 h-3.5" />
                    <span>Planning Economics</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 dark:text-white mt-1">
                    Estimated Budget & Travel Planning
                  </h2>
                  <p className="text-neutral-600 dark:text-gray-400 text-xs sm:text-sm mt-1 max-w-2xl">
                    Transparent luxury estimates to help you architect the ideal duration, style, and luxury comfort tier.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left 2 cols: Budget Breakdown Items */}
                  <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 space-y-6 shadow-sm">
                    <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-4">
                      <div>
                        <span className="text-xs font-mono text-neutral-500 dark:text-gray-400 block uppercase">Curated Baseline</span>
                        <h3 className="text-2xl font-serif font-bold text-neutral-900 dark:text-white">{destination.startingPrice}</h3>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] dark:text-[#F3E5AB] text-xs font-mono font-bold uppercase">
                        {destination.estimatedBudget?.tier || 'Luxury'} Tier
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#080808] border border-neutral-200/60 dark:border-white/5 space-y-1">
                        <span className="text-neutral-500 dark:text-gray-400 uppercase font-mono text-[10px] block">Accommodation</span>
                        <p className="text-neutral-900 dark:text-white font-semibold">{destination.estimatedBudget?.accommodation}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#080808] border border-neutral-200/60 dark:border-white/5 space-y-1">
                        <span className="text-neutral-500 dark:text-gray-400 uppercase font-mono text-[10px] block">Activities & Guiding</span>
                        <p className="text-neutral-900 dark:text-white font-semibold">{destination.estimatedBudget?.activities}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#080808] border border-neutral-200/60 dark:border-white/5 space-y-1">
                        <span className="text-neutral-500 dark:text-gray-400 uppercase font-mono text-[10px] block">Fine Dining</span>
                        <p className="text-neutral-900 dark:text-white font-semibold">{destination.estimatedBudget?.dining}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#080808] border border-neutral-200/60 dark:border-white/5 space-y-1">
                        <span className="text-neutral-500 dark:text-gray-400 uppercase font-mono text-[10px] block">Private Chauffeur</span>
                        <p className="text-neutral-900 dark:text-white font-semibold">{destination.estimatedBudget?.privateTransport}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-[#C5A059] dark:text-[#F3E5AB] uppercase block font-bold">Daily Couple Estimate</span>
                        <span className="text-sm font-bold text-neutral-900 dark:text-white">{destination.estimatedBudget?.dailyEstimate}</span>
                      </div>
                      <span className="text-xs text-neutral-500 dark:text-gray-400 font-mono">All-inclusive guidance</span>
                    </div>
                  </div>

                  {/* Right 1 col: Best Season Guide */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 space-y-5 shadow-sm">
                    <div className="flex items-center gap-2 text-[#C5A059] dark:text-[#F3E5AB] font-serif font-bold text-lg">
                      <Calendar className="w-5 h-5 text-[#C5A059]" />
                      <span>Best Time to Visit</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#080808] border border-neutral-200/60 dark:border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-neutral-500 dark:text-gray-400 uppercase">Prime Season Window</span>
                      <p className="text-lg font-serif font-bold text-neutral-900 dark:text-white">{destination.bestTimeToVisit}</p>
                      <p className="text-xs text-neutral-600 dark:text-gray-300 mt-1">Average temperature during peak window: <strong className="text-neutral-900 dark:text-white">{destination.averageTemperature}</strong>.</p>
                    </div>

                    <button
                      id="detail-add-to-trip-budget"
                      onClick={handleAddTripClick}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#C5A059] to-[#F3E5AB] text-black font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#C5A059]/20"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Add to Trip Planner</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
      </div>

      {/* 5. BOTTOM PERSISTENT "ADD TO TRIP" CALLOUT */}
      <div className="rounded-3xl p-8 bg-neutral-900 dark:bg-gradient-to-r dark:from-[#121008] dark:via-[#0A0A0A] dark:to-[#121008] border border-[#C5A059]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl text-white">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-xs font-mono uppercase tracking-widest text-[#C5A059] font-bold">
            Tailor-Made Journey
          </span>
          <h3 className="text-2xl font-serif font-bold text-white">
            Ready to experience {destination.name}?
          </h3>
          <p className="text-xs text-gray-300">
            Let our bespoke trip architect orchestrate your private villas, verified local guides, and seamless transfers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {onBookStay && (
            <button
              id="detail-book-stay-btn"
              onClick={() => onBookStay(destination.name)}
              className="px-5 py-3 rounded-2xl bg-[#C5A059] hover:bg-[#F3E5AB] text-black text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-[#C5A059]/20"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>Book Luxury Stay</span>
            </button>
          )}
          <button
            onClick={onBack}
            className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-semibold border border-white/10"
          >
            Explore Others
          </button>
          <button
            id="detail-add-to-trip-bottom"
            onClick={handleAddTripClick}
            className="px-5 py-3 rounded-2xl bg-[#C5A059]/20 hover:bg-[#C5A059]/30 text-[#F3E5AB] text-xs font-bold uppercase tracking-wider border border-[#C5A059]/50 transition-all flex items-center justify-center gap-1.5"
          >
            {isAddedToTrip ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Added to Trip!</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4 text-gray-300" />
                <span>Add to Trip</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
