import React, { useMemo } from 'react';
import { useBudget } from './hooks/useBudget';
import { BudgetTable } from './components/BudgetTable';
import { Summary } from './components/Summary';
import { BudgetChart } from './components/BudgetChart';
import { AIFeature } from './components/AIFeature';
import { CategoryType } from './types';
import { Header } from './components/Header';

function App(): React.ReactNode {
  const {
    budget,
    updateItemValue,
    addItem,
    deleteItem,
    resetBudget,
  } = useBudget();

  const { totalProjected, totalActual, totalIncome, totalExpenses } = useMemo(() => {
    let totalProjected = 0;
    let totalActual = 0;
    let totalIncome = 0;
    let totalExpenses = 0;

    budget.forEach(category => {
      category.items.forEach(item => {
        if (category.type === CategoryType.INCOME) {
          totalIncome += item.actual;
        } else {
          totalExpenses += item.actual;
          totalProjected += item.projected;
          totalActual += item.actual;
        }
      });
    });

    return { totalProjected, totalActual, totalIncome, totalExpenses };
  }, [budget]);
  
  const balance = totalIncome - totalExpenses;

  const expenseCategories = useMemo(() => budget.filter(c => c.type === CategoryType.EXPENSE), [budget]);
  const incomeCategory = useMemo(() => budget.find(c => c.type === CategoryType.INCOME), [budget]);


  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header onReset={resetBudget} />
      <main className="p-4 sm:p-6 lg:p-8">
        <Summary 
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          balance={balance}
        />
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl shadow-lg shadow-gray-200/50">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Budget Breakdown</h2>
                {incomeCategory && (
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-primary mb-3 border-b-2 border-primary/20 pb-2">Income</h3>
                        <BudgetTable
                            categories={[incomeCategory]}
                            updateItemValue={updateItemValue}
                            addItem={addItem}
                            deleteItem={deleteItem}
                        />
                    </div>
                )}
                <div>
                    <h3 className="text-xl font-semibold text-primary mb-3 border-b-2 border-primary/20 pb-2">Expenses</h3>
                    <BudgetTable
                        categories={expenseCategories}
                        updateItemValue={updateItemValue}
                        addItem={addItem}
                        deleteItem={deleteItem}
                    />
                </div>
            </div>
          </div>
          <div className="space-y-8">
            <BudgetChart data={expenseCategories} />
            <AIFeature budget={budget} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
