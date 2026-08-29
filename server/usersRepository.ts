import { getPool, isDbConfigured } from './config/db';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  google_id?: string | null;
  avatar_url?: string | null;
  auth_provider?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserPublicProfile {
  id: string;
  name: string;
  email: string;
  google_id?: string | null;
  avatar_url?: string | null;
  auth_provider?: string;
  created_at?: string;
  updated_at?: string;
}

// In-memory fallback map for resilience if PostgreSQL is offline
const inMemoryUsers: Map<string, UserRecord> = new Map();

function generateUserId(): string {
  return `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export class UsersRepository {
  /**
   * Find user record by email (includes password_hash for internal credential check)
   */
  public static async findByEmail(email: string): Promise<UserRecord | null> {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();

    if (isDbConfigured()) {
      try {
        const pool = getPool();
        const res = await pool.query(
          'SELECT * FROM users WHERE LOWER(email) = $1 LIMIT 1;',
          [cleanEmail]
        );
        if (res.rows && res.rows.length > 0) {
          return res.rows[0];
        }
      } catch (dbErr: any) {
        console.warn('[UsersRepository] Postgres query bypassed, checking in-memory store:', dbErr.message);
      }
    }

    // In-memory fallback
    for (const user of inMemoryUsers.values()) {
      if (user.email.toLowerCase() === cleanEmail) {
        return user;
      }
    }

    return null;
  }

  /**
   * Find user record by Google subject identifier (sub / google_id)
   */
  public static async findByGoogleId(googleId: string): Promise<UserRecord | null> {
    if (!googleId) return null;
    const cleanGoogleId = googleId.trim();

    if (isDbConfigured()) {
      try {
        const pool = getPool();
        const res = await pool.query(
          'SELECT * FROM users WHERE google_id = $1 LIMIT 1;',
          [cleanGoogleId]
        );
        if (res.rows && res.rows.length > 0) {
          return res.rows[0];
        }
      } catch (dbErr: any) {
        console.warn('[UsersRepository] Postgres findByGoogleId fallback:', dbErr.message);
      }
    }

    for (const user of inMemoryUsers.values()) {
      if (user.google_id === cleanGoogleId) {
        return user;
      }
    }

    return null;
  }

  /**
   * Find user public profile by ID (excludes password_hash)
   */
  public static async findById(id: string): Promise<UserPublicProfile | null> {
    if (!id) return null;
    const cleanId = id.trim();

    if (isDbConfigured()) {
      try {
        const pool = getPool();
        const res = await pool.query(
          'SELECT id, name, email, google_id, avatar_url, auth_provider, created_at, updated_at FROM users WHERE id = $1 LIMIT 1;',
          [cleanId]
        );
        if (res.rows && res.rows.length > 0) {
          const row = res.rows[0];
          return {
            id: row.id,
            name: row.name,
            email: row.email,
            google_id: row.google_id,
            avatar_url: row.avatar_url,
            auth_provider: row.auth_provider,
            created_at: row.created_at,
            updated_at: row.updated_at,
          };
        }
      } catch (dbErr: any) {
        console.warn('[UsersRepository] Postgres getById fallback:', dbErr.message);
      }
    }

    const user = inMemoryUsers.get(cleanId);
    if (user) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        google_id: user.google_id,
        avatar_url: user.avatar_url,
        auth_provider: user.auth_provider,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };
    }

    return null;
  }

  /**
   * Link an existing account with a verified Google ID and avatar
   */
  public static async linkGoogleAccount(userId: string, googleId: string, avatarUrl?: string): Promise<UserPublicProfile | null> {
    if (!userId || !googleId) return null;
    const cleanId = userId.trim();
    const cleanGoogleId = googleId.trim();
    const now = new Date().toISOString();

    if (isDbConfigured()) {
      try {
        const pool = getPool();
        const res = await pool.query(
          `UPDATE users 
           SET google_id = $1, 
               avatar_url = COALESCE(avatar_url, $2),
               updated_at = $3
           WHERE id = $4
           RETURNING id, name, email, google_id, avatar_url, auth_provider, created_at, updated_at;`,
          [cleanGoogleId, avatarUrl || null, now, cleanId]
        );
        if (res.rows && res.rows.length > 0) {
          return res.rows[0];
        }
      } catch (dbErr: any) {
        console.warn('[UsersRepository] Postgres linkGoogleAccount fallback:', dbErr.message);
      }
    }

    const existing = inMemoryUsers.get(cleanId);
    if (existing) {
      existing.google_id = cleanGoogleId;
      if (avatarUrl && !existing.avatar_url) existing.avatar_url = avatarUrl;
      existing.updated_at = now;
      return {
        id: existing.id,
        name: existing.name,
        email: existing.email,
        google_id: existing.google_id,
        avatar_url: existing.avatar_url,
        auth_provider: existing.auth_provider,
        created_at: existing.created_at,
        updated_at: existing.updated_at,
      };
    }

    return null;
  }

  /**
   * Get all users (used for admin/demo fallback)
   */
  public static async getAll(): Promise<UserRecord[]> {
    if (isDbConfigured()) {
      try {
        const pool = getPool();
        const res = await pool.query('SELECT * FROM users ORDER BY created_at ASC LIMIT 10;');
        if (res.rows && res.rows.length > 0) {
          return res.rows;
        }
      } catch (dbErr: any) {
        console.warn('[UsersRepository] Postgres getAll fallback:', dbErr.message);
      }
    }
    return Array.from(inMemoryUsers.values());
  }

  /**
   * Create a new user with hashed password (and optional Google credentials)
   */
  public static async create(
    name: string,
    email: string,
    passwordHash: string,
    googleId?: string,
    avatarUrl?: string,
    authProvider: string = 'local'
  ): Promise<UserPublicProfile> {
    const id = generateUserId();
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanGoogleId = googleId?.trim() || null;
    const now = new Date().toISOString();

    const record: UserRecord = {
      id,
      name: cleanName,
      email: cleanEmail,
      password_hash: passwordHash,
      google_id: cleanGoogleId,
      avatar_url: avatarUrl || null,
      auth_provider: authProvider,
      created_at: now,
      updated_at: now,
    };

    inMemoryUsers.set(id, record);

    if (isDbConfigured()) {
      try {
        const pool = getPool();
        try {
          const res = await pool.query(
            `INSERT INTO users (id, name, email, password_hash, google_id, avatar_url, auth_provider, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING id, name, email, google_id, avatar_url, auth_provider, created_at, updated_at;`,
            [id, cleanName, cleanEmail, passwordHash, cleanGoogleId, avatarUrl || null, authProvider, now, now]
          );
          if (res.rows && res.rows.length > 0) {
            const row = res.rows[0];
            return {
              id: row.id,
              name: row.name,
              email: row.email,
              google_id: row.google_id,
              avatar_url: row.avatar_url,
              auth_provider: row.auth_provider,
              created_at: row.created_at,
              updated_at: row.updated_at,
            };
          }
        } catch {
          // Resilient fallback for base users schema
          const fallbackRes = await pool.query(
            `INSERT INTO users (id, name, email, password_hash, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, name, email, created_at, updated_at;`,
            [id, cleanName, cleanEmail, passwordHash, now, now]
          );
          if (fallbackRes.rows && fallbackRes.rows.length > 0) {
            const row = fallbackRes.rows[0];
            return {
              id: row.id,
              name: row.name,
              email: row.email,
              google_id: cleanGoogleId,
              avatar_url: avatarUrl || null,
              auth_provider: authProvider,
              created_at: row.created_at,
              updated_at: row.updated_at,
            };
          }
        }
      } catch (dbErr: any) {
        console.warn('[UsersRepository] Postgres insert fallback:', dbErr.message);
      }
    }

    return {
      id: record.id,
      name: record.name,
      email: record.email,
      google_id: record.google_id,
      avatar_url: record.avatar_url,
      auth_provider: record.auth_provider,
      created_at: record.created_at,
      updated_at: record.updated_at,
    };
  }

  /**
   * Updates a user's password securely
   */
  public static async updatePassword(userId: string, newPasswordHash: string): Promise<boolean> {
    if (!userId || !newPasswordHash) return false;
    const now = new Date().toISOString();

    const inMem = inMemoryUsers.get(userId);
    if (inMem) {
      inMem.password_hash = newPasswordHash;
      inMem.updated_at = now;
    }

    if (isDbConfigured()) {
      try {
        const pool = getPool();
        const res = await pool.query(
          'UPDATE users SET password_hash = $1, updated_at = $2 WHERE id = $3 RETURNING id;',
          [newPasswordHash, now, userId]
        );
        if (res.rows && res.rows.length > 0) {
          return true;
        }
      } catch (dbErr: any) {
        console.warn('[UsersRepository] Postgres updatePassword fallback:', dbErr.message);
      }
    }

    return inMem !== undefined;
  }
}

