import { HistoryItem } from '../types/calculator';

const FAVORITES_KEY = 'calchub_favorites';
const HISTORY_KEY = 'calchub_history';
const THEME_KEY = 'calchub_theme';

export const getFavorites = (): string[] => {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : ['loan-calculator', 'bmi-calculator', 'percentage-calculator', 'age-calculator'];
  } catch {
    return [];
  }
};

export const toggleFavorite = (calcId: string): string[] => {
  const current = getFavorites();
  const next = current.includes(calcId) ? current.filter((id) => id !== calcId) : [...current, calcId];
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  } catch (e) {
    console.error('Failed to save favorites', e);
  }
  return next;
};

export const getHistory = (): HistoryItem[] => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const addHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>): HistoryItem[] => {
  const current = getHistory();
  const newItem: HistoryItem = {
    ...item,
    id: 'h_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    timestamp: Date.now()
  };
  // Keep last 40 history items
  const next = [newItem, ...current.filter((h) => !(h.calcId === item.calcId && JSON.stringify(h.inputs) === JSON.stringify(item.inputs)))].slice(0, 40);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch (e) {
    console.error('Failed to save history', e);
  }
  return next;
};

export const clearHistory = (): void => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.error('Failed to clear history', e);
  }
};

export const getStoredTheme = (): 'light' | 'dark' => {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {}
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const setStoredTheme = (theme: 'light' | 'dark'): void => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    console.error('Failed to save theme', e);
  }
};
