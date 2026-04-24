import type { AISuggestionsResponse, BudgetSummary } from '../../src/types/index';
import type { SupportedLanguage } from '../../src/i18n/index';

export type Provider = {
  getAiSuggestions: (budgetSummary: BudgetSummary, language: SupportedLanguage) => Promise<AISuggestionsResponse>;
  healthCheck?: () => Promise<boolean>;
};

type ProviderLoader = () => Promise<Provider>;
type ProviderName = 'gemini' | 'llmstudio';

const DEFAULT_PROVIDER: ProviderName = 'gemini';

const providerLoaders: Record<ProviderName, ProviderLoader> = {
  gemini: async () => (await import('./gemini')).default,
  llmstudio: async () => (await import('./llmstudio')).default,
};

const resolveProviderName = (name?: string): ProviderName => {
  const requestedName = (name ?? process.env.AI_PROVIDER ?? DEFAULT_PROVIDER).toLowerCase();
  if (requestedName in providerLoaders) {
    return requestedName as ProviderName;
  }

  return DEFAULT_PROVIDER;
};

export const loadProvider = async (name?: string): Promise<Provider> => {
  const providerName = resolveProviderName(name);
  return providerLoaders[providerName]();
};
