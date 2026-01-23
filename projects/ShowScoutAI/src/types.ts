export interface Source {
  title: string;
  uri: string;
}

export interface NewsCard {
  id: string;
  showTitle: string;
  headline: string;
  summary: string;
  imageUrl?: string; // New field for AI-found image
  dateFound: string; // ISO String
  sources: Source[];
  isRead: boolean;
  isArchived: boolean;
}

export interface AppSettings {
  apiKey: string;
  model: string;
  language: 'EN' | 'IT'; // Added Language
  temperature: number;
  autoCheckTime: string; // Format "HH:mm" e.g. "09:00"
  lastAutoCheckDate: string | null; // "YYYY-MM-DD"
}

export type ViewState = 'inbox' | 'watchlist' | 'archive' | 'settings';

export interface WatchlistEntry {
  id: string;
  title: string;
  lastChecked: string | null;
}