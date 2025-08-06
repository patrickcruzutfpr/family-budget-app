import { useState, useEffect, useCallback } from 'react';
import { 
  BudgetProfile, 
  ProfileSummary, 
  BudgetState 
} from '@/types';
import {
  getAllProfiles,
  getProfileSummaries,
  getCurrentProfile,
  setCurrentProfileId,
  createProfile,
  saveProfile,
  deleteProfile,
  duplicateProfile,
  updateCurrentProfileBudget,
  exportProfile,
  importProfile,
} from '@/services/profileService';

export const useProfileManager = () => {
  const [profiles, setProfiles] = useState<ProfileSummary[]>([]);
  const [currentProfile, setCurrentProfile] = useState<BudgetProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load profiles and current profile
  const loadProfiles = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);
      
      const profileSummaries = getProfileSummaries();
      const current = getCurrentProfile();
      
      setProfiles(profileSummaries);
      setCurrentProfile(current);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profiles');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Switch to a different profile
  const switchProfile = useCallback(async (profileId: string) => {
    try {
      setError(null);
      setCurrentProfileId(profileId);
      
      const newCurrentProfile = getCurrentProfile();
      setCurrentProfile(newCurrentProfile);
      
      // Refresh profile list to update current indicators
      loadProfiles();
      
      return newCurrentProfile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to switch profile');
      throw err;
    }
  }, [loadProfiles]);

  // Create a new profile
  const createNewProfile = useCallback(async (
    name: string, 
    description?: string, 
    basedOnCurrent?: boolean
  ) => {
    try {
      setError(null);
      
      const baseBudget = basedOnCurrent && currentProfile ? currentProfile.budget : undefined;
      const newProfile = createProfile(name, description, baseBudget);
      
      loadProfiles();
      return newProfile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create profile');
      throw err;
    }
  }, [currentProfile, loadProfiles]);

  // Update current profile
  const updateProfile = useCallback(async (
    updates: Partial<Pick<BudgetProfile, 'name' | 'description'>>
  ) => {
    try {
      if (!currentProfile) {
        throw new Error('No current profile to update');
      }
      
      setError(null);
      
      const updatedProfile = {
        ...currentProfile,
        ...updates,
        updatedAt: new Date(),
      };
      
      saveProfile(updatedProfile);
      setCurrentProfile(updatedProfile);
      loadProfiles();
      
      return updatedProfile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    }
  }, [currentProfile, loadProfiles]);

  // Update current profile's budget
  const updateBudget = useCallback(async (budget: BudgetState) => {
    try {
      setError(null);
      
      updateCurrentProfileBudget(budget);
      
      // Update current profile state
      if (currentProfile) {
        const updatedProfile = {
          ...currentProfile,
          budget,
          updatedAt: new Date(),
        };
        setCurrentProfile(updatedProfile);
      }
      
      loadProfiles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update budget');
      throw err;
    }
  }, [currentProfile, loadProfiles]);

  // Delete a profile
  const removeProfile = useCallback(async (profileId: string) => {
    try {
      setError(null);
      
      await deleteProfile(profileId);
      loadProfiles();
      
      // If we deleted the current profile, we need to reload current
      if (currentProfile?.id === profileId) {
        const newCurrent = getCurrentProfile();
        setCurrentProfile(newCurrent);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete profile');
      throw err;
    }
  }, [currentProfile, loadProfiles]);

  // Duplicate a profile
  const duplicateExistingProfile = useCallback(async (
    sourceId: string, 
    newName: string
  ) => {
    try {
      setError(null);
      
      const duplicated = duplicateProfile(sourceId, newName);
      loadProfiles();
      
      return duplicated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to duplicate profile');
      throw err;
    }
  }, [loadProfiles]);

  // Export profile
  const exportProfileData = useCallback(async (profileId: string) => {
    try {
      setError(null);
      return exportProfile(profileId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export profile');
      throw err;
    }
  }, []);

  // Import profile
  const importProfileData = useCallback(async (profileData: string) => {
    try {
      setError(null);
      
      const imported = importProfile(profileData);
      loadProfiles();
      
      return imported;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import profile');
      throw err;
    }
  }, [loadProfiles]);

  // Initialize on mount
  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  return {
    // State
    profiles,
    currentProfile,
    isLoading,
    error,
    
    // Actions
    switchProfile,
    createNewProfile,
    updateProfile,
    updateBudget,
    removeProfile,
    duplicateExistingProfile,
    exportProfileData,
    importProfileData,
    refreshProfiles: loadProfiles,
    
    // Utilities
    clearError: () => setError(null),
  };
};
