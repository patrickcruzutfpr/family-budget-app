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
}

export type BudgetState = Category[];

export interface AISuggestion {
  title: string;
  suggestion: string;
}
