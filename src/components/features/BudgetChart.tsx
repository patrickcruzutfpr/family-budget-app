import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Category } from '@/types';
import { useI18n } from '@/i18n';
import { useCategoryTranslations, useFormatters } from '@/hooks';

interface BudgetChartProps {
  data: Category[];
}

const COLORS = ['#3b82f6', '#16a34a', '#f97316', '#ef4444', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

export const BudgetChart: React.FC<BudgetChartProps> = ({ data }) => {
  const { t } = useI18n();
  const { translateCategoryName } = useCategoryTranslations();
  const { formatCurrency, formatPercentage } = useFormatters();
  
  const chartData = data
    .map(category => ({
      name: translateCategoryName(category.name),
      value: category.items.reduce((sum, item) => sum + item.actual, 0),
    }))
    .filter(d => d.value > 0);

  if (chartData.length === 0) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg shadow-gray-200/50">
            <h3 className="text-xl font-bold text-gray-700 mb-4">{t('budget.expenseDistribution', 'Expense Distribution')}</h3>
            <div className="flex items-center justify-center h-64 text-gray-500">
                {t('budget.noExpenseData', 'No expense data to display.')}
            </div>
        </div>
    );
  }

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
          <p className="font-medium text-gray-700">{data.name}</p>
          <p className="text-primary font-semibold">{formatCurrency(data.value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg shadow-gray-200/50">
      <h3 className="text-xl font-bold text-gray-700 mb-4">{t('budget.expenseDistribution', 'Expense Distribution')}</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} ${formatPercentage(percent * 100)}`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={customTooltip} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
