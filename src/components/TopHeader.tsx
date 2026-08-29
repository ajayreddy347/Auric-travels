import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Sparkles,
  User,
  ShieldCheck,
  Heart,
  Calendar,
  Building,
  Check,
  X,
  ArrowRight,
  MapPin,
  Compass,
  LogOut,
  ChevronDown,
  Clock,
  Sparkle,
} from 'lucide-react';
import { AppView } from './Sidebar';
import { AuthUser, Destination, ExperienceItem, LuxuryStayItem } from '../types';
import { useTheme } from '../utils/themeContext';
import { INITIAL_NOTIFICATIONS, NotificationItem } from '../data/notificationsData';
import { DESTINATIONS } from '../data/mockData';
import { EXPERIENCES } from '../data/experiencesData';
import { LUXURY_STAYS } from '../data/staysData';

interface TopHeaderProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  currentUser: AuthUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenMobileMenu: () => void;
  savedCount: number;
  bookingCount: number;
  onOpenBookStay: (stayOrDest?: string | LuxuryStayItem) => void;
  onOpenTripPlanner: (destName?: string) => void;
  onSelectDestination: (dest: Destination) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentView,
  onSelectView,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenMobileMenu,
  savedCount,
  bookingCount,
  onOpenBookStay,
  onOpenTripPlanner,
  onSelectDestination,
}) => {
  const { theme, toggleTheme } = useTheme();

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Profile Dropdown State
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  // Handle outside click to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllNotifsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (item: NotificationItem) => {
    // mark item as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    );
    setIsNotifOpen(false);

    if (item.actionView) {
      if (item.actionView === 'destinations' && item.actionPayload) {
        const dest = DESTINATIONS.find((d) => d.id === item.actionPayload);
        if (dest) {
          onSelectDestination(dest);
          return;
        }
      }
      onSelectView(item.actionView as AppView);
    }
  };

  // Search autocompletion filtering
  const matchingDestinations = searchQuery.trim()
    ? DESTINATIONS.filter(
        (d) =>
          d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (d.state && d.state.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 3)
    : [];

  const matchingExperiences = searchQuery.trim()
    ? EXPERIENCES.filter(
        (e) =>
          e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 2)
    : [];

  const matchingStays = searchQuery.trim()
    ? LUXURY_STAYS.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.destinationName.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 2)
    : [];

  const hasSearchResults =
    matchingDestinations.length > 0 || matchingExperiences.length > 0 || matchingStays.length > 0;

  // View Titles & Subtitles
  const getPageInfo = () => {
    switch (currentView) {
      case 'home':
        return { title: 'Home', subtitle: 'Platform Spotlight & Discover' };
      case 'destinations':
        return { title: 'Destinations', subtitle: 'Global & Indian Sanctuaries' };
      case 'experiences':
        return { title: 'Experiences', subtitle: 'Curated Pursuits & Masterclasses' };
      case 'planner':
        return { title: 'Trip Planner', subtitle: 'Bespoke Itinerary Architect' };
      case 'saved':
        return { title: 'Saved Trips', subtitle: 'Curated Wishlist Vault' };
      case 'bookings':
        return { title: 'My Bookings', subtitle: 'Active Sanctuary Reservations' };
      case 'account':
        return { title: 'Account', subtitle: 'Member Portfolio & Privileges' };
      default:
        return { title: 'Auric Travels', subtitle: 'Luxury Travel Platform' };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#050505]/90 backdrop-blur-md border-b border-neutral-200 dark:border-white/10 px-4 sm:px-6 lg:px-8 py-3 transition-colors">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Mobile Menu & Current Page Title with Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileMenu}
            className="p-2 rounded-xl bg-neutral-100 dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white lg:hidden shrink-0"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-amber-700 dark:text-[#E5B869] truncate">
              <span className="font-bold">Auric Travels</span>
              <span className="text-neutral-400 dark:text-neutral-600">/</span>
              <span className="text-neutral-600 dark:text-neutral-400 truncate">{pageInfo.title}</span>
            </div>
            <h1 className="text-base sm:text-lg font-serif font-bold text-neutral-900 dark:text-white truncate leading-tight">
              {pageInfo.subtitle}
            </h1>
          </div>
        </div>

        {/* Middle: Interactive Search Bar */}
        <div
          ref={searchContainerRef}
          className="relative hidden md:block flex-1 max-w-xs lg:max-w-md mx-2"
        >
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search sanctuaries, stays, experiences..."
              className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-neutral-100 dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {isSearchFocused && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/15 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-neutral-100 dark:divide-white/5 animate-in fade-in-50 duration-150">
              {hasSearchResults ? (
                <div className="p-2 max-h-80 overflow-y-auto space-y-2 custom-scrollbar">
                  {/* Destinations Results */}
                  {matchingDestinations.length > 0 && (
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold px-2.5 py-1 block">
                        Sanctuaries & Havens
                      </span>
                      {matchingDestinations.map((dest) => (
                        <div
                          key={dest.id}
                          onClick={() => {
                            onSelectDestination(dest);
                            setIsSearchFocused(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 cursor-pointer group transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={dest.image}
                              alt={dest.name}
                              className="w-8 h-8 rounded-lg object-cover shrink-0"
                            />
                            <div className="truncate">
                              <span className="text-xs font-serif font-bold text-neutral-900 dark:text-white block group-hover:text-[#C5A059] truncate">
                                {dest.name}
                              </span>
                              <span className="text-[10px] text-neutral-500 font-mono">
                                {dest.country} · {dest.startingPrice}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] text-[#C5A059] font-semibold flex items-center gap-1 shrink-0">
                            View <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Experiences Results */}
                  {matchingExperiences.length > 0 && (
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold px-2.5 py-1 block">
                        Curated Pursuits
                      </span>
                      {matchingExperiences.map((exp) => (
                        <div
                          key={exp.id}
                          onClick={() => {
                            onSelectView('experiences');
                            setIsSearchFocused(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 cursor-pointer group transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center shrink-0">
                              <Compass className="w-4 h-4" />
                            </div>
                            <div className="truncate">
                              <span className="text-xs font-semibold text-neutral-900 dark:text-white block truncate">
                                {exp.name}
                              </span>
                              <span className="text-[10px] text-neutral-500 font-mono">
                                {exp.location} · {exp.category}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] text-[#C5A059] font-semibold shrink-0">
                            Explore
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Stays Results */}
                  {matchingStays.length > 0 && (
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold px-2.5 py-1 block">
                        Luxury Stays
                      </span>
                      {matchingStays.map((stay) => (
                        <div
                          key={stay.id}
                          onClick={() => {
                            onOpenBookStay(stay);
                            setIsSearchFocused(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 cursor-pointer group transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={stay.image}
                              alt={stay.name}
                              className="w-8 h-8 rounded-lg object-cover shrink-0"
                            />
                            <div className="truncate">
                              <span className="text-xs font-semibold text-neutral-900 dark:text-white block truncate">
                                {stay.name}
                              </span>
                              <span className="text-[10px] text-neutral-500 font-mono">
                                {stay.destinationName} · {stay.startingPriceDisplay}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#C5A059] text-black font-bold font-mono shrink-0">
                            Book
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-neutral-500">
                  No matching sanctuaries or experiences found for "{searchQuery}".
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Quick Action Controls, Theme Toggle, Notifications & Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Quick Book Stay Action Button */}
          <button
            id="top-nav-book-stay-btn"
            onClick={() => onOpenBookStay()}
            className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 text-neutral-800 dark:text-neutral-200 hover:border-[#C5A059] text-xs font-semibold hover:text-[#C5A059] dark:hover:text-[#F3E5AB] transition-all"
          >
            <Building className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Book Stay</span>
          </button>

          {/* Quick Trip Planner Button */}
          <button
            id="top-nav-plan-trip-btn"
            onClick={() => onOpenTripPlanner()}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-[#C5A059] hover:bg-[#b08d47] text-black text-xs font-bold uppercase tracking-wider transition-all shadow-sm shadow-[#C5A059]/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Plan Trip</span>
          </button>

          {/* 🌓 DARK / LIGHT THEME TOGGLE BUTTON */}
          <button
            id="theme-toggle-header-btn"
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-neutral-100 dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:border-[#C5A059]/40 transition-all"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-neutral-700 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* 🔔 NOTIFICATIONS DROPDOWN */}
          <div ref={notifRef} className="relative">
            <button
              id="top-nav-notifications-btn"
              onClick={() => setIsNotifOpen((prev) => !prev)}
              className="relative p-2 rounded-xl bg-neutral-100 dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:border-[#C5A059]/40 transition-all"
              title="Notifications"
              aria-label="View Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-mono font-bold flex items-center justify-center shadow-md">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Notifications Menu */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/15 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in-50 duration-150">
                <div className="p-3.5 border-b border-neutral-200 dark:border-white/10 flex items-center justify-between bg-neutral-50 dark:bg-white/5">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#C5A059]" />
                    <span className="text-xs font-serif font-bold text-neutral-900 dark:text-white">
                      Platform Notifications
                    </span>
                    {unreadNotifCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-[#C5A059] text-black text-[9px] font-mono font-bold">
                        {unreadNotifCount} new
                      </span>
                    )}
                  </div>
                  {unreadNotifCount > 0 && (
                    <button
                      onClick={handleMarkAllNotifsRead}
                      className="text-[10px] font-mono text-[#C5A059] hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100 dark:divide-white/5 custom-scrollbar">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleNotificationClick(item)}
                      className={`p-3.5 hover:bg-neutral-50 dark:hover:bg-white/5 cursor-pointer transition-colors ${
                        !item.read ? 'bg-amber-500/5 dark:bg-[#C5A059]/10' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {!item.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] shrink-0" />
                          )}
                          <span className="text-xs font-semibold text-neutral-900 dark:text-white leading-tight">
                            {item.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed pl-3.5">
                        {item.message}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="p-2 border-t border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 text-center">
                  <span className="text-[10px] font-mono text-neutral-500">
                    Auric Society Concierge Dispatch • Realtime Updates
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 👤 USER PROFILE DROPDOWN */}
          <div ref={profileRef} className="relative">
            {currentUser ? (
              <button
                id="top-nav-user-account-btn"
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="p-1 sm:px-2.5 sm:py-1 rounded-xl bg-neutral-100 dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 hover:border-[#C5A059]/40 text-neutral-800 dark:text-neutral-200 text-xs font-semibold flex items-center gap-2 transition-all"
                title={`Logged in as ${currentUser.name}`}
              >
                <div className="w-6 h-6 rounded-lg bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center font-serif font-bold text-xs">
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-full h-full rounded-lg object-cover"
                    />
                  ) : (
                    currentUser.name.charAt(0)
                  )}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="truncate max-w-[90px] font-mono text-[11px] leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[9px] text-[#C5A059] font-mono leading-none">
                    {currentUser.memberTier || 'Sovereign'}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>
            ) : (
              <button
                id="top-nav-signin-btn"
                onClick={onOpenAuth}
                className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-neutral-100 dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 hover:border-[#C5A059]/40 text-neutral-800 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                title="Sign In to Auric Society"
              >
                <User className="w-4 h-4 text-[#C5A059]" />
                <span className="hidden sm:inline font-mono">Sign In</span>
              </button>
            )}

            {/* Profile Dropdown Menu */}
            {currentUser && isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/15 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in-50 duration-150">
                <div className="p-3 border-b border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5">
                  <span className="text-xs font-serif font-bold text-neutral-900 dark:text-white block">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-[#C5A059] font-mono block">
                    {currentUser.memberId || 'AV-SOV-8821'} · {currentUser.memberTier || 'Sovereign'}
                  </span>
                </div>

                <div className="p-1.5 space-y-0.5 text-xs">
                  <button
                    onClick={() => {
                      onSelectView('account');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors text-left"
                  >
                    <User className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Member Portfolio</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectView('bookings');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>My Bookings</span>
                    </div>
                    {bookingCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-[#C5A059] text-black text-[9px] font-mono font-bold">
                        {bookingCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      onSelectView('saved');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      <span>Saved Vault</span>
                    </div>
                    {savedCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-300 text-[9px] font-mono font-bold">
                        {savedCount}
                      </span>
                    )}
                  </button>

                  <div className="my-1 border-t border-neutral-200 dark:border-white/10" />

                  <button
                    onClick={() => {
                      onLogout();
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors text-left font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
