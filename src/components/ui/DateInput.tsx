import React, { useState } from 'react';
import { useFormatters } from '../../hooks';
import { useI18n } from '../../i18n';

interface DateInputProps {
  value?: Date;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  placeholder,
  className = '',
  required = false
}) => {
  const [inputValue, setInputValue] = useState(value ? formatInputDate(value) : '');
  const [error, setError] = useState<string | null>(null);
  const { getDateFormatPattern } = useFormatters();
  const { t } = useI18n();

  function formatInputDate(date: Date): string {
    // Format for HTML date input (always YYYY-MM-DD)
    return date.toISOString().split('T')[0];
  }

  function parseInputDate(value: string): Date | null {
    if (!value) return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setError(null);

    if (!newValue) {
      onChange(null);
      return;
    }

    const parsedDate = parseInputDate(newValue);
    if (parsedDate) {
      onChange(parsedDate);
    } else {
      setError(t('validation.invalidDate'));
    }
  };

  const handleBlur = () => {
    if (required && !inputValue) {
      setError(t('validation.required'));
    }
  };

  return (
    <div className="relative">
      <input
        type="date"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder || getDateFormatPattern()}
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
          focus:ring-primary focus:border-primary
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        aria-describedby={error ? 'date-error' : undefined}
        aria-invalid={!!error}
      />
      {error && (
        <p id="date-error" className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

interface LocalizedDateDisplayProps {
  date: Date;
  showTime?: boolean;
  className?: string;
}

export const LocalizedDateDisplay: React.FC<LocalizedDateDisplayProps> = ({
  date,
  showTime = false,
  className = ''
}) => {
  const { formatDate, formatDateTime } = useFormatters();

  return (
    <span className={className}>
      {showTime ? formatDateTime(date) : formatDate(date)}
    </span>
  );
};
