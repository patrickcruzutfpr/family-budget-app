import React, { useState } from 'react';
import { useI18n } from '@/i18n';
import { 
  getCurrentProfile, 
  exportProfile, 
  importProfile,
  resetToDefault 
} from '@/services/profileService';
import { CategoryService } from '@/services/categoryService';
import { CategoryType } from '@/types';

interface TestResult {
  success: boolean;
  message: string;
  details?: any;
}

export const ExportImportTester: React.FC = () => {
  const { t, language } = useI18n();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (result: TestResult) => {
    setTestResults(prev => [...prev, result]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const testBasicExportImport = async () => {
    try {
      // 1. Get current profile
      const originalProfile = getCurrentProfile();
      addResult({
        success: true,
        message: 'Original profile loaded',
        details: {
          name: originalProfile.name,
          categoriesCount: originalProfile.budget.length,
          categories: originalProfile.budget.map(cat => cat.name)
        }
      });

      // 2. Export profile
      const exportedData = exportProfile(originalProfile.id);
      addResult({
        success: true,
        message: 'Profile exported successfully',
        details: { dataLength: exportedData.length }
      });

      // 3. Import profile
      const importedProfile = importProfile(exportedData);
      addResult({
        success: true,
        message: 'Profile imported successfully',
        details: {
          name: importedProfile.name,
          categoriesCount: importedProfile.budget.length,
          categories: importedProfile.budget.map(cat => cat.name)
        }
      });

      // 4. Verify categories match
      const originalCategories = originalProfile.budget.map(cat => cat.name).sort();
      const importedCategories = importedProfile.budget.map(cat => cat.name).sort();
      const categoriesMatch = JSON.stringify(originalCategories) === JSON.stringify(importedCategories);

      addResult({
        success: categoriesMatch,
        message: categoriesMatch ? 'Categories preserved correctly' : 'Categories do not match',
        details: { originalCategories, importedCategories }
      });

    } catch (error) {
      addResult({
        success: false,
        message: `Export/Import test failed: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  };

  const testCustomCategoryPreservation = async () => {
    try {
      // 1. Create a custom category
      const customCategory = CategoryService.createCategory({
        name: 'Test Custom Category',
        type: CategoryType.EXPENSE,
        description: 'Custom category for testing',
        icon: '🧪',
        color: '#FF6B6B'
      });

      addResult({
        success: true,
        message: 'Custom category created',
        details: customCategory
      });

      // 2. Get profile with custom category
      const profileWithCustom = getCurrentProfile();
      const hasCustomCategory = profileWithCustom.budget.some(cat => cat.name === 'Test Custom Category');

      addResult({
        success: hasCustomCategory,
        message: hasCustomCategory ? 'Custom category found in profile' : 'Custom category not found',
        details: { categoriesCount: profileWithCustom.budget.length }
      });

      // 3. Export and import
      const exportedData = exportProfile(profileWithCustom.id);
      const importedProfile = importProfile(exportedData);

      // 4. Check if custom category is preserved
      const customPreserved = importedProfile.budget.some(cat => cat.name === 'Test Custom Category');
      addResult({
        success: customPreserved,
        message: customPreserved ? 'Custom category preserved in import' : 'Custom category lost in import',
        details: { 
          importedCategories: importedProfile.budget.map(cat => cat.name)
        }
      });

    } catch (error) {
      addResult({
        success: false,
        message: `Custom category test failed: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  };

  const testLanguageSpecificCategories = async () => {
    try {
      // 1. Reset to default to get fresh categories
      const defaultProfile = resetToDefault();
      
      addResult({
        success: true,
        message: `Default profile created with language: ${language}`,
        details: {
          language,
          categories: defaultProfile.budget.map(cat => cat.name)
        }
      });

      // 2. Check if categories are in correct language
      const expectedCategories = language === 'pt-BR' 
        ? ['Renda', 'Habitação', 'Alimentação', 'Transporte']
        : ['Income', 'Housing', 'Food', 'Transportation'];

      const actualCategories = defaultProfile.budget.map(cat => cat.name);
      const hasExpectedCategories = expectedCategories.every(expected => 
        actualCategories.includes(expected)
      );

      addResult({
        success: hasExpectedCategories,
        message: hasExpectedCategories 
          ? `Categories created in correct language (${language})` 
          : `Categories not in expected language`,
        details: { expected: expectedCategories, actual: actualCategories }
      });

      // 3. Export and import
      const exportedData = exportProfile(defaultProfile.id);
      const importedProfile = importProfile(exportedData);

      // 4. Verify language is preserved
      const importedCategories = importedProfile.budget.map(cat => cat.name);
      const languagePreserved = expectedCategories.every(expected => 
        importedCategories.includes(expected)
      );

      addResult({
        success: languagePreserved,
        message: languagePreserved 
          ? 'Language-specific categories preserved in import' 
          : 'Language-specific categories lost in import',
        details: { importedCategories }
      });

    } catch (error) {
      addResult({
        success: false,
        message: `Language test failed: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  };

  const testAISuggestionsPreservation = async () => {
    try {
      // 1. Check current saved suggestions in localStorage
      const savedSuggestionsKey = 'family-budget-saved-suggestions';
      const storedSuggestions = localStorage.getItem(savedSuggestionsKey);
      
      addResult({
        success: true,
        message: 'Checking AI suggestions storage',
        details: {
          storageKey: savedSuggestionsKey,
          hasData: !!storedSuggestions,
          dataLength: storedSuggestions ? storedSuggestions.length : 0
        }
      });

      // 2. Create a mock AI suggestion for testing
      const mockSuggestion = {
        title: 'Test AI Suggestion',
        suggestion: 'This is a test suggestion for export/import verification',
        impact: 'Test impact description',
        category: 'Test Category'
      };

      // 3. Add mock suggestion to localStorage (simulating saved favorite)
      const currentSuggestions = storedSuggestions ? JSON.parse(storedSuggestions) : {};
      if (!currentSuggestions[language]) {
        currentSuggestions[language] = [];
      }
      
      currentSuggestions[language].unshift({
        ...mockSuggestion,
        id: 'test-suggestion-' + Date.now(),
        savedAt: new Date(),
        language: language,
        isFavorite: true
      });

      localStorage.setItem(savedSuggestionsKey, JSON.stringify(currentSuggestions));

      addResult({
        success: true,
        message: 'Mock AI suggestion added to favorites',
        details: {
          suggestion: mockSuggestion,
          totalSuggestions: currentSuggestions[language].length
        }
      });

      // 4. Get current profile and export it
      const currentProfile = getCurrentProfile();
      const exportedData = exportProfile(currentProfile.id);

      // 5. Check if exported data contains AI suggestions
      const containsAISuggestions = exportedData.includes('Test AI Suggestion');
      
      addResult({
        success: containsAISuggestions, // Now success means AI suggestions ARE in profile export (new behavior)
        message: containsAISuggestions 
          ? '✅ AI suggestions are now included in profile export' 
          : '❌ AI suggestions are missing from profile export',
        details: {
          exportContainsAI: containsAISuggestions,
          exportDataLength: exportedData.length
        }
      });

      // 6. Import the profile and check if AI suggestions are restored
      const importedProfile = importProfile(exportedData);
      
      // Wait a moment for localStorage to be updated
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const suggestionsAfterImport = localStorage.getItem(savedSuggestionsKey);
      const restoredSuggestions = suggestionsAfterImport ? JSON.parse(suggestionsAfterImport) : {};
      const hasRestoredSuggestion = restoredSuggestions[language]?.some((s: any) => s.title === 'Test AI Suggestion');

      addResult({
        success: hasRestoredSuggestion,
        message: hasRestoredSuggestion 
          ? '✅ AI suggestions restored from profile import' 
          : '❌ AI suggestions not restored from profile import',
        details: {
          suggestionsRestored: hasRestoredSuggestion,
          importedProfileId: importedProfile.id,
          totalRestoredSuggestions: restoredSuggestions[language]?.length || 0
        }
      });

      // 7. Analysis conclusion
      addResult({
        success: containsAISuggestions && hasRestoredSuggestion,
        message: 'AI Suggestions Export/Import Analysis Complete',
        details: {
          conclusion: containsAISuggestions && hasRestoredSuggestion 
            ? 'AI suggestions are now properly backed up with profile exports' 
            : 'AI suggestions backup needs attention',
          exportWorking: containsAISuggestions,
          importWorking: hasRestoredSuggestion,
          overallWorking: containsAISuggestions && hasRestoredSuggestion
        }
      });

    } catch (error) {
      addResult({
        success: false,
        message: `AI suggestions test failed: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    clearResults();

    addResult({
      success: true,
      message: `Starting tests with language: ${language}`
    });

    await testBasicExportImport();
    await testCustomCategoryPreservation();
    await testLanguageSpecificCategories();
    await testAISuggestionsPreservation();

    addResult({
      success: true,
      message: 'All tests completed'
    });

    setIsRunning(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Export/Import Test Suite
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
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
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
