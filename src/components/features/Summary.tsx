import React from 'react';
import { ArrowDownIcon } from '@/assets/icons/ArrowDownIcon';
import { ArrowUpIcon } from '@/assets/icons/ArrowUpIcon';
import { ScaleIcon } from '@/assets/icons/ScaleIcon';
import { useI18n } from '@/i18n';
import { useFormatters } from '@/hooks';

interface SummaryProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

const SummaryCard: React.FC<{ 
  title: string; 
  amount: number; 
  icon: React.ReactNode; 
  colorClass: string;
  formatCurrency: (amount: number) => string;
}> = ({ title, amount, icon, colorClass, formatCurrency }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg shadow-gray-200/50 flex items-center gap-5">
    <div className={`rounded-full p-3 ${colorClass}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{formatCurrency(amount)}</p>
    </div>
  </div>
);

export const Summary: React.FC<SummaryProps> = ({ totalIncome, totalExpenses, balance }) => {
  const { t } = useI18n();
  const { formatCurrency } = useFormatters();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SummaryCard 
        title={t('summary.totalIncome', 'Total Income')}
        amount={totalIncome}
        icon={<ArrowDownIcon className="w-6 h-6 text-white"/>}
        colorClass="bg-success"
        formatCurrency={formatCurrency}
      />
      <SummaryCard 
        title={t('summary.totalExpenses', 'Total Expenses')}
        amount={totalExpenses}
        icon={<ArrowUpIcon className="w-6 h-6 text-white" />}
        colorClass="bg-danger"
        formatCurrency={formatCurrency}
      />
      <SummaryCard 
        title={t('summary.balance', 'Balance')}
        amount={balance}
        icon={<ScaleIcon className="w-6 h-6 text-white" />}
        colorClass={balance >= 0 ? "bg-primary" : "bg-warning"}
        formatCurrency={formatCurrency}
      />
    </div>
  );
};
