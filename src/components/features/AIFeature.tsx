import React, { useState, useCallback } from 'react';
import { getBudgetSuggestions } from '@/services/geminiService';
import { AISuggestion, BudgetState } from '@/types';
import { SparklesIcon } from '@/assets/icons/SparklesIcon';
import { LightbulbIcon } from '@/assets/icons/LightbulbIcon';

interface AIFeatureProps {
  budget: BudgetState;
}

export const AIFeature: React.FC<AIFeatureProps> = ({ budget }) => {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetSuggestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getBudgetSuggestions(budget);
      setSuggestions(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [budget]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg shadow-gray-200/50">
      <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
        <SparklesIcon className="w-6 h-6 text-primary" />
        AI-Powered Suggestions
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Get personalized tips from our AI to help you save money and reach your financial goals.
      </p>
      <button
        onClick={handleGetSuggestions}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing Your Budget...
          </>
        ) : (
          'Get Smart Suggestions'
        )}
      </button>

      {error && <div className="mt-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

      <div className="mt-6 space-y-4">
        {suggestions.map((s, index) => (
          <div key={index} className="p-4 bg-blue-50/50 border-l-4 border-accent rounded-r-lg">
            <h4 className="font-bold text-primary flex items-center gap-2">
              <LightbulbIcon className="w-5 h-5"/>
              {s.title}
            </h4>
            <p className="mt-1 text-sm text-gray-600">{s.suggestion}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
