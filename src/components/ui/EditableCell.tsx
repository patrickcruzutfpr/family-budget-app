import React, { useState, useEffect } from 'react';
import { useFormatters } from '../../hooks';
import { useI18n } from '../../i18n';

interface EditableCellProps {
  value: number;
  onSave: (value: number) => void;
}

export const EditableCell: React.FC<EditableCellProps> = ({ value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState('');
  const { formatCurrency, parseCurrency, getCurrencySymbol, isValidCurrencyFormat } = useFormatters();
  const { t } = useI18n();

  useEffect(() => {
    if (!isEditing) {
      setCurrentValue(formatCurrency(value));
    }
  }, [value, isEditing, formatCurrency]);

  const handleSave = () => {
    if (isValidCurrencyFormat(currentValue)) {
      const numericValue = parseCurrency(currentValue);
      if (numericValue >= 0) {
        onSave(numericValue);
        setIsEditing(false);
        return;
      }
    }
    
    // Revert if input is not valid
    setCurrentValue(formatCurrency(value));
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setCurrentValue(formatCurrency(value));
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
        placeholder={t('formats.currency.placeholder')}
        className="w-32 py-1 px-2 text-right bg-white border border-secondary rounded-md shadow-sm focus:ring-primary focus:border-primary text-sm"
        autoFocus
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="cursor-pointer w-32 py-1 px-2 text-right rounded-md hover:bg-gray-200 transition-colors text-sm"
      title={t('validation.invalidCurrency')}
    >
      {formatCurrency(value)}
    </div>
  );
};
