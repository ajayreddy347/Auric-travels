import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Compass,
  Navigation,
  ExternalLink,
  Layers,
  Sparkles,
  Locate,
  Route,
  Eye,
  Star,
  X,
  Search,
  Check,
  ChevronRight,
  Plus,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Destination, SelectedPlaceLocation } from '../types';
import { DESTINATIONS } from '../data/mockData';
import { SafeImage } from './SafeImage';
import { calculateDistanceKm, computeRouteDirections, RouteDirectionsResult } from '../services/placesService';
import { storeSelectedTripLocation } from '../utils/tripGenerator';

interface GlobalMapExplorerProps {
  isOpen: boolean;
  onClose: () => void;
  destinations?: Destination[];
  onSelectDestination: (dest: Destination) => void;
  onAddToTrip?: (dest: Destination) => void;
  onPlanTrip?: (destName?: string) => void;
}

export const GlobalMapExplorer: React.FC<GlobalMapExplorerProps> = ({
  isOpen,
  onClose,
  destinations = [],
  onSelectDestination,
  onAddToTrip,
  onPlanTrip,
}) => {
  const [selectedDest, setSelectedDest] = useState<Destination>(destinations[0] || ({} as Destination));
  const [mapType, setMapType] = useState<'m' | 'k' | 'p' | 'h'>('m'); // m=roadmap, k=satellite, p=terrain, h=hybrid
  const [mapZoom, setMapZoom] = useState<number>(12);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; name?: string } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [routeInfo, setRouteInfo] = useState<RouteDirectionsResult | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [showDirectionsPanel, setShowDirectionsPanel] = useState(false);
  const [addedDestId, setAddedDestId] = useState<string | null>(null);

  // Set initial selected destination
  useEffect(() => {
    if (destinations && destinations.length > 0 && (!selectedDest || !selectedDest.id)) {
      setSelectedDest(destinations[0]);
    }
  }, [destinations, selectedDest]);

  // Request Geolocation strictly upon user click without overriding destination
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser.');
      setIsLocating(false);
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          name: 'Your Current Location'
        });
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation access denied or unavailable:', err?.message || err);
        setIsLocating(false);
        setUserLocation(null);
      },
      { timeout: 8000 }
    );
  };

  // Resolve accurate coordinates strictly for the selected destination
  const resolvedCoords =
    selectedDest?.coordinates && selectedDest.coordinates.lat !== undefined && selectedDest.coordinates.lng !== undefined
      ? selectedDest.coordinates
      : DESTINATIONS.find(
          (d) =>
            d.id.toLowerCase() === selectedDest?.id?.toLowerCase() ||
            d.name.toLowerCase() === selectedDest?.name?.toLowerCase()
        )?.coordinates;

  const activeLat = resolvedCoords?.lat;
  const activeLng = resolvedCoords?.lng;

  // Calculate route when user location changes or destination changes
  useEffect(() => {
    if (userLocation && activeLat !== undefined && activeLng !== undefined) {
      setIsCalculatingRoute(true);
      computeRouteDirections(
        { lat: userLocation.lat, lng: userLocation.lng },
        { lat: activeLat, lng: activeLng }
      )
        .then((res) => setRouteInfo(res))
        .finally(() => setIsCalculatingRoute(false));
    }
  }, [userLocation, activeLat, activeLng]);

  if (!isOpen) return null;

  const filteredDestinations = destinations.filter((d) => {
    const matchesCat = selectedCategory === 'All' || d.category.toLowerCase() === selectedCategory.toLowerCase() || d.additionalCategories?.some(c => c.toLowerCase() === selectedCategory.toLowerCase());
    const q = searchQuery.toLowerCase().trim();
    const isWildlife = (q.includes('wildlife') || q.includes('safari')) && (d.category === 'Nature' || d.category === 'Adventure' || d.id === 'serengeti' || d.id === 'kabini');
    const isBeach = (q.includes('beach') || q.includes('coast') || q.includes('island')) && (d.category === 'Beach' || d.additionalCategories?.includes('Beach'));
    const matchesQuery =
      !q ||
      d.name.toLowerCase().includes(q) ||
      d.country.toLowerCase().includes(q) ||
      (d.city && d.city.toLowerCase().includes(q)) ||
      (d.state && d.state.toLowerCase().includes(q)) ||
      d.region.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q) ||
      d.vibe?.some(v => v.toLowerCase().includes(q)) ||
      isWildlife ||
      isBeach;
    return matchesCat && matchesQuery;
  });

  // Google Maps interactive embed URL strictly tied to the selected destination
  const embedUrl =
    activeLat !== undefined && activeLng !== undefined
      ? `https://maps.google.com/maps?q=${activeLat},${activeLng}+(${encodeURIComponent(selectedDest?.name || 'Sanctuary')})&t=${mapType}&z=${mapZoom}&output=embed`
      : `https://maps.google.com/maps?q=${encodeURIComponent((selectedDest?.name || 'Sanctuary') + ' ' + (selectedDest?.formattedAddress || selectedDest?.country || ''))}&t=${mapType}&z=${mapZoom}&output=embed`;

  const streetViewUrl =
    activeLat !== undefined && activeLng !== undefined
      ? `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${activeLat},${activeLng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((selectedDest?.name || 'Sanctuary') + ' ' + (selectedDest?.formattedAddress || selectedDest?.country || ''))}`;

  const directionsUrl =
    userLocation && activeLat !== undefined && activeLng !== undefined
      ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${activeLat},${activeLng}&travelmode=driving`
      : selectedDest?.googleMapsUri ||
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((selectedDest?.name || 'Sanctuary') + ' ' + (selectedDest?.formattedAddress || selectedDest?.country || ''))}`;

  const categories = ['All', 'Heritage', 'Beach', 'Nature', 'Wellness', 'Food', 'Adventure'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-7xl h-[94vh] bg-[#0A0A0A] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Top Navigation Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#080808] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059] font-bold">
                  Google Maps Platform
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-white">
                Interactive World Sanctuary Explorer
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="locate-user-btn"
              onClick={handleLocateUser}
              disabled={isLocating}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-200 transition-colors"
              title="Use current GPS location"
            >
              <Locate className={`w-3.5 h-3.5 text-[#C5A059] ${isLocating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                {userLocation ? 'GPS Calibrated' : 'Locate Me'}
              </span>
            </button>

            <button
              id="close-global-map-btn"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Grid: Sidebar List + Map View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0 overflow-hidden">
          {/* Left Sidebar: Destinations & Filter */}
          <div className="lg:col-span-4 border-r border-white/10 flex flex-col bg-[#0D0D0D] overflow-hidden">
            {/* Search and Category Filter Bar */}
            <div className="p-4 border-b border-white/10 space-y-3 bg-[#0A0A0A]">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by city, country or vibe..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141414] border border-white/10 focus:border-[#C5A059] text-xs text-white placeholder:text-gray-500 outline-none transition-all"
                />
              </div>

              {/* Category Pills */}
              <div className="flex gap-1.5 overflow-x-auto custom-scrollbar pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-[#C5A059] text-black font-semibold'
                        : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Destinations List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
              {filteredDestinations.map((dest) => {
                const isSelected = selectedDest?.id === dest.id;
                const distanceKm = userLocation && dest.coordinates
                  ? calculateDistanceKm(userLocation.lat, userLocation.lng, dest.coordinates.lat, dest.coordinates.lng)
                  : null;

                return (
                  <div
                    key={dest.id}
                    id={`map-sidebar-dest-${dest.id}`}
                    onClick={() => {
                      setSelectedDest(dest);
                      setMapZoom(13);
                    }}
                    className={`p-3 rounded-2xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-[#C5A059]/15 border-[#C5A059] shadow-lg shadow-[#C5A059]/10'
                        : 'bg-[#121212] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 relative bg-neutral-800">
                        <SafeImage
                          src={dest.image}
                          alt={dest.name}
                          categoryHint={dest.category}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[9px] font-mono text-[#F3E5AB]">
                          {dest.category}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-white truncate">
                            {dest.name}
                          </h4>
                          <span className="text-xs font-bold text-[#C5A059]">
                            {dest.startingPrice}
                          </span>
                        </div>

                        <p className="text-[11px] text-gray-400 truncate mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#C5A059] shrink-0" />
                          {dest.formattedAddress || `${dest.name}, ${dest.country}`}
                        </p>

                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/5">
                          <div className="flex items-center gap-1 text-[10px] text-amber-400">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{dest.rating || '4.9'}</span>
                          </div>

                          {distanceKm !== null && (
                            <span className="text-[10px] text-gray-400 font-mono">
                              {distanceKm.toLocaleString()} km away
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredDestinations.length === 0 && (
                <div className="p-8 text-center text-gray-500 text-xs">
                  No sanctuaries match the filter.
                </div>
              )}
            </div>

            {/* User GPS Hub indicator */}
            {userLocation && (
              <div className="p-3 bg-[#0A0A0A] border-t border-white/10 text-[11px] text-gray-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5 truncate">
                  <Locate className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{userLocation.name || 'Current GPS Coordinate'}</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">Active</span>
              </div>
            )}
          </div>

          {/* Right Main Map Container */}
          <div className="lg:col-span-8 relative flex flex-col bg-neutral-950 min-h-[420px]">
            {/* Map Controls Bar */}
            <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              {/* Active Target Banner */}
              <div className="pointer-events-auto bg-[#0A0A0A]/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 shadow-xl flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#C5A059] animate-ping" />
                <div>
                  <div className="text-[10px] font-mono uppercase text-[#C5A059] font-bold">
                    Active Coordinates
                  </div>
                  <div className="text-xs font-semibold text-white truncate max-w-[200px] sm:max-w-xs">
                    {selectedDest?.name} ({activeLat.toFixed(4)}, {activeLng.toFixed(4)})
                  </div>
                </div>
              </div>

              {/* Map Layer Controls */}
              <div className="pointer-events-auto flex items-center gap-1.5 bg-[#0A0A0A]/90 backdrop-blur-md p-1 rounded-2xl border border-white/15 shadow-xl">
                <button
                  id="map-type-roadmap-btn"
                  onClick={() => setMapType('m')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    mapType === 'm' ? 'bg-[#C5A059] text-black font-semibold' : 'text-gray-300 hover:text-white'
                  }`}
                  title="Standard Roadmap"
                >
                  Map
                </button>
                <button
                  id="map-type-satellite-btn"
                  onClick={() => setMapType('k')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    mapType === 'k' ? 'bg-[#C5A059] text-black font-semibold' : 'text-gray-300 hover:text-white'
                  }`}
                  title="Satellite Imagery"
                >
                  Satellite
                </button>
                <button
                  id="map-type-terrain-btn"
                  onClick={() => setMapType('p')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    mapType === 'p' ? 'bg-[#C5A059] text-black font-semibold' : 'text-gray-300 hover:text-white'
                  }`}
                  title="Topographic Terrain"
                >
                  Terrain
                </button>
              </div>
            </div>

            {/* Embedded Interactive Google Map */}
            <div className="relative flex-1 w-full h-full bg-neutral-900">
              <iframe
                id="global-google-maps-frame"
                title={`Google Map of ${selectedDest?.name || 'Sanctuary'}`}
                src={embedUrl}
                className="w-full h-full min-h-[400px] border-0"
                loading="lazy"
                allowFullScreen
              />

              {/* Zoom & Navigation Floating Controls */}
              <div className="absolute bottom-28 right-4 z-20 flex flex-col gap-2">
                <button
                  id="global-map-zoom-in"
                  onClick={() => setMapZoom((prev) => Math.min(prev + 1, 19))}
                  className="w-10 h-10 rounded-2xl bg-[#0A0A0A]/90 hover:bg-[#C5A059] text-white hover:text-black border border-white/20 font-bold text-lg flex items-center justify-center backdrop-blur-md shadow-xl transition-all"
                  title="Zoom In"
                >
                  +
                </button>
                <button
                  id="global-map-zoom-out"
                  onClick={() => setMapZoom((prev) => Math.max(prev - 1, 3))}
                  className="w-10 h-10 rounded-2xl bg-[#0A0A0A]/90 hover:bg-[#C5A059] text-white hover:text-black border border-white/20 font-bold text-lg flex items-center justify-center backdrop-blur-md shadow-xl transition-all"
                  title="Zoom Out"
                >
                  -
                </button>
              </div>
            </div>

            {/* Bottom Sanctuary Action Bar */}
            {selectedDest && (
              <div className="p-4 sm:p-5 border-t border-white/10 bg-[#080808]/95 backdrop-blur-md shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 hidden sm:block border border-[#C5A059]/30">
                    <SafeImage
                      src={selectedDest.image}
                      alt={selectedDest.name}
                      categoryHint={selectedDest.category}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                      {selectedDest.name}
                      <span className="text-xs font-sans font-normal text-gray-400">
                        ({selectedDest.country})
                      </span>
                    </h3>
                    <p className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                      <span>{selectedDest.category} Sanctuary</span>
                      <span>•</span>
                      <span className="text-[#C5A059] font-bold">{selectedDest.startingPrice}</span>
                      {routeInfo && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-400 font-mono">
                            {routeInfo.distanceKm} km ({routeInfo.durationString})
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    id="map-streetview-btn"
                    href={streetViewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-200 flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>360° Street View</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>

                  <a
                    id="map-directions-btn"
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-200 flex items-center gap-1.5 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Directions</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>

                  <button
                    id="map-select-detail-btn"
                    onClick={() => {
                      onSelectDestination(selectedDest);
                      onClose();
                    }}
                    className="px-4 py-2 rounded-xl bg-[#C5A059] hover:bg-[#F3E5AB] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-[#C5A059]/20 transition-colors"
                  >
                    <span>View Sanctuary</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    id="map-add-trip-btn"
                    onClick={() => {
                      if (selectedDest.coordinates) {
                        storeSelectedTripLocation({
                          name: selectedDest.name,
                          city: selectedDest.city || selectedDest.name,
                          state: selectedDest.state,
                          country: selectedDest.country,
                          region: selectedDest.region,
                          coordinates: selectedDest.coordinates,
                          formattedAddress: selectedDest.formattedAddress || `${selectedDest.name}, ${selectedDest.country}`,
                          placeId: selectedDest.googlePlaceId,
                          image: selectedDest.cinematicImage || selectedDest.image,
                        });
                      }
                      if (onAddToTrip) {
                        onAddToTrip(selectedDest);
                      } else if (onPlanTrip) {
                        onPlanTrip(selectedDest.name);
                      }
                      setAddedDestId(selectedDest.id);
                      setTimeout(() => setAddedDestId(null), 2500);
                    }}
                    className="px-3.5 py-2 rounded-xl border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-black font-semibold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    {addedDestId === selectedDest.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Trip</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
