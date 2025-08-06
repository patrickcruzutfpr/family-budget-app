export type SupportedLanguage = 'en' | 'pt-BR';

export interface Translation {
  [key: string]: string | Translation;
}

export interface I18nState {
  language: SupportedLanguage;
  translations: Translation;
  isLoading: boolean;
}

export interface I18nContextType extends I18nState {
  setLanguage: (language: SupportedLanguage) => Promise<void>;
  setLanguageWithConfirmation: (language: SupportedLanguage, onBeforeChange?: () => Promise<boolean>) => Promise<void>;
  t: (key: string, fallback?: string) => string;
  detectBrowserLanguage: () => SupportedLanguage;
}
