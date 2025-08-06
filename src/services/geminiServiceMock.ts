import { BudgetState, AISuggestion } from "@/types";
import { SupportedLanguage } from "@/i18n";

// Mock implementation for testing when API key is suspended
export const getBudgetSuggestionsMock = async (budget: BudgetState, language: SupportedLanguage = 'pt-BR'): Promise<AISuggestion[]> => {
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
    
    if (language === 'en') {
      suggestions.push({
        title: `Reduce ${worstCategory.category} Spending`,
        suggestion: `You're $${worstCategory.actual - worstCategory.projected} over budget in ${worstCategory.category}. Consider setting weekly limits or finding alternatives to reduce this category.`
      });
    } else {
      suggestions.push({
        title: `Reduza Gastos em ${worstCategory.category}`,
        suggestion: `Você está R$ ${worstCategory.actual - worstCategory.projected} acima do orçamento em ${worstCategory.category}. Considere estabelecer limites semanais ou encontrar alternativas para reduzir esta categoria.`
      });
    }
  }
  
  // Income vs expenses check
  const totalExpenses = simplifiedBudget.expenses.reduce((sum, exp) => sum + exp.actual, 0);
  const savingsRate = ((simplifiedBudget.totalIncome - totalExpenses) / simplifiedBudget.totalIncome) * 100;
  
  if (savingsRate < 20) {
    if (language === 'en') {
      suggestions.push({
        title: "Boost Your Savings Rate",
        suggestion: `Your current savings rate is ${savingsRate.toFixed(1)}%. Aim for at least 20% by identifying the top 3 expenses you can reduce this month.`
      });
    } else {
      suggestions.push({
        title: "Aumente Sua Taxa de Poupança",
        suggestion: `Sua taxa de poupança atual é ${savingsRate.toFixed(1)}%. Procure pelo menos 20% identificando os 3 principais gastos que você pode reduzir este mês.`
      });
    }
  }
  
  // Generic helpful suggestion
  if (language === 'en') {
    suggestions.push({
      title: "Track Daily Spending",
      suggestion: "Consider using the envelope method: allocate cash for discretionary spending categories to naturally limit overspending."
    });
  } else {
    suggestions.push({
      title: "Acompanhe Gastos Diários",
      suggestion: "Considere usar o método dos envelopes: separe dinheiro para categorias de gastos discricionários para naturalmente limitar excessos."
    });
  }
  
  // Ensure we always return 3 suggestions
  while (suggestions.length < 3) {
    if (language === 'en') {
      suggestions.push({
        title: "Emergency Fund Focus",
        suggestion: "Build an emergency fund covering 3-6 months of expenses. Start with just $1000 as your initial goal."
      });
    } else {
      suggestions.push({
        title: "Foque na Reserva de Emergência",
        suggestion: "Construa uma reserva de emergência cobrindo 3-6 meses de gastos. Comece com apenas R$ 1.000 como meta inicial."
      });
    }
  }
  
  return suggestions.slice(0, 3);
};
