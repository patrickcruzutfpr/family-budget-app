import { GoogleGenAI, Type } from "@google/genai";
import { BudgetState, AISuggestion, CategoryType } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development; in a real deployment, the key should be set.
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "" });

export const getBudgetSuggestions = async (budget: BudgetState): Promise<AISuggestion[]> => {
  if (!API_KEY) {
    throw new Error("API key is not configured.");
  }
  
  const model = "gemini-2.5-flash";

  const simplifiedBudget = {
    totalIncome: budget
      .find(c => c.type === CategoryType.INCOME)
      ?.items.reduce((sum, item) => sum + item.actual, 0) || 0,
    expenses: budget
      .filter(c => c.type === CategoryType.EXPENSE)
      .map(category => ({
        category: category.name,
        projected: category.items.reduce((sum, item) => sum + item.projected, 0),
        actual: category.items.reduce((sum, item) => sum + item.actual, 0),
      })),
  };
  
  const prompt = `
    You are an expert financial advisor AI. Analyze the following family budget data, which is provided in JSON format.
    The data shows projected spending vs. actual spending for various categories.

    Budget Data:
    \`\`\`json
    ${JSON.stringify(simplifiedBudget, null, 2)}
    \`\`\`

    Based on this data, provide 3 concise, actionable, and encouraging suggestions for saving money or optimizing the budget.
    Focus on the categories where spending is highest or most over budget.
    Your suggestions should be practical for a family.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: "A short, catchy title for the suggestion.",
                  },
                  suggestion: {
                    type: Type.STRING,
                    description: "The detailed suggestion text.",
                  },
                },
              },
            },
          },
        },
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);

    if (result.suggestions && Array.isArray(result.suggestions)) {
      return result.suggestions;
    }

    return [];
  } catch (error) {
    console.error("Error fetching suggestions from Gemini API:", error);
    throw new Error("Failed to get AI-powered suggestions. Please try again later.");
  }
};
