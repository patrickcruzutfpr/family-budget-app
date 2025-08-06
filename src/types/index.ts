export interface BudgetItem {
  id: string;
  name: string;
  projected: number;
  actual: number;
}

export enum CategoryType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  items: BudgetItem[];
  description?: string;
  icon?: string;
  color?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type BudgetState = Category[];

export interface AISuggestion {
  title: string;
  suggestion: string;
}

export interface BudgetProfile {
  id: string;
  name: string;
  description?: string;
  budget: BudgetState;
  createdAt: Date;
  updatedAt: Date;
  isDefault?: boolean;
}

export interface ProfileSummary {
  id: string;
  name: string;
  description?: string;
  totalIncome: number;
  totalExpenses: number;
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
  isDefault?: boolean;
}

// Category Management Types
export interface CategoryFormData {
  name: string;
  type: CategoryType;
  description?: string;
  icon?: string;
  color?: string;
}

export interface CategoryModalState {
  isOpen: boolean;
  mode: 'create' | 'edit';
  category?: Category;
}

export interface DeleteConfirmationState {
  isOpen: boolean;
  category?: Category;
}

// Default expense categories
export const DEFAULT_EXPENSE_CATEGORIES = [
  'Habitação',
  'Transporte', 
  'Alimentação',
  'Pessoal e Família',
  'Poupança e Investimentos'
] as const;
