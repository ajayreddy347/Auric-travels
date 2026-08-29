import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Sparkles,
  Calendar,
  Heart,
  ShieldCheck,
  LogOut,
  Edit3,
  CheckCircle2,
  Clock,
  ArrowRight,
  Building,
  Compass,
  Star,
  Award,
  CreditCard,
  Settings,
  ChevronRight,
  KeyRound,
  ExternalLink,
} from 'lucide-react';
import { motion } from 'motion/react';
import { AuthUser, BookingRecord, Destination } from '../types';
import { formatCurrency } from '../utils/currency';
import { updateStoredUserProfile } from '../utils/authStore';
import { SafeImage } from './SafeImage';

interface AccountProfileSectionProps {
  user: AuthUser | null;
  bookings: BookingRecord[];
  savedDestinations: Destination[];
  onOpenAuth: () => void;
  onLogout: () => void;
  onNavigateToBookings: () => void;
  onNavigateToWishlist: () => void;
  onNavigateToPlanner: (destName?: string) => void;
  onSelectDestination: (dest: Destination) => void;
  onBookStay: (destName?: string) => void;
  onUpdateUser: (updated: AuthUser) => void;
}

export const AccountProfileSection: React.FC<AccountProfileSectionProps> = ({
  user,
  bookings,
  savedDestinations,
  onOpenAuth,
  onLogout,
  onNavigateToBookings,
  onNavigateToWishlist,
  onNavigateToPlanner,
  onSelectDestination,
  onBookStay,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'saved' | 'privileges' | 'preferences'>('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editCity, setEditCity] = useState(user?.homeCity || '');
  const [editStyle, setEditStyle] = useState(user?.travelPreferences?.travelStyle || 'Bespoke Heritage & Ultra-Luxury');
  const [editDietary, setEditDietary] = useState(user?.travelPreferences?.dietary || 'Gourmet Vegetarian / Epicurean');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // If user is not authenticated, show protected gate
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-neutral-50 dark:bg-gradient-to-b dark:from-[#0E0C06] dark:via-[#0A0A0A] dark:to-[#050505] border border-neutral-200 dark:border-[#C5A059]/30 relative overflow-hidden shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#8C6D32] dark:text-[#F3E5AB] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#C5A059]/10">
            <Shield className="w-8 h-8" />
          </div>

          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#8C6D32] dark:text-[#C5A059] block mb-2 font-semibold">
            AURIC SOCIETY MEMBER PORTAL
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 dark:text-white tracking-tight">
            Authentication Required
          </h2>
          <p className="text-neutral-600 dark:text-gray-300 text-sm max-w-md mx-auto mt-2 leading-relaxed">
            Please sign in to access your private voyager portfolio, active sanctuary bookings, curated dream vault, and dedicated concierge privileges.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="account-gate-signin-btn"
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#C5A059] to-[#F3E5AB] text-black font-bold uppercase tracking-wider text-xs hover:scale-105 transition-all shadow-xl shadow-[#C5A059]/20 flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Sign In to Member Portal</span>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-white/10 flex items-center justify-center gap-6 text-xs text-neutral-500 dark:text-gray-400 font-mono">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>256-Bit Encrypted Vault</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Instant Session Restoral</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updateStoredUserProfile({
      name: editName.trim() || user.name,
      phone: editPhone.trim() || user.phone,
      homeCity: editCity.trim() || user.homeCity,
      travelPreferences: {
        travelStyle: editStyle,
        interests: user.travelPreferences?.interests || ['Royal Palaces', 'Wildlife Reserves', 'Private Yachting'],
        dietary: editDietary,
      },
    });
    if (updated) {
      onUpdateUser(updated);
    }
    setIsEditingProfile(false);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 4000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* 1. TOP HERO PROFILE CARD */}
      <div className="rounded-3xl bg-neutral-100 dark:bg-gradient-to-br dark:from-[#121008] dark:via-[#0A0A0A] dark:to-[#050505] border border-neutral-200 dark:border-[#C5A059]/30 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Avatar & User Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#C5A059] to-[#8C6D32] p-0.5 shadow-xl shadow-[#C5A059]/20 shrink-0">
                <div className="w-full h-full rounded-2xl bg-white dark:bg-[#080808] overflow-hidden flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-[#8C6D32] dark:text-[#F3E5AB]">
                      {user.name.charAt(0)}
                    </span>
                  )}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-[#C5A059] text-black text-[9px] font-mono font-bold uppercase tracking-wider shadow">
                VIP
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#8C6D32] dark:text-[#F3E5AB] text-[10px] font-mono uppercase tracking-widest font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#C5A059]" />
                  <span>{user.memberTier || 'Founding Sovereign'}</span>
                </span>
                <span className="text-xs font-mono text-neutral-500 dark:text-gray-400">
                  ID: <strong className="text-neutral-900 dark:text-white">{user.memberId || 'AUR-M-9164'}</strong>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 dark:text-white tracking-tight">
                {user.name}
              </h1>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-neutral-600 dark:text-gray-300 font-sans">
                <span className="flex items-center gap-1.5 text-neutral-500 dark:text-gray-400">
                  <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{user.email}</span>
                </span>
                {user.phone && (
                  <span className="flex items-center gap-1.5 text-neutral-500 dark:text-gray-400">
                    <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{user.phone}</span>
                  </span>
                )}
                {user.homeCity && (
                  <span className="flex items-center gap-1.5 text-neutral-500 dark:text-gray-400">
                    <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{user.homeCity}</span>
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-neutral-500 dark:text-gray-400">
                  <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Member since {user.joinedDate || '2025'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-neutral-200 dark:border-white/10">
            <button
              id="edit-profile-btn"
              onClick={() => {
                setEditName(user.name);
                setEditPhone(user.phone || '');
                setEditCity(user.homeCity || '');
                setEditStyle(user.travelPreferences?.travelStyle || 'Bespoke Heritage & Ultra-Luxury');
                setEditDietary(user.travelPreferences?.dietary || 'Gourmet Vegetarian / Epicurean');
                setIsEditingProfile(true);
              }}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-neutral-200 dark:bg-white/5 hover:bg-neutral-300 dark:hover:bg-white/10 border border-neutral-300 dark:border-white/10 text-xs font-semibold text-neutral-700 dark:text-gray-200 hover:text-neutral-900 dark:hover:text-white transition-all flex items-center justify-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Edit Profile</span>
            </button>

            <button
              id="logout-btn"
              onClick={onLogout}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-300 hover:text-rose-700 dark:hover:text-rose-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {saveSuccessMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Profile updates saved successfully.</span>
          </motion.div>
        )}
      </div>

      {/* 2. STATS & SUMMARY PILLARS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Bookings Stat */}
        <div
          onClick={() => setActiveTab('bookings')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            activeTab === 'bookings'
              ? 'bg-amber-500/10 dark:bg-[#14120A] border-[#C5A059] shadow-lg shadow-[#C5A059]/10'
              : 'bg-white dark:bg-[#0A0A0A] border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 dark:text-gray-400 font-bold">
              Sanctuary Bookings
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 dark:text-white">
              {bookings.length}
            </span>
            <span className="text-xs text-neutral-500 dark:text-gray-400 block mt-0.5">
              {bookings.length === 1 ? '1 active arrangement' : `${bookings.length} active arrangements`}
            </span>
          </div>
        </div>

        {/* Saved Vault Stat */}
        <div
          onClick={() => setActiveTab('saved')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            activeTab === 'saved'
              ? 'bg-amber-500/10 dark:bg-[#14120A] border-[#C5A059] shadow-lg shadow-[#C5A059]/10'
              : 'bg-white dark:bg-[#0A0A0A] border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 dark:text-gray-400 font-bold">
              Saved in Vault
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-500 dark:text-rose-400 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 dark:text-white">
              {savedDestinations.length}
            </span>
            <span className="text-xs text-neutral-500 dark:text-gray-400 block mt-0.5">Bookmarked Sanctuaries</span>
          </div>
        </div>

        {/* Society Status */}
        <div
          onClick={() => setActiveTab('privileges')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            activeTab === 'privileges'
              ? 'bg-amber-500/10 dark:bg-[#14120A] border-[#C5A059] shadow-lg shadow-[#C5A059]/10'
              : 'bg-white dark:bg-[#0A0A0A] border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C6D32] dark:text-[#C5A059] font-bold">
              Society Tier
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#C5A059]/20 text-[#8C6D32] dark:text-[#F3E5AB] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-lg sm:text-xl font-serif font-bold text-[#8C6D32] dark:text-[#F3E5AB] block truncate">
              {user.memberTier || 'Sovereign'}
            </span>
            <span className="text-xs text-neutral-500 dark:text-gray-400 block mt-0.5">Top-Tier VIP Privileges</span>
          </div>
        </div>

        {/* Private Concierge Desk */}
        <div
          onClick={() => setActiveTab('privileges')}
          className="p-4 sm:p-5 rounded-2xl bg-neutral-100 dark:bg-gradient-to-br dark:from-[#121008] dark:to-[#0A0A0A] border border-neutral-200 dark:border-[#C5A059]/30 flex flex-col justify-between cursor-pointer hover:border-[#C5A059] transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
              Private Concierge
            </span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
          </div>
          <div className="mt-3">
            <span className="text-sm font-serif font-bold text-neutral-900 dark:text-white block">
              24/7 Dedicated Architect
            </span>
            <span className="text-xs text-[#8C6D32] dark:text-[#F3E5AB] flex items-center gap-1 mt-0.5 font-semibold">
              <span>Direct Hotline Active</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* 3. NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-white/10 overflow-x-auto pb-2 custom-scrollbar">
        {[
          { id: 'overview', label: 'Portfolio Overview', icon: Sparkles },
          { id: 'bookings', label: `My Bookings (${bookings.length})`, icon: ShieldCheck },
          { id: 'saved', label: `Saved Vault (${savedDestinations.length})`, icon: Heart },
          { id: 'privileges', label: 'Society Privileges', icon: Award },
          { id: 'preferences', label: 'Travel Preferences', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-[#C5A059] text-black font-bold shadow-md shadow-[#C5A059]/20'
                  : 'text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. TAB CONTENTS */}
      {/* TAB: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Quick Active Bookings Preview */}
          <div className="rounded-3xl bg-white dark:bg-[#0A0A0A] border border-neutral-200 dark:border-white/10 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#8C6D32] dark:text-[#C5A059] font-bold">
                  Active Reservations
                </span>
                <h3 className="text-xl font-serif font-bold text-neutral-900 dark:text-white">Upcoming Journeys & Stays</h3>
              </div>
              <button
                onClick={onNavigateToBookings}
                className="text-xs font-mono text-[#8C6D32] dark:text-[#C5A059] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>View All In Bookings Manager</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {bookings.length === 0 ? (
              <div className="py-8 text-center bg-neutral-50 dark:bg-[#050505] rounded-2xl border border-neutral-200 dark:border-white/5 space-y-3">
                <Building className="w-10 h-10 text-neutral-400 dark:text-gray-600 mx-auto" />
                <p className="text-xs text-neutral-500 dark:text-gray-400 max-w-sm mx-auto">
                  You have no active bookings at this time. Explore our luxury sanctuaries across India and global havens.
                </p>
                <button
                  onClick={() => onBookStay()}
                  className="px-4 py-2 rounded-full bg-[#C5A059] text-black text-xs font-bold uppercase tracking-wider"
                >
                  Book A Luxury Stay
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookings.slice(0, 2).map((bk) => (
                  <div
                    key={bk.id}
                    className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/10 hover:border-[#C5A059]/40 transition-all flex gap-4"
                  >
                    <SafeImage
                      src={bk.imageUrl}
                      alt={bk.title}
                      categoryHint={bk.type === 'stay' ? 'hotel' : 'experience'}
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#8C6D32] dark:text-[#C5A059] uppercase font-bold">
                          {bk.referenceId}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold">
                          {bk.status}
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-sm text-neutral-900 dark:text-white truncate">{bk.title}</h4>
                      <p className="text-[11px] text-neutral-500 dark:text-gray-400 line-clamp-1">{bk.location}</p>
                      <div className="pt-1 flex items-center justify-between text-xs font-mono text-neutral-600 dark:text-gray-300">
                        <span>{bk.startDate}</span>
                        <span className="text-[#8C6D32] dark:text-[#F3E5AB] font-bold">{bk.totalCostDisplay}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Destinations Preview */}
          <div className="rounded-3xl bg-white dark:bg-[#0A0A0A] border border-neutral-200 dark:border-white/10 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-rose-500 dark:text-rose-400 font-bold">
                  Wishlist Vault
                </span>
                <h3 className="text-xl font-serif font-bold text-neutral-900 dark:text-white">Your Bookmarked Sanctuaries</h3>
              </div>
              <button
                onClick={onNavigateToWishlist}
                className="text-xs font-mono text-rose-400 hover:underline flex items-center gap-1"
              >
                <span>View Full Vault ({savedDestinations.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {savedDestinations.length === 0 ? (
              <div className="py-8 text-center bg-neutral-50 dark:bg-[#050505] rounded-2xl border border-neutral-200 dark:border-white/5 space-y-2">
                <Heart className="w-8 h-8 text-neutral-400 dark:text-gray-600 mx-auto" />
                <p className="text-xs text-neutral-500 dark:text-gray-400">Your dream board is empty. Bookmark places to build your journey.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {savedDestinations.slice(0, 3).map((dest) => (
                  <div
                    key={dest.id}
                    onClick={() => onSelectDestination(dest)}
                    className="group cursor-pointer rounded-2xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/10 hover:border-[#C5A059]/40 overflow-hidden transition-all"
                  >
                    <div className="h-28 relative overflow-hidden">
                      <SafeImage
                        src={dest.image}
                        alt={dest.name}
                        categoryHint={dest.category || dest.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                      <span className="absolute bottom-2 left-2 text-[10px] font-mono text-[#F3E5AB]">
                        {dest.country}
                      </span>
                    </div>
                    <div className="p-3">
                      <h4 className="font-serif font-bold text-sm text-neutral-900 dark:text-white truncate">{dest.name}</h4>
                      <p className="text-[11px] text-neutral-500 dark:text-gray-400 line-clamp-1">{dest.tagline}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="rounded-3xl bg-white dark:bg-[#0A0A0A] border border-neutral-200 dark:border-white/10 p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#8C6D32] dark:text-[#C5A059] font-bold">
                Reservations Portfolio
              </span>
              <h3 className="text-2xl font-serif font-bold text-neutral-900 dark:text-white">All Booked Sanctuaries & Pursuits</h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onBookStay()}
                className="px-4 py-2 rounded-xl bg-[#C5A059] text-black text-xs font-bold uppercase tracking-wider hover:bg-[#F3E5AB] transition-all"
              >
                + New Stay Booking
              </button>
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="py-16 text-center bg-neutral-50 dark:bg-[#050505] rounded-2xl border border-neutral-200 dark:border-white/5 space-y-4">
              <ShieldCheck className="w-12 h-12 text-neutral-400 dark:text-gray-600 mx-auto" />
              <h4 className="text-base font-serif font-bold text-neutral-900 dark:text-white">No Reservations Found</h4>
              <p className="text-xs text-neutral-500 dark:text-gray-400 max-w-sm mx-auto">
                Your portfolio has no active bookings. Reserve palace suites, wilderness safari lodges, or private dining experiences.
              </p>
              <button
                onClick={() => onBookStay()}
                className="px-5 py-2.5 rounded-full bg-[#C5A059] text-black font-bold uppercase tracking-wider text-xs"
              >
                Browse Luxury Stays
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((bk) => (
                <div
                  key={bk.id}
                  className="p-5 rounded-2xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/10 hover:border-[#C5A059]/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                >
                  <div className="flex items-center gap-4">
                    <SafeImage
                      src={bk.imageUrl}
                      alt={bk.title}
                      categoryHint={bk.type === 'stay' ? 'hotel' : 'experience'}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#C5A059]/20 text-[#8C6D32] dark:text-[#F3E5AB] font-bold">
                          {bk.type === 'stay' ? 'Palace & Sanctuary' : 'Private Experience'}
                        </span>
                        <span className="text-xs font-mono text-neutral-500 dark:text-gray-400">Ref: {bk.referenceId}</span>
                      </div>
                      <h4 className="font-serif font-bold text-base text-neutral-900 dark:text-white">{bk.title}</h4>
                      <p className="text-xs text-neutral-500 dark:text-gray-400">{bk.location}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-600 dark:text-gray-300 font-mono pt-1">
                        <span>Date: <strong>{bk.startDate}</strong></span>
                        {bk.endDate && <span>Check-out: <strong>{bk.endDate}</strong></span>}
                        <span>Guests: <strong>{bk.numberOfGuests}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-end justify-between w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-neutral-200 dark:border-white/5">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 dark:text-gray-400 block font-bold">
                        Total Amount
                      </span>
                      <span className="text-lg font-serif font-bold text-[#8C6D32] dark:text-[#F3E5AB]">
                        {bk.totalCostDisplay}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold capitalize">
                        ● {bk.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: SAVED */}
      {activeTab === 'saved' && (
        <div className="rounded-3xl bg-white dark:bg-[#0A0A0A] border border-neutral-200 dark:border-white/10 p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-rose-500 dark:text-rose-400 font-bold">
                Curated Travel Vault
              </span>
              <h3 className="text-2xl font-serif font-bold text-neutral-900 dark:text-white">Bookmarked Sanctuaries ({savedDestinations.length})</h3>
            </div>
            {savedDestinations.length > 0 && (
              <button
                onClick={() => onNavigateToPlanner(savedDestinations[0]?.name)}
                className="px-4 py-2 rounded-xl bg-[#C5A059] text-black text-xs font-bold uppercase tracking-wider hover:bg-[#F3E5AB] transition-all"
              >
                Plan Itinerary With Saved
              </button>
            )}
          </div>

          {savedDestinations.length === 0 ? (
            <div className="py-16 text-center bg-neutral-50 dark:bg-[#050505] rounded-2xl border border-neutral-200 dark:border-white/5 space-y-3">
              <Heart className="w-12 h-12 text-neutral-400 dark:text-gray-600 mx-auto" />
              <h4 className="text-base font-serif font-bold text-neutral-900 dark:text-white">Your Vault is Empty</h4>
              <p className="text-xs text-neutral-500 dark:text-gray-400 max-w-sm mx-auto">
                Explore our global and Indian sanctuaries and tap the heart icon on any destination to save it.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedDestinations.map((dest) => (
                <div
                  key={dest.id}
                  className="rounded-2xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/10 overflow-hidden flex flex-col justify-between group hover:border-[#C5A059]/40 transition-all"
                >
                  <div className="relative h-44 overflow-hidden">
                    <SafeImage
                      src={dest.image}
                      alt={dest.name}
                      categoryHint={dest.category || dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-[#F3E5AB] border border-white/10">
                      {dest.country}
                    </span>
                    <span className="absolute bottom-3 right-3 text-xs font-mono font-bold text-white bg-black/60 px-2 py-0.5 rounded">
                      {dest.startingPrice}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="font-serif font-bold text-base text-neutral-900 dark:text-white">{dest.name}</h4>
                    <p className="text-xs text-neutral-500 dark:text-gray-400 line-clamp-2">{dest.tagline}</p>
                    <div className="pt-3 border-t border-neutral-200 dark:border-white/5 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onSelectDestination(dest)}
                        className="text-xs font-semibold text-[#8C6D32] dark:text-[#C5A059] hover:underline"
                      >
                        Inspect Details
                      </button>
                      <button
                        onClick={() => onNavigateToPlanner(dest.name)}
                        className="px-3 py-1.5 rounded-lg bg-[#C5A059] text-black text-xs font-bold uppercase hover:bg-[#F3E5AB] transition-all"
                      >
                        Plan Route
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: PRIVILEGES */}
      {activeTab === 'privileges' && (
        <div className="rounded-3xl bg-white dark:bg-[#0A0A0A] border border-neutral-200 dark:border-white/10 p-6 space-y-6 shadow-sm">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#8C6D32] dark:text-[#C5A059] font-bold">
              Exclusive Voyager Benefits
            </span>
            <h3 className="text-2xl font-serif font-bold text-neutral-900 dark:text-white">Auric Society Membership Privileges</h3>
            <p className="text-xs text-neutral-500 dark:text-gray-400 mt-1 max-w-xl">
              As a {user.memberTier || 'Founding Sovereign Member'}, you enjoy unparalleled bespoke concierge access and private amenities across our worldwide sanctuaries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Complimentary Suite Upgrades',
                description: 'Automatic priority elevation to presidential chambers and private villas when booking through Auric Concierge.',
                icon: Star,
                tag: 'Guaranteed Priority',
              },
              {
                title: 'Private Jet & Chauffeur Coordination',
                description: 'Seamless door-to-palace transit with private helicopter and luxury German sedans in Bengaluru, Jaipur, Udaipur, and Zurich.',
                icon: Compass,
                tag: 'Air & Ground',
              },
              {
                title: 'Secret Royal Access & Tastings',
                description: 'Curated after-hours temple visits, private palace curator walkthroughs, and bespoke banquets crafted by royal master chefs.',
                icon: Award,
                tag: 'Curated Encounters',
              },
              {
                title: '24/7 Dedicated Travel Architect',
                description: 'A personal senior journey curator on WhatsApp & direct private phone for instant revisions and customized dining reservations.',
                icon: ShieldCheck,
                tag: 'Direct Hotline',
              },
            ].map((perk, i) => {
              const Icon = perk.icon;
              return (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/10 space-y-2 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#C5A059]/20 text-[#8C6D32] dark:text-[#F3E5AB] font-bold">
                      {perk.tag}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-neutral-900 dark:text-white pt-1">{perk.title}</h4>
                  <p className="text-xs text-neutral-600 dark:text-gray-400 leading-relaxed">{perk.description}</p>
                </div>
              );
            })}
          </div>

          <div className="p-6 rounded-2xl bg-neutral-100 dark:bg-gradient-to-r dark:from-[#14120A] dark:to-[#0A0A0A] border border-neutral-200 dark:border-[#C5A059]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-serif font-bold text-base text-neutral-900 dark:text-white">Need Bespoke Arrangements?</h4>
              <p className="text-xs text-neutral-600 dark:text-gray-300 mt-0.5">Contact your dedicated Auric Society travel desk for private itinerary customization.</p>
            </div>
            <button
              onClick={() => onNavigateToPlanner()}
              className="px-5 py-2.5 rounded-full bg-[#C5A059] hover:bg-[#F3E5AB] text-black font-bold uppercase tracking-wider text-xs transition-all shrink-0 shadow-md shadow-[#C5A059]/20"
            >
              Open Trip Architect
            </button>
          </div>
        </div>
      )}

      {/* TAB: PREFERENCES */}
      {activeTab === 'preferences' && (
        <div className="rounded-3xl bg-white dark:bg-[#0A0A0A] border border-neutral-200 dark:border-white/10 p-6 space-y-6 shadow-sm">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#8C6D32] dark:text-[#C5A059] font-bold">
              Account Configurations
            </span>
            <h3 className="text-2xl font-serif font-bold text-neutral-900 dark:text-white">Traveler Preferences & Security</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/10 space-y-4">
              <h4 className="font-serif font-bold text-base text-neutral-900 dark:text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#C5A059]" />
                <span>Voyager Profile</span>
              </h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1.5 border-b border-neutral-200 dark:border-white/5">
                  <span className="text-neutral-500 dark:text-gray-400">Preferred Travel Style:</span>
                  <span className="text-[#8C6D32] dark:text-[#F3E5AB] font-bold">{user.travelPreferences?.travelStyle || 'Ultra-Luxury'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-neutral-200 dark:border-white/5">
                  <span className="text-neutral-500 dark:text-gray-400">Dietary Profile:</span>
                  <span className="text-neutral-900 dark:text-white">{user.travelPreferences?.dietary || 'Epicurean'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-neutral-200 dark:border-white/5">
                  <span className="text-neutral-500 dark:text-gray-400">Default Currency:</span>
                  <span className="text-neutral-900 dark:text-white">{user.preferredCurrency || 'INR (₹)'}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-neutral-500 dark:text-gray-400">Home Residence:</span>
                  <span className="text-neutral-900 dark:text-white">{user.homeCity || 'India'}</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/10 space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="font-serif font-bold text-base text-neutral-900 dark:text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#C5A059]" />
                  <span>Session & Privacy</span>
                </h4>
                <p className="text-xs text-neutral-500 dark:text-gray-400 mt-2 leading-relaxed">
                  Your voyager session is securely stored locally on this device. Logging out clears the current session state.
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-200 dark:border-white/5 flex items-center justify-between">
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="px-4 py-2 rounded-xl bg-neutral-200 dark:bg-white/5 hover:bg-neutral-300 dark:hover:bg-white/10 border border-neutral-300 dark:border-white/10 text-xs font-semibold text-neutral-800 dark:text-white"
                >
                  Update Information
                </button>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-[#C5A059]/40 rounded-3xl p-6 sm:p-8 text-neutral-900 dark:text-white space-y-5 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-4">
              <h3 className="text-xl font-serif font-bold text-neutral-900 dark:text-white">Edit Voyager Profile</h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="p-1 text-neutral-400 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-[#8C6D32] dark:text-[#C5A059] font-bold mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/10 focus:border-[#C5A059] text-sm text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#8C6D32] dark:text-[#C5A059] font-bold mb-1">
                  Contact Phone / WhatsApp
                </label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+91 98450 12345"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/10 focus:border-[#C5A059] text-sm text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#8C6D32] dark:text-[#C5A059] font-bold mb-1">
                  Home City & Country
                </label>
                <input
                  type="text"
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                  placeholder="Bengaluru, India"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/10 focus:border-[#C5A059] text-sm text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#8C6D32] dark:text-[#C5A059] font-bold mb-1">
                  Travel Style
                </label>
                <select
                  value={editStyle}
                  onChange={(e) => setEditStyle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/10 focus:border-[#C5A059] text-sm text-neutral-900 dark:text-white focus:outline-none"
                >
                  <option value="Bespoke Heritage & Ultra-Luxury">Bespoke Heritage & Ultra-Luxury</option>
                  <option value="Wildlife Safari & Nature Sanctuaries">Wildlife Safari & Nature Sanctuaries</option>
                  <option value="Relaxed Wellness & Coastal Retreats">Relaxed Wellness & Coastal Retreats</option>
                  <option value="High-Energy Explorer & Culture">High-Energy Explorer & Culture</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#8C6D32] dark:text-[#C5A059] font-bold mb-1">
                  Dietary Preferences
                </label>
                <input
                  type="text"
                  value={editDietary}
                  onChange={(e) => setEditDietary(e.target.value)}
                  placeholder="Gourmet Vegetarian / Jain / Continental"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/10 focus:border-[#C5A059] text-sm text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-neutral-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-xl text-xs text-neutral-500 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#F3E5AB] text-black font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
