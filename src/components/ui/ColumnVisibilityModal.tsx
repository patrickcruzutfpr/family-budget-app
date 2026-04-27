import React, { useState } from 'react';
import { useI18n } from '@/i18n';
import { ColumnVisibility, TableColumn } from '@/hooks/useColumnVisibility';

interface ColumnVisibilityModalProps {
  visibility: ColumnVisibility;
  onVisibilityChange: (column: TableColumn, visible: boolean) => void;
  onClose: () => void;
  onReset: () => void;
}

export const ColumnVisibilityModal: React.FC<ColumnVisibilityModalProps> = ({
  visibility,
  onVisibilityChange,
  onClose,
  onReset,
}) => {
  const { t } = useI18n();
  const [showReset, setShowReset] = useState(false);

  const columns: { key: TableColumn; label: string }[] = [
    { key: 'name', label: t('budget.name', 'Item') },
    { key: 'projected', label: t('budget.projected', 'Projetado') },
    { key: 'actual', label: t('budget.actual', 'Real') },
    { key: 'difference', label: t('budget.difference', 'Diferença') },
  ];

  const handleReset = () => {
    onReset();
    setShowReset(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          {t('budget.columnVisibility', 'Column Visibility')}
        </h3>

        <div className="space-y-3 mb-6">
          {columns.map((column) => (
            <label key={column.key} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={visibility[column.key]}
                disabled={column.key === 'name'}
                onChange={(e) => onVisibilityChange(column.key, e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                {column.label}
                {column.key === 'name' && (
                  <span className="ml-2 text-xs text-gray-500">({t('budget.alwaysVisible', 'always visible')})</span>
                )}
              </span>
            </label>
          ))}
        </div>

        <div className="border-t pt-4 flex gap-2">
          {!showReset ? (
            <>
              <button
                onClick={() => setShowReset(true)}
                className="flex-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                {t('budget.reset', 'Reset')}
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-3 py-2 text-sm bg-primary text-white hover:bg-secondary rounded transition-colors"
              >
                {t('budget.done', 'Done')}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowReset(false)}
                className="flex-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                {t('budget.cancel', 'Cancel')}
              </button>
              <button
                onClick={handleReset}
                className="flex-1 px-3 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded transition-colors"
              >
                {t('budget.confirmReset', 'Reset All')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
