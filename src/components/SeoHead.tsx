import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SeoHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

const DEFAULT_TITLE = 'Auric Travels — Discover. Explore. Plan. Travel.';
const DEFAULT_DESCRIPTION =
  'Auric Travels is your luxury bespoke travel companion. Discover handpicked global destinations, explore curated experiences, and design personalized journeys.';
const DEFAULT_IMAGE = 'https://auric-travels-y948.onrender.com/og-image.png';
const BASE_URL = 'https://auric-travels-y948.onrender.com';

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
}) => {
  const formattedTitle = title
    ? title.includes('Auric Travels')
      ? title
      : `${title} | Auric Travels`
    : DEFAULT_TITLE;

  const absoluteImage = image.startsWith('http')
    ? image
    : `${BASE_URL}${image.startsWith('/') ? '' : '/'}${image}`;

  const canonicalUrl = url
    ? url.startsWith('http')
      ? url
      : `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`
    : typeof window !== 'undefined'
    ? window.location.href.split('?')[0]
    : `${BASE_URL}/`;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{formattedTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:site_name" content="Auric Travels" />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImage} />

      {/* Twitter / X Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />
    </Helmet>
  );
};
