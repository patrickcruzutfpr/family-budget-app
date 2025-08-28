import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBudget } from '@/hooks/useBudget';
import * as profileService from '@/services/profileService';
import * as budgetService from '@/services/budgetService';
import { CategoryType } from '@/types';

// Mock the services
vi.mock('@/services/profileService');
vi.mock('@/services/budgetService');
vi.mock('@/hooks/useBudgetMessages', () => ({
  useBudgetMessages: () => ({
    promptItemName: vi.fn().mockResolvedValue('New Item'),
    confirmDelete: vi.fn().mockResolvedValue(true),
    confirmReset: vi.fn().mockResolvedValue(true),
  }),
}));
vi.mock('@/i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

describe('useBudget', () => {
  const mockBudget = [
    {
      id: 'income',
      name: 'Income',
      type: CategoryType.INCOME,
      items: [
        { id: 'income-1', name: 'Salary', projected: 5000, actual: 5000 },
      ],
    },
    {
      id: 'housing',
      name: 'Housing',
      type: CategoryType.EXPENSE,
      items: [
        { id: 'housing-1', name: 'Rent', projected: 1500, actual: 1500 },
      ],
    },
  ];

  const mockProfile = {
    id: 'profile-1',
    name: 'Test Profile',
    budget: mockBudget,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(profileService.getCurrentProfile).mockReturnValue(mockProfile);
    vi.mocked(profileService.updateCurrentProfileBudget).mockImplementation(() => {});
    vi.mocked(budgetService.loadBudget).mockReturnValue(mockBudget);
    vi.mocked(budgetService.saveBudget).mockImplementation(() => {});
  });

  it('should load budget from current profile on mount', () => {
    const { result } = renderHook(() => useBudget());
    
    expect(profileService.getCurrentProfile).toHaveBeenCalled();
    expect(result.current.budget).toEqual(mockBudget);
  });

  it('should update item value correctly', () => {
    const { result } = renderHook(() => useBudget());
    
    act(() => {
      result.current.updateItemValue('housing', 'housing-1', 'actual', 1600);
    });

    const updatedItem = result.current.budget
      .find(c => c.id === 'housing')
      ?.items.find(i => i.id === 'housing-1');
    
    expect(updatedItem?.actual).toBe(1600);
    expect(profileService.updateCurrentProfileBudget).toHaveBeenCalled();
  });

  it('should add new item to category', async () => {
    const { result } = renderHook(() => useBudget());
    
    await act(async () => {
      await result.current.addItem('housing');
    });

    const housingCategory = result.current.budget.find(c => c.id === 'housing');
    expect(housingCategory?.items).toHaveLength(2);
    expect(housingCategory?.items[1].name).toBe('New Item');
  });

  it('should delete item from category', async () => {
    const { result } = renderHook(() => useBudget());
    
    await act(async () => {
      await result.current.deleteItem('housing', 'housing-1');
    });

    const housingCategory = result.current.budget.find(c => c.id === 'housing');
    expect(housingCategory?.items).toHaveLength(0);
  });

  it('should handle profile system failure gracefully', () => {
    vi.mocked(profileService.getCurrentProfile).mockImplementation(() => {
      throw new Error('Profile system failed');
    });

    const { result } = renderHook(() => useBudget());
    
    expect(budgetService.loadBudget).toHaveBeenCalled();
    expect(result.current.budget).toEqual(mockBudget);
  });
});