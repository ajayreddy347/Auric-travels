import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Coins,
  Sparkles,
  ArrowLeft,
  Share2,
  Check,
  CheckCircle2,
  PlusCircle,
  Heart,
  Compass,
  Calendar,
  Layers,
  Award,
  Users,
  Activity,
  Flame,
  Trees,
  Landmark,
  Utensils,
  Camera,
  HeartPulse,
  ExternalLink,
  Navigation,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ExperienceItem, ExperienceCategoryType } from '../types';
import { EXPERIENCES } from '../data/experiencesData';
import { SafeImage } from './SafeImage';
import { SeoHead } from './SeoHead';

interface ExperienceDetailViewProps {
  experience: ExperienceItem;
  onBack: () => void;
  onAddToTrip: (experienceName: string, location?: string) => void;
  onBookExperience?: (experience: ExperienceItem) => void;
  isSaved?: boolean;
  onToggleSave?: (expId: string) => void;
}

export const ExperienceDetailView: React.FC<ExperienceDetailViewProps> = ({
  experience,
  onBack,
  onAddToTrip,
  onBookExperience,
  isSaved = false,
  onToggleSave,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAddedToTrip, setIsAddedToTrip] = useState(false);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    setActiveImageIndex(0);
  }, [experience?.id]);

  const images = [
    experience.cinematicImage || experience.image,
    ...(experience.gallery ? experience.gallery.filter((g) => g !== experience.image) : []),
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
    onAddToTrip(experience.name, experience.location);
    setTimeout(() => setIsAddedToTrip(false), 3000);
  };

  // Resolve accurate coordinates strictly for the selected experience
  const resolvedCoords =
    experience.coordinates && experience.coordinates.lat !== undefined && experience.coordinates.lng !== undefined
      ? experience.coordinates
      : EXPERIENCES.find(
          (e) =>
            e.id.toLowerCase() === experience.id?.toLowerCase() ||
            e.name.toLowerCase() === experience.name?.toLowerCase()
        )?.coordinates;

  const lat = resolvedCoords?.lat;
  const lng = resolvedCoords?.lng;

  const embedMapUrl =
    lat !== undefined && lng !== undefined
      ? `https://maps.google.com/maps?q=${lat},${lng}+(${encodeURIComponent(experience.name)})&t=m&z=14&output=embed`
      : `https://maps.google.com/maps?q=${encodeURIComponent(experience.name + ', ' + (experience.formattedAddress || experience.location))}&t=m&z=14&output=embed`;

  const directionsUrl =
    experience.googleMapsUri ||
    (lat !== undefined && lng !== undefined
      ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(experience.name + ' ' + (experience.formattedAddress || experience.location))}`);

  const getCategoryIcon = (category: ExperienceCategoryType) => {
    switch (category) {
      case 'Adventure':
        return <Compass className="w-4 h-4 text-[#C5A059]" />;
      case 'Nature':
        return <Trees className="w-4 h-4 text-emerald-400" />;
      case 'Culture':
        return <Landmark className="w-4 h-4 text-amber-300" />;
      case 'Food':
        return <Utensils className="w-4 h-4 text-orange-400" />;
      case 'Sightseeing':
        return <Camera className="w-4 h-4 text-sky-400" />;
      case 'Wellness':
        return <HeartPulse className="w-4 h-4 text-rose-300" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#C5A059]" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-10 pb-16"
      id="experience-detail-view"
    >
      <SeoHead
        title={`${experience.name} — Curated Experience`}
        description={experience.shortDescription || experience.description || `Explore ${experience.name} with Auric Travels.`}
        image={experience.cinematicImage || experience.image}
        url={`https://auric-travels-y948.onrender.com/#experiences`}
      />

      {/* 1. TOP BREADCRUMB / ACTION BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 dark:border-white/10 pb-4">
        <button
          onClick={onBack}
          id="back-to-experiences-btn"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 text-neutral-700 dark:text-gray-300 hover:text-neutral-900 dark:hover:text-white text-xs font-semibold transition-all group shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#C5A059]" />
          <span>Back to All Experiences</span>
        </button>

        <div className="flex items-center gap-2.5">
          {onToggleSave && (
            <button
              onClick={() => onToggleSave(experience.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all shadow-sm ${
                isSaved
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-300'
                  : 'bg-white dark:bg-[#0D0D0D] border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-gray-300 hover:text-rose-500 hover:border-rose-500/30'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{isSaved ? 'Saved in Vault' : 'Save Experience'}</span>
            </button>
          )}

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 text-neutral-700 dark:text-gray-300 hover:text-neutral-900 dark:hover:text-white text-xs font-semibold transition-all shadow-sm"
            title="Share Experience"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500 font-semibold">Link Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. LARGE CINEMATIC HERO BANNER */}
      <div className="relative rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-200 dark:border-white/10 shadow-2xl">
        {/* Main Display Image */}
        <div className="relative h-[340px] sm:h-[480px] lg:h-[540px] w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImageIndex}
              initial={{ opacity: 0.4, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.4 }}
              transition={{ duration: 0.6 }}
              className="w-full h-full"
            >
              <SafeImage
                src={images[activeImageIndex] || experience.cinematicImage || experience.image}
                alt={experience.name}
                categoryHint={experience.category || experience.location}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Dark luxury gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-black/30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-transparent to-transparent hidden md:block pointer-events-none" />

          {/* Top category & region badges */}
          <div className="absolute top-5 left-5 sm:top-8 sm:left-8 flex flex-wrap items-center gap-2.5 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-xs font-mono font-semibold text-white">
              {getCategoryIcon(experience.category)}
              <span>{experience.category} Experience</span>
            </span>

            {experience.region && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#C5A059]/20 backdrop-blur-md border border-[#C5A059]/40 text-xs font-mono font-bold text-[#F3E5AB]">
                <Sparkles className="w-3 h-3 text-[#C5A059]" />
                <span>{experience.region} Sanctuary</span>
              </span>
            )}
          </div>

          {/* Bottom Banner Content */}
          <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300 font-mono">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>{experience.location}</span>
                {experience.rating && (
                  <>
                    <span className="text-gray-500">•</span>
                    <span className="text-[#F3E5AB] font-bold font-mono">★ {experience.rating}</span>
                    <span className="text-gray-400 text-xs">({experience.reviewsCount} reviews)</span>
                  </>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight drop-shadow-md">
                {experience.name}
              </h1>

              <p className="text-sm sm:text-base text-gray-200 line-clamp-2 max-w-2xl font-light">
                {experience.shortDescription}
              </p>
            </div>

            {/* Quick Pricing & Add to Trip / Book Action Bar in Banner */}
            <div className="shrink-0 flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end gap-3 bg-black/70 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15 shadow-xl">
              <div>
                <span className="text-[11px] font-mono uppercase text-gray-400 block tracking-wider">
                  Estimated Cost
                </span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-[#F3E5AB]">
                  {experience.estimatedPrice}
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {onBookExperience && (
                  <button
                    id="book-experience-hero-btn"
                    onClick={() => onBookExperience(experience)}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#F3E5AB] hover:from-[#d4b068] hover:to-[#fff2cc] text-black font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-[#C5A059]/25 hover:scale-102"
                  >
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>Book Experience</span>
                  </button>
                )}

                <button
                  id="add-experience-to-trip-hero-btn"
                  onClick={handleAddTripClick}
                  className="px-4 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-1.5 border border-white/10"
                >
                  {isAddedToTrip ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Added</span>
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
          </div>
        </div>

        {/* Gallery Thumbnails (if multiple images) */}
        {images.length > 1 && (
          <div className="px-6 py-4 bg-neutral-900 border-t border-white/10 flex items-center gap-3 overflow-x-auto no-scrollbar">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest shrink-0 mr-2">
              Visuals:
            </span>
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                  activeImageIndex === idx
                    ? 'border-[#C5A059] ring-2 ring-[#C5A059]/30 scale-105'
                    : 'border-white/10 opacity-60 hover:opacity-100'
                }`}
              >
                <SafeImage src={img} alt={`${experience.name} gallery view ${idx + 1}`} categoryHint={experience.category} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. KEY EXPERIENCE VITALS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 flex items-center gap-3.5 shadow-sm">
          <div className="p-2.5 rounded-xl bg-[#C5A059]/10 text-[#C5A059]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-neutral-500 dark:text-gray-400 uppercase tracking-wider block">
              Duration
            </span>
            <span className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">{experience.duration}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 flex items-center gap-3.5 shadow-sm">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-neutral-500 dark:text-gray-400 uppercase tracking-wider block">
              Estimated Rate
            </span>
            <span className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-[#F3E5AB] truncate block">
              {experience.estimatedPrice}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 flex items-center gap-3.5 shadow-sm">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-neutral-500 dark:text-gray-400 uppercase tracking-wider block">
              Ideal Timing
            </span>
            <span className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white truncate block">
              {experience.bestTime || 'October – April'}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 flex items-center gap-3.5 shadow-sm">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-neutral-500 dark:text-gray-400 uppercase tracking-wider block">
              Pace & Level
            </span>
            <span className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">
              {experience.physicalLevel || 'Moderate'}
            </span>
          </div>
        </div>
      </div>

      {/* 4. MAIN DETAIL GRID (DESCRIPTION, HIGHLIGHTS, INCLUSIONS, SIDEBAR) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Full narrative, Highlights, Inclusions */}
        <div className="lg:col-span-8 space-y-8">
          {/* Detailed Narrative */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 space-y-5 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900 dark:text-white">
                About the Experience
              </h2>
            </div>
            <p className="text-neutral-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-line font-light">
              {experience.description}
            </p>
          </div>

          {/* Highlights Section */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 space-y-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C5A059]" />
              <h3 className="text-xl font-serif font-bold text-neutral-900 dark:text-white">
                Signature Highlights
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {experience.highlights.map((hl, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200/60 dark:border-white/5 flex items-start gap-3"
                >
                  <div className="p-1 rounded-full bg-[#C5A059]/20 text-[#C5A059] shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm text-neutral-800 dark:text-gray-200 leading-snug">{hl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What is Included (if provided) */}
          {experience.included && experience.included.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 space-y-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#C5A059]" />
                <h3 className="text-xl font-serif font-bold text-neutral-900 dark:text-white">
                  Curated Inclusions & Hospitality
                </h3>
              </div>

              <div className="space-y-3">
                {experience.included.map((inc, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs sm:text-sm text-neutral-700 dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exact Experience Location & Google Maps Section */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#C5A059]" />
                  <h3 className="text-xl font-serif font-bold text-neutral-900 dark:text-white">
                    Exact Experience Location
                  </h3>
                </div>
                <p className="text-xs text-neutral-600 dark:text-gray-400 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                  <span>{experience.formattedAddress || `${experience.name}, ${experience.location}`}</span>
                </p>
              </div>

              {directionsUrl && (
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C5A059]/15 hover:bg-[#C5A059]/25 text-[#8C6D32] dark:text-[#F3E5AB] font-bold text-xs border border-[#C5A059]/30 transition-all self-start sm:self-auto"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              )}
            </div>

            <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-neutral-950">
              <iframe
                title={`Map of ${experience.name}`}
                src={embedMapUrl}
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Trip Architect Card */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gradient-to-b dark:from-[#14120A] dark:via-[#0D0D0D] dark:to-[#0A0A0A] border border-neutral-200 dark:border-[#C5A059]/40 shadow-xl space-y-6 text-neutral-900 dark:text-white">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#8C6D32] dark:text-[#F3E5AB] text-[10px] font-mono uppercase tracking-wider mb-3 font-bold">
                <Sparkles className="w-3 h-3 text-[#C5A059]" />
                <span>Bespoke Travel Booking</span>
              </div>
              <h3 className="text-2xl font-serif font-bold text-neutral-900 dark:text-white">
                Add to Your Itinerary
              </h3>
              <p className="text-neutral-600 dark:text-gray-400 text-xs mt-1.5 leading-relaxed">
                Incorporate this curated pursuit seamlessly into your customized journey plan.
              </p>
            </div>

            <div className="space-y-3 border-y border-neutral-200 dark:border-white/10 py-4">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500 dark:text-gray-400">Experience Type</span>
                <span className="text-neutral-900 dark:text-white font-semibold">{experience.category}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500 dark:text-gray-400">Location</span>
                <span className="text-neutral-900 dark:text-white font-semibold truncate max-w-[180px]">{experience.location}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500 dark:text-gray-400">Duration</span>
                <span className="text-neutral-900 dark:text-white font-semibold">{experience.duration}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500 dark:text-gray-400">Group Format</span>
                <span className="text-neutral-900 dark:text-white font-semibold">{experience.groupType || 'Private / VIP'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500 dark:text-gray-400">Estimated Cost</span>
                <span className="text-[#8C6D32] dark:text-[#F3E5AB] font-mono font-bold">{experience.estimatedPrice}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {onBookExperience && (
                <button
                  id="book-experience-sidebar-btn"
                  onClick={() => onBookExperience(experience)}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#C5A059] to-[#F3E5AB] hover:from-[#d4b068] hover:to-[#fff2cc] text-black font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#C5A059]/25"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Book Experience Now</span>
                </button>
              )}

              <button
                id="add-experience-to-trip-sidebar-btn"
                onClick={handleAddTripClick}
                className="w-full py-3 rounded-2xl bg-neutral-100 dark:bg-white/10 hover:bg-neutral-200 dark:hover:bg-white/20 text-neutral-800 dark:text-white font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 border border-neutral-200 dark:border-white/10"
              >
                {isAddedToTrip ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Added to Trip Planner!</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4 text-neutral-500 dark:text-gray-300" />
                    <span>Add to Trip Planner</span>
                  </>
                )}
              </button>

              <button
                onClick={onBack}
                className="w-full py-2.5 rounded-2xl bg-neutral-100 dark:bg-black/40 hover:bg-neutral-200 dark:hover:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-gray-300 hover:text-neutral-950 dark:hover:text-white font-semibold text-xs transition-all"
              >
                Browse Other Experiences
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
