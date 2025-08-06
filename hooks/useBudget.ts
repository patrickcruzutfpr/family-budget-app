import { useState, useEffect, useCallback } from 'react';
import { BudgetState, CategoryType } from '../types';
import { loadBudget, saveBudget, resetBudgetToDefault } from '../services/budgetService';

export const useBudget = () => {
  const [budget, setBudget] = useState<BudgetState>([]);

  useEffect(() => {
    setBudget(loadBudget());
  }, []);

  useEffect(() => {
    if (budget.length > 0) {
      saveBudget(budget);
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

      const newItemName = prompt('Enter the name for the new item:');
      if (!newItemName) return prevBudget;
      
      const newItem = {
        id: `${categoryId}-${Date.now()}`,
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
  }, []);

  const deleteItem = useCallback((categoryId: string, itemId: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    setBudget(prevBudget => {
      return prevBudget.map(category => {
        if (category.id === categoryId) {
          return { ...category, items: category.items.filter(item => item.id !== itemId) };
        }
        return category;
      });
    });
  }, []);

  const resetBudget = useCallback(() => {
    if (!window.confirm('Are you sure you want to reset all data to the default budget? This cannot be undone.')) return;
    const newBudget = resetBudgetToDefault();
    setBudget(newBudget);
  }, []);


  return { budget, updateItemValue, addItem, deleteItem, resetBudget };
};
