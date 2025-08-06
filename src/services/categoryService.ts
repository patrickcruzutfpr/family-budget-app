import { Category, CategoryType, CategoryFormData, BudgetState } from '../types';
import { getCurrentProfile, updateCurrentProfileBudget, saveProfile } from './profileService';
import { generateId } from '../utils/generateId';

export class CategoryService {
  private static readonly STORAGE_KEY = 'budget_categories';

  // Get current budget from profile system
  private static getCurrentBudget(): BudgetState {
    try {
      const currentProfile = getCurrentProfile();
      return currentProfile.budget;
    } catch (error) {
      console.error('Failed to get current budget from profile:', error);
      return [];
    }
  }

  // Save budget back to profile system
  private static saveBudgetToProfile(budget: BudgetState): void {
    try {
      updateCurrentProfileBudget(budget);
    } catch (error) {
      console.error('Failed to save budget to profile:', error);
    }
  }

  // Get all categories from current budget
  static getCategories(): Category[] {
    const budget = this.getCurrentBudget();
    return budget.map(category => ({
      ...category,
      createdAt: category.createdAt || new Date(),
      updatedAt: category.updatedAt || new Date()
    }));
  }

  // Get default categories (not used anymore, kept for reference)
  static getDefaultCategories(): Category[] {
    const defaultExpenseCategories = [
      'Habitação',
      'Transporte', 
      'Alimentação',
      'Pessoal e Família',
      'Poupança e Investimentos'
    ];

    return [
      {
        id: generateId(),
        name: 'Renda',
        type: CategoryType.INCOME,
        items: [],
        description: 'Categoria padrão de renda',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      ...defaultExpenseCategories.map((name, index) => ({
        id: generateId(),
        name,
        type: CategoryType.EXPENSE,
        items: [],
        description: `Categoria de gastos: ${name}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    ];
  }

  // Create new category and add to budget
  static createCategory(formData: CategoryFormData): Category {
    const budget = this.getCurrentBudget();
    const newCategory: Category = {
      id: generateId(),
      name: formData.name,
      type: formData.type,
      items: [],
      description: formData.description,
      icon: formData.icon,
      color: formData.color,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedBudget = [...budget, newCategory];
    this.saveBudgetToProfile(updatedBudget);
    return newCategory;
  }

  // Update existing category
  static updateCategory(categoryId: string, formData: CategoryFormData): Category {
    const budget = this.getCurrentBudget();
    const categoryIndex = budget.findIndex(cat => cat.id === categoryId);
    
    if (categoryIndex === -1) {
      throw new Error('Categoria não encontrada');
    }

    const updatedCategory: Category = {
      ...budget[categoryIndex],
      name: formData.name,
      type: formData.type,
      description: formData.description,
      icon: formData.icon,
      color: formData.color,
      updatedAt: new Date()
    };

    const updatedBudget = [...budget];
    updatedBudget[categoryIndex] = updatedCategory;
    this.saveBudgetToProfile(updatedBudget);
    return updatedCategory;
  }

  // Delete category
  static deleteCategory(categoryId: string): void {
    const budget = this.getCurrentBudget();
    const filteredBudget = budget.filter(cat => cat.id !== categoryId);
    this.saveBudgetToProfile(filteredBudget);
  }

  // Get category by ID
  static getCategoryById(categoryId: string): Category | undefined {
    const budget = this.getCurrentBudget();
    return budget.find(cat => cat.id === categoryId);
  }

  // Get categories by type
  static getCategoriesByType(type: CategoryType): Category[] {
    const budget = this.getCurrentBudget();
    return budget.filter(cat => cat.type === type);
  }

  // Check if category name already exists
  static categoryNameExists(name: string, excludeId?: string): boolean {
    const budget = this.getCurrentBudget();
    return budget.some(cat => 
      cat.name.toLowerCase() === name.toLowerCase() && cat.id !== excludeId
    );
  }

  // Get category statistics
  static getCategoryStats(categoryId: string): {
    totalItems: number;
    totalProjected: number;
    totalActual: number;
  } {
    const category = this.getCategoryById(categoryId);
    if (!category) {
      return { totalItems: 0, totalProjected: 0, totalActual: 0 };
    }

    return {
      totalItems: category.items.length,
      totalProjected: category.items.reduce((sum, item) => sum + item.projected, 0),
      totalActual: category.items.reduce((sum, item) => sum + item.actual, 0)
    };
  }
}
