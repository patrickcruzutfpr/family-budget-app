import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BudgetProfile, CategoryType } from '@/types';
import {
  getAllProfiles,
  getCurrentProfile,
  getCurrentProfileId,
  saveProfile,
} from '@/services/profileService';

const createProfile = (overrides: Partial<BudgetProfile> = {}): BudgetProfile => ({
  id: overrides.id ?? 'profile-1',
  name: overrides.name ?? 'Profile 1',
  budget: overrides.budget ?? [
    {
      id: 'income',
      name: 'Income',
      type: CategoryType.INCOME,
      items: [],
    },
  ],
  description: overrides.description,
  createdAt: overrides.createdAt ?? new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: overrides.updatedAt ?? new Date('2026-01-01T00:00:00.000Z'),
  isDefault: overrides.isDefault,
});

describe('profileService bootstrap correctness', () => {
  let storage: Record<string, string>;

  beforeEach(() => {
    storage = {};
    vi.clearAllMocks();

    vi.mocked(localStorage.getItem).mockImplementation((key: string) => storage[key] ?? null);
    vi.mocked(localStorage.setItem).mockImplementation((key: string, value: string) => {
      storage[key] = value;
    });
    vi.mocked(localStorage.removeItem).mockImplementation((key: string) => {
      delete storage[key];
    });
    vi.mocked(localStorage.clear).mockImplementation(() => {
      storage = {};
    });
  });

  it('initializes default profile once when storage is empty', () => {
    const profiles = getAllProfiles();

    expect(profiles).toHaveLength(1);
    expect(storage.familyBudgetProfiles).toBeTruthy();
    expect(getCurrentProfileId()).toBe(profiles[0].id);

    const storedProfiles = JSON.parse(storage.familyBudgetProfiles);
    expect(storedProfiles).toHaveLength(1);
    expect(storedProfiles[0].id).toBe(profiles[0].id);
  });

  it('saves a new profile without recursive bootstrap overflow', () => {
    const profile = createProfile({ id: 'new-profile' });

    expect(() => saveProfile(profile)).not.toThrow();

    const storedProfiles = JSON.parse(storage.familyBudgetProfiles);
    const ids = storedProfiles.map((p: BudgetProfile) => p.id);

    expect(ids).toContain('new-profile');
    expect(ids.length).toBeGreaterThanOrEqual(1);
  });

  it('falls back to first available profile when current id is invalid', () => {
    const first = createProfile({ id: 'p-1', name: 'First' });
    const second = createProfile({ id: 'p-2', name: 'Second' });

    storage.familyBudgetProfiles = JSON.stringify([first, second]);
    storage.currentProfileId = 'missing-id';

    const current = getCurrentProfile();

    expect(current.id).toBe('p-1');
    expect(storage.currentProfileId).toBe('p-1');
  });

  it('recovers safely from corrupted stored payload', () => {
    storage.familyBudgetProfiles = '{invalid-json';

    const profiles = getAllProfiles();

    expect(profiles).toHaveLength(1);
    expect(storage.familyBudgetProfiles).toBeTruthy();
    expect(getCurrentProfileId()).toBe(profiles[0].id);
  });
});
