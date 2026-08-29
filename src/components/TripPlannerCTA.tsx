import React from 'react';
import { Sparkles, Calendar, Compass, ArrowRight, ShieldCheck, MapPin, Clock, Star, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { SafeImage } from './SafeImage';

interface TripPlannerCTAProps {
  onStartPlanning: () => void;
}

export const TripPlannerCTA: React.FC<TripPlannerCTAProps> = ({ onStartPlanning }) => {
  return (
    <section id="trip-planner" className="py-24 bg-neutral-100 dark:bg-[#050505] text-neutral-900 dark:text-white relative overflow-hidden transition-colors">
      {/* Golden Aura Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#C5A059] blur-[180px] opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl bg-white dark:bg-[#0A0A0A] border border-neutral-200 dark:border-white/5 p-8 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 mb-1 font-mono text-xs text-[#C5A059] tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Bespoke Itinerary Studio</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-neutral-900 dark:text-white leading-tight">
                Turn your travel aspirations into an{' '}
                <span className="text-[#C5A059] italic font-normal">
                  unforgettable reality.
                </span>
              </h2>

              <p className="text-neutral-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
                Whether you envision a serene 10-day retreat through Kyoto’s ancient temples or an adrenaline-fueled heli-skiing expedition in the Swiss Alps, Auric Travel crafts the perfect bespoke journey down to the finest reservation.
              </p>

              {/* 3 Step Micro-Workflow */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/5">
                  <div className="w-8 h-8 rounded-xl bg-[#C5A059]/15 text-[#C5A059] font-mono font-bold text-xs flex items-center justify-center mb-2 border border-[#C5A059]/20">
                    01
                  </div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white mb-1">Set Style & Dates</h4>
                  <p className="text-[11px] text-neutral-500 dark:text-gray-400">Choose destinations, preferred pace, and private interests.</p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/5">
                  <div className="w-8 h-8 rounded-xl bg-[#C5A059]/15 text-[#C5A059] font-mono font-bold text-xs flex items-center justify-center mb-2 border border-[#C5A059]/20">
                    02
                  </div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white mb-1">Expert Curation</h4>
                  <p className="text-[11px] text-neutral-500 dark:text-gray-400">Instant day-by-day sequencing with handpicked villas & guides.</p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/5">
                  <div className="w-8 h-8 rounded-xl bg-[#C5A059]/15 text-[#C5A059] font-mono font-bold text-xs flex items-center justify-center mb-2 border border-[#C5A059]/20">
                    03
                  </div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white mb-1">Refine & Embark</h4>
                  <p className="text-[11px] text-neutral-500 dark:text-gray-400">Customise every detail with your dedicated travel concierge.</p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  id="trip-planner-start-planning-btn"
                  onClick={onStartPlanning}
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#C5A059] hover:bg-[#F3E5AB] text-black font-bold text-xs uppercase tracking-wider shadow-xl shadow-[#C5A059]/20 hover:scale-105 active:scale-[0.98] transition-all duration-200"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Start Planning</span>
                  <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-gray-400">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                  <span>No upfront fees · Complete personalization</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Preview Card with Visible Trip Planner Video */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="relative w-full h-[320px] sm:h-[380px] lg:h-[420px] rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-[#C5A059]/40 bg-black group">
                {/* VISIBLE CINEMATIC TRIP PLANNER VIDEO */}
                <video
                  src="/videos/trip-planner.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  poster="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80"
                  className="w-full h-full object-cover block"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/30 pointer-events-none" />

                {/* Floating Top Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#C5A059]/40 text-[#F3E5AB] text-[10px] font-mono font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
                    <span>Live AI Route Architect</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#F3E5AB] bg-black/70 px-2.5 py-1 rounded-full border border-white/10">
                    Bespoke 7-Day
                  </span>
                </div>

                {/* Bottom Overlay Info & Action */}
                <div className="absolute bottom-5 left-5 right-5 z-10 space-y-2.5">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
                      Dynamic Itinerary Engine
                    </span>
                    <h4 className="text-lg font-serif font-bold text-white drop-shadow">
                      Positano, Capri & Amalfi Coast
                    </h4>
                    <p className="text-gray-200 text-xs line-clamp-1 drop-shadow">
                      Bespoke route sequencing, private yacht transfers & luxury villa bookings.
                    </p>
                  </div>

                  <button
                    onClick={onStartPlanning}
                    className="w-full py-3 rounded-2xl bg-[#C5A059] hover:bg-[#F3E5AB] text-black text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/70 hover:scale-102 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>Customize This Itinerary</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
