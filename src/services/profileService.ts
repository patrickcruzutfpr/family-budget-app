import { BudgetProfile, BudgetState, ProfileSummary, CategoryType } from '@/types';
import { generateId } from '@/utils/generateId';
import { getInitialLanguage, loadTranslations, getTranslation } from '@/i18n/utils';

const PROFILES_STORAGE_KEY = 'familyBudgetProfiles';
const CURRENT_PROFILE_KEY = 'currentProfileId';

// Get translations synchronously for default data
const getDefaultTranslations = () => {
  // Try multiple sources for language detection
  let currentLanguage;
  
  try {
    // 1. Try to get from localStorage first (user preference)
    const stored = localStorage.getItem('family-budget-language');
    if (stored && (stored === 'pt-BR' || stored === 'en')) {
      currentLanguage = stored;
    }
  } catch (error) {
    console.warn('Failed to get language from localStorage:', error);
  }
  
  // 2. If no stored preference, use initial language detection
  if (!currentLanguage) {
    currentLanguage = getInitialLanguage();
  }
  
  // 3. Final fallback based on browser language if detection fails
  if (!currentLanguage || (currentLanguage !== 'pt-BR' && currentLanguage !== 'en')) {
    const browserLang = navigator.language || navigator.languages?.[0] || 'pt-BR';
    currentLanguage = browserLang.startsWith('pt') ? 'pt-BR' : 'en';
  }
  
  // Fallback translations based on current language
  const translations = {
    'pt-BR': {
      income: 'Renda',
      housing: 'Habitação',
      food: 'Alimentação',
      transportation: 'Transporte',
      salary: 'Salário',
      rentMortgage: 'Aluguel/Financiamento',
      utilities: 'Utilidades',
      groceries: 'Mercado',
      diningOut: 'Restaurantes',
      gas: 'Combustível',
      carPayment: 'Prestação do Carro'
    },
    'en': {
      income: 'Income',
      housing: 'Housing',
      food: 'Food',
      transportation: 'Transportation',
      salary: 'Salary',
      rentMortgage: 'Rent/Mortgage',
      utilities: 'Utilities',
      groceries: 'Groceries',
      diningOut: 'Dining Out',
      gas: 'Gas',
      carPayment: 'Car Payment'
    }
  };

  return translations[currentLanguage as keyof typeof translations] || translations['pt-BR'];
};

// Default profile template
const createDefaultProfile = (): BudgetProfile => {
  const t = getDefaultTranslations();

  return {
    id: generateId(),
    name: 'My First Budget',
    description: 'Default family budget profile',
    budget: [
      {
        id: generateId(),
        name: t.income,
        type: CategoryType.INCOME,
        items: [
          { id: generateId(), name: t.salary, projected: 5000, actual: 5000 },
        ],
        icon: '💰',
        color: '#10B981'
      },
      {
        id: generateId(),
        name: t.housing,
        type: CategoryType.EXPENSE,
        items: [
          { id: generateId(), name: t.rentMortgage, projected: 1500, actual: 1500 },
          { id: generateId(), name: t.utilities, projected: 200, actual: 180 },
        ],
        icon: '🏠',
        color: '#3B82F6'
      },
      {
        id: generateId(),
        name: t.food,
        type: CategoryType.EXPENSE,
        items: [
          { id: generateId(), name: t.groceries, projected: 600, actual: 650 },
          { id: generateId(), name: t.diningOut, projected: 200, actual: 180 },
        ],
        icon: '🍕',
        color: '#10B981'
      },
      {
        id: generateId(),
        name: t.transportation,
        type: CategoryType.EXPENSE,
        items: [
          { id: generateId(), name: t.gas, projected: 200, actual: 220 },
          { id: generateId(), name: t.carPayment, projected: 300, actual: 300 },
        ],
        icon: '🚗',
        color: '#EF4444'
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    isDefault: true,
  };
};

// Get all profiles from storage
export const getAllProfiles = (): BudgetProfile[] => {
  try {
    const stored = localStorage.getItem(PROFILES_STORAGE_KEY);
    if (!stored) {
      // Create default profile if none exist
      const defaultProfile = createDefaultProfile();
      saveProfile(defaultProfile);
      setCurrentProfileId(defaultProfile.id);
      return [defaultProfile];
    }
    
    const profiles = JSON.parse(stored) as BudgetProfile[];
    // Convert date strings back to Date objects
    return profiles.map(profile => ({
      ...profile,
      createdAt: new Date(profile.createdAt),
      updatedAt: new Date(profile.updatedAt),
    }));
  } catch (error) {
    console.error('Error loading profiles:', error);
    const defaultProfile = createDefaultProfile();
    return [defaultProfile];
  }
};

// Get profile summaries (lightweight version for listing)
export const getProfileSummaries = (): ProfileSummary[] => {
  const profiles = getAllProfiles();
  
  return profiles.map(profile => {
    const totalIncome = profile.budget
      .filter(c => c.type === CategoryType.INCOME)
      .reduce((sum, category) => 
        sum + category.items.reduce((itemSum, item) => itemSum + item.actual, 0), 0
      );
    
    const totalExpenses = profile.budget
      .filter(c => c.type === CategoryType.EXPENSE)
      .reduce((sum, category) => 
        sum + category.items.reduce((itemSum, item) => itemSum + item.actual, 0), 0
      );
    
    const itemCount = profile.budget.reduce((sum, category) => sum + category.items.length, 0);
    
    return {
      id: profile.id,
      name: profile.name,
      description: profile.description,
      totalIncome,
      totalExpenses,
      itemCount,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      isDefault: profile.isDefault,
    };
  });
};

// Get a specific profile by ID
export const getProfileById = (id: string): BudgetProfile | null => {
  const profiles = getAllProfiles();
  return profiles.find(profile => profile.id === id) || null;
};

// Save or update a profile
export const saveProfile = (profile: BudgetProfile): void => {
  try {
    const profiles = getAllProfiles();
    const existingIndex = profiles.findIndex(p => p.id === profile.id);
    
    const updatedProfile = {
      ...profile,
      updatedAt: new Date(),
    };
    
    if (existingIndex >= 0) {
      profiles[existingIndex] = updatedProfile;
    } else {
      profiles.push(updatedProfile);
    }
    
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
  } catch (error) {
    console.error('Error saving profile:', error);
    throw new Error('Failed to save profile');
  }
};

// Create a new profile
export const createProfile = (name: string, description?: string, basedOn?: BudgetState): BudgetProfile => {
  const newProfile: BudgetProfile = {
    id: generateId(),
    name,
    description,
    budget: basedOn || [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  saveProfile(newProfile);
  return newProfile;
};

// Delete a profile
export const deleteProfile = (id: string): boolean => {
  try {
    const profiles = getAllProfiles();
    const profileToDelete = profiles.find(p => p.id === id);
    
    // Don't allow deleting the last profile
    if (profiles.length <= 1) {
      throw new Error('Cannot delete the last profile');
    }
    
    // Don't allow deleting if it's the current profile
    if (getCurrentProfileId() === id) {
      throw new Error('Cannot delete the current active profile. Switch to another profile first.');
    }
    
    const filteredProfiles = profiles.filter(p => p.id !== id);
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(filteredProfiles));
    
    return true;
  } catch (error) {
    console.error('Error deleting profile:', error);
    throw error;
  }
};

// Duplicate a profile
export const duplicateProfile = (sourceId: string, newName: string): BudgetProfile => {
  const sourceProfile = getProfileById(sourceId);
  if (!sourceProfile) {
    throw new Error('Source profile not found');
  }
  
  const duplicatedProfile = createProfile(
    newName,
    `Copy of ${sourceProfile.name}`,
    sourceProfile.budget
  );
  
  return duplicatedProfile;
};

// Current profile management
export const getCurrentProfileId = (): string | null => {
  return localStorage.getItem(CURRENT_PROFILE_KEY);
};

export const setCurrentProfileId = (id: string): void => {
  localStorage.setItem(CURRENT_PROFILE_KEY, id);
};

export const getCurrentProfile = (): BudgetProfile => {
  const currentId = getCurrentProfileId();
  if (currentId) {
    const profile = getProfileById(currentId);
    if (profile) {
      return profile;
    }
  }
  
  // Fallback: get the first available profile or create default
  const profiles = getAllProfiles();
  if (profiles.length > 0) {
    setCurrentProfileId(profiles[0].id);
    return profiles[0];
  }
  
  // Create and return default profile
  const defaultProfile = createDefaultProfile();
  saveProfile(defaultProfile);
  setCurrentProfileId(defaultProfile.id);
  return defaultProfile;
};

// Update current profile's budget
export const updateCurrentProfileBudget = (budget: BudgetState): void => {
  const currentProfile = getCurrentProfile();
  const updatedProfile = {
    ...currentProfile,
    budget,
    updatedAt: new Date(),
  };
  saveProfile(updatedProfile);
};

// Export/Import functionality
export const exportProfile = (id: string): string => {
  const profile = getProfileById(id);
  if (!profile) {
    throw new Error('Profile not found');
  }
  
  // Include AI suggestions in export (profile-specific)
  const aiSuggestions = getProfileAISuggestions(id);
  const profileWithAI = {
    ...profile,
    aiSuggestions
  };
  
  return JSON.stringify(profileWithAI, null, 2);
};

// Helper function to get AI suggestions for a specific profile
const getProfileAISuggestions = (profileId: string) => {
  try {
    // Get suggestions for the specific profile
    const profileStorageKey = `family-budget-saved-suggestions-${profileId}`;
    const stored = localStorage.getItem(profileStorageKey);
    
    if (stored) {
      const allSuggestions = JSON.parse(stored);
      
      // Flatten all language suggestions into single array for export
      const flatSuggestions: any[] = [];
      Object.keys(allSuggestions).forEach(language => {
        if (allSuggestions[language] && Array.isArray(allSuggestions[language])) {
          flatSuggestions.push(...allSuggestions[language]);
        }
      });
      
      const favoritesCount = flatSuggestions.filter(s => s.isFavorite).length;
      
      return flatSuggestions;
    }
  } catch (error) {
    console.error('Error getting AI suggestions for export:', error);
  }
  return [];
};

// Helper function to get AI suggestions for export
const getAISuggestionsForExport = (profileId?: string) => {
  try {
    // Use profile-specific storage key
    const storageKey = profileId 
      ? `family-budget-saved-suggestions-${profileId}`
      : 'family-budget-saved-suggestions'; // Fallback for backward compatibility
      
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      const allSuggestions = JSON.parse(stored);
      
      // Flatten all language suggestions into single array for export
      const flatSuggestions: any[] = [];
      Object.keys(allSuggestions).forEach(language => {
        if (allSuggestions[language] && Array.isArray(allSuggestions[language])) {
          flatSuggestions.push(...allSuggestions[language]);
        }
      });
      
      const favoritesCount = flatSuggestions.filter(s => s.isFavorite).length;
      
      return flatSuggestions;
    }
  } catch (error) {
    console.error('Error getting AI suggestions for export:', error);
  }
  return [];
};

// Helper function to restore AI suggestions from import
const restoreAISuggestionsFromImport = (aiSuggestions?: any[], profileId?: string) => {
  if (!aiSuggestions || !Array.isArray(aiSuggestions)) {
    return;
  }

  try {
    // Use profile-specific storage key
    const storageKey = profileId 
      ? `family-budget-saved-suggestions-${profileId}`
      : 'family-budget-saved-suggestions'; // Fallback for backward compatibility
      
    const stored = localStorage.getItem(storageKey);
    const currentSuggestions = stored ? JSON.parse(stored) : {};
    
    // Group imported suggestions by language
    aiSuggestions.forEach(suggestion => {
      const language = suggestion.language || 'pt-BR'; // Default fallback
      
      if (!currentSuggestions[language]) {
        currentSuggestions[language] = [];
      }
      
      // Avoid duplicates by checking title and content
      const exists = currentSuggestions[language].some((s: any) => 
        s.title === suggestion.title && s.suggestion === suggestion.suggestion
      );
      
      if (!exists) {
        // Ensure proper date object and preserve all properties including isFavorite
        const restoredSuggestion = {
          ...suggestion,
          savedAt: new Date(suggestion.savedAt),
          id: suggestion.id || `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };
        
        currentSuggestions[language].unshift(restoredSuggestion);
        
        // Keep only last 50 suggestions per language
        currentSuggestions[language] = currentSuggestions[language].slice(0, 50);
      }
    });
    
    localStorage.setItem(storageKey, JSON.stringify(currentSuggestions));
    
    const totalFavorites = Object.values(currentSuggestions).flat().filter((s: any) => s.isFavorite).length;
    
    // Dispatch custom event to notify components that AI suggestions were updated
    const event = new CustomEvent('ai-suggestions-updated', {
      detail: { type: 'ai-suggestions-imported', totalFavorites, profileId }
    });
    window.dispatchEvent(event);
  } catch (error) {
    console.error('Error restoring AI suggestions from import:', error);
  }
};

export const importProfile = (profileData: string): BudgetProfile => {
  try {
    const profile = JSON.parse(profileData) as BudgetProfile & { aiSuggestions?: any[] };
    
    // Validate required fields
    if (!profile.name || !profile.budget || !Array.isArray(profile.budget)) {
      throw new Error('Invalid profile data format');
    }
    
    // Generate new ID and timestamps for imported profile
    const importedProfile: BudgetProfile = {
      id: generateId(),
      name: `${profile.name} (Imported)`,
      description: profile.description,
      budget: profile.budget,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDefault: false
      // Don't include aiSuggestions in the stored profile - they're handled separately
    };
    
    saveProfile(importedProfile);
    
    // Restore AI suggestions for the new profile if present
    if (profile.aiSuggestions) {
      restoreAISuggestionsFromImport(profile.aiSuggestions, importedProfile.id);
    }
    
    return importedProfile;
  } catch (error) {
    console.error('Error importing profile:', error);
    throw new Error('Failed to import profile. Please check the file format.');
  }
};

// Reset profiles to default
export const resetToDefault = (): BudgetProfile => {
  localStorage.removeItem(PROFILES_STORAGE_KEY);
  localStorage.removeItem(CURRENT_PROFILE_KEY);
  
  const defaultProfile = createDefaultProfile();
  saveProfile(defaultProfile);
  setCurrentProfileId(defaultProfile.id);
  
  return defaultProfile;
};

// Update all profile categories to match current language
export const updateAllProfileCategoriesLanguage = (): boolean => {
  try {
    const profiles = getAllProfiles();
    if (profiles.length === 0) {
      return false;
    }

    const t = getDefaultTranslations();
    const categoryTranslations = {
      // Income translations
      'Income': t.income,
      'Renda': t.income,
      'Receita': t.income,
      'Ingresos': t.income,
      'Revenu': t.income,
      
      // Housing translations  
      'Housing': t.housing,
      'Habitação': t.housing,
      'Moradia': t.housing,
      'Casa': t.housing,
      'Vivienda': t.housing,
      'Logement': t.housing,
      
      // Food translations
      'Food': t.food,
      'Alimentação': t.food,
      'Comida': t.food,
      'Alimentos': t.food,
      'Nourriture': t.food,
      'Alimentation': t.food,
      
      // Transportation translations
      'Transportation': t.transportation,
      'Transporte': t.transportation,
      'Transport': t.transportation,
      'Locomoção': t.transportation,
      'Mobilidade': t.transportation
    };

    let hasChanges = false;

    const updatedProfiles = profiles.map(profile => {
      const updatedProfile = { ...profile };
      let profileChanged = false;

      updatedProfile.budget = profile.budget.map(category => {
        const newName = categoryTranslations[category.name as keyof typeof categoryTranslations];
        if (newName && newName !== category.name) {
          profileChanged = true;
          hasChanges = true;
          return { ...category, name: newName };
        }
        return category;
      });

      if (profileChanged) {
        updatedProfile.updatedAt = new Date();
      }

      return updatedProfile;
    });

    if (hasChanges) {
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(updatedProfiles));
      
      // Dispatch event to notify components
      const event = new CustomEvent('profileChanged', {
        detail: { type: 'categories-language-updated' }
      });
      window.dispatchEvent(event);
    }

    return hasChanges;
  } catch (error) {
    console.error('Error updating profile categories language:', error);
    return false;
  }
};
