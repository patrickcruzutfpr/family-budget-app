import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CategoryType } from '@/types';

const { mockSyncCategoryChanges, mockCategoryService } = vi.hoisted(() => ({
  mockSyncCategoryChanges: vi.fn(),
  mockCategoryService: {
    getCategories: vi.fn(),
    createCategory: vi.fn(),
    updateCategory: vi.fn(),
    deleteCategory: vi.fn(),
    getCategoryById: vi.fn(),
    getCategoriesByType: vi.fn(),
    categoryNameExists: vi.fn(),
  },
}));

vi.mock('@/services/categoryService', () => ({
  CategoryService: mockCategoryService,
}));

vi.mock('@/utils/categoryMigration', () => ({
  syncCategoryChanges: mockSyncCategoryChanges,
}));

import { useCategories } from '@/hooks/useCategories';

const initialCategories = [
  {
    id: 'housing',
    name: 'Housing',
    type: CategoryType.EXPENSE,
    items: [{ id: 'h1', name: 'Rent', projected: 1000, actual: 1000 }],
  },
  {
    id: 'other',
    name: 'Other',
    type: CategoryType.EXPENSE,
    items: [{ id: 'o1', name: 'Misc', projected: 100, actual: 100 }],
  },
];

const postDeleteCategories = [
  {
    id: 'other',
    name: 'Other',
    type: CategoryType.EXPENSE,
    items: [
      { id: 'o1', name: 'Misc', projected: 100, actual: 100 },
      { id: 'h1', name: 'Rent', projected: 1000, actual: 1000 },
    ],
  },
];

describe('useCategories integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCategoryService.getCategories.mockReturnValue(initialCategories);
    mockCategoryService.categoryNameExists.mockReturnValue(false);
  });

  it('refreshes state from service snapshot after delete', async () => {
    mockCategoryService.getCategories
      .mockReturnValueOnce(initialCategories)
      .mockReturnValueOnce(postDeleteCategories);

    const { result } = renderHook(() => useCategories());

    await act(async () => {
      await result.current.deleteCategory('housing');
    });

    expect(mockCategoryService.deleteCategory).toHaveBeenCalledWith('housing');
    expect(result.current.categories).toEqual(postDeleteCategories);
  });

  it('triggers sync and onBudgetChange callback on successful delete', async () => {
    const onBudgetChange = vi.fn();
    mockCategoryService.getCategories
      .mockReturnValueOnce(initialCategories)
      .mockReturnValueOnce(postDeleteCategories);

    const { result } = renderHook(() => useCategories({ onBudgetChange }));

    await act(async () => {
      await result.current.deleteCategory('housing');
    });

    expect(mockSyncCategoryChanges).toHaveBeenCalledTimes(1);
    expect(onBudgetChange).toHaveBeenCalledTimes(1);
  });

  it('exposes error state when service delete fails', async () => {
    mockCategoryService.deleteCategory.mockImplementation(() => {
      throw new Error('Delete failed');
    });

    const { result } = renderHook(() => useCategories());

    await act(async () => {
      await expect(result.current.deleteCategory('housing')).rejects.toThrow('Delete failed');
    });

    expect(result.current.error).toBe('Delete failed');
    expect(mockSyncCategoryChanges).not.toHaveBeenCalled();
  });
});
