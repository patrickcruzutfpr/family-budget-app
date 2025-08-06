import { CategoryService } from '../services/categoryService';
import { getCurrentProfile, updateCurrentProfileBudget } from '../services/profileService';
import { Category, BudgetState, CategoryType } from '../types';

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

/**
 * Adds default icons and colors to existing categories that don't have them
 */
export const migrateCategoriesToIncludeIcons = (): void => {
  try {
    const currentProfile = getCurrentProfile();
    const currentBudget = currentProfile.budget;
    
    // Define default icon mappings for common category names
    const defaultIconMappings = {
      // Portuguese
      'Renda': { icon: '💰', color: '#10B981' },
      'Habitação': { icon: '🏠', color: '#3B82F6' },
      'Transporte': { icon: '🚗', color: '#EF4444' },
      'Alimentação': { icon: '🍕', color: '#10B981' },
      'Pessoal & Família': { icon: '👨‍👩‍👧‍👦', color: '#F59E0B' },
      'Economia & Investimentos': { icon: '🎯', color: '#8B5CF6' },
      // English
      'Income': { icon: '💰', color: '#10B981' },
      'Housing': { icon: '🏠', color: '#3B82F6' },
      'Transportation': { icon: '🚗', color: '#EF4444' },
      'Food': { icon: '🍕', color: '#10B981' },
      'Personal & Family': { icon: '👨‍👩‍👧‍👦', color: '#F59E0B' },
      'Savings & Investments': { icon: '🎯', color: '#8B5CF6' },
      // Common variations
      'Moradia': { icon: '🏠', color: '#3B82F6' },
      'Casa': { icon: '🏠', color: '#3B82F6' },
      'Carro': { icon: '🚗', color: '#EF4444' },
      'Comida': { icon: '🍕', color: '#10B981' },
      'Família': { icon: '👨‍👩‍👧‍👦', color: '#F59E0B' },
      'Salário': { icon: '💰', color: '#10B981' },
      'Salary': { icon: '💰', color: '#10B981' }
    };

    // Default fallback icons by category type
    const fallbackIcons = {
      [CategoryType.INCOME]: { icon: '💰', color: '#10B981' },
      [CategoryType.EXPENSE]: { icon: '🛒', color: '#6B7280' }
    };

    let hasChanges = false;

    const updatedBudget = currentBudget.map(category => {
      // Skip if category already has icon and color
      if (category.icon && category.color) {
        return category;
      }

      let updatedCategory = { ...category };

      // Try to match by name first
      const iconMapping = defaultIconMappings[category.name as keyof typeof defaultIconMappings];
      if (iconMapping) {
        updatedCategory.icon = iconMapping.icon;
        updatedCategory.color = iconMapping.color;
        hasChanges = true;
      } else {
        // Use fallback based on category type
        const fallback = fallbackIcons[category.type];
        if (!updatedCategory.icon) {
          updatedCategory.icon = fallback.icon;
          hasChanges = true;
        }
        if (!updatedCategory.color) {
          updatedCategory.color = fallback.color;
          hasChanges = true;
        }
      }

      return updatedCategory;
    });

    if (hasChanges) {
      updateCurrentProfileBudget(updatedBudget);
      syncCategoryChanges();
    }
  } catch (error) {
    console.error('Failed to migrate categories with icons:', error);
  }
};
