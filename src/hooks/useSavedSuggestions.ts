import { useState, useEffect, useCallback } from 'react';
import { AISuggestion } from '@/types';
import { SupportedLanguage } from '@/i18n';

interface SavedSuggestion extends AISuggestion {
  id: string;
  savedAt: Date;
  language: SupportedLanguage;
  isFavorite?: boolean;
}

interface SavedSuggestionsState {
  [language: string]: SavedSuggestion[];
}

interface ProfileSuggestionsState {
  [profileId: string]: SavedSuggestionsState;
}

const STORAGE_KEY = 'family-budget-saved-suggestions';

export const useSavedSuggestions = (currentLanguage: SupportedLanguage, profileId?: string) => {
  const [savedSuggestions, setSavedSuggestions] = useState<SavedSuggestion[]>([]);
  const [unsavedSuggestions, setUnsavedSuggestions] = useState<AISuggestion[]>([]);

  // Get storage key for current profile
  const getStorageKey = useCallback(() => {
    return profileId ? `${STORAGE_KEY}-${profileId}` : STORAGE_KEY;
  }, [profileId]);

  // Load saved suggestions for current language and profile
  const loadSuggestions = useCallback(() => {
    try {
      const storageKey = getStorageKey();
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const allSuggestions: SavedSuggestionsState = JSON.parse(stored);
        const languageSuggestions = allSuggestions[currentLanguage] || [];
        
        // Convert date strings back to Date objects
        const suggestions = languageSuggestions.map(s => ({
          ...s,
          savedAt: new Date(s.savedAt)
        }));
        
        setSavedSuggestions(suggestions);
      } else {
        setSavedSuggestions([]);
      }
    } catch (error) {
      console.error('Error loading saved suggestions:', error);
      setSavedSuggestions([]);
    }
  }, [currentLanguage, getStorageKey]);

  // Save suggestion
  const saveSuggestion = useCallback((suggestion: AISuggestion, isFavorite: boolean = false) => {
    try {
      const storageKey = getStorageKey();
      const stored = localStorage.getItem(storageKey);
      const allSuggestions: SavedSuggestionsState = stored ? JSON.parse(stored) : {};
      
      if (!allSuggestions[currentLanguage]) {
        allSuggestions[currentLanguage] = [];
      }

      const savedSuggestion: SavedSuggestion = {
        ...suggestion,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        savedAt: new Date(),
        language: currentLanguage,
        isFavorite
      };

      // Check if suggestion already exists (by title and content)
      const exists = allSuggestions[currentLanguage].some(
        s => s.title === suggestion.title && s.suggestion === suggestion.suggestion
      );

      if (!exists) {
        allSuggestions[currentLanguage].unshift(savedSuggestion);
        
        // Keep only last 50 suggestions per language
        allSuggestions[currentLanguage] = allSuggestions[currentLanguage].slice(0, 50);
        
        localStorage.setItem(storageKey, JSON.stringify(allSuggestions));
        loadSuggestions();
        
        // Remove from unsaved if it was there
        setUnsavedSuggestions(prev => 
          prev.filter(s => !(s.title === suggestion.title && s.suggestion === suggestion.suggestion))
        );
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error saving suggestion:', error);
      return false;
    }
  }, [currentLanguage, loadSuggestions, getStorageKey]);

  // Remove saved suggestion
  const removeSavedSuggestion = useCallback((id: string) => {
    try {
      const storageKey = getStorageKey();
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const allSuggestions: SavedSuggestionsState = JSON.parse(stored);
        
        if (allSuggestions[currentLanguage]) {
          allSuggestions[currentLanguage] = allSuggestions[currentLanguage].filter(s => s.id !== id);
          localStorage.setItem(storageKey, JSON.stringify(allSuggestions));
          loadSuggestions();
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error removing suggestion:', error);
      return false;
    }
  }, [currentLanguage, loadSuggestions, getStorageKey]);

  // Toggle favorite status
  const toggleFavorite = useCallback((id: string) => {
    try {
      const storageKey = getStorageKey();
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const allSuggestions: SavedSuggestionsState = JSON.parse(stored);
        
        if (allSuggestions[currentLanguage]) {
          const suggestion = allSuggestions[currentLanguage].find(s => s.id === id);
          if (suggestion) {
            suggestion.isFavorite = !suggestion.isFavorite;
            localStorage.setItem(storageKey, JSON.stringify(allSuggestions));
            loadSuggestions();
            return true;
          }
        }
      }
      return false;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return false;
    }
  }, [currentLanguage, loadSuggestions, getStorageKey]);

  // Track unsaved suggestions
  const setCurrentSuggestions = useCallback((suggestions: AISuggestion[]) => {
    setUnsavedSuggestions(suggestions);
  }, []);

  // Check if there are unsaved suggestions
  const hasUnsavedSuggestions = unsavedSuggestions.length > 0;

  // Auto-save all current suggestions before language change
  const saveAllCurrent = useCallback(() => {
    let savedCount = 0;
    unsavedSuggestions.forEach(suggestion => {
      if (saveSuggestion(suggestion, false)) {
        savedCount++;
      }
    });
    return savedCount;
  }, [unsavedSuggestions, saveSuggestion]);

  // Clear all saved suggestions for current language
  const clearAllSaved = useCallback(() => {
    try {
      const storageKey = getStorageKey();
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const allSuggestions: SavedSuggestionsState = JSON.parse(stored);
        delete allSuggestions[currentLanguage];
        localStorage.setItem(storageKey, JSON.stringify(allSuggestions));
        setSavedSuggestions([]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error clearing suggestions:', error);
      return false;
    }
  }, [currentLanguage, getStorageKey]);

  // Force reload suggestions (useful after profile import)
  const reloadSuggestions = useCallback(() => {
    console.log('🔄 Force reloading AI suggestions...');
    loadSuggestions();
  }, [loadSuggestions]);

  // Listen for storage changes from profile imports
  useEffect(() => {
    const storageKey = getStorageKey();
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKey) {
        console.log(`📥 AI suggestions localStorage changed for profile ${profileId}, reloading...`);
        loadSuggestions();
      }
    };

    // Listen for custom events (for same-tab changes)
    const handleCustomEvent = (e: CustomEvent) => {
      if (e.detail?.type === 'ai-suggestions-imported' && e.detail?.profileId === profileId) {
        console.log(`📥 AI suggestions imported event detected for profile ${profileId}, reloading...`);
        setTimeout(() => loadSuggestions(), 100); // Small delay to ensure localStorage is updated
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('ai-suggestions-updated' as any, handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('ai-suggestions-updated' as any, handleCustomEvent);
    };
  }, [loadSuggestions, getStorageKey, profileId]);

  // Load suggestions when language changes
  useEffect(() => {
    loadSuggestions();
  }, [loadSuggestions]);

  return {
    savedSuggestions,
    saveSuggestion,
    removeSavedSuggestion,
    toggleFavorite,
    setCurrentSuggestions,
    hasUnsavedSuggestions,
    saveAllCurrent,
    clearAllSaved,
    reloadSuggestions,
    unsavedSuggestions
  };
};
