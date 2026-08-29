import React, { useState } from 'react';
import { Compass, Mail, ArrowRight, Check, Globe, Instagram, Twitter, Facebook, Linkedin, Shield, Sparkles, Lock, FileText } from 'lucide-react';
import { AuricVistaLogo } from './AuricVistaLogo';
import { AppView } from './Sidebar';

interface FooterProps {
  onSelectDestinationByName?: (name: string) => void;
  onSelectExperienceCategory?: (category: string) => void;
  onNavigateView?: (view: AppView) => void;
  onOpenLegalDoc?: (type: 'privacy' | 'terms' | 'security') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectDestinationByName,
  onSelectExperienceCategory,
  onNavigateView,
  onOpenLegalDoc
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3500);
    }
  };

  const handleDestinationClick = (name: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onSelectDestinationByName) {
      onSelectDestinationByName(name);
    }
  };

  const handleExperienceClick = (category: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onSelectExperienceCategory) {
      onSelectExperienceCategory(category);
    }
  };

  const handleLegalClick = (type: 'privacy' | 'terms' | 'security', e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenLegalDoc) {
      onOpenLegalDoc(type);
    }
  };

  return (
    <footer className="bg-neutral-100 dark:bg-[#050505] text-neutral-700 dark:text-gray-300 border-t border-neutral-200 dark:border-white/5 relative overflow-hidden transition-colors">
      {/* Newsletter Dispatch Top Banner */}
      <div className="border-b border-neutral-200 dark:border-white/5 py-16 bg-neutral-200/60 dark:bg-[#0A0A0A] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-amber-700 dark:text-[#C5A059] uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Auric Dispatch</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 dark:text-white">
                Receive secret retreats & bespoke dispatches
              </h3>
              <p className="text-neutral-600 dark:text-gray-400 text-xs sm:text-sm">
                A weekly private curation of freshly opened architectural villas, hidden alpine trails, and chef tables worldwide.
              </p>
            </div>

            <div className="lg:col-span-6">
              {subscribed ? (
                <div className="flex items-center gap-2 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-[#F3E5AB] text-xs font-medium">
                  <Check className="w-4 h-4 text-amber-600 dark:text-[#C5A059] shrink-0" />
                  <span>You are subscribed to the Auric Dispatch. Welcome to the Society.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
                  <div className="flex-1 relative">
                    <Mail className="w-4 h-4 text-neutral-400 dark:text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="newsletter-email-input"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your private email..."
                      className="w-full pl-10 pr-4 py-3 rounded-full bg-white dark:bg-[#050505] border border-neutral-300 dark:border-white/10 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-amber-500 dark:focus:border-[#C5A059] shadow-sm"
                    />
                  </div>
                  <button
                    id="newsletter-subscribe-btn"
                    type="submit"
                    className="px-6 py-3 rounded-full bg-[#C5A059] hover:bg-[#F3E5AB] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#C5A059]/20 hover:scale-105"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-4 space-y-4">
            <AuricVistaLogo size="md" textColor="text-neutral-900 dark:text-white" subtitle="Discover · Explore · Plan · Travel" />

            <p className="text-xs text-neutral-600 dark:text-gray-400 leading-relaxed max-w-sm">
              Auric Travels is the bespoke luxury journey companion for modern voyagers. Orchestrating sublime global destinations and handcrafted itineraries worldwide.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-white/5 border border-neutral-300 dark:border-white/10 flex items-center justify-center text-neutral-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-[#C5A059] cursor-pointer transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </span>
              <span className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-white/5 border border-neutral-300 dark:border-white/10 flex items-center justify-center text-neutral-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-[#C5A059] cursor-pointer transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </span>
              <span className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-white/5 border border-neutral-300 dark:border-white/10 flex items-center justify-center text-neutral-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-[#C5A059] cursor-pointer transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </span>
              <span className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-white/5 border border-neutral-300 dark:border-white/10 flex items-center justify-center text-neutral-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-[#C5A059] cursor-pointer transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Nav Col 1: Destinations */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-amber-700 dark:text-[#C5A059]">Destinations</h4>
            <ul className="space-y-2 text-xs text-neutral-600 dark:text-gray-400">
              <li>
                <button 
                  onClick={(e) => handleDestinationClick('Amalfi Coast, Italy', e)} 
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors text-left"
                >
                  Amalfi Coast, Italy
                </button>
              </li>
              <li>
                <button 
                  onClick={(e) => handleDestinationClick('Kyoto, Japan', e)} 
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors text-left"
                >
                  Kyoto, Japan
                </button>
              </li>
              <li>
                <button 
                  onClick={(e) => handleDestinationClick('Zermatt, Switzerland', e)} 
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors text-left"
                >
                  Zermatt, Switzerland
                </button>
              </li>
              <li>
                <button 
                  onClick={(e) => handleDestinationClick('Serengeti, Tanzania', e)} 
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors text-left"
                >
                  Serengeti, Tanzania
                </button>
              </li>
              <li>
                <button 
                  onClick={(e) => handleDestinationClick('Banff Rockies, Canada', e)} 
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors text-left"
                >
                  Banff Rockies, Canada
                </button>
              </li>
              <li>
                <button 
                  onClick={(e) => handleDestinationClick('Santorini, Greece', e)} 
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors text-left"
                >
                  Santorini, Greece
                </button>
              </li>
            </ul>
          </div>

          {/* Nav Col 2: Experiences */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-amber-700 dark:text-[#C5A059]">Experiences</h4>
            <ul className="space-y-2 text-xs text-neutral-600 dark:text-gray-400">
              <li>
                <button 
                  onClick={(e) => handleExperienceClick('Adventure', e)} 
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors text-left"
                >
                  Wild Adventure
                </button>
              </li>
              <li>
                <button 
                  onClick={(e) => handleExperienceClick('Nature', e)} 
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors text-left"
                >
                  Nature Sanctuaries
                </button>
              </li>
              <li>
                <button 
                  onClick={(e) => handleExperienceClick('Culinary', e)} 
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors text-left"
                >
                  Michelin Gastronomy
                </button>
              </li>
              <li>
                <button 
                  onClick={(e) => handleExperienceClick('Culture', e)} 
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors text-left"
                >
                  Ancient Culture
                </button>
              </li>
              <li>
                <button 
                  onClick={(e) => handleExperienceClick('Sightseeing', e)} 
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors text-left"
                >
                  Panoramic Vistas
                </button>
              </li>
              <li>
                <button 
                  onClick={(e) => handleExperienceClick('Wellness', e)} 
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors text-left"
                >
                  Personalized Moods
                </button>
              </li>
            </ul>
          </div>

          {/* Nav Col 3: Platform Navigation */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-amber-700 dark:text-[#C5A059]">Platform Navigation</h4>
            <ul className="space-y-2 text-xs text-neutral-600 dark:text-gray-400">
              <li>
                <button
                  type="button"
                  id="footer-nav-home-btn"
                  onClick={() => onNavigateView ? onNavigateView('home') : (window.location.hash = '#home')}
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors text-left"
                >
                  Home Spotlight
                </button>
              </li>
              <li>
                <button
                  type="button"
                  id="footer-nav-planner-btn"
                  onClick={() => onNavigateView ? onNavigateView('planner') : (window.location.hash = '#planner')}
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors text-left"
                >
                  Trip Architect
                </button>
              </li>
              <li>
                <button
                  type="button"
                  id="footer-nav-destinations-btn"
                  onClick={() => onNavigateView ? onNavigateView('destinations') : (window.location.hash = '#destinations')}
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors text-left"
                >
                  Sanctuary Discovery
                </button>
              </li>
              <li>
                <button
                  type="button"
                  id="footer-nav-experiences-btn"
                  onClick={() => onNavigateView ? onNavigateView('experiences') : (window.location.hash = '#experiences')}
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors text-left"
                >
                  Curated Pursuits
                </button>
              </li>
              <li>
                <button
                  type="button"
                  id="footer-nav-saved-btn"
                  onClick={() => onNavigateView ? onNavigateView('saved') : (window.location.hash = '#saved')}
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors text-left"
                >
                  Saved Trips Vault
                </button>
              </li>
              <li>
                <button
                  type="button"
                  id="footer-nav-bookings-btn"
                  onClick={() => onNavigateView ? onNavigateView('bookings') : (window.location.hash = '#bookings')}
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors text-left"
                >
                  My Bookings
                </button>
              </li>
            </ul>
          </div>

          {/* Nav Col 4: Auric Society */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-amber-700 dark:text-[#C5A059]">Auric Society</h4>
            <ul className="space-y-2 text-xs text-neutral-600 dark:text-gray-400">
              <li>
                <button
                  type="button"
                  id="footer-nav-account-btn"
                  onClick={() => onNavigateView ? onNavigateView('account') : (window.location.hash = '#account')}
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors text-left"
                >
                  Member Privileges
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateView ? onNavigateView('home') : (window.location.hash = '#home')}
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors text-left"
                >
                  Heritage Concierge
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleLegalClick('security', e)}
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors text-left"
                >
                  Sustainability Code
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleLegalClick('terms', e)}
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors text-left"
                >
                  Luxury Service Terms
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleLegalClick('privacy', e)}
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors text-left"
                >
                  Client Data Privacy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Copyright */}
        <div className="mt-16 pt-8 border-t border-neutral-300 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-gray-500 font-mono">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Auric Travels Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              id="footer-privacy-btn"
              onClick={(e) => handleLegalClick('privacy', e)}
              className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
            >
              Privacy Policy
            </button>
            <button
              id="footer-terms-btn"
              onClick={(e) => handleLegalClick('terms', e)}
              className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
            >
              Terms of Luxury Service
            </button>
            <button
              id="footer-security-btn"
              onClick={(e) => handleLegalClick('security', e)}
              className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
            >
              Security & Trust
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

