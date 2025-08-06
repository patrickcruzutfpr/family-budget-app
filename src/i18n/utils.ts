import { SupportedLanguage, Translation } from './types';

// Supported languages configuration
export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, { name: string; nativeName: string }> = {
  'en': { name: 'English', nativeName: 'English' },
  'pt-BR': { name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)' }
};

export const DEFAULT_LANGUAGE: SupportedLanguage = 'pt-BR';
export const LANGUAGE_STORAGE_KEY = 'family-budget-language';

// Language detection based on browser
export const detectBrowserLanguage = (): SupportedLanguage => {
  // Get browser language
  const browserLang = navigator.language || navigator.languages?.[0] || DEFAULT_LANGUAGE;
  
  // Check for exact match first
  if (browserLang in SUPPORTED_LANGUAGES) {
    return browserLang as SupportedLanguage;
  }
  
  // Check for language code match (e.g., 'pt' for 'pt-BR')
  const langCode = browserLang.split('-')[0];
  
  // Portuguese variants
  if (langCode === 'pt') {
    return 'pt-BR';
  }
  
  // English variants (en-US, en-GB, etc.)
  if (langCode === 'en') {
    return 'en';
  }
  
  // Fallback to default
  return DEFAULT_LANGUAGE;
};

// Get saved language or detect from browser
export const getInitialLanguage = (): SupportedLanguage => {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLanguage;
    if (saved && saved in SUPPORTED_LANGUAGES) {
      return saved;
    }
  } catch (error) {
    console.warn('Failed to get saved language:', error);
  }
  
  return detectBrowserLanguage();
};

// Save language preference
export const saveLanguagePreference = (language: SupportedLanguage): void => {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    console.warn('Failed to save language preference:', error);
  }
};

// Load translation file
export const loadTranslations = async (language: SupportedLanguage): Promise<Translation> => {
  try {
    const translations = await import(`./locales/${language}.json`);
    return translations.default || translations;
  } catch (error) {
    console.error(`Failed to load translations for ${language}:`, error);
    
    // Fallback to default language
    if (language !== DEFAULT_LANGUAGE) {
      return loadTranslations(DEFAULT_LANGUAGE);
    }
    
    throw new Error('Failed to load translations');
  }
};

// Get nested translation value
export const getTranslation = (translations: Translation, key: string, fallback?: string): string => {
  const keys = key.split('.');
  let current: any = translations;
  
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      return fallback || key;
    }
  }
  
  return typeof current === 'string' ? current : fallback || key;
};
