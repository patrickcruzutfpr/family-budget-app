import React, { useMemo } from 'react';
import { Category, CategoryType } from '@/types';
import { BudgetRow } from './BudgetRow';
import { PlusCircleIcon } from '@/assets/icons/PlusCircleIcon';
import { useI18n } from '@/i18n';
import { useCategoryTranslations, useFormatters } from '@/hooks';
import { StaticCell } from '@/components/ui/StaticCell';

interface BudgetTableProps {
  categories: Category[];
  updateItemValue: (categoryId: string, itemId: string, field: 'projected' | 'actual', value: number) => void;
  updateItemName: (categoryId: string, itemId: string, name: string) => void;
  addItem: (categoryId: string) => void;
  deleteItem: (categoryId: string, itemId: string) => void;
}

export const BudgetTable: React.FC<BudgetTableProps> = ({ categories, updateItemValue, updateItemName, addItem, deleteItem }) => {
  const { t } = useI18n();
  const { translateCategoryName } = useCategoryTranslations();
  const { formatCurrency } = useFormatters();
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 budget-table">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-2/5" style={{ verticalAlign: 'bottom' }}>
              {t('budget.name', 'Item')}
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider" style={{ verticalAlign: 'bottom' }}>
              {t('budget.projected', 'Projetado')}
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider" style={{ verticalAlign: 'bottom' }}>
              {t('budget.actual', 'Real')}
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider" style={{ verticalAlign: 'bottom' }}>
              {t('budget.difference', 'Diferença')}
            </th>
            <th scope="col" className="relative px-6 py-3 action-cell" style={{ verticalAlign: 'bottom' }}>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories.map((category) => {
            const categoryTotals = category.items.reduce((acc, item) => {
              acc.projected += item.projected;
              acc.actual += item.actual;
              return acc;
            }, { projected: 0, actual: 0 });
            const categoryDifference = categoryTotals.projected - categoryTotals.actual;
            
            // Inverte a lógica de cores para categoria de renda (INCOME)
            // Para renda: valores positivos = verde, valores negativos = vermelho
            // Para despesas: valores positivos = verde, valores negativos = vermelho
            const isIncomeCategory = category.type === CategoryType.INCOME;
            let differenceColorClass;
            
            if (isIncomeCategory) {
              // Para renda: positivo = bom (verde), negativo = ruim (vermelho)
              differenceColorClass = categoryDifference >= 0 ? 'text-green-600' : 'text-red-600';
            } else {
              // Para despesas: positivo = bom (verde), negativo = ruim (vermelho)
              differenceColorClass = categoryDifference >= 0 ? 'text-green-600' : 'text-red-600';
            }

            return (
              <React.Fragment key={category.id}>
                <tr className="bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">
                      <div className="flex items-center gap-2">
                        {category.icon && <span className="text-lg">{category.icon}</span>}
                        {translateCategoryName(category.name)}
                      </div>
                    </td>
                    <td className="whitespace-nowrap text-sm font-semibold text-gray-600 text-right numeric-cell">
                      <StaticCell value={formatCurrency(categoryTotals.projected)} className="text-right" />
                    </td>
                    <td className="whitespace-nowrap text-sm font-semibold text-gray-600 text-right numeric-cell">
                      <StaticCell value={formatCurrency(categoryTotals.actual)} className="text-right" />
                    </td>
                    <td className={`whitespace-nowrap text-sm font-semibold text-right numeric-cell ${differenceColorClass}`}>
                      <StaticCell value={formatCurrency(categoryDifference)} className="text-right" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium action-cell">
                        <button onClick={() => addItem(category.id)} className="text-primary hover:text-secondary transition-colors duration-200 flex items-center justify-center ml-auto no-print" title={t('budget.addItem', 'Add')}>
                           <PlusCircleIcon className="w-4 h-4"/>
                        </button>
                    </td>
                </tr>
                {category.items.map((item) => (
                  <BudgetRow
                    key={item.id}
                    item={item}
                    categoryId={category.id}
                    categoryType={category.type}
                    updateItemValue={updateItemValue}
                    updateItemName={updateItemName}
                    deleteItem={deleteItem}
                  />
                ))}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};