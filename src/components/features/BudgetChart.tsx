import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Category } from '@/types';

interface BudgetChartProps {
  data: Category[];
}

const COLORS = ['#3b82f6', '#16a34a', '#f97316', '#ef4444', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

export const BudgetChart: React.FC<BudgetChartProps> = ({ data }) => {
  const chartData = data
    .map(category => ({
      name: category.name,
      value: category.items.reduce((sum, item) => sum + item.actual, 0),
    }))
    .filter(d => d.value > 0);

  if (chartData.length === 0) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg shadow-gray-200/50">
            <h3 className="text-xl font-bold text-gray-700 mb-4">Expense Distribution</h3>
            <div className="flex items-center justify-center h-64 text-gray-500">
                No expense data to display.
            </div>
        </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg shadow-gray-200/50">
      <h3 className="text-xl font-bold text-gray-700 mb-4">Expense Distribution</h3>
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
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
