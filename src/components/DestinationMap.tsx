import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Compass, Star, ExternalLink, Sparkles, Layers, RefreshCw } from 'lucide-react';
import { Destination } from '../types';
import { DESTINATIONS } from '../data/mockData';
import { fetchNearbyAttractions, NearbyAttraction } from '../services/placesService';
import { SafeImage } from './SafeImage';

interface DestinationMapProps {
  destination: Destination;
}

export const DestinationMap: React.FC<DestinationMapProps> = ({ destination }) => {
  const [nearbyAttractions, setNearbyAttractions] = useState<NearbyAttraction[]>([]);
  const [selectedAttraction, setSelectedAttraction] = useState<NearbyAttraction | null>(null);
  const [isLoadingNearby, setIsLoadingNearby] = useState(false);
  const [mapZoom, setMapZoom] = useState(13);
  const [mapType, setMapType] = useState<'m' | 'k' | 'p'>('m'); // m=roadmap, k=satellite, p=terrain

  // Resolve accurate coordinates strictly for the selected destination
  const resolvedCoords =
    destination.coordinates && destination.coordinates.lat !== undefined && destination.coordinates.lng !== undefined
      ? destination.coordinates
      : DESTINATIONS.find(
          (d) =>
            d.id.toLowerCase() === destination.id?.toLowerCase() ||
            d.name.toLowerCase() === destination.name?.toLowerCase()
        )?.coordinates;

  const lat = resolvedCoords?.lat;
  const lng = resolvedCoords?.lng;

  // Immediately clear stale attraction and reset zoom whenever destination changes
  useEffect(() => {
    setSelectedAttraction(null);
    setNearbyAttractions([]);
    setMapZoom(13);
  }, [destination.id, destination.name, lat, lng]);

  useEffect(() => {
    if (lat === undefined || lng === undefined) return;

    let isMounted = true;
    async function loadNearby() {
      setIsLoadingNearby(true);
      try {
        const places = await fetchNearbyAttractions(lat!, lng!, 15000);
        if (isMounted) {
          setNearbyAttractions(places);
        }
      } catch (err) {
        console.warn('Failed to load nearby places for map:', err);
      } finally {
        if (isMounted) {
          setIsLoadingNearby(false);
        }
      }
    }

    loadNearby();
    return () => {
      isMounted = false;
    };
  }, [lat, lng, destination.id]);

  const activeLat = selectedAttraction ? selectedAttraction.location.lat : lat;
  const activeLng = selectedAttraction ? selectedAttraction.location.lng : lng;
  const activeName = selectedAttraction ? selectedAttraction.name : destination.name;

  // Generate interactive embedded map URL strictly centered on the selected destination/attraction
  const embedMapUrl =
    activeLat !== undefined && activeLng !== undefined
      ? `https://maps.google.com/maps?q=${activeLat},${activeLng}+(${encodeURIComponent(activeName)})&t=${mapType}&z=${mapZoom}&output=embed`
      : `https://maps.google.com/maps?q=${encodeURIComponent(destination.name + ' ' + (destination.formattedAddress || destination.country))}&t=${mapType}&z=${mapZoom}&output=embed`;

  const streetViewUrl =
    activeLat !== undefined && activeLng !== undefined
      ? `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${activeLat},${activeLng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination.name + ' ' + (destination.formattedAddress || destination.country))}`;

  const googleMapsDirectionsUrl =
    destination.googleMapsUri ||
    (activeLat !== undefined && activeLng !== undefined
      ? `https://www.google.com/maps/search/?api=1&query=${activeLat},${activeLng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination.name + ' ' + (destination.formattedAddress || destination.country))}`);

  return (
    <div id="destination-map-container" className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
      {/* Header Bar */}
      <div className="p-6 md:p-8 border-b border-stone-200 dark:border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" />
            Google Maps Platform Integration
          </div>
          <h3 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Explore {destination.name} & Surroundings
          </h3>
          <p className="text-stone-600 dark:text-stone-400 text-sm mt-1 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
            {destination.formattedAddress || `${destination.name}, ${destination.country}`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            id="open-street-view-btn"
            href={streetViewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 font-medium text-xs transition-colors border border-stone-300 dark:border-stone-700"
          >
            <Compass className="w-3.5 h-3.5 text-amber-500" />
            360° Street View
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          <a
            id="open-google-maps-btn"
            href={googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-medium text-xs transition-colors shadow-sm"
          >
            <Navigation className="w-3.5 h-3.5" />
            Get Directions
            <ExternalLink className="w-3 h-3 opacity-75" />
          </a>
        </div>
      </div>

      {/* Grid: Map + Nearby Places Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
        {/* Main Map View */}
        <div className="lg:col-span-8 relative bg-stone-100 dark:bg-stone-950 min-h-[400px] lg:min-h-[500px]">
          <iframe
            id="google-maps-embed-frame"
            title={`Map of ${destination.name}`}
            src={embedMapUrl}
            className="w-full h-full min-h-[400px] lg:min-h-[500px] border-0"
            loading="lazy"
            allowFullScreen
          />

          {/* Map Overlay Controls */}
          <div className="absolute top-4 left-4 z-10 bg-stone-900/85 backdrop-blur-md text-stone-100 px-3.5 py-2 rounded-xl text-xs font-medium border border-stone-700/50 shadow-lg flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Target: {activeName}</span>
          </div>

          {/* Layer Selector */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-stone-900/85 backdrop-blur-md p-1 rounded-xl border border-stone-700/50 shadow-lg">
            <button
              onClick={() => setMapType('m')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                mapType === 'm' ? 'bg-amber-500 text-stone-950 font-semibold' : 'text-stone-300 hover:text-white'
              }`}
            >
              Map
            </button>
            <button
              onClick={() => setMapType('k')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                mapType === 'k' ? 'bg-amber-500 text-stone-950 font-semibold' : 'text-stone-300 hover:text-white'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setMapType('p')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                mapType === 'p' ? 'bg-amber-500 text-stone-950 font-semibold' : 'text-stone-300 hover:text-white'
              }`}
            >
              Terrain
            </button>
          </div>

          <div className="absolute bottom-4 right-4 z-10 flex gap-2">
            <button
              id="zoom-in-btn"
              onClick={() => setMapZoom(prev => Math.min(prev + 1, 18))}
              className="w-9 h-9 rounded-xl bg-white/90 dark:bg-stone-900/90 backdrop-blur-md text-stone-800 dark:text-stone-200 hover:bg-amber-500 hover:text-stone-950 font-bold text-lg flex items-center justify-center shadow-md border border-stone-200 dark:border-stone-700 transition-colors"
              title="Zoom In"
            >
              +
            </button>
            <button
              id="zoom-out-btn"
              onClick={() => setMapZoom(prev => Math.max(prev - 1, 9))}
              className="w-9 h-9 rounded-xl bg-white/90 dark:bg-stone-900/90 backdrop-blur-md text-stone-800 dark:text-stone-200 hover:bg-amber-500 hover:text-stone-950 font-bold text-lg flex items-center justify-center shadow-md border border-stone-200 dark:border-stone-700 transition-colors"
              title="Zoom Out"
            >
              -
            </button>
            <button
              id="recenter-map-btn"
              onClick={() => {
                setSelectedAttraction(null);
                setMapZoom(13);
              }}
              className="px-3 h-9 rounded-xl bg-white/90 dark:bg-stone-900/90 backdrop-blur-md text-stone-800 dark:text-stone-200 hover:bg-amber-500 hover:text-stone-950 font-medium text-xs flex items-center gap-1.5 shadow-md border border-stone-200 dark:border-stone-700 transition-colors"
              title="Recenter Map"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Recenter
            </button>
          </div>
        </div>

        {/* Nearby Points of Interest Panel */}
        <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-stone-200 dark:border-stone-800 p-5 bg-stone-50/50 dark:bg-stone-900/50 flex flex-col justify-between max-h-[500px] overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-500" />
              Nearby Points of Interest
            </h4>
            <span className="text-xs text-stone-600 dark:text-stone-400">
              {nearbyAttractions.length > 0 ? `${nearbyAttractions.length} discovered` : 'Curated sights'}
            </span>
          </div>

          <div className="space-y-2.5 overflow-y-auto pr-1 flex-1 custom-scrollbar">
            {/* Primary Destination Pin */}
            <div
              id="pin-primary-destination"
              onClick={() => setSelectedAttraction(null)}
              className={`p-3 rounded-2xl cursor-pointer transition-all border ${
                selectedAttraction === null
                  ? 'bg-amber-500/10 border-amber-500/40 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'bg-white dark:bg-stone-800/80 border-stone-200 dark:border-stone-700/60 hover:border-amber-500/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
                  <SafeImage
                    src={destination.image}
                    alt={destination.name}
                    categoryHint={destination.category}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-xs text-stone-900 dark:text-stone-100 truncate">
                      {destination.name}
                    </p>
                    <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                      Main
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400 truncate mt-0.5">
                    {destination.category} • {destination.startingPrice}
                  </p>
                </div>
              </div>
            </div>

            {/* Nearby attractions fetched from Places API */}
            {isLoadingNearby ? (
              <div className="py-8 text-center text-stone-600 dark:text-stone-400 text-xs flex flex-col items-center gap-2">
                <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <span>Scanning Google Places nearby...</span>
              </div>
            ) : nearbyAttractions.length > 0 ? (
              nearbyAttractions.map((place) => {
                const isSelected = selectedAttraction?.id === place.id;
                return (
                  <div
                    key={place.id}
                    id={`nearby-place-${place.id}`}
                    onClick={() => {
                      setSelectedAttraction(place);
                      setMapZoom(15);
                    }}
                    className={`p-3 rounded-2xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/40 shadow-sm'
                        : 'bg-white dark:bg-stone-800/80 border-stone-200 dark:border-stone-700/60 hover:border-amber-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-stone-200 dark:bg-stone-700">
                        <SafeImage
                          src={place.photoUrl || destination.image}
                          alt={place.name}
                          categoryHint={place.types[0] || destination.category}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-xs text-stone-900 dark:text-stone-100 truncate">
                            {place.name}
                          </p>
                          {place.distanceKm !== undefined && (
                            <span className="text-[10px] text-stone-600 dark:text-stone-400">
                              {place.distanceKm} km
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {place.rating && (
                            <span className="flex items-center gap-0.5 text-[11px] font-medium text-amber-500">
                              <Star className="w-3 h-3 fill-amber-500" />
                              {place.rating}
                            </span>
                          )}
                          <span className="text-[11px] text-stone-600 dark:text-stone-400 truncate">
                            {place.types[0]?.replace(/_/g, ' ') || 'Point of Interest'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              // Fallback attractions from destination's own topAttractions
              destination.topAttractions.map((attr, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/60"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
                      <SafeImage
                        src={attr.image || destination.image}
                        alt={attr.name}
                        categoryHint={attr.tag}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs text-stone-900 dark:text-stone-100 truncate">
                        {attr.name}
                      </p>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400 line-clamp-1 mt-0.5">
                        {attr.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-600 dark:text-stone-400">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Places API (New) Real-Time Grounding
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
