import React, { useMemo } from 'react';
import { Category } from '@/types';
import { BudgetRow } from './BudgetRow';
import { PlusCircleIcon } from '@/assets/icons/PlusCircleIcon';
import { useI18n } from '@/i18n';
import { useCategoryTranslations, useFormatters } from '@/hooks';

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
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-2/5">
              {t('budget.name', 'Item')}
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
              {t('budget.projected', 'Projected')}
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
              {t('budget.actual', 'Actual')}
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
              {t('budget.difference', 'Difference')}
            </th>
            <th scope="col" className="relative px-6 py-3">
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

            return (
              <React.Fragment key={category.id}>
                <tr className="bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800" colSpan={1}>{translateCategoryName(category.name)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-600 text-right">{formatCurrency(categoryTotals.projected)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-600 text-right">{formatCurrency(categoryTotals.actual)}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${categoryDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(categoryDifference)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => addItem(category.id)} className="text-primary hover:text-secondary transition-colors duration-200 flex items-center justify-center ml-auto" title={t('budget.addItem', 'Add')}>
                           <PlusCircleIcon className="w-4 h-4"/>
                        </button>
                    </td>
                </tr>
                {category.items.map((item) => (
                  <BudgetRow
                    key={item.id}
                    item={item}
                    categoryId={category.id}
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
