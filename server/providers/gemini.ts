import { GoogleGenAI, Type } from '@google/genai';
import { buildBudgetPrompt, normalizeSuggestions, mapProviderError, AppApiError } from '../lib/aiHelpers';
import type { SupportedLanguage } from '../src/i18n/index';
import type { AISuggestionsResponse, BudgetSummary } from '../src/types/index';

const MODEL_NAME = 'gemini-2.5-flash';

export const getAiSuggestions = async (
  budgetSummary: BudgetSummary,
  language: SupportedLanguage,
): Promise<AISuggestionsResponse> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new AppApiError('AI_MISCONFIGURED', 'AI service is not configured.', 500);
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = buildBudgetPrompt(budgetSummary, language);

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  suggestion: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });

    const jsonText = response.text?.trim();
    if (!jsonText) {
      throw new AppApiError('AI_BAD_RESPONSE', 'AI provider returned an empty response.', 502);
    }

    return normalizeSuggestions(JSON.parse(jsonText));
  } catch (error) {
    if (error instanceof AppApiError) throw error;
    throw mapProviderError(error);
  }
};

export default { getAiSuggestions };
