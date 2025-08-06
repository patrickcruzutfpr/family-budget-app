import { useState, useCallback, useEffect } from 'react';
import { Category, CategoryFormData, CategoryType } from '../types';
import { CategoryService } from '../services/categoryService';
import { syncCategoryChanges } from '../utils/categoryMigration';

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  createCategory: (formData: CategoryFormData) => Promise<Category>;
  updateCategory: (categoryId: string, formData: CategoryFormData) => Promise<Category>;
  deleteCategory: (categoryId: string) => Promise<void>;
  refreshCategories: () => void;
  getCategoryById: (categoryId: string) => Category | undefined;
  getCategoriesByType: (type: CategoryType) => Category[];
  categoryNameExists: (name: string, excludeId?: string) => boolean;
}

interface UseCategoriesProps {
  onBudgetChange?: () => void; // Callback to notify budget changes
}

export const useCategories = (props?: UseCategoriesProps): UseCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load categories from service
  const loadCategories = useCallback(() => {
    try {
      setLoading(true);
      setError(null);
      const loadedCategories = CategoryService.getCategories();
      setCategories(loadedCategories);
    } catch (err) {
      setError('Erro ao carregar categorias');
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new category
  const createCategory = useCallback(async (formData: CategoryFormData): Promise<Category> => {
    try {
      setError(null);
      
      // Validate name uniqueness
      if (CategoryService.categoryNameExists(formData.name)) {
        throw new Error('Uma categoria com este nome já existe');
      }

      const newCategory = CategoryService.createCategory(formData);
      setCategories(prev => [...prev, newCategory]);
      
      // Sync changes with budget system
      syncCategoryChanges();
      
      // Notify parent component of budget change
      if (props?.onBudgetChange) {
        props.onBudgetChange();
      }
      
      return newCategory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar categoria';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [props]);

  // Update existing category
  const updateCategory = useCallback(async (categoryId: string, formData: CategoryFormData): Promise<Category> => {
    try {
      setError(null);
      
      // Validate name uniqueness (excluding current category)
      if (CategoryService.categoryNameExists(formData.name, categoryId)) {
        throw new Error('Uma categoria com este nome já existe');
      }

      const updatedCategory = CategoryService.updateCategory(categoryId, formData);
      setCategories(prev => prev.map(cat => 
        cat.id === categoryId ? updatedCategory : cat
      ));
      
      // Sync changes with budget system
      syncCategoryChanges();
      
      // Notify parent component of budget change
      if (props?.onBudgetChange) {
        props.onBudgetChange();
      }
      
      return updatedCategory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar categoria';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [props]);

  // Delete category
  const deleteCategory = useCallback(async (categoryId: string): Promise<void> => {
    try {
      setError(null);
      CategoryService.deleteCategory(categoryId);
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      
      // Sync changes with budget system
      syncCategoryChanges();
      
      // Notify parent component of budget change
      if (props?.onBudgetChange) {
        props.onBudgetChange();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir categoria';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [props]);

  // Refresh categories
  const refreshCategories = useCallback(() => {
    loadCategories();
  }, [loadCategories]);

  // Get category by ID
  const getCategoryById = useCallback((categoryId: string): Category | undefined => {
    return categories.find(cat => cat.id === categoryId);
  }, [categories]);

  // Get categories by type
  const getCategoriesByType = useCallback((type: CategoryType): Category[] => {
    return categories.filter(cat => cat.type === type);
  }, [categories]);

  // Check if category name exists
  const categoryNameExists = useCallback((name: string, excludeId?: string): boolean => {
    return categories.some(cat => 
      cat.name.toLowerCase() === name.toLowerCase() && cat.id !== excludeId
    );
  }, [categories]);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refreshCategories,
    getCategoryById,
    getCategoriesByType,
    categoryNameExists
  };
};
