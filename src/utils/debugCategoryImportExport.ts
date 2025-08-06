/**
 * Debug utility to test category import/export functionality
 */

import { CategoryService } from '../services/categoryService';
import { exportProfile, importProfile, getCurrentProfile } from '../services/profileService';
import { CategoryType } from '../types';

export const debugCategoryImportExport = () => {
  console.log('=== DEBUG: Category Import/Export Test ===');
  
  try {
    // 1. Get current profile before adding categories
    const beforeProfile = getCurrentProfile();
    console.log('1. Profile before adding categories:', {
      id: beforeProfile.id,
      name: beforeProfile.name,
      budgetLength: beforeProfile.budget.length,
      budget: beforeProfile.budget.map(cat => ({ name: cat.name, type: cat.type, itemsCount: cat.items?.length || 0 }))
    });
    
    // 2. Add a test category
    const testCategory = CategoryService.createCategory({
      name: 'Test Category for Debug',
      type: CategoryType.EXPENSE,
      description: 'Category created for debugging import/export',
      icon: '🧪',
      color: '#FF5733'
    });
    console.log('2. Created test category:', testCategory);
    
    // 3. Get profile after adding category
    const afterProfile = getCurrentProfile();
    console.log('3. Profile after adding category:', {
      id: afterProfile.id,
      name: afterProfile.name,
      budgetLength: afterProfile.budget.length,
      budget: afterProfile.budget.map(cat => ({ name: cat.name, type: cat.type, itemsCount: cat.items?.length || 0 }))
    });
    
    // 4. Export the profile
    const exportedData = exportProfile(afterProfile.id);
    console.log('4. Exported profile data length:', exportedData.length);
    console.log('4. Export contains test category:', exportedData.includes('Test Category for Debug'));
    
    // 5. Parse exported data to verify content
    const parsedExport = JSON.parse(exportedData);
    console.log('5. Parsed export budget length:', parsedExport.budget.length);
    console.log('5. Parsed export categories:', parsedExport.budget.map((cat: any) => cat.name));
    
    // 6. Import the profile (this creates a new profile with "(Imported)" suffix)
    const importedProfile = importProfile(exportedData);
    console.log('6. Imported profile:', {
      id: importedProfile.id,
      name: importedProfile.name,
      budgetLength: importedProfile.budget.length,
      budget: importedProfile.budget.map(cat => ({ name: cat.name, type: cat.type, itemsCount: cat.items?.length || 0 }))
    });
    
    // 7. Verify the test category exists in imported profile
    const hasTestCategory = importedProfile.budget.some(cat => cat.name === 'Test Category for Debug');
    console.log('7. Imported profile contains test category:', hasTestCategory);
    
    console.log('=== DEBUG: Test completed successfully! ===');
    
    return {
      success: true,
      beforeProfile,
      afterProfile,
      importedProfile,
      testCategoryFound: hasTestCategory
    };
    
  } catch (error) {
    console.error('=== DEBUG: Test failed ===', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

// Function to clean up test data
export const cleanupDebugData = () => {
  try {
    const profile = getCurrentProfile();
    const filteredBudget = profile.budget.filter(cat => !cat.name.includes('Test Category for Debug'));
    
    // Save the cleaned budget back
    const updatedProfile = {
      ...profile,
      budget: filteredBudget,
      updatedAt: new Date()
    };
    
    localStorage.setItem('familyBudgetProfiles', JSON.stringify([updatedProfile]));
    console.log('Cleaned up debug test category');
    
  } catch (error) {
    console.error('Failed to cleanup debug data:', error);
  }
};
