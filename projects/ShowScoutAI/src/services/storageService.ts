import { AppSettings, NewsCard, WatchlistEntry } from '../types';
import { APP_STORAGE_KEYS, DEFAULT_MODEL, DEFAULT_LANGUAGE } from '../constants';

export const getSettings = (): AppSettings => {
  const stored = localStorage.getItem(APP_STORAGE_KEYS.SETTINGS);
  if (stored) {
    const parsed = JSON.parse(stored);
    // Backward compatibility for existing settings
    return {
      apiKey: parsed.apiKey || '',
      model: parsed.model || DEFAULT_MODEL,
      language: parsed.language || DEFAULT_LANGUAGE,
      temperature: parsed.temperature ?? 0.4,
      autoCheckTime: parsed.autoCheckTime || '',
      lastAutoCheckDate: parsed.lastAutoCheckDate || null,
    };
  }
  return {
    apiKey: '',
    model: DEFAULT_MODEL,
    language: DEFAULT_LANGUAGE,
    temperature: 0.4,
    autoCheckTime: '',
    lastAutoCheckDate: null,
  };
};

export const saveSettings = (settings: AppSettings): void => {
  localStorage.setItem(APP_STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};

export const getWatchlist = (): WatchlistEntry[] => {
  const stored = localStorage.getItem(APP_STORAGE_KEYS.WATCHLIST);
  return stored ? JSON.parse(stored) : [];
};

export const saveWatchlist = (list: WatchlistEntry[]): void => {
  localStorage.setItem(APP_STORAGE_KEYS.WATCHLIST, JSON.stringify(list));
};

export const getNews = (): NewsCard[] => {
  const stored = localStorage.getItem(APP_STORAGE_KEYS.NEWS);
  return stored ? JSON.parse(stored) : [];
};

export const saveNews = (news: NewsCard[]): void => {
  localStorage.setItem(APP_STORAGE_KEYS.NEWS, JSON.stringify(news));
};