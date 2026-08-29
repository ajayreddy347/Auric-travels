import React from 'react';
import { X, Heart, Trash2, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Destination } from '../types';
import { SafeImage } from './SafeImage';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedDestinations: Destination[];
  onRemove: (id: string) => void;
  onSelectDestination: (dest: Destination) => void;
  onPlanWithSaved: () => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  savedDestinations,
  onRemove,
  onSelectDestination,
  onPlanWithSaved,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl bg-white dark:bg-[#0A0A0A] border border-neutral-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl my-auto text-neutral-900 dark:text-white flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-neutral-200 dark:border-white/5 flex items-center justify-between bg-neutral-50 dark:bg-[#050505]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-500 dark:text-rose-400 flex items-center justify-center border border-rose-500/30">
                <Heart className="w-5 h-5 fill-rose-500" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-neutral-900 dark:text-white">Saved Destinations</h3>
                <p className="text-xs text-neutral-500 dark:text-gray-400 font-mono">
                  {savedDestinations.length} {savedDestinations.length === 1 ? 'place' : 'places'} in your travel wishlist
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-500 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List Content */}
          <div className="p-6 overflow-y-auto space-y-4 flex-1">
            {savedDestinations.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-3">
                <Heart className="w-12 h-12 text-neutral-300 dark:text-gray-600 mx-auto" />
                <p className="text-neutral-800 dark:text-gray-300 text-base font-semibold">Your wishlist is empty</p>
                <p className="text-neutral-500 dark:text-gray-500 text-xs max-w-sm mx-auto">
                  Click the heart icon on any destination card to bookmark sanctuaries you wish to explore.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full bg-[#C5A059] text-black font-bold text-xs uppercase hover:bg-[#F3E5AB] transition-all shadow-md"
                >
                  Explore Destinations
                </button>
              </div>
            ) : (
              savedDestinations.map((dest) => (
                <div
                  key={dest.id}
                  className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/5 hover:border-neutral-300 dark:hover:border-white/15 transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <SafeImage
                      src={dest.image}
                      alt={dest.name}
                      categoryHint={dest.category || dest.name}
                      className="w-16 h-16 rounded-xl object-cover border border-neutral-200 dark:border-white/10"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#8C6D32] dark:text-[#C5A059] font-mono font-semibold">
                        <MapPin className="w-3 h-3" />
                        <span>{dest.country}</span>
                      </div>
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white">{dest.name}</h4>
                      <p className="text-xs text-neutral-500 dark:text-gray-400 font-mono">From {dest.startingPrice}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onClose();
                        onSelectDestination(dest);
                      }}
                      className="px-4 py-2 rounded-full bg-neutral-200/80 dark:bg-white/5 hover:bg-[#C5A059] hover:text-black text-neutral-800 dark:text-gray-200 text-xs font-semibold border border-neutral-200 dark:border-white/5 transition-all"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onRemove(dest.id)}
                      className="p-2 rounded-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-400 dark:text-gray-400 hover:text-rose-500 hover:border-rose-500/40 transition-all"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {savedDestinations.length > 0 && (
            <div className="p-4 sm:p-6 bg-neutral-50 dark:bg-[#050505] border-t border-neutral-200 dark:border-white/5 flex items-center justify-between">
              <span className="text-xs text-neutral-500 dark:text-gray-400">Ready to synthesize into a journey?</span>
              <button
                onClick={() => {
                  onClose();
                  onPlanWithSaved();
                }}
                className="px-6 py-2.5 rounded-full bg-[#C5A059] hover:bg-[#F3E5AB] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#C5A059]/20 hover:scale-105 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Plan With Saved</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
