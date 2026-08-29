import React, { useState, useEffect } from 'react';

// Curated high-resolution, rock-solid fallback images matching travel themes
export const FALLBACK_IMAGES: Record<string, string> = {
  nature: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  culture: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
  heritage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
  beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  coastal: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
  adventure: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&w=1200&q=80',
  safari: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
  wildlife: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80',
  food: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
  dining: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80',
  luxury: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
  mountain: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
  bengaluru: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
  chikmagalur: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
  coorg: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=80',
  hampi: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
  mysore: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
  kabini: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80',
  gokarna: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
  udaipur: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
  kerala: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
  ladakh: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
  kyoto: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
  amalfi: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
  jaipur: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=80',
  munnar: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
  swiss: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
  serengeti: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
  santorini: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
  bali: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
  general: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
};

/**
 * Returns an appropriate high-quality fallback image URL based on category or keyword clues.
 */
export function getFallbackImage(hint?: string): string {
  if (!hint) return FALLBACK_IMAGES.general;
  const lower = hint.toLowerCase();

  if (lower.includes('bengaluru') || lower.includes('bangalore') || lower.includes('garden city') || lower.includes('lalbagh')) {
    return FALLBACK_IMAGES.bengaluru;
  }
  if (lower.includes('jaipur') || lower.includes('hawa mahal') || lower.includes('amber fort') || lower.includes('pink city') || lower.includes('jal mahal')) {
    return FALLBACK_IMAGES.jaipur;
  }
  if (lower.includes('munnar') || lower.includes('tea estate') || lower.includes('anamudi') || lower.includes('devikulam')) {
    return FALLBACK_IMAGES.munnar;
  }
  if (lower.includes('chikmagalur') || lower.includes('coffee') || lower.includes('mullayanagiri')) {
    return FALLBACK_IMAGES.chikmagalur;
  }
  if (lower.includes('coorg') || lower.includes('kodagu') || lower.includes('madikeri')) {
    return FALLBACK_IMAGES.coorg;
  }
  if (lower.includes('hampi') || lower.includes('virupaksha') || lower.includes('vijayanagara') || lower.includes('stone chariot')) {
    return FALLBACK_IMAGES.hampi;
  }
  if (lower.includes('mysore') || lower.includes('mysuru') || lower.includes('chamundi') || lower.includes('srirangapatna')) {
    return FALLBACK_IMAGES.mysore;
  }
  if (lower.includes('kabini') || lower.includes('nagarhole') || lower.includes('safari') || lower.includes('wildlife') || lower.includes('tiger')) {
    return FALLBACK_IMAGES.kabini;
  }
  if (lower.includes('gokarna') || lower.includes('om beach') || lower.includes('kudle')) {
    return FALLBACK_IMAGES.gokarna;
  }
  if (lower.includes('udaipur') || lower.includes('rajasthan') || lower.includes('pichola') || lower.includes('palace')) {
    return FALLBACK_IMAGES.udaipur;
  }
  if (lower.includes('kerala') || lower.includes('alleppey') || lower.includes('backwater') || lower.includes('houseboat')) {
    return FALLBACK_IMAGES.kerala;
  }
  if (lower.includes('ladakh') || lower.includes('leh') || lower.includes('pangong') || lower.includes('monastery') || lower.includes('himalaya')) {
    return FALLBACK_IMAGES.ladakh;
  }
  if (lower.includes('kyoto') || lower.includes('japan') || lower.includes('zen') || lower.includes('bamboo') || lower.includes('shrine')) {
    return FALLBACK_IMAGES.kyoto;
  }
  if (lower.includes('amalfi') || lower.includes('positano') || lower.includes('italy') || lower.includes('capri')) {
    return FALLBACK_IMAGES.amalfi;
  }
  if (lower.includes('swiss') || lower.includes('zermatt') || lower.includes('matterhorn') || lower.includes('alps') || lower.includes('glacier')) {
    return FALLBACK_IMAGES.swiss;
  }
  if (lower.includes('serengeti') || lower.includes('tanzania') || lower.includes('migration') || lower.includes('ngorongoro')) {
    return FALLBACK_IMAGES.serengeti;
  }
  if (lower.includes('santorini') || lower.includes('greece') || lower.includes('caldera') || lower.includes('oia')) {
    return FALLBACK_IMAGES.santorini;
  }
  if (lower.includes('bali') || lower.includes('ubud') || lower.includes('indonesia') || lower.includes('tegallalang')) {
    return FALLBACK_IMAGES.bali;
  }
  if (lower.includes('beach') || lower.includes('ocean') || lower.includes('coast') || lower.includes('sea') || lower.includes('bay')) {
    return FALLBACK_IMAGES.beach;
  }
  if (lower.includes('food') || lower.includes('dining') || lower.includes('chef') || lower.includes('tasting') || lower.includes('culinary') || lower.includes('wine') || lower.includes('kaapi')) {
    return FALLBACK_IMAGES.food;
  }
  if (lower.includes('culture') || lower.includes('heritage') || lower.includes('history') || lower.includes('temple') || lower.includes('monument')) {
    return FALLBACK_IMAGES.culture;
  }
  if (lower.includes('nature') || lower.includes('park') || lower.includes('forest') || lower.includes('botanical') || lower.includes('hill') || lower.includes('valley')) {
    return FALLBACK_IMAGES.nature;
  }
  if (lower.includes('adventure') || lower.includes('trek') || lower.includes('hike') || lower.includes('kayak') || lower.includes('rafting') || lower.includes('4x4')) {
    return FALLBACK_IMAGES.adventure;
  }

  return FALLBACK_IMAGES.general;
}

export interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  categoryHint?: string;
  containerClassName?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  categoryHint,
  className = '',
  containerClassName = '',
  loading = 'lazy',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const fallbackUrl = getFallbackImage(categoryHint || alt);
  const effectiveSrc = !src || src.trim() === '' || hasError ? fallbackUrl : src;

  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <img
      src={effectiveSrc}
      alt={alt || 'Travel experience preview'}
      onError={handleError}
      onLoad={handleLoad}
      loading={loading}
      referrerPolicy="no-referrer"
      className={`${className} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-90'}`}
      {...props}
    />
  );
};
