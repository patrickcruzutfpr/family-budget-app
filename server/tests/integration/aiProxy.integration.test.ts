import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';

// Mock the aiProxyService.getAiSuggestions to avoid calling the real Gemini API
vi.mock('../../aiProxyService', async () => {
  const actual = await vi.importActual('../../aiProxyService');
  return {
    ...(actual as any),
    getAiSuggestions: async () => ({
      suggestions: [
        { title: 'Mock Suggestion', suggestion: 'This is a mocked suggestion.' },
      ],
    }),
  };
});

import { createServer } from '../../app';

let server: any;
let port: number;

beforeAll(() => {
  const app = createServer();
  server = app.listen(0);
  // @ts-ignore
  port = server.address().port;
});

afterAll(() => {
  server && server.close();
});

describe('AI proxy integration', () => {
  test('returns suggestions for valid payload', async () => {
    const res = await fetch(`http://localhost:${port}/api/ai/suggestions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: 'en',
        budgetSummary: {
          totalIncome: 3000,
          expenses: [
            { category: 'Rent', projected: 1200, actual: 1200 },
            { category: 'Groceries', projected: 400, actual: 600 },
          ],
        },
      }),
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json.suggestions)).toBe(true);
    expect(json.suggestions[0].title).toBe('Mock Suggestion');
  });

  test('returns 400 for invalid payload', async () => {
    const res = await fetch(`http://localhost:${port}/api/ai/suggestions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bad: 'payload' }),
    });

    expect(res.status).toBe(400);
  });
});
