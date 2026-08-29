import React, { useState } from 'react';
import { Sparkles, Mountain, Waves, Landmark, Compass, Heart, ArrowRight, Check, Star, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TRAVEL_MOODS, DESTINATIONS } from '../data/mockData';
import { Destination } from '../types';
import { SafeImage } from './SafeImage';

interface PersonalizedDiscoveryProps {
  onSelectDestination: (dest: Destination) => void;
  onStartPlanningMood: (moodName: string) => void;
}

export const PersonalizedDiscovery: React.FC<PersonalizedDiscoveryProps> = ({
  onSelectDestination,
  onStartPlanningMood,
}) => {
  const [activeMoodId, setActiveMoodId] = useState<string>('coastal-luxury');

  const activeMood = TRAVEL_MOODS.find((m) => m.id === activeMoodId) || TRAVEL_MOODS[0];

  const matchingDestinations = DESTINATIONS.filter((dest) =>
    activeMood.recommendedDestinationIds.includes(dest.id)
  );

  const getMoodIcon = (iconName: string) => {
    switch (iconName) {
      case 'Mountain':
        return <Mountain className="w-4 h-4" />;
      case 'Waves':
        return <Waves className="w-4 h-4" />;
      case 'Landmark':
        return <Landmark className="w-4 h-4" />;
      case 'Compass':
        return <Compass className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <section id="discovery" className="py-24 bg-neutral-50 dark:bg-[#050505] text-neutral-900 dark:text-white relative overflow-hidden transition-colors">
      {/* Ambient Glow */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-[#C5A059] blur-[150px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-2 font-mono text-xs text-[#C5A059] tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tailored Intuition</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-neutral-900 dark:text-white tracking-tight">
              Where do you want to <span className="text-[#C5A059] italic font-normal">go next?</span>
            </h2>
            <p className="mt-3 text-neutral-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
              Select your travel disposition to reveal intelligent recommendations attuned to your rhythm, passions, and aesthetic preferences.
            </p>
          </div>

          <button
            id="personalized-plan-journey-btn"
            onClick={() => onStartPlanningMood(activeMood.name)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C5A059] hover:bg-[#F3E5AB] text-black font-bold text-xs uppercase tracking-wider transition-all self-start md:self-auto shadow-lg shadow-[#C5A059]/20 hover:scale-105"
          >
            <span>Plan in this Style</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Travel Disposition / Mood Selector Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          {TRAVEL_MOODS.map((mood) => {
            const isSelected = mood.id === activeMoodId;
            return (
              <button
                key={mood.id}
                id={`mood-selector-${mood.id}`}
                onClick={() => setActiveMoodId(mood.id)}
                className={`flex flex-col text-left p-4 rounded-2xl border transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#C5A059]/15 border-[#C5A059] shadow-lg shadow-[#C5A059]/10 scale-[1.02]'
                    : 'bg-white dark:bg-[#0A0A0A] border-neutral-200 dark:border-white/5 hover:bg-neutral-100 dark:hover:bg-white/5 hover:border-neutral-300 dark:hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-[#C5A059] text-black' : 'bg-neutral-100 dark:bg-white/5 text-[#C5A059]'
                    }`}
                  >
                    {getMoodIcon(mood.icon)}
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-ping" />
                  )}
                </div>

                <span className={`text-xs font-bold ${isSelected ? 'text-[#C5A059] dark:text-[#F3E5AB]' : 'text-neutral-800 dark:text-gray-200'}`}>
                  {mood.name}
                </span>
                <span className="text-[11px] text-neutral-500 dark:text-gray-400 line-clamp-2 mt-1">
                  {mood.description}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Match Spotlight Banner */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMood.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Top Match Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#0A0A0A] border border-neutral-200 dark:border-white/5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 rounded-full bg-[#C5A059] text-black font-bold text-xs">
                  98% Match
                </div>
                <span className="text-sm font-medium text-neutral-800 dark:text-gray-200">
                  Recommended for <strong>{activeMood.name}</strong>
                </span>
              </div>
              <span className="text-xs text-neutral-500 dark:text-gray-400 font-mono">
                {matchingDestinations.length} signature sanctuaries hand-selected
              </span>
            </div>

            {/* Recommended Matching Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {matchingDestinations.map((dest, idx) => (
                <div
                  key={dest.id}
                  id={`discovery-card-${dest.id}`}
                  className="group rounded-2xl bg-white dark:bg-[#0A0A0A] border border-neutral-200 dark:border-white/5 overflow-hidden hover:border-[#C5A059]/40 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 flex flex-col shadow-sm"
                >
                  <div className="relative h-56 w-full overflow-hidden bg-neutral-100 dark:bg-[#050505]">
                    <SafeImage
                      src={dest.image}
                      alt={dest.name}
                      categoryHint={dest.category || dest.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm text-[11px] font-semibold text-white flex items-center gap-1 border border-white/10">
                      <MapPin className="w-3 h-3 text-[#C5A059]" />
                      {dest.country}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-[#C5A059] font-bold">
                        <Star className="w-3.5 h-3.5 fill-[#C5A059]" />
                        <span>{dest.rating}</span>
                      </div>
                      <span className="text-white/90 font-medium">{dest.bestTimeToVisit.split('&')[0]}</span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-xs font-semibold text-[#C5A059] uppercase tracking-wider font-mono">
                      {dest.name}
                    </p>
                    <h3 className="text-lg font-serif font-bold text-neutral-900 dark:text-white group-hover:text-[#C5A059] transition-colors">
                      {dest.country}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-gray-400 line-clamp-2 mt-1 mb-4">
                      {dest.description}
                    </p>

                    <div className="mt-auto pt-3 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between">
                      <div className="text-xs">
                        <span className="text-neutral-400 dark:text-gray-500 text-[10px] uppercase block font-mono">Starting</span>
                        <span className="font-bold text-neutral-900 dark:text-white">{dest.startingPrice}</span>
                      </div>

                      <button
                        onClick={() => onSelectDestination(dest)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-100 dark:bg-white/5 hover:bg-[#C5A059] hover:text-black text-neutral-700 dark:text-gray-200 text-xs font-semibold border border-neutral-200 dark:border-white/5 transition-colors"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
