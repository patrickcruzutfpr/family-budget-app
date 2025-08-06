import { useI18n } from '@/i18n';

// Hook para traduzir nomes de categorias padrão
export const useCategoryTranslations = () => {
  const { t } = useI18n();

  const translateCategoryName = (categoryName: string): string => {
    // Mapeamento de nomes padrão para chaves de tradução
    const categoryMap: { [key: string]: string } = {
      'Income': t('categories.income', 'Income'),
      'Housing': t('categories.housing', 'Housing'),
      'Transportation': t('categories.transportation', 'Transportation'),
      'Food': t('categories.food', 'Food'),
      'Personal & Family': t('categories.personalFamily', 'Personal & Family'),
      'Entertainment': t('categories.entertainment', 'Entertainment'),
      'Healthcare': t('categories.healthcare', 'Healthcare'),
      'Insurance': t('categories.insurance', 'Insurance'),
      'Debt Payments': t('categories.debtPayments', 'Debt Payments'),
      'Savings': t('categories.savings', 'Savings'),
      'Savings & Investments': t('categories.savingsInvestments', 'Savings & Investments'),
      'Personal Care': t('categories.personalCare', 'Personal Care'),
      'Miscellaneous': t('categories.miscellaneous', 'Miscellaneous'),
      'Utilities': t('categories.utilities', 'Utilities'),
    };

    return categoryMap[categoryName] || categoryName;
  };

  const translateItemName = (itemName: string): string => {
    // Mapeamento de itens padrão para chaves de tradução
    const itemMap: { [key: string]: string } = {
      // Income items
      'Net Pay': t('items.netPay', 'Net Pay'),
      'Other Income': t('items.otherIncome', 'Other Income'),
      'Salário Líquido': t('items.netPay', 'Salário Líquido'),
      'Outras Rendas': t('items.otherIncome', 'Outras Rendas'),
      
      // Housing items
      'Mortgage/Rent': t('items.mortgageRent', 'Mortgage/Rent'),
      'Utilities': t('items.utilities', 'Utilities'),
      'Internet': t('items.internet', 'Internet'),
      'Aluguel/Financiamento': t('items.mortgageRent', 'Aluguel/Financiamento'),
      'Contas Básicas': t('items.utilities', 'Contas Básicas'),
      
      // Transportation items
      'Car Payment': t('items.carPayment', 'Car Payment'),
      'Gas & Fuel': t('items.gasFuel', 'Gas & Fuel'),
      'Insurance': t('items.insurance', 'Insurance'),
      'Financiamento do Carro': t('items.carPayment', 'Financiamento do Carro'),
      'Gasolina': t('items.gasFuel', 'Gasolina'),
      'Seguro do Veículo': t('items.insurance', 'Seguro do Veículo'),
      
      // Food items
      'Groceries': t('items.groceries', 'Groceries'),
      'Restaurants': t('items.restaurants', 'Restaurants'),
      'Supermercado': t('items.groceries', 'Supermercado'),
      
      // Personal & Family items
      'Childcare': t('items.childcare', 'Childcare'),
      'Entertainment': t('items.entertainment', 'Entertainment'),
      'Shopping': t('items.shopping', 'Shopping'),
      'Cuidados Infantis': t('items.childcare', 'Cuidados Infantis'),
      'Entretenimento': t('items.entertainment', 'Entretenimento'),
      'Compras': t('items.shopping', 'Compras'),
      
      // Savings items
      'Retirement (401k)': t('items.retirement', 'Retirement (401k)'),
      'Investments': t('items.investments', 'Investments'),
      'Previdência Privada': t('items.retirement', 'Previdência Privada'),
    };

    return itemMap[itemName] || itemName;
  };

  return { translateCategoryName, translateItemName };
};
