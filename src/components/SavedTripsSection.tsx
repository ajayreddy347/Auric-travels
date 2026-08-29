import React, { useState, useEffect } from 'react';
import {
  Heart,
  Sparkles,
  ArrowRight,
  MapPin,
  Trash2,
  Calendar,
  Compass,
  Building,
  Plus,
  Share2,
  Eye,
  Check,
  Clock,
  Briefcase,
  ExternalLink,
} from 'lucide-react';
import { Destination, TripPlan } from '../types';
import { SafeImage } from './SafeImage';
import {
  getSavedTripsFromStorage,
  deleteSavedTripFromStorage,
  setActiveTripInStorage,
  calculateTripBudget,
  formatINR,
  formatUSD,
} from '../utils/tripGenerator';
import { fetchUserTrips, deleteTripOnServer, ApiTripRecord } from '../services/tripsApi';
import { getStoredAuthToken } from '../utils/authStore';

interface SavedTripsSectionProps {
  savedDestinations: Destination[];
  onRemoveFromSaved: (id: string) => void;
  onSelectDestination: (dest: Destination) => void;
  onPlanTripForDestination: (destName: string) => void;
  onExploreDestinations: () => void;
  onBookStay: (destName: string) => void;
}

function mapApiTripToTripPlan(apiTrip: ApiTripRecord): TripPlan {
  const daysMap = new Map<number, any[]>();
  (apiTrip.items || []).forEach((item) => {
    const list = daysMap.get(item.day_number) || [];
    list.push({
      id: item.id || `act-${Math.random().toString(36).substring(2, 7)}`,
      time: item.start_time || 'Morning (09:00 AM)',
      title: item.title,
      description: item.description || '',
      category: 'Sightseeing',
      costDisplay: item.estimated_cost || 'Included',
      sourceType: 'registered-experience',
    });
    daysMap.set(item.day_number, list);
  });

  const days = Array.from({ length: Math.max(apiTrip.number_of_days || 1, 1) }, (_, i) => {
    const dayNum = i + 1;
    return {
      dayNumber: dayNum,
      title: `Day ${dayNum}: Exploration & Discovery`,
      theme: 'Bespoke Experience',
      dateLabel: `Day ${dayNum}`,
      activities: daysMap.get(dayNum) || [],
      dayNotes: 'Private chauffeur on standby.',
    };
  });

  return {
    id: apiTrip.id,
    title: apiTrip.title,
    destinationId: apiTrip.destination_id || undefined,
    destinationName: apiTrip.title.split(' ')[0] || 'Curated Sanctuary',
    durationDays: apiTrip.number_of_days,
    budgetTier: (apiTrip.budget as any) || 'Signature Luxury',
    dailyBudgetNum: 1500,
    travelStyle: (apiTrip.travel_style as any) || 'Balanced Luxury',
    travelInterests: apiTrip.interests || [],
    partyType: 'Romantic Couple',
    numberOfGuests: 2,
    heroImage: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=2400&q=85',
    days,
    createdAt: apiTrip.created_at,
    updatedAt: apiTrip.updated_at,
    status: 'saved',
  };
}

export const SavedTripsSection: React.FC<SavedTripsSectionProps> = ({
  savedDestinations,
  onRemoveFromSaved,
  onSelectDestination,
  onPlanTripForDestination,
  onExploreDestinations,
  onBookStay,
}) => {
  const [activeTab, setActiveTab] = useState<'itineraries' | 'destinations'>('itineraries');
  const [savedTrips, setSavedTrips] = useState<TripPlan[]>([]);
  const [filterRegion, setFilterRegion] = useState<string>('All');
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const loadTrips = async () => {
    const local = getSavedTripsFromStorage();
    if (getStoredAuthToken()) {
      try {
        const res = await fetchUserTrips();
        if (res.trips && res.trips.length > 0) {
          const serverMapped = res.trips.map(mapApiTripToTripPlan);
          // Merge server trips with unique local trips
          const combined = [...serverMapped];
          for (const l of local) {
            if (!combined.some((s) => s.id === l.id)) {
              combined.push(l);
            }
          }
          setSavedTrips(combined);
          return;
        }
      } catch (err) {
        console.warn('[SavedTripsSection] Failed to fetch server trips:', err);
      }
    }
    setSavedTrips(local);
  };

  useEffect(() => {
    loadTrips();
    // If no planned itineraries but saved destinations exist, default to destinations tab
    if (savedTrips.length === 0 && savedDestinations.length > 0) {
      setActiveTab('destinations');
    }
  }, [savedDestinations.length]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleDeleteTrip = async (tripId: string) => {
    deleteSavedTripFromStorage(tripId);
    if (getStoredAuthToken()) {
      try {
        await deleteTripOnServer(tripId);
      } catch (err) {
        console.warn('[SavedTripsSection] Error deleting trip on server:', err);
      }
    }
    setSavedTrips((prev) => prev.filter((t) => t.id !== tripId));
    showToast('Itinerary removed from Travel Vault.');
  };

  const handleOpenSavedTrip = (trip: TripPlan) => {
    setActiveTripInStorage(trip);
    onPlanTripForDestination(trip.destinationName);
  };

  const regions = ['All', ...Array.from(new Set(savedDestinations.map((d) => d.region || d.country)))];

  const filteredDestList = savedDestinations.filter((d) => {
    if (filterRegion === 'All') return true;
    return d.region === filterRegion || d.country === filterRegion;
  });

  const handleShareVault = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="space-y-8 pb-16" id="saved-trips-view">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-neutral-900 dark:bg-[#0D0D0D] border border-[#C5A059]/40 text-[#F3E5AB] shadow-2xl text-xs font-mono flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. HEADER BANNER */}
      <div className="rounded-3xl p-6 sm:p-10 bg-neutral-100 dark:bg-gradient-to-br dark:from-[#141008] dark:via-[#0D0D0D] dark:to-[#080808] text-neutral-900 dark:text-white border border-neutral-200 dark:border-[#C5A059]/30 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#8C6D32] dark:text-[#F3E5AB] text-xs font-mono font-bold">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>Personal Travel Vault</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 dark:text-white tracking-tight">
              My Saved Trips & Sanctuaries
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 text-xs sm:text-sm leading-relaxed">
              Your curated portfolio of custom-architected trip itineraries and bookmarked luxury retreats. Load any route back into the architect or book stays directly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleShareVault}
              className="px-4 py-2.5 rounded-full bg-neutral-200 dark:bg-white/10 hover:bg-neutral-300 dark:hover:bg-white/20 border border-neutral-300 dark:border-white/15 text-neutral-800 dark:text-white text-xs font-semibold flex items-center gap-2 transition-all"
              title="Share Wishlist"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied' : 'Share Vault'}</span>
            </button>

            <button
              onClick={() => onPlanTripForDestination('')}
              className="px-5 py-2.5 rounded-full bg-[#C5A059] hover:bg-[#F3E5AB] text-black text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-[#C5A059]/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Architect New Itinerary</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/5">
            <span className="text-[10px] font-mono uppercase text-neutral-500 dark:text-neutral-400 block font-bold">Saved Itineraries</span>
            <span className="text-xl font-serif font-bold text-[#8C6D32] dark:text-[#F3E5AB]">{savedTrips.length}</span>
          </div>
          <div className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/5">
            <span className="text-[10px] font-mono uppercase text-neutral-500 dark:text-neutral-400 block font-bold">Bookmarked Havens</span>
            <span className="text-xl font-serif font-bold text-neutral-900 dark:text-white">
              {savedDestinations.length}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/5">
            <span className="text-[10px] font-mono uppercase text-neutral-500 dark:text-neutral-400 block font-bold">Heritage Havens</span>
            <span className="text-xl font-serif font-bold text-[#8C6D32] dark:text-[#C5A059]">
              {savedDestinations.filter((d) => d.category === 'Heritage' || d.category === 'Culture').length}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/5">
            <span className="text-[10px] font-mono uppercase text-neutral-500 dark:text-neutral-400 block font-bold">Status</span>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              Vault Synced
            </span>
          </div>
        </div>
      </div>

      {/* 2. VAULT TABS (Itineraries vs Bookmarked Havens) */}
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('itineraries')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              activeTab === 'itineraries'
                ? 'bg-[#C5A059] text-black shadow-md shadow-[#C5A059]/20'
                : 'bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:border-[#C5A059]/40'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Planned Itineraries ({savedTrips.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('destinations')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              activeTab === 'destinations'
                ? 'bg-[#C5A059] text-black shadow-md shadow-[#C5A059]/20'
                : 'bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:border-[#C5A059]/40'
            }`}
          >
            <Heart className="w-4 h-4 fill-current text-rose-500" />
            <span>Bookmarked Sanctuaries ({savedDestinations.length})</span>
          </button>
        </div>

        {activeTab === 'destinations' && regions.length > 2 && (
          <div className="hidden sm:flex items-center gap-2 overflow-x-auto">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setFilterRegion(region)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                  filterRegion === region
                    ? 'bg-black dark:bg-white text-white dark:text-black font-bold'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB A: PLANNED ITINERARIES */}
      {activeTab === 'itineraries' && (
        <div>
          {savedTrips.length === 0 ? (
            <div className="p-12 sm:p-16 rounded-3xl bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 text-center max-w-xl mx-auto space-y-5 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] flex items-center justify-center mx-auto">
                <Compass className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-neutral-900 dark:text-white">
                  No Saved Itineraries Yet
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">
                  Use our Senior Travel Architect to generate tailored itineraries for Bengaluru, Mysore, Coorg, Chikmagalur, or global sanctuaries, then tap "Save to Vault".
                </p>
              </div>
              <button
                onClick={() => onPlanTripForDestination('')}
                className="px-6 py-3 rounded-full bg-[#C5A059] hover:bg-[#F3E5AB] text-black text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#C5A059]/20"
              >
                Start Trip Planner
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedTrips.map((trip) => {
                const budget = calculateTripBudget(trip);
                const totalActs = trip.days.reduce((acc, d) => acc + d.activities.length, 0);

                return (
                  <div
                    key={trip.id}
                    className="group rounded-3xl bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 hover:border-[#C5A059]/50 overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-xl"
                  >
                    {/* Card Image Banner */}
                    <div className="relative h-48 overflow-hidden">
                      <SafeImage
                        src={trip.heroImage}
                        alt={trip.destinationName}
                        categoryHint={trip.destinationName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

                      <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-[#F3E5AB] border border-white/10">
                        {trip.destinationName} ({trip.country})
                      </span>

                      <button
                        onClick={() => handleDeleteTrip(trip.id)}
                        className="absolute top-3.5 right-3.5 p-2 rounded-full bg-black/70 backdrop-blur-md border border-rose-500/40 text-rose-400 hover:scale-110 transition-transform"
                        title="Delete saved itinerary"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white text-xs font-mono">
                        <span className="bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded font-bold text-[#F3E5AB]">
                          {formatINR(budget.grandTotalUSD)} / {formatUSD(budget.grandTotalUSD)}
                        </span>
                        <span className="text-[11px] text-neutral-300">
                          {trip.durationDays} Days · {totalActs} Activities
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A059] font-bold">
                            {trip.budgetTier}
                          </span>
                          <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                            {trip.partyType}
                          </span>
                        </div>

                        <h3
                          onClick={() => handleOpenSavedTrip(trip)}
                          className="text-lg font-serif font-bold text-neutral-900 dark:text-white group-hover:text-[#C5A059] transition-colors cursor-pointer"
                        >
                          {trip.title}
                        </h3>

                        <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                          Paced for {trip.travelStyle} with curated focus on {trip.travelInterests.slice(0, 2).join(', ')}.
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="pt-3 border-t border-neutral-100 dark:border-white/10 flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono text-neutral-400">
                          Saved: {new Date(trip.updatedAt || trip.createdAt).toLocaleDateString()}
                        </span>

                        <button
                          onClick={() => handleOpenSavedTrip(trip)}
                          className="px-4 py-2 rounded-xl bg-[#C5A059] hover:bg-[#F3E5AB] text-black text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open Itinerary</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB B: BOOKMARKED SANCTUARIES */}
      {activeTab === 'destinations' && (
        <div>
          {savedDestinations.length === 0 ? (
            <div className="p-12 sm:p-16 rounded-3xl bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 text-center max-w-xl mx-auto space-y-5 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-neutral-900 dark:text-white">
                  No Bookmarked Sanctuaries
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">
                  Browse our destinations catalog and tap the heart icon on any sanctuary to bookmark it here.
                </p>
              </div>
              <button
                onClick={onExploreDestinations}
                className="px-6 py-3 rounded-full bg-[#C5A059] hover:bg-[#F3E5AB] text-black text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#C5A059]/20"
              >
                Explore Destinations
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDestList.map((dest) => (
                <div
                  key={dest.id}
                  className="group rounded-3xl bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 hover:border-[#C5A059]/50 overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-xl"
                >
                  {/* Card Image */}
                  <div className="relative h-52 overflow-hidden">
                    <SafeImage
                      src={dest.image}
                      alt={dest.name}
                      categoryHint={dest.category || dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    {/* Region Tag */}
                    <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-[#F3E5AB] border border-white/10">
                      {dest.country} {dest.state ? `· ${dest.state}` : ''}
                    </span>

                    {/* Remove Bookmark Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFromSaved(dest.id);
                      }}
                      className="absolute top-3.5 right-3.5 p-2 rounded-full bg-black/70 backdrop-blur-md border border-rose-500/40 text-rose-400 hover:scale-110 transition-transform"
                      title="Remove from saved wishlist"
                    >
                      <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                    </button>

                    {/* Price and Best Time */}
                    <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white text-xs font-mono">
                      <span className="bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded font-bold">
                        {dest.startingPrice}
                      </span>
                      <span className="text-[11px] text-neutral-300">
                        Best: {dest.bestTimeToVisit}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A059] font-bold">
                          {dest.category} Sanctuary
                        </span>
                        <span className="text-xs font-semibold text-amber-500 dark:text-amber-400 flex items-center gap-1">
                          ★ {dest.rating}
                        </span>
                      </div>

                      <h3
                        onClick={() => onSelectDestination(dest)}
                        className="text-lg font-serif font-bold text-neutral-900 dark:text-white group-hover:text-[#C5A059] transition-colors cursor-pointer"
                      >
                        {dest.name}
                      </h3>

                      <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                        {dest.description}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-neutral-100 dark:border-white/10 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onSelectDestination(dest)}
                        className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-[#C5A059] flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onBookStay(dest.name)}
                          className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-800 dark:text-neutral-200 text-xs font-semibold transition-colors flex items-center gap-1"
                          title="Book Luxury Stay"
                        >
                          <Building className="w-3 h-3 text-[#C5A059]" />
                          <span>Stay</span>
                        </button>

                        <button
                          onClick={() => onPlanTripForDestination(dest.name)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#C5A059] hover:bg-[#F3E5AB] text-black text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 shadow-sm"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Plan</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
