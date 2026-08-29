-- ==========================================================
-- Auric Travel: Saved Trips & Trip Itineraries Schema
-- ==========================================================

-- 1. Create the trips table
CREATE TABLE IF NOT EXISTS trips (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100), -- Nullable until authentication is implemented
  destination_id VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  number_of_days INTEGER NOT NULL DEFAULT 3,
  budget VARCHAR(100),
  travel_style VARCHAR(100),
  interests TEXT[],
  total_estimated_cost VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Foreign key for trips.destination_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_trips_destination'
  ) THEN
    ALTER TABLE trips
    ADD CONSTRAINT fk_trips_destination
    FOREIGN KEY (destination_id) REFERENCES destinations(id)
    ON DELETE SET NULL;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Skipping fk_trips_destination creation';
END $$;

-- 2. Create the trip_items table (individual day-by-day activities / itinerary items)
CREATE TABLE IF NOT EXISTS trip_items (
  id VARCHAR(100) PRIMARY KEY,
  trip_id VARCHAR(100) NOT NULL,
  experience_id VARCHAR(100), -- Nullable if it's a custom activity or sight
  destination_id VARCHAR(100),
  day_number INTEGER NOT NULL DEFAULT 1,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time VARCHAR(50),
  estimated_cost VARCHAR(100),
  latitude NUMERIC(10, 6),
  longitude NUMERIC(10, 6),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Foreign keys for trip_items
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_trip_items_trip'
  ) THEN
    ALTER TABLE trip_items
    ADD CONSTRAINT fk_trip_items_trip
    FOREIGN KEY (trip_id) REFERENCES trips(id)
    ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_trip_items_experience'
  ) THEN
    ALTER TABLE trip_items
    ADD CONSTRAINT fk_trip_items_experience
    FOREIGN KEY (experience_id) REFERENCES experiences(id)
    ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_trip_items_destination'
  ) THEN
    ALTER TABLE trip_items
    ADD CONSTRAINT fk_trip_items_destination
    FOREIGN KEY (destination_id) REFERENCES destinations(id)
    ON DELETE SET NULL;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Skipping trip_items foreign key creation';
END $$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_destination_id ON trips(destination_id);
CREATE INDEX IF NOT EXISTS idx_trips_created_at ON trips(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trip_items_trip_id ON trip_items(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_items_day_number ON trip_items(trip_id, day_number);
CREATE INDEX IF NOT EXISTS idx_trip_items_experience_id ON trip_items(experience_id);

-- 3. Insert realistic sample trips and itinerary items
INSERT INTO trips (
  id, user_id, destination_id, title, number_of_days, budget,
  travel_style, interests, total_estimated_cost
)
VALUES
(
  'trip-hampi-royal-heritage-4d',
  NULL,
  'hampi',
  'Royal Vijayanagara & Boulder Sanctuary 4-Day Journey',
  4,
  'Signature Luxury',
  'Deep Cultural Immersion',
  ARRAY['Heritage Architecture', 'Riverside Bouldering', 'Private Coracle Drift', 'Royal Gastronomy'],
  '₹56,000 ($680)'
),
(
  'trip-coorg-coffee-wellness-3d',
  NULL,
  'coorg',
  'Cloud-Forest Coffee Estates & Ayurvedic Sanctuary 3-Day Retreat',
  3,
  'Ultra-Luxury Bespoke',
  'Relaxed & Unhurried',
  ARRAY['Private Estate Villas', 'Cupping Masterclass', 'Ayurvedic Sound Sanctuary', 'Spice Trails'],
  '₹42,500 ($515)'
)
ON CONFLICT (id) DO UPDATE SET
  destination_id = EXCLUDED.destination_id,
  title = EXCLUDED.title,
  number_of_days = EXCLUDED.number_of_days,
  budget = EXCLUDED.budget,
  travel_style = EXCLUDED.travel_style,
  interests = EXCLUDED.interests,
  total_estimated_cost = EXCLUDED.total_estimated_cost,
  updated_at = CURRENT_TIMESTAMP;

-- Insert sample itinerary items for Hampi trip
INSERT INTO trip_items (
  id, trip_id, experience_id, destination_id, day_number,
  title, description, start_time, estimated_cost, latitude, longitude
)
VALUES
(
  'item-hampi-d1-1',
  'trip-hampi-royal-heritage-4d',
  NULL,
  'hampi',
  1,
  'Arrival & Kamalapura Royal Welcome',
  'Private luxury check-in to heritage palace suite followed by sunset tea overlooking royal ruins.',
  '14:00',
  'Included in Stay',
  15.3350,
  76.4600
),
(
  'item-hampi-d1-2',
  'trip-hampi-royal-heritage-4d',
  'hampi-coracle-sunset-drift',
  'hampi',
  1,
  'Tungabhadra Sacred Coracle & Bouldering Sunset Glide',
  'Glide in traditional wicker boats past ancient granite boulder canyons as evening temple bells echo.',
  '16:30',
  '₹4,500 ($55)',
  15.3350,
  76.4600
),
(
  'item-hampi-d2-1',
  'trip-hampi-royal-heritage-4d',
  NULL,
  'hampi',
  2,
  'Vijaya Vittala Temple & Stone Chariot Dawn Walk',
  'Private historian-guided exploration of the 15th-century musical pillars before public entry.',
  '06:30',
  '₹2,800 ($34)',
  15.3350,
  76.4600
),
(
  'item-hampi-d3-1',
  'trip-hampi-royal-heritage-4d',
  NULL,
  'hampi',
  3,
  'Virupaksha Temple Aarti & River Ghats',
  'Witness morning spiritual ceremonies and explore the vibrant ancient temple market.',
  '08:00',
  '₹1,500 ($18)',
  15.3350,
  76.4600
),
(
  'item-coorg-d1-1',
  'trip-coorg-coffee-wellness-3d',
  'coorg-artisan-coffee-roast',
  'coorg',
  1,
  'Private Cloud-Forest Estate Coffee Masterclass & Cupping',
  'Harvest cherries in a 150-year estate and roast single-origin beans with a certified Q-grader.',
  '09:30',
  '₹3,800 ($46)',
  12.3375,
  75.8069
)
ON CONFLICT (id) DO UPDATE SET
  trip_id = EXCLUDED.trip_id,
  experience_id = EXCLUDED.experience_id,
  destination_id = EXCLUDED.destination_id,
  day_number = EXCLUDED.day_number,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  start_time = EXCLUDED.start_time,
  estimated_cost = EXCLUDED.estimated_cost,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude;
