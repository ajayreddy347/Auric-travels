import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Thermometer,
  Star,
  Sparkles,
  Heart,
  Check,
  ArrowRight,
  Share2,
  Compass,
  Landmark,
  Clock,
  Utensils,
  Coins,
  CheckCircle2,
  PlusCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Destination } from '../types';
import { SafeImage } from './SafeImage';
import { SeoHead } from './SeoHead';

interface DestinationModalProps {
  destination: Destination | null;
  isOpen: boolean;
  onClose: () => void;
  onPlanTripForDestination: (destName: string) => void;
  onBookStay?: (destName: string) => void;
  isSaved: boolean;
  onToggleSave: (destId: string) => void;
}

export const DestinationModal: React.FC<DestinationModalProps> = ({
  destination,
  isOpen,
  onClose,
  onPlanTripForDestination,
  onBookStay,
  isSaved,
  onToggleSave,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'attractions' | 'things-to-do' | 'food-culture' | 'budget' | 'itinerary'
  >('overview');
  const [copied, setCopied] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const contentScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveImageIndex(0);
      setActiveTab('overview');
      if (contentScrollRef.current) {
        contentScrollRef.current.scrollTop = 0;
      }
    }
  }, [destination?.id, isOpen]);

  if (!isOpen || !destination) return null;

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

  const handleAddTrip = () => {
    setIsAdded(true);
    onPlanTripForDestination(destination.name);
    setTimeout(() => setIsAdded(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-4xl bg-white dark:bg-[#0A0A0A] border border-neutral-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl my-auto text-neutral-900 dark:text-white max-h-[90vh] flex flex-col"
        >
          <SeoHead
            title={`${destination.name} — Luxury Bespoke Travel`}
            description={destination.overviewLong || destination.description || destination.tagline}
            image={destination.cinematicImage || destination.image}
            url={`https://auric-travels-y948.onrender.com/#destinations`}
          />

          {/* Top Floating Controls */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <button
              onClick={() => onToggleSave(destination.id)}
              className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
                isSaved
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                  : 'bg-black/60 border-white/10 text-white hover:text-rose-400'
              }`}
              title={isSaved ? 'Saved to Wishlist' : 'Save to Wishlist'}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-black/60 border border-white/10 text-white hover:text-[#C5A059] backdrop-blur-md transition-all"
              title="Share link"
            >
              {copied ? <Check className="w-4 h-4 text-[#C5A059]" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-black/60 border border-white/10 text-white hover:text-white hover:bg-black/80 backdrop-blur-md transition-all"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Hero Banner & Gallery */}
          <div className="relative h-64 sm:h-80 w-full shrink-0 overflow-hidden bg-neutral-900">
            <SafeImage
              src={images[activeImageIndex] || destination.cinematicImage || destination.image}
              alt={destination.name}
              categoryHint={destination.category || destination.name}
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

            {/* Bottom Floating Info inside Banner */}
            <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 border border-white/10 text-[#F3E5AB] text-xs font-semibold backdrop-blur-md mb-2 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>
                    {destination.country} {destination.state ? `· ${destination.state}` : ''}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                  {destination.name}
                </h2>
              </div>

              {images.length > 1 && (
                <div className="flex items-center gap-1.5">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-11 h-8 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImageIndex === idx
                          ? 'border-[#C5A059] scale-105'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <SafeImage src={img} alt="thumb" categoryHint={destination.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-6 py-3 bg-neutral-50 dark:bg-[#050505] border-y border-neutral-200 dark:border-white/5 text-xs">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/5">
              <Star className="w-3.5 h-3.5 text-[#C5A059] fill-[#C5A059] shrink-0" />
              <div>
                <div className="font-semibold text-neutral-900 dark:text-white">{destination.rating} / 5.0</div>
                <div className="text-[10px] text-neutral-500 dark:text-gray-400">({destination.reviewsCount} reviews)</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/5">
              <Calendar className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
              <div>
                <div className="font-semibold text-neutral-900 dark:text-white">Best Season</div>
                <div className="text-[10px] text-neutral-500 dark:text-gray-400">{destination.bestTimeToVisit}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/5">
              <Thermometer className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
              <div>
                <div className="font-semibold text-neutral-900 dark:text-white">Avg. Climate</div>
                <div className="text-[10px] text-neutral-500 dark:text-gray-400">{destination.averageTemperature}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/5">
              <Coins className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
              <div>
                <div className="font-semibold text-neutral-900 dark:text-white">{destination.startingPrice}</div>
                <div className="text-[10px] text-neutral-500 dark:text-gray-400">Estimate</div>
              </div>
            </div>
          </div>

          {/* Modal Navigation Tabs */}
          <div className="flex items-center gap-2 px-6 pt-3 border-b border-neutral-200 dark:border-white/5 overflow-x-auto custom-scrollbar">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'attractions', label: 'Top Attractions' },
              { id: 'things-to-do', label: 'Things to Do' },
              { id: 'food-culture', label: 'Food & Culture' },
              { id: 'budget', label: 'Budget Breakdown' },
              { id: 'itinerary', label: 'Sample Route' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-2.5 px-2 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#C5A059] text-[#C5A059]'
                    : 'border-transparent text-neutral-500 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Modal Content Scroll Area */}
          <div ref={contentScrollRef} className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-neutral-700 dark:text-gray-300">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">The Experience</h4>
                  <p className="leading-relaxed text-neutral-700 dark:text-gray-300">
                    {destination.overviewLong || destination.description}
                  </p>
                </div>

                {/* Vibe Tags */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-mono font-bold text-[#C5A059] mb-2">
                    Atmospheric Persona
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {destination.vibe.map((v, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-[#0D0D0D] text-neutral-800 dark:text-gray-200 text-xs border border-neutral-200 dark:border-white/5 font-medium"
                      >
                        ✦ {v}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Location & Google Maps Link */}
                {destination.formattedAddress && (
                  <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] uppercase font-mono text-neutral-500 dark:text-gray-400 block">Location Coordinates</span>
                        <p className="text-xs text-neutral-900 dark:text-white font-medium">{destination.formattedAddress}</p>
                      </div>
                    </div>
                    {destination.googleMapsUri && (
                      <a
                        href={destination.googleMapsUri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-[#C5A059]/20 hover:bg-[#C5A059]/30 text-[#8C6D32] dark:text-[#F3E5AB] text-xs font-semibold border border-[#C5A059]/40 flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Google Maps</span>
                      </a>
                    )}
                  </div>
                )}

                {/* Highlights */}
                <div>
                  <h4 className="text-base font-semibold text-neutral-900 dark:text-white mb-3">Auric Signature Highlights</h4>
                  <div className="space-y-2.5">
                    {destination.highlights.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-2xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/5"
                      >
                        <div className="w-6 h-6 rounded-full bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono font-bold">
                          {i + 1}
                        </div>
                        <span className="text-neutral-800 dark:text-gray-200 font-medium">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'attractions' && (
              <div className="space-y-4">
                <h4 className="text-base font-semibold text-neutral-900 dark:text-white">Must-Visit Landmarks</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {destination.topAttractions?.map((attr, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/10 overflow-hidden space-y-2.5 p-4"
                    >
                      <div className="h-32 w-full rounded-xl overflow-hidden">
                        <SafeImage
                          src={attr.image || destination.image}
                          alt={attr.name}
                          categoryHint={attr.tag || destination.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <h5 className="font-semibold text-neutral-900 dark:text-white text-xs sm:text-sm">{attr.name}</h5>
                          {attr.tag && (
                            <span className="text-[10px] font-mono text-[#8C6D32] dark:text-[#F3E5AB] bg-[#C5A059]/20 px-2 py-0.5 rounded">
                              {attr.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-600 dark:text-gray-400 mt-1 leading-relaxed">{attr.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'things-to-do' && (
              <div className="space-y-4">
                <h4 className="text-base font-semibold text-neutral-900 dark:text-white">Things to Do & Curated Activities</h4>
                <div className="space-y-3">
                  {destination.thingsToDo?.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-[#C5A059]/20 text-[#8C6D32] dark:text-[#F3E5AB] text-[10px] font-mono font-bold">
                            {item.type}
                          </span>
                          <span className="text-xs font-semibold text-neutral-900 dark:text-white">{item.title}</span>
                        </div>
                        <p className="text-xs text-neutral-600 dark:text-gray-400">{item.description}</p>
                      </div>
                      <span className="text-xs font-mono text-neutral-500 dark:text-gray-400 whitespace-nowrap flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#C5A059]" />
                        {item.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'food-culture' && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/10 space-y-3">
                  <h4 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-[#C5A059]" />
                    <span>Signature Regional Dishes</span>
                  </h4>
                  <div className="space-y-2">
                    {destination.foodAndCulture?.signatureDishes.map((dish, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/5">
                        <span className="font-semibold text-[#8C6D32] dark:text-[#F3E5AB] text-xs block">{dish.name}</span>
                        <p className="text-xs text-neutral-700 dark:text-gray-300 mt-0.5">{dish.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/10 space-y-3">
                  <h4 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-[#C5A059]" />
                    <span>Living Cultural Traditions</span>
                  </h4>
                  <div className="space-y-2">
                    {destination.foodAndCulture?.culturalTraditions.map((trad, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-800 dark:text-gray-200">
                        <span className="text-[#C5A059] font-bold">✦</span>
                        <span>{trad}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'budget' && (
              <div className="space-y-4">
                <h4 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Coins className="w-4 h-4 text-[#C5A059]" />
                  <span>Estimated Budget & Luxury Inclusions</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/10">
                    <span className="text-neutral-500 dark:text-gray-400 uppercase font-mono text-[10px] block">Accommodation Tier</span>
                    <p className="text-neutral-900 dark:text-white font-semibold mt-1">{destination.estimatedBudget?.accommodation}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/10">
                    <span className="text-neutral-500 dark:text-gray-400 uppercase font-mono text-[10px] block">Activities & Guiding</span>
                    <p className="text-neutral-900 dark:text-white font-semibold mt-1">{destination.estimatedBudget?.activities}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/10">
                    <span className="text-neutral-500 dark:text-gray-400 uppercase font-mono text-[10px] block">Fine Dining</span>
                    <p className="text-neutral-900 dark:text-white font-semibold mt-1">{destination.estimatedBudget?.dining}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/10">
                    <span className="text-neutral-500 dark:text-gray-400 uppercase font-mono text-[10px] block">Private Transport</span>
                    <p className="text-neutral-900 dark:text-white font-semibold mt-1">{destination.estimatedBudget?.privateTransport}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-between text-xs">
                  <span className="font-mono text-[#8C6D32] dark:text-[#F3E5AB]">Daily Couple Guidance</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{destination.estimatedBudget?.dailyEstimate}</span>
                </div>
              </div>
            )}

            {activeTab === 'itinerary' && (
              <div className="space-y-4">
                <p className="text-xs text-neutral-500 dark:text-gray-400">
                  Every Auric itinerary is 100% customizable. Here is a curated sample sequence:
                </p>

                <div className="relative pl-6 border-l-2 border-[#C5A059]/30 space-y-5">
                  {destination.sampleItinerary.map((item) => (
                    <div key={item.day} className="relative">
                      <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#C5A059] border-4 border-white dark:border-[#0A0A0A]" />
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold font-mono uppercase tracking-wider text-[#C5A059]">
                          Day {item.day}
                        </span>
                        <span className="text-sm font-semibold text-neutral-900 dark:text-white">{item.title}</span>
                      </div>
                      <p className="text-xs text-neutral-700 dark:text-gray-300 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal Action Footer with "Add to Trip" button */}
          <div className="p-4 sm:p-5 bg-neutral-50 dark:bg-[#050505] border-t border-neutral-200 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="text-xs text-neutral-600 dark:text-gray-400 text-center sm:text-left">
              Craft your bespoke voyage for <span className="text-neutral-900 dark:text-white font-semibold">{destination.name}</span>.
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 w-full sm:w-auto">
              {onBookStay && (
                <button
                  id="modal-book-stay-btn"
                  onClick={() => {
                    onClose();
                    onBookStay(destination.name);
                  }}
                  className="px-4 py-2 rounded-full bg-[#C5A059] hover:bg-[#F3E5AB] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-[#C5A059]/20"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Book Stay</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-full border border-neutral-300 dark:border-white/10 text-neutral-700 dark:text-gray-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-white/5 text-xs font-medium"
              >
                Close
              </button>
              {/* Prominent "Add to Trip" Button */}
              <button
                id="modal-add-to-trip-btn"
                onClick={handleAddTrip}
                className="px-4 py-2 rounded-full bg-neutral-900 dark:bg-white/10 hover:bg-black dark:hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
              >
                {isAdded ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Added!</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-3.5 h-3.5 text-neutral-300" />
                    <span>Add to Trip</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
