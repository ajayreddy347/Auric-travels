-- ==========================================================
-- Auric Travel: Bookings Schema & Migration
-- ==========================================================

-- 1. Create the bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  destination_id VARCHAR(100) NOT NULL,
  experience_id VARCHAR(100),
  trip_id VARCHAR(100),
  booking_date DATE NOT NULL,
  booking_status VARCHAR(50) NOT NULL DEFAULT 'confirmed',
  number_of_people INTEGER NOT NULL DEFAULT 1,
  total_amount NUMERIC(12, 2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Foreign key constraints with safety checks
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_bookings_user'
  ) THEN
    ALTER TABLE bookings
    ADD CONSTRAINT fk_bookings_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Skipping fk_bookings_user creation';
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_bookings_destination'
  ) THEN
    ALTER TABLE bookings
    ADD CONSTRAINT fk_bookings_destination
    FOREIGN KEY (destination_id) REFERENCES destinations(id)
    ON DELETE RESTRICT;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Skipping fk_bookings_destination creation';
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_bookings_experience'
  ) THEN
    ALTER TABLE bookings
    ADD CONSTRAINT fk_bookings_experience
    FOREIGN KEY (experience_id) REFERENCES experiences(id)
    ON DELETE SET NULL;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Skipping fk_bookings_experience creation';
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_bookings_trip'
  ) THEN
    ALTER TABLE bookings
    ADD CONSTRAINT fk_bookings_trip
    FOREIGN KEY (trip_id) REFERENCES trips(id)
    ON DELETE SET NULL;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Skipping fk_bookings_trip creation';
END $$;

-- High-performance indexes
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_destination_id ON bookings(destination_id);
CREATE INDEX IF NOT EXISTS idx_bookings_experience_id ON bookings(experience_id);
CREATE INDEX IF NOT EXISTS idx_bookings_trip_id ON bookings(trip_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);

-- 2. Insert sample demo bookings for Alexander Sterling (user-demo-voyager-1)
INSERT INTO bookings (
  id, user_id, destination_id, experience_id, trip_id,
  booking_date, booking_status, number_of_people, total_amount, currency, created_at, updated_at
)
VALUES
(
  'book-demo-aur-1',
  'user-demo-voyager-1',
  'hampi',
  'hampi-coracle-sunset-drift',
  'trip-hampi-royal-heritage-4d',
  '2026-10-15',
  'confirmed',
  2,
  32480.00,
  'INR',
  '2026-08-20 10:30:00+00',
  '2026-08-20 10:30:00+00'
),
(
  'book-demo-aur-2',
  'user-demo-voyager-1',
  'coorg',
  'coorg-plantation-roast-masterclass',
  'trip-coorg-coffee-wellness-3d',
  '2026-11-20',
  'confirmed',
  2,
  19500.00,
  'INR',
  '2026-08-22 14:15:00+00',
  '2026-08-22 14:15:00+00'
)
ON CONFLICT (id) DO NOTHING;
