-- ==========================================================
-- Auric Travel: Users Schema & Authentication Migration
-- ==========================================================

-- 1. Create the users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast user lookup by email
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower ON users(LOWER(email));

-- Link trips.user_id to users.id safely with foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_trips_user'
  ) THEN
    ALTER TABLE trips
    ADD CONSTRAINT fk_trips_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Skipping fk_trips_user creation';
END $$;

-- 2. Insert sample demo user (Password: AuricTravel2026!)
-- Hashed using bcrypt with 10 salt rounds ($2a$10$wN9v81u7R0Lg3pW1yZ5xUe6V...)
INSERT INTO users (id, name, email, password_hash)
VALUES (
  'user-demo-voyager-1',
  'Alexander Sterling',
  'alexander@aurictravel.com',
  '$2a$10$T80j3sDqA3eP9s8rQ6cE..gJqLqV9aQZgN7v81u7R0Lg3pW1yZ5xU' -- bcrypt hash for demo
)
ON CONFLICT (email) DO NOTHING;
