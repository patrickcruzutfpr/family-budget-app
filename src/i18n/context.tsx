import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { I18nContextType, SupportedLanguage, Translation } from './types';
import { 
  getInitialLanguage, 
  saveLanguagePreference, 
  loadTranslations, 
  getTranslation,
  detectBrowserLanguage 
} from './utils';

// Create context
const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Provider component
interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(getInitialLanguage());
  const [translations, setTranslations] = useState<Translation>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load translations for current language
  const loadLanguageTranslations = async (lang: SupportedLanguage) => {
    try {
      setIsLoading(true);
      const newTranslations = await loadTranslations(lang);
      setTranslations(newTranslations);
    } catch (error) {
      console.error('Failed to load translations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Change language
  const setLanguage = async (newLanguage: SupportedLanguage) => {
    if (newLanguage === language) return;
    
    setLanguageState(newLanguage);
    saveLanguagePreference(newLanguage);
    await loadLanguageTranslations(newLanguage);
  };

  // Translation function
  const t = (key: string, fallback?: string): string => {
    return getTranslation(translations, key, fallback);
  };

  // Initialize translations on mount
  useEffect(() => {
    loadLanguageTranslations(language);
  }, []);

  // Listen for language changes in other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'family-budget-language' && e.newValue) {
        const newLang = e.newValue as SupportedLanguage;
        if (newLang !== language) {
          setLanguage(newLang);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [language, setLanguage]);

  const contextValue: I18nContextType = {
    language,
    translations,
    isLoading,
    setLanguage,
    t,
    detectBrowserLanguage,
  };

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
};

// Hook to use i18n
export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
