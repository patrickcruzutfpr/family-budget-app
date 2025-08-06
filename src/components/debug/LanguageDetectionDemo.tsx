import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/context';
import { detectBrowserLanguage, getInitialLanguage } from '../../i18n/utils';
import { getCurrentProfile, checkAndUpdateDefaultProfileLanguage } from '../../services/profileService';
import { CategoryService } from '../../services/categoryService';

/**
 * Component to test and demonstrate the complete language detection flow
 */
export const LanguageDetectionDemo: React.FC = () => {
  const { t, language } = useI18n();
  const [testResults, setTestResults] = useState<{
    browserLanguage: string;
    initialLanguage: string;
    currentLanguage: string;
    profileLanguage: string;
    defaultCategories: any[];
    detectionFlow: string[];
  } | null>(null);

  const runDetectionTest = () => {
    const flow: string[] = [];
    
    // Step 1: Browser language detection
    const browserLang = detectBrowserLanguage();
    flow.push(`1. Browser language detected: ${browserLang}`);
    
    // Step 2: Initial language (saved or browser)
    const initialLang = getInitialLanguage();
    flow.push(`2. Initial language (saved preference or browser): ${initialLang}`);
    
    // Step 3: Current profile
    const profile = getCurrentProfile();
    const firstCategoryName = profile.budget.length > 0 ? profile.budget[0].name : 'No categories';
    flow.push(`3. Current profile has categories: ${profile.budget.length}, first category: "${firstCategoryName}"`);
    
    // Step 4: Check if profile language sync needed
    const wasUpdated = checkAndUpdateDefaultProfileLanguage();
    flow.push(`4. Profile language sync needed: ${wasUpdated ? 'Yes - Updated' : 'No - Already synced'}`);
    
    // Step 5: Get default categories to show language integration
    const defaultCategories = CategoryService.getDefaultCategories();
    flow.push(`5. Default categories would be created in language: ${initialLang}`);
    
    setTestResults({
      browserLanguage: browserLang,
      initialLanguage: initialLang,
      currentLanguage: language,
      profileLanguage: firstCategoryName.includes('Renda') ? 'pt-BR' : 'en',
      defaultCategories: defaultCategories.map(cat => ({ name: cat.name, type: cat.type })),
      detectionFlow: flow
    });
  };

  const simulateFirstVisit = () => {
    // Clear language preference to simulate first visit
    localStorage.removeItem('family-budget-language');
    
    // Clear profile data
    localStorage.removeItem('family-budget-profiles');
    localStorage.removeItem('family-budget-current-profile');
    
    // Force page reload to simulate fresh visit
    window.location.reload();
  };

  useEffect(() => {
    // Auto-run test on mount
    runDetectionTest();
  }, [language]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          🌐 {t('languageDetection.title', 'Language Detection Demo')}
        </h2>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <button 
              onClick={runDetectionTest}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {t('languageDetection.runTest', 'Run Detection Test')}
            </button>
            
            <button 
              onClick={simulateFirstVisit}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
            >
              {t('languageDetection.simulateFirstVisit', 'Simulate First Visit')}
            </button>
          </div>

          {testResults && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    {t('languageDetection.currentState', 'Current State')}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Browser Language:</strong> {testResults.browserLanguage}</div>
                    <div><strong>Initial Language:</strong> {testResults.initialLanguage}</div>
                    <div><strong>Current Language:</strong> {testResults.currentLanguage}</div>
                    <div><strong>Profile Language:</strong> {testResults.profileLanguage}</div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    {t('languageDetection.sampleCategories', 'Sample Categories')}
                  </h3>
                  <div className="space-y-1 text-sm">
                    {testResults.defaultCategories.slice(0, 5).map((cat, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{cat.name}</span>
                        <span className="text-gray-500">{cat.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">
                  {t('languageDetection.detectionFlow', 'Detection Flow')}
                </h3>
                <ol className="space-y-2 text-sm">
                  {testResults.detectionFlow.map((step, index) => (
                    <li key={index} className="flex">
                      <span className="text-blue-600 mr-2">{index + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">
              {t('languageDetection.howItWorks', 'How Language Detection Works')}
            </h3>
            <div className="text-sm text-green-700 space-y-1">
              <p>• {t('languageDetection.step1', 'Detects browser language using navigator.language')}</p>
              <p>• {t('languageDetection.step2', 'Falls back to supported language (pt-BR or en)')}</p>
              <p>• {t('languageDetection.step3', 'Checks for saved language preference in localStorage')}</p>
              <p>• {t('languageDetection.step4', 'Syncs profile language with detected/saved language')}</p>
              <p>• {t('languageDetection.step5', 'Creates default categories in correct language')}</p>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">
              {t('languageDetection.currentBrowser', 'Your Browser Info')}
            </h3>
            <div className="text-sm text-yellow-700 space-y-1">
              <p><strong>navigator.language:</strong> {navigator.language}</p>
              <p><strong>navigator.languages:</strong> {navigator.languages?.join(', ') || 'Not available'}</p>
              <p><strong>Detected language:</strong> {detectBrowserLanguage()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageDetectionDemo;
