import { useState, useEffect } from 'react';

export type TableColumn = 'name' | 'projected' | 'actual' | 'difference';

export interface ColumnVisibility {
  name: boolean;
  projected: boolean;
  actual: boolean;
  difference: boolean;
}

const DEFAULT_VISIBILITY: ColumnVisibility = {
  name: true,
  projected: true,
  actual: true,
  difference: true,
};

const STORAGE_KEY_PREFIX = 'family-budget-column-visibility';

const sanitizeVisibility = (value: Partial<ColumnVisibility> | null | undefined): ColumnVisibility => ({
  name: true,
  projected: value?.projected ?? true,
  actual: value?.actual ?? true,
  difference: value?.difference ?? true,
});

export const useColumnVisibility = (storageScope: string = 'default') => {
  const [visibility, setVisibility] = useState<ColumnVisibility>(DEFAULT_VISIBILITY);
  const [isLoaded, setIsLoaded] = useState(false);
  const storageKey = `${STORAGE_KEY_PREFIX}-${storageScope}`;

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        const sanitized = sanitizeVisibility(parsed);
        setVisibility(sanitized);
        localStorage.setItem(storageKey, JSON.stringify(sanitized));
      }
    } catch (error) {
      console.warn('Failed to load column visibility preference:', error);
    }
    setIsLoaded(true);
  }, [storageKey]);

  // Save to localStorage when visibility changes
  const updateVisibility = (column: TableColumn, visible: boolean) => {
    if (column === 'name') {
      return;
    }

    const newVisibility = sanitizeVisibility({ ...visibility, [column]: visible });
    setVisibility(newVisibility);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newVisibility));
    } catch (error) {
      console.warn('Failed to save column visibility preference:', error);
    }
  };

  const toggleColumn = (column: TableColumn) => {
    updateVisibility(column, !visibility[column]);
  };

  const resetToDefaults = () => {
    setVisibility(DEFAULT_VISIBILITY);
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.warn('Failed to reset column visibility preference:', error);
    }
  };

  return {
    visibility,
    isLoaded,
    toggleColumn,
    updateVisibility,
    resetToDefaults,
  };
};
