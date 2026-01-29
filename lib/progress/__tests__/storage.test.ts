/**
 * Progress Storage Tests
 * Tests for localStorage and server storage abstraction
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { localStorageStorage, serverStorage, syncTracking, ServerStorageError } from '../storage';
import type { UserProgress } from '../types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

// Mock fetch
global.fetch = vi.fn();

describe('localStorageStorage', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  const mockProgress: UserProgress = {
    completedChallenges: ['w1-d1-c1', 'w1-d1-c2'],
    currentChallenge: 'w1-d1-c3',
    startedAt: '2024-01-01T00:00:00.000Z',
    lastActivity: '2024-01-01T01:00:00.000Z',
    totalXp: 0,
  };

  describe('get', () => {
    it('should return null when no progress is stored', () => {
      const result = localStorageStorage.get();
      expect(result).toBeNull();
    });

    it('should return progress when stored', () => {
      localStorageStorage.set(mockProgress);
      const result = localStorageStorage.get();
      expect(result).toEqual(mockProgress);
    });

    it('should handle corrupted data gracefully', () => {
      localStorageMock.setItem('sql-mastery-progress', 'invalid-json');
      const result = localStorageStorage.get();
      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('should store progress successfully', () => {
      const result = localStorageStorage.set(mockProgress);
      expect(result).toBe(true);
      expect(localStorageMock.getItem('sql-mastery-progress')).toBe(JSON.stringify(mockProgress));
    });

    it('should overwrite existing progress', () => {
      localStorageStorage.set(mockProgress);
      const newProgress: UserProgress = {
        ...mockProgress,
        completedChallenges: ['w1-d1-c1'],
      };
      localStorageStorage.set(newProgress);
      const result = localStorageStorage.get();
      expect(result).toEqual(newProgress);
    });
  });

  describe('remove', () => {
    it('should remove stored progress', () => {
      localStorageStorage.set(mockProgress);
      localStorageStorage.remove();
      const result = localStorageStorage.get();
      expect(result).toBeNull();
    });
  });
});

describe('syncTracking', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should store and retrieve user ID', () => {
    syncTracking.setUserId('user-123');
    expect(syncTracking.getUserId()).toBe('user-123');
  });

  it('should return null when no user ID is stored', () => {
    expect(syncTracking.getUserId()).toBeNull();
  });

  it('should check if synced for user', () => {
    expect(syncTracking.hasSynced('user-123')).toBe(false);
    syncTracking.setUserId('user-123');
    expect(syncTracking.hasSynced('user-123')).toBe(true);
    expect(syncTracking.hasSynced('user-456')).toBe(false);
  });

  it('should clear user ID', () => {
    syncTracking.setUserId('user-123');
    syncTracking.clearUserId();
    expect(syncTracking.getUserId()).toBeNull();
  });
});

describe('serverStorage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const mockProgress: UserProgress = {
    completedChallenges: ['w1-d1-c1', 'w1-d1-c2'],
    currentChallenge: 'w1-d1-c3',
    startedAt: '2024-01-01T00:00:00.000Z',
    lastActivity: '2024-01-01T01:00:00.000Z',
    totalXp: 0,
  };

  describe('get', () => {
    it('should fetch progress from server', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProgress,
      } as Response);

      const result = await serverStorage.get();
      expect(result).toEqual(mockProgress);
      expect(fetch).toHaveBeenCalledWith('/api/progress');
    });

    it('should throw ServerStorageError on fetch failure', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Unauthorized' }),
      } as Response);

      await expect(serverStorage.get()).rejects.toThrow(ServerStorageError);
      await expect(serverStorage.get()).rejects.toThrow('Unauthorized');
    });

    it('should throw ServerStorageError on network error', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

      await expect(serverStorage.get()).rejects.toThrow(ServerStorageError);
    });
  });

  describe('save', () => {
    it('should save progress to server', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProgress,
      } as Response);

      const result = await serverStorage.save(mockProgress);
      expect(result).toEqual(mockProgress);
      expect(fetch).toHaveBeenCalledWith('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockProgress),
      });
    });

    it('should throw ServerStorageError on save failure', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Server error' }),
      } as Response);

      await expect(serverStorage.save(mockProgress)).rejects.toThrow(ServerStorageError);
    });
  });
});

describe('ServerStorageError', () => {
  it('should create error with message', () => {
    const error = new ServerStorageError('Test error');
    expect(error.message).toBe('Test error');
    expect(error.name).toBe('ServerStorageError');
  });

  it('should create error with message and code', () => {
    const error = new ServerStorageError('Test error', '500');
    expect(error.message).toBe('Test error');
    expect(error.code).toBe('500');
  });
});
