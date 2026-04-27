import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BudgetTable } from '@/components/features/BudgetTable';
import { CategoryType } from '@/types';

vi.mock('@/i18n', () => ({
  useI18n: () => ({
    t: (_key: string, fallback?: string) => fallback ?? _key,
  }),
}));

vi.mock('@/hooks', () => ({
  useCategoryTranslations: () => ({
    translateCategoryName: (value: string) => value,
    translateItemName: (value: string) => value,
  }),
  useFormatters: () => ({
    formatCurrency: (value: number) => `$${value.toFixed(2)}`,
  }),
}));

const categories = [
  {
    id: 'housing',
    name: 'Housing',
    type: CategoryType.EXPENSE,
    items: [
      { id: 'rent', name: 'Rent', projected: 1500, actual: 1450 },
    ],
  },
];

const noop = () => {};

describe('BudgetTable column visibility', () => {
  it('renders all budget columns when visibility is fully enabled', () => {
    render(
      <BudgetTable
        visibility={{ name: true, projected: true, actual: true, difference: true }}
        categories={categories}
        updateItemValue={noop}
        updateItemName={noop}
        addItem={noop}
        deleteItem={noop}
      />
    );

    expect(screen.getByText('Item')).toBeInTheDocument();
    expect(screen.getByText('Projetado')).toBeInTheDocument();
    expect(screen.getByText('Real')).toBeInTheDocument();
    expect(screen.getByText('Diferença')).toBeInTheDocument();
  });

  it('hides selected columns while keeping item and actions', () => {
    render(
      <BudgetTable
        visibility={{ name: false, projected: false, actual: false, difference: false }}
        categories={categories}
        updateItemValue={noop}
        updateItemName={noop}
        addItem={noop}
        deleteItem={noop}
      />
    );

    expect(screen.getByText('Item')).toBeInTheDocument();
    expect(screen.queryByText('Projetado')).not.toBeInTheDocument();
    expect(screen.queryByText('Real')).not.toBeInTheDocument();
    expect(screen.queryByText('Diferença')).not.toBeInTheDocument();
    expect(screen.getByTitle('Add')).toBeInTheDocument();
  });
});
