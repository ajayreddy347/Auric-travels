import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building,
  Compass,
  Calendar,
  Clock,
  Users,
  MapPin,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Trash2,
  XCircle,
  FileText,
  Printer,
  ChevronRight,
  Plus,
  ShieldCheck,
  AlertCircle,
  Search,
  BedDouble,
  Tag,
  ArrowUpRight
} from 'lucide-react';
import { BookingRecord, AuthUser } from '../types';
import { cancelBookingRecord, deleteBookingRecord } from '../utils/bookingStore';
import { getStoredAuthToken } from '../utils/authStore';
import { cancelBookingOnServer } from '../services/bookingsApi';
import { SafeImage } from './SafeImage';

interface MyBookingsSectionProps {
  bookings: BookingRecord[];
  currentUser?: AuthUser | null;
  onOpenAuth?: () => void;
  onRefreshBookings: () => void;
  onBookStay: () => void;
  onBookExperience: () => void;
  onExploreDestinations: () => void;
}

export const MyBookingsSection: React.FC<MyBookingsSectionProps> = ({
  bookings,
  currentUser,
  onOpenAuth,
  onRefreshBookings,
  onBookStay,
  onBookExperience,
  onExploreDestinations,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'stay' | 'experience'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedVoucher, setSelectedVoucher] = useState<BookingRecord | null>(null);
  const [cancelModalBooking, setCancelModalBooking] = useState<BookingRecord | null>(null);

  // If user is not authenticated, show secure private vault screen
  if (!currentUser) {
    return (
      <div className="space-y-8 pb-16" id="my-bookings-section">
        <div className="rounded-3xl p-8 sm:p-12 bg-neutral-50 dark:bg-[#0D0D0D] border border-neutral-200 dark:border-[#C5A059]/30 text-center space-y-6 max-w-xl mx-auto my-12 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-[#C5A059]/15 border border-[#C5A059]/40 text-[#C5A059] flex items-center justify-center mx-auto shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 dark:text-white">
              Private Booking Vault
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
              Sign in with your Auric Society credentials to access your confirmed luxury sanctuary vouchers, itinerary dates, and dedicated concierge details.
            </p>
          </div>
          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className="px-6 py-3 rounded-xl bg-[#C5A059] hover:bg-[#F3E5AB] text-black font-bold uppercase tracking-wider text-xs transition-all shadow-lg shadow-[#C5A059]/20 flex items-center gap-2 mx-auto"
            >
              <Sparkles className="w-4 h-4" />
              <span>Sign In to Auric Society</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Filter Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesType = filterType === 'all' || b.type === filterType;
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.guestName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleCopy = (refId: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(refId);
      setCopiedId(refId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleConfirmCancel = async () => {
    if (cancelModalBooking) {
      cancelBookingRecord(cancelModalBooking.id);
      
      if (getStoredAuthToken()) {
        try {
          await cancelBookingOnServer(cancelModalBooking.id);
        } catch (err) {
          console.warn('[MyBookingsSection] Server cancel note:', err);
        }
      }

      onRefreshBookings();
      setCancelModalBooking(null);
      if (selectedVoucher?.id === cancelModalBooking.id) {
        setSelectedVoucher(null);
      }
    }
  };

  const handleDelete = (id: string) => {
    deleteBookingRecord(id);
    onRefreshBookings();
    if (selectedVoucher?.id === id) {
      setSelectedVoucher(null);
    }
  };

  const staysCount = bookings.filter((b) => b.type === 'stay').length;
  const expCount = bookings.filter((b) => b.type === 'experience').length;

  return (
    <div className="space-y-8 pb-16" id="my-bookings-section">
      {/* 1. HERO HEADER BANNER */}
      <div className="rounded-3xl p-6 sm:p-10 bg-neutral-100 dark:bg-gradient-to-br dark:from-[#121212] dark:via-[#0D0D0D] dark:to-[#080808] border border-[#C5A059]/30 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#8C6D32] dark:text-[#F3E5AB] text-xs font-mono uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Auric Travel Vault • Confirmed Arrangements</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 dark:text-white tracking-tight">
              My Sanctuary Bookings
            </h1>
            <p className="text-neutral-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed max-w-xl font-light">
              Review and manage your confirmed luxury stays and bespoke pursuits. Each reservation is secured with an authentic Auric Reference ID and full concierge coordination.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onBookStay}
              id="book-new-stay-header-btn"
              className="px-4 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#F3E5AB] text-black font-bold uppercase tracking-wider text-xs transition-all flex items-center gap-2 shadow-lg shadow-[#C5A059]/20"
            >
              <Building className="w-4 h-4 text-black" />
              <span>Book Luxury Stay</span>
            </button>
            <button
              onClick={onBookExperience}
              id="book-new-experience-header-btn"
              className="px-4 py-2.5 rounded-xl bg-neutral-200 dark:bg-[#1A1A1A] hover:bg-neutral-300 dark:hover:bg-white/10 border border-neutral-300 dark:border-white/10 text-neutral-800 dark:text-white font-semibold text-xs transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-[#C5A059]" />
              <span>Book Experience</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. STATS & FILTER CONTROLS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 bg-neutral-100 dark:bg-[#0A0A0A] border border-neutral-200 dark:border-white/10 p-1 rounded-2xl overflow-x-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              filterType === 'all'
                ? 'bg-[#C5A059] text-black font-bold shadow'
                : 'text-neutral-500 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            All Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setFilterType('stay')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
              filterType === 'stay'
                ? 'bg-[#C5A059] text-black font-bold shadow'
                : 'text-neutral-500 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Luxury Stays ({staysCount})</span>
          </button>
          <button
            onClick={() => setFilterType('experience')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
              filterType === 'experience'
                ? 'bg-[#C5A059] text-black font-bold shadow'
                : 'text-neutral-500 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Experiences ({expCount})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400 dark:text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by hotel, tour, or ID..."
            className="w-full bg-white dark:bg-[#0A0A0A] border border-neutral-200 dark:border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#C5A059]"
          />
        </div>
      </div>

      {/* 3. BOOKINGS LIST GRID */}
      {filteredBookings.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBookings.map((b) => {
            const isStay = b.type === 'stay';
            const isCancelled = b.status === 'cancelled';

            return (
              <div
                key={b.id}
                className={`rounded-3xl bg-white dark:bg-[#0D0D0D] border transition-all overflow-hidden flex flex-col justify-between group ${
                  isCancelled
                    ? 'border-neutral-200 dark:border-white/5 opacity-70'
                    : 'border-neutral-200 dark:border-white/10 hover:border-[#C5A059]/50 shadow-lg hover:shadow-[#C5A059]/10'
                }`}
                id={`booking-card-${b.referenceId}`}
              >
                {/* Top Image + Category Banner */}
                <div className="relative h-48 w-full overflow-hidden bg-black/50">
                  <SafeImage
                    src={b.imageUrl}
                    alt={b.title}
                    categoryHint={b.category || b.location}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-black/40 to-transparent pointer-events-none" />

                  {/* Top Bar Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[#F3E5AB] text-[10px] font-mono border border-white/10">
                      {isStay ? <Building className="w-3 h-3 text-[#C5A059]" /> : <Compass className="w-3 h-3 text-[#C5A059]" />}
                      <span>{b.category || (isStay ? 'Palace Resort' : 'Curated Pursuit')}</span>
                    </div>

                    <div
                      className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold backdrop-blur-md border ${
                        isCancelled
                          ? 'bg-red-950/80 text-red-300 border-red-800/40'
                          : 'bg-emerald-950/80 text-emerald-300 border-emerald-800/40 flex items-center gap-1'
                      }`}
                    >
                      {!isCancelled && <CheckCircle2 className="w-3 h-3" />}
                      <span>{isCancelled ? 'Cancelled' : 'Confirmed'}</span>
                    </div>
                  </div>

                  {/* Bottom Image Title */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <div className="flex items-center gap-1.5 text-xs text-[#C5A059] font-mono">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{b.location}</span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-white truncate drop-shadow-md">
                      {b.title}
                    </h3>
                  </div>
                </div>

                {/* Card Content Details */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  {/* Reference ID and Subtitle */}
                  <div className="flex items-center justify-between bg-neutral-50 dark:bg-[#080808] border border-neutral-200 dark:border-white/5 rounded-2xl p-3">
                    <div>
                      <span className="text-[10px] font-mono text-neutral-500 dark:text-gray-400 block uppercase">
                        Reference Number
                      </span>
                      <span className="text-sm font-mono font-bold text-[#8C6D32] dark:text-[#F3E5AB] tracking-wider">
                        {b.referenceId}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(b.referenceId)}
                      className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-white/5 hover:bg-[#C5A059] hover:text-black text-neutral-600 dark:text-gray-300 text-xs font-mono transition-all flex items-center gap-1"
                    >
                      {copiedId === b.referenceId ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Specific Key Values */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-neutral-500 dark:text-gray-400 uppercase flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#C5A059]" />
                        <span>{isStay ? 'Check-In' : 'Activity Date'}</span>
                      </span>
                      <span className="font-semibold text-neutral-900 dark:text-white block">
                        {b.startDate}
                      </span>
                    </div>

                    {isStay && b.endDate ? (
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-neutral-500 dark:text-gray-400 uppercase flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#C5A059]" />
                          <span>Check-Out</span>
                        </span>
                        <span className="font-semibold text-neutral-900 dark:text-white block truncate">
                          {b.endDate} ({b.numberOfNights}N)
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-neutral-500 dark:text-gray-400 uppercase flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#C5A059]" />
                          <span>Time Slot</span>
                        </span>
                        <span className="font-semibold text-neutral-900 dark:text-white block truncate">
                          {b.timeSlot?.split('(')[0] || 'Flexible Concierge'}
                        </span>
                      </div>
                    )}

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-neutral-500 dark:text-gray-400 uppercase flex items-center gap-1">
                        <Users className="w-3 h-3 text-[#C5A059]" />
                        <span>Party</span>
                      </span>
                      <span className="font-semibold text-neutral-900 dark:text-white block">
                        {b.numberOfGuests} {b.numberOfGuests === 1 ? 'Guest' : 'Guests'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-neutral-500 dark:text-gray-400 uppercase flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#C5A059]" />
                        <span>Estimated Total</span>
                      </span>
                      <span className="font-bold text-[#8C6D32] dark:text-[#F3E5AB] font-mono block">
                        {b.totalCostDisplay}
                      </span>
                    </div>
                  </div>

                  {b.subtitle && (
                    <div className="text-xs text-neutral-500 dark:text-gray-400 border-t border-neutral-200 dark:border-white/5 pt-2 flex items-center gap-1.5">
                      <Tag className="w-3 h-3 text-[#C5A059] shrink-0" />
                      <span className="truncate">{b.subtitle}</span>
                    </div>
                  )}

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-neutral-200 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => setSelectedVoucher(b)}
                      className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-white/5 hover:bg-[#C5A059] text-neutral-600 dark:text-gray-300 hover:text-black font-semibold text-xs transition-all flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Voucher</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {!isCancelled ? (
                        <button
                          type="button"
                          onClick={() => setCancelModalBooking(b)}
                          className="px-3 py-2 rounded-xl bg-red-950/20 hover:bg-red-900/40 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-200 border border-red-300 dark:border-red-800/30 text-xs font-semibold transition-all flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleDelete(b.id)}
                          className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-white/5 hover:bg-red-950/40 text-neutral-400 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 text-xs transition-all flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* EMPTY STATE */
        <div className="rounded-3xl p-10 sm:p-16 bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 text-center space-y-5 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center mx-auto text-[#C5A059]">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-serif font-bold text-neutral-900 dark:text-white">
              No Sanctuary Bookings Found
            </h3>
            <p className="text-neutral-500 dark:text-gray-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
              {searchQuery
                ? `No bookings matched "${searchQuery}". Try searching with a different term or clear filters.`
                : 'You have not reserved any luxury stays or curated experiences yet. Explore Karnataka sanctuaries or iconic global destinations.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onBookStay}
              className="px-5 py-3 rounded-2xl bg-[#C5A059] hover:bg-[#F3E5AB] text-black font-bold uppercase tracking-wider text-xs transition-all flex items-center gap-2 shadow-lg shadow-[#C5A059]/20"
            >
              <Building className="w-4 h-4 text-black" />
              <span>Book Luxury Stay</span>
            </button>
            <button
              onClick={onBookExperience}
              className="px-5 py-3 rounded-2xl bg-neutral-200 dark:bg-[#1A1A1A] hover:bg-neutral-300 dark:hover:bg-white/10 border border-neutral-300 dark:border-white/10 text-neutral-800 dark:text-white font-semibold text-xs transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-[#C5A059]" />
              <span>Browse Experiences</span>
            </button>
            <button
              onClick={onExploreDestinations}
              className="px-5 py-3 rounded-2xl bg-neutral-100 dark:bg-[#080808] hover:bg-neutral-200 dark:hover:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-gray-300 hover:text-neutral-900 dark:hover:text-white font-semibold text-xs transition-all"
            >
              Explore Destinations
            </button>
          </div>
        </div>
      )}

      {/* 4. VOUCHER MODAL */}
      {selectedVoucher && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#0D0D0D] border border-[#C5A059]/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-neutral-900 dark:text-white max-h-[90vh] overflow-y-auto">
            {/* Top Close */}
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#8C6D32] dark:text-[#C5A059]">
                  Official Auric Travel Voucher
                </span>
              </div>
              <button
                onClick={() => setSelectedVoucher(null)}
                className="p-1.5 rounded-xl bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-500 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Voucher Body */}
            <div className="space-y-4 bg-neutral-50 dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#0A0A0A] border border-neutral-200 dark:border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-500 dark:text-gray-400 block">
                    Booking Reference
                  </span>
                  <span className="text-xl font-mono font-bold text-[#8C6D32] dark:text-[#F3E5AB]">
                    {selectedVoucher.referenceId}
                  </span>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/40 text-xs font-mono font-bold">
                  {selectedVoucher.status.toUpperCase()}
                </div>
              </div>

              <div className="border-t border-neutral-200 dark:border-white/10 pt-4 flex gap-4">
                <SafeImage
                  src={selectedVoucher.imageUrl}
                  alt={selectedVoucher.title}
                  categoryHint={selectedVoucher.location}
                  className="w-20 h-20 rounded-xl object-cover border border-neutral-200 dark:border-white/10 shrink-0"
                />
                <div>
                  <h3 className="text-lg font-serif font-bold text-neutral-900 dark:text-white">
                    {selectedVoucher.title}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-gray-400">{selectedVoucher.subtitle}</p>
                  <p className="text-xs text-[#C5A059] mt-1">{selectedVoucher.location}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-neutral-200 dark:border-white/10 pt-4 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 dark:text-gray-400 block uppercase">Lead Guest</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">{selectedVoucher.guestName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 dark:text-gray-400 block uppercase">Contact</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">{selectedVoucher.guestEmail}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 dark:text-gray-400 block uppercase">Phone</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">{selectedVoucher.guestPhone}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 dark:text-gray-400 block uppercase">Start Date</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">{selectedVoucher.startDate}</span>
                </div>
                {selectedVoucher.endDate && (
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 dark:text-gray-400 block uppercase">Check-Out</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">{selectedVoucher.endDate}</span>
                  </div>
                )}
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 dark:text-gray-400 block uppercase">Total Confirmed</span>
                  <span className="font-bold text-[#8C6D32] dark:text-[#F3E5AB] font-mono">{selectedVoucher.totalCostDisplay}</span>
                </div>
              </div>

              {selectedVoucher.specialRequests && (
                <div className="border-t border-neutral-200 dark:border-white/10 pt-3 text-xs text-neutral-600 dark:text-gray-300">
                  <span className="text-[10px] font-mono text-neutral-400 dark:text-gray-500 uppercase block">Special Requests</span>
                  <p className="italic">{selectedVoucher.specialRequests}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-white/10 hover:bg-neutral-200 dark:hover:bg-white/20 text-neutral-700 dark:text-white text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Voucher</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedVoucher(null)}
                className="px-5 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#F3E5AB] text-black font-bold uppercase tracking-wider text-xs transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. CANCEL CONFIRMATION MODAL */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-[#0D0D0D] border border-red-300 dark:border-red-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-neutral-900 dark:text-white">
            <div className="w-12 h-12 rounded-full bg-red-950/40 border border-red-500/40 flex items-center justify-center text-red-400 mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-serif font-bold text-neutral-900 dark:text-white">
                Cancel Sanctuary Reservation?
              </h3>
              <p className="text-xs text-neutral-600 dark:text-gray-300 leading-relaxed">
                Are you sure you wish to cancel booking <strong className="text-neutral-900 dark:text-white font-mono">{cancelModalBooking.referenceId}</strong> for <strong className="text-neutral-900 dark:text-white">{cancelModalBooking.title}</strong>?
              </p>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setCancelModalBooking(null)}
                className="w-full py-2.5 rounded-xl bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-600 dark:text-gray-300 text-xs font-semibold transition-all"
              >
                Keep Reservation
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-red-600/20"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
