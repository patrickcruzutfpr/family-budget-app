import React, { useState, useCallback } from 'react';
import { getBudgetSuggestions } from '@/services/geminiService';
import { AISuggestion, BudgetState } from '@/types';
import { SparklesIcon } from '@/assets/icons/SparklesIcon';
import { LightbulbIcon } from '@/assets/icons/LightbulbIcon';
import { BookmarkIcon } from '@/assets/icons/BookmarkIcon';
import { HeartIcon } from '@/assets/icons/HeartIcon';
import { Trash2Icon } from '@/assets/icons/Trash2Icon';
import { useI18n } from '@/i18n';
import { useSavedSuggestions } from '@/hooks/useSavedSuggestions';

interface AIFeatureProps {
  budget: BudgetState;
}

export const AIFeature: React.FC<AIFeatureProps> = ({ budget }) => {
  const { t, language } = useI18n();
  const {
    savedSuggestions,
    saveSuggestion,
    removeSavedSuggestion,
    toggleFavorite,
    setCurrentSuggestions
  } = useSavedSuggestions(language);
  
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSaved, setShowSaved] = useState(false);

  const handleGetSuggestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getBudgetSuggestions(budget, language);
      setSuggestions(result);
      setCurrentSuggestions(result); // Track as unsaved
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [budget, language, setCurrentSuggestions]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg shadow-gray-200/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-700 flex items-center gap-2">
          <SparklesIcon className="w-6 h-6 text-primary" />
          {t('ai.title', 'AI-Powered Suggestions')}
        </h3>
        
        {/* Toggle between current and saved suggestions */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowSaved(false)}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              !showSaved 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t('ai.current', 'Current')}
          </button>
          <button
            onClick={() => setShowSaved(true)}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              showSaved 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t('ai.saved', 'Saved')} ({savedSuggestions.length})
          </button>
        </div>
      </div>
      
      <p className="text-sm text-gray-500 mb-4">
        {t('ai.description', 'Get personalized tips from our AI to help you save money and reach your financial goals.')}
      </p>

      {!showSaved && (
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
              {t('ai.loading', 'Analyzing Your Budget...')}
            </>
          ) : (
            t('ai.getSuggestions', 'Get Smart Suggestions')
          )}
        </button>
      )}

      {error && <div className="mt-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

      <div className="mt-6 space-y-4">
        {!showSaved ? (
          // Current suggestions
          suggestions.map((s, index) => (
            <div key={index} className="p-4 bg-blue-50/50 border-l-4 border-accent rounded-r-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-primary flex items-center gap-2">
                    <LightbulbIcon className="w-5 h-5"/>
                    {s.title}
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">{s.suggestion}</p>
                </div>
                <div className="flex gap-1 ml-3">
                  <button
                    onClick={() => saveSuggestion(s, false)}
                    className="p-1 text-gray-400 hover:text-primary transition-colors"
                    title={t('ai.save', 'Save suggestion')}
                  >
                    <BookmarkIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => saveSuggestion(s, true)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title={t('ai.favorite', 'Add to favorites')}
                  >
                    <HeartIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Saved suggestions
          savedSuggestions.length > 0 ? (
            savedSuggestions.map((s) => (
              <div key={s.id} className={`p-4 border-l-4 rounded-r-lg ${
                s.isFavorite 
                  ? 'bg-red-50/50 border-red-400' 
                  : 'bg-blue-50/50 border-accent'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-primary flex items-center gap-2">
                      <LightbulbIcon className="w-5 h-5"/>
                      {s.title}
                      {s.isFavorite && <HeartIcon className="w-4 h-4 text-red-500" filled />}
                    </h4>
                    <p className="mt-1 text-sm text-gray-600">{s.suggestion}</p>
                    <p className="mt-2 text-xs text-gray-400">
                      {t('ai.savedAt', 'Saved')}: {s.savedAt.toLocaleDateString()} {s.savedAt.toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex gap-1 ml-3">
                    <button
                      onClick={() => toggleFavorite(s.id)}
                      className={`p-1 transition-colors ${
                        s.isFavorite 
                          ? 'text-red-500 hover:text-red-600' 
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                      title={s.isFavorite ? t('ai.unfavorite', 'Remove from favorites') : t('ai.favorite', 'Add to favorites')}
                    >
                      <HeartIcon className="w-4 h-4" filled={s.isFavorite} />
                    </button>
                    <button
                      onClick={() => removeSavedSuggestion(s.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title={t('ai.delete', 'Delete suggestion')}
                    >
                      <Trash2Icon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BookmarkIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>{t('ai.noSaved', 'No saved suggestions yet')}</p>
              <p className="text-sm mt-1">{t('ai.saveTip', 'Get new suggestions and save the ones you like!')}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};
