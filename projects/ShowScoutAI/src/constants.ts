const getBrowserLanguage = (): 'EN' | 'IT' => {
  const lang = navigator.language || (navigator as any).userLanguage || 'en';
  return lang.toLowerCase().startsWith('it') ? 'IT' : 'EN';
};

export const DEFAULT_MODEL = 'gemini-3-flash-preview';
export const DEFAULT_LANGUAGE = getBrowserLanguage();

export const APP_STORAGE_KEYS = {
  SETTINGS: 'showscout_settings',
  WATCHLIST: 'showscout_watchlist',
  NEWS: 'showscout_news',
};