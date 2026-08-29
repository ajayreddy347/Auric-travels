-- ==========================================================
-- Auric Travel: Add Stay & Room Booking Fields to Bookings
-- ==========================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'stay_id'
  ) THEN
    ALTER TABLE bookings ADD COLUMN stay_id VARCHAR(100);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'room_type'
  ) THEN
    ALTER TABLE bookings ADD COLUMN room_type VARCHAR(150);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'check_in_date'
  ) THEN
    ALTER TABLE bookings ADD COLUMN check_in_date DATE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'check_out_date'
  ) THEN
    ALTER TABLE bookings ADD COLUMN check_out_date DATE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'number_of_nights'
  ) THEN
    ALTER TABLE bookings ADD COLUMN number_of_nights INTEGER DEFAULT 1;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'guest_name'
  ) THEN
    ALTER TABLE bookings ADD COLUMN guest_name VARCHAR(255);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'guest_email'
  ) THEN
    ALTER TABLE bookings ADD COLUMN guest_email VARCHAR(255);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'guest_phone'
  ) THEN
    ALTER TABLE bookings ADD COLUMN guest_phone VARCHAR(50);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'special_requests'
  ) THEN
    ALTER TABLE bookings ADD COLUMN special_requests TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'base_rate_per_unit'
  ) THEN
    ALTER TABLE bookings ADD COLUMN base_rate_per_unit NUMERIC(12, 2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'taxes_and_fees'
  ) THEN
    ALTER TABLE bookings ADD COLUMN taxes_and_fees NUMERIC(12, 2);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_bookings_stay_id ON bookings(stay_id);
CREATE INDEX IF NOT EXISTS idx_bookings_check_in_date ON bookings(check_in_date);
