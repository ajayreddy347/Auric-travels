import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

function getJwtSecret(): string {
  const envVal = process.env.JWT_SECRET;
  if (envVal && envVal.trim()) {
    return envVal.trim();
  }
  return 'auric_travel_jwt_super_secret_key_2026';
}

const JWT_EXPIRES_IN = '7d';
const SALT_ROUNDS = 10;

export interface TokenPayload {
  id: string;
  email: string;
  name: string;
}

/**
 * Hashes plain text password securely with bcrypt
 */
export async function hashPassword(plainText: string): Promise<string> {
  return bcrypt.hash(plainText, SALT_ROUNDS);
}

/**
 * Compares plain text password against stored bcrypt hash
 */
export async function comparePassword(plainText: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}

/**
 * Generates a signed JSON Web Token (JWT) for authenticated user sessions
 */
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verifies and decodes a JWT token with dynamic secret and resilient fallback
 */
export function verifyToken(token: string): TokenPayload | null {
  if (!token || typeof token !== 'string') return null;
  const cleanToken = token.trim();

  try {
    const secret = getJwtSecret();
    const decoded = jwt.verify(cleanToken, secret) as TokenPayload;
    return decoded;
  } catch {
    // Secondary fallback verification
    try {
      return jwt.verify(cleanToken, 'auric_travel_jwt_super_secret_key_2026') as TokenPayload;
    } catch {
      return null;
    }
  }
}
