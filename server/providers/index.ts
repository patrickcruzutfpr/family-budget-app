import type { AISuggestionsResponse, BudgetSummary } from '../../src/types/index';
import type { SupportedLanguage } from '../../src/i18n/index';

type ProviderConfigValidation = {
  ok: boolean;
  details?: string;
};

export type Provider = {
  getAiSuggestions: (budgetSummary: BudgetSummary, language: SupportedLanguage) => Promise<AISuggestionsResponse>;
  healthCheck?: () => Promise<boolean>;
  validateConfig?: () => ProviderConfigValidation;
  getModelName?: () => string;
};

type ProviderLoader = () => Promise<Provider>;
export type ProviderName = 'gemini' | 'llmstudio';

export type ProviderHealthStatus = 'ok' | 'unavailable' | 'misconfigured' | 'failed_to_load';

export type ProviderHealthInfo = {
  name: ProviderName;
  status: ProviderHealthStatus;
  model?: string;
  details?: string;
};

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

export const getProviderHealthInfo = async (
  name?: string,
  options?: { deep?: boolean },
): Promise<ProviderHealthInfo> => {
  const providerName = resolveProviderName(name);

  try {
    const provider = await loadProvider(providerName);
    const model = provider.getModelName?.();
    const configValidation = provider.validateConfig?.() ?? { ok: true };

    if (!configValidation.ok) {
      return {
        name: providerName,
        model,
        status: 'misconfigured',
        details: configValidation.details,
      };
    }

    const healthCheck = provider.healthCheck;
    const shouldRunDeepCheck = options?.deep === true && typeof healthCheck === 'function' && process.env.NODE_ENV !== 'test';
    if (shouldRunDeepCheck) {
      try {
        const ok = await healthCheck();
        return {
          name: providerName,
          model,
          status: ok ? 'ok' : 'unavailable',
        };
      } catch (error) {
        return {
          name: providerName,
          model,
          status: 'unavailable',
          details: error instanceof Error ? error.message : String(error),
        };
      }
    }

    return {
      name: providerName,
      model,
      status: 'ok',
    };
  } catch (error) {
    return {
      name: providerName,
      status: 'failed_to_load',
      details: error instanceof Error ? error.message : String(error),
    };
  }
};
