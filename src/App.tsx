import React, { useMemo, useState } from 'react';
import { useBudget } from '@/hooks';
import { BudgetTable, Summary, BudgetChart, AIFeature, Header, ProfileManager } from '@/components';
import { CategoryType } from '@/types';

function App(): React.ReactNode {
  const [showProfileManager, setShowProfileManager] = useState(false);
  const {
    budget,
    updateItemValue,
    addItem,
    deleteItem,
    resetBudget,
    reloadBudget,
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
      <Header onReset={resetBudget} onManageProfiles={() => setShowProfileManager(true)} />
      
      {showProfileManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Profile Management</h2>
              <button
                onClick={() => setShowProfileManager(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <ProfileManager 
                onProfileChange={() => {
                  reloadBudget();
                  setShowProfileManager(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

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
