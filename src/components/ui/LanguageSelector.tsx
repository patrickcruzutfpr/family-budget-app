import React from 'react';
import { useI18n, SupportedLanguage, SUPPORTED_LANGUAGES } from '@/i18n';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useI18n();

  const handleLanguageChange = (newLanguage: SupportedLanguage) => {
    setLanguage(newLanguage);
  };

  return (
    <div className="relative">
      <select
        value={language}
        onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
        className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors cursor-pointer"
        aria-label="Select language"
      >
        {Object.entries(SUPPORTED_LANGUAGES).map(([code, info]) => (
          <option key={code} value={code}>
            {info.nativeName}
          </option>
        ))}
      </select>
      
      {/* Custom dropdown arrow */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
        </svg>
      </div>
    </div>
  );
};
