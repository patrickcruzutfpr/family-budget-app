import { BudgetState, AISuggestion } from "@/types";

// Mock implementation for testing when API key is suspended
export const getBudgetSuggestionsMock = async (budget: BudgetState): Promise<AISuggestion[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const simplifiedBudget = {
    totalIncome: budget
      .find(c => c.type === 'INCOME')
      ?.items.reduce((sum, item) => sum + item.actual, 0) || 0,
    expenses: budget
      .filter(c => c.type === 'EXPENSE')
      .map(category => ({
        category: category.name,
        projected: category.items.reduce((sum, item) => sum + item.projected, 0),
        actual: category.items.reduce((sum, item) => sum + item.actual, 0),
      })),
  };

  // Generate contextual suggestions based on actual budget data
  const suggestions: AISuggestion[] = [];
  
  // Find over-budget categories
  const overBudgetCategories = simplifiedBudget.expenses.filter(
    exp => exp.actual > exp.projected
  );
  
  if (overBudgetCategories.length > 0) {
    const worstCategory = overBudgetCategories.reduce((worst, current) => 
      (current.actual - current.projected) > (worst.actual - worst.projected) ? current : worst
    );
    
    suggestions.push({
      title: `Reduce ${worstCategory.category} Spending`,
      suggestion: `You're $${worstCategory.actual - worstCategory.projected} over budget in ${worstCategory.category}. Consider setting weekly limits or finding alternatives to reduce this category.`
    });
  }
  
  // Income vs expenses check
  const totalExpenses = simplifiedBudget.expenses.reduce((sum, exp) => sum + exp.actual, 0);
  const savingsRate = ((simplifiedBudget.totalIncome - totalExpenses) / simplifiedBudget.totalIncome) * 100;
  
  if (savingsRate < 20) {
    suggestions.push({
      title: "Boost Your Savings Rate",
      suggestion: `Your current savings rate is ${savingsRate.toFixed(1)}%. Aim for at least 20% by identifying the top 3 expenses you can reduce this month.`
    });
  }
  
  // Generic helpful suggestion
  suggestions.push({
    title: "Track Daily Spending",
    suggestion: "Consider using the envelope method: allocate cash for discretionary spending categories to naturally limit overspending."
  });
  
  // Ensure we always return 3 suggestions
  while (suggestions.length < 3) {
    suggestions.push({
      title: "Emergency Fund Focus",
      suggestion: "Build an emergency fund covering 3-6 months of expenses. Start with just $1000 as your initial goal."
    });
  }
  
  return suggestions.slice(0, 3);
};
