import React, { useState } from 'react';
import { X, Sparkles, Calendar, MapPin, Compass, Clock, Check, ArrowRight, Plane, Coffee, ShieldCheck, Download, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DESTINATIONS } from '../data/mockData';

interface TripPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledDestination?: string;
  prefilledStyle?: string;
}

export const TripPlannerModal: React.FC<TripPlannerModalProps> = ({
  isOpen,
  onClose,
  prefilledDestination = 'Amalfi Coast',
  prefilledStyle = 'Coastal Luxury & Gastronomy',
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDestination, setSelectedDestination] = useState<string>(prefilledDestination || 'Amalfi Coast');
  const [durationDays, setDurationDays] = useState<number>(5);
  const [travelPace, setTravelPace] = useState<'Relaxed & Unhurried' | 'Balanced Harmony' | 'High Energy & Action'>('Balanced Harmony');
  const [partyType, setPartyType] = useState<'Solo Explorer' | 'Romantic Couple' | 'Family & Kin' | 'Private Circle'>('Romantic Couple');
  const [isGenerating, setIsGenerating] = useState(false);
  const [itineraryGenerated, setItineraryGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerateItinerary = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setItineraryGenerated(true);
      setStep(3);
    }, 1200);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(
      `Auric Travel Bespoke Itinerary for ${selectedDestination} (${durationDays} Days, ${travelPace} pace for ${partyType}).`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-3xl bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl my-auto text-white flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#050505]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center border border-[#C5A059]/25">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-white">Auric Trip Architect</h3>
                <p className="text-xs text-gray-400">Design your personalized day-by-day itinerary</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Stepper Bar */}
          <div className="px-6 py-3 bg-[#050505] border-b border-white/5 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${step >= 1 ? 'bg-[#C5A059] text-black' : 'bg-white/5 text-gray-500'}`}>
                1
              </span>
              <span className={step >= 1 ? 'text-gray-200 font-semibold' : 'text-gray-500'}>
                Destination & Duration
              </span>
            </div>
            <div className="w-8 h-0.5 bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${step >= 2 ? 'bg-[#C5A059] text-black' : 'bg-white/5 text-gray-500'}`}>
                2
              </span>
              <span className={step >= 2 ? 'text-gray-200 font-semibold' : 'text-gray-500'}>
                Style & Preferences
              </span>
            </div>
            <div className="w-8 h-0.5 bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${step >= 3 ? 'bg-[#C5A059] text-black' : 'bg-white/5 text-gray-500'}`}>
                3
              </span>
              <span className={step >= 3 ? 'text-gray-200 font-semibold' : 'text-gray-500'}>
                Generated Itinerary
              </span>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-gray-300">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#C5A059] mb-2">
                    Select Your Dream Destination
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {DESTINATIONS.map((dest) => (
                      <button
                        key={dest.id}
                        type="button"
                        onClick={() => setSelectedDestination(dest.name)}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          selectedDestination === dest.name
                            ? 'bg-[#C5A059]/15 border-[#C5A059] text-[#F3E5AB] shadow-md shadow-[#C5A059]/10'
                            : 'bg-[#050505] border-white/5 text-gray-300 hover:border-white/15'
                        }`}
                      >
                        <div className="text-xs font-bold">{dest.name}</div>
                        <div className="text-[10px] text-gray-400">{dest.country}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#C5A059] mb-2">
                    Duration: <span className="text-white font-mono">{durationDays} Days</span>
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="14"
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full accent-[#C5A059] cursor-pointer h-2 bg-[#050505] rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500 mt-1 font-mono">
                    <span>3 Days (Weekend Escape)</span>
                    <span>7 Days (Classic)</span>
                    <span>14 Days (Grand Tour)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#C5A059] mb-2">
                    Who is traveling?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['Solo Explorer', 'Romantic Couple', 'Family & Kin', 'Private Circle'] as const).map((party) => (
                      <button
                        key={party}
                        type="button"
                        onClick={() => setPartyType(party)}
                        className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                          partyType === party
                            ? 'bg-[#C5A059] text-black font-bold border-[#C5A059]'
                            : 'bg-[#050505] border-white/5 text-gray-300 hover:border-white/15'
                        }`}
                      >
                        {party}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#C5A059] mb-2">
                    Desired Travel Pace
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(['Relaxed & Unhurried', 'Balanced Harmony', 'High Energy & Action'] as const).map((pace) => (
                      <button
                        key={pace}
                        type="button"
                        onClick={() => setTravelPace(pace)}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          travelPace === pace
                            ? 'bg-[#C5A059]/15 border-[#C5A059] text-[#F3E5AB]'
                            : 'bg-[#050505] border-white/5 text-gray-300 hover:border-white/15'
                        }`}
                      >
                        <div className="font-bold text-xs">{pace}</div>
                        <div className="text-[11px] text-gray-400 mt-1">
                          {pace === 'Relaxed & Unhurried' && 'Late mornings, spa sessions & sunset dinners.'}
                          {pace === 'Balanced Harmony' && '1 key activity per day with ample leisure time.'}
                          {pace === 'High Energy & Action' && 'Multiple highlights, scenic treks & flights.'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#050505] border border-white/5 space-y-3">
                  <div className="text-xs font-bold uppercase font-mono tracking-wider text-[#C5A059] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                    <span>Included In Your Auric Service</span>
                  </div>
                  <ul className="text-xs text-gray-300 space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#C5A059]" />
                      Dedicated 24/7 private concierge and WhatsApp coordination
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#C5A059]" />
                      Handpicked 5-star boutique & heritage accommodations
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#C5A059]" />
                      Private chauffeur transfers & skip-the-line reservations
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#C5A059]">Custom Plan Created</span>
                    <h4 className="text-lg font-serif font-bold text-white">
                      {selectedDestination} · {durationDays} Days ({travelPace})
                    </h4>
                    <p className="text-xs text-gray-300">Specially optimized for: {partyType}</p>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold hover:text-[#C5A059]"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#C5A059]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Share Itinerary'}</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#050505] border border-white/5">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C5A059] mb-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>DAY 01: Private Arrival & Sunset Welcome</span>
                    </div>
                    <p className="text-xs text-gray-300">
                      VIP airport meet-and-greet, luxury Mercedes transfer to your selected cliffside suite. Welcome champagne on your private terrace followed by an exclusive 5-course tasting dinner.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#050505] border border-white/5">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C5A059] mb-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>DAY 02: Private Yacht / Guided Local Exploration</span>
                    </div>
                    <p className="text-xs text-gray-300">
                      Morning coastal cruise with captain and onboard sommelier. Explore secluded swimming grottos, followed by a private vineyard luncheon nestled among ancient hills.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#050505] border border-white/5">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C5A059] mb-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>DAY 03: Artisanal Immersion & Scenic Vistas</span>
                    </div>
                    <p className="text-xs text-gray-300">
                      Master artisan workshop or panoramic ridge hike with a local historian, followed by a sunset cocktail lounge reservation overlooking the illuminated coastline.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 sm:p-6 bg-[#050505] border-t border-white/5 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as 1 | 2)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-gray-300 hover:text-white"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step === 1 && (
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-full bg-[#C5A059] hover:bg-[#F3E5AB] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition-all"
              >
                <span>Continue to Style</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 2 && (
              <button
                type="button"
                disabled={isGenerating}
                onClick={handleGenerateItinerary}
                className="px-6 py-2.5 rounded-full bg-[#C5A059] hover:bg-[#F3E5AB] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#C5A059]/20 hover:scale-105 transition-all"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Curating Custom Route...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Custom Route</span>
                  </>
                )}
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-[#C5A059] hover:bg-[#F3E5AB] text-black font-bold text-xs uppercase tracking-wider hover:scale-105 transition-all"
              >
                Done & Save Trip
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
