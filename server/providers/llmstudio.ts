import { buildBudgetPrompt, normalizeSuggestions, mapProviderError, AppApiError, getErrorMessage } from '../lib/aiHelpers';
import type { SupportedLanguage } from '../../src/i18n/index';
import type { AISuggestionsResponse, BudgetSummary } from '../../src/types/index';

const DEFAULT_BASE_URL = 'http://127.0.0.1:1234/v1';
const DEFAULT_MODEL_NAME = 'qwen2.5-coder-32b';
const SUGGESTIONS_JSON_SCHEMA = {
  name: 'budget_suggestions',
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      suggestions: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            title: { type: 'string' },
            suggestion: { type: 'string' },
          },
          required: ['title', 'suggestion'],
        },
      },
    },
    required: ['suggestions'],
  },
};

const getModelName = (): string => process.env.LLMSTUDIO_MODEL ?? DEFAULT_MODEL_NAME;

const buildEndpoint = (path: string): string => {
  const baseUrl = (process.env.LLMSTUDIO_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
  return `${baseUrl}${path}`;
};

const getHeaders = (): Record<string, string> => {
  const apiKey = process.env.LLMSTUDIO_API_KEY;
  if (!apiKey) {
    throw new AppApiError('AI_MISCONFIGURED', 'AI service is not configured.', 500);
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };
};

const extractResponseText = async (response: Response): Promise<string> => {
  const text = await response.text();
  if (!text.trim()) {
    throw new AppApiError('AI_BAD_RESPONSE', 'AI provider returned an empty response.', 502);
  }

  return text;
};

const parseSuggestionPayload = (rawBody: unknown): AISuggestionsResponse => {
  if (!rawBody || typeof rawBody !== 'object') {
    throw new AppApiError('AI_BAD_RESPONSE', 'AI provider returned an invalid response.', 502);
  }

  const choiceContent = (rawBody as any)?.choices?.[0]?.message?.content;
  if (typeof choiceContent !== 'string' || !choiceContent.trim()) {
    throw new AppApiError('AI_BAD_RESPONSE', 'AI provider returned no valid suggestions.', 502);
  }

  return normalizeSuggestions(JSON.parse(choiceContent));
};

const buildSuggestionRequestBody = (model: string, prompt: string): string =>
  JSON.stringify({
    model,
    temperature: 0.2,
    response_format: {
      type: 'json_schema',
      json_schema: SUGGESTIONS_JSON_SCHEMA,
    },
    messages: [
      {
        role: 'system',
        content: 'You are a financial assistant. Always return strictly valid JSON.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

export const getAiSuggestions = async (
  budgetSummary: BudgetSummary,
  language: SupportedLanguage,
): Promise<AISuggestionsResponse> => {
  const model = getModelName();
  const prompt = buildBudgetPrompt(budgetSummary, language);

  try {
    const response = await fetch(buildEndpoint('/chat/completions'), {
      method: 'POST',
      headers: getHeaders(),
      body: buildSuggestionRequestBody(model, prompt),
    });

    if (!response.ok) {
      const errorText = await extractResponseText(response);
      if (response.status === 401 || response.status === 403) {
        throw new AppApiError('AI_MISCONFIGURED', 'AI service is not configured.', 500);
      }
      if (response.status === 429 || response.status >= 500) {
        throw new AppApiError('AI_UNAVAILABLE', 'AI suggestions are temporarily unavailable.', 503);
      }

      throw new AppApiError('AI_BAD_RESPONSE', `LLM Studio request failed: ${errorText}`, 502);
    }

    const bodyText = await extractResponseText(response);
    return parseSuggestionPayload(JSON.parse(bodyText));
  } catch (error) {
    if (error instanceof AppApiError) throw error;
    throw mapProviderError(new Error(getErrorMessage(error)));
  }
};

export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await fetch(buildEndpoint('/models'), {
      headers: getHeaders(),
      method: 'GET',
    });

    return response.ok;
  } catch {
    return false;
  }
};

export default { getAiSuggestions, healthCheck };
