import { renderHook, act, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';

describe('useColumnVisibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads default visibility when storage is empty', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);

    const { result } = renderHook(() => useColumnVisibility('page'));

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    expect(localStorage.getItem).toHaveBeenCalledWith('family-budget-column-visibility-page');
    expect(result.current.visibility).toEqual({
      name: true,
      projected: true,
      actual: true,
      difference: true,
    });
  });

  it('loads stored visibility for the given scope', async () => {
    vi.mocked(localStorage.getItem).mockImplementation((key: string) => {
      if (key === 'family-budget-column-visibility-page') {
        return JSON.stringify({
          name: true,
          projected: false,
          actual: true,
          difference: false,
        });
      }
      return null;
    });

    const { result } = renderHook(() => useColumnVisibility('page'));

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    expect(result.current.visibility).toEqual({
      name: true,
      projected: false,
      actual: true,
      difference: false,
    });
  });

  it('forces item/name column to stay visible even with invalid stored value', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify({
      name: false,
      projected: false,
      actual: true,
      difference: true,
    }));

    const { result } = renderHook(() => useColumnVisibility('page'));

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    expect(result.current.visibility.name).toBe(true);
  });

  it('persists updates using the scoped storage key', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);

    const { result } = renderHook(() => useColumnVisibility('page'));

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    act(() => {
      result.current.updateVisibility('actual', false);
    });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'family-budget-column-visibility-page',
      JSON.stringify({
        name: true,
        projected: true,
        actual: false,
        difference: true,
      })
    );
    expect(result.current.visibility.actual).toBe(false);
  });

  it('resets and removes scoped storage key', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);

    const { result } = renderHook(() => useColumnVisibility('page'));

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    act(() => {
      result.current.updateVisibility('projected', false);
    });

    act(() => {
      result.current.resetToDefaults();
    });

    expect(localStorage.removeItem).toHaveBeenCalledWith('family-budget-column-visibility-page');
    expect(result.current.visibility).toEqual({
      name: true,
      projected: true,
      actual: true,
      difference: true,
    });
  });

  it('ignores attempts to modify item/name column visibility', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);

    const { result } = renderHook(() => useColumnVisibility('page'));

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    act(() => {
      result.current.updateVisibility('name', false);
    });

    expect(result.current.visibility.name).toBe(true);
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });
});
