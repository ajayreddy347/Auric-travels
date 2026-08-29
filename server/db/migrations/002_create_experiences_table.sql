-- ==========================================================
-- Auric Travel: Experiences Schema & Sample Data Migration
-- ==========================================================

-- 1. Create the experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  destination_id VARCHAR(100),
  category VARCHAR(100) NOT NULL,
  image_url TEXT NOT NULL,
  gallery_urls TEXT[],
  location VARCHAR(255),
  duration VARCHAR(100) NOT NULL,
  price VARCHAR(100) NOT NULL,
  rating NUMERIC(3, 2) DEFAULT 4.95,
  reviews_count INTEGER DEFAULT 120,
  latitude NUMERIC(10, 6),
  longitude NUMERIC(10, 6),
  highlights TEXT[],
  included TEXT[],
  best_time VARCHAR(100),
  group_type VARCHAR(100),
  physical_level VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Foreign key check (if destinations table exists, add foreign key constraint safely)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_experiences_destination'
  ) THEN
    ALTER TABLE experiences
    ADD CONSTRAINT fk_experiences_destination
    FOREIGN KEY (destination_id) REFERENCES destinations(id)
    ON DELETE SET NULL;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Skipping FK creation or destinations table not yet present';
END $$;

-- Indexes for high-performance filtering & joins
CREATE INDEX IF NOT EXISTS idx_experiences_destination_id ON experiences(destination_id);
CREATE INDEX IF NOT EXISTS idx_experiences_category ON experiences(category);
CREATE INDEX IF NOT EXISTS idx_experiences_rating ON experiences(rating);

-- 2. Insert realistic sample experiences linked to destinations
INSERT INTO experiences (
  id, title, description, short_description, destination_id, category,
  image_url, gallery_urls, location, duration, price, rating, reviews_count,
  latitude, longitude, highlights, included, best_time, group_type, physical_level
)
VALUES
(
  'hampi-coracle-sunset-drift',
  'Tungabhadra Sacred Coracle & Bouldering Sunset Glide',
  'Glide in handcrafted traditional round wicker coracles across gentle rapids of the sacred Tungabhadra River, navigating ancient granite boulder gorges below Virupaksha Temple. Disembark on secluded riverside ruins for a guided sunset meditation and artisanal local herbal infusions.',
  'Navigate surreal granite river canyons in a traditional wicker boat as evening temple bells echo across Hampi.',
  'hampi',
  'Adventure',
  'https://images.unsplash.com/photo-1600100397608-f010e58f334a?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1600100397608-f010e58f334a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80'
  ],
  'Tungabhadra River, Hampi, Karnataka, India',
  '3 Hours (Late Afternoon)',
  '₹4,500 ($55)',
  4.98,
  248,
  15.3350,
  76.4600,
  ARRAY[
    'Private wooden coracle boat with certified riverside boatman',
    'Sunset vantage point atop Hemakuta Hill boulders',
    'Archaeological insights from a licensed Vijayanagara historian',
    'Artisanal herbal tea and traditional jaggery snacks'
  ],
  ARRAY[
    'Safety gear & premium life vests',
    'Private boatman and historian guide',
    'Refreshments & organic herbal infusion',
    'Tungabhadra conservation pass'
  ],
  'October to March',
  'Private (Up to 4 guests)',
  'Gentle'
),
(
  'coorg-artisan-coffee-roast',
  'Private Cloud-Forest Estate Coffee Masterclass & Cupping',
  'Walk through a 150-year-old family-owned shade-grown Arabica and Robusta estate nested beneath the Western Ghats canopy. Harvest ripe cherries, learn roasting chemistry in a copper drum roaster, and indulge in a sensory cupping session paired with handmade spiced bean-to-bar chocolates.',
  'Immerse in lush coffee blossoms, artisanal roasting techniques, and private estate tasting in Kodagu.',
  'coorg',
  'Food',
  'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80'
  ],
  'Madikeri, Coorg, Karnataka, India',
  '3.5 Hours (Morning)',
  '₹3,800 ($46)',
  4.95,
  182,
  12.3375,
  75.8069,
  ARRAY[
    'Guided walk through heritage biodiversity coffee plantation',
    'Interactive micro-roasting with master Q-grader',
    'Sensory tasting of 5 single-origin specialty coffees',
    'Custom monogrammed bag of freshly roasted estate beans'
  ],
  ARRAY[
    'Estate access & master roaster session',
    'Cupping flight & chocolate pairing',
    'Freshly roasted souvenir coffee pouch',
    'Traditional Kodava plantation refreshments'
  ],
  'November to March',
  'Small Group (Max 6)',
  'Gentle'
),
(
  'gokarna-cliff-wellness-yoga',
  'Om Beach Cliffside Sunset Yoga & Sound Therapy Sanctuary',
  'Ascend a tranquil coastal promontory above Om Beach as golden light bathes the Arabian Sea. Experience a gentle Hatha and restorative sound bath session led by senior yoga masters, accompanied by Himalayan singing bowls, ocean breezes, and organic Ayurvedic herbal tonics.',
  'Realign mind and body over sweeping Arabian Sea cliff views with Tibetan sound bowls and gentle yoga.',
  'gokarna',
  'Wellness',
  'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80'
  ],
  'Om Beach Headland, Gokarna, Karnataka, India',
  '2.5 Hours (Sunset)',
  '₹3,200 ($39)',
  4.96,
  165,
  14.5479,
  74.3188,
  ARRAY[
    'Private coastal yoga deck overlooking Om Beach crescent',
    'Tibetan bronze singing bowl resonance meditation',
    'Post-session Ayurvedic cooling elixir and fresh coconut',
    'Personalized breathwork and mindfulness routine'
  ],
  ARRAY[
    'Organic yoga mats and meditation cushions',
    'Certified master yogi instructor',
    'Sound bath therapy session',
    'Ayurvedic wellness refreshments'
  ],
  'October to April',
  'Private or Couple',
  'Gentle'
),
(
  'santorini-private-caldera-catamaran',
  'Exclusive Santorini Caldera & Volcanic Hot Springs Catamaran',
  'Board a luxury 50ft sailing catamaran from Ammoudi Bay for an exclusive navigation of the volcanic caldera. Swim in the therapeutic mineral hot springs of Palea Kameni, snorkel in crystal waters of Red Beach, and savor a chef-prepared Mediterranean seafood barbecue as the sun sinks over Oia.',
  'Sail the cobalt Aegean caldera, swim warm volcanic springs, and enjoy gourmet Greek dining at sunset.',
  'santorini',
  'Adventure',
  'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80'
  ],
  'Ammoudi Bay, Oia, Santorini, Greece',
  '5 Hours (Sunset)',
  '€180 ($195)',
  4.99,
  310,
  36.3932,
  25.4615,
  ARRAY[
    'Private luxury catamaran charter with seasoned skipper',
    'Swim stop in sulfur volcanic hot springs & Red Beach',
    'Freshly grilled Greek seafood and steak barbecue on board',
    'Open bar with Santorini Assyrtiko wine and cocktails'
  ],
  ARRAY[
    'Hotel pickup & drop-off in luxury van',
    'Full snorkeling equipment & towels',
    'Gourmet barbecue lunch / dinner',
    'Unlimited Greek wines and soft beverages'
  ],
  'May to October',
  'Small Group (Max 12)',
  'Moderate'
),
(
  'kyoto-private-tea-zen-garden',
  '17th-Century Zen Temple Private Tea Ceremony & Garden Walk',
  'Gain rare private entry to a centuries-old sub-temple of Daitoku-ji, closed to the general public. Meet a master of the Urasenke tea tradition for an authentic Chado ceremony in a tatami teahouse, followed by an introspective stroll through a tranquil dry-landscape karesansui moss garden.',
  'Experience authentic Japanese harmony, respect, and tranquility inside an exclusive private Zen temple.',
  'kyoto',
  'Culture',
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80'
  ],
  'Daitoku-ji Temple Quarter, Kyoto, Japan',
  '2.5 Hours',
  '¥18,000 ($120)',
  4.97,
  215,
  35.0116,
  135.7681,
  ARRAY[
    'Exclusive after-hours temple access with resident priest',
    'Authentic Urasenke matcha preparation with seasonal wagashi sweets',
    'Guided appreciation of traditional sukiya teahouse architecture',
    'Contemplative private walk through historic rock and moss garden'
  ],
  ARRAY[
    'Temple preservation admission',
    'Certified English-speaking tea master',
    'High-grade Uji ceremonial matcha & handcrafted sweets',
    'Commemorative Japanese calligraphy keepsake'
  ],
  'Year-round (Best Spring & Autumn)',
  'Private (Up to 6 guests)',
  'Meditative'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  destination_id = EXCLUDED.destination_id,
  category = EXCLUDED.category,
  image_url = EXCLUDED.image_url,
  gallery_urls = EXCLUDED.gallery_urls,
  location = EXCLUDED.location,
  duration = EXCLUDED.duration,
  price = EXCLUDED.price,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  best_time = EXCLUDED.best_time,
  group_type = EXCLUDED.group_type,
  physical_level = EXCLUDED.physical_level,
  updated_at = CURRENT_TIMESTAMP;
