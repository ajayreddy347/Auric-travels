import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Calendar,
  Users,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  ChevronRight,
  Info,
  DollarSign,
  MapPin,
  Building,
  Compass,
  Phone,
  Mail,
  User,
  MessageSquare,
  FileText,
  Printer,
  ChevronDown,
  BedDouble,
  Tag,
  AlertCircle,
  Lock
} from 'lucide-react';
import { BookingRecord, LuxuryStayItem, ExperienceItem, AuthUser } from '../types';
import { generateBookingReferenceId, saveNewBooking } from '../utils/bookingStore';
import { getStoredAuthToken } from '../utils/authStore';
import { createBookingOnServer } from '../services/bookingsApi';
import { formatCurrency, parsePriceToINR } from '../utils/currency';
import { SafeImage } from './SafeImage';
import { SeoHead } from './SeoHead';

export interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingType: 'stay' | 'experience';
  item?: LuxuryStayItem | ExperienceItem | null;
  stayItem?: LuxuryStayItem | null;
  experienceItem?: ExperienceItem | null;
  customTitle?: string;
  customSubtitle?: string;
  customLocation?: string;
  customImage?: string;
  customPriceDisplay?: string;
  customPriceNum?: number;
  currentUser?: AuthUser | null;
  onRequireAuth?: (pendingAction: (authedUser?: AuthUser) => void) => void;
  onBookingConfirmed: (newBooking: BookingRecord) => void;
  onNavigateToBookings?: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  bookingType,
  item,
  stayItem,
  experienceItem,
  customTitle,
  customSubtitle,
  customLocation,
  customImage,
  customPriceDisplay,
  customPriceNum,
  currentUser,
  onRequireAuth,
  onBookingConfirmed,
  onNavigateToBookings,
}) => {
  // Resolve effective items
  const effectiveStayItem = stayItem || (bookingType === 'stay' && item ? (item as LuxuryStayItem) : null);
  const effectiveExpItem = experienceItem || (bookingType === 'experience' && item ? (item as ExperienceItem) : null);
  const effectiveItem = effectiveStayItem || effectiveExpItem;

  // Form State
  const [step, setStep] = useState<'form' | 'confirmed'>('form');
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Currency (INR is primary default for India-first market)
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Dates
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  const threeDaysLater = new Date();
  threeDaysLater.setDate(threeDaysLater.getDate() + 4);
  const threeDaysLaterStr = threeDaysLater.toISOString().split('T')[0];

  // Stay Dates
  const [checkInDate, setCheckInDate] = useState(tomorrowStr);
  const [checkOutDate, setCheckOutDate] = useState(threeDaysLaterStr);
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);

  // Experience Dates
  const [experienceDate, setExperienceDate] = useState(tomorrowStr);
  const [timeSlot, setTimeSlot] = useState('Dawn / Sunrise (06:00 AM – 10:30 AM)');
  const [experienceFormat, setExperienceFormat] = useState('Private VIP Naturalist Expedition');

  // Party & Guests
  const [travelersCount, setTravelersCount] = useState(2);

  // Guest Details
  const [guestName, setGuestName] = useState(currentUser?.name || '');
  const [guestEmail, setGuestEmail] = useState(currentUser?.email || '');
  const [guestPhone, setGuestPhone] = useState(currentUser?.phone || '+91 98450 12345');
  const [specialRequests, setSpecialRequests] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Sync user info when currentUser changes
  useEffect(() => {
    if (currentUser) {
      if (currentUser.name && !guestName) setGuestName(currentUser.name);
      if (currentUser.email && !guestEmail) setGuestEmail(currentUser.email);
      if (currentUser.phone && (!guestPhone || guestPhone === '+91 98450 12345')) setGuestPhone(currentUser.phone);
    }
  }, [currentUser]);

  // Reset when modal opens with new item
  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setConfirmedBooking(null);
      setSelectedRoomIndex(0);
      setIsSubmitting(false);
      setSubmitError(null);
    }
  }, [isOpen, effectiveStayItem, effectiveExpItem]);

  if (!isOpen) return null;

  // Derive Item Details
  const title =
    effectiveStayItem?.name ||
    effectiveExpItem?.name ||
    customTitle ||
    (bookingType === 'stay' ? 'Luxury Sanctuary Stay' : 'Bespoke Travel Experience');

  const location =
    effectiveStayItem?.location ||
    effectiveExpItem?.location ||
    customLocation ||
    'Global Sanctuaries';

  const imageUrl =
    effectiveStayItem?.image ||
    effectiveExpItem?.image ||
    customImage ||
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';

  const category =
    effectiveStayItem?.badge ||
    effectiveExpItem?.category ||
    (bookingType === 'stay' ? 'Palace & Resort Sanctuary' : 'Curated Private Pursuit');

  // Room / Plan Details for Stays
  const currentRoom = effectiveStayItem?.roomTypes?.[selectedRoomIndex] || {
    name: 'Signature Sanctuary Suite',
    description: 'Spacious luxury chamber with panoramic views and private sit-out.',
    priceMultiplier: 1.0,
  };

  // Calculate Stay Nights strictly
  const calculateNights = () => {
    try {
      const d1 = new Date(checkInDate);
      const d2 = new Date(checkOutDate);
      const diffTime = d2.getTime() - d1.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch {
      return 1;
    }
  };

  const nightsCount = calculateNights();
  const isStayDateInvalid = bookingType === 'stay' && nightsCount <= 0;

  // Price calculations
  let basePricePerUnit = 0;
  let totalBaseAmount = 0;
  let taxesAndFees = 0;
  let finalTotal = 0;

  if (bookingType === 'stay') {
    const rawRateINR = (effectiveStayItem?.pricePerNightINR || customPriceNum || 1199) * (currentRoom.priceMultiplier || 1.0);
    const rawRateUSD = (effectiveStayItem?.pricePerNightUSD || Math.round(rawRateINR / 83.5)) * (currentRoom.priceMultiplier || 1.0);
    basePricePerUnit = currency === 'INR' ? rawRateINR : rawRateUSD;
    totalBaseAmount = basePricePerUnit * Math.max(1, nightsCount);
    // Luxury hospitality tax 12%
    taxesAndFees = Math.round(totalBaseAmount * 0.12);
    finalTotal = totalBaseAmount + taxesAndFees;
  } else {
    // Experience
    let rawRateINR = 8500;
    if (effectiveExpItem?.estimatedPrice) {
      const match = effectiveExpItem.estimatedPrice.match(/₹([\d,]+)/);
      if (match) rawRateINR = parseInt(match[1].replace(/,/g, ''), 10);
    } else if (customPriceNum) {
      rawRateINR = customPriceNum;
    }
    const rawRateUSD = Math.round(rawRateINR / 83.5);
    basePricePerUnit = currency === 'INR' ? rawRateINR : rawRateUSD;
    totalBaseAmount = basePricePerUnit * travelersCount;
    // Concierge & permits fee 10%
    taxesAndFees = Math.round(totalBaseAmount * 0.1);
    finalTotal = totalBaseAmount + taxesAndFees;
  }

  const formatCost = (num: number) => {
    if (currency === 'INR') {
      return `₹${num.toLocaleString('en-IN')}`;
    }
    return `$${num.toLocaleString('en-US')}`;
  };

  // Submission handler
  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setSubmitError(null);

    const token = getStoredAuthToken();
    if (!token || !currentUser) {
      if (onRequireAuth) {
        onRequireAuth((authedUser?: AuthUser) => {
          if (authedUser) {
            setGuestName((prev) => prev || authedUser.name);
            setGuestEmail((prev) => prev || authedUser.email);
            setGuestPhone((prev) => (prev === '+91 98450 12345' || !prev ? authedUser.phone || prev : prev));
          }
        });
      }
      return;
    }

    if (bookingType === 'stay' && isStayDateInvalid) {
      setSubmitError('Check-out date must be strictly after check-in date.');
      return;
    }

    if (!guestName.trim() || !guestEmail.trim()) {
      setSubmitError('Please provide lead guest name and email address.');
      return;
    }

    setIsSubmitting(true);

    const refId = generateBookingReferenceId(bookingType);

    const newRecord: BookingRecord = {
      id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      referenceId: refId,
      type: bookingType,
      itemId: effectiveStayItem?.id || effectiveExpItem?.id || 'custom-item',
      title,
      subtitle:
        bookingType === 'stay'
          ? currentRoom.name
          : timeSlot,
      location,
      imageUrl,
      destinationName: effectiveStayItem?.destinationName || effectiveExpItem?.location || 'Sanctuary',
      category: category,
      startDate: bookingType === 'stay' ? checkInDate : experienceDate,
      endDate: bookingType === 'stay' ? checkOutDate : undefined,
      numberOfNights: bookingType === 'stay' ? nightsCount : undefined,
      timeSlot: bookingType === 'experience' ? timeSlot : undefined,
      numberOfGuests: travelersCount,
      roomType: bookingType === 'stay' ? currentRoom.name : undefined,
      experienceFormat: bookingType === 'experience' ? experienceFormat : undefined,
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim(),
      guestPhone: guestPhone.trim(),
      specialRequests: specialRequests.trim() || undefined,
      currency,
      baseRatePerUnit: Math.round(basePricePerUnit),
      totalCost: Math.round(finalTotal),
      totalCostDisplay: formatCost(Math.round(finalTotal)),
      taxesAndFees: Math.round(taxesAndFees),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    try {
      const destinationId = effectiveStayItem?.destinationId || (effectiveExpItem as any)?.destinationId || (effectiveExpItem as any)?.destination_id || 'hampi';
      const experienceId = bookingType === 'experience' && effectiveExpItem?.id ? effectiveExpItem.id : undefined;

      // Backend booking creation is REQUIRED for a confirmed booking
      const serverBooking = await createBookingOnServer({
        id: newRecord.id,
        destinationId,
        stayId: effectiveStayItem?.id || undefined,
        roomType: bookingType === 'stay' ? currentRoom.name : undefined,
        experienceId,
        bookingDate: newRecord.startDate,
        checkInDate: bookingType === 'stay' ? checkInDate : newRecord.startDate,
        checkOutDate: bookingType === 'stay' ? checkOutDate : undefined,
        numberOfNights: bookingType === 'stay' ? nightsCount : undefined,
        numberOfPeople: newRecord.numberOfGuests,
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim(),
        guestPhone: guestPhone.trim() || undefined,
        specialRequests: specialRequests.trim() || undefined,
        baseRatePerUnit: Math.round(basePricePerUnit),
        taxesAndFees: Math.round(taxesAndFees),
        totalAmount: newRecord.totalCost,
        currency: newRecord.currency,
        bookingStatus: 'confirmed',
      });

      if (serverBooking && serverBooking.id) {
        newRecord.id = serverBooking.id;
        if (serverBooking.total_amount) {
          newRecord.totalCost = Number(serverBooking.total_amount);
          newRecord.totalCostDisplay = formatCost(newRecord.totalCost);
        }
      }

      // Save to local store and transition to confirmed state
      saveNewBooking(newRecord);
      setConfirmedBooking(newRecord);
      onBookingConfirmed(newRecord);
      setStep('confirmed');
    } catch (apiErr: any) {
      console.error('[BookingModal] Backend booking error:', apiErr);
      setSubmitError(apiErr?.message || 'Failed to complete booking on server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyRef = () => {
    if (confirmedBooking?.referenceId && navigator.clipboard) {
      navigator.clipboard.writeText(confirmedBooking.referenceId);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-[#C5A059]/40 rounded-3xl shadow-2xl overflow-hidden text-neutral-900 dark:text-white my-auto max-h-[92vh] flex flex-col"
        id="auric-booking-modal"
      >
        {effectiveItem && (
          <SeoHead
            title={`Reserve ${effectiveItem.name} — Auric Luxury`}
            description={(effectiveItem as any).tagline || (effectiveItem as any).shortDescription || (effectiveItem as any).description || `Reserve your sanctuary with Auric Travels.`}
            image={effectiveItem.image}
            url={`https://auric-travels-y948.onrender.com/#bookings`}
          />
        )}

        {/* TOP HEADER */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-white/10 flex items-center justify-between bg-neutral-50/90 dark:bg-black/60 sticky top-0 z-20 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
              {bookingType === 'stay' ? (
                <Building className="w-4 h-4" />
              ) : (
                <Compass className="w-4 h-4" />
              )}
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#8C6D32] dark:text-[#C5A059] uppercase tracking-widest block font-bold">
                {bookingType === 'stay' ? 'Luxury Stay Arrangement' : 'Curated Pursuit Arrangement'}
              </span>
              <h2 className="text-base sm:text-lg font-serif font-bold text-neutral-900 dark:text-white truncate max-w-xs sm:max-w-md">
                {step === 'form' ? 'Confirm Sanctuary Booking' : 'Booking Confirmed'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {step === 'form' && (
              <div className="flex items-center bg-neutral-100 dark:bg-[#050505] border border-neutral-200 dark:border-white/10 rounded-xl p-0.5 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setCurrency('INR')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    currency === 'INR'
                      ? 'bg-[#C5A059] text-black font-bold'
                      : 'text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  ₹ INR
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    currency === 'USD'
                      ? 'bg-[#C5A059] text-black font-bold'
                      : 'text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  $ USD
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-500 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white transition-all"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6 flex-1 min-h-0 custom-scrollbar overscroll-contain pb-10 sm:pb-8">
          {step === 'form' ? (
            <form onSubmit={handleConfirmBooking} className="space-y-6" id="booking-arrangement-form">
              {/* 1. SELECTED ITEM HERO SUMMARY CARD */}
              <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 dark:bg-gradient-to-br dark:from-[#151515] dark:to-[#0A0A0A] border border-neutral-200 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-36 h-28 rounded-xl overflow-hidden border border-neutral-200 dark:border-white/10 shrink-0 bg-neutral-900">
                  <SafeImage
                    src={imageUrl}
                    alt={title}
                    categoryHint={category || location}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-sm text-[#F3E5AB] text-[10px] font-mono border border-white/10">
                    {category}
                  </div>
                </div>

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs text-[#8C6D32] dark:text-[#C5A059] font-semibold">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{location}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-neutral-900 dark:text-white leading-snug truncate">
                    {title}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-gray-400 line-clamp-1">
                    {effectiveStayItem?.tagline || effectiveExpItem?.shortDescription || 'Bespoke Auric voyage inclusion'}
                  </p>
                  <div className="flex items-center gap-3 pt-1 text-xs font-mono">
                    <span className="text-neutral-500 dark:text-gray-400">Baseline Rate:</span>
                    <span className="text-[#8C6D32] dark:text-[#F3E5AB] font-bold">
                      {formatCost(Math.round(basePricePerUnit))} {bookingType === 'stay' ? '/ night' : '/ guest'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. DATES & PARTY SELECTION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Stay Dates */}
                {bookingType === 'stay' ? (
                  <>
                    <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#080808] border border-neutral-200 dark:border-white/10 space-y-2">
                      <label className="text-xs font-mono uppercase tracking-wider text-neutral-700 dark:text-gray-300 flex items-center gap-1.5 font-bold">
                        <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Check-In Date</span>
                      </label>
                      <input
                        type="date"
                        value={checkInDate}
                        min={todayStr}
                        onChange={(e) => {
                          setCheckInDate(e.target.value);
                          if (e.target.value >= checkOutDate) {
                            const next = new Date(e.target.value);
                            next.setDate(next.getDate() + 2);
                            setCheckOutDate(next.toISOString().split('T')[0]);
                          }
                        }}
                        className="w-full bg-white dark:bg-[#121212] border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-[#C5A059] font-mono"
                        required
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#080808] border border-neutral-200 dark:border-white/10 space-y-2">
                      <label className="text-xs font-mono uppercase tracking-wider text-neutral-700 dark:text-gray-300 flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>Check-Out Date</span>
                        </span>
                        <span className={`text-[11px] font-mono font-bold ${isStayDateInvalid ? 'text-red-500' : 'text-[#8C6D32] dark:text-[#C5A059]'}`}>
                          {isStayDateInvalid ? 'Invalid Range' : `${nightsCount} ${nightsCount === 1 ? 'Night' : 'Nights'}`}
                        </span>
                      </label>
                      <input
                        type="date"
                        value={checkOutDate}
                        min={checkInDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        className={`w-full bg-white dark:bg-[#121212] border rounded-xl px-3.5 py-2.5 text-sm text-neutral-900 dark:text-white focus:outline-none font-mono ${
                          isStayDateInvalid ? 'border-red-500 focus:border-red-500' : 'border-neutral-200 dark:border-white/10 focus:border-[#C5A059]'
                        }`}
                        required
                      />
                      {isStayDateInvalid && (
                        <p className="text-[11px] text-red-500 font-mono flex items-center gap-1 pt-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>Check-out date must be strictly after check-in date.</span>
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  /* Experience Date & Time Slot */
                  <>
                    <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#080808] border border-neutral-200 dark:border-white/10 space-y-2">
                      <label className="text-xs font-mono uppercase tracking-wider text-neutral-700 dark:text-gray-300 flex items-center gap-1.5 font-bold">
                        <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Experience Date</span>
                      </label>
                      <input
                        type="date"
                        value={experienceDate}
                        min={todayStr}
                        onChange={(e) => setExperienceDate(e.target.value)}
                        className="w-full bg-white dark:bg-[#121212] border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-[#C5A059] font-mono"
                        required
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#080808] border border-neutral-200 dark:border-white/10 space-y-2">
                      <label className="text-xs font-mono uppercase tracking-wider text-neutral-700 dark:text-gray-300 flex items-center gap-1.5 font-bold">
                        <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Time Slot Preference</span>
                      </label>
                      <select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        className="w-full bg-white dark:bg-[#121212] border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-[#C5A059]"
                      >
                        <option value="Dawn / Sunrise (06:00 AM – 10:30 AM)">
                          🌅 Dawn / Sunrise (06:00 AM – 10:30 AM)
                        </option>
                        <option value="Morning Session (09:30 AM – 01:30 PM)">
                          ☀️ Morning Session (09:30 AM – 01:30 PM)
                        </option>
                        <option value="Twilight / Sunset (04:00 PM – 07:30 PM)">
                          🌇 Twilight / Sunset (04:00 PM – 07:30 PM)
                        </option>
                        <option value="Starlit Evening (07:30 PM – 10:30 PM)">
                          ✨ Starlit Evening (07:30 PM – 10:30 PM)
                        </option>
                      </select>
                    </div>
                  </>
                )}
              </div>

              {/* 3. ROOM SELECTION (for stays) or EXPERIENCE FORMAT (for experiences) */}
              {bookingType === 'stay' && effectiveStayItem?.roomTypes && (
                <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 dark:bg-[#080808] border border-neutral-200 dark:border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#8C6D32] dark:text-[#C5A059] flex items-center gap-1.5 font-bold">
                      <BedDouble className="w-3.5 h-3.5" />
                      <span>Select Chamber or Villa Tier</span>
                    </label>
                    <span className="text-[11px] text-neutral-500 dark:text-gray-400 font-mono">
                      {effectiveStayItem.roomTypes.length} Available Tiers
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {effectiveStayItem.roomTypes.map((room, idx) => {
                      const isSelected = selectedRoomIndex === idx;
                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedRoomIndex(idx)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'bg-[#C5A059]/15 border-[#C5A059] ring-1 ring-[#C5A059]/50 shadow-lg shadow-[#C5A059]/10'
                              : 'bg-white dark:bg-[#121212] border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-xs font-semibold text-neutral-900 dark:text-white truncate">{room.name}</h4>
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />}
                            </div>
                            <p className="text-[11px] text-neutral-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                              {room.description}
                            </p>
                          </div>
                          <div className="pt-2 mt-2 border-t border-neutral-200 dark:border-white/5 flex items-center justify-between text-[10px] font-mono">
                            <span className="text-neutral-500 dark:text-gray-400">Multiplier:</span>
                            <span className="text-[#8C6D32] dark:text-[#F3E5AB] font-bold">{room.priceMultiplier}x Base</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. TRAVELERS & PARTY SIZE */}
              <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 dark:bg-[#080808] border border-neutral-200 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-700 dark:text-gray-300 flex items-center gap-1.5 font-bold">
                    <Users className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Number of Travellers / Guests</span>
                  </label>
                  <span className="text-xs font-bold text-[#8C6D32] dark:text-[#F3E5AB] font-mono">
                    {travelersCount} {travelersCount === 1 ? 'Guest' : 'Guests'}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white dark:bg-[#121212] border border-neutral-200 dark:border-white/10 rounded-xl p-2">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 6].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setTravelersCount(num)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                          travelersCount === num
                            ? 'bg-[#C5A059] text-black font-bold shadow'
                            : 'bg-neutral-100 dark:bg-white/5 text-neutral-700 dark:text-gray-300 hover:bg-neutral-200 dark:hover:bg-white/10 hover:text-black dark:hover:text-white'
                        }`}
                      >
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTravelersCount((prev) => Math.max(1, prev - 1))}
                      className="w-7 h-7 rounded-lg bg-neutral-200 dark:bg-white/10 hover:bg-neutral-300 dark:hover:bg-white/20 text-neutral-900 dark:text-white flex items-center justify-center font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="text-xs font-mono w-4 text-center font-bold">{travelersCount}</span>
                    <button
                      type="button"
                      onClick={() => setTravelersCount((prev) => Math.min(12, prev + 1))}
                      className="w-7 h-7 rounded-lg bg-neutral-200 dark:bg-white/10 hover:bg-neutral-300 dark:hover:bg-white/20 text-neutral-900 dark:text-white flex items-center justify-center font-bold text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* 5. GUEST DETAILS */}
              <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 dark:bg-[#080808] border border-neutral-200 dark:border-white/10 space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#8C6D32] dark:text-[#C5A059] flex items-center gap-1.5 font-bold">
                  <User className="w-3.5 h-3.5" />
                  <span>Lead Guest & Contact Information</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-neutral-500 dark:text-gray-400 font-mono">Full Name *</label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400 dark:text-gray-500" />
                      <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="e.g. Ajay Reddy"
                        className="w-full bg-white dark:bg-[#121212] border border-neutral-200 dark:border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-[#C5A059]"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] text-neutral-500 dark:text-gray-400 font-mono">Email Address *</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400 dark:text-gray-500" />
                      <input
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="e.g. voyager@aurictravel.com"
                        className="w-full bg-white dark:bg-[#121212] border border-neutral-200 dark:border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-[#C5A059]"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] text-neutral-500 dark:text-gray-400 font-mono">Phone Number *</label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400 dark:text-gray-500" />
                      <input
                        type="tel"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="e.g. +91 98450 12345"
                        className="w-full bg-white dark:bg-[#121212] border border-neutral-200 dark:border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-[#C5A059]"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] text-neutral-500 dark:text-gray-400 font-mono flex items-center justify-between">
                    <span>Special Concierge Requests & Preferences (Optional)</span>
                    <span className="text-neutral-400 dark:text-gray-600 text-[10px]">Airport transfers, dietary, celebrations</span>
                  </label>
                  <div className="relative">
                    <MessageSquare className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400 dark:text-gray-500" />
                    <textarea
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="e.g., Requesting private river-facing suite, vegetarian royal thali on arrival day, airport chauffeur transfer."
                      rows={2}
                      className="w-full bg-white dark:bg-[#121212] border border-neutral-200 dark:border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>
              </div>

              {/* 6. ESTIMATED TOTAL COST BREAKDOWN */}
              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#0A0A0A] border border-[#C5A059]/30 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-3">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-[#8C6D32] dark:text-[#C5A059] flex items-center gap-1.5 font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Estimated Total Cost</span>
                  </h4>
                  <span className="text-[11px] font-mono text-neutral-500 dark:text-gray-400">
                    Transparent Sanctuary Pricing
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-neutral-700 dark:text-gray-300">
                    <span>
                      {bookingType === 'stay'
                        ? `${formatCost(Math.round(basePricePerUnit))} × ${nightsCount} ${nightsCount === 1 ? 'Night' : 'Nights'}`
                        : `${formatCost(Math.round(basePricePerUnit))} × ${travelersCount} ${travelersCount === 1 ? 'Guest' : 'Guests'}`}
                    </span>
                    <span className="font-mono text-neutral-900 dark:text-white font-bold">
                      {formatCost(Math.round(totalBaseAmount))}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-neutral-500 dark:text-gray-400">
                    <span>
                      {bookingType === 'stay'
                        ? 'Luxury Hospitality Tax & Service (12%)'
                        : 'Forest Permits, VIP Naturalist & Taxes (10%)'}
                    </span>
                    <span className="font-mono text-neutral-700 dark:text-gray-300">
                      {formatCost(Math.round(taxesAndFees))}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-neutral-200 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-sm sm:text-base font-serif font-bold text-neutral-900 dark:text-white block">
                        Estimated Grand Total
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500 dark:text-gray-400">
                        {bookingType === 'stay'
                          ? `Includes ${nightsCount} nights for ${travelersCount} guests`
                          : `Includes private permits & equipment for ${travelersCount} guests`}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl sm:text-2xl font-mono font-bold text-[#8C6D32] dark:text-[#F3E5AB]">
                        {formatCost(Math.round(finalTotal))}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Complimentary Hold Notice */}
                <div className="p-3 rounded-xl bg-neutral-100 dark:bg-black/40 border border-neutral-200 dark:border-white/5 flex items-start gap-2.5 text-[11px] text-neutral-600 dark:text-gray-400">
                  <ShieldCheck className="w-4 h-4 text-[#8C6D32] dark:text-[#C5A059] shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-neutral-900 dark:text-gray-300">Complimentary Auric Reservation Hold:</strong> Instant booking voucher generated. No immediate card charge required. Our concierge will contact you to coordinate dates and bespoke inclusions.
                  </p>
                </div>
              </div>

              {/* Error notice if server booking failed */}
              {submitError && (
                <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Unauthenticated notice if user is not logged in */}
              {!currentUser && !getStoredAuthToken() && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-300 text-xs flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>Auric Society authentication required to complete booking.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (onRequireAuth) onRequireAuth(() => {});
                    }}
                    className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-[11px] font-bold uppercase tracking-wider shrink-0 transition-all shadow"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {/* 7. CONFIRM BUTTON */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || isStayDateInvalid}
                  id="confirm-sanctuary-booking-btn"
                  className="w-full py-4 rounded-2xl bg-[#C5A059] hover:bg-[#F3E5AB] text-black font-bold uppercase tracking-wider text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#C5A059]/25 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Generating Sanctuary Booking Voucher...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-black" />
                      <span>Confirm Booking • {formatCost(Math.round(finalTotal))}</span>
                      <ArrowRight className="w-4 h-4 text-black" />
                    </>
                  )}
                </button>

                <p className="text-center text-[10px] text-neutral-500 dark:text-gray-500 font-mono">
                  By clicking Confirm Booking, you reserve this sanctuary arrangement in your Auric Travel Vault.
                </p>
              </div>
            </form>
          ) : (
            /* ================= STEP 2: CONFIRMED BOOKING CONFIRMATION SCREEN ================= */
            <div className="space-y-6 text-center py-2 animate-in fade-in zoom-in-95 duration-300" id="booking-confirmation-view">
              {/* Success Badge */}
              <div className="inline-flex flex-col items-center justify-center gap-2">
                <div className="w-16 h-16 rounded-full bg-[#C5A059]/20 border-2 border-[#C5A059] flex items-center justify-center text-[#C5A059] shadow-xl shadow-[#C5A059]/30">
                  <CheckCircle2 className="w-8 h-8 text-[#8C6D32] dark:text-[#F3E5AB]" />
                </div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#8C6D32] dark:text-[#C5A059] font-bold mt-1">
                  Sanctuary Reservation Confirmed
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 dark:text-white">
                  Your Journey Awaits
                </h3>
                <p className="text-neutral-600 dark:text-gray-300 text-xs sm:text-sm max-w-md mx-auto font-light">
                  We have reserved your sanctuary arrangement and archived this reservation into your <strong className="text-[#8C6D32] dark:text-[#F3E5AB]">My Bookings</strong> vault.
                </p>
              </div>

              {/* Reference ID Pill */}
              {confirmedBooking && (
                <div className="max-w-md mx-auto p-4 rounded-2xl bg-neutral-50 dark:bg-[#121212] border border-[#C5A059]/40 flex items-center justify-between shadow-lg">
                  <div className="text-left">
                    <span className="text-[10px] font-mono uppercase text-neutral-500 dark:text-gray-400 block tracking-wider">
                      Booking Reference ID
                    </span>
                    <span className="text-lg font-mono font-bold text-[#8C6D32] dark:text-[#F3E5AB] tracking-widest">
                      {confirmedBooking.referenceId}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyRef}
                    className="px-3 py-1.5 rounded-xl bg-neutral-200 dark:bg-white/10 hover:bg-[#C5A059] hover:text-black text-neutral-800 dark:text-gray-300 text-xs font-mono transition-all flex items-center gap-1.5"
                  >
                    {copiedRef ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy ID</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Confirmation Details Card */}
              {confirmedBooking && (
                <div className="max-w-xl mx-auto rounded-2xl bg-neutral-50 dark:bg-[#080808] border border-neutral-200 dark:border-white/10 p-5 text-left space-y-4">
                  <div className="flex items-center gap-3.5 border-b border-neutral-200 dark:border-white/10 pb-4">
                    <SafeImage
                      src={confirmedBooking.imageUrl}
                      alt={confirmedBooking.title}
                      categoryHint={confirmedBooking.category || confirmedBooking.location}
                      className="w-16 h-16 rounded-xl object-cover border border-neutral-200 dark:border-white/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono text-[#8C6D32] dark:text-[#C5A059] uppercase block font-bold">
                        {confirmedBooking.category}
                      </span>
                      <h4 className="text-base font-serif font-bold text-neutral-900 dark:text-white truncate">
                        {confirmedBooking.title}
                      </h4>
                      <p className="text-xs text-neutral-500 dark:text-gray-400 truncate">
                        {confirmedBooking.subtitle} • {confirmedBooking.location}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-mono text-neutral-500 dark:text-gray-400 block uppercase">
                        {confirmedBooking.type === 'stay' ? 'Check-In' : 'Date'}
                      </span>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        {confirmedBooking.startDate}
                      </span>
                    </div>

                    {confirmedBooking.endDate && (
                      <div>
                        <span className="text-[10px] font-mono text-neutral-500 dark:text-gray-400 block uppercase">
                          Check-Out
                        </span>
                        <span className="font-semibold text-neutral-900 dark:text-white">
                          {confirmedBooking.endDate} ({confirmedBooking.numberOfNights} Nights)
                        </span>
                      </div>
                    )}

                    {confirmedBooking.timeSlot && (
                      <div className="col-span-2 sm:col-span-1">
                        <span className="text-[10px] font-mono text-neutral-500 dark:text-gray-400 block uppercase">
                          Time Slot
                        </span>
                        <span className="font-semibold text-neutral-900 dark:text-white truncate block">
                          {confirmedBooking.timeSlot.split('(')[0]}
                        </span>
                      </div>
                    )}

                    <div>
                      <span className="text-[10px] font-mono text-neutral-500 dark:text-gray-400 block uppercase">
                        Party Size
                      </span>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        {confirmedBooking.numberOfGuests} {confirmedBooking.numberOfGuests === 1 ? 'Guest' : 'Guests'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-neutral-500 dark:text-gray-400 block uppercase">
                        Lead Guest
                      </span>
                      <span className="font-semibold text-neutral-900 dark:text-white truncate block">
                        {confirmedBooking.guestName}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-neutral-500 dark:text-gray-400 block uppercase">
                        Total Confirmed
                      </span>
                      <span className="font-bold text-[#8C6D32] dark:text-[#F3E5AB] font-mono">
                        {confirmedBooking.totalCostDisplay}
                      </span>
                    </div>
                  </div>

                  {confirmedBooking.specialRequests && (
                    <div className="pt-2 border-t border-neutral-200 dark:border-white/5 text-xs text-neutral-700 dark:text-gray-300">
                      <span className="text-[10px] font-mono text-neutral-400 dark:text-gray-500 uppercase block">Special Requests:</span>
                      <p className="italic">{confirmedBooking.specialRequests}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="max-w-md mx-auto flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  id="go-to-my-bookings-btn"
                  onClick={() => {
                    onClose();
                    if (onNavigateToBookings) {
                      onNavigateToBookings();
                    }
                  }}
                  className="w-full py-3.5 rounded-2xl bg-[#C5A059] hover:bg-[#F3E5AB] text-black font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#C5A059]/20"
                >
                  <FileText className="w-4 h-4 text-black" />
                  <span>View in My Bookings</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3.5 rounded-2xl bg-neutral-100 dark:bg-[#080808] hover:bg-neutral-200 dark:hover:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-gray-300 hover:text-neutral-900 dark:hover:text-white font-semibold text-xs transition-all"
                >
                  Continue Exploring
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
