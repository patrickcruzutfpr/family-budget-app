import { BudgetProfile, BudgetState, ProfileSummary, CategoryType } from '@/types';
import { generateId } from '@/utils/generateId';

const PROFILES_STORAGE_KEY = 'familyBudgetProfiles';
const CURRENT_PROFILE_KEY = 'currentProfileId';

// Default profile template
const createDefaultProfile = (): BudgetProfile => ({
  id: generateId(),
  name: 'My First Budget',
  description: 'Default family budget profile',
  budget: [
    {
      id: generateId(),
      name: 'Income',
      type: CategoryType.INCOME,
      items: [
        { id: generateId(), name: 'Salary', projected: 5000, actual: 5000 },
      ],
    },
    {
      id: generateId(),
      name: 'Housing',
      type: CategoryType.EXPENSE,
      items: [
        { id: generateId(), name: 'Rent/Mortgage', projected: 1500, actual: 1500 },
        { id: generateId(), name: 'Utilities', projected: 200, actual: 180 },
      ],
    },
    {
      id: generateId(),
      name: 'Food',
      type: CategoryType.EXPENSE,
      items: [
        { id: generateId(), name: 'Groceries', projected: 600, actual: 650 },
        { id: generateId(), name: 'Dining Out', projected: 200, actual: 180 },
      ],
    },
    {
      id: generateId(),
      name: 'Transportation',
      type: CategoryType.EXPENSE,
      items: [
        { id: generateId(), name: 'Gas', projected: 200, actual: 220 },
        { id: generateId(), name: 'Car Payment', projected: 300, actual: 300 },
      ],
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
  isDefault: true,
});

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
  
  return JSON.stringify(profile, null, 2);
};

export const importProfile = (profileData: string): BudgetProfile => {
  try {
    const profile = JSON.parse(profileData) as BudgetProfile;
    
    // Validate required fields
    if (!profile.name || !profile.budget || !Array.isArray(profile.budget)) {
      throw new Error('Invalid profile data format');
    }
    
    // Generate new ID and timestamps for imported profile
    const importedProfile: BudgetProfile = {
      ...profile,
      id: generateId(),
      name: `${profile.name} (Imported)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    saveProfile(importedProfile);
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
