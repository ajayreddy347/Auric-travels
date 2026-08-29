// Global Currency Management System for Auric Travel
// Default currency: Indian Rupee (₹ / INR) for the initial target market (India)
// Supports global currencies (USD, EUR, GBP, AED, JPY)

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'JPY';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  exchangeRateFromINR: number; // 1 INR = X foreign currency
  exchangeRateToINR: number; // 1 foreign currency = X INR
  locale: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    exchangeRateFromINR: 1,
    exchangeRateToINR: 1,
    locale: 'en-IN',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    exchangeRateFromINR: 0.012, // ~1 USD = 83.5 INR
    exchangeRateToINR: 83.5,
    locale: 'en-US',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    exchangeRateFromINR: 0.011, // ~1 EUR = 91 INR
    exchangeRateToINR: 91,
    locale: 'de-DE',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    exchangeRateFromINR: 0.0094, // ~1 GBP = 106 INR
    exchangeRateToINR: 106,
    locale: 'en-GB',
  },
  AED: {
    code: 'AED',
    symbol: 'AED ',
    name: 'UAE Dirham',
    exchangeRateFromINR: 0.044,
    exchangeRateToINR: 22.7,
    locale: 'ar-AE',
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    exchangeRateFromINR: 1.8,
    exchangeRateToINR: 0.56,
    locale: 'ja-JP',
  },
};

export const DEFAULT_CURRENCY: CurrencyCode = 'INR';

/**
 * Formats a monetary amount in the specified currency.
 * Default is INR (₹).
 */
export function formatCurrency(
  amountInINR: number,
  targetCurrency: CurrencyCode = 'INR',
  options?: {
    compact?: boolean;
    includeCode?: boolean;
    hideDecimals?: boolean;
  }
): string {
  const config = CURRENCIES[targetCurrency] || CURRENCIES.INR;
  const converted = targetCurrency === 'INR' ? amountInINR : amountInINR * config.exchangeRateFromINR;

  if (options?.compact) {
    if (targetCurrency === 'INR') {
      if (converted >= 10000000) {
        return `₹${(converted / 10000000).toFixed(1)} Cr`;
      }
      if (converted >= 100000) {
        return `₹${(converted / 100000).toFixed(1)} Lakh`;
      }
      if (converted >= 1000) {
        return `₹${Math.round(converted / 1000)}k`;
      }
    } else {
      if (converted >= 1000000) {
        return `${config.symbol}${(converted / 1000000).toFixed(1)}M`;
      }
      if (converted >= 1000) {
        return `${config.symbol}${Math.round(converted / 1000)}k`;
      }
    }
  }

  const formattedNum = Math.round(converted).toLocaleString(config.locale);
  const result = `${config.symbol}${formattedNum}`;
  return options?.includeCode ? `${result} ${config.code}` : result;
}

/**
 * Formats a dual-currency string (e.g. "₹45,000 (~$540)")
 */
export function formatDualCurrency(amountInINR: number, secondaryCurrency: CurrencyCode = 'USD'): string {
  const primary = formatCurrency(amountInINR, 'INR');
  const secondary = formatCurrency(amountInINR, secondaryCurrency);
  return `${primary} (${secondary})`;
}

/**
 * Safely parses any price string (whether in $, ₹, €, or plain numbers) into a standard INR amount.
 */
export function parsePriceToINR(priceStr: string | number): number {
  if (typeof priceStr === 'number') return priceStr;
  if (!priceStr) return 0;

  // Check if string contains INR / ₹
  const inrMatch = priceStr.match(/₹\s*([0-9,]+)/);
  if (inrMatch) {
    return parseInt(inrMatch[1].replace(/,/g, ''), 10);
  }

  // Check if string contains USD / $
  const usdMatch = priceStr.match(/\$\s*([0-9,]+)/);
  if (usdMatch) {
    const usdVal = parseInt(usdMatch[1].replace(/,/g, ''), 10);
    return Math.round(usdVal * CURRENCIES.USD.exchangeRateToINR);
  }

  // Check if string contains EUR / €
  const eurMatch = priceStr.match(/€\s*([0-9,]+)/);
  if (eurMatch) {
    const eurVal = parseInt(eurMatch[1].replace(/,/g, ''), 10);
    return Math.round(eurVal * CURRENCIES.EUR.exchangeRateToINR);
  }

  // Fallback: extract first numeric sequence
  const genericMatch = priceStr.match(/([0-9,]+)/);
  if (genericMatch) {
    const val = parseInt(genericMatch[1].replace(/,/g, ''), 10);
    return val < 1000 ? Math.round(val * 83.5) : val;
  }

  return 0;
}
