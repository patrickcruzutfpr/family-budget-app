import React, { useState } from 'react';
import { useI18n, SupportedLanguage, SUPPORTED_LANGUAGES } from '@/i18n';
import { useSavedSuggestions } from '@/hooks/useSavedSuggestions';
import { LanguageChangeModal } from './LanguageChangeModal';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguageWithConfirmation } = useI18n();
  const { hasUnsavedSuggestions, saveAllCurrent, unsavedSuggestions } = useSavedSuggestions(language);
  
  const [showModal, setShowModal] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState<SupportedLanguage>('pt-BR');

  const handleLanguageChange = async (newLanguage: SupportedLanguage) => {
    if (newLanguage === language) return;
    
    setTargetLanguage(newLanguage);
    
    await setLanguageWithConfirmation(newLanguage, async () => {
      if (hasUnsavedSuggestions) {
        setShowModal(true);
        return false; // Block the change until user confirms
      }
      return true; // Allow immediate change
    });
  };

  const handleConfirm = async () => {
    setShowModal(false);
    await setLanguageWithConfirmation(targetLanguage, async () => true);
  };

  const handleSaveAndConfirm = async () => {
    const savedCount = saveAllCurrent();
    setShowModal(false);
    await setLanguageWithConfirmation(targetLanguage, async () => true);
  };

  const handleCancel = () => {
    setShowModal(false);
    // Reset the select to current language
    const selectElement = document.querySelector('select[aria-label="Select language"]') as HTMLSelectElement;
    if (selectElement) {
      selectElement.value = language;
    }
  };

  const getLanguageDisplayName = (lang: SupportedLanguage) => {
    return SUPPORTED_LANGUAGES[lang]?.nativeName || lang;
  };

  return (
    <>
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

      <LanguageChangeModal
        isOpen={showModal}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        onSaveAndConfirm={handleSaveAndConfirm}
        hasUnsavedSuggestions={hasUnsavedSuggestions}
        unsavedCount={unsavedSuggestions.length}
        targetLanguage={getLanguageDisplayName(targetLanguage)}
      />
    </>
  );
};
