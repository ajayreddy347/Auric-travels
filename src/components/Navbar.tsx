import React, { useState, useEffect } from 'react';
import { Compass, Menu, X, Globe, User, Heart, Sparkles, ChevronDown, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AuricVistaLogo } from './AuricVistaLogo';

interface NavbarProps {
  onOpenTripPlanner: () => void;
  onOpenAuth: () => void;
  savedDestinationsCount: number;
  onOpenWishlist: () => void;
  onOpenGlobalMap?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTripPlanner,
  onOpenAuth,
  savedDestinationsCount,
  onOpenWishlist,
  onOpenGlobalMap,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'Destinations', href: '#destinations', id: 'destinations' },
    { name: 'Experiences', href: '#experiences', id: 'experiences' },
    { name: 'Discovery', href: '#discovery', id: 'discovery' },
    { name: 'Trip Planner', href: '#trip-planner', id: 'trip-planner' },
  ];

  const handleNavClick = (id: string, href: string) => {
    setActiveNav(id);
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        id="navbar-header"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 dark:bg-[#050505]/85 backdrop-blur-md border-b border-neutral-200 dark:border-white/5 py-3.5 shadow-lg dark:shadow-2xl dark:shadow-black/80'
            : 'bg-gradient-to-b from-white/95 dark:from-[#050505]/95 via-white/50 dark:via-[#050505]/50 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a
              id="brand-logo-link"
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('home', '#home');
              }}
              className="group flex items-center gap-3 focus:outline-none transition-transform hover:scale-[1.02]"
            >
              <AuricVistaLogo size="md" textColor="text-neutral-900 dark:text-white" subtitle="Curated Global Journeys" />
            </a>

            {/* Desktop Navigation Links */}
            <nav id="desktop-navigation" className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600 dark:text-gray-400">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleNavClick(link.id, link.href)}
                  className={`transition-colors relative py-1 ${
                    activeNav === link.id
                      ? 'text-[#C5A059] font-semibold'
                      : 'text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {link.name}
                  {activeNav === link.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#C5A059] to-[#F3E5AB] rounded-full" />
                  )}
                </button>
              ))}

              {onOpenGlobalMap && (
                <button
                  id="nav-link-world-map"
                  onClick={onOpenGlobalMap}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/10 text-[#C5A059] hover:bg-[#C5A059]/20 border border-[#C5A059]/30 text-xs font-semibold transition-all"
                  title="Open Interactive Google World Map"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>World Map</span>
                </button>
              )}
            </nav>

            {/* Actions & Utilities */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Wishlist Pill */}
              <button
                id="navbar-wishlist-button"
                onClick={onOpenWishlist}
                className="relative p-2.5 rounded-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-gray-300 hover:text-[#C5A059] hover:border-[#C5A059]/40 hover:bg-neutral-200 dark:hover:bg-white/10 transition-all duration-200"
                title="Saved Destinations"
              >
                <Heart className="w-4 h-4" />
                {savedDestinationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C5A059] text-[10px] font-bold text-black flex items-center justify-center animate-pulse">
                    {savedDestinationsCount}
                  </span>
                )}
              </button>

              {/* Currency/Language selector */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs font-medium text-neutral-700 dark:text-gray-300 hover:border-neutral-300 dark:hover:border-white/20 cursor-pointer">
                <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>USD · EN</span>
              </div>

              {/* Sign In Button from theme */}
              <button
                id="navbar-auth-button"
                onClick={onOpenAuth}
                className="px-5 py-1.5 border border-[#C5A059] text-[#C5A059] rounded-full text-xs font-semibold hover:bg-[#C5A059] hover:text-black transition-colors"
              >
                Sign In
              </button>

              {/* CTA Planner Button */}
              <button
                id="navbar-plan-trip-cta"
                onClick={onOpenTripPlanner}
                className="group relative inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#C5A059] hover:bg-[#F3E5AB] text-black text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#C5A059]/20 hover:scale-105 active:scale-[0.98] transition-all duration-200"
              >
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>Plan A Trip</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                id="mobile-wishlist-toggle"
                onClick={onOpenWishlist}
                className="relative p-2 rounded-full bg-neutral-100 dark:bg-[#0A0A0A] border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-gray-300"
              >
                <Heart className="w-4 h-4" />
                {savedDestinationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C5A059] text-[10px] font-bold text-black flex items-center justify-center">
                    {savedDestinationsCount}
                  </span>
                )}
              </button>

              <button
                id="mobile-menu-toggle-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 rounded-full bg-neutral-100 dark:bg-[#0A0A0A] border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-gray-200 hover:text-[#C5A059] hover:border-[#C5A059]/40 focus:outline-none"
                aria-label="Toggle navigation"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            id="mobile-drawer-menu"
            className="fixed inset-x-0 top-[68px] z-40 bg-white/95 dark:bg-[#050505]/95 border-b border-neutral-200 dark:border-white/10 backdrop-blur-xl p-6 lg:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  id={`mobile-nav-${link.id}`}
                  onClick={() => handleNavClick(link.id, link.href)}
                  className={`flex items-center justify-between p-3 rounded-2xl text-left text-base font-medium transition-colors ${
                    activeNav === link.id
                      ? 'bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30'
                      : 'text-neutral-700 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-white/5'
                  }`}
                >
                  <span>{link.name}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-70" />
                </button>
              ))}

              {onOpenGlobalMap && (
                <button
                  id="mobile-nav-world-map"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenGlobalMap();
                  }}
                  className="flex items-center justify-between p-3 rounded-2xl text-left text-base font-medium text-[#C5A059] bg-[#C5A059]/10 border border-[#C5A059]/20"
                >
                  <span className="flex items-center gap-2">
                    <Compass className="w-4 h-4" />
                    <span>Interactive World Map</span>
                  </span>
                  <ArrowUpRight className="w-4 h-4 opacity-70" />
                </button>
              )}

              <div className="pt-4 border-t border-neutral-200 dark:border-white/10 flex flex-col gap-3">
                <button
                  id="mobile-plan-trip-cta"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenTripPlanner();
                  }}
                  className="w-full py-3 rounded-full bg-[#C5A059] hover:bg-[#F3E5AB] text-black font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#C5A059]/20"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Plan My Trip</span>
                </button>

                <button
                  id="mobile-auth-btn"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full py-2.5 rounded-full border border-[#C5A059] text-[#C5A059] text-sm font-semibold hover:bg-[#C5A059] hover:text-black transition-colors flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In / Profile</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
