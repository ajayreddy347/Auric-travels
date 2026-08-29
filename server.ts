import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';

// Ensure environment variables are loaded immediately from root .env and .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { DestinationsRepository } from './server/destinationsRepository';
import { ExperiencesRepository } from './server/experiencesRepository';
import { TripsRepository } from './server/tripsRepository';
import { UsersRepository } from './server/usersRepository';
import { PasswordResetRepository } from './server/passwordResetRepository';
import { sendPasswordResetEmail, getEmailConfig } from './server/emailService';
import { BookingsRepository } from './server/bookingsRepository';
import { LUXURY_STAYS } from './src/data/staysData';
import { hashPassword, comparePassword, generateToken } from './server/authUtils';
import { requireAuth, optionalAuth, AuthenticatedRequest } from './server/middleware/authMiddleware';
import { testConnection } from './server/config/db';
import { runMigrations } from './server/db/migrate';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Production Security Headers
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Request body size limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Global JSON syntax error handler
app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ success: false, error: 'Malformed JSON payload' });
  }
  next(err);
});

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY || '';

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasMapsKey: Boolean(GOOGLE_MAPS_API_KEY),
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/health/db
 * Tests PostgreSQL database connection using connection pool and credentials from .env.
 * Returns 200 with connection metadata if successful, or 503 with diagnostic error if disconnected.
 */
app.get('/api/health/db', async (_req, res) => {
  try {
    const dbStatus = await testConnection();

    if (dbStatus.connected) {
      return res.status(200).json({
        success: true,
        status: 'connected',
        message: dbStatus.message,
        database: dbStatus.database,
        serverTime: dbStatus.serverTime,
        version: dbStatus.version,
        latencyMs: dbStatus.latencyMs,
        config: dbStatus.config,
        tables: dbStatus.tables,
        timestamp: new Date().toISOString(),
      });
    } else {
      return res.status(503).json({
        success: false,
        status: 'disconnected',
        message: dbStatus.message,
        error: dbStatus.error,
        code: dbStatus.code,
        latencyMs: dbStatus.latencyMs,
        config: dbStatus.config,
        troubleshooting: 'Ensure DATABASE_URL environment variable is set to your Supabase PostgreSQL connection string (e.g. in Settings > Environment Variables).',
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error: any) {
    console.error('[GET /api/health/db Error]:', error);
    return res.status(500).json({
      success: false,
      status: 'error',
      message: 'Failed to execute database connection test',
      error: error?.message || 'Internal server error',
      timestamp: new Date().toISOString(),
    });
  }
});

// ==========================================
// REST API: DESTINATIONS ENDPOINTS
// ==========================================

/**
 * GET /api/destinations
 * Fetches destinations from backend repository (with optional filtering).
 * Prepared for future PostgreSQL integration with automatic fallback.
 */
app.get('/api/destinations', async (req, res) => {
  try {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const region = typeof req.query.region === 'string' ? req.query.region : undefined;
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const offset = req.query.offset ? Number(req.query.offset) : undefined;

    const result = await DestinationsRepository.getAll({
      category,
      region,
      search,
      limit,
      offset,
    });

    return res.json({
      success: true,
      destinations: result.destinations,
      total: result.total,
      source: result.source,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[GET /api/destinations Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve destinations from backend',
      details: error?.message || 'Internal server error',
      destinations: [],
      total: 0,
    });
  }
});

/**
 * GET /api/destinations/:id
 * Fetches a single destination by ID or slug.
 */
app.get('/api/destinations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const destination = await DestinationsRepository.getById(id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        error: `Destination '${id}' was not found in the backend directory.`,
        destination: null,
      });
    }

    return res.json({
      success: true,
      destination,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error(`[GET /api/destinations/${req.params.id} Error]:`, error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve destination details',
      details: error?.message || 'Internal server error',
      destination: null,
    });
  }
});

// ==========================================
// REST API: EXPERIENCES ENDPOINTS
// ==========================================

/**
 * GET /api/experiences
 * Fetches curated experiences from backend repository (with optional filtering).
 * Prepared for future PostgreSQL integration with automatic fallback.
 */
app.get('/api/experiences', async (req, res) => {
  try {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const region = typeof req.query.region === 'string' ? req.query.region : undefined;
    const destinationId = (
      typeof req.query.destinationId === 'string' ? req.query.destinationId :
      typeof req.query.destination === 'string' ? req.query.destination :
      typeof req.query.destination_id === 'string' ? req.query.destination_id :
      undefined
    );
    const search = (
      typeof req.query.search === 'string' ? req.query.search :
      typeof req.query.q === 'string' ? req.query.q :
      undefined
    );
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const offset = req.query.offset ? Number(req.query.offset) : undefined;

    const result = await ExperiencesRepository.getAll({
      category,
      region,
      destinationId,
      search,
      limit,
      offset,
    });

    return res.json({
      success: true,
      experiences: result.experiences,
      total: result.total,
      source: result.source,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[GET /api/experiences Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve experiences from backend',
      details: error?.message || 'Internal server error',
      experiences: [],
      total: 0,
    });
  }
});

/**
 * GET /api/experiences/:id
 * Fetches a single curated experience by ID.
 */
app.get('/api/experiences/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const experience = await ExperiencesRepository.getById(id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        error: `Experience '${id}' was not found in the backend repository.`,
        experience: null,
      });
    }

    return res.json({
      success: true,
      experience,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error(`[GET /api/experiences/${req.params.id} Error]:`, error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve experience details',
      details: error?.message || 'Internal server error',
      experience: null,
    });
  }
});

// ==========================================
// REST API: AUTHENTICATION ENDPOINTS
// ==========================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/auth/register
 * Registers a new user account with hashed password and generates a JWT.
 */
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    // 1. Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid full name (minimum 2 characters).',
      });
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.',
      });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // 2. Check if email already registered
    const existingUser = await UsersRepository.findByEmail(cleanEmail);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email address is already registered. Please log in.',
      });
    }

    // 3. Hash password securely with bcrypt
    const passwordHash = await hashPassword(password);

    // 4. Create user in database
    const user = await UsersRepository.create(cleanName, cleanEmail, passwordHash);

    // 5. Generate signed JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
      token,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[POST /api/auth/register Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to complete user registration',
      details: error?.message || 'Internal server error',
    });
  }
});

/**
 * POST /api/auth/login
 * Verifies credentials, compares bcrypt hash, and issues a JWT.
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.',
      });
    }

    if (!password || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Please enter your password.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Look up user record
    const userRecord = await UsersRepository.findByEmail(cleanEmail);
    if (!userRecord) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    // 2. Compare password against bcrypt hash
    const isMatch = await comparePassword(password, userRecord.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    // 3. Generate signed JWT token
    const token = generateToken({
      id: userRecord.id,
      email: userRecord.email,
      name: userRecord.name,
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
        createdAt: userRecord.created_at,
        updatedAt: userRecord.updated_at,
      },
      token,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[POST /api/auth/login Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process login request',
      details: error?.message || 'Internal server error',
    });
  }
});

// ==========================================
// SECURE PASSWORD RESET RECOVERY SYSTEM
// ==========================================

// In-memory rate limiting sliding window for password reset requests (per IP/email)
const forgotPasswordRateLimits: Map<string, number[]> = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = forgotPasswordRateLimits.get(key) || [];
  const validTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    forgotPasswordRateLimits.set(key, validTimestamps);
    return true;
  }
  validTimestamps.push(now);
  forgotPasswordRateLimits.set(key, validTimestamps);
  return false;
}

/**
 * POST /api/auth/forgot-password
 * Generates a cryptographically secure, single-use, 15-minute expiring reset token.
 * Stores only a SHA-256 hash of the token in PostgreSQL.
 * Constant generic response protects against user enumeration and timing attacks.
 */
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body || {};
    const ip = req.ip || req.socket.remoteAddress || 'unknown';

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid email address.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const rateLimitKey = `${ip}:${cleanEmail}`;

    if (isRateLimited(rateLimitKey)) {
      return res.status(429).json({
        success: false,
        error: 'Too many password reset requests. Please wait 15 minutes before trying again.',
      });
    }

    // 1. Look up user by email
    const userRecord = await UsersRepository.findByEmail(cleanEmail);

    if (userRecord) {
      // 2. Generate 256-bit cryptographically secure token
      const rawToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes TTL

      // 3. Store hash in PostgreSQL / resilient store
      await PasswordResetRepository.createResetToken(userRecord.id, tokenHash, expiresAt);

      // 4. Construct luxury reset link
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const resetLink = `${baseUrl}/?reset_token=${rawToken}`;

      // 5. Dispatch email via SMTP provider (e.g. Gmail / SendGrid / Amazon SES)
      await sendPasswordResetEmail(userRecord.email, userRecord.name, resetLink, 15);
    }

    // 6. Always return generic constant message (enumeration protection)
    return res.status(200).json({
      success: true,
      message: 'If an account exists with that email, a password reset link has been sent.',
    });
  } catch (error: any) {
    console.error('[POST /api/auth/forgot-password Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Unable to process password reset request at this time.',
    });
  }
});

/**
 * GET /api/auth/email/diagnostic
 * Safe diagnostic endpoint for email/SMTP configuration status.
 */
app.get('/api/auth/email/diagnostic', (_req, res) => {
  const config = getEmailConfig();
  return res.json({
    status: 'diagnostic',
    smtp_host: config.host ? 'configured' : 'missing',
    smtp_port: config.port,
    smtp_user: config.user ? 'configured' : 'missing',
    smtp_pass: config.pass ? 'configured' : 'missing',
    smtp_from: config.from,
    email_delivery_ready: config.isConfigured,
  });
});

/**
 * POST /api/auth/verify-reset-token
 * Validates whether a reset token is valid, unexpired, and unused.
 */
app.post('/api/auth/verify-reset-token', async (req, res) => {
  try {
    const { token } = req.body || {};

    if (!token || typeof token !== 'string') {
      return res.status(400).json({
        success: false,
        valid: false,
        error: 'Reset token is required.',
      });
    }

    const tokenHash = crypto.createHash('sha256').update(token.trim()).digest('hex');
    const validRecord = await PasswordResetRepository.findValidToken(tokenHash);

    if (!validRecord) {
      return res.status(400).json({
        success: false,
        valid: false,
        error: 'This password reset link is invalid or has expired. Please request a new one.',
      });
    }

    return res.status(200).json({
      success: true,
      valid: true,
    });
  } catch (error: any) {
    console.error('[POST /api/auth/verify-reset-token Error]:', error);
    return res.status(500).json({
      success: false,
      valid: false,
      error: 'Unable to verify reset token.',
    });
  }
});

/**
 * POST /api/auth/reset-password
 * Validates token, enforces password strength, hashes new password, updates database,
 * and invalidates all reset tokens for the user.
 */
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body || {};

    if (!token || typeof token !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Reset token is required.',
      });
    }

    if (!password || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Please enter a new password.',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Passwords do not match. Please re-enter.',
      });
    }

    // Password strength check
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters long.',
      });
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return res.status(400).json({
        success: false,
        error: 'Password must contain uppercase, lowercase, and a number or symbol.',
      });
    }

    // 1. Verify token
    const tokenHash = crypto.createHash('sha256').update(token.trim()).digest('hex');
    const validRecord = await PasswordResetRepository.findValidToken(tokenHash);

    if (!validRecord) {
      return res.status(400).json({
        success: false,
        error: 'This password reset link is invalid or has expired. Please request a new one.',
      });
    }

    // 2. Hash new password with bcrypt
    const newPasswordHash = await hashPassword(password);

    // 3. Update password in database
    const updated = await UsersRepository.updatePassword(validRecord.user_id, newPasswordHash);
    if (!updated) {
      return res.status(500).json({
        success: false,
        error: 'Failed to update user password in database.',
      });
    }

    // 4. Mark this token as used immediately and invalidate all remaining user reset tokens
    await PasswordResetRepository.markTokenUsed(validRecord.id);
    await PasswordResetRepository.invalidateUserTokens(validRecord.user_id);

    return res.status(200).json({
      success: true,
      message: 'Your password has been successfully reset. You may now sign in with your new credentials.',
    });
  } catch (error: any) {
    console.error('[POST /api/auth/reset-password Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to reset password. Please try again.',
    });
  }
});

// ==========================================
// GOOGLE OAUTH 2.0 / OPENID CONNECT SYSTEM
// ==========================================

function cleanEnvVal(val: string | undefined): string {
  if (!val) return '';
  return val.trim().replace(/^["']|["']$/g, '').trim().replace(/^["']|["']$/g, '').trim();
}

/**
 * Unified helper to resolve Google OAuth 2.0 configuration.
 * Dynamically parses .env and .env.local files directly from disk on every invocation
 * to ensure immediate recognition of updated credentials without requiring a process restart.
 */
export function getGoogleOAuthConfig(req?: express.Request) {
  const envMap: Record<string, string> = {};
  const rootDir = process.cwd();
  const envFiles = [
    path.resolve(rootDir, '.env'),
    path.resolve(rootDir, '.env.local'),
  ];

  for (const envFile of envFiles) {
    if (fs.existsSync(envFile)) {
      try {
        const content = fs.readFileSync(envFile, 'utf8');
        const lines = content.split(/\r?\n/);
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) continue;
          const eqIdx = trimmed.indexOf('=');
          if (eqIdx !== -1) {
            const key = trimmed.slice(0, eqIdx).trim();
            let val = trimmed.slice(eqIdx + 1).trim();
            val = val.replace(/^["']|["']$/g, '').trim();
            if (val) {
              envMap[key] = val;
            }
          }
        }
      } catch (err) {
        // Fallback to process.env
      }
    }
  }

  const rawClientId =
    envMap.GOOGLE_CLIENT_ID ||
    process.env.GOOGLE_CLIENT_ID ||
    envMap.VITE_GOOGLE_CLIENT_ID ||
    process.env.VITE_GOOGLE_CLIENT_ID ||
    envMap.GOOGLE_OAUTH_CLIENT_ID ||
    process.env.GOOGLE_OAUTH_CLIENT_ID ||
    envMap.GOOGLE_AUTH_CLIENT_ID ||
    process.env.GOOGLE_AUTH_CLIENT_ID ||
    '';

  const rawClientSecret =
    envMap.GOOGLE_CLIENT_SECRET ||
    process.env.GOOGLE_CLIENT_SECRET ||
    envMap.GOOGLE_OAUTH_CLIENT_SECRET ||
    process.env.GOOGLE_OAUTH_CLIENT_SECRET ||
    envMap.GOOGLE_AUTH_CLIENT_SECRET ||
    process.env.GOOGLE_AUTH_CLIENT_SECRET ||
    envMap.GOOGLE_SECRET ||
    process.env.GOOGLE_SECRET ||
    '';

  const rawCallbackUrl =
    envMap.GOOGLE_CALLBACK_URL ||
    process.env.GOOGLE_CALLBACK_URL ||
    envMap.GOOGLE_REDIRECT_URI ||
    process.env.GOOGLE_REDIRECT_URI ||
    envMap.GOOGLE_OAUTH_CALLBACK_URL ||
    process.env.GOOGLE_OAUTH_CALLBACK_URL ||
    '';

  const clientId = cleanEnvVal(rawClientId);
  const clientSecret = cleanEnvVal(rawClientSecret);

  let callbackUrl = cleanEnvVal(rawCallbackUrl);
  if (!callbackUrl && req) {
    callbackUrl = `${req.protocol}://${req.get('host')}/api/auth/google/callback`;
  } else if (!callbackUrl) {
    callbackUrl = 'http://localhost:3000/api/auth/google/callback';
  }

  return {
    clientId,
    clientSecret,
    callbackUrl,
    hasClientId: Boolean(clientId),
    hasClientSecret: Boolean(clientSecret),
    isConfigured: Boolean(clientId && clientSecret),
  };
}

// In-memory OAuth state registry with 10-minute TTL for CSRF mitigation
interface OAuthStateEntry {
  createdAt: number;
  returnTo: string;
}
const oauthStates: Map<string, OAuthStateEntry> = new Map();

// Periodic state cleaner
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of oauthStates.entries()) {
    if (now - val.createdAt > 10 * 60 * 1000) {
      oauthStates.delete(key);
    }
  }
}, 2 * 60 * 1000);

/**
 * GET /api/auth/google/client-id
 * Returns public configuration status for frontend without exposing any secret.
 */
app.get('/api/auth/google/client-id', (req, res) => {
  const config = getGoogleOAuthConfig(req);
  return res.json({
    success: true,
    clientId: config.clientId,
    configured: config.isConfigured,
    callbackUrl: config.callbackUrl,
  });
});

/**
 * GET /api/auth/google/diagnostic
 * Safe diagnostic endpoint reporting configuration status without exposing credentials.
 */
app.get('/api/auth/google/diagnostic', (req, res) => {
  const config = getGoogleOAuthConfig(req);
  const rootEnvPath = path.resolve(process.cwd(), '.env');
  const rootEnvExists = fs.existsSync(rootEnvPath);

  return res.json({
    status: 'diagnostic',
    timestamp: new Date().toISOString(),
    environment: {
      cwd: process.cwd(),
      env_file_path: rootEnvPath,
      env_file_exists: rootEnvExists,
    },
    variables: {
      GOOGLE_CLIENT_ID: config.clientId ? 'configured' : 'missing',
      GOOGLE_CLIENT_SECRET: config.clientSecret ? 'configured' : 'missing',
      GOOGLE_CALLBACK_URL: config.callbackUrl ? 'configured' : 'missing',
      JWT_SECRET: process.env.JWT_SECRET ? 'configured' : 'missing',
      DATABASE_URL: process.env.DATABASE_URL ? 'configured' : 'missing',
    },
    oauth_status: config.isConfigured ? 'ready' : 'missing_credentials',
    resolved_callback_url: config.callbackUrl,
  });
});

/**
 * GET /api/auth/google
 * Initiates the official Google OAuth 2.0 Authorization Code Flow.
 * Redirects the user's browser to Google's official accounts.google.com consent page.
 */
app.get('/api/auth/google', (req, res) => {
  const config = getGoogleOAuthConfig(req);

  if (!config.isConfigured) {
    console.warn('[Google OAuth]: Google OAuth credentials are not configured in .env');
    return res.redirect('/?auth_error=google_not_configured');
  }

  // 1. Generate a cryptographically secure random state parameter (CSRF protection)
  const state = crypto.randomBytes(32).toString('hex');
  const returnTo = typeof req.query.returnTo === 'string' ? req.query.returnTo : '/';
  oauthStates.set(state, { createdAt: Date.now(), returnTo });

  // 2. Build official Google OAuth 2.0 authorization URL
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', config.clientId);
  googleAuthUrl.searchParams.set('redirect_uri', config.callbackUrl);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid email profile');
  googleAuthUrl.searchParams.set('access_type', 'offline');
  googleAuthUrl.searchParams.set('state', state);
  googleAuthUrl.searchParams.set('prompt', 'select_account consent');

  // If frontend requests JSON (e.g. for popup window handling), return the URL
  if (req.headers.accept?.includes('application/json') || req.query.json === 'true') {
    return res.json({ success: true, url: googleAuthUrl.toString(), state });
  }

  // Otherwise, redirect directly to Google consent screen
  return res.redirect(googleAuthUrl.toString());
});

/**
 * GET /api/auth/google/callback
 * Handles Google OAuth 2.0 redirect, validates state, exchanges authorization code,
 * verifies Google ID Token, syncs user with PostgreSQL, and issues application JWT.
 */
app.get('/api/auth/google/callback', async (req, res) => {
  try {
    const { code, state, error, error_description } = req.query;

    // 1. Check for user cancellation or OAuth provider error
    if (error) {
      console.warn('[Google OAuth Callback Error]:', error, error_description);
      return res.redirect(`/?auth_error=google_cancelled&reason=${encodeURIComponent(String(error))}`);
    }

    if (!code || typeof code !== 'string') {
      return res.redirect('/?auth_error=missing_code');
    }

    // 2. Validate state token to protect against CSRF attacks
    if (!state || typeof state !== 'string' || !oauthStates.has(state)) {
      console.warn('[Google OAuth Callback]: Invalid or expired state token');
      return res.redirect('/?auth_error=state_mismatch');
    }

    const stateData = oauthStates.get(state);
    oauthStates.delete(state); // Single-use state token

    // Check state TTL (10 minutes)
    if (!stateData || Date.now() - stateData.createdAt > 10 * 60 * 1000) {
      return res.redirect('/?auth_error=state_expired');
    }

    const config = getGoogleOAuthConfig(req);

    if (!config.isConfigured) {
      console.error('[Google OAuth Callback Error]: OAuth credentials not configured on backend');
      return res.redirect('/?auth_error=google_not_configured');
    }

    // 3. Exchange authorization code with Google token endpoint
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.callbackUrl,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const tokenErr = await tokenResponse.text();
      console.error('[Google OAuth Token Exchange Failed]:', tokenErr);
      return res.redirect('/?auth_error=token_exchange_failed');
    }

    const tokenData: any = await tokenResponse.json();
    const idToken = tokenData.id_token;

    if (!idToken) {
      return res.redirect('/?auth_error=missing_id_token');
    }

    // 4. Cryptographically verify Google ID Token server-side via TokenInfo API
    const verifyResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
    if (!verifyResponse.ok) {
      const verifyErr = await verifyResponse.text();
      console.error('[Google ID Token Verification Failed]:', verifyErr);
      return res.redirect('/?auth_error=invalid_id_token');
    }

    const payload: any = await verifyResponse.json();

    // 5. Strict security checks on ID token claims
    if (!payload.email || (payload.email_verified !== 'true' && payload.email_verified !== true)) {
      return res.redirect('/?auth_error=unverified_email');
    }

    if (config.clientId && payload.aud && payload.aud !== config.clientId) {
      console.warn('[Google OAuth]: Audience mismatch', payload.aud, 'expected:', config.clientId);
      return res.redirect('/?auth_error=audience_mismatch');
    }

    const googleEmail = payload.email.trim().toLowerCase();
    const googleName = payload.name || payload.given_name || googleEmail.split('@')[0];
    const googleAvatar = payload.picture || '';
    const googleSub = payload.sub; // Stable unique Google User ID

    if (!googleSub) {
      return res.redirect('/?auth_error=missing_sub');
    }

    // 6. Safe Account Matching & PostgreSQL Integration
    let user = await UsersRepository.findByGoogleId(googleSub);

    if (!user) {
      // Check if user already exists by email
      const existingUserByEmail = await UsersRepository.findByEmail(googleEmail);
      if (existingUserByEmail) {
        // Link Google ID to existing account securely
        console.log(`[Google OAuth]: Linking Google account (${googleSub}) to existing user (${existingUserByEmail.id})`);
        await UsersRepository.linkGoogleAccount(existingUserByEmail.id, googleSub, googleAvatar);
        user = existingUserByEmail;
      } else {
        // Create new user in PostgreSQL with generated password hash and auth_provider='google'
        const randomPassword = `google-sec-${googleSub}-${crypto.randomBytes(16).toString('hex')}`;
        const passwordHash = await hashPassword(randomPassword);
        const newUser = await UsersRepository.create(
          googleName,
          googleEmail,
          passwordHash,
          googleSub,
          googleAvatar,
          'google'
        );
        user = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          password_hash: passwordHash,
          google_id: googleSub,
          avatar_url: googleAvatar,
          auth_provider: 'google',
          created_at: newUser.created_at,
          updated_at: newUser.updated_at
        };
        console.log(`[Google OAuth]: Registered new user (${user.id}) via Google OAuth`);
      }
    }

    // 7. Issue normal application JWT token
    const appToken = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    // 8. Set resilient browser cookie for instant zero-flash session restoral
    res.cookie('auric_auth_token', appToken, {
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax',
      httpOnly: false,
    });

    // 9. Redirect back to application with JWT token
    return res.redirect(`/?auth_token=${encodeURIComponent(appToken)}&auth_provider=google`);
  } catch (error: any) {
    console.error('[GET /api/auth/google/callback Exception]:', error);
    return res.redirect('/?auth_error=internal_server_error');
  }
});


/**
 * GET /api/auth/me
 * Protected endpoint returning the authenticated user profile.
 */
app.get('/api/auth/me', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
    }

    let userProfile = await UsersRepository.findById(req.user.id);
    if (!userProfile && req.user.email) {
      const byEmail = await UsersRepository.findByEmail(req.user.email);
      if (byEmail) {
        userProfile = {
          id: byEmail.id,
          name: byEmail.name,
          email: byEmail.email,
          google_id: byEmail.google_id,
          avatar_url: byEmail.avatar_url,
          auth_provider: byEmail.auth_provider,
          created_at: byEmail.created_at,
          updated_at: byEmail.updated_at,
        };
      }
    }

    if (!userProfile) {
      // Resilient fallback using verified JWT claims
      userProfile = {
        id: req.user.id,
        name: req.user.name || 'Valued Member',
        email: req.user.email,
        google_id: null,
        avatar_url: null,
        auth_provider: 'local',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    return res.status(200).json({
      success: true,
      user: {
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        google_id: userProfile.google_id || null,
        avatar_url: userProfile.avatar_url || null,
        avatar: userProfile.avatar_url || null,
        auth_provider: userProfile.auth_provider || 'local',
        createdAt: userProfile.created_at,
        updatedAt: userProfile.updated_at,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[GET /api/auth/me Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve authenticated user profile',
      details: error?.message || 'Internal server error',
    });
  }
});

// ==========================================
// REST API: TRIPS & ITINERARIES ENDPOINTS
// ==========================================

/**
 * GET /api/trips
 * Fetches saved trips strictly belonging to the authenticated user.
 * Requires JWT authentication.
 */
app.get('/api/trips', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please provide a valid Bearer token.',
        trips: [],
        total: 0,
      });
    }

    // Strictly enforce ownership: only return trips belonging to the authenticated user
    const userId = req.user.id;

    const destinationId = typeof req.query.destinationId === 'string' ? req.query.destinationId : typeof req.query.destination_id === 'string' ? req.query.destination_id : typeof req.query.destination === 'string' ? req.query.destination : undefined;
    const search = typeof req.query.search === 'string' ? req.query.search : typeof req.query.q === 'string' ? req.query.q : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const offset = req.query.offset ? Number(req.query.offset) : undefined;

    const result = await TripsRepository.getAll({
      userId,
      destinationId,
      search,
      limit,
      offset,
    });

    return res.json({
      success: true,
      trips: result.trips,
      total: result.total,
      source: result.source,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[GET /api/trips Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve trips from backend',
      details: error?.message || 'Internal server error',
      trips: [],
      total: 0,
    });
  }
});

/**
 * GET /api/trips/:id
 * Fetches a single trip with all its itinerary items.
 * Protected: Ensures users cannot access another user's private trip (403 Forbidden).
 */
app.get('/api/trips/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please provide a valid Bearer token.',
        trip: null,
      });
    }

    const { id } = req.params;
    const trip = await TripsRepository.getById(id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        error: `Trip with ID '${id}' was not found.`,
        trip: null,
      });
    }

    // Ownership check: user can only access their own trip
    if (trip.user_id && trip.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: You do not have permission to view this private trip.',
        trip: null,
      });
    }

    return res.json({
      success: true,
      trip,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error(`[GET /api/trips/${req.params.id} Error]:`, error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve trip details',
      details: error?.message || 'Internal server error',
      trip: null,
    });
  }
});

/**
 * POST /api/trips
 * Creates a new trip along with its day-by-day itinerary items.
 * Automatically associates the trip with the authenticated user's JWT user_id.
 */
app.post('/api/trips', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please provide a valid Bearer token to create a trip.',
      });
    }

    const {
      id,
      destinationId,
      destination_id,
      title,
      numberOfDays,
      number_of_days,
      budget,
      travelStyle,
      travel_style,
      interests,
      totalEstimatedCost,
      total_estimated_cost,
      items,
    } = req.body || {};

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Trip title is required.',
      });
    }

    // Automatically set the trip owner to the authenticated user's ID
    const effectiveUserId = req.user.id;

    const createdTrip = await TripsRepository.create({
      id: id || undefined,
      userId: effectiveUserId,
      destinationId: destinationId || destination_id || null,
      title: title.trim(),
      numberOfDays: numberOfDays || number_of_days || (Array.isArray(items) && items.length > 0 ? Math.max(...items.map((i: any) => i.day_number || i.dayNumber || 1)) : 3),
      budget: budget || null,
      travelStyle: travelStyle || travel_style || null,
      interests: Array.isArray(interests) ? interests : [],
      totalEstimatedCost: totalEstimatedCost || total_estimated_cost || null,
      items: Array.isArray(items) ? items.map((i: any) => ({
        id: i.id || undefined,
        experienceId: i.experienceId || i.experience_id || null,
        destinationId: i.destinationId || i.destination_id || destinationId || destination_id || null,
        dayNumber: Number(i.dayNumber || i.day_number || 1),
        title: i.title || 'Itinerary Activity',
        description: i.description || null,
        startTime: i.startTime || i.start_time || null,
        estimatedCost: i.estimatedCost || i.estimated_cost || null,
        latitude: i.latitude !== undefined ? Number(i.latitude) : null,
        longitude: i.longitude !== undefined ? Number(i.longitude) : null,
      })) : [],
    });

    return res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      trip: createdTrip,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[POST /api/trips Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create trip',
      details: error?.message || 'Internal server error',
    });
  }
});

/**
 * PUT /api/trips/:id
 * Updates an existing trip and replaces/updates its itinerary items.
 * Protected: Ensures users can only update their own trips (403 Forbidden).
 */
app.put('/api/trips/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please provide a valid Bearer token to update this trip.',
      });
    }

    const { id } = req.params;
    const existing = await TripsRepository.getById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: `Trip with ID '${id}' was not found.`,
      });
    }

    // Ownership check: user can only update their own trip
    if (existing.user_id && existing.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: You do not have permission to modify this trip.',
      });
    }

    const {
      destinationId,
      destination_id,
      title,
      numberOfDays,
      number_of_days,
      budget,
      travelStyle,
      travel_style,
      interests,
      totalEstimatedCost,
      total_estimated_cost,
      items,
    } = req.body || {};

    const updatedTrip = await TripsRepository.update(id, {
      destinationId: destinationId !== undefined ? destinationId : destination_id,
      title: title !== undefined ? title : undefined,
      numberOfDays: numberOfDays !== undefined ? Number(numberOfDays) : (number_of_days !== undefined ? Number(number_of_days) : undefined),
      budget: budget !== undefined ? budget : undefined,
      travelStyle: travelStyle !== undefined ? travelStyle : travel_style,
      interests: Array.isArray(interests) ? interests : undefined,
      totalEstimatedCost: totalEstimatedCost !== undefined ? totalEstimatedCost : total_estimated_cost,
      items: Array.isArray(items) ? items.map((i: any) => ({
        id: i.id || undefined,
        experienceId: i.experienceId || i.experience_id || null,
        destinationId: i.destinationId || i.destination_id || existing.destination_id || null,
        dayNumber: Number(i.dayNumber || i.day_number || 1),
        title: i.title || 'Itinerary Activity',
        description: i.description || null,
        startTime: i.startTime || i.start_time || null,
        estimatedCost: i.estimatedCost || i.estimated_cost || null,
        latitude: i.latitude !== undefined ? Number(i.latitude) : null,
        longitude: i.longitude !== undefined ? Number(i.longitude) : null,
      })) : undefined,
    });

    return res.json({
      success: true,
      message: 'Trip updated successfully',
      trip: updatedTrip,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error(`[PUT /api/trips/${req.params.id} Error]:`, error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update trip',
      details: error?.message || 'Internal server error',
    });
  }
});

/**
 * DELETE /api/trips/:id
 * Deletes a trip and cascades to its itinerary items.
 * Protected: Ensures users can only delete their own trips (403 Forbidden).
 */
app.delete('/api/trips/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please provide a valid Bearer token to delete this trip.',
      });
    }

    const { id } = req.params;
    const existing = await TripsRepository.getById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: `Trip with ID '${id}' was not found.`,
      });
    }

    // Ownership check: user can only delete their own trip
    if (existing.user_id && existing.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: You do not have permission to delete this trip.',
      });
    }

    const deleted = await TripsRepository.delete(id);

    return res.json({
      success: true,
      message: `Trip '${id}' deleted successfully`,
      deleted,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error(`[DELETE /api/trips/${req.params.id} Error]:`, error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete trip',
      details: error?.message || 'Internal server error',
    });
  }
});

// ==========================================
// BOOKINGS API ENDPOINTS
// ==========================================

/**
 * POST /api/bookings
 * Creates a new booking.
 * Links booking to the authenticated user's user_id from JWT.
 * Never accepts user_id directly from the request body.
 */
app.post('/api/bookings', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please provide a valid Bearer token.',
      });
    }

    const {
      id,
      destinationId,
      destination_id,
      stayId,
      stay_id,
      roomType,
      room_type,
      experienceId,
      experience_id,
      tripId,
      trip_id,
      bookingDate,
      booking_date,
      checkInDate,
      check_in_date,
      checkOutDate,
      check_out_date,
      startDate,
      start_date,
      endDate,
      end_date,
      numberOfNights,
      number_of_nights,
      numberOfPeople,
      number_of_people,
      numberOfGuests,
      number_of_guests,
      guestName,
      guest_name,
      guestEmail,
      guest_email,
      guestPhone,
      guest_phone,
      specialRequests,
      special_requests,
      totalAmount,
      total_amount,
      totalCost,
      total_cost,
      currency,
      bookingStatus,
      booking_status,
      status,
    } = req.body || {};

    const effectiveStayId = (stayId || stay_id || '').trim();
    const effectiveRoomType = (roomType || room_type || '').trim();
    const effectiveDestinationId = (destinationId || destination_id || '').trim();

    // 1. Auric Stay Validation & Authoritative Pricing
    let matchedStay: any = null;
    let baseRatePerUnit: number | null = null;
    let taxesAndFees: number | null = null;
    let authoritativeTotal: number | null = null;
    let computedNights = 1;

    const rawCheckIn = checkInDate || check_in_date || bookingDate || booking_date || startDate || start_date;
    const rawCheckOut = checkOutDate || check_out_date || endDate || end_date;

    if (!rawCheckIn || typeof rawCheckIn !== 'string' || !rawCheckIn.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Validation error: booking_date / check_in_date is required.',
      });
    }

    const parsedCheckIn = new Date(rawCheckIn.trim());
    if (isNaN(parsedCheckIn.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Validation error: check_in_date must be a valid date.',
      });
    }
    const formattedCheckIn = rawCheckIn.includes('T') ? rawCheckIn.split('T')[0] : rawCheckIn.trim();

    let formattedCheckOut: string | null = null;
    if (rawCheckOut && typeof rawCheckOut === 'string' && rawCheckOut.trim()) {
      const parsedCheckOut = new Date(rawCheckOut.trim());
      if (isNaN(parsedCheckOut.getTime())) {
        return res.status(400).json({
          success: false,
          error: 'Validation error: check_out_date must be a valid date.',
        });
      }
      if (parsedCheckOut <= parsedCheckIn) {
        return res.status(400).json({
          success: false,
          error: 'Validation error: check_out_date must be after check_in_date.',
        });
      }
      formattedCheckOut = rawCheckOut.includes('T') ? rawCheckOut.split('T')[0] : rawCheckOut.trim();
      const diffTime = parsedCheckOut.getTime() - parsedCheckIn.getTime();
      computedNights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    } else if (numberOfNights || number_of_nights) {
      computedNights = Math.max(1, Number(numberOfNights || number_of_nights));
    }

    if (effectiveStayId) {
      matchedStay = LUXURY_STAYS.find((s) => s.id === effectiveStayId || s.id.toLowerCase() === effectiveStayId.toLowerCase());
      if (!matchedStay) {
        return res.status(400).json({
          success: false,
          error: `Validation error: Invalid stay_id '${effectiveStayId}'. Property was not found.`,
        });
      }

      // Validate Room Tier if provided
      let roomMultiplier = 1.0;
      if (effectiveRoomType && Array.isArray(matchedStay.roomTypes) && matchedStay.roomTypes.length > 0) {
        const matchedRoom = matchedStay.roomTypes.find((r: any) => r.name.toLowerCase() === effectiveRoomType.toLowerCase());
        if (!matchedRoom) {
          return res.status(400).json({
            success: false,
            error: `Validation error: Invalid room_type '${effectiveRoomType}' for property '${matchedStay.name}'.`,
          });
        }
        roomMultiplier = matchedRoom.priceMultiplier || 1.0;
      }

      // Calculate authoritative rate & total
      const effectiveCurrency = (currency && typeof currency === 'string' && currency.trim().toUpperCase() === 'USD') ? 'USD' : 'INR';
      if (effectiveCurrency === 'INR') {
        baseRatePerUnit = Math.round(matchedStay.pricePerNightINR * roomMultiplier);
        const subtotal = baseRatePerUnit * computedNights;
        taxesAndFees = Math.round(subtotal * 0.12);
        authoritativeTotal = subtotal + taxesAndFees;
      } else {
        baseRatePerUnit = Math.round(matchedStay.pricePerNightUSD * roomMultiplier);
        const subtotal = baseRatePerUnit * computedNights;
        taxesAndFees = Math.round(subtotal * 0.12);
        authoritativeTotal = subtotal + taxesAndFees;
      }
    }

    const finalDestId = matchedStay?.destinationId || effectiveDestinationId || 'hampi';
    if (!finalDestId) {
      return res.status(400).json({
        success: false,
        error: 'Validation error: destination_id is required.',
      });
    }

    const rawPeople = numberOfPeople ?? number_of_people ?? numberOfGuests ?? number_of_guests ?? 2;
    const parsedPeople = Number(rawPeople);
    if (isNaN(parsedPeople) || !Number.isInteger(parsedPeople) || parsedPeople < 1 || parsedPeople > 12) {
      return res.status(400).json({
        success: false,
        error: 'Validation error: number_of_people must be an integer between 1 and 12.',
      });
    }

    const rawAmount = totalAmount ?? total_amount ?? totalCost ?? total_cost;
    const parsedAmount = Number(rawAmount);
    const finalAmount = authoritativeTotal !== null ? authoritativeTotal : (isNaN(parsedAmount) || parsedAmount <= 0 ? 35000 : parsedAmount);

    const effectiveCurrency = (currency && typeof currency === 'string' && currency.trim()) ? currency.trim().toUpperCase() : 'INR';
    const effectiveStatus = (bookingStatus || booking_status || status || 'confirmed').trim();

    const effectiveExperienceId = (experienceId || experience_id || null);
    const effectiveTripId = (tripId || trip_id || null);

    // Enforce JWT user_id ownership strictly
    const createdBooking = await BookingsRepository.create({
      id: id || undefined,
      userId: req.user.id,
      destinationId: finalDestId,
      stayId: effectiveStayId || null,
      roomType: effectiveRoomType || (matchedStay?.roomTypes?.[0]?.name || null),
      experienceId: effectiveExperienceId ? String(effectiveExperienceId).trim() : null,
      tripId: effectiveTripId ? String(effectiveTripId).trim() : null,
      bookingDate: formattedCheckIn,
      checkInDate: formattedCheckIn,
      checkOutDate: formattedCheckOut,
      numberOfNights: computedNights,
      bookingStatus: effectiveStatus,
      numberOfPeople: parsedPeople,
      guestName: (guestName || guest_name || req.user.name || 'Valued Member').trim(),
      guestEmail: (guestEmail || guest_email || req.user.email || '').trim(),
      guestPhone: (guestPhone || guest_phone || '').trim() || null,
      specialRequests: (specialRequests || special_requests || '').trim() || null,
      baseRatePerUnit: baseRatePerUnit,
      taxesAndFees: taxesAndFees,
      totalAmount: Math.round(finalAmount * 100) / 100,
      currency: effectiveCurrency,
    });

    return res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: createdBooking,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[POST /api/bookings Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create booking',
      details: error?.message || 'Internal server error',
    });
  }
});

/**
 * GET /api/bookings
 * Fetches bookings strictly belonging to the authenticated user.
 * Requires JWT authentication.
 */
app.get('/api/bookings', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please provide a valid Bearer token.',
        bookings: [],
        total: 0,
      });
    }

    const destinationId = typeof req.query.destinationId === 'string' ? req.query.destinationId : typeof req.query.destination_id === 'string' ? req.query.destination_id : undefined;
    const status = typeof req.query.status === 'string' ? req.query.status : typeof req.query.booking_status === 'string' ? req.query.booking_status : undefined;
    const limit = req.query.limit ? Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10))) : undefined;
    const offset = req.query.offset ? Math.max(0, parseInt(req.query.offset as string, 10)) : undefined;

    const result = await BookingsRepository.find({
      userId: req.user.id,
      destinationId,
      status,
      limit,
      offset,
    });

    return res.json({
      success: true,
      bookings: result.bookings,
      total: result.total,
      source: result.source,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[GET /api/bookings Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve bookings',
      details: error?.message || 'Internal server error',
    });
  }
});

/**
 * GET /api/bookings/:id
 * Fetches a single booking.
 * Protected: Ensures users cannot access another user's booking (403 Forbidden).
 */
app.get('/api/bookings/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please provide a valid Bearer token.',
        booking: null,
      });
    }

    const { id } = req.params;
    const booking = await BookingsRepository.getById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: `Booking with ID '${id}' was not found.`,
        booking: null,
      });
    }

    // Ownership check: user can only access their own booking
    if (booking.user_id && booking.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: You do not have permission to view this booking.',
        booking: null,
      });
    }

    return res.json({
      success: true,
      booking,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error(`[GET /api/bookings/${req.params.id} Error]:`, error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve booking',
      details: error?.message || 'Internal server error',
    });
  }
});

/**
 * PUT /api/bookings/:id/cancel
 * Cancels a booking.
 * Protected: Ensures users can only cancel their own booking (403 Forbidden).
 */
app.put('/api/bookings/:id/cancel', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please provide a valid Bearer token.',
      });
    }

    const { id } = req.params;
    const existing = await BookingsRepository.getById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: `Booking with ID '${id}' was not found.`,
      });
    }

    // Ownership check: user can only cancel their own booking
    if (existing.user_id && existing.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: You do not have permission to modify this booking.',
      });
    }

    const updatedBooking = await BookingsRepository.cancel(id);

    return res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking: updatedBooking,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error(`[PUT /api/bookings/${req.params.id}/cancel Error]:`, error);
    return res.status(500).json({
      success: false,
      error: 'Failed to cancel booking',
      details: error?.message || 'Internal server error',
    });
  }
});

// Maps Config endpoint (Safe client initialization config)
app.get('/api/maps/config', (_req, res) => {
  res.json({
    apiKey: GOOGLE_MAPS_API_KEY,
    hasApiKey: Boolean(GOOGLE_MAPS_API_KEY)
  });
});

// Places API (New) - Text Search Endpoint
app.get('/api/places/search', async (req, res) => {
  const query = (req.query.query as string || '').trim();
  const pageSize = Math.min(Number(req.query.pageSize) || 12, 20);

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  if (!GOOGLE_MAPS_API_KEY) {
    return res.json({
      places: [],
      message: 'Google Maps API key not configured in environment; using local curated place data.',
      isFallback: true
    });
  }

  try {
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.photos,places.types,places.editorialSummary,places.priceLevel,places.googleMapsUri,places.websiteUri'
      },
      body: JSON.stringify({
        textQuery: query,
        pageSize,
        languageCode: 'en'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`[Places TextSearch Error ${response.status}]:`, errorText);
      return res.status(200).json({
        places: [],
        message: 'Google Places API unavailable or restricted; using local curated destinations.',
        error: errorText,
        isFallback: true
      });
    }

    const data = await response.json();
    return res.json({
      places: data.places || [],
      isFallback: false
    });
  } catch (err: any) {
    console.error('[Places TextSearch Exception]:', err);
    return res.status(200).json({
      places: [],
      error: err.message,
      isFallback: true
    });
  }
});

// Places API (New) - Nearby Search Endpoint
app.get('/api/places/nearby', async (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const radius = Math.min(Number(req.query.radius) || 15000, 50000);
  const rawTypes = (req.query.types as string || 'tourist_attraction,historical_landmark,resort_hotel,point_of_interest,park,museum').split(',').map(t => t.trim());

  if (isNaN(lat) || isNaN(lng)) {
    return res.status(400).json({ error: 'Valid lat and lng query parameters are required' });
  }

  if (!GOOGLE_MAPS_API_KEY) {
    return res.json({
      places: [],
      message: 'Google Maps API key not configured; nearby search disabled.',
      isFallback: true
    });
  }

  try {
    const response = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.photos,places.types,places.editorialSummary,places.priceLevel,places.googleMapsUri'
      },
      body: JSON.stringify({
        includedTypes: rawTypes.slice(0, 10),
        maxResultCount: 10,
        locationRestriction: {
          circle: {
            center: {
              latitude: lat,
              longitude: lng
            },
            radius
          }
        },
        languageCode: 'en'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`[Places NearbySearch Error ${response.status}]:`, errorText);
      return res.status(200).json({
        places: [],
        error: errorText,
        isFallback: true
      });
    }

    const data = await response.json();
    return res.json({
      places: data.places || [],
      isFallback: false
    });
  } catch (err: any) {
    console.error('[Places NearbySearch Exception]:', err);
    return res.status(200).json({
      places: [],
      error: err.message,
      isFallback: true
    });
  }
});

// Places API (New) - Autocomplete Endpoint (Supports both POST & GET)
app.all('/api/places/autocomplete', async (req, res) => {
  const input = ((req.method === 'POST' ? req.body.input : req.query.input) as string || '').trim();
  const sessionToken = req.method === 'POST' ? req.body.sessionToken : req.query.sessionToken;

  if (!input) {
    return res.json({ suggestions: [] });
  }

  if (!GOOGLE_MAPS_API_KEY) {
    return res.json({
      suggestions: [],
      message: 'Google Maps API key not configured',
      isFallback: true
    });
  }

  try {
    const payload: any = {
      input,
      languageCode: 'en'
    };
    if (sessionToken) {
      payload.sessionToken = sessionToken;
    }

    const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`[Places Autocomplete Error ${response.status}]:`, errorText);
      return res.status(200).json({ suggestions: [], error: errorText, isFallback: true });
    }

    const data = await response.json();
    return res.json({
      suggestions: data.suggestions || [],
      isFallback: false
    });
  } catch (err: any) {
    console.error('[Places Autocomplete Exception]:', err);
    return res.status(200).json({ suggestions: [], error: err.message, isFallback: true });
  }
});

// Routes API - Compute Route & Directions Endpoint
app.post('/api/routes/directions', async (req, res) => {
  const { origin, destination, travelMode = 'DRIVE' } = req.body;

  if (!origin || !destination) {
    return res.status(400).json({ error: 'Origin and destination coordinates are required' });
  }

  if (!GOOGLE_MAPS_API_KEY) {
    return res.json({
      routes: [],
      message: 'Google Maps API key not configured; using local geodesic calculations',
      isFallback: true
    });
  }

  try {
    const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.description,routes.warnings'
      },
      body: JSON.stringify({
        origin: {
          location: {
            latLng: {
              latitude: origin.lat,
              longitude: origin.lng
            }
          }
        },
        destination: {
          location: {
            latLng: {
              latitude: destination.lat,
              longitude: destination.lng
            }
          }
        },
        travelMode,
        routingPreference: 'TRAFFIC_UNAWARE',
        computeAlternativeRoutes: false,
        languageCode: 'en-US',
        units: 'METRIC'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`[Routes API Error ${response.status}]:`, errorText);
      return res.status(200).json({ routes: [], error: errorText, isFallback: true });
    }

    const data = await response.json();
    return res.json({
      routes: data.routes || [],
      isFallback: false
    });
  } catch (err: any) {
    console.error('[Routes API Exception]:', err);
    return res.status(200).json({ routes: [], error: err.message, isFallback: true });
  }
});

// Places API (New) - Place Details Endpoint
app.get('/api/places/details', async (req, res) => {
  const placeId = (req.query.placeId as string || '').trim();

  if (!placeId) {
    return res.status(400).json({ error: 'placeId query parameter is required' });
  }

  if (!GOOGLE_MAPS_API_KEY) {
    return res.json({
      place: null,
      message: 'Google Maps API key not configured',
      isFallback: true
    });
  }

  try {
    const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      method: 'GET',
      headers: {
        'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
        'X-Goog-FieldMask': 'id,displayName,formattedAddress,location,rating,userRatingCount,photos,types,editorialSummary,priceLevel,googleMapsUri,websiteUri,internationalPhoneNumber,regularOpeningHours,reviews'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`[Places Details Error ${response.status}]:`, errorText);
      return res.status(200).json({
        place: null,
        error: errorText,
        isFallback: true
      });
    }

    const data = await response.json();
    return res.json({
      place: data,
      isFallback: false
    });
  } catch (err: any) {
    console.error('[Places Details Exception]:', err);
    return res.status(200).json({
      place: null,
      error: err.message,
      isFallback: true
    });
  }
});

// Places API (New) - Place Photos Proxy Endpoint
app.get('/api/places/photo', async (req, res) => {
  const name = req.query.name as string;
  const maxHeightPx = Math.min(Number(req.query.maxHeightPx) || 800, 1600);
  const maxWidthPx = Math.min(Number(req.query.maxWidthPx) || 1200, 2400);

  if (!name) {
    return res.status(400).send('Photo resource name is required');
  }

  if (!GOOGLE_MAPS_API_KEY) {
    // If no API key, redirect to an ultra-reliable luxury fallback
    return res.redirect('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80');
  }

  try {
    // Using skipHttpRedirect=true to retrieve direct secure Google Cloud Storage URI
    const apiUrl = `https://places.googleapis.com/v1/${encodeURI(name)}/media?maxHeightPx=${maxHeightPx}&maxWidthPx=${maxWidthPx}&skipHttpRedirect=true&key=${GOOGLE_MAPS_API_KEY}`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
      console.warn(`[Place Photo Error ${response.status}]: Unable to fetch photo for ${name}`);
      return res.redirect('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80');
    }

    const data = await response.json();
    if (data.photoUri) {
      // Set cache headers for 1 day
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.redirect(302, data.photoUri);
    }

    return res.redirect('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80');
  } catch (err: any) {
    console.error('[Place Photo Proxy Exception]:', err);
    return res.redirect('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80');
  }
});

// Unhandled API Routes Fallback (404 Not Found)
app.all('/api/*', (_req, res) => {
  return res.status(404).json({
    success: false,
    error: 'API endpoint not found',
  });
});

// Safe Global Error Handler (No stack traces exposed)
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Global Server Error]:', err);
  return res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

// Vite Middleware / Static Assets serving
async function startServer() {
  // Test PostgreSQL and automatically apply database migrations if connected
  testConnection().then(async (status) => {
    if (status.connected) {
      console.log(`[PostgreSQL]: Database connected (${status.database}). Applying migrations...`);
      const migrationRes = await runMigrations();
      console.log('[PostgreSQL Migration Status]:', migrationRes.message);
    } else {
      console.log('[PostgreSQL]: Connection offline / not configured. Serving fallback data.');
    }
  }).catch((err) => {
    console.warn('[PostgreSQL Startup Check Error]:', err.message);
  });

  // Auto-detect production mode:
  // 1. NODE_ENV=production is set, OR
  // 2. Running from a compiled CJS bundle (process.argv[1] ends with .cjs or .js, not .ts), OR
  // 3. dist/index.html exists alongside this server file
  const fs = await import('fs');
  const distIndexPath = path.join(process.cwd(), 'dist', 'index.html');
  const hasDist = fs.existsSync(distIndexPath);
  const runningScript = process.argv[1] || '';
  const isCompiledBundle = runningScript.endsWith('.cjs') || (runningScript.endsWith('.js') && !runningScript.endsWith('server.ts'));
  const isProduction = process.env.NODE_ENV === 'production' || isCompiledBundle;

  if (isProduction && hasDist) {
    console.log('[Server]: Production mode — serving static dist assets.');
    const distPath = path.join(process.cwd(), 'dist');
    // Serve static assets first (JS, CSS, images, fonts, videos)
    app.use(express.static(distPath, {
      maxAge: '1d',
      index: false, // Don't auto-serve index.html for directories, we handle it via SPA fallback
    }));
    // SPA fallback: all non-API routes serve index.html
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    console.log('[Server]: Development mode — using Vite dev server middleware.');
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Auric Travels server running on http://0.0.0.0:${PORT} [Key Configured: ${Boolean(GOOGLE_MAPS_API_KEY)}]`);
  });
}

startServer();

