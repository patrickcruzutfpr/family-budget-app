import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n';

interface EditableTextCellProps {
  value: string;
  displayValue?: string;
  onSave: (value: string) => void;
  placeholder?: string;
}

export const EditableTextCell: React.FC<EditableTextCellProps> = ({ 
  value, 
  displayValue,
  onSave, 
  placeholder 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState('');
  const { t } = useI18n();

  useEffect(() => {
    if (!isEditing) {
      setCurrentValue(value);
    }
  }, [value, isEditing]);

  const handleSave = () => {
    const trimmedValue = currentValue.trim();
    if (trimmedValue.length > 0) {
      onSave(trimmedValue);
      setIsEditing(false);
    } else {
      // Revert if input is empty
      setCurrentValue(value);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setCurrentValue(value);
      setIsEditing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(e.target.value);
  };

  if (isEditing) {
    return (
      <input
        type="text"
        value={currentValue}
        onChange={handleInputChange}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || t('budget.itemNamePlaceholder', 'Item name')}
        className="w-full py-1 px-2 bg-white border border-secondary rounded-md shadow-sm focus:ring-primary focus:border-primary text-sm"
        autoFocus
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="cursor-pointer w-full py-1 px-2 rounded-md hover:bg-gray-200 transition-colors text-sm min-h-[24px]"
      title={t('budget.clickToEdit', 'Click to edit')}
    >
      {displayValue || value || placeholder || t('budget.itemNamePlaceholder', 'Item name')}
    </div>
  );
};
