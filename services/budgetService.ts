import { BudgetState, Category, CategoryType } from '../types';

const STORAGE_KEY = 'familyBudget';

const initialBudget: BudgetState = [
  {
    id: 'income',
    name: 'Income',
    type: CategoryType.INCOME,
    items: [
      { id: 'income-1', name: 'Net Pay', projected: 5000, actual: 5000 },
      { id: 'income-2', name: 'Other Income', projected: 0, actual: 0 },
    ],
  },
  {
    id: 'housing',
    name: 'Housing',
    type: CategoryType.EXPENSE,
    items: [
      { id: 'housing-1', name: 'Mortgage/Rent', projected: 1500, actual: 1500 },
      { id: 'housing-2', name: 'Utilities', projected: 200, actual: 185 },
      { id: 'housing-3', name: 'Internet', projected: 60, actual: 60 },
    ],
  },
  {
    id: 'transportation',
    name: 'Transportation',
    type: CategoryType.EXPENSE,
    items: [
      { id: 'transport-1', name: 'Car Payment', projected: 350, actual: 350 },
      { id: 'transport-2', name: 'Gas & Fuel', projected: 150, actual: 180 },
      { id: 'transport-3', name: 'Insurance', projected: 120, actual: 120 },
    ],
  },
  {
    id: 'food',
    name: 'Food',
    type: CategoryType.EXPENSE,
    items: [
      { id: 'food-1', name: 'Groceries', projected: 600, actual: 750 },
      { id: 'food-2', name: 'Restaurants', projected: 200, actual: 280 },
    ],
  },
    {
    id: 'personal',
    name: 'Personal & Family',
    type: CategoryType.EXPENSE,
    items: [
      { id: 'personal-1', name: 'Childcare', projected: 800, actual: 800 },
      { id: 'personal-2', name: 'Entertainment', projected: 150, actual: 200 },
      { id: 'personal-3', name: 'Shopping', projected: 100, actual: 150 },
    ],
  },
  {
    id: 'savings',
    name: 'Savings & Investments',
    type: CategoryType.EXPENSE,
    items: [
        { id: 'savings-1', name: 'Retirement (401k)', projected: 300, actual: 300 },
        { id: 'savings-2', name: 'Investments', projected: 200, actual: 200 },
    ]
  }
];


export const loadBudget = (): BudgetState => {
  try {
    const storedBudget = localStorage.getItem(STORAGE_KEY);
    if (storedBudget) {
      return JSON.parse(storedBudget);
    }
  } catch (error) {
    console.error('Failed to load budget from localStorage', error);
  }
  return JSON.parse(JSON.stringify(initialBudget)); // Return a deep copy
};

export const saveBudget = (budget: BudgetState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(budget));
  } catch (error) {
    console.error('Failed to save budget to localStorage', error);
  }
};

export const resetBudgetToDefault = (): BudgetState => {
    localStorage.removeItem(STORAGE_KEY);
    return JSON.parse(JSON.stringify(initialBudget)); // Return a deep copy
}
