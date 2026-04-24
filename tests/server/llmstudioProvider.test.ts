import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loadProvider } from '../../server/providers';
import { getAiSuggestions, healthCheck } from '../../server/providers/llmstudio';

describe('llmstudio provider', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    delete process.env.LLMSTUDIO_API_KEY;
    delete process.env.LLMSTUDIO_BASE_URL;
    delete process.env.LLMSTUDIO_MODEL;
  });

  it('loads llmstudio provider from provider loader', async () => {
    const provider = await loadProvider('llmstudio');
    expect(provider).toHaveProperty('getAiSuggestions');
  });

  it('fails with AI_MISCONFIGURED when API key is missing', async () => {
    await expect(
      getAiSuggestions(
        {
          totalIncome: 5000,
          expenses: [{ category: 'Food', projected: 600, actual: 650 }],
        },
        'en',
      ),
    ).rejects.toMatchObject({
      code: 'AI_MISCONFIGURED',
      status: 500,
    });
  });

  it('returns normalized suggestions from OpenAI-compatible payload', async () => {
    process.env.LLMSTUDIO_API_KEY = 'local-key';
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () =>
        JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  suggestions: [{ title: 'Trim dining out', suggestion: 'Set a weekly dining cap.' }],
                }),
              },
            },
          ],
        }),
    });

    vi.stubGlobal('fetch', fetchMock);

    await expect(
      getAiSuggestions(
        {
          totalIncome: 5000,
          expenses: [{ category: 'Food', projected: 600, actual: 650 }],
        },
        'en',
      ),
    ).resolves.toEqual({
      suggestions: [{ title: 'Trim dining out', suggestion: 'Set a weekly dining cap.' }],
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://127.0.0.1:1234/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
      }),
    );
  });

  it('returns true on successful health check response', async () => {
    process.env.LLMSTUDIO_API_KEY = 'local-key';
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);

    await expect(healthCheck()).resolves.toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://127.0.0.1:1234/v1/models',
      expect.objectContaining({ method: 'GET' }),
    );
  });
});
