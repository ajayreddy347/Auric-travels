import React from 'react';
import { AuricVistaLogo } from './AuricVistaLogo';
import {
  Home,
  Globe,
  Sparkles,
  Calendar,
  Heart,
  ShieldCheck,
  User,
  ChevronRight,
  ChevronLeft,
  Sun,
  Moon,
  Compass,
  PhoneCall,
  Crown,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { AuthUser } from '../types';
import { useTheme } from '../utils/themeContext';

export type AppView =
  | 'home'
  | 'destinations'
  | 'experiences'
  | 'planner'
  | 'saved'
  | 'bookings'
  | 'account';

interface SidebarProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  savedCount: number;
  bookingCount?: number;
  currentUser: AuthUser | null;
  onOpenAuth: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenGlobalMap?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  savedCount,
  bookingCount = 0,
  currentUser,
  onOpenAuth,
  isOpenMobile,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
  onOpenGlobalMap,
}) => {
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    {
      id: 'home' as AppView,
      label: 'Home',
      subtitle: 'Spotlight & Discover',
      icon: Home,
      iconColor: 'text-[#C5A059]',
    },
    {
      id: 'destinations' as AppView,
      label: 'Destinations',
      subtitle: 'Global & Indian Sanctuaries',
      icon: Globe,
      iconColor: 'text-amber-500 dark:text-amber-400',
    },
    {
      id: 'experiences' as AppView,
      label: 'Experiences',
      subtitle: 'Curated Pursuits & Tastings',
      icon: Sparkles,
      iconColor: 'text-[#C5A059]',
    },
    {
      id: 'planner' as AppView,
      label: 'Trip Planner',
      subtitle: 'Bespoke Itineraries',
      icon: Calendar,
      badge: 'Architect',
      iconColor: 'text-emerald-500 dark:text-emerald-400',
    },
    {
      id: 'saved' as AppView,
      label: 'Saved Trips',
      subtitle: 'Curated Wishlist Vault',
      icon: Heart,
      count: savedCount,
      iconColor: 'text-rose-500 dark:text-rose-400',
    },
    {
      id: 'bookings' as AppView,
      label: 'My Bookings',
      subtitle: 'Reserved Stays & Pursuits',
      icon: ShieldCheck,
      count: bookingCount,
      isGold: bookingCount > 0,
      iconColor: 'text-[#C5A059]',
    },
    {
      id: 'account' as AppView,
      label: 'Account',
      subtitle: currentUser ? currentUser.name : 'Member Portal',
      icon: User,
      isAuthItem: true,
      iconColor: 'text-sky-500 dark:text-sky-400',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 transition-all duration-300 ease-in-out flex flex-col justify-between
          ${isCollapsed ? 'w-20' : 'w-72'}
          ${isOpenMobile ? 'translate-x-0 !w-72' : '-translate-x-full lg:translate-x-0'}
          bg-white dark:bg-[#080808] border-r border-neutral-200 dark:border-white/10 shadow-xl lg:shadow-none`}
      >
        {/* Top: Brand Header */}
        <div className="p-5 border-b border-neutral-200 dark:border-white/10 flex items-center justify-between">
          <div
            onClick={() => {
              onSelectView('home');
              onCloseMobile();
            }}
            className="cursor-pointer flex items-center gap-3 overflow-hidden"
          >
            {isCollapsed && !isOpenMobile ? (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C5A059] to-[#8C6D32] flex items-center justify-center text-black font-serif font-bold text-lg shadow-md">
                AT
              </div>
            ) : (
              <AuricVistaLogo size="md" subtitle="Travel Platform" />
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label="Toggle Sidebar Collapse"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Middle: Navigation Links */}
        <div className="px-3 py-4 flex-1 overflow-y-auto space-y-1 custom-scrollbar">
          {(!isCollapsed || isOpenMobile) && (
            <div className="px-3 mb-2 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 font-bold">
                PLATFORM NAVIGATION
              </span>
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'account' && !currentUser) {
                    onOpenAuth();
                  } else {
                    onSelectView(item.id);
                  }
                  onCloseMobile();
                }}
                className={`w-full group text-left rounded-2xl transition-all duration-200 flex items-center justify-between ${
                  isCollapsed && !isOpenMobile ? 'p-2.5 justify-center' : 'px-3.5 py-2.5'
                } ${
                  isActive
                    ? 'bg-neutral-100 dark:bg-gradient-to-r dark:from-[#C5A059]/20 dark:to-[#C5A059]/5 border border-[#C5A059] text-neutral-900 dark:text-white shadow-sm dark:shadow-lg dark:shadow-[#C5A059]/10'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/70 dark:hover:bg-white/5 border border-transparent'
                }`}
                title={item.label}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? 'bg-[#C5A059] text-black shadow-md'
                        : item.isGold
                        ? 'bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30'
                        : 'bg-neutral-100 dark:bg-[#121212] text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-white/5 group-hover:text-neutral-900 dark:group-hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {(!isCollapsed || isOpenMobile) && (
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs font-semibold tracking-tight truncate ${
                            isActive
                              ? 'text-neutral-900 dark:text-white font-bold'
                              : item.isGold
                              ? 'text-[#C5A059] dark:text-[#F3E5AB]'
                              : 'text-neutral-800 dark:text-neutral-200'
                          }`}
                        >
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase font-bold tracking-wider bg-neutral-200 dark:bg-white/10 text-neutral-800 dark:text-[#F3E5AB]">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block truncate font-normal">
                        {item.subtitle}
                      </span>
                    </div>
                  )}
                </div>

                {(!isCollapsed || isOpenMobile) && (
                  <div>
                    {item.count !== undefined && item.count > 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/15 dark:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-[10px] font-mono font-bold">
                        {item.count}
                      </span>
                    ) : (
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-transform ${
                          isActive
                            ? 'text-[#C5A059] translate-x-0.5'
                            : 'text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-500 dark:group-hover:text-neutral-400'
                        }`}
                      />
                    )}
                  </div>
                )}
              </button>
            );
          })}

          {/* Quick Concierge Card in Sidebar (Only when expanded) */}
          {(!isCollapsed || isOpenMobile) && (
            <div className="pt-4 px-1">
              <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-gradient-to-br dark:from-[#121008] dark:to-[#0A0A0A] border border-neutral-200 dark:border-[#C5A059]/25 space-y-2">
                <div className="flex items-center gap-2 text-neutral-900 dark:text-[#F3E5AB] text-xs font-serif font-bold">
                  <Crown className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Auric Concierge Desk</span>
                </div>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  Direct hotline for presidential suites, private charters & masterclasses.
                </p>
                <button
                  onClick={() => {
                    onSelectView('destinations');
                    onCloseMobile();
                  }}
                  className="w-full py-1.5 rounded-xl bg-neutral-200 dark:bg-[#C5A059]/20 hover:bg-[#C5A059] text-neutral-800 dark:text-[#F3E5AB] hover:text-black text-[11px] font-bold tracking-wide uppercase transition-all"
                >
                  Explore Sanctuaries
                </button>
                {onOpenGlobalMap && (
                  <button
                    onClick={() => {
                      onOpenGlobalMap();
                      onCloseMobile();
                    }}
                    className="w-full py-1.5 rounded-xl bg-[#C5A059]/10 hover:bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30 text-[11px] font-bold tracking-wide flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Interactive World Map</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom: Profile & Theme Switcher */}
        <div className="p-3 border-t border-neutral-200 dark:border-white/10 space-y-2 bg-neutral-50/70 dark:bg-[#050505]/60">
          {/* Theme Switcher Button */}
          <button
            id="sidebar-theme-toggle-btn"
            onClick={toggleTheme}
            className={`w-full flex items-center justify-between p-2 rounded-xl border border-neutral-200 dark:border-white/10 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-white/5 transition-all ${
              isCollapsed && !isOpenMobile ? 'justify-center' : ''
            }`}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-neutral-200 dark:bg-white/10 flex items-center justify-center text-neutral-800 dark:text-amber-300">
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </div>
              {(!isCollapsed || isOpenMobile) && (
                <span className="font-semibold text-xs">
                  {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
                </span>
              )}
            </div>
            {(!isCollapsed || isOpenMobile) && (
              <span className="text-[10px] font-mono uppercase text-neutral-400 dark:text-neutral-500">
                {theme === 'dark' ? 'Onyx' : 'Alabaster'}
              </span>
            )}
          </button>

          {/* User Profile Bar */}
          {currentUser ? (
            <button
              id="sidebar-user-profile-btn"
              onClick={() => {
                onSelectView('account');
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all text-xs ${
                currentView === 'account'
                  ? 'bg-[#C5A059]/20 border-[#C5A059] text-neutral-900 dark:text-white shadow-sm'
                  : 'hover:bg-neutral-200/50 dark:hover:bg-white/5 border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300'
              } ${isCollapsed && !isOpenMobile ? 'justify-center' : ''}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] shrink-0 font-serif font-bold text-xs">
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
                {(!isCollapsed || isOpenMobile) && (
                  <div className="text-left min-w-0">
                    <span className="font-semibold text-neutral-900 dark:text-white block leading-tight truncate">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-[#C5A059] font-mono block truncate">
                      {currentUser.memberTier || 'Sovereign'}
                    </span>
                  </div>
                )}
              </div>
              {(!isCollapsed || isOpenMobile) && (
                <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider shrink-0">
                  Profile →
                </span>
              )}
            </button>
          ) : (
            <button
              id="sidebar-signin-btn"
              onClick={() => {
                onOpenAuth();
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between p-2 rounded-xl hover:bg-neutral-200/50 dark:hover:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs text-neutral-700 dark:text-neutral-300 transition-colors ${
                isCollapsed && !isOpenMobile ? 'justify-center' : ''
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
                  <User className="w-3.5 h-3.5" />
                </div>
                {(!isCollapsed || isOpenMobile) && (
                  <div className="text-left">
                    <span className="font-semibold text-neutral-900 dark:text-white block leading-tight">Member Portal</span>
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">Sign In / Join</span>
                  </div>
                )}
              </div>
              {(!isCollapsed || isOpenMobile) && (
                <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-wider">
                  Access
                </span>
              )}
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
