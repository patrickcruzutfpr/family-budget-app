/**
 * Test to verify i18n category names are preserved during export/import
 */

import { 
  resetToDefault, 
  exportProfile, 
  importProfile, 
  getCurrentProfile,
  setCurrentProfileId
} from '../services/profileService';
import { getInitialLanguage } from '../i18n/utils';

export const testI18nCategoryExportImport = () => {
  console.log('🌍 Testing i18n Category Export/Import...');
  
  try {
    // 1. Check current language
    const currentLanguage = getInitialLanguage();
    console.log('✅ Current language:', currentLanguage);

    // 2. Reset to default to get fresh categories with current language
    const defaultProfile = resetToDefault();
    console.log('✅ Created default profile with language-specific categories:', {
      id: defaultProfile.id,
      name: defaultProfile.name,
      language: currentLanguage,
      categories: defaultProfile.budget.map(cat => ({
        name: cat.name,
        type: cat.type,
        items: cat.items.map(item => item.name)
      }))
    });

    // 3. Verify categories are in expected language
    const expectedCategories = currentLanguage === 'pt-BR' 
      ? ['Renda', 'Habitação', 'Alimentação', 'Transporte']
      : ['Income', 'Housing', 'Food', 'Transportation'];
    
    const actualCategories = defaultProfile.budget.map(cat => cat.name);
    const languageCorrect = expectedCategories.every(expected => 
      actualCategories.includes(expected)
    );
    
    console.log('✅ Language verification:', {
      expected: expectedCategories,
      actual: actualCategories,
      correct: languageCorrect
    });

    // 4. Export the profile
    const exportedData = exportProfile(defaultProfile.id);
    console.log('✅ Profile exported, checking category names in export...');
    
    // 5. Verify exported data contains correct language categories
    const parsedExport = JSON.parse(exportedData);
    const exportedCategories = parsedExport.budget.map((cat: any) => cat.name);
    const exportLanguageCorrect = expectedCategories.every(expected => 
      exportedCategories.includes(expected)
    );
    
    console.log('✅ Export language verification:', {
      exportedCategories,
      correct: exportLanguageCorrect
    });

    // 6. Import the profile
    const importedProfile = importProfile(exportedData);
    console.log('✅ Profile imported, verifying categories...');
    
    // 7. Verify imported categories maintain correct language
    const importedCategories = importedProfile.budget.map(cat => cat.name);
    const importLanguageCorrect = expectedCategories.every(expected => 
      importedCategories.includes(expected)
    );
    
    console.log('✅ Import language verification:', {
      importedCategories,
      correct: importLanguageCorrect
    });

    // 8. Test item names as well
    const expectedItems = currentLanguage === 'pt-BR'
      ? ['Salário', 'Aluguel/Financiamento', 'Utilidades', 'Mercado', 'Restaurantes', 'Combustível', 'Prestação do Carro']
      : ['Salary', 'Rent/Mortgage', 'Utilities', 'Groceries', 'Dining Out', 'Gas', 'Car Payment'];
    
    const allImportedItems = importedProfile.budget.flatMap(cat => 
      cat.items.map(item => item.name)
    );
    
    const itemsCorrect = expectedItems.every(expected => 
      allImportedItems.includes(expected)
    );
    
    console.log('✅ Item names verification:', {
      expected: expectedItems,
      actual: allImportedItems,
      correct: itemsCorrect
    });

    const overallSuccess = languageCorrect && exportLanguageCorrect && importLanguageCorrect && itemsCorrect;
    
    if (overallSuccess) {
      console.log('🎉 i18n Category Export/Import test PASSED!');
    } else {
      console.log('❌ i18n Category Export/Import test FAILED!');
    }
    
    return {
      success: overallSuccess,
      currentLanguage,
      languageCorrect,
      exportLanguageCorrect,
      importLanguageCorrect,
      itemsCorrect,
      defaultProfile,
      importedProfile
    };

  } catch (error) {
    console.error('❌ i18n Category Export/Import test FAILED:', error);
    return { success: false, error };
  }
};

// Make function available globally
if (typeof window !== 'undefined') {
  (window as any).testI18nCategoryExportImport = testI18nCategoryExportImport;
}
