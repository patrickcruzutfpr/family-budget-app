import { Category, CategoryType, CategoryFormData, BudgetState } from '../types';
import { getCurrentProfile, updateCurrentProfileBudget, saveProfile } from './profileService';
import { generateId } from '../utils/generateId';
import { getInitialLanguage } from '../i18n/utils';

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

  // Get translations for default categories
  private static getDefaultTranslations() {
    // Try multiple sources for language detection
    let currentLanguage;
    
    try {
      // 1. Try to get from localStorage first (user preference)
      const stored = localStorage.getItem('family-budget-language');
      if (stored && (stored === 'pt-BR' || stored === 'en')) {
        currentLanguage = stored;
      }
    } catch (error) {
      console.warn('Failed to get language from localStorage:', error);
    }
    
    // 2. If no stored preference, use initial language detection
    if (!currentLanguage) {
      currentLanguage = getInitialLanguage();
    }
    
    // 3. Final fallback based on browser language if detection fails
    if (!currentLanguage || (currentLanguage !== 'pt-BR' && currentLanguage !== 'en')) {
      const browserLang = navigator.language || navigator.languages?.[0] || 'pt-BR';
      currentLanguage = browserLang.startsWith('pt') ? 'pt-BR' : 'en';
    }
    
    const translations = {
      'pt-BR': {
        income: 'Renda',
        housing: 'Habitação',
        transportation: 'Transporte',
        food: 'Alimentação',
        personalFamily: 'Pessoal e Família',
        savingsInvestments: 'Poupança e Investimentos',
        incomeDesc: 'Categoria padrão de renda',
        expenseDesc: 'Categoria de gastos'
      },
      'en': {
        income: 'Income',
        housing: 'Housing',
        transportation: 'Transportation',
        food: 'Food',
        personalFamily: 'Personal & Family',
        savingsInvestments: 'Savings & Investments',
        incomeDesc: 'Default income category',
        expenseDesc: 'Expense category'
      }
    };

    return translations[currentLanguage as keyof typeof translations] || translations['pt-BR'];
  }

  // Get default categories (not used anymore, kept for reference)
  static getDefaultCategories(): Category[] {
    const t = this.getDefaultTranslations();
    
    const defaultExpenseCategories = [
      { name: t.housing, icon: '🏠', color: '#3B82F6' },
      { name: t.transportation, icon: '🚗', color: '#EF4444' },
      { name: t.food, icon: '🍽️', color: '#10B981' },
      { name: t.personalFamily, icon: '👨‍👩‍👧‍👦', color: '#F59E0B' },
      { name: t.savingsInvestments, icon: '🎯', color: '#8B5CF6' }
    ];

    return [
      {
        id: generateId(),
        name: t.income,
        type: CategoryType.INCOME,
        items: [],
        description: t.incomeDesc,
        icon: '💰',
        color: '#10B981',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      ...defaultExpenseCategories.map((categoryData, index) => ({
        id: generateId(),
        name: categoryData.name,
        type: CategoryType.EXPENSE,
        items: [],
        description: `${t.expenseDesc}: ${categoryData.name}`,
        icon: categoryData.icon,
        color: categoryData.color,
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
