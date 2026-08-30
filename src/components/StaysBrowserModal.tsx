import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Building,
  MapPin,
  Star,
  Sparkles,
  BedDouble,
  ArrowRight,
  ShieldCheck,
  Search,
  Check,
  RotateCcw
} from 'lucide-react';
import { LUXURY_STAYS } from '../data/staysData';
import { LuxuryStayItem } from '../types';
import { SafeImage } from './SafeImage';
import { SeoHead } from './SeoHead';

interface StaysBrowserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStayToBook: (stay: LuxuryStayItem) => void;
}

export const StaysBrowserModal: React.FC<StaysBrowserModalProps> = ({
  isOpen,
  onClose,
  onSelectStayToBook,
}) => {
  const [activeRegion, setActiveRegion] = useState<'All' | 'Karnataka' | 'Europe' | 'Asia' | 'Africa'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const contentScrollRef = useRef<HTMLDivElement>(null);

  // Reset scroll to top when modal opens or region/search changes
  useEffect(() => {
    if (isOpen && contentScrollRef.current) {
      contentScrollRef.current.scrollTop = 0;
    }
  }, [isOpen, activeRegion]);

  if (!isOpen) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contentScrollRef.current) {
      contentScrollRef.current.scrollTop = 0;
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (contentScrollRef.current) {
      contentScrollRef.current.scrollTop = 0;
    }
  };

  const filteredStays = LUXURY_STAYS.filter((stay) => {
    const matchesRegion =
      activeRegion === 'All' ||
      stay.region === activeRegion ||
      (activeRegion === 'Karnataka' &&
        (stay.location.includes('Karnataka') ||
          stay.region === 'Karnataka' ||
          stay.destinationName.includes('Karnataka')));
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesRegion;

    const matchesSearch =
      stay.name.toLowerCase().includes(q) ||
      stay.location.toLowerCase().includes(q) ||
      stay.destinationName.toLowerCase().includes(q) ||
      stay.country.toLowerCase().includes(q) ||
      stay.region.toLowerCase().includes(q) ||
      stay.tagline.toLowerCase().includes(q) ||
      (stay.badge && stay.badge.toLowerCase().includes(q)) ||
      (stay.amenities && stay.amenities.some((a) => a.toLowerCase().includes(q)));

    return matchesRegion && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#0D0D0D] border border-[#C5A059]/40 rounded-3xl shadow-2xl overflow-hidden text-white my-auto max-h-[94vh] flex flex-col">
        <SeoHead
          title="Auric Luxury Stays & Sanctuaries — Auric Travels"
          description="Discover palatial suites, serene tea estate manors, and private island villas curated by Auric Travels."
          url="https://auric-travels-y948.onrender.com/#stay"
        />

        {/* Top Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/80 sticky top-0 z-20 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-widest block">
                Auric Luxury Hospitality
              </span>
              <h2 className="text-base sm:text-lg font-serif font-bold text-white">
                Select a Luxury Stay & Sanctuary
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auric Stay Cinematic Video Showcase */}
        <div className="relative h-28 sm:h-40 md:h-48 w-full overflow-hidden bg-black shrink-0 border-b border-white/10">
          <video
            src="/videos/auric-stay.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"
            className="w-full h-full object-cover block"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-black/40 to-black/20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent pointer-events-none" />
          <div className="absolute bottom-2.5 sm:bottom-3 left-4 sm:left-6 right-4 sm:right-6 flex items-end justify-between z-10">
            <div className="space-y-0.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#F3E5AB] text-[10px] font-mono uppercase font-bold">
                <Sparkles className="w-3 h-3 text-[#C5A059]" />
                <span>Bespoke Stays & Private Villas</span>
              </div>
              <h3 className="text-sm sm:text-lg font-serif font-bold text-white drop-shadow">
                Curated Luxury Sanctuaries & Palace Suites
              </h3>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-4 sm:px-6 py-3.5 bg-[#080808] border-b border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shrink-0">
          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto custom-scrollbar pb-1 md:pb-0">
            {(['All', 'Karnataka', 'Europe', 'Asia', 'Africa'] as const).map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setActiveRegion(region)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  activeRegion === region
                    ? 'bg-[#C5A059] text-black font-bold shadow-sm'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {region === 'Karnataka' ? 'Karnataka Sanctuaries' : region}
              </button>
            ))}
          </div>

          {/* Search Form with Functional Button */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2 w-full md:w-auto"
            id="auric-stay-search-form"
          >
            <div className="relative flex-1 md:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="auric-stay-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hotel or destination..."
                className="w-full bg-[#121212] border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C5A059] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-white text-xs rounded-full hover:bg-white/10"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              id="auric-stay-search-btn"
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#C5A059] hover:bg-[#F3E5AB] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-[#C5A059]/20 shrink-0 hover:scale-102 active:scale-98"
            >
              <Search className="w-3.5 h-3.5 text-black" />
              <span>Search</span>
            </button>
          </form>
        </div>

        {/* Scrollable Grid of Stays */}
        <div
          ref={contentScrollRef}
          className="overflow-y-auto p-4 sm:p-6 space-y-4 flex-1 min-h-0 custom-scrollbar overscroll-contain pb-12 sm:pb-8"
        >
          {filteredStays.length === 0 ? (
            <div className="p-8 sm:p-12 text-center space-y-3 bg-white/[0.02] border border-white/5 rounded-2xl my-4">
              <Building className="w-8 h-8 text-[#C5A059]/50 mx-auto" />
              <h4 className="text-base font-serif font-bold text-white">No Luxury Sanctuaries Found</h4>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                We could not find any stays matching &ldquo;{searchQuery}&rdquo; in{' '}
                {activeRegion === 'All' ? 'any region' : activeRegion}.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveRegion('All');
                }}
                className="px-4 py-2 rounded-xl bg-[#C5A059] hover:bg-[#F3E5AB] text-black font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center gap-1.5 mt-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {filteredStays.map((stay) => (
                <div
                  key={stay.id}
                  className="rounded-2xl bg-[#121212] border border-white/10 hover:border-[#C5A059]/50 overflow-hidden flex flex-col justify-between transition-all group shadow-md"
                >
                  <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-black shrink-0">
                    <SafeImage
                      src={stay.image}
                      alt={stay.name}
                      categoryHint={stay.region || stay.destinationName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent pointer-events-none" />

                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-sm text-[#F3E5AB] text-[10px] font-mono border border-white/10">
                      {stay.badge || stay.region}
                    </div>

                    <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-sm text-amber-300 text-[10px] font-mono flex items-center gap-1 border border-white/10">
                      <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                      <span>{stay.rating}</span>
                    </div>

                    <div className="absolute bottom-2.5 left-3 right-3">
                      <div className="flex items-center gap-1 text-[11px] text-[#C5A059] font-mono">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{stay.location}</span>
                      </div>
                      <h3 className="text-base font-serif font-bold text-white truncate">
                        {stay.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                      {stay.tagline}
                    </p>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-gray-400 block uppercase">Starting Rate</span>
                        <span className="text-sm font-bold font-mono text-[#F3E5AB]">
                          {stay.startingPriceDisplay}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectStayToBook(stay);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#C5A059] hover:bg-[#F3E5AB] text-black font-bold uppercase tracking-wider text-xs transition-all flex items-center gap-1.5 shadow-md shadow-[#C5A059]/20 hover:scale-102 active:scale-98 shrink-0"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-black" />
                        <span>Book Stay</span>
                        <ArrowRight className="w-3.5 h-3.5 text-black" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
