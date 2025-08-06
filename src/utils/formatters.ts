/**
 * Utility functions for locale-specific formatting (currency, dates, numbers)
 */

export interface LocaleConfig {
  currency: {
    symbol: string;
    code: string;
    locale: string;
  };
  date: {
    locale: string;
    format: string;
  };
  number: {
    locale: string;
  };
}

export const LOCALE_CONFIGS: Record<string, LocaleConfig> = {
  'pt-BR': {
    currency: {
      symbol: 'R$',
      code: 'BRL',
      locale: 'pt-BR'
    },
    date: {
      locale: 'pt-BR',
      format: 'dd/MM/yyyy'
    },
    number: {
      locale: 'pt-BR'
    }
  },
  'en': {
    currency: {
      symbol: '$',
      code: 'USD',
      locale: 'en-US'
    },
    date: {
      locale: 'en-US',
      format: 'MM/dd/yyyy'
    },
    number: {
      locale: 'en-US'
    }
  }
};

/**
 * Format currency based on current locale
 */
export function formatCurrency(amount: number, locale: string = 'pt-BR'): string {
  const config = LOCALE_CONFIGS[locale] || LOCALE_CONFIGS['pt-BR'];
  
  return new Intl.NumberFormat(config.currency.locale, {
    style: 'currency',
    currency: config.currency.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Format number based on current locale
 */
export function formatNumber(value: number, locale: string = 'pt-BR'): string {
  const config = LOCALE_CONFIGS[locale] || LOCALE_CONFIGS['pt-BR'];
  
  return new Intl.NumberFormat(config.number.locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Parse currency string to number (removes currency symbols and locale formatting)
 */
export function parseCurrency(value: string, locale: string = 'pt-BR'): number {
  const config = LOCALE_CONFIGS[locale] || LOCALE_CONFIGS['pt-BR'];
  
  // Remove currency symbols and spaces
  let cleanValue = value
    .replace(config.currency.symbol, '')
    .replace(/\s/g, '')
    .trim();
  
  // Handle locale-specific decimal separators
  if (locale === 'pt-BR') {
    // Brazilian format: R$ 1.234,56
    cleanValue = cleanValue
      .replace(/\./g, '') // Remove thousands separator
      .replace(',', '.'); // Convert decimal separator
  } else {
    // US format: $1,234.56
    cleanValue = cleanValue.replace(/,/g, ''); // Remove thousands separator
  }
  
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Format date based on current locale
 */
export function formatDate(date: Date, locale: string = 'pt-BR'): string {
  const config = LOCALE_CONFIGS[locale] || LOCALE_CONFIGS['pt-BR'];
  
  return new Intl.DateTimeFormat(config.date.locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

/**
 * Format date and time based on current locale
 */
export function formatDateTime(date: Date, locale: string = 'pt-BR'): string {
  const config = LOCALE_CONFIGS[locale] || LOCALE_CONFIGS['pt-BR'];
  
  return new Intl.DateTimeFormat(config.date.locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date);
}

/**
 * Get locale-specific date format pattern for input placeholders
 */
export function getDateFormatPattern(locale: string = 'pt-BR'): string {
  const config = LOCALE_CONFIGS[locale] || LOCALE_CONFIGS['pt-BR'];
  return config.date.format;
}

/**
 * Get currency symbol for current locale
 */
export function getCurrencySymbol(locale: string = 'pt-BR'): string {
  const config = LOCALE_CONFIGS[locale] || LOCALE_CONFIGS['pt-BR'];
  return config.currency.symbol;
}

/**
 * Validate if a string is a valid currency format for the locale
 */
export function isValidCurrencyFormat(value: string, locale: string = 'pt-BR'): boolean {
  if (!value || value.trim() === '') return false;
  
  const config = LOCALE_CONFIGS[locale] || LOCALE_CONFIGS['pt-BR'];
  
  // Remove currency symbol and spaces
  let cleanValue = value
    .replace(config.currency.symbol, '')
    .replace(/\s/g, '')
    .trim();
  
  if (locale === 'pt-BR') {
    // Brazilian format validation: accepts 1234,56 or 1.234,56
    return /^\d{1,3}(\.\d{3})*,\d{2}$|^\d+,\d{2}$|^\d+$/.test(cleanValue);
  } else {
    // US format validation: accepts 1234.56 or 1,234.56
    return /^\d{1,3}(,\d{3})*\.\d{2}$|^\d+\.\d{2}$|^\d+$/.test(cleanValue);
  }
}

/**
 * Format percentage based on current locale
 */
export function formatPercentage(value: number, locale: string = 'pt-BR'): string {
  const config = LOCALE_CONFIGS[locale] || LOCALE_CONFIGS['pt-BR'];
  
  return new Intl.NumberFormat(config.number.locale, {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
}
