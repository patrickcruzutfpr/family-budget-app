import { describe, expect, it } from 'vitest';
import { loadProvider } from '../../server/providers';

describe('provider loader', () => {
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
});
