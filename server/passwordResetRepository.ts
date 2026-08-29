import { getPool, isDbConfigured } from './config/db';

export interface PasswordResetRecord {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: string;
  used_at?: string | null;
  created_at: string;
}

const inMemoryTokens: Map<string, PasswordResetRecord> = new Map();

function generateResetId(): string {
  return `pr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export class PasswordResetRepository {
  /**
   * Stores a new password reset token hash with expiration
   */
  public static async createResetToken(
    userId: string,
    tokenHash: string,
    expiresAt: Date
  ): Promise<PasswordResetRecord> {
    const id = generateResetId();
    const now = new Date().toISOString();
    const expiresStr = expiresAt.toISOString();

    const record: PasswordResetRecord = {
      id,
      user_id: userId,
      token_hash: tokenHash,
      expires_at: expiresStr,
      used_at: null,
      created_at: now,
    };

    inMemoryTokens.set(id, record);

    if (isDbConfigured()) {
      try {
        const pool = getPool();
        const res = await pool.query(
          `INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at, used_at, created_at)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING *;`,
          [id, userId, tokenHash, expiresStr, null, now]
        );
        if (res.rows && res.rows.length > 0) {
          return res.rows[0];
        }
      } catch (dbErr: any) {
        console.warn('[PasswordResetRepository] Postgres insert fallback:', dbErr.message);
      }
    }

    return record;
  }

  /**
   * Finds an active, unexpired, and unused reset token by its SHA-256 hash
   */
  public static async findValidToken(tokenHash: string): Promise<PasswordResetRecord | null> {
    if (!tokenHash) return null;
    const now = new Date();

    if (isDbConfigured()) {
      try {
        const pool = getPool();
        const res = await pool.query(
          `SELECT * FROM password_reset_tokens 
           WHERE token_hash = $1 
             AND used_at IS NULL 
             AND expires_at > NOW() 
           LIMIT 1;`,
          [tokenHash]
        );
        if (res.rows && res.rows.length > 0) {
          return res.rows[0];
        }
      } catch (dbErr: any) {
        console.warn('[PasswordResetRepository] Postgres query fallback:', dbErr.message);
      }
    }

    // In-memory fallback
    for (const record of inMemoryTokens.values()) {
      if (
        record.token_hash === tokenHash &&
        !record.used_at &&
        new Date(record.expires_at) > now
      ) {
        return record;
      }
    }

    return null;
  }

  /**
   * Marks a reset token as used immediately to enforce single-use protection
   */
  public static async markTokenUsed(tokenId: string): Promise<void> {
    const now = new Date().toISOString();

    const inMem = inMemoryTokens.get(tokenId);
    if (inMem) {
      inMem.used_at = now;
    }

    if (isDbConfigured()) {
      try {
        const pool = getPool();
        await pool.query(
          'UPDATE password_reset_tokens SET used_at = $1 WHERE id = $2;',
          [now, tokenId]
        );
      } catch (dbErr: any) {
        console.warn('[PasswordResetRepository] Postgres markTokenUsed fallback:', dbErr.message);
      }
    }
  }

  /**
   * Invalidates all existing pending reset tokens for a user after a successful password change
   */
  public static async invalidateUserTokens(userId: string): Promise<void> {
    const now = new Date().toISOString();

    for (const record of inMemoryTokens.values()) {
      if (record.user_id === userId && !record.used_at) {
        record.used_at = now;
      }
    }

    if (isDbConfigured()) {
      try {
        const pool = getPool();
        await pool.query(
          'UPDATE password_reset_tokens SET used_at = $1 WHERE user_id = $2 AND used_at IS NULL;',
          [now, userId]
        );
      } catch (dbErr: any) {
        console.warn('[PasswordResetRepository] Postgres invalidateUserTokens fallback:', dbErr.message);
      }
    }
  }

  /**
   * Counts recent reset requests for a user within a time window (rate limiting)
   */
  public static async countRecentRequests(userId: string, windowMinutes: number = 15): Promise<number> {
    const threshold = new Date(Date.now() - windowMinutes * 60 * 1000);

    if (isDbConfigured()) {
      try {
        const pool = getPool();
        const res = await pool.query(
          `SELECT COUNT(*) as count FROM password_reset_tokens 
           WHERE user_id = $1 AND created_at > $2;`,
          [userId, threshold.toISOString()]
        );
        if (res.rows && res.rows.length > 0) {
          return parseInt(res.rows[0].count, 10) || 0;
        }
      } catch (dbErr: any) {
        console.warn('[PasswordResetRepository] Postgres countRecentRequests fallback:', dbErr.message);
      }
    }

    let count = 0;
    for (const record of inMemoryTokens.values()) {
      if (record.user_id === userId && new Date(record.created_at) > threshold) {
        count++;
      }
    }
    return count;
  }
}
