import React from 'react';
import { ArrowDownIcon } from './icons/ArrowDownIcon';
import { ArrowUpIcon } from './icons/ArrowUpIcon';
import { ScaleIcon } from './icons/ScaleIcon';

interface SummaryProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

const SummaryCard: React.FC<{ title: string; amount: number; icon: React.ReactNode; colorClass: string; }> = ({ title, amount, icon, colorClass }) => (
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SummaryCard 
        title="Total Income"
        amount={totalIncome}
        icon={<ArrowDownIcon className="w-6 h-6 text-white"/>}
        colorClass="bg-success"
      />
      <SummaryCard 
        title="Total Expenses"
        amount={totalExpenses}
        icon={<ArrowUpIcon className="w-6 h-6 text-white" />}
        colorClass="bg-danger"
      />
      <SummaryCard 
        title="Remaining Balance"
        amount={balance}
        icon={<ScaleIcon className="w-6 h-6 text-white" />}
        colorClass={balance >= 0 ? "bg-primary" : "bg-warning"}
      />
    </div>
  );
};
