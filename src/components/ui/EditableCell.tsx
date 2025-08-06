import React, { useState, useEffect } from 'react';

interface EditableCellProps {
  value: number;
  onSave: (value: number) => void;
}

export const EditableCell: React.FC<EditableCellProps> = ({ value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value.toString());

  useEffect(() => {
    if (!isEditing) {
      setCurrentValue(value.toString());
    }
  }, [value, isEditing]);

  const handleSave = () => {
    const numericValue = parseFloat(currentValue);
    if (!isNaN(numericValue)) {
      onSave(numericValue);
    } else {
      // Revert if input is not a valid number
      setCurrentValue(value.toString());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setCurrentValue(value.toString());
      setIsEditing(false);
    }
  };
  
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  }

  if (isEditing) {
    return (
      <input
        type="number"
        step="0.01"
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="w-28 py-1 px-2 text-right bg-white border border-secondary rounded-md shadow-sm focus:ring-primary focus:border-primary"
        autoFocus
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="cursor-pointer w-28 py-1 px-2 text-right rounded-md hover:bg-gray-200 transition-colors"
    >
      {formatCurrency(value)}
    </div>
  );
};
