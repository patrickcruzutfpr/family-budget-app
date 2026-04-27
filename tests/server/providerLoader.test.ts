import { beforeEach, describe, expect, it } from 'vitest';
import { getProviderHealthInfo, loadProvider } from '../../server/providers';

describe('provider loader', () => {
  beforeEach(() => {
    delete process.env.GEMINI_API_KEY;
    delete process.env.LLMSTUDIO_API_KEY;
    delete process.env.LLMSTUDIO_MODEL;
  });

  it('loads llmstudio provider by name (case-insensitive)', async () => {
    const provider = await loadProvider('LLMStudio');
    expect(provider).toHaveProperty('getAiSuggestions');
    expect(provider).toHaveProperty('healthCheck');
  });

  it('falls back to gemini provider for unknown names', async () => {
    const provider = await loadProvider('unknown-provider');
    expect(provider).toHaveProperty('getAiSuggestions');
    expect(provider).not.toHaveProperty('healthCheck');
  });

  it('returns misconfigured when required provider config is missing', async () => {
    const info = await getProviderHealthInfo('llmstudio', { deep: true });
    expect(info).toMatchObject({
      name: 'llmstudio',
      status: 'misconfigured',
      details: 'LLMSTUDIO_API_KEY missing',
      model: 'qwen2.5-coder-32b',
    });
  });

  it('returns ok and model metadata when config is present', async () => {
    process.env.GEMINI_API_KEY = 'test-key';

    const info = await getProviderHealthInfo('gemini', { deep: true });
    expect(info).toMatchObject({
      name: 'gemini',
      status: 'ok',
      model: 'gemini-2.5-flash',
    });
  });
});
