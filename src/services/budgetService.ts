import { BudgetState, Category, CategoryType } from '@/types';

const STORAGE_KEY = 'familyBudget';

const initialBudget: BudgetState = [
  {
    id: 'income',
    name: 'Income',
    type: CategoryType.INCOME,
    items: [
      { id: 'income-1', name: 'Salário Líquido', projected: 5000, actual: 5000 },
      { id: 'income-2', name: 'Outras Rendas', projected: 0, actual: 0 },
    ],
  },
  {
    id: 'housing',
    name: 'Housing',
    type: CategoryType.EXPENSE,
    items: [
      { id: 'housing-1', name: 'Aluguel/Financiamento', projected: 1500, actual: 1500 },
      { id: 'housing-2', name: 'Contas Básicas', projected: 200, actual: 185 },
      { id: 'housing-3', name: 'Internet', projected: 60, actual: 60 },
    ],
  },
  {
    id: 'transportation',
    name: 'Transportation',
    type: CategoryType.EXPENSE,
    items: [
      { id: 'transport-1', name: 'Financiamento do Carro', projected: 350, actual: 350 },
      { id: 'transport-2', name: 'Gasolina', projected: 150, actual: 180 },
      { id: 'transport-3', name: 'Seguro do Veículo', projected: 120, actual: 120 },
    ],
  },
  {
    id: 'food',
    name: 'Food',
    type: CategoryType.EXPENSE,
    items: [
      { id: 'food-1', name: 'Supermercado', projected: 600, actual: 750 },
      { id: 'food-2', name: 'Restaurantes', projected: 200, actual: 280 },
    ],
  },
    {
    id: 'personal',
    name: 'Personal & Family',
    type: CategoryType.EXPENSE,
    items: [
      { id: 'personal-1', name: 'Cuidados Infantis', projected: 800, actual: 800 },
      { id: 'personal-2', name: 'Entretenimento', projected: 150, actual: 200 },
      { id: 'personal-3', name: 'Compras', projected: 100, actual: 150 },
    ],
  },
  {
    id: 'savings',
    name: 'Savings & Investments',
    type: CategoryType.EXPENSE,
    items: [
        { id: 'savings-1', name: 'Previdência Privada', projected: 300, actual: 300 },
        { id: 'savings-2', name: 'Investimentos', projected: 200, actual: 200 },
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
    try {
        // Clear all possible storage keys
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('familyBudget');
        localStorage.removeItem('budget');
        localStorage.removeItem('family-budget-language'); // Force language reset too
        
        // Clear any profile-related data that might interfere
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.includes('budget') || key.includes('Budget') || key.includes('profile')) {
                localStorage.removeItem(key);
            }
        });
        
        // Force page reload to clear any cached state
        setTimeout(() => {
            window.location.reload();
        }, 100);
        
    } catch (error) {
        console.error('Failed to clear localStorage', error);
    }
    return JSON.parse(JSON.stringify(initialBudget)); // Return a deep copy
}
