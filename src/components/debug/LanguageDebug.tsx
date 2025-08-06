import React from 'react';
import { useI18n } from '@/i18n';

export const LanguageDebug: React.FC = () => {
  const { language, isLoading, detectBrowserLanguage } = useI18n();
  
  if (isLoading) {
    return <div>Loading translations...</div>;
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg text-sm">
      <h3 className="font-bold mb-2">i18n Debug Info:</h3>
      <p>Current Language: <strong>{language}</strong></p>
      <p>Browser Language: <strong>{navigator.language}</strong></p>
      <p>Browser Languages: <strong>{navigator.languages?.join(', ')}</strong></p>
      <p>Detected Language: <strong>{detectBrowserLanguage()}</strong></p>
    </div>
  );
};
