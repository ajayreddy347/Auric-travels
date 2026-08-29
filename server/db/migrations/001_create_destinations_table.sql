-- ==========================================================
-- Auric Travel: Destinations Schema & Sample Data Migration
-- ==========================================================

-- 1. Create the destinations table
CREATE TABLE IF NOT EXISTS destinations (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(255),
  country VARCHAR(255) NOT NULL,
  region VARCHAR(100) DEFAULT 'India',
  state VARCHAR(100),
  description TEXT NOT NULL,
  tagline VARCHAR(500),
  category VARCHAR(100) NOT NULL,
  additional_categories TEXT[], -- Optional category tags
  image_url TEXT NOT NULL,
  gallery_urls TEXT[],
  latitude NUMERIC(10, 6) NOT NULL,
  longitude NUMERIC(10, 6) NOT NULL,
  estimated_budget VARCHAR(100) DEFAULT '$3,500 - $6,500',
  starting_price VARCHAR(100) DEFAULT '$2,800',
  rating NUMERIC(3, 2) DEFAULT 4.9,
  reviews_count INTEGER DEFAULT 120,
  best_time_to_visit VARCHAR(255) DEFAULT 'October to March',
  average_temperature VARCHAR(100) DEFAULT '22°C - 28°C',
  vibe TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster category and region lookups
CREATE INDEX IF NOT EXISTS idx_destinations_category ON destinations(category);
CREATE INDEX IF NOT EXISTS idx_destinations_region ON destinations(region);
CREATE INDEX IF NOT EXISTS idx_destinations_country ON destinations(country);

-- 2. Insert realistic sample destinations
INSERT INTO destinations (
  id, name, city, country, region, state, description, tagline, category, additional_categories,
  image_url, gallery_urls, latitude, longitude, estimated_budget, starting_price,
  rating, reviews_count, best_time_to_visit, average_temperature, vibe
)
VALUES
(
  'hampi',
  'Hampi',
  'Hampi',
  'India',
  'India',
  'Karnataka',
  'An ethereal UNESCO World Heritage landscape of monolithic boulders, royal Vijayanagara pavilion ruins, sacred riverside ghats, and celestial sunsets over the Tungabhadra River.',
  'Monolithic stone whispers and royal ruins of the Vijayanagara Empire',
  'Heritage',
  ARRAY['Culture', 'Adventure'],
  'https://images.unsplash.com/photo-1600100397608-f010e58f334a?auto=format&fit=crop&w=1600&q=85',
  ARRAY[
    'https://images.unsplash.com/photo-1600100397608-f010e58f334a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80'
  ],
  15.3350,
  76.4600,
  '$2,400 - $4,200',
  '$2,200',
  4.95,
  342,
  'November to February',
  '20°C - 30°C',
  ARRAY['UNESCO World Heritage', 'Ancient Architecture', 'Sunset Bouldering', 'Private Coracle Rides']
),
(
  'coorg',
  'Coorg (Kodagu)',
  'Madikeri',
  'India',
  'India',
  'Karnataka',
  'The Scotland of India. Misty emerald hills, private aromatic coffee and cardamom plantations, thundering waterfalls, and heritage Kodava hospitality.',
  'Misty emerald coffee estates and fragrant cloud-forest sanctuaries',
  'Nature',
  ARRAY['Wellness', 'Food'],
  'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1600&q=85',
  ARRAY[
    'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
  ],
  12.3375,
  75.8069,
  '$3,200 - $5,500',
  '$2,800',
  4.92,
  418,
  'October to March',
  '18°C - 24°C',
  ARRAY['Private Estate Villas', 'Artisan Coffee Roasting', 'Spa Rejuvenation', 'River Escapes']
),
(
  'gokarna',
  'Gokarna & OM Beach',
  'Gokarna',
  'India',
  'India',
  'Karnataka',
  'Pristine crescent beaches sheltered by dramatic coastal cliffs, ancient Mahabaleshwar temple mysticism, and private luxury wellness havens away from the crowds.',
  'Sacred coastal headlands and secluded golden-sand crescents',
  'Beach',
  ARRAY['Wellness', 'Culture'],
  'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=85',
  ARRAY[
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80'
  ],
  14.5479,
  74.3188,
  '$2,800 - $4,800',
  '$2,400',
  4.88,
  290,
  'October to March',
  '24°C - 32°C',
  ARRAY['Cliffside Sunsets', 'Private Beach Access', 'Ayurvedic Retreats', 'Yacht Sailing']
),
(
  'santorini',
  'Santorini',
  'Oia',
  'Greece',
  'Europe',
  'Cyclades',
  'Iconic whitewashed caldera villages, cobalt Aegean seas, private catamaran charters, and world-renowned golden sunset vistas.',
  'Cobalt waters and iconic cliff-hanging whitewashed villas',
  'Beach',
  ARRAY['Heritage', 'Food'],
  'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1600&q=85',
  ARRAY[
    'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80'
  ],
  36.3932,
  25.4615,
  '$6,500 - $12,000',
  '$5,200',
  4.96,
  580,
  'April to October',
  '22°C - 29°C',
  ARRAY['Caldera Infinity Pools', 'Volcanic Wine Tasting', 'Private Catamaran', 'Helicopter Tours']
),
(
  'kyoto',
  'Kyoto',
  'Kyoto',
  'Japan',
  'Asia',
  'Kansai',
  'The cultural soul of Japan with thousands of classical Buddhist temples, serene Zen rock gardens, imperial palaces, and exclusive Kaiseki culinary masters.',
  'Millennium of imperial heritage, bamboo groves and Zen sanctuaries',
  'Culture',
  ARRAY['Heritage', 'Food'],
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=85',
  ARRAY[
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80'
  ],
  35.0116,
  135.7681,
  '$5,800 - $10,500',
  '$4,800',
  4.98,
  640,
  'March to May & Oct to Nov',
  '15°C - 23°C',
  ARRAY['Tea Ceremonies', 'Kaiseki Dining', 'Private Garden Tours', 'Ryokan Onsen']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  country = EXCLUDED.country,
  region = EXCLUDED.region,
  state = EXCLUDED.state,
  description = EXCLUDED.description,
  tagline = EXCLUDED.tagline,
  category = EXCLUDED.category,
  image_url = EXCLUDED.image_url,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  estimated_budget = EXCLUDED.estimated_budget,
  starting_price = EXCLUDED.starting_price,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  best_time_to_visit = EXCLUDED.best_time_to_visit,
  average_temperature = EXCLUDED.average_temperature,
  vibe = EXCLUDED.vibe,
  updated_at = CURRENT_TIMESTAMP;
