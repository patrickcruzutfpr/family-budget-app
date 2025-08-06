import React, { useState } from 'react';
import { useFormatters } from '../../hooks';
import { useI18n } from '../../i18n';
import { useNotification } from '../ui/Notification';

export const LocalizationDemo: React.FC = () => {
  const [testAmount, setTestAmount] = useState(1234.56);
  const [testDate] = useState(new Date());
  const { formatCurrency, formatDate, formatPercentage, getCurrencySymbol, getDateFormatPattern } = useFormatters();
  const { t, language } = useI18n();
  const { showNotification } = useNotification();

  const handleTestNotification = () => {
    showNotification('success', 'messages.saveSuccess');
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg shadow-gray-200/50 mt-4">
      <h3 className="text-xl font-bold text-gray-700 mb-4">
        {t('common.demo', 'Localization Demo')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-gray-600 mb-2">
            {t('common.currency', 'Currency Formatting')}
          </h4>
          <p className="text-sm text-gray-500 mb-1">
            Current locale: <span className="font-mono">{language}</span>
          </p>
          <p className="text-lg font-semibold text-primary">
            {formatCurrency(testAmount)}
          </p>
          <p className="text-xs text-gray-400">
            Symbol: {getCurrencySymbol()}
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-600 mb-2">
            {t('common.date', 'Date Formatting')}
          </h4>
          <p className="text-sm text-gray-500 mb-1">
            Pattern: <span className="font-mono">{getDateFormatPattern()}</span>
          </p>
          <p className="text-lg font-semibold text-primary">
            {formatDate(testDate)}
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-600 mb-2">
            {t('common.percentage', 'Percentage')}
          </h4>
          <p className="text-lg font-semibold text-primary">
            {formatPercentage(15.5)}
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-600 mb-2">
            {t('common.notifications', 'Notifications')}
          </h4>
          <button
            onClick={handleTestNotification}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
          >
            {t('common.test', 'Test Notification')}
          </button>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>Features implemented:</strong>
        </p>
        <ul className="text-xs text-gray-500 mt-1 list-disc list-inside">
          <li>💰 Dynamic currency formatting (R$ / $)</li>
          <li>📅 Localized date formats (dd/MM/yyyy / MM/dd/yyyy)</li>
          <li>🔍 Validation messages in current language</li>
          <li>📢 Notification system with localized messages</li>
          <li>🌐 Browser language detection</li>
        </ul>
      </div>
    </div>
  );
};
