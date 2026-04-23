import React, { useMemo, useState } from 'react';
import { Category } from '@/types';
import { useI18n } from '@/i18n';
import { useCategoryTranslations, useFormatters } from '@/hooks';

interface BudgetChartProps {
  data: Category[];
}

interface ChartDatum {
  icon: string;
  label: string;
  value: number;
  percent: number;
  color: string;
}

const CHART_COLORS = [
  '#1e40af',
  '#059669',
  '#dc2626',
  '#d97706',
  '#7c3aed',
  '#16a34a',
  '#6b7280',
  '#374151',
];

const SVG_SIZE = 280;
const PIE_RADIUS = 92;
const PIE_CIRCUMFERENCE = 2 * Math.PI * PIE_RADIUS;

const getCategoryIcon = (categoryName: string): string => {
  const lowerName = categoryName.toLowerCase();

  if (lowerName.includes('renda') || lowerName.includes('income')) {
    return '💰';
  }
  if (lowerName.includes('habitação') || lowerName.includes('housing') || lowerName.includes('aluguel') || lowerName.includes('rent')) {
    return '🏠';
  }
  if (lowerName.includes('transporte') || lowerName.includes('transportation') || lowerName.includes('carro') || lowerName.includes('car')) {
    return '🚗';
  }
  if (lowerName.includes('alimentação') || lowerName.includes('food') || lowerName.includes('comida') || lowerName.includes('supermercado')) {
    return '🍽️';
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

  return '📊';
};

const EmptyState: React.FC<{ title: string; message: string }> = ({ title, message }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg shadow-gray-200/50">
    <h3 className="text-xl font-bold text-gray-700 mb-4">{title}</h3>
    <div className="flex items-center justify-center h-64 text-gray-500">{message}</div>
  </div>
);

export const BudgetChart: React.FC<BudgetChartProps> = ({ data }) => {
  const { t } = useI18n();
  const { translateCategoryName } = useCategoryTranslations();
  const { formatCurrency, formatPercentage } = useFormatters();
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

  const chartData = useMemo<ChartDatum[]>(() => {
    const rawData = data
      .map((category, index) => {
        const value = category.items.reduce((sum, item) => sum + item.actual, 0);

        return {
          icon: category.icon || getCategoryIcon(category.name),
          label: translateCategoryName(category.name),
          value,
          color: CHART_COLORS[index % CHART_COLORS.length],
        };
      })
      .filter(item => item.value > 0);

    const total = rawData.reduce((sum, item) => sum + item.value, 0);

    return rawData.map(item => ({
      ...item,
      percent: total > 0 ? item.value / total : 0,
    }));
  }, [data, translateCategoryName]);

  if (chartData.length === 0) {
    return (
      <EmptyState
        title={t('budget.expenseDistribution', 'Expense Distribution')}
        message={t('budget.noExpenseData', 'No expense data to display.')}
      />
    );
  }

  const maxValue = Math.max(...chartData.map(item => item.value), 0);
  let accumulatedPercent = 0;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg shadow-gray-200/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-700">{t('budget.expenseDistribution', 'Expense Distribution')}</h3>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              chartType === 'bar'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📊 {t('chart.bar', 'Bar')}
          </button>
          <button
            onClick={() => setChartType('pie')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              chartType === 'pie'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🍕 {t('chart.pie', 'Pie')}
          </button>
        </div>
      </div>

      {chartType === 'bar' ? (
        <div className="space-y-4">
          {chartData.map(item => (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-lg leading-none">{item.icon}</span>
                  <span className="font-medium text-gray-700 truncate">{item.label}</span>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-semibold text-gray-800">{formatCurrency(item.value)}</div>
                  <div className="text-xs text-gray-500">{formatPercentage(item.percent * 100)}</div>
                </div>
              </div>
              <div className="h-12 rounded-xl bg-gray-100 overflow-hidden relative">
                <div
                  className="h-full rounded-xl transition-[width] duration-500"
                  style={{
                    width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
                    background: `linear-gradient(90deg, ${item.color}, ${item.color}CC)`,
                  }}
                  title={`${item.label}: ${formatCurrency(item.value)} (${formatPercentage(item.percent * 100)})`}
                />
                <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
                  <span className="text-white font-semibold drop-shadow">{item.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6">
          <svg
            viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
            className="w-full max-w-[280px] h-auto"
            role="img"
            aria-label={t('budget.expenseDistribution', 'Expense Distribution')}
          >
            <circle
              cx={SVG_SIZE / 2}
              cy={SVG_SIZE / 2}
              r={PIE_RADIUS}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="44"
            />
            {chartData.map(item => {
              const strokeDasharray = `${item.percent * PIE_CIRCUMFERENCE} ${PIE_CIRCUMFERENCE}`;
              const strokeDashoffset = -accumulatedPercent * PIE_CIRCUMFERENCE;
              accumulatedPercent += item.percent;

              return (
                <circle
                  key={item.label}
                  cx={SVG_SIZE / 2}
                  cy={SVG_SIZE / 2}
                  r={PIE_RADIUS}
                  fill="none"
                  stroke={item.color}
                  strokeWidth="44"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  transform={`rotate(-90 ${SVG_SIZE / 2} ${SVG_SIZE / 2})`}
                  strokeLinecap="butt"
                >
                  <title>{`${item.label}: ${formatCurrency(item.value)} (${formatPercentage(item.percent * 100)})`}</title>
                </circle>
              );
            })}
            <circle
              cx={SVG_SIZE / 2}
              cy={SVG_SIZE / 2}
              r="58"
              fill="white"
            />
            <text
              x="50%"
              y="46%"
              textAnchor="middle"
              className="fill-gray-500 text-[12px] font-medium"
            >
              {t('total', 'Total')}
            </text>
            <text
              x="50%"
              y="56%"
              textAnchor="middle"
              className="fill-gray-800 text-[15px] font-bold"
            >
              {formatCurrency(chartData.reduce((sum, item) => sum + item.value, 0))}
            </text>
          </svg>

          <div className="grid w-full gap-3">
            {chartData.map(item => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-3 py-2"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="inline-block h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-lg leading-none shrink-0">{item.icon}</span>
                  <span className="truncate text-sm font-medium text-gray-700">{item.label}</span>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-semibold text-gray-800">{formatCurrency(item.value)}</div>
                  <div className="text-xs text-gray-500">{formatPercentage(item.percent * 100)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
