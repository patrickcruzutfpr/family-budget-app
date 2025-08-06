import { useI18n } from '../i18n';
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatNumber,
  formatPercentage,
  parseCurrency,
  getCurrencySymbol,
  getDateFormatPattern,
  isValidCurrencyFormat
} from '../utils/formatters';

/**
 * Hook for locale-aware formatting functions
 */
export function useFormatters() {
  const { language } = useI18n();

  return {
    // Currency formatting
    formatCurrency: (amount: number) => formatCurrency(amount, language),
    parseCurrency: (value: string) => parseCurrency(value, language),
    getCurrencySymbol: () => getCurrencySymbol(language),
    isValidCurrencyFormat: (value: string) => isValidCurrencyFormat(value, language),
    
    // Number formatting
    formatNumber: (value: number) => formatNumber(value, language),
    formatPercentage: (value: number) => formatPercentage(value, language),
    
    // Date formatting
    formatDate: (date: Date) => formatDate(date, language),
    formatDateTime: (date: Date) => formatDateTime(date, language),
    getDateFormatPattern: () => getDateFormatPattern(language),
    
    // Current locale info
    locale: language,
    isPortuguese: language === 'pt-BR',
    isEnglish: language === 'en'
  };
}

export default useFormatters;
