import { atom } from 'nanostores';

const STORAGE_KEY = 'trust-trace-recent-ids';
const MAX_RECENT = 10;

// Helper to load from localStorage
const loadRecent = (): string[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Failed to load recent IDs:', e);
    return [];
  }
};

// The atom holding the list of IDs
export const $recentIds = atom<string[]>(loadRecent());

// Helper to save to localStorage and update atom
export function addRecentId(id: string) {
  if (!id) return;
  
  const current = $recentIds.get();
  // Filter out the ID if it already exists, then add to front (MRU)
  const updated = [id, ...current.filter((item) => item !== id)].slice(0, MAX_RECENT);
  
  $recentIds.set(updated);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearRecentIds() {
  $recentIds.set([]);
  localStorage.removeItem(STORAGE_KEY);
}
