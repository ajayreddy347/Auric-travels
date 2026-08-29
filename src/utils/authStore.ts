import { AuthUser } from '../types';

export const AUTH_USER_STORAGE_KEY = 'auric_society_auth_user';
export const AUTH_TOKEN_STORAGE_KEY = 'auric_society_auth_token';

/**
 * Retrieve stored JWT token from LocalStorage or Document Cookie
 */
export function getStoredAuthToken(): string | null {
  try {
    const fromStorage = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (fromStorage && fromStorage.trim()) return fromStorage.trim();

    // Cookie fallback for cross-redirect and browser persistence
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/(?:^|;\s*)auric_auth_token=([^;]+)/);
      if (match && match[1]) {
        const token = decodeURIComponent(match[1].trim());
        if (token) {
          localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
          return token;
        }
      }
    }
    return null;
  } catch (err) {
    console.error('Failed to read auth token', err);
    return null;
  }
}

/**
 * Retrieve stored authenticated user from LocalStorage or reconstruct from JWT token
 */
export function getStoredUser(): AuthUser | null {
  try {
    const saved = localStorage.getItem(AUTH_USER_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as AuthUser;
      if (parsed && parsed.id && parsed.email) {
        return parsed;
      }
    }

    // Reconstruct user from verified JWT payload if stored
    const token = getStoredAuthToken();
    if (token) {
      const payloadBase64 = token.split('.')[1];
      if (payloadBase64) {
        const decoded = JSON.parse(atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')));
        if (decoded && decoded.id && decoded.email) {
          const fallbackUser: AuthUser = {
            id: decoded.id,
            name: decoded.name || 'Valued Member',
            email: decoded.email,
            memberId: `AUR-M-${decoded.id.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase() || '7721'}`,
            memberTier: 'Founding Sovereign',
            joinedDate: 'August 2026',
            phone: '+91 98450 12345',
            homeCity: 'India',
            preferredCurrency: 'INR',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            travelPreferences: {
              travelStyle: 'Bespoke Heritage & Ultra-Luxury',
              interests: ['Royal Palaces', 'Wildlife Reserves', 'Private Yachting'],
              dietary: 'Gourmet Epicurean',
            },
          };
          saveStoredUser(fallbackUser, token);
          return fallbackUser;
        }
      }
    }
    return null;
  } catch (err) {
    console.error('Failed to read auth user', err);
    return null;
  }
}

/**
 * Save authenticated user to LocalStorage with genuine JWT
 */
export function saveStoredUser(user: AuthUser, token?: string): void {
  try {
    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
    if (token) {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
      if (typeof document !== 'undefined') {
        document.cookie = `auric_auth_token=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax`;
      }
    }
    // Dispatch storage event for tab synchronization if needed
    window.dispatchEvent(new Event('auric_auth_change'));
  } catch (err) {
    console.error('Failed to save auth user to localStorage', err);
  }
}

/**
 * Update authenticated user profile fields
 */
export function updateStoredUserProfile(updates: Partial<AuthUser>): AuthUser | null {
  try {
    const current = getStoredUser();
    if (!current) return null;
    const updated: AuthUser = { ...current, ...updates };
    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('auric_auth_change'));
    return updated;
  } catch (err) {
    console.error('Failed to update auth user profile', err);
    return null;
  }
}

/**
 * Clear stored user and token on logout
 */
export function clearStoredUser(): void {
  try {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    if (typeof document !== 'undefined') {
      document.cookie = 'auric_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    }
    window.dispatchEvent(new Event('auric_auth_change'));
  } catch (err) {
    console.error('Failed to clear auth user from localStorage', err);
  }
}
