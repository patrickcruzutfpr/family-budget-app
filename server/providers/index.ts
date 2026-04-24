import type { AISuggestionsResponse, BudgetSummary } from '../../src/types/index';
import type { SupportedLanguage } from '../../src/i18n/index';

export type Provider = {
  getAiSuggestions: (budgetSummary: BudgetSummary, language: SupportedLanguage) => Promise<AISuggestionsResponse>;
  healthCheck?: () => Promise<boolean>;
};

export const loadProvider = async (name?: string): Promise<Provider> => {
  const provider = (name ?? process.env.AI_PROVIDER ?? 'gemini').toLowerCase();
  switch (provider) {
    case 'gemini':
      return (await import('./gemini')).default;
    case 'llmstudio':
      return (await import('./llmstudio')).default;
    // future: case 'openai': return (await import('./openai')).default;
    // future: case 'ollama': return (await import('./ollama')).default;
    default:
      return (await import('./gemini')).default;
  }
};
