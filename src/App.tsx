import React, { useMemo, useState, useEffect } from 'react';
import { useBudget } from '@/hooks';
import { BudgetTable, Summary, BudgetChart, AIFeature, Header, ProfileManager, CategoryManager } from '@/components';
import { CategoryType } from '@/types';
import { useI18n } from '@/i18n';
import { migrateCategoryData, ensureDefaultCategories } from '@/utils/categoryMigration';
import { debugCategoryImportExport, cleanupDebugData } from '@/utils/debugCategoryImportExport';
import { useProfileCategoriesLanguageSync } from '@/hooks/useProfileCategoriesLanguageSync';
import { runAISuggestionsTest } from '@/utils/testAISuggestions';

function App(): React.ReactNode {
  const [showProfileManager, setShowProfileManager] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const { t, language, isLoading } = useI18n();
  
  // Use the new hook to sync profile categories with language changes
  useProfileCategoriesLanguageSync();
  
  const {
    budget,
    updateItemValue,
    updateItemName,
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

  // Initialize category migration and default categories on first load
  useEffect(() => {
    migrateCategoryData();
    ensureDefaultCategories();
    
    // Add debug functions to window for testing
    (window as any).debugCategoryImportExport = debugCategoryImportExport;
    (window as any).cleanupDebugData = cleanupDebugData;
    (window as any).testAISuggestions = runAISuggestionsTest;
    
    // Add category language test function
    (window as any).testCategoryLanguageUpdate = () => {
      const { updateAllProfileCategoriesLanguage } = require('@/services/profileService');
      const wasUpdated = updateAllProfileCategoriesLanguage();
      console.log('Category language update test:', wasUpdated ? 'SUCCESS' : 'NO CHANGES');
      return wasUpdated;
    };
    
    // Add AI suggestions test function
    (window as any).addTestAISuggestions = () => {
      const testData = {
        'pt-BR': [
          {
            id: 'test-fav-1',
            title: 'Economize no Supermercado',
            suggestion: 'Faça uma lista de compras para evitar gastos desnecessários',
            savedAt: new Date(),
            language: 'pt-BR',
            isFavorite: true
          },
          {
            id: 'test-normal-1',
            title: 'Corte Gastos com Transporte', 
            suggestion: 'Use transporte público para economizar combustível',
            savedAt: new Date(),
            language: 'pt-BR',
            isFavorite: false
          }
        ]
      };
      localStorage.setItem('family-budget-saved-suggestions', JSON.stringify(testData));
      console.log('✅ Test AI suggestions added! Export a profile to test.');
    };

    // Add comprehensive test function
    (window as any).testAIExportImport = () => {
      console.log('🧪 Running comprehensive AI export/import test...');
      
      // Step 1: Add test data
      (window as any).addTestAISuggestions();
      
      setTimeout(() => {
        console.log('📋 Step 1: Test suggestions added');
        console.log('📋 Step 2: Now export your current profile using Profile Manager');
        console.log('📋 Step 3: Then import the exported file to test favorites restoration');
        console.log('📋 Watch console for detailed logs during export/import process');
      }, 500);
    };
    
    console.log('🧪 Debug functions available: debugCategoryImportExport(), cleanupDebugData(), testAISuggestions(), addTestAISuggestions(), testAIExportImport()');
  }, []);

  // Listen for category changes and reload budget
  useEffect(() => {
    const handleCategoryChange = () => {
      reloadBudget();
    };

    window.addEventListener('categoryDataChanged', handleCategoryChange);
    return () => {
      window.removeEventListener('categoryDataChanged', handleCategoryChange);
    };
  }, [reloadBudget]);

  // Show loading screen while translations are loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header 
        onReset={resetBudget} 
        onManageProfiles={() => setShowProfileManager(true)}
        onManageCategories={() => setShowCategoryManager(true)}
      />
      
      {showProfileManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">{t('profiles.title', 'Profile Management')}</h2>
              <button
                onClick={() => setShowProfileManager(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                aria-label={t('profiles.close', 'Close')}
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

      {showCategoryManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">{t('categoryManager.title', 'Gerenciamento de Categorias')}</h2>
              <button
                onClick={() => setShowCategoryManager(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                aria-label={t('common.close', 'Fechar')}
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
              <CategoryManager 
                onCategoryChange={() => {
                  reloadBudget(); // Reload budget when categories change
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
                <h2 className="text-2xl font-bold text-gray-700 mb-4">{t('budget.breakdown', 'Budget Breakdown')}</h2>
                {incomeCategory && (
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-primary mb-3 border-b-2 border-primary/20 pb-2">{t('budget.income', 'Income')}</h3>
                        <BudgetTable
                            categories={[incomeCategory]}
                            updateItemValue={updateItemValue}
                            updateItemName={updateItemName}
                            addItem={addItem}
                            deleteItem={deleteItem}
                        />
                    </div>
                )}
                <div>
                    <h3 className="text-xl font-semibold text-primary mb-3 border-b-2 border-primary/20 pb-2">{t('budget.expenses', 'Expenses')}</h3>
                    <BudgetTable
                        categories={expenseCategories}
                        updateItemValue={updateItemValue}
                        updateItemName={updateItemName}
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
