import React, { useState } from 'react';
import { useI18n } from '../../i18n';
import { exportProfile, importProfile, getCurrentProfile } from '../../services/profileService';

/**
 * Component to test AI suggestions export/import functionality
 */
export const AISuggestionsTestComponent: React.FC = () => {
  const { t } = useI18n();
  const [testResults, setTestResults] = useState<string>('');

  const addTestSuggestions = () => {
    // Create test AI suggestions with favorites
    const testData = {
      'pt-BR': [
        {
          id: 'test-fav-1',
          title: 'Economize no Supermercado',
          suggestion: 'Faça uma lista de compras para evitar gastos desnecessários',
          savedAt: new Date(),
          language: 'pt-BR',
          isFavorite: true
        },
        {
          id: 'test-normal-1', 
          title: 'Corte Gastos com Transporte',
          suggestion: 'Use transporte público para economizar combustível',
          savedAt: new Date(),
          language: 'pt-BR',
          isFavorite: false
        }
      ],
      'en': [
        {
          id: 'test-fav-2',
          title: 'Save on Groceries',
          suggestion: 'Make a shopping list to avoid unnecessary expenses',
          savedAt: new Date(),
          language: 'en',
          isFavorite: true
        }
      ]
    };

    localStorage.setItem('family-budget-saved-suggestions', JSON.stringify(testData));
    setTestResults('✅ Test AI suggestions with favorites added to localStorage');
  };

  const testExportWithFavorites = () => {
    try {
      const currentProfile = getCurrentProfile();
      const exportedData = exportProfile(currentProfile.id);
      const parsed = JSON.parse(exportedData);
      
      if (parsed.aiSuggestions) {
        const favoritesCount = parsed.aiSuggestions.filter((s: any) => s.isFavorite).length;
        const totalCount = parsed.aiSuggestions.length;
        
        setTestResults(`📤 Export test:\n- Total suggestions: ${totalCount}\n- Favorites: ${favoritesCount}\n- Export includes aiSuggestions: ✅\n\nFull export data:\n${JSON.stringify(parsed.aiSuggestions, null, 2)}`);
      } else {
        setTestResults('❌ Export test failed: No aiSuggestions found in export');
      }
    } catch (error) {
      setTestResults(`❌ Export test error: ${error}`);
    }
  };

  const testImportWithFavorites = () => {
    try {
      // Clear current suggestions
      localStorage.removeItem('family-budget-saved-suggestions');
      
      // Create export data with favorites
      const profileToImport = {
        name: 'Test Profile',
        description: 'Test profile with AI suggestions',
        budget: [],
        aiSuggestions: [
          {
            id: 'import-fav-1',
            title: 'Imported Favorite',
            suggestion: 'This is an imported favorite suggestion',
            savedAt: new Date().toISOString(),
            language: 'pt-BR',
            isFavorite: true
          },
          {
            id: 'import-normal-1',
            title: 'Imported Normal',
            suggestion: 'This is an imported normal suggestion',
            savedAt: new Date().toISOString(),
            language: 'pt-BR',
            isFavorite: false
          }
        ]
      };

      // Import the profile
      const importedProfile = importProfile(JSON.stringify(profileToImport));
      
      // Check if suggestions were restored
      const restoredData = localStorage.getItem('family-budget-saved-suggestions');
      if (restoredData) {
        const parsed = JSON.parse(restoredData);
        const ptBRSuggestions = parsed['pt-BR'] || [];
        const favoritesCount = ptBRSuggestions.filter((s: any) => s.isFavorite).length;
        
        setTestResults(`📥 Import test:\n- Imported profile: ${importedProfile.name}\n- Restored suggestions: ${ptBRSuggestions.length}\n- Favorites restored: ${favoritesCount}\n- Import successful: ✅\n\nRestored suggestions:\n${JSON.stringify(ptBRSuggestions, null, 2)}`);
      } else {
        setTestResults('❌ Import test failed: No suggestions restored to localStorage');
      }
    } catch (error) {
      setTestResults(`❌ Import test error: ${error}`);
    }
  };

  const testFullCycle = () => {
    setTestResults('🔄 Running full export/import cycle...\n');
    
    // Step 1: Add test data
    addTestSuggestions();
    
    setTimeout(() => {
      // Step 2: Export
      testExportWithFavorites();
      
      setTimeout(() => {
        // Step 3: Import 
        testImportWithFavorites();
      }, 500);
    }, 500);
  };

  const clearTestData = () => {
    localStorage.removeItem('family-budget-saved-suggestions');
    setTestResults('🧹 Test data cleared');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          🤖 AI Suggestions Export/Import Test
        </h2>
        
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={addTestSuggestions}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Add Test Suggestions
            </button>
            
            <button 
              onClick={testExportWithFavorites}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Test Export
            </button>
            
            <button 
              onClick={testImportWithFavorites}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
            >
              Test Import
            </button>
            
            <button 
              onClick={testFullCycle}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
            >
              Test Full Cycle
            </button>
            
            <button 
              onClick={clearTestData}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Clear Test Data
            </button>
          </div>

          {testResults && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3">Test Results:</h3>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-auto max-h-96">
                {testResults}
              </pre>
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">How to Test:</h3>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Click "Add Test Suggestions" to create sample AI suggestions with favorites</li>
              <li>2. Click "Test Export" to verify favorites are included in profile export</li>
              <li>3. Click "Test Import" to verify favorites are restored from import</li>
              <li>4. Or click "Test Full Cycle" to run all tests automatically</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISuggestionsTestComponent;
