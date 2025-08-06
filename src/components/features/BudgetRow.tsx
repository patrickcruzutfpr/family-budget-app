import React from 'react';
import { BudgetItem } from '@/types';
import { EditableCell } from '@/components/ui/EditableCell';
import { Trash2Icon } from '@/assets/icons/Trash2Icon';
import { useCategoryTranslations, useFormatters } from '@/hooks';

interface BudgetRowProps {
  item: BudgetItem;
  categoryId: string;
  updateItemValue: (categoryId: string, itemId: string, field: 'projected' | 'actual', value: number) => void;
  deleteItem: (categoryId: string, itemId: string) => void;
}

export const BudgetRow: React.FC<BudgetRowProps> = ({ item, categoryId, updateItemValue, deleteItem }) => {
  const { translateItemName } = useCategoryTranslations();
  const { formatCurrency } = useFormatters();
  const difference = item.projected - item.actual;
  const differenceColor = difference >= 0 ? 'text-green-600' : 'text-red-600';
  
  return (
    <tr className="hover:bg-gray-50 group">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{translateItemName(item.name)}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
        <EditableCell
          value={item.projected}
          onSave={(value) => updateItemValue(categoryId, item.id, 'projected', value)}
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
        <EditableCell
          value={item.actual}
          onSave={(value) => updateItemValue(categoryId, item.id, 'actual', value)}
        />
      </td>
      <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${differenceColor}`}>
        {formatCurrency(difference)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button 
          onClick={() => deleteItem(categoryId, item.id)}
          className="text-gray-400 hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Delete item"
        >
          <Trash2Icon className="w-4 h-4"/>
        </button>
      </td>
    </tr>
  );
};
