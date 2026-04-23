import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockGenerateContent = vi.fn();

vi.mock('@google/genai', () => ({
  Type: {
    OBJECT: 'OBJECT',
    ARRAY: 'ARRAY',
    STRING: 'STRING',
  },
  GoogleGenAI: vi.fn().mockImplementation(() => ({
    models: {
      generateContent: mockGenerateContent,
    },
  })),
}));

import {
  AppApiError,
  getAiSuggestions,
  isBudgetSummary,
  normalizeSuggestions,
} from '../../server/aiProxyService';

describe('aiProxyService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.GEMINI_API_KEY;
  });

  it('validates sanitized budget summaries', () => {
    expect(
      isBudgetSummary({
        totalIncome: 4200,
        expenses: [{ category: 'Food', projected: 800, actual: 900 }],
      }),
    ).toBe(true);

    expect(isBudgetSummary({ totalIncome: 4200, expenses: [{ category: 'Food', actual: 900 }] })).toBe(false);
  });

  it('normalizes valid Gemini suggestion payloads', () => {
    expect(
      normalizeSuggestions({
        suggestions: [{ title: 'Reduce food costs', suggestion: 'Plan weekly meals.' }],
      }),
    ).toEqual({
      suggestions: [{ title: 'Reduce food costs', suggestion: 'Plan weekly meals.' }],
    });
  });

  it('rejects malformed Gemini payloads', () => {
    expect(() => normalizeSuggestions({ suggestions: [] })).toThrow(AppApiError);
  });

  it('fails with AI_MISCONFIGURED when GEMINI_API_KEY is missing', async () => {
    await expect(
      getAiSuggestions(
        { totalIncome: 4200, expenses: [{ category: 'Food', projected: 800, actual: 900 }] },
        'en',
      ),
    ).rejects.toMatchObject({
      code: 'AI_MISCONFIGURED',
      status: 500,
    });
  });

  it('maps suspended provider failures to AI_UNAVAILABLE', async () => {
    process.env.GEMINI_API_KEY = 'test-key';
    mockGenerateContent.mockRejectedValue(new Error('API key suspended'));

    await expect(
      getAiSuggestions(
        { totalIncome: 4200, expenses: [{ category: 'Food', projected: 800, actual: 900 }] },
        'pt-BR',
      ),
    ).rejects.toMatchObject({
      code: 'AI_UNAVAILABLE',
      status: 503,
    });
  });

  it('returns normalized suggestions for a valid provider response', async () => {
    process.env.GEMINI_API_KEY = 'test-key';
    mockGenerateContent.mockResolvedValue({
      text: JSON.stringify({
        suggestions: [{ title: 'Watch groceries', suggestion: 'Compare stores before buying.' }],
      }),
    });

    await expect(
      getAiSuggestions(
        { totalIncome: 4200, expenses: [{ category: 'Food', projected: 800, actual: 900 }] },
        'en',
      ),
    ).resolves.toEqual({
      suggestions: [{ title: 'Watch groceries', suggestion: 'Compare stores before buying.' }],
    });
  });
});
