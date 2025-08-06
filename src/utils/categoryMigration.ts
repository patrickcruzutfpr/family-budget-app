import { CategoryService } from '../services/categoryService';
import { getCurrentProfile, updateCurrentProfileBudget } from '../services/profileService';
import { Category, BudgetState } from '../types';

/**
 * Migrates legacy category data to the new integrated system
 * This ensures backward compatibility with existing data
 */
export const migrateCategoryData = (): void => {
  try {
    const currentProfile = getCurrentProfile();
    const currentBudget = currentProfile.budget;
    
    // Check if legacy category data exists
    const legacyCategoriesKey = 'budget_categories';
    const legacyData = localStorage.getItem(legacyCategoriesKey);
    
    if (legacyData && currentBudget.length === 0) {
      // Parse legacy categories
      const legacyCategories: Category[] = JSON.parse(legacyData);
      
      // Convert legacy categories to budget format
      const migratedBudget: BudgetState = legacyCategories.map(category => ({
        ...category,
        items: category.items || []
      }));
      
      // Update profile with migrated data
      updateCurrentProfileBudget(migratedBudget);
      
      // Remove legacy data
      localStorage.removeItem(legacyCategoriesKey);
    }
  } catch (error) {
    console.warn('Category migration failed or not needed:', error);
  }
};

/**
 * Ensures that default categories exist in the current profile
 */
export const ensureDefaultCategories = (): void => {
  try {
    const currentProfile = getCurrentProfile();
    const currentBudget = currentProfile.budget;
    
    // If budget is empty, create default categories
    if (currentBudget.length === 0) {
      const defaultCategories = CategoryService.getDefaultCategories();
      updateCurrentProfileBudget(defaultCategories);
    }
  } catch (error) {
    console.error('Failed to ensure default categories:', error);
  }
};

/**
 * Synchronizes category changes with the current budget view
 * This function should be called after any category modification
 */
export const syncCategoryChanges = (): void => {
  // Trigger a custom event that budget components can listen to
  const event = new CustomEvent('categoryDataChanged');
  window.dispatchEvent(event);
};
