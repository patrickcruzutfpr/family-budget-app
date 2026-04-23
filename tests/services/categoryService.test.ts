import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Category, CategoryType } from '@/types';

const { mockGetCurrentProfile, mockUpdateCurrentProfileBudget } = vi.hoisted(() => ({
  mockGetCurrentProfile: vi.fn(),
  mockUpdateCurrentProfileBudget: vi.fn(),
}));

vi.mock('@/services/profileService', () => ({
  getCurrentProfile: mockGetCurrentProfile,
  updateCurrentProfileBudget: mockUpdateCurrentProfileBudget,
}));

import { CategoryService } from '@/services/categoryService';

const category = (
  id: string,
  name: string,
  type: CategoryType,
  items: Category['items'] = []
): Category => ({
  id,
  name,
  type,
  items,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
});

describe('CategoryService.deleteCategory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('removes empty categories without mutating others', () => {
    const budget = [
      category('housing', 'Housing', CategoryType.EXPENSE),
      category('food', 'Food', CategoryType.EXPENSE),
    ];

    mockGetCurrentProfile.mockReturnValue({ budget });

    CategoryService.deleteCategory('housing');

    expect(mockUpdateCurrentProfileBudget).toHaveBeenCalledTimes(1);
    const savedBudget = mockUpdateCurrentProfileBudget.mock.calls[0][0] as Category[];
    expect(savedBudget).toHaveLength(1);
    expect(savedBudget[0].id).toBe('food');
  });

  it('transfers items to existing Other category before deletion', () => {
    const sourceItems = [
      { id: 'i1', name: 'Rent', projected: 1000, actual: 1000 },
      { id: 'i2', name: 'Condo', projected: 300, actual: 320 },
    ];

    const budget = [
      category('housing', 'Housing', CategoryType.EXPENSE, sourceItems),
      category('other', 'Other', CategoryType.EXPENSE, [
        { id: 'i0', name: 'Misc', projected: 100, actual: 90 },
      ]),
    ];

    mockGetCurrentProfile.mockReturnValue({ budget });

    CategoryService.deleteCategory('housing');

    const savedBudget = mockUpdateCurrentProfileBudget.mock.calls[0][0] as Category[];
    expect(savedBudget.find(c => c.id === 'housing')).toBeUndefined();

    const other = savedBudget.find(c => c.id === 'other');
    expect(other).toBeDefined();
    expect(other?.items).toHaveLength(3);
    expect(other?.items.map(item => item.id)).toEqual(['i0', 'i1', 'i2']);
  });

  it('creates Other category when missing and transfers items', () => {
    const budget = [
      category('food', 'Food', CategoryType.EXPENSE, [
        { id: 'f1', name: 'Groceries', projected: 500, actual: 550 },
      ]),
    ];

    mockGetCurrentProfile.mockReturnValue({ budget });

    CategoryService.deleteCategory('food');

    const savedBudget = mockUpdateCurrentProfileBudget.mock.calls[0][0] as Category[];
    expect(savedBudget.find(c => c.id === 'food')).toBeUndefined();

    const other = savedBudget.find(c => c.name === 'Other' || c.name === 'Outros');
    expect(other).toBeDefined();
    expect(other?.type).toBe(CategoryType.EXPENSE);
    expect(other?.items).toHaveLength(1);
    expect(other?.items[0].id).toBe('f1');
  });

  it('keeps transfer type-safe for income categories', () => {
    const budget = [
      category('salary', 'Salary', CategoryType.INCOME, [
        { id: 's1', name: 'Salary', projected: 3000, actual: 3000 },
      ]),
      category('other-expense', 'Other', CategoryType.EXPENSE, []),
    ];

    mockGetCurrentProfile.mockReturnValue({ budget });

    CategoryService.deleteCategory('salary');

    const savedBudget = mockUpdateCurrentProfileBudget.mock.calls[0][0] as Category[];
    const incomeOther = savedBudget.find(
      c => c.type === CategoryType.INCOME && (c.name === 'Other Income' || c.name === 'Outras Rendas')
    );

    expect(incomeOther).toBeDefined();
    expect(incomeOther?.items).toHaveLength(1);
    expect(incomeOther?.items[0].id).toBe('s1');
  });

  it('is a no-op for unknown category id', () => {
    const budget = [category('food', 'Food', CategoryType.EXPENSE, [])];
    mockGetCurrentProfile.mockReturnValue({ budget });

    CategoryService.deleteCategory('missing');

    expect(mockUpdateCurrentProfileBudget).not.toHaveBeenCalled();
  });
});
