import { beforeEach, describe, expect, it, vi } from 'vitest';
import { resetBudgetToDefault } from '@/services/budgetService';

describe('budgetService.resetBudgetToDefault', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('removes only the explicit whitelist keys', () => {
    resetBudgetToDefault();

    expect(localStorage.removeItem).toHaveBeenCalledWith('familyBudget');
    expect(localStorage.removeItem).toHaveBeenCalledWith('budget');
    expect(localStorage.removeItem).toHaveBeenCalledWith('family-budget-language');
    expect(localStorage.removeItem).toHaveBeenCalledTimes(3);
  });

  it('does not remove profile keys as part of budget reset', () => {
    resetBudgetToDefault();

    expect(localStorage.removeItem).not.toHaveBeenCalledWith('familyBudgetProfiles');
    expect(localStorage.removeItem).not.toHaveBeenCalledWith('currentProfileId');
  });

  it('returns a deep copy of the default budget on each call', () => {
    const first = resetBudgetToDefault();
    first[0].items[0].actual = 123456;

    const second = resetBudgetToDefault();

    expect(second[0].items[0].actual).not.toBe(123456);
  });
});
