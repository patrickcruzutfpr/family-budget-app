import React, { useMemo } from 'react';
import { Category } from '../types';
import { BudgetRow } from './BudgetRow';
import { PlusCircleIcon } from './icons/PlusCircleIcon';

interface BudgetTableProps {
  categories: Category[];
  updateItemValue: (categoryId: string, itemId: string, field: 'projected' | 'actual', value: number) => void;
  addItem: (categoryId: string) => void;
  deleteItem: (categoryId: string, itemId: string) => void;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
};


export const BudgetTable: React.FC<BudgetTableProps> = ({ categories, updateItemValue, addItem, deleteItem }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-2/5">
              Item
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
              Projected
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
              Actual
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
              Difference
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800" colSpan={1}>{category.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-600 text-right">{formatCurrency(categoryTotals.projected)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-600 text-right">{formatCurrency(categoryTotals.actual)}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${categoryDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(categoryDifference)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => addItem(category.id)} className="text-primary hover:text-secondary transition-colors duration-200 flex items-center gap-1 ml-auto">
                           <PlusCircleIcon className="w-4 h-4"/> Add
                        </button>
                    </td>
                </tr>
                {category.items.map((item) => (
                  <BudgetRow
                    key={item.id}
                    item={item}
                    categoryId={category.id}
                    updateItemValue={updateItemValue}
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
