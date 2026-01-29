/**
 * Progress Storage Layer
 * Abstraction over localStorage and server storage
 */

import type { UserProgress } from './types';

const PROGRESS_KEY = 'sql-mastery-progress';
const SYNCED_USER_ID_KEY = 'sql-mastery-synced-user-id';

// ============================================================================
// Local Storage
// ============================================================================

export const localStorageStorage = {
  get(): UserProgress | null {
    try {
      const data = localStorage.getItem(PROGRESS_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  set(progress: UserProgress): boolean {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
      return true;
    } catch {
      return false;
    }
  },

  remove(): void {
    localStorage.removeItem(PROGRESS_KEY);
  },
};

// ============================================================================
// Server Storage
// ============================================================================

export interface ServerStorageOptions {
  onError?: (error: string) => void;
}

export class ServerStorageError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'ServerStorageError';
  }
}

export const serverStorage = {
  async get(): Promise<UserProgress> {
    const response = await fetch('/api/progress');

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new ServerStorageError(error.error || 'Failed to fetch progress', response.status.toString());
    }

    return response.json();
  },

  async save(progress: UserProgress): Promise<UserProgress> {
    const response = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(progress),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new ServerStorageError(error.error || 'Failed to save progress', response.status.toString());
    }

    return response.json();
  },
};

// ============================================================================
// Sync Tracking
// ============================================================================

export const syncTracking = {
  getUserId(): string | null {
    return localStorage.getItem(SYNCED_USER_ID_KEY);
  },

  setUserId(userId: string): void {
    localStorage.setItem(SYNCED_USER_ID_KEY, userId);
  },

  clearUserId(): void {
    localStorage.removeItem(SYNCED_USER_ID_KEY);
  },

  hasSynced(userId: string): boolean {
    return this.getUserId() === userId;
  },
};
