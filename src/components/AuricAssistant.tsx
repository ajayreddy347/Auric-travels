import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Compass,
  Building2,
  Calendar,
  ShieldCheck,
  User,
  ArrowRight,
  HelpCircle,
  Clock,
  MapPin,
  ChevronDown,
  BedDouble,
  Globe,
  Navigation,
} from 'lucide-react';
import { AppView } from './Sidebar';
import { Destination } from '../types';
import { DESTINATIONS } from '../data/mockData';
import { EXPERIENCES } from '../data/experiencesData';
import { LUXURY_STAYS } from '../data/staysData';

interface QuickActionItem {
  label: string;
  action: () => void;
  icon?: React.ReactNode;
}

interface Message {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
  quickActions?: QuickActionItem[];
  category?: 'destinations' | 'stays' | 'experiences' | 'planner' | 'bookings' | 'account' | 'safety' | 'general';
}

interface AuricAssistantProps {
  onNavigateView: (view: AppView) => void;
  onOpenGlobalMap?: () => void;
  onOpenStayBrowser?: () => void;
  destinations?: Destination[];
}

const SUGGESTED_INQUIRIES = [
  'Where should I go?',
  'I want a weekend trip',
  'What can I do in Hampi?',
  'Show me luxury stays',
  'How do I plan a custom itinerary?',
  'How does secure booking work?',
];

export const AuricAssistant: React.FC<AuricAssistantProps> = ({
  onNavigateView,
  onOpenGlobalMap,
  onOpenStayBrowser,
  destinations = DESTINATIONS,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'Namaste & welcome to Auric Travels. I am your private Concierge Assistant.\n\nI can help you explore our 18+ handpicked sanctuaries, discover 23+ curated pursuits, browse verified luxury stays, generate custom itineraries, and guide your bookings.',
      timestamp: 'Just now',
      category: 'general',
      quickActions: [
        {
          label: 'Explore Destinations',
          action: () => {
            onNavigateView('destinations');
            setIsOpen(false);
          },
          icon: <Compass className="w-3.5 h-3.5 text-[#C5A059]" />,
        },
        {
          label: 'Plan My Trip',
          action: () => {
            onNavigateView('planner');
            setIsOpen(false);
          },
          icon: <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />,
        },
        {
          label: 'Auric Stays',
          action: () => {
            if (onOpenStayBrowser) onOpenStayBrowser();
            else onNavigateView('home');
            setIsOpen(false);
          },
          icon: <BedDouble className="w-3.5 h-3.5 text-[#C5A059]" />,
        },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  // Grounded Intelligence Matcher without Hallucinations
  const generateConciergeResponse = (userQuery: string): { text: string; quickActions?: QuickActionItem[] } => {
    const q = userQuery.toLowerCase().trim();

    if (!q) {
      return {
        text: 'Please enter a destination, experience, stay, or itinerary question, and I will gladly assist you.',
      };
    }

    // 1. SPECIFIC DESTINATION QUERIES (Checking all actual mockData destinations)
    for (const dest of destinations) {
      const destNameLower = dest.name.toLowerCase();
      const destIdLower = dest.id.toLowerCase();
      const destCountryLower = dest.country.toLowerCase();
      const destStateLower = (dest.state || '').toLowerCase();

      if (
        q.includes(destIdLower) ||
        q.includes(destNameLower.split(' ')[0]) ||
        (dest.state && q.includes(destStateLower)) ||
        (destIdLower === 'amalfi-coast' && (q.includes('amalfi') || q.includes('positano'))) ||
        (destIdLower === 'swiss-alps' && (q.includes('swiss') || q.includes('zermatt') || q.includes('alps'))) ||
        (destIdLower === 'kabini' && q.includes('kabini'))
      ) {
        // Collect real experiences matching this destination
        const matchingExp = EXPERIENCES.filter(
          (e) => e.destinationId === dest.id || e.location.toLowerCase().includes(destIdLower)
        );

        const attractionsList = dest.topAttractions
          ? dest.topAttractions.slice(0, 3).map((a) => `• **${a.name}**: ${a.description}`).join('\n')
          : `• **Highlights**: ${dest.tagline}`;

        const expList =
          matchingExp.length > 0
            ? `\n\n**Featured Curated Experiences**:\n` +
              matchingExp.slice(0, 2).map((e) => `• **${e.name}** (${e.category}) – ${e.duration}`).join('\n')
            : '';

        return {
          text: `Here is the verified curation for **${dest.name}** (${dest.country}${dest.state ? `, ${dest.state}` : ''}):\n\n${dest.description}\n\n**Key Highlights & Attractions**:\n${attractionsList}${expList}\n\n• **Best Season**: ${dest.bestTimeToVisit}\n• **Vibe**: ${dest.vibe.join(', ')}`,
          quickActions: [
            {
              label: `View ${dest.name}`,
              action: () => {
                onNavigateView('destinations');
                setIsOpen(false);
              },
              icon: <Compass className="w-3.5 h-3.5 text-[#C5A059]" />,
            },
            {
              label: `Plan ${dest.name} Itinerary`,
              action: () => {
                onNavigateView('planner');
                setIsOpen(false);
              },
              icon: <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />,
            },
          ],
        };
      }
    }

    // 2. WEEKEND TRIP / SHORT GETAWAY QUERIES
    if (
      q.includes('weekend') ||
      q.includes('short trip') ||
      q.includes('quick getaway') ||
      q.includes('2 days') ||
      q.includes('3 days')
    ) {
      return {
        text: `For a rejuvenating weekend retreat, our top curated sanctuaries include:\n\n• **Coorg (Kodagu)**: Misty coffee plantations & Ayurvedic sound retreats (2–3 days).\n• **Kabini & Nagarhole**: Deep jungle wildlife safaris & boat predator tracks (2–3 days).\n• **Gokarna & Om Beach**: Peaceful rocky coastline and sunset cliff yoga (2–3 days).\n• **Chikmagalur**: Western Ghats coffee highlands & estate walks (2 days).\n• **Mysuru**: Royal palace durbar & heritage sandalwood trails (2 days).\n\nYou can use our Trip Planner to customize exact 2-to-3-day schedules.`,
        quickActions: [
          {
            label: 'Plan Weekend Trip',
            action: () => {
              onNavigateView('planner');
              setIsOpen(false);
            },
            icon: <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />,
          },
          {
            label: 'Explore Karnataka Sanctuaries',
            action: () => {
              onNavigateView('destinations');
              setIsOpen(false);
            },
            icon: <Compass className="w-3.5 h-3.5 text-[#C5A059]" />,
          },
        ],
      };
    }

    // 3. WHERE SHOULD I GO / RECOMMENDATIONS
    if (
      q.includes('where should i go') ||
      q.includes('where to go') ||
      q.includes('recommend') ||
      q.includes('suggest a place') ||
      q.includes('best place')
    ) {
      return {
        text: `Depending on your travel mood, here are our premier recommendations:\n\n• **Ancient Heritage & Monoliths**: Hampi, Mysuru, Jaipur, Kyoto.\n• **Nature & Mountain Tranquility**: Coorg, Chikmagalur, Munnar, Swiss Alps.\n• **Coastal & Sea Panoramas**: Gokarna, Amalfi Coast, Santorini, Bali.\n• **Wildlife & Wilderness**: Kabini Nagarhole Reserve, Serengeti National Park.\n• **Palatial Luxury**: Udaipur Lake Pichola & City Palace.\n\nWhich style resonates most with your journey?`,
        quickActions: [
          {
            label: 'Explore All Destinations',
            action: () => {
              onNavigateView('destinations');
              setIsOpen(false);
            },
            icon: <Compass className="w-3.5 h-3.5 text-[#C5A059]" />,
          },
          {
            label: 'Plan My Trip',
            action: () => {
              onNavigateView('planner');
              setIsOpen(false);
            },
            icon: <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />,
          },
        ],
      };
    }

    // 4. AURIC STAY / HOTELS / RESORTS / VILLAS
    if (
      q.includes('stay') ||
      q.includes('hotel') ||
      q.includes('resort') ||
      q.includes('villa') ||
      q.includes('room') ||
      q.includes('accommodation') ||
      q.includes('lodging')
    ) {
      const topStays = LUXURY_STAYS.slice(0, 4);
      const staySummary = topStays
        .map((s) => `• **${s.name}** (${s.destinationName}) – ${s.startingPriceDisplay} · ${s.roomTypes[0]?.name}`)
        .join('\n');

      return {
        text: `Auric Stays offers private architectural villas, heritage palace suites, and safari sanctuaries with dedicated butler service. Verified sanctuaries in our collection include:\n\n${staySummary}\n\nYou can browse full amenities, photo galleries, and check availability directly in the Stays Browser.`,
        quickActions: [
          {
            label: 'Browse Auric Stays',
            action: () => {
              if (onOpenStayBrowser) onOpenStayBrowser();
              else onNavigateView('home');
              setIsOpen(false);
            },
            icon: <BedDouble className="w-3.5 h-3.5 text-[#C5A059]" />,
          },
          {
            label: 'View Destinations',
            action: () => {
              onNavigateView('destinations');
              setIsOpen(false);
            },
            icon: <Compass className="w-3.5 h-3.5 text-[#C5A059]" />,
          },
        ],
      };
    }

    // 5. CURATED EXPERIENCES
    if (
      q.includes('experience') ||
      q.includes('activity') ||
      q.includes('pursuit') ||
      q.includes('safari') ||
      q.includes('coracle') ||
      q.includes('tasting') ||
      q.includes('yacht') ||
      q.includes('ski') ||
      q.includes('tea ceremony')
    ) {
      return {
        text: `Auric Travels curates 23+ exclusive private pursuits across 6 pillars:\n\n• **Adventure**: Coracle Navigation in Hampi, Khardung La Biking in Ladakh, Matterhorn Glacier Skiing.\n• **Culture**: Exclusive Udaipur City Palace Curator Tour, Gion Ochaya Tea Ceremony in Kyoto, Mysore Palace Durbar.\n• **Gastronomy**: Kumarakom Ancestral Spice Sadya, Cliffside Lemon Grove Pasta Atelier in Amalfi, Indiranagar Craft Gastronomy.\n• **Wellness**: Ayurvedic Abhyanga in Coorg, Cliffside Sunset Yoga in Gokarna, Kyoto Forest Bathi.\n• **Wildlife**: Nagarhole Deep Jungle Predator Safari in Kabini.`,
        quickActions: [
          {
            label: 'Discover Experiences',
            action: () => {
              onNavigateView('experiences');
              setIsOpen(false);
            },
            icon: <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />,
          },
          {
            label: 'Plan Trip with Pursuits',
            action: () => {
              onNavigateView('planner');
              setIsOpen(false);
            },
            icon: <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />,
          },
        ],
      };
    }

    // 6. TRIP PLANNER & ITINERARIES
    if (
      q.includes('plan') ||
      q.includes('itinerary') ||
      q.includes('route') ||
      q.includes('architect') ||
      q.includes('custom trip') ||
      q.includes('budget') ||
      q.includes('days')
    ) {
      return {
        text: `Our **Trip Planner Architect** crafts bespoke day-by-day journeys:\n\n1. Select your destination, preferred travel dates, and guest count.\n2. Choose your travel pace (Relaxed, Balanced, Intensive) and persona (Luxury, Heritage, Nature, Culinary).\n3. Get custom morning, afternoon, and evening timelines with verified GPS coordinates and driving distances.\n4. Save itineraries directly to your private Saved Vault or book included stays in one click.`,
        quickActions: [
          {
            label: 'Open Trip Planner',
            action: () => {
              onNavigateView('planner');
              setIsOpen(false);
            },
            icon: <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />,
          },
          {
            label: 'Explore Destinations',
            action: () => {
              onNavigateView('destinations');
              setIsOpen(false);
            },
            icon: <Compass className="w-3.5 h-3.5 text-[#C5A059]" />,
          },
        ],
      };
    }

    // 7. BOOKINGS, RESERVATIONS & BOOKING SAFETY
    if (
      q.includes('book') ||
      q.includes('reserve') ||
      q.includes('confirm') ||
      q.includes('my bookings') ||
      q.includes('reservation') ||
      q.includes('voucher') ||
      q.includes('cancel')
    ) {
      return {
        text: `**Official Reservation Guidelines**:\n\n• **Authenticated Booking**: To reserve any luxury sanctuary or experience, select the item and click 'Reserve' or 'Book Experience'.\n• **User Protection**: Authentication is required to associate reservations with your verified member ID.\n• **Booking Confirmation**: Confirmed reservations generate an official record stored in your private **My Bookings** dashboard.\n\n*(Please note: Bookings can only be confirmed through the official reservation checkout flow.)*`,
        quickActions: [
          {
            label: 'View My Bookings',
            action: () => {
              onNavigateView('bookings');
              setIsOpen(false);
            },
            icon: <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />,
          },
          {
            label: 'Browse Stays to Book',
            action: () => {
              if (onOpenStayBrowser) onOpenStayBrowser();
              else onNavigateView('home');
              setIsOpen(false);
            },
            icon: <BedDouble className="w-3.5 h-3.5 text-[#C5A059]" />,
          },
        ],
      };
    }

    // 8. ACCOUNT & SOCIETY PRIVILEGES
    if (
      q.includes('account') ||
      q.includes('profile') ||
      q.includes('login') ||
      q.includes('sign in') ||
      q.includes('register') ||
      q.includes('tier') ||
      q.includes('society') ||
      q.includes('membership')
    ) {
      return {
        text: `The **Auric Voyager Profile** provides access to:\n\n• Verified active and past sanctuary reservations.\n• Curated Saved Trips and sanctuary wishlist vault.\n• Membership Tier privileges (Founding Sovereign, Grand Voyager, Private Circle).\n• Bespoke travel styling preferences and dietary notes.`,
        quickActions: [
          {
            label: 'View Member Account',
            action: () => {
              onNavigateView('account');
              setIsOpen(false);
            },
            icon: <User className="w-3.5 h-3.5 text-[#C5A059]" />,
          },
          {
            label: 'View Saved Vault',
            action: () => {
              onNavigateView('saved');
              setIsOpen(false);
            },
            icon: <Compass className="w-3.5 h-3.5 text-[#C5A059]" />,
          },
        ],
      };
    }

    // 9. INTERACTIVE GLOBAL MAP
    if (
      q.includes('map') ||
      q.includes('gps') ||
      q.includes('coordinates') ||
      q.includes('distance') ||
      q.includes('explorer')
    ) {
      return {
        text: `Our **Interactive Global Map Explorer** visualizes all 18+ luxury sanctuaries and 23+ experiences with verified high-precision GPS coordinates, driving times, and direct itinerary planning links.`,
        quickActions: [
          {
            label: 'Open Interactive Map',
            action: () => {
              if (onOpenGlobalMap) onOpenGlobalMap();
              else onNavigateView('destinations');
              setIsOpen(false);
            },
            icon: <Navigation className="w-3.5 h-3.5 text-[#C5A059]" />,
          },
          {
            label: 'View Destinations List',
            action: () => {
              onNavigateView('destinations');
              setIsOpen(false);
            },
            icon: <Compass className="w-3.5 h-3.5 text-[#C5A059]" />,
          },
        ],
      };
    }

    // 10. UNKNOWN / OUT OF SCOPE (Zero-Hallucination Safe Fallback)
    return {
      text: `I don't have specific data for "${userQuery}" in our current curated catalog, but you can explore our handpicked Destinations, discover Curated Experiences, or design a custom journey in the Trip Planner.`,
      quickActions: [
        {
          label: 'Explore Destinations',
          action: () => {
            onNavigateView('destinations');
            setIsOpen(false);
          },
          icon: <Compass className="w-3.5 h-3.5 text-[#C5A059]" />,
        },
        {
          label: 'Trip Planner',
          action: () => {
            onNavigateView('planner');
            setIsOpen(false);
          },
          icon: <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />,
        },
        {
          label: 'Curated Experiences',
          action: () => {
            onNavigateView('experiences');
            setIsOpen(false);
          },
          icon: <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />,
        },
      ],
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputQuery).trim();
    if (!text) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const responseData = generateConciergeResponse(text);
      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: responseData.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickActions: responseData.quickActions,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 350);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* 1. FLOATING ASSISTANT BUTTON */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          id="auric-assistant-floating-btn"
          onClick={() => setIsOpen((prev) => !prev)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="group relative flex items-center gap-3 px-4 py-3 rounded-full bg-neutral-950 dark:bg-gradient-to-r dark:from-[#1E1B13] dark:to-[#0F0E0A] text-white border border-[#C5A059]/70 shadow-2xl shadow-black/40 hover:border-[#C5A059] transition-all"
          title="Open Auric Concierge Assistant"
          aria-label="Open Auric Assistant"
        >
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#C5A059] to-[#F3E5AB] text-black shrink-0 shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-neutral-950 rounded-full animate-pulse" />
          </div>

          <div className="flex flex-col text-left">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] leading-tight font-bold">
              Auric Assistant
            </span>
            <span className="text-xs font-serif font-bold text-white leading-tight">
              {isOpen ? 'Close Concierge' : 'Ask Concierge'}
            </span>
          </div>

          <div className="text-gray-400 group-hover:text-white ml-0.5 transition-transform duration-200">
            {isOpen ? <X className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </motion.button>
      </div>

      {/* 2. CHAT PANEL OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="auric-assistant-panel"
            initial={{ opacity: 0, y: 25, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[430px] max-h-[82vh] sm:max-h-[620px] h-[580px] rounded-3xl bg-white dark:bg-[#0E0E0E] border border-neutral-200 dark:border-[#C5A059]/40 shadow-2xl flex flex-col overflow-hidden text-neutral-900 dark:text-white"
          >
            {/* PANEL HEADER */}
            <div className="p-4 sm:p-4.5 bg-neutral-100 dark:bg-gradient-to-r dark:from-[#1A1710] dark:via-[#12100A] dark:to-[#0A0A0A] border-b border-neutral-200 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#C5A059] to-[#F3E5AB] text-black flex items-center justify-center shadow-md shadow-[#C5A059]/20 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-serif font-bold text-neutral-900 dark:text-white">
                      Auric Concierge
                    </h3>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-500 dark:text-gray-400 font-mono">
                    Official Travel Intelligence
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-900 dark:text-gray-400 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-white/10 transition-colors"
                title="Close Concierge"
                aria-label="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* QUICK TOPIC TABS */}
            <div className="px-3 py-2 bg-neutral-50 dark:bg-black/40 border-b border-neutral-200 dark:border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => handleSendMessage('Where should I go?')}
                className="px-2.5 py-1 rounded-lg bg-neutral-200/80 dark:bg-white/5 hover:bg-neutral-300 dark:hover:bg-white/10 text-[11px] font-semibold text-neutral-700 dark:text-gray-300 whitespace-nowrap transition-colors flex items-center gap-1 shrink-0"
              >
                <Compass className="w-3 h-3 text-[#C5A059]" />
                <span>Destinations</span>
              </button>

              <button
                onClick={() => handleSendMessage('Show me luxury stays')}
                className="px-2.5 py-1 rounded-lg bg-neutral-200/80 dark:bg-white/5 hover:bg-neutral-300 dark:hover:bg-white/10 text-[11px] font-semibold text-neutral-700 dark:text-gray-300 whitespace-nowrap transition-colors flex items-center gap-1 shrink-0"
              >
                <BedDouble className="w-3 h-3 text-[#C5A059]" />
                <span>Auric Stays</span>
              </button>

              <button
                onClick={() => handleSendMessage('Tell me about Curated Experiences')}
                className="px-2.5 py-1 rounded-lg bg-neutral-200/80 dark:bg-white/5 hover:bg-neutral-300 dark:hover:bg-white/10 text-[11px] font-semibold text-neutral-700 dark:text-gray-300 whitespace-nowrap transition-colors flex items-center gap-1 shrink-0"
              >
                <Sparkles className="w-3 h-3 text-[#C5A059]" />
                <span>Experiences</span>
              </button>

              <button
                onClick={() => handleSendMessage('How do I plan a custom itinerary?')}
                className="px-2.5 py-1 rounded-lg bg-neutral-200/80 dark:bg-white/5 hover:bg-neutral-300 dark:hover:bg-white/10 text-[11px] font-semibold text-neutral-700 dark:text-gray-300 whitespace-nowrap transition-colors flex items-center gap-1 shrink-0"
              >
                <Calendar className="w-3 h-3 text-[#C5A059]" />
                <span>Planner</span>
              </button>

              <button
                onClick={() => handleSendMessage('How does secure booking work?')}
                className="px-2.5 py-1 rounded-lg bg-neutral-200/80 dark:bg-white/5 hover:bg-neutral-300 dark:hover:bg-white/10 text-[11px] font-semibold text-neutral-700 dark:text-gray-300 whitespace-nowrap transition-colors flex items-center gap-1 shrink-0"
              >
                <ShieldCheck className="w-3 h-3 text-[#C5A059]" />
                <span>Bookings</span>
              </button>
            </div>

            {/* MESSAGE STREAM */}
            <div className="flex-1 p-4 space-y-3.5 overflow-y-auto custom-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#C5A059] text-black font-medium shadow-md shadow-[#C5A059]/15'
                        : 'bg-neutral-100 dark:bg-[#161616] text-neutral-800 dark:text-gray-200 border border-neutral-200 dark:border-white/10'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>

                    {msg.quickActions && msg.quickActions.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-neutral-200 dark:border-white/10 flex flex-wrap gap-1.5">
                        {msg.quickActions.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={action.action}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-black/60 border border-neutral-300 dark:border-[#C5A059]/40 text-neutral-900 dark:text-[#F3E5AB] font-bold text-[11px] hover:border-[#C5A059] hover:bg-neutral-50 dark:hover:bg-white/5 transition-all shadow-sm"
                          >
                            <span>{action.label}</span>
                            {action.icon || <ArrowRight className="w-3 h-3 text-[#C5A059]" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <span className="text-[9px] font-mono text-neutral-400 dark:text-gray-500 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-neutral-400 dark:text-gray-500 text-xs italic py-1 px-2">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span>Auric Concierge is answering...</span>
                </div>
              )}

              {/* Inquiry Suggestions if only initial greeting */}
              {messages.length === 1 && (
                <div className="pt-2 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 dark:text-gray-400 block px-1">
                    Frequent Inquiries:
                  </span>
                  <div className="space-y-1.5">
                    {SUGGESTED_INQUIRIES.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        className="w-full text-left p-2.5 rounded-xl bg-neutral-50 dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 border border-neutral-200 dark:border-white/5 text-xs text-neutral-700 dark:text-gray-300 transition-colors flex items-center justify-between group"
                      >
                        <span>{q}</span>
                        <ArrowRight className="w-3 h-3 text-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* INPUT CONTROLS */}
            <div className="p-3 bg-neutral-100 dark:bg-[#121212] border-t border-neutral-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  id="auric-assistant-input"
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about Hampi, stays, trip planning..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-black/60 border border-neutral-300 dark:border-white/15 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#C5A059] transition-all"
                />
                <button
                  id="auric-assistant-send-btn"
                  onClick={() => handleSendMessage()}
                  disabled={!inputQuery.trim()}
                  className="p-2.5 rounded-xl bg-[#C5A059] hover:bg-[#F3E5AB] disabled:opacity-40 disabled:hover:bg-[#C5A059] text-black font-bold transition-all shadow"
                  title="Send Question"
                  aria-label="Send Message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between text-[9px] font-mono text-neutral-400 dark:text-gray-500 mt-2 px-1">
                <span>Auric Concierge Intelligence</span>
                <span>Protected by Auric Society</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
