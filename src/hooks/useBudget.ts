import { useState, useEffect, useCallback } from 'react';
import { BudgetState, CategoryType } from '@/types';
import { loadBudget, saveBudget, resetBudgetToDefault } from '@/services/budgetService';
import { getCurrentProfile, updateCurrentProfileBudget } from '@/services/profileService';
import { generateId } from '@/utils';
import { useBudgetMessages } from './useBudgetMessages';
import { useI18n } from '@/i18n';

export const useBudget = () => {
  const [budget, setBudget] = useState<BudgetState>([]);
  const { promptItemName, confirmDelete, confirmReset } = useBudgetMessages();
  const { t } = useI18n();

  // Load budget from current profile
  useEffect(() => {
    try {
      const currentProfile = getCurrentProfile();
      setBudget(currentProfile.budget);
    } catch (error) {
      // Fallback to old budget service if profile system fails
      console.warn('Profile system failed, falling back to legacy budget:', error);
      setBudget(loadBudget());
    }
  }, []);

  // Save budget changes to current profile
  useEffect(() => {
    if (budget.length > 0) {
      try {
        updateCurrentProfileBudget(budget);
      } catch (error) {
        // Fallback to old budget service
        console.warn('Profile update failed, saving to legacy storage:', error);
        saveBudget(budget);
      }
    }
  }, [budget]);

  // Listen for category language updates and reload budget
  useEffect(() => {
    const handleCategoryLanguageUpdate = (e: CustomEvent) => {
      if (e.detail?.type === 'categories-language-updated') {
        try {
          const currentProfile = getCurrentProfile();
          setBudget(currentProfile.budget);
        } catch (error) {
          console.warn('Failed to reload budget after language update:', error);
        }
      }
    };

    window.addEventListener('profileChanged' as any, handleCategoryLanguageUpdate);

    return () => {
      window.removeEventListener('profileChanged' as any, handleCategoryLanguageUpdate);
    };
  }, []);

  const updateItemValue = useCallback((categoryId: string, itemId: string, field: 'projected' | 'actual', value: number) => {
    setBudget(prevBudget => {
      return prevBudget.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            items: category.items.map(item => {
              if (item.id === itemId) {
                return { ...item, [field]: value };
              }
              return item;
            }),
          };
        }
        return category;
      });
    });
  }, []);

  const updateItemName = useCallback((categoryId: string, itemId: string, name: string) => {
    setBudget(prevBudget => {
      return prevBudget.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            items: category.items.map(item => {
              if (item.id === itemId) {
                return { ...item, name };
              }
              return item;
            }),
          };
        }
        return category;
      });
    });
  }, []);

  const addItem = useCallback((categoryId: string) => {
    setBudget(prevBudget => {
      const category = prevBudget.find(c => c.id === categoryId);
      if (!category) return prevBudget;

      // Create new item with default name that can be edited inline
      const newItem = {
        id: generateId(),
        name: t('budget.newItem', 'New Item'), // Default name that will be translated and can be edited
        projected: 0,
        actual: 0,
      };

      return prevBudget.map(cat => {
        if (cat.id === categoryId) {
          return { ...cat, items: [...cat.items, newItem] };
        }
        return cat;
      });
    });
  }, [t]);

  const deleteItem = useCallback((categoryId: string, itemId: string) => {
    if (!window.confirm(confirmDelete())) return;
    setBudget(prevBudget => {
      return prevBudget.map(category => {
        if (category.id === categoryId) {
          return { ...category, items: category.items.filter(item => item.id !== itemId) };
        }
        return category;
      });
    });
  }, [confirmDelete]);

  const resetBudget = useCallback(() => {
    if (!window.confirm(confirmReset())) return;
    const newBudget = resetBudgetToDefault();
    setBudget(newBudget);
  }, [confirmReset]);

  // Reload budget from current profile (useful after profile switch or category changes)
  const reloadBudget = useCallback(() => {
    try {
      const currentProfile = getCurrentProfile();
      setBudget(currentProfile.budget);
    } catch (error) {
      console.error('Failed to reload budget from profile:', error);
    }
  }, []);

  // Add category to budget
  const addCategory = useCallback((categoryName: string, categoryType: CategoryType) => {
    setBudget(prevBudget => {
      const newCategory = {
        id: generateId(),
        name: categoryName,
        type: categoryType,
        items: []
      };
      return [...prevBudget, newCategory];
    });
  }, []);

  // Update category in budget
  const updateCategory = useCallback((categoryId: string, updates: Partial<{ name: string; description?: string; icon?: string; color?: string }>) => {
    setBudget(prevBudget => {
      return prevBudget.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            ...updates,
            updatedAt: new Date()
          };
        }
        return category;
      });
    });
  }, []);

  // Remove category from budget
  const removeCategory = useCallback((categoryId: string) => {
    setBudget(prevBudget => {
      return prevBudget.filter(category => category.id !== categoryId);
    });
  }, []);

  return { 
    budget, 
    updateItemValue,
    updateItemName,
    addItem, 
    deleteItem, 
    resetBudget, 
    reloadBudget,
    addCategory,
    updateCategory,
    removeCategory
  };
};
