import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts';
import { Category, CategoryType } from '@/types';
import { useI18n } from '@/i18n';
import { useCategoryTranslations, useFormatters } from '@/hooks';

interface BudgetChartProps {
  data: Category[];
}

// Professional color palette with better contrast and accessibility
const COLORS = {
  primary: '#1e40af',     // Blue 700
  secondary: '#059669',   // Emerald 600
  accent: '#dc2626',      // Red 600
  warning: '#d97706',     // Amber 600
  info: '#7c3aed',        // Violet 600
  success: '#16a34a',     // Green 600
  neutral: '#6b7280',     // Gray 500
  dark: '#374151'         // Gray 700
};

const COLOR_ARRAY = [
  COLORS.primary,
  COLORS.secondary, 
  COLORS.accent,
  COLORS.warning,
  COLORS.info,
  COLORS.success,
  COLORS.neutral,
  COLORS.dark
];

// Icon mapping for category types
const getCategoryIcon = (categoryName: string, categoryType?: CategoryType): string => {
  const lowerName = categoryName.toLowerCase();
  
  // Income categories
  if (lowerName.includes('renda') || lowerName.includes('income')) {
    return '💰';
  }
  
  // Expense categories
  if (lowerName.includes('habitação') || lowerName.includes('housing') || lowerName.includes('aluguel') || lowerName.includes('rent')) {
    return '🏠';
  }
  if (lowerName.includes('transporte') || lowerName.includes('transportation') || lowerName.includes('carro') || lowerName.includes('car')) {
    return '🚗';
  }
  if (lowerName.includes('alimentação') || lowerName.includes('food') || lowerName.includes('comida') || lowerName.includes('supermercado')) {
    return '🍕';
  }
  if (lowerName.includes('pessoal') || lowerName.includes('família') || lowerName.includes('personal') || lowerName.includes('family')) {
    return '👨‍👩‍👧‍👦';
  }
  if (lowerName.includes('poupança') || lowerName.includes('investimento') || lowerName.includes('savings') || lowerName.includes('investment')) {
    return '🎯';
  }
  if (lowerName.includes('saúde') || lowerName.includes('health') || lowerName.includes('médico') || lowerName.includes('hospital')) {
    return '🏥';
  }
  if (lowerName.includes('educação') || lowerName.includes('education') || lowerName.includes('escola') || lowerName.includes('school')) {
    return '📚';
  }
  if (lowerName.includes('entretenimento') || lowerName.includes('entertainment') || lowerName.includes('lazer') || lowerName.includes('diversão')) {
    return '🎮';
  }
  
  // Default icon
  return '📊';
};

export const BudgetChart: React.FC<BudgetChartProps> = ({ data }) => {
  const { t } = useI18n();
  const { translateCategoryName } = useCategoryTranslations();
  const { formatCurrency, formatPercentage } = useFormatters();
  
  const chartData = data
    .map(category => {
      const translatedName = translateCategoryName(category.name);
      const categoryIcon = category.icon || getCategoryIcon(category.name, category.type);
      
      return {
        name: categoryIcon, // Only show icon on X-axis
        value: category.items.reduce((sum, item) => sum + item.actual, 0),
        originalName: translatedName,
        icon: categoryIcon // Store icon separately
      };
    })
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

  const totalExpenses = chartData.reduce((sum, item) => sum + item.value, 0);

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = totalExpenses > 0 ? ((data.value / totalExpenses) * 100) : 0;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-1">{data.payload.originalName}</p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">{t('total', 'Total')}:</span> {formatCurrency(data.value)}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">{t('percentage', 'Percentage')}:</span> {formatPercentage(percentage)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg shadow-gray-200/50">
      <h3 className="text-xl font-bold text-gray-700 mb-4">{t('budget.expenseDistribution', 'Expense Distribution')}</h3>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.6} />
            <XAxis 
              type="category" 
              dataKey="name"
              stroke="#6b7280"
              fontSize={20}
              textAnchor="middle"
              height={40}
              interval={0}
            />
            <YAxis 
              type="number"
              tickFormatter={(value) => formatCurrency(Number(value))}
              stroke="#6b7280"
              fontSize={12}
            />
            <Tooltip content={customTooltip} />
            <Bar 
              dataKey="value" 
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLOR_ARRAY[index % COLOR_ARRAY.length]} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
