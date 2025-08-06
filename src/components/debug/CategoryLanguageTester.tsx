import React, { useState } from 'react';
import { useI18n } from '@/i18n';
import { 
  resetToDefault, 
  getCurrentProfile,
  getAllProfiles,
  checkAndUpdateDefaultProfileLanguage,
  recreateDefaultProfileWithCurrentLanguage 
} from '@/services/profileService';
import { getInitialLanguage } from '@/i18n/utils';

interface TestResult {
  success: boolean;
  message: string;
  details?: any;
}

export const CategoryLanguageTester: React.FC = () => {
  const { t, language, setLanguage } = useI18n();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (result: TestResult) => {
    setTestResults(prev => [...prev, result]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const testCategoryLanguage = async () => {
    try {
      // 1. Check current language settings
      const browserLanguage = navigator.language;
      const storedLanguage = localStorage.getItem('family-budget-language');
      const initialLanguage = getInitialLanguage();
      const currentLanguage = language;

      addResult({
        success: true,
        message: 'Language Detection Analysis',
        details: {
          browserLanguage,
          storedLanguage,
          initialLanguage,
          currentLanguage,
          match: initialLanguage === currentLanguage
        }
      });

      // 2. Check current profile categories
      const currentProfile = getCurrentProfile();
      const categoryNames = currentProfile.budget.map(cat => cat.name);

      addResult({
        success: true,
        message: 'Current Profile Categories',
        details: {
          profileId: currentProfile.id,
          profileName: currentProfile.name,
          categories: categoryNames,
          language: currentLanguage
        }
      });

      // 3. Check if categories match expected language
      const expectedCategories = currentLanguage === 'pt-BR' 
        ? ['Renda', 'Habitação', 'Alimentação', 'Transporte']
        : ['Income', 'Housing', 'Food', 'Transportation'];

      const hasCorrectCategories = expectedCategories.every(expected => 
        categoryNames.includes(expected)
      );

      addResult({
        success: hasCorrectCategories,
        message: hasCorrectCategories 
          ? `✅ Categories are in correct language (${currentLanguage})` 
          : `❌ Categories are NOT in correct language`,
        details: { 
          expected: expectedCategories, 
          actual: categoryNames,
          language: currentLanguage 
        }
      });

    } catch (error) {
      addResult({
        success: false,
        message: `Test failed: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  };

  const testLanguageSwitch = async () => {
    try {
      const originalLanguage = language;
      
      addResult({
        success: true,
        message: `Starting language switch test from: ${originalLanguage}`
      });

      // Switch to opposite language
      const newLanguage = originalLanguage === 'pt-BR' ? 'en' : 'pt-BR';
      await setLanguage(newLanguage);

      // Wait for language change to take effect
      await new Promise(resolve => setTimeout(resolve, 500));

      addResult({
        success: true,
        message: `Language switched to: ${newLanguage}`
      });

      // Get profile after language change
      const profileAfterSwitch = getCurrentProfile();
      const categoriesAfterSwitch = profileAfterSwitch.budget.map(cat => cat.name);

      addResult({
        success: true,
        message: 'Categories after language switch',
        details: {
          newLanguage,
          categories: categoriesAfterSwitch,
          note: 'Existing categories should NOT change, only new profiles should use new language'
        }
      });

      // Reset profile to test new default creation
      const resetProfile = resetToDefault();
      const resetCategories = resetProfile.budget.map(cat => cat.name);

      const expectedAfterReset = newLanguage === 'pt-BR'
        ? ['Renda', 'Habitação', 'Alimentação', 'Transporte']
        : ['Income', 'Housing', 'Food', 'Transportation'];

      const resetCorrect = expectedAfterReset.every(expected => 
        resetCategories.includes(expected)
      );

      addResult({
        success: resetCorrect,
        message: resetCorrect 
          ? `✅ Reset profile created with correct language (${newLanguage})` 
          : `❌ Reset profile NOT created with correct language`,
        details: {
          language: newLanguage,
          expected: expectedAfterReset,
          actual: resetCategories
        }
      });

      // Switch back to original language
      await setLanguage(originalLanguage);

    } catch (error) {
      addResult({
        success: false,
        message: `Language switch test failed: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  };

  const testLanguageUpdate = async () => {
    try {
      addResult({
        success: true,
        message: 'Testing automatic language update functionality'
      });

      // 1. Check current default profile language
      const wasUpdated = checkAndUpdateDefaultProfileLanguage();
      
      addResult({
        success: true,
        message: wasUpdated 
          ? '✅ Default profile was updated to match current language' 
          : '✅ Default profile already matches current language',
        details: { wasUpdated, currentLanguage: language }
      });

      // 2. Force recreate with current language
      const recreatedProfile = recreateDefaultProfileWithCurrentLanguage();
      const recreatedCategories = recreatedProfile.budget.map(cat => cat.name);

      const expectedCategories = language === 'pt-BR' 
        ? ['Renda', 'Habitação', 'Alimentação', 'Transporte']
        : ['Income', 'Housing', 'Food', 'Transportation'];

      const recreatedCorrect = expectedCategories.every(expected => 
        recreatedCategories.includes(expected)
      );

      addResult({
        success: recreatedCorrect,
        message: recreatedCorrect 
          ? `✅ Recreated profile has correct language (${language})` 
          : `❌ Recreated profile has wrong language`,
        details: {
          language,
          expected: expectedCategories,
          actual: recreatedCategories
        }
      });

    } catch (error) {
      addResult({
        success: false,
        message: `Language update test failed: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    clearResults();

    addResult({
      success: true,
      message: `Starting Category Language Tests`
    });

    await testCategoryLanguage();
    await testLanguageSwitch();
    await testLanguageUpdate();

    addResult({
      success: true,
      message: 'All tests completed'
    });

    setIsRunning(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Category Language Test Suite
      </h2>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-2">
          Current language: <span className="font-semibold">{language}</span>
        </p>
        <div className="flex gap-2">
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isRunning ? 'Running Tests...' : 'Run Category Language Tests'}
          </button>
          <button
            onClick={clearResults}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Clear Results
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {testResults.map((result, index) => (
          <div
            key={index}
            className={`p-3 rounded border-l-4 ${
              result.success 
                ? 'bg-green-50 border-green-500' 
                : 'bg-red-50 border-red-500'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={result.success ? 'text-green-600' : 'text-red-600'}>
                {result.success ? '✅' : '❌'}
              </span>
              <span className="font-medium">{result.message}</span>
            </div>
            {result.details && (
              <pre className="mt-2 text-sm text-gray-600 bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(result.details, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>

      {testResults.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded">
          <h3 className="font-semibold mb-2">Test Summary</h3>
          <p>
            Passed: {testResults.filter(r => r.success).length} / {testResults.length}
          </p>
        </div>
      )}
    </div>
  );
};
