import React, { useState, useEffect } from 'react';
import { Sidebar, AppView } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { Hero } from './components/Hero';
import { DestinationsSection } from './components/DestinationsSection';
import { DestinationModal } from './components/DestinationModal';
import { ExperiencesSection } from './components/ExperiencesSection';
import { PersonalizedDiscovery } from './components/PersonalizedDiscovery';
import { TripPlannerCTA } from './components/TripPlannerCTA';
import { TripPlannerModal } from './components/TripPlannerModal';
import { TripPlannerSection } from './components/TripPlannerSection';
import { WishlistModal } from './components/WishlistModal';
import { SavedTripsSection } from './components/SavedTripsSection';
import { AuthModal } from './components/AuthModal';
import { BookingModal } from './components/BookingModal';
import { StaysBrowserModal } from './components/StaysBrowserModal';
import { MyBookingsSection } from './components/MyBookingsSection';
import { AccountProfileSection } from './components/AccountProfileSection';
import { GlobalMapExplorer } from './components/GlobalMapExplorer';
import { AuricAssistant } from './components/AuricAssistant';
import { Footer } from './components/Footer';
import { LegalModal, LegalDocType } from './components/LegalModal';
import { DESTINATIONS } from './data/mockData';
import { EXPERIENCES } from './data/experiencesData';
import { LUXURY_STAYS } from './data/staysData';
import { Destination, BookingRecord, LuxuryStayItem, ExperienceItem, AuthUser } from './types';
import { getStoredBookings, clearStoredBookings } from './utils/bookingStore';
import { getStoredUser, clearStoredUser } from './utils/authStore';
import { useTheme } from './utils/themeContext';
import { fetchDestinations } from './services/destinationsApi';
import { fetchExperiences } from './services/experiencesApi';
import { fetchUserBookings, ApiBookingRecord } from './services/bookingsApi';
import { getStoredAuthToken } from './utils/authStore';
import {
  Sparkles,
  ArrowRight,
  Compass,
  Trees,
  Landmark,
  Utensils,
  Camera,
  HeartPulse,
  CheckCircle2,
  Building,
  Globe,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { theme } = useTheme();

  const getViewFromHash = (): AppView => {
    if (typeof window === 'undefined') return 'home';
    const hash = window.location.hash.replace(/^#/, '').toLowerCase().trim();
    const validViews: AppView[] = ['home', 'destinations', 'experiences', 'planner', 'saved', 'bookings', 'account'];
    if (validViews.includes(hash as AppView)) {
      return hash as AppView;
    }
    return 'home';
  };

  // Active View State ('home' | 'destinations' | 'experiences' | 'planner' | 'saved' | 'bookings' | 'account')
  const [currentView, setCurrentView] = useState<AppView>(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      return getViewFromHash();
    }
    return 'home';
  });

  // Handle URL hash changes & browser popstate (back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace(/^#/, '').toLowerCase().trim();
      if (['privacy', 'terms', 'security'].includes(hash)) {
        setLegalDocType(hash as LegalDocType);
      } else {
        setLegalDocType(null);
        const targetView = getViewFromHash();
        setCurrentView(targetView);
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    
    // Initial check on mount
    const initialHash = window.location.hash.replace(/^#/, '').toLowerCase().trim();
    if (['privacy', 'terms', 'security'].includes(initialHash)) {
      setLegalDocType(initialHash as LegalDocType);
    }
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // View navigation handler that resets scroll position and synchronizes browser URL hash
  const handleSelectView = (view: AppView) => {
    setCurrentView(view);
    if (typeof window !== 'undefined') {
      if (window.location.hash !== `#${view}`) {
        window.history.pushState({ view }, '', `#${view}`);
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  };

  // Scroll reset whenever currentView changes (guarantees new section opens at top)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [currentView]);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Core Data States
  const [destinations, setDestinations] = useState<Destination[]>(DESTINATIONS);
  const [experiences, setExperiences] = useState<ExperienceItem[]>(EXPERIENCES);
  const [bookings, setBookings] = useState<BookingRecord[]>(() => getStoredBookings());

  // Modal & Detail States
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [isDestModalOpen, setIsDestModalOpen] = useState(false);
  const [isPlannerModalOpen, setIsPlannerModalOpen] = useState(false);
  const [plannerPrefillDest, setPlannerPrefillDest] = useState('Hampi & Vijayanagara');
  const [plannerPrefillStyle, setPlannerPrefillStyle] = useState('UNESCO Heritage');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);
  const [isGlobalMapOpen, setIsGlobalMapOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [legalDocType, setLegalDocType] = useState<LegalDocType>(null);

  // Booking Modal States
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingTargetItem, setBookingTargetItem] = useState<LuxuryStayItem | ExperienceItem | null>(null);
  const [bookingType, setBookingType] = useState<'stay' | 'experience'>('stay');
  const [isStaysBrowserOpen, setIsStaysBrowserOpen] = useState(false);
  const [bookingSuccessToast, setBookingSuccessToast] = useState<{ refId: string; title: string } | null>(null);

  // Wishlist / Saved Trips IDs
  const [savedDestinationIds, setSavedDestinationIds] = useState<string[]>([
    'hampi',
    'coorg',
    'amalfi-coast',
    'kyoto',
  ]);

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('auth_token');
      if (urlToken) {
        try {
          const payloadBase64 = urlToken.split('.')[1];
          if (payloadBase64) {
            const decoded = JSON.parse(atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')));
            if (decoded && decoded.id && decoded.email) {
              const initialUser: AuthUser = {
                id: decoded.id,
                name: decoded.name || 'Valued Member',
                email: decoded.email,
                memberId: `AUR-M-${decoded.id.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase() || '7721'}`,
                memberTier: 'Founding Sovereign',
                joinedDate: 'August 2026',
                phone: '+91 98450 12345',
                homeCity: 'India',
                preferredCurrency: 'INR',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                travelPreferences: {
                  travelStyle: 'Bespoke Heritage & Ultra-Luxury',
                  interests: ['Royal Palaces', 'Wildlife Reserves', 'Private Yachting'],
                  dietary: 'Gourmet Epicurean',
                },
              };
              saveStoredUser(initialUser, urlToken);
              return initialUser;
            }
          }
        } catch (e) {
          console.warn('[Initial URL Auth Token Error]:', e);
        }
      }
    }
    return getStoredAuthToken() ? getStoredUser() : null;
  });

  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup' | 'forgot' | 'reset'>('signin');
  const [authResetToken, setAuthResetToken] = useState<string>('');

  const [authRequiredMessage, setAuthRequiredMessage] = useState<string | undefined>(undefined);
  const [pendingBookingAction, setPendingBookingAction] = useState<((authedUser?: AuthUser) => void) | null>(null);

  // Sync auth state on auric_auth_change events
  useEffect(() => {
    const handleAuthChange = () => {
      const stored = getStoredUser();
      setCurrentUser(stored);
    };
    window.addEventListener('auric_auth_change', handleAuthChange);
    return () => window.removeEventListener('auric_auth_change', handleAuthChange);
  }, []);

  // Handle Google OAuth 2.0 and Password Reset redirect callback parameters on application mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const authToken = urlParams.get('auth_token');
    const authError = urlParams.get('auth_error');
    const resetToken = urlParams.get('reset_token');

    if (resetToken) {
      setAuthResetToken(resetToken);
      setAuthModalMode('reset');
      setIsAuthModalOpen(true);
      const cleanUrl = window.location.pathname + (window.location.hash || '');
      window.history.replaceState({}, '', cleanUrl);
      return;
    }

    if (authToken) {
      // 1. Immediate synchronous restore from JWT payload for instant zero-lag login
      try {
        const payloadBase64 = authToken.split('.')[1];
        if (payloadBase64) {
          const decoded = JSON.parse(atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')));
          if (decoded && decoded.id && decoded.email) {
            const initialUser: AuthUser = {
              id: decoded.id,
              name: decoded.name || 'Valued Member',
              email: decoded.email,
              memberId: `AUR-M-${decoded.id.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase() || '7721'}`,
              memberTier: 'Founding Sovereign',
              joinedDate: 'August 2026',
              phone: '+91 98450 12345',
              homeCity: 'India',
              preferredCurrency: 'INR',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
              travelPreferences: {
                travelStyle: 'Bespoke Heritage & Ultra-Luxury',
                interests: ['Royal Palaces', 'Wildlife Reserves', 'Private Yachting'],
                dietary: 'Gourmet Epicurean',
              },
            };
            saveStoredUser(initialUser, authToken);
            setCurrentUser(initialUser);
          }
        }
      } catch (err) {
        console.warn('[JWT Pre-decode Error]:', err);
      }

      // 2. Fetch full verified profile from /api/auth/me to populate avatar, provider, and DB fields
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user) {
            const authedUser: AuthUser = {
              id: data.user.id,
              name: data.user.name || 'Valued Member',
              email: data.user.email,
              memberId: `AUR-M-${data.user.id.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase() || '7721'}`,
              memberTier: 'Founding Sovereign',
              joinedDate: 'August 2026',
              phone: '+91 98450 12345',
              homeCity: 'India',
              preferredCurrency: 'INR',
              avatar:
                data.user.avatar_url ||
                data.user.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
              travelPreferences: {
                travelStyle: 'Bespoke Heritage & Ultra-Luxury',
                interests: ['Royal Palaces', 'Wildlife Reserves', 'Private Yachting'],
                dietary: 'Gourmet Epicurean',
              },
            };
            saveStoredUser(authedUser, authToken);
            setCurrentUser(authedUser);
          }
        })
        .catch((err) => console.error('[Google OAuth User Load Error]:', err))
        .finally(() => {
          // Clean the query parameters from URL bar
          const cleanUrl = window.location.pathname + (window.location.hash || '');
          window.history.replaceState({}, '', cleanUrl);
        });
    } else if (authError) {
      console.warn('[Google OAuth Error Notice]:', authError, urlParams.get('reason'));
      const cleanUrl = window.location.pathname + (window.location.hash || '');
      window.history.replaceState({}, '', cleanUrl);
    }
  }, []);

  useEffect(() => {
    fetchDestinations()
      .then((res) => {
        if (res.destinations && res.destinations.length > 0) {
          setDestinations(res.destinations);
        }
      })
      .catch((err) => console.warn('[App] Backend destinations load fallback:', err));

    fetchExperiences()
      .then((res) => {
        if (res.experiences && res.experiences.length > 0) {
          setExperiences(res.experiences);
        }
      })
      .catch((err) => console.warn('[App] Backend experiences load fallback:', err));
  }, []);

  const handleRefreshBookings = async () => {
    const token = getStoredAuthToken();
    if (!token) {
      setBookings([]);
      return;
    }

    try {
      const res = await fetchUserBookings();
      if (res && Array.isArray(res.bookings)) {
        const serverMapped: BookingRecord[] = res.bookings.map((b) => {
          const matchedStay = LUXURY_STAYS.find((s) => s.id === b.stay_id || s.id === b.destination_id || s.destinationId === b.destination_id);
          const matchedExp = EXPERIENCES.find((e) => e.id === b.experience_id);
          const matchedDest = DESTINATIONS.find((d) => d.id.toLowerCase() === b.destination_id.toLowerCase());

          const isExp = Boolean(b.experience_id);
          const title = isExp
            ? (matchedExp?.name || 'Curated Experience Arrangement')
            : (matchedStay?.name || (matchedDest ? `${matchedDest.name} Luxury Sanctuary` : 'Luxury Sanctuary Stay'));

          const location = isExp
            ? (matchedExp?.location || 'Karnataka & Global')
            : (matchedStay?.location || (matchedDest ? `${matchedDest.name}, ${matchedDest.country}` : 'Sanctuary'));

          const imageUrl = isExp
            ? (matchedExp?.image || 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80')
            : (matchedStay?.image || matchedDest?.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80');

          const roomTitle = b.room_type || matchedStay?.roomTypes?.[0]?.name || 'Signature Sanctuary Suite';
          const nights = b.number_of_nights || 1;
          const start = b.check_in_date || (b.booking_date ? b.booking_date.split('T')[0] : new Date().toISOString().split('T')[0]);
          const end = b.check_out_date ? b.check_out_date.split('T')[0] : undefined;

          return {
            id: b.id,
            referenceId: `AUR-${b.id.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()}`,
            type: isExp ? 'experience' : 'stay',
            itemId: b.stay_id || b.experience_id || b.destination_id || 'item-auric',
            title,
            subtitle: isExp ? (matchedExp?.category || 'Curated Pursuit') : roomTitle,
            location,
            imageUrl,
            destinationName: matchedDest?.name || matchedStay?.destinationName || b.destination_id,
            category: isExp ? 'Curated Experience' : (matchedStay?.badge || 'Luxury Stay'),
            startDate: start,
            endDate: end,
            numberOfNights: isExp ? undefined : nights,
            numberOfGuests: b.number_of_people || 2,
            roomType: isExp ? undefined : roomTitle,
            guestName: b.guest_name || currentUser?.name || 'Authenticated Voyager',
            guestEmail: b.guest_email || currentUser?.email || 'member@aurictravel.com',
            guestPhone: b.guest_phone || currentUser?.phone || '+91 98450 12345',
            specialRequests: b.special_requests || undefined,
            currency: (b.currency as any) || 'INR',
            baseRatePerUnit: b.base_rate_per_unit ? Number(b.base_rate_per_unit) : Number(b.total_amount) || 50000,
            totalCost: Number(b.total_amount) || 50000,
            totalCostDisplay: b.currency === 'USD' ? `$${Number(b.total_amount).toLocaleString()}` : `₹${Number(b.total_amount).toLocaleString()}`,
            taxesAndFees: b.taxes_and_fees ? Number(b.taxes_and_fees) : Math.round(Number(b.total_amount) * 0.12),
            status: (b.booking_status as any) || 'confirmed',
            createdAt: b.created_at || new Date().toISOString(),
          };
        });

        setBookings(serverMapped);
        return;
      }
    } catch (err: any) {
      console.warn('[App] Failed to fetch server bookings:', err);
      if (err?.message?.includes('401') || err?.message?.includes('token')) {
        handleLogout();
      }
    }
  };

  useEffect(() => {
    handleRefreshBookings();
  }, [currentUser]);

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    handleRefreshBookings();
    setIsAuthModalOpen(false);
    setAuthRequiredMessage(undefined);
    if (pendingBookingAction) {
      const action = pendingBookingAction;
      setPendingBookingAction(null);
      action(user);
    }
  };

  const handleLogout = () => {
    clearStoredUser();
    clearStoredBookings();
    setCurrentUser(null);
    setBookings([]);
    setIsBookingModalOpen(false);
    setIsAuthModalOpen(false);
    setCurrentView('home');
  };

  // Open Booking for a Stay
  const handleOpenBookStay = (destNameOrStay?: string | LuxuryStayItem) => {
    if (typeof destNameOrStay === 'object' && destNameOrStay !== null) {
      setBookingTargetItem(destNameOrStay);
      setBookingType('stay');
      setIsBookingModalOpen(true);
      return;
    }

    if (typeof destNameOrStay === 'string') {
      const match = LUXURY_STAYS.find(
        (s) =>
          s.name.toLowerCase().includes(destNameOrStay.toLowerCase()) ||
          s.destinationName.toLowerCase().includes(destNameOrStay.toLowerCase()) ||
          s.location.toLowerCase().includes(destNameOrStay.toLowerCase())
      );
      if (match) {
        setBookingTargetItem(match);
        setBookingType('stay');
        setIsBookingModalOpen(true);
        return;
      }
    }

    // Default: Open Stays Browser so user can pick from the luxury hotels list
    setIsStaysBrowserOpen(true);
  };

  // Open Booking for an Experience
  const handleOpenBookExperience = (expOrTitle?: ExperienceItem | string, _location?: string) => {
    if (typeof expOrTitle === 'object' && expOrTitle !== null) {
      setBookingTargetItem(expOrTitle);
      setBookingType('experience');
      setIsBookingModalOpen(true);
      return;
    }

    if (typeof expOrTitle === 'string') {
      const match = EXPERIENCES.find(
        (e) =>
          e.name.toLowerCase().includes(expOrTitle.toLowerCase()) ||
          e.location.toLowerCase().includes(expOrTitle.toLowerCase())
      );
      if (match) {
        setBookingTargetItem(match);
        setBookingType('experience');
        setIsBookingModalOpen(true);
        return;
      }
    }

    // Fallback: switch to experiences section
    handleSelectView('experiences');
  };

  const handleBookingConfirmed = (newRecord: BookingRecord) => {
    handleRefreshBookings();
    setBookingSuccessToast({
      refId: newRecord.referenceId,
      title: newRecord.title,
    });
    setTimeout(() => {
      setBookingSuccessToast(null);
    }, 6000);
  };

  // Wishlist Toggle
  const handleToggleSave = (destId: string) => {
    setSavedDestinationIds((prev) =>
      prev.includes(destId) ? prev.filter((id) => id !== destId) : [...prev, destId]
    );
  };

  // Open Destination Details Modal
  const handleOpenDestination = (dest: Destination) => {
    setSelectedDestination(dest);
    setIsDestModalOpen(true);
  };

  // Open Trip Planner View with custom prefill
  const handleOpenTripPlanner = (destName?: string, styleName?: string, openModal = false) => {
    if (destName) setPlannerPrefillDest(destName);
    if (styleName) setPlannerPrefillStyle(styleName);
    if (openModal) {
      setIsPlannerModalOpen(true);
    } else {
      handleSelectView('planner');
    }
  };

  // Search handler from Hero
  const handleSearch = (location: string, _season: string, _style: string) => {
    setSearchFilter(location.trim());
    handleSelectView('destinations');
  };

  const handleOpenLegalDoc = (type: 'privacy' | 'terms' | 'security') => {
    setLegalDocType(type);
    if (typeof window !== 'undefined') {
      window.history.pushState({ legal: type }, '', `#${type}`);
    }
  };

  const handleCloseLegalDoc = () => {
    setLegalDocType(null);
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace(/^#/, '').toLowerCase().trim();
      if (['privacy', 'terms', 'security'].includes(hash)) {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.hash = currentView;
        }
      }
    }
  };

  const savedDestinationsList = destinations.filter((d) => savedDestinationIds.includes(d.id));
  const featuredSanctuaries = destinations.filter((d) =>
    ['udaipur', 'amalfi-coast', 'kyoto', 'serengeti', 'ladakh', 'santorini'].includes(d.id)
  );

  return (
    <div
      className={`min-h-screen flex flex-col font-sans antialiased transition-colors duration-200 selection:bg-[#C5A059]/30 selection:text-[#F3E5AB] ${
        theme === 'dark' ? 'bg-[#050505] text-white' : 'bg-[#F8F7F4] text-neutral-900'
      }`}
    >
      {/* 1. PERSISTENT PROFESSIONAL SIDEBAR NAVIGATION */}
      <Sidebar
        currentView={currentView}
        onSelectView={handleSelectView}
        savedCount={savedDestinationIds.length}
        bookingCount={bookings.length}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        onOpenGlobalMap={() => setIsGlobalMapOpen(true)}
      />

      {/* 2. MAIN CONTENT AREA (Shifted right according to sidebar width) */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
        }`}
      >
        {/* Top Header Bar */}
        <TopHeader
          currentView={currentView}
          onSelectView={handleSelectView}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          savedCount={savedDestinationIds.length}
          bookingCount={bookings.length}
          onOpenBookStay={handleOpenBookStay}
          onOpenTripPlanner={handleOpenTripPlanner}
          onSelectDestination={handleOpenDestination}
        />

        {/* FLOATING BOOKING CONFIRMATION TOAST */}
        <AnimatePresence>
          {bookingSuccessToast && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-20 right-4 sm:right-8 z-50 max-w-md bg-neutral-900 dark:bg-[#0D0D0D] border border-[#C5A059] rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4 text-white"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-wider block">
                    Arrangement Confirmed • {bookingSuccessToast.refId}
                  </span>
                  <p className="text-xs font-serif font-bold text-white truncate">
                    {bookingSuccessToast.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setCurrentView('bookings');
                    setBookingSuccessToast(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#C5A059] text-black text-xs font-bold font-mono hover:bg-[#F3E5AB] transition-all"
                >
                  View
                </button>
                <button
                  onClick={() => setBookingSuccessToast(null)}
                  className="p-1 text-gray-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. DYNAMIC DEDICATED VIEW CONTAINER (No monster continuous scroll) */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            {/* VIEW 1: HOME / SPOTLIGHT DASHBOARD */}
            {currentView === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-10"
              >
                {/* Hero Showcase with slides & search */}
                <Hero
                  onExploreDestinations={() => setCurrentView('destinations')}
                  onPlanTrip={() => handleOpenTripPlanner()}
                  onSearch={handleSearch}
                  onOpenGlobalMap={() => setIsGlobalMapOpen(true)}
                  onSelectDestination={handleOpenDestination}
                />

                {/* CURATED GLOBAL & INDIAN SANCTUARIES SHOWCASE */}
                <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-gradient-to-br dark:from-[#0E0C06] dark:via-[#0A0A0A] dark:to-[#14120A] border border-neutral-200 dark:border-[#C5A059]/30 relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#C5A059] dark:text-[#F3E5AB] text-xs font-mono mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Curated Sanctuaries Showcase</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 dark:text-white tracking-tight">
                        Iconic Havens Across India & The World
                      </h3>
                      <p className="text-neutral-600 dark:text-gray-300 text-xs sm:text-sm mt-1 max-w-xl">
                        Handpicked luxury destinations with private villas, heritage palaces, and bespoke local access.
                      </p>
                    </div>

                    <button
                      id="home-explore-all-sanctuaries-btn"
                      onClick={() => setCurrentView('destinations')}
                      className="px-5 py-2 rounded-full bg-[#C5A059] hover:bg-[#F3E5AB] text-black text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 self-start md:self-auto shadow-md shadow-[#C5A059]/20"
                    >
                      <span>Explore All Sanctuaries ({DESTINATIONS.length})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {featuredSanctuaries.slice(0, 3).map((dest) => (
                      <div
                        key={dest.id}
                        onClick={() => handleOpenDestination(dest)}
                        className="group cursor-pointer rounded-2xl bg-neutral-50 dark:bg-[#050505]/80 border border-neutral-200 dark:border-white/10 hover:border-[#C5A059]/50 overflow-hidden transition-all duration-300 flex flex-col shadow-sm"
                      >
                        <div className="relative h-44 overflow-hidden">
                          <img
                            src={dest.image}
                            alt={dest.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-[#F3E5AB] border border-white/10">
                            {dest.country} {dest.state ? `· ${dest.state}` : ''}
                          </span>
                          <span className="absolute bottom-3 right-3 text-xs font-mono font-bold text-white bg-black/60 px-2 py-0.5 rounded">
                            {dest.startingPrice}
                          </span>
                        </div>
                        <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-serif font-bold text-base text-neutral-900 dark:text-white group-hover:text-[#C5A059] transition-colors">
                              {dest.name}
                            </h4>
                            <p className="text-xs text-neutral-600 dark:text-gray-400 line-clamp-2 mt-1">
                              {dest.tagline}
                            </p>
                          </div>
                          <div className="pt-2 flex items-center justify-between text-xs text-[#C5A059] font-semibold">
                            <span>View Details</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* =========================================================================
                    MAIN VISIBLE AURIC STAY SECTION WITH UNCLIPPED CINEMATIC VIDEO
                ========================================================================== */}
                <section
                  id="auric-stay"
                  className="space-y-4"
                >
                  <div className="relative w-full h-[360px] sm:h-[440px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-[#C5A059]/40 bg-black">
                    {/* Visual Centerpiece: Auric Stay Video */}
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

                    {/* Minimal Bottom Gradient for Text Legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                    {/* Prominent Overlay Content */}
                    <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-6 z-10">
                      <div className="space-y-2 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/30 backdrop-blur-md border border-[#C5A059]/50 text-[#F3E5AB] text-xs font-mono font-bold">
                          <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>Auric Stays & Luxury Sanctuaries</span>
                        </div>
                        <h3 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight drop-shadow-md">
                          Private Heritage Villas, Palaces & Safari Lodges
                        </h3>
                        <p className="text-gray-200 text-xs sm:text-sm leading-relaxed drop-shadow">
                          Experience world-class hospitality in handpicked royal suites, cliffside eco-retreats, and serene Western Ghats coffee estates with dedicated concierge services.
                        </p>
                      </div>

                      <button
                        id="home-browse-all-stays-btn"
                        onClick={() => setIsStaysBrowserOpen(true)}
                        className="px-7 py-3.5 rounded-full bg-[#C5A059] hover:bg-[#F3E5AB] text-black text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 shadow-2xl shadow-black/80 hover:scale-105 cursor-pointer"
                      >
                        <Building className="w-4 h-4 text-black" />
                        <span>Browse All Auric Stays</span>
                        <ArrowRight className="w-3.5 h-3.5 text-black" />
                      </button>
                    </div>
                  </div>
                </section>

                {/* CURATED EXPERIENTIAL PILLARS SPOTLIGHT */}
                <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-white/10 relative overflow-hidden shadow-xl">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-[#C5A059] text-xs font-mono mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Experiential Pillars</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 dark:text-white tracking-tight">
                        Curated Pursuits Across 6 Pillars
                      </h3>
                      <p className="text-neutral-600 dark:text-gray-400 text-xs sm:text-sm mt-1 max-w-xl">
                        Adventure, Nature, Culture, Food, Sightseeing, and Wellness designed for discerning voyagers.
                      </p>
                    </div>

                    <button
                      id="home-explore-experiences-btn"
                      onClick={() => setCurrentView('experiences')}
                      className="px-5 py-2.5 rounded-full bg-[#C5A059] hover:bg-[#F3E5AB] text-black text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 self-start md:self-auto shadow-md shadow-[#C5A059]/20 hover:scale-105"
                    >
                      <span>Explore All Experiences</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {[
                      { name: 'Adventure', icon: Compass, color: 'text-[#C5A059]', count: '4 Pursuits' },
                      { name: 'Nature', icon: Trees, color: 'text-emerald-500 dark:text-emerald-400', count: '4 Pursuits' },
                      { name: 'Culture', icon: Landmark, color: 'text-amber-500 dark:text-amber-300', count: '3 Pursuits' },
                      { name: 'Food', icon: Utensils, color: 'text-orange-500 dark:text-orange-400', count: '4 Pursuits' },
                      { name: 'Sightseeing', icon: Camera, color: 'text-sky-500 dark:text-sky-400', count: '3 Pursuits' },
                      { name: 'Wellness', icon: HeartPulse, color: 'text-rose-500 dark:text-rose-300', count: '3 Pursuits' },
                    ].map((pillar) => {
                      const Icon = pillar.icon;
                      return (
                        <div
                          key={pillar.name}
                          onClick={() => setCurrentView('experiences')}
                          className="group p-4 rounded-2xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/5 hover:border-[#C5A059]/40 cursor-pointer transition-all flex flex-col items-center text-center space-y-2"
                        >
                          <div className={`p-3 rounded-xl bg-neutral-200/60 dark:bg-white/5 group-hover:bg-[#C5A059]/15 transition-colors ${pillar.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-[#C5A059] transition-colors">
                            {pillar.name}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-500">
                            {pillar.count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Travel Moods & Personalized Discovery */}
                <PersonalizedDiscovery
                  onSelectDestination={handleOpenDestination}
                  onStartPlanningMood={(mood) => handleOpenTripPlanner(undefined, mood)}
                />

                {/* Curated Trip Architect Callout */}
                <TripPlannerCTA onStartPlanning={() => handleOpenTripPlanner()} />
              </motion.div>
            )}

            {/* VIEW 2: DEDICATED DESTINATIONS CATALOG */}
            {currentView === 'destinations' && (
              <motion.div
                key="destinations"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <DestinationsSection
                  destinations={destinations}
                  onSelectDestination={handleOpenDestination}
                  savedIds={savedDestinationIds}
                  onToggleSave={handleToggleSave}
                  searchFilter={searchFilter}
                  onClearFilter={() => setSearchFilter('')}
                  onAddToTrip={(destName) => handleOpenTripPlanner(destName)}
                  onOpenGlobalMap={() => setIsGlobalMapOpen(true)}
                />
              </motion.div>
            )}

            {/* VIEW 3: DEDICATED CURATED EXPERIENCES */}
            {currentView === 'experiences' && (
              <motion.div
                key="experiences"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <ExperiencesSection
                  experiences={experiences}
                  onPlanTripWithExperience={(expName, location) =>
                    handleOpenTripPlanner(location ? `${location} (${expName})` : expName, expName)
                  }
                  onBookExperience={handleOpenBookExperience}
                  savedIds={savedDestinationIds}
                  onToggleSave={handleToggleSave}
                />
              </motion.div>
            )}

            {/* VIEW 4: DEDICATED TRIP PLANNER ARCHITECT & MY TRIP */}
            {currentView === 'planner' && (
              <motion.div
                key="planner"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <TripPlannerSection
                  initialDestination={plannerPrefillDest}
                  initialStyle={plannerPrefillStyle}
                  onExploreDestinations={() => handleSelectView('destinations')}
                  onBookStay={(destName) => handleOpenBookStay(destName)}
                  onBookExperience={(expTitle, loc) => handleOpenBookExperience(expTitle, loc)}
                />
              </motion.div>
            )}

            {/* VIEW 5: DEDICATED SAVED TRIPS VAULT */}
            {currentView === 'saved' && (
              <motion.div
                key="saved"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <SavedTripsSection
                  savedDestinations={savedDestinationsList}
                  onRemoveFromSaved={handleToggleSave}
                  onSelectDestination={handleOpenDestination}
                  onPlanTripForDestination={(destName) => handleOpenTripPlanner(destName)}
                  onExploreDestinations={() => handleSelectView('destinations')}
                  onBookStay={(destName) => handleOpenBookStay(destName)}
                />
              </motion.div>
            )}

            {/* VIEW 6: DEDICATED MY BOOKINGS SECTION */}
            {currentView === 'bookings' && (
              <motion.div
                key="bookings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <MyBookingsSection
                  bookings={bookings}
                  currentUser={currentUser}
                  onOpenAuth={() => setIsAuthModalOpen(true)}
                  onRefreshBookings={handleRefreshBookings}
                  onBookStay={() => handleOpenBookStay()}
                  onBookExperience={() => handleSelectView('experiences')}
                  onExploreDestinations={() => handleSelectView('destinations')}
                />
              </motion.div>
            )}

            {/* VIEW 7: DEDICATED AUTHENTICATED ACCOUNT / MEMBER PROFILE */}
            {currentView === 'account' && (
              <motion.div
                key="account"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <AccountProfileSection
                  user={currentUser}
                  bookings={bookings}
                  savedDestinations={savedDestinationsList}
                  onOpenAuth={() => setIsAuthModalOpen(true)}
                  onLogout={handleLogout}
                  onNavigateToBookings={() => handleSelectView('bookings')}
                  onNavigateToWishlist={() => handleSelectView('saved')}
                  onNavigateToPlanner={(destName) => handleOpenTripPlanner(destName)}
                  onSelectDestination={handleOpenDestination}
                  onBookStay={(destName) => handleOpenBookStay(destName)}
                  onUpdateUser={(updated) => setCurrentUser(updated)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* 4. FOOTER */}
        <Footer
          onSelectDestinationByName={(name) => {
            const match = destinations.find(
              (d) =>
                d.name.toLowerCase().includes(name.toLowerCase()) ||
                d.country.toLowerCase().includes(name.toLowerCase())
            );
            if (match) {
              handleOpenDestination(match);
            } else {
              setSearchFilter(name);
              handleSelectView('destinations');
            }
          }}
          onSelectExperienceCategory={() => {
            handleSelectView('experiences');
          }}
          onNavigateView={handleSelectView}
          onOpenLegalDoc={handleOpenLegalDoc}
        />
      </div>

      {/* MODALS */}
      {/* 1. Destination Details Modal */}
      <DestinationModal
        destination={selectedDestination}
        isOpen={isDestModalOpen}
        onClose={() => setIsDestModalOpen(false)}
        onPlanTripForDestination={(destName) => {
          setIsDestModalOpen(false);
          handleOpenTripPlanner(destName);
        }}
        onBookStay={(destName) => {
          setIsDestModalOpen(false);
          handleOpenBookStay(destName);
        }}
        isSaved={selectedDestination ? savedDestinationIds.includes(selectedDestination.id) : false}
        onToggleSave={handleToggleSave}
      />

      {/* 2. Central Booking Modal for Stays & Experiences */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        item={bookingTargetItem}
        bookingType={bookingType}
        currentUser={currentUser}
        onRequireAuth={(pendingAction) => {
          setAuthRequiredMessage('Authentication required to complete your reservation. Please sign in or join Auric Society.');
          setPendingBookingAction(() => pendingAction);
          setIsAuthModalOpen(true);
        }}
        onBookingConfirmed={handleBookingConfirmed}
      />

      {/* 3. Luxury Stays Browser Modal */}
      <StaysBrowserModal
        isOpen={isStaysBrowserOpen}
        onClose={() => setIsStaysBrowserOpen(false)}
        onSelectStayToBook={(stay) => handleOpenBookStay(stay)}
      />

      {/* 4. Trip Planner Architect Modal */}
      <TripPlannerModal
        isOpen={isPlannerModalOpen}
        onClose={() => setIsPlannerModalOpen(false)}
        prefilledDestination={plannerPrefillDest}
        prefilledStyle={plannerPrefillStyle}
      />

      {/* 5. Saved Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistModalOpen}
        onClose={() => setIsWishlistModalOpen(false)}
        savedDestinations={savedDestinationsList}
        onRemove={handleToggleSave}
        onSelectDestination={(dest) => {
          setIsWishlistModalOpen(false);
          handleOpenDestination(dest);
        }}
        onPlanWithSaved={() => {
          setIsWishlistModalOpen(false);
          handleOpenTripPlanner(savedDestinationsList[0]?.name || 'Hampi & Vijayanagara');
        }}
      />

      {/* 6. Auth / Profile Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setAuthRequiredMessage(undefined);
          setPendingBookingAction(null);
          setAuthResetToken('');
          setAuthModalMode('signin');
        }}
        onSuccess={handleLoginSuccess}
        customMessage={authRequiredMessage}
        initialMode={authModalMode}
        initialResetToken={authResetToken}
      />

      {/* 7. Google Maps Platform Global Explorer */}
      <GlobalMapExplorer
        isOpen={isGlobalMapOpen}
        onClose={() => setIsGlobalMapOpen(false)}
        destinations={destinations}
        onSelectDestination={(dest) => {
          setIsGlobalMapOpen(false);
          handleOpenDestination(dest);
        }}
        onPlanTrip={(destName) => {
          setIsGlobalMapOpen(false);
          handleOpenTripPlanner(destName);
        }}
      />

      {/* 8. Auric Concierge Floating Assistant */}
      <AuricAssistant
        onNavigateView={handleSelectView}
        onOpenGlobalMap={() => setIsGlobalMapOpen(true)}
        onOpenStayBrowser={() => setIsStaysBrowserOpen(true)}
        destinations={destinations}
      />

      {/* 9. Legal Document Viewer (Privacy Policy / Terms) */}
      <LegalModal
        isOpen={Boolean(legalDocType)}
        type={legalDocType}
        onClose={handleCloseLegalDoc}
      />
    </div>
  );
}
