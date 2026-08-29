import React, { useState } from 'react';
import {
  X,
  Plus,
  Search,
  Sparkles,
  Compass,
  Landmark,
  Trees,
  Utensils,
  Camera,
  HeartPulse,
  Clock,
  MapPin,
  Check,
  DollarSign,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EXPERIENCES } from '../data/experiencesData';
import { DESTINATIONS } from '../data/mockData';
import {
  ItineraryActivity,
  TimeSlot,
  ExperienceCategoryType,
  Destination,
  ExperienceItem,
} from '../types';
import { formatBilingualPrice, parseEstimatedCostToUSD, getStrictExperiencesForDestination } from '../utils/tripGenerator';
import { SafeImage } from './SafeImage';

interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetDayNumber: number;
  destinationName?: string;
  onAddActivity: (dayNumber: number, activity: ItineraryActivity) => void;
}

export const AddActivityModal: React.FC<AddActivityModalProps> = ({
  isOpen,
  onClose,
  targetDayNumber,
  destinationName = '',
  onAddActivity,
}) => {
  const [activeTab, setActiveTab] = useState<'experiences' | 'attractions' | 'custom'>('experiences');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot>('morning');

  // Custom activity form state
  const [customTitle, setCustomTitle] = useState('');
  const [customLocation, setCustomLocation] = useState(destinationName || '');
  const [customTimeLabel, setCustomTimeLabel] = useState('09:00 AM – 11:30 AM');
  const [customCategory, setCustomCategory] = useState<ExperienceCategoryType | 'Dining' | 'Transit' | 'Leisure' | 'Sightseeing'>('Sightseeing');
  const [customCostUSD, setCustomCostUSD] = useState<number>(50);
  const [customDescription, setCustomDescription] = useState('');

  if (!isOpen) return null;

  // Filter attractions from matched or all destinations
  const cleanDest = destinationName.toLowerCase().trim();
  const matchedDest = DESTINATIONS.find(
    (d) =>
      d.name.toLowerCase().includes(cleanDest) ||
      cleanDest.includes(d.name.toLowerCase()) ||
      d.id.toLowerCase() === cleanDest
  );

  // Scoped experiences for this destination
  const scopedDestinationExperiences = getStrictExperiencesForDestination(matchedDest, destinationName);

  // Filter experiences: prioritize destination matches unless user specifically searches globally
  const experiencesPool = scopedDestinationExperiences.length > 0 && !searchQuery.trim()
    ? scopedDestinationExperiences
    : EXPERIENCES;

  const filteredExperiences = experiencesPool.filter((exp) => {
    const matchesSearch =
      !searchQuery.trim() ||
      exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || exp.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const availableAttractions = (matchedDest ? matchedDest.topAttractions : DESTINATIONS.flatMap((d) => d.topAttractions)).filter(
    (attr) =>
      !searchQuery.trim() ||
      attr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attr.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectExperience = (exp: ExperienceItem) => {
    const costNum = parseEstimatedCostToUSD(exp.estimatedPrice);
    const newActivity: ItineraryActivity = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timeSlot: selectedTimeSlot,
      timeLabel: selectedTimeSlot === 'morning' ? '08:30 AM – 11:30 AM' : selectedTimeSlot === 'afternoon' ? '01:00 PM – 04:00 PM' : selectedTimeSlot === 'evening' ? '05:30 PM – 07:30 PM' : '08:00 PM – 10:30 PM',
      title: exp.name,
      description: exp.shortDescription || exp.description,
      category: exp.category,
      location: exp.location,
      estimatedCost: costNum,
      costDisplay: exp.estimatedPrice || formatBilingualPrice(costNum),
      sourceType: 'experience',
      image: exp.image,
      duration: exp.duration,
      included: exp.included,
    };
    onAddActivity(targetDayNumber, newActivity);
    onClose();
  };

  const handleSelectAttraction = (attr: { name: string; description: string; image?: string; tag?: string }) => {
    const newActivity: ItineraryActivity = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timeSlot: selectedTimeSlot,
      timeLabel: selectedTimeSlot === 'morning' ? '09:00 AM – 11:30 AM' : selectedTimeSlot === 'afternoon' ? '02:00 PM – 04:30 PM' : selectedTimeSlot === 'evening' ? '05:00 PM – 07:00 PM' : '08:00 PM – 10:00 PM',
      title: `Guided Exploration: ${attr.name}`,
      description: attr.description,
      category: (attr.tag as any) || 'Sightseeing',
      location: `${attr.name}, ${destinationName || 'Sanctuary'}`,
      estimatedCost: 45,
      costDisplay: formatBilingualPrice(45),
      sourceType: 'attraction',
      image: attr.image,
      duration: '2.5 Hours',
      included: ['Private skip-the-line permits', 'Licensed scholar guide'],
    };
    onAddActivity(targetDayNumber, newActivity);
    onClose();
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const newActivity: ItineraryActivity = {
      id: `act-custom-${Date.now()}`,
      timeSlot: selectedTimeSlot,
      timeLabel: customTimeLabel || 'Flexible Time',
      title: customTitle.trim(),
      description: customDescription.trim() || 'Custom bespoke activity arranged by voyager.',
      category: customCategory,
      location: customLocation.trim() || destinationName || 'Local Landmark',
      estimatedCost: customCostUSD,
      costDisplay: formatBilingualPrice(customCostUSD),
      sourceType: 'custom',
      duration: 'Flexible',
      included: ['Personalized guest arrangement'],
    };

    onAddActivity(targetDayNumber, newActivity);
    onClose();
  };

  const categories = ['All', 'Adventure', 'Nature', 'Culture', 'Food', 'Sightseeing', 'Wellness'];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-3xl bg-white dark:bg-[#0C0C0C] border border-neutral-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl my-auto text-neutral-900 dark:text-white flex flex-col max-h-[88vh]"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-neutral-200 dark:border-white/10 flex items-center justify-between bg-neutral-50 dark:bg-[#070707]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C5A059]/15 text-[#8B6B23] dark:text-[#C5A059] flex items-center justify-center border border-[#C5A059]/30">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
                  Add Activity to Day {targetDayNumber}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-gray-400">
                  Select from curated experiences, iconic attractions, or add your custom pursuit.
                </p>
              </div>
            </div>

            <button
              id="close-add-activity-modal-btn"
              onClick={onClose}
              className="p-2 rounded-full bg-neutral-200/60 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Time Slot Selector */}
          <div className="px-5 sm:px-6 py-3 bg-neutral-100/70 dark:bg-[#080808] border-b border-neutral-200 dark:border-white/5 flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-gray-400 shrink-0 mr-1 font-semibold">
              Target Slot:
            </span>
            {[
              { slot: 'morning' as TimeSlot, label: '🌅 Morning' },
              { slot: 'afternoon' as TimeSlot, label: '☀️ Afternoon' },
              { slot: 'evening' as TimeSlot, label: '🌇 Evening' },
              { slot: 'night' as TimeSlot, label: '🌙 Night' },
            ].map((item) => (
              <button
                key={item.slot}
                onClick={() => setSelectedTimeSlot(item.slot)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all shrink-0 ${
                  selectedTimeSlot === item.slot
                    ? 'bg-[#C5A059] text-black font-bold shadow-sm shadow-[#C5A059]/30'
                    : 'bg-neutral-200/80 dark:bg-white/5 text-neutral-700 dark:text-gray-300 hover:bg-neutral-300 dark:hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#0A0A0A]">
            <button
              id="tab-experiences"
              onClick={() => setActiveTab('experiences')}
              className={`flex-1 py-3 text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 border-b-2 ${
                activeTab === 'experiences'
                  ? 'border-[#C5A059] text-[#8B6B23] dark:text-[#F3E5AB] bg-neutral-100 dark:bg-white/5'
                  : 'border-transparent text-neutral-500 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span>Curated Experiences</span>
            </button>

            <button
              id="tab-attractions"
              onClick={() => setActiveTab('attractions')}
              className={`flex-1 py-3 text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 border-b-2 ${
                activeTab === 'attractions'
                  ? 'border-[#C5A059] text-[#8B6B23] dark:text-[#F3E5AB] bg-neutral-100 dark:bg-white/5'
                  : 'border-transparent text-neutral-500 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Landmark className="w-4 h-4 text-[#C5A059]" />
              <span>Top Attractions</span>
            </button>

            <button
              id="tab-custom"
              onClick={() => setActiveTab('custom')}
              className={`flex-1 py-3 text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 border-b-2 ${
                activeTab === 'custom'
                  ? 'border-[#C5A059] text-[#8B6B23] dark:text-[#F3E5AB] bg-neutral-100 dark:bg-white/5'
                  : 'border-transparent text-neutral-500 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Plus className="w-4 h-4 text-[#C5A059]" />
              <span>Custom Activity</span>
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {/* Search & Category filter for experiences and attractions */}
            {activeTab !== 'custom' && (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-gray-400" />
                  <input
                    id="search-modal-activities-input"
                    type="text"
                    placeholder={
                      activeTab === 'experiences'
                        ? 'Search experiences (e.g. safari, coracle, wine, spa, trek)...'
                        : 'Search top sights & monuments...'
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-[#C5A059]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {activeTab === 'experiences' && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-mono transition-all shrink-0 ${
                          selectedCategory === cat
                            ? 'bg-[#C5A059]/20 text-[#8B6B23] dark:text-[#F3E5AB] border border-[#C5A059]/50 font-bold'
                            : 'bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-white/5'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 1: CURATED EXPERIENCES */}
            {activeTab === 'experiences' && (
              <div className="space-y-3">
                {filteredExperiences.length === 0 ? (
                  <div className="text-center py-12 text-neutral-500 dark:text-gray-400 text-sm">
                    No experiences found matching your search. Try adjusting the query or category.
                  </div>
                ) : (
                  filteredExperiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#070707] border border-neutral-200 dark:border-white/10 hover:border-[#C5A059]/50 transition-all flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between group"
                    >
                      <div className="flex gap-3.5 items-center">
                        <SafeImage
                          src={exp.image}
                          alt={exp.name}
                          categoryHint={exp.category || exp.location}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-neutral-200 dark:border-white/10"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#C5A059]/20 text-[#8B6B23] dark:text-[#F3E5AB] font-semibold">
                              {exp.category}
                            </span>
                            <span className="text-[11px] text-neutral-600 dark:text-gray-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#C5A059]" />
                              {exp.location}
                            </span>
                            <span className="text-[11px] text-neutral-500 dark:text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-neutral-400 dark:text-gray-400" />
                              {exp.duration}
                            </span>
                          </div>
                          <h4 className="font-serif font-bold text-sm sm:text-base text-neutral-900 dark:text-white group-hover:text-[#8B6B23] dark:group-hover:text-[#F3E5AB] transition-colors">
                            {exp.name}
                          </h4>
                          <p className="text-xs text-neutral-600 dark:text-gray-400 line-clamp-1 max-w-lg">
                            {exp.shortDescription}
                          </p>
                          <span className="text-xs font-mono font-bold text-[#8B6B23] dark:text-[#C5A059] block">
                            {exp.estimatedPrice}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSelectExperience(exp)}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#C5A059] hover:bg-[#F3E5AB] text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shrink-0 transition-all shadow-md shadow-[#C5A059]/20 hover:scale-105"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Day {targetDayNumber}</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 2: TOP ATTRACTIONS */}
            {activeTab === 'attractions' && (
              <div className="space-y-3">
                {availableAttractions.length === 0 ? (
                  <div className="text-center py-12 text-neutral-500 dark:text-gray-400 text-sm">
                    No attractions found matching your search.
                  </div>
                ) : (
                  availableAttractions.map((attr, idx) => (
                    <div
                      key={`${attr.name}-${idx}`}
                      className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#070707] border border-neutral-200 dark:border-white/10 hover:border-[#C5A059]/50 transition-all flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between group"
                    >
                      <div className="flex gap-3.5 items-center">
                        <SafeImage
                          src={attr.image}
                          alt={attr.name}
                          categoryHint={attr.tag || destinationName}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-neutral-200 dark:border-white/10"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-200/70 dark:bg-white/10 text-neutral-700 dark:text-gray-300">
                              {attr.tag || 'Monument & Heritage'}
                            </span>
                          </div>
                          <h4 className="font-serif font-bold text-sm sm:text-base text-neutral-900 dark:text-white group-hover:text-[#8B6B23] dark:group-hover:text-[#F3E5AB] transition-colors">
                            {attr.name}
                          </h4>
                          <p className="text-xs text-neutral-600 dark:text-gray-400 line-clamp-2 max-w-lg">
                            {attr.description}
                          </p>
                          <span className="text-xs font-mono font-bold text-[#8B6B23] dark:text-[#C5A059]">
                            {formatBilingualPrice(45)} (Guided & Permits)
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSelectAttraction(attr)}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#C5A059] hover:bg-[#F3E5AB] text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shrink-0 transition-all shadow-md shadow-[#C5A059]/20 hover:scale-105"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Day {targetDayNumber}</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 3: CUSTOM ACTIVITY CREATOR */}
            {activeTab === 'custom' && (
              <form onSubmit={handleAddCustom} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-700 dark:text-gray-300 font-semibold">
                    Activity Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Private Helicopter Landing & Mountain Picnic"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-white/5 border border-neutral-300 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-neutral-700 dark:text-gray-300 font-semibold">
                      Location / Landmark
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Matanga Peak Ridge, Hampi"
                      value={customLocation}
                      onChange={(e) => setCustomLocation(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-white/5 border border-neutral-300 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-neutral-700 dark:text-gray-300 font-semibold">
                      Time Slot & Timing
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 09:00 AM – 11:30 AM"
                      value={customTimeLabel}
                      onChange={(e) => setCustomTimeLabel(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-white/5 border border-neutral-300 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-neutral-700 dark:text-gray-300 font-semibold">
                      Category
                    </label>
                    <select
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#111] border border-neutral-300 dark:border-white/10 text-neutral-900 dark:text-white text-sm focus:outline-none focus:border-[#C5A059]"
                    >
                      <option value="Adventure">Adventure</option>
                      <option value="Nature">Nature</option>
                      <option value="Culture">Culture</option>
                      <option value="Food">Food & Gastronomy</option>
                      <option value="Sightseeing">Sightseeing</option>
                      <option value="Wellness">Wellness & Spa</option>
                      <option value="Dining">Fine Dining</option>
                      <option value="Transit">Private Transit</option>
                      <option value="Leisure">Leisure & Relax</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-neutral-700 dark:text-gray-300 font-semibold">
                      Estimated Cost (USD $)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-gray-400" />
                      <input
                        type="number"
                        min={0}
                        max={10000}
                        value={customCostUSD}
                        onChange={(e) => setCustomCostUSD(parseInt(e.target.value) || 0)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-white/5 border border-neutral-300 dark:border-white/10 text-neutral-900 dark:text-white text-sm focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500 dark:text-gray-400">
                      Equivalent to {formatBilingualPrice(customCostUSD)}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-700 dark:text-gray-300 font-semibold">
                    Description & Highlights
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe this bespoke pursuit, private guides, or special requests..."
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-white/5 border border-neutral-300 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-gray-300 text-xs font-semibold hover:bg-neutral-200 dark:hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#F3E5AB] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#C5A059]/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Custom Activity to Day {targetDayNumber}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
