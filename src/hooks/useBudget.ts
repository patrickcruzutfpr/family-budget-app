import { useState, useEffect, useCallback } from 'react';
import { BudgetState, CategoryType } from '@/types';
import { loadBudget, saveBudget, resetBudgetToDefault } from '@/services/budgetService';
import { getCurrentProfile, updateCurrentProfileBudget } from '@/services/profileService';
import { generateId } from '@/utils';
import { useBudgetMessages } from './useBudgetMessages';

export const useBudget = () => {
  const [budget, setBudget] = useState<BudgetState>([]);
  const { promptItemName, confirmDelete, confirmReset } = useBudgetMessages();

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

  const addItem = useCallback((categoryId: string) => {
    setBudget(prevBudget => {
      const category = prevBudget.find(c => c.id === categoryId);
      if (!category) return prevBudget;

      const newItemName = prompt(promptItemName());
      if (!newItemName) return prevBudget;
      
      const newItem = {
        id: generateId(),
        name: newItemName,
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
  }, [promptItemName]);

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

  // Reload budget from current profile (useful after profile switch)
  const reloadBudget = useCallback(() => {
    try {
      const currentProfile = getCurrentProfile();
      setBudget(currentProfile.budget);
    } catch (error) {
      console.error('Failed to reload budget from profile:', error);
    }
  }, []);

  return { 
    budget, 
    updateItemValue, 
    addItem, 
    deleteItem, 
    resetBudget, 
    reloadBudget 
  };
};
