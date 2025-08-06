/**
 * Manual test to verify profile import/export functionality
 * This can be run in the browser console
 */

import { 
  getAllProfiles, 
  getCurrentProfile, 
  exportProfile, 
  importProfile, 
  createProfile 
} from '../services/profileService';
import { CategoryService } from '../services/categoryService';
import { CategoryType } from '../types';

declare global {
  interface Window {
    testProfileImportExport: () => void;
    testCategoryPreservation: () => void;
  }
}

// Test basic profile import/export
export const testProfileImportExport = () => {
  console.log('🧪 Testing Profile Import/Export...');
  
  try {
    // 1. Get current profile
    const originalProfile = getCurrentProfile();
    console.log('✅ Original profile:', {
      id: originalProfile.id,
      name: originalProfile.name,
      categoriesCount: originalProfile.budget.length,
      categories: originalProfile.budget.map(cat => ({
        name: cat.name,
        type: cat.type,
        itemsCount: cat.items.length
      }))
    });

    // 2. Export the profile
    const exportedData = exportProfile(originalProfile.id);
    console.log('✅ Profile exported successfully, data length:', exportedData.length);

    // 3. Verify exported data contains categories
    const parsedData = JSON.parse(exportedData);
    console.log('✅ Exported data contains:', {
      name: parsedData.name,
      categoriesCount: parsedData.budget.length,
      categories: parsedData.budget.map((cat: any) => cat.name)
    });

    // 4. Import the profile
    const importedProfile = importProfile(exportedData);
    console.log('✅ Profile imported successfully:', {
      id: importedProfile.id,
      name: importedProfile.name,
      categoriesCount: importedProfile.budget.length,
      categories: importedProfile.budget.map(cat => ({
        name: cat.name,
        type: cat.type,
        itemsCount: cat.items.length
      }))
    });

    // 5. Verify categories are preserved
    const originalCategoryNames = originalProfile.budget.map(cat => cat.name).sort();
    const importedCategoryNames = importedProfile.budget.map(cat => cat.name).sort();
    const categoriesMatch = JSON.stringify(originalCategoryNames) === JSON.stringify(importedCategoryNames);
    
    console.log('✅ Categories preservation test:', {
      original: originalCategoryNames,
      imported: importedCategoryNames,
      match: categoriesMatch
    });

    console.log('🎉 Profile Import/Export test PASSED!');
    return { success: true, categoriesMatch };

  } catch (error) {
    console.error('❌ Profile Import/Export test FAILED:', error);
    return { success: false, error };
  }
};

// Test custom category preservation
export const testCategoryPreservation = () => {
  console.log('🧪 Testing Category Preservation...');
  
  try {
    // 1. Create a test category
    const testCategory = CategoryService.createCategory({
      name: 'Test Export Category',
      type: CategoryType.EXPENSE,
      description: 'Category for testing export/import',
      icon: '🧪',
      color: '#FF6B6B'
    });
    console.log('✅ Created test category:', testCategory);

    // 2. Get current profile with the new category
    const profileWithTestCategory = getCurrentProfile();
    const hasTestCategory = profileWithTestCategory.budget.some(cat => cat.name === 'Test Export Category');
    console.log('✅ Profile contains test category:', hasTestCategory);

    // 3. Export and import the profile
    const exportedData = exportProfile(profileWithTestCategory.id);
    const importedProfile = importProfile(exportedData);
    
    // 4. Check if test category is preserved
    const importedHasTestCategory = importedProfile.budget.some(cat => cat.name === 'Test Export Category');
    console.log('✅ Imported profile contains test category:', importedHasTestCategory);

    // 5. Check category details
    const originalTestCat = profileWithTestCategory.budget.find(cat => cat.name === 'Test Export Category');
    const importedTestCat = importedProfile.budget.find(cat => cat.name === 'Test Export Category');
    
    console.log('✅ Category details comparison:', {
      original: originalTestCat ? {
        name: originalTestCat.name,
        type: originalTestCat.type,
        description: originalTestCat.description,
        icon: originalTestCat.icon,
        color: originalTestCat.color
      } : null,
      imported: importedTestCat ? {
        name: importedTestCat.name,
        type: importedTestCat.type,
        description: importedTestCat.description,
        icon: importedTestCat.icon,
        color: importedTestCat.color
      } : null
    });

    const detailsMatch = originalTestCat && importedTestCat && 
      originalTestCat.name === importedTestCat.name &&
      originalTestCat.type === importedTestCat.type &&
      originalTestCat.description === importedTestCat.description;

    console.log('🎉 Category Preservation test PASSED!');
    return { success: true, detailsMatch, testCategoryPreserved: importedHasTestCategory };

  } catch (error) {
    console.error('❌ Category Preservation test FAILED:', error);
    return { success: false, error };
  }
};

// Make functions available globally for console testing
if (typeof window !== 'undefined') {
  window.testProfileImportExport = testProfileImportExport;
  window.testCategoryPreservation = testCategoryPreservation;
}
