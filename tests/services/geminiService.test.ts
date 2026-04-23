import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildBudgetSummary, getBudgetSuggestions } from '@/services/geminiService';
import * as mockService from '@/services/geminiServiceMock';
import { BudgetState, CategoryType } from '@/types';

const budgetFixture: BudgetState = [
  {
    id: 'income',
    name: 'Income',
    type: CategoryType.INCOME,
    items: [
      { id: 'salary', name: 'Salary', projected: 5000, actual: 5000 },
      { id: 'bonus', name: 'Bonus', projected: 0, actual: 500 },
    ],
  },
  {
    id: 'groceries',
    name: 'Groceries',
    type: CategoryType.EXPENSE,
    items: [
      { id: 'g1', name: 'Market', projected: 800, actual: 950 },
      { id: 'g2', name: 'Bakery', projected: 100, actual: 90 },
    ],
  },
  {
    id: 'transport',
    name: 'Transport',
    type: CategoryType.EXPENSE,
    items: [{ id: 't1', name: 'Fuel', projected: 200, actual: 240 }],
  },
];

describe('geminiService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal('fetch', vi.fn());
  });

  it('builds a sanitized budget summary', () => {
    expect(buildBudgetSummary(budgetFixture)).toEqual({
      totalIncome: 5500,
      expenses: [
        { category: 'Groceries', projected: 900, actual: 1040 },
        { category: 'Transport', projected: 200, actual: 240 },
      ],
    });
  });

  it('posts the sanitized summary to the AI proxy', async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        suggestions: [{ title: 'Trim groceries', suggestion: 'Set a weekly ceiling.' }],
      }),
    } as Response);

    const result = await getBudgetSuggestions(budgetFixture, 'en');

    expect(fetchMock).toHaveBeenCalledWith('/api/ai/suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: 'en',
        budgetSummary: {
          totalIncome: 5500,
          expenses: [
            { category: 'Groceries', projected: 900, actual: 1040 },
            { category: 'Transport', projected: 200, actual: 240 },
          ],
        },
      }),
    });
    expect(result).toEqual([{ title: 'Trim groceries', suggestion: 'Set a weekly ceiling.' }]);
  });

  it('falls back to mock suggestions when the proxy reports AI_UNAVAILABLE', async () => {
    const fetchMock = vi.mocked(fetch);
    const mockSuggestions = [{ title: 'Fallback', suggestion: 'Use mock suggestions.' }];

    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({
        error: {
          code: 'AI_UNAVAILABLE',
          message: 'AI suggestions are temporarily unavailable.',
        },
      }),
    } as Response);

    vi.spyOn(mockService, 'getBudgetSuggestionsMock').mockResolvedValue(mockSuggestions);

    const result = await getBudgetSuggestions(budgetFixture, 'pt-BR');

    expect(mockService.getBudgetSuggestionsMock).toHaveBeenCalledWith(budgetFixture, 'pt-BR');
    expect(result).toEqual(mockSuggestions);
  });

  it('throws a generic error for non-fallback proxy failures', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({
        error: {
          code: 'AI_BAD_RESPONSE',
          message: 'Failed to process the AI provider response.',
        },
      }),
    } as Response);

    await expect(getBudgetSuggestions(budgetFixture)).rejects.toThrow(
      'Failed to get AI-powered suggestions. Please try again later.',
    );
  });
});
