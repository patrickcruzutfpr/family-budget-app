import React from 'react';
import { BudgetItem, CategoryType } from '@/types';
import { EditableCell } from '@/components/ui/EditableCell';
import { EditableTextCell } from '@/components/ui/EditableTextCell';
import { Trash2Icon } from '@/assets/icons/Trash2Icon';
import { useI18n } from '@/i18n';
import { useCategoryTranslations, useFormatters } from '@/hooks';
import { ColumnVisibility } from '@/hooks/useColumnVisibility';

interface BudgetRowProps {
  item: BudgetItem;
  categoryId: string;
  categoryType: CategoryType;
  updateItemValue: (categoryId: string, itemId: string, field: 'projected' | 'actual', value: number) => void;
  updateItemName: (categoryId: string, itemId: string, name: string) => void;
  deleteItem: (categoryId: string, itemId: string) => void;
  visibility: ColumnVisibility;
}

export const BudgetRow: React.FC<BudgetRowProps> = ({ item, categoryId, categoryType, updateItemValue, updateItemName, deleteItem, visibility }) => {
  const { t } = useI18n();
  const { translateItemName } = useCategoryTranslations();
  const { formatCurrency } = useFormatters();
  const difference = item.projected - item.actual;
  
  const isIncomeCategory = categoryType === CategoryType.INCOME;
  let differenceColor;
  
  if (isIncomeCategory) {
    differenceColor = difference >= 0 ? 'text-green-600' : 'text-red-600';
  } else {
    differenceColor = difference >= 0 ? 'text-green-600' : 'text-red-600';
  }
  
  return (
    <tr className="hover:bg-gray-50 group budget-row">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700" style={{ verticalAlign: 'middle' }}>
        <EditableTextCell
          value={item.name}
          displayValue={translateItemName(item.name)}
          onSave={(name) => updateItemName(categoryId, item.id, name)}
          placeholder={t('budget.itemNamePlaceholder', 'Item name')}
        />
      </td>
      {visibility.projected && (
        <td className="whitespace-nowrap text-sm text-gray-500 text-right numeric-cell" style={{ verticalAlign: 'middle' }}>
          <EditableCell
            value={item.projected}
            onSave={(value) => updateItemValue(categoryId, item.id, 'projected', value)}
          />
        </td>
      )}
      {visibility.actual && (
        <td className="whitespace-nowrap text-sm text-gray-500 text-right numeric-cell" style={{ verticalAlign: 'middle' }}>
          <EditableCell
            value={item.actual}
            onSave={(value) => updateItemValue(categoryId, item.id, 'actual', value)}
          />
        </td>
      )}
      {visibility.difference && (
        <td className={`whitespace-nowrap text-sm text-right font-medium numeric-cell ${differenceColor}`} style={{ verticalAlign: 'middle' }}>
          <div className="py-1 px-2 text-right text-sm">
            {formatCurrency(difference)}
          </div>
        </td>
      )}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium action-cell" style={{ verticalAlign: 'middle' }}>
        <button 
          onClick={() => deleteItem(categoryId, item.id)}
          className="text-gray-400 hover:text-danger opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center ml-auto no-print"
          title={t('budget.deleteItem', 'Delete Item')}
        >
          <Trash2Icon className="w-4 h-4"/>
        </button>
      </td>
    </tr>
  );
};
