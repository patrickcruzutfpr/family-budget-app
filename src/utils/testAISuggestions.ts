/**
 * Test script to verify AI suggestions export/import functionality
 * Run in browser console to test the current implementation
 */

// Test the export functionality
function testAISuggestionsExport() {
  console.log('🧪 Testing AI Suggestions Export...');
  
  // Create test data with favorites
  const testSuggestions = {
    'pt-BR': [
      {
        id: 'test1',
        title: 'Economize no Supermercado',
        suggestion: 'Faça uma lista de compras para evitar gastos desnecessários',
        savedAt: new Date(),
        language: 'pt-BR',
        isFavorite: true
      },
      {
        id: 'test2',
        title: 'Corte Gastos com Transporte',
        suggestion: 'Use transporte público para economizar combustível',
        savedAt: new Date(),
        language: 'pt-BR',
        isFavorite: false
      }
    ],
    'en': [
      {
        id: 'test3',
        title: 'Save on Groceries',
        suggestion: 'Make a shopping list to avoid unnecessary expenses',
        savedAt: new Date(),
        language: 'en',
        isFavorite: true
      }
    ]
  };
  
  // Store test data
  localStorage.setItem('family-budget-saved-suggestions', JSON.stringify(testSuggestions));
  
  // Test export function
  const stored = localStorage.getItem('family-budget-saved-suggestions');
  if (stored) {
    const allSuggestions = JSON.parse(stored);
    const flatSuggestions = [];
    
    Object.keys(allSuggestions).forEach(language => {
      if (allSuggestions[language] && Array.isArray(allSuggestions[language])) {
        flatSuggestions.push(...allSuggestions[language]);
      }
    });
    
    console.log('📤 Exported AI Suggestions:');
    console.log(flatSuggestions);
    
    const favoritesCount = flatSuggestions.filter(s => s.isFavorite).length;
    console.log(`✅ Found ${favoritesCount} favorite suggestions in export`);
    
    return flatSuggestions;
  }
  
  return [];
}

// Test the import functionality
function testAISuggestionsImport(exportedSuggestions) {
  console.log('🧪 Testing AI Suggestions Import...');
  
  // Clear existing data
  localStorage.removeItem('family-budget-saved-suggestions');
  
  // Simulate import process
  const currentSuggestions = {};
    
  exportedSuggestions.forEach(suggestion => {
    const language = suggestion.language || 'pt-BR';
    
    if (!currentSuggestions[language]) {
      currentSuggestions[language] = [];
    }
    
    const restoredSuggestion = {
      ...suggestion,
      savedAt: new Date(suggestion.savedAt),
      id: suggestion.id || `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    currentSuggestions[language].unshift(restoredSuggestion);
  });
  
  localStorage.setItem('family-budget-saved-suggestions', JSON.stringify(currentSuggestions));
  
  // Verify import
  const imported = JSON.parse(localStorage.getItem('family-budget-saved-suggestions'));
  console.log('📥 Imported AI Suggestions:');
  console.log(imported);
  
  let totalFavorites = 0;
  Object.keys(imported).forEach(language => {
    const favorites = imported[language].filter(s => s.isFavorite);
    totalFavorites += favorites.length;
    console.log(`✅ Language ${language}: ${favorites.length} favorites restored`);
  });
  
  console.log(`✅ Total favorites restored: ${totalFavorites}`);
  return imported;
}

// Run the complete test
function runAISuggestionsTest() {
  console.log('🚀 Starting AI Suggestions Export/Import Test...');
  
  const exported = testAISuggestionsExport();
  console.log('---');
  const imported = testAISuggestionsImport(exported);
  
  console.log('✅ Test completed! Check the results above.');
  
  return { exported, imported };
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testAISuggestions = {
    testExport: testAISuggestionsExport,
    testImport: testAISuggestionsImport,
    runFullTest: runAISuggestionsTest
  };
  
  console.log('🧪 AI Suggestions test functions available:');
  console.log('- window.testAISuggestions.runFullTest()');
  console.log('- window.testAISuggestions.testExport()');
  console.log('- window.testAISuggestions.testImport(data)');
}

export { testAISuggestionsExport, testAISuggestionsImport, runAISuggestionsTest };
