import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  NewsCard as NewsCardType, 
  ViewState, 
  WatchlistEntry, 
  AppSettings 
} from './types';
import * as Storage from './services/storageService';
import * as GeminiService from './services/geminiService';
import NewsCard from './components/NewsCard';
import NewsDetailModal from './components/NewsDetailModal';
import WatchlistManager from './components/WatchlistManager';
import SettingsModal from './components/SettingsModal';
import Toast from './components/Toast';
import { translations } from './translations';

const App: React.FC = () => {
  // State
  const [view, setView] = useState<ViewState>('inbox');
  const [settings, setSettings] = useState<AppSettings>(Storage.getSettings());
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>(Storage.getWatchlist());
  const [news, setNews] = useState<NewsCardType[]>(Storage.getNews());
  
  const [isChecking, setIsChecking] = useState(false);
  const [checkProgress, setCheckProgress] = useState({ current: 0, total: 0 });
  const [showSettings, setShowSettings] = useState(false);
  const [selectedNewsItem, setSelectedNewsItem] = useState<NewsCardType | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'info' | 'error' } | null>(null);

  // Use refs to access latest state in async callbacks without creating stale closures
  const settingsRef = useRef(settings);
  const watchlistRef = useRef(watchlist);
  const newsRef = useRef(news);
  const isCheckingRef = useRef(isChecking);

  useEffect(() => { settingsRef.current = settings; }, [settings]);
  useEffect(() => { watchlistRef.current = watchlist; }, [watchlist]);
  useEffect(() => { newsRef.current = news; }, [news]);
  useEffect(() => { isCheckingRef.current = isChecking; }, [isChecking]);

  // Localization
  const t = translations[settings.language] || translations.EN;
  const locale = settings.language === 'IT' ? 'it-IT' : 'en-US';

  // Persistence Effects (Debounced for non-critical changes)
  useEffect(() => Storage.saveSettings(settings), [settings]);
  useEffect(() => Storage.saveWatchlist(watchlist), [watchlist]);
  // News is now saved immediately in checkForUpdates for safety
  // Request Notification Permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Actions
  const handleAddWatchlist = (title: string) => {
    const newEntry: WatchlistEntry = {
      id: Math.random().toString(36).substring(2, 11),
      title,
      lastChecked: null
    };
    setWatchlist([newEntry, ...watchlist]);
    showToast(t.addedToWatchlist(title), 'success');
  };

  const handleRemoveWatchlist = (id: string) => {
    setWatchlist(watchlist.filter(w => w.id !== id));
  };

  const handleArchiveNews = (id: string) => {
    const updated = news.map(n => n.id === id ? { ...n, isRead: true, isArchived: true } : n);
    setNews(updated);
    Storage.saveNews(updated);
  };

  const handleDeleteNews = (id: string) => {
    const updated = news.filter(n => n.id !== id);
    setNews(updated);
    Storage.saveNews(updated);
  };

  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    showToast(translations[newSettings.language].settingsSaved, 'success');
  };
  
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({ message, type });
  };

  const sendSystemNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: './showscout_icon_192.png',
          tag: 'showscout-updates',
          badge: './showscout_icon_192.png'
        });
      } catch (e) {
        console.error("Notification failed", e);
      }
    }
  };

  // The AI Core Logic
  const checkForUpdates = useCallback(async (isAuto = false) => {
    const currentT = translations[settingsRef.current.language] || translations.EN;
    const currentWatchlist = watchlistRef.current;
    const currentSettings = settingsRef.current;

    if (currentWatchlist.length === 0 || !currentSettings.apiKey || isCheckingRef.current) {
      return;
    }

    const ONE_HOUR_MS = 60 * 60 * 1000;
    const now = Date.now();
    
    const showsToCheck = currentWatchlist.filter(show => {
      if (!show.lastChecked) return true;
      return (now - new Date(show.lastChecked).getTime()) > ONE_HOUR_MS;
    });

    if (showsToCheck.length === 0) {
      if (!isAuto) showToast(currentT.updatedRecently, "info");
      return;
    }

    setIsChecking(true);
    setCheckProgress({ current: 0, total: showsToCheck.length });

    let updatedWatchlist = [...currentWatchlist];
    let newItemsCount = 0;
    let localNews = [...newsRef.current];

    for (let i = 0; i < showsToCheck.length; i++) {
      const show = showsToCheck[i];
      setCheckProgress({ current: i + 1, total: showsToCheck.length });
      
      const existingHeadlines = localNews
        .filter(n => n.showTitle === show.title)
        .map(n => n.headline);

      let success = false;
      let retryCount = 0;
      
      // Retry loop for rate limits
      while (!success && retryCount < 3) {
        const result = await GeminiService.fetchUpdatesForShow(
          show.title, 
          show.lastChecked, 
          existingHeadlines, 
          currentSettings
        );

        if (!result.success && result.error && (result.error.includes('429') || result.error.includes('exhausted'))) {
             showToast(currentT.rateLimit, "error");
             await new Promise(resolve => setTimeout(resolve, 60000));
             retryCount++;
             continue;
        }
        
        if (result.success) {
          if (result.newsItem) {
            localNews = [result.newsItem, ...localNews];
            setNews(localNews);
            // IMMEDIATE STORAGE PERSISTENCE for found news
            Storage.saveNews(localNews);
            newItemsCount++;
          }
          
          const idx = updatedWatchlist.findIndex(w => w.id === show.id);
          if (idx !== -1) {
            updatedWatchlist[idx] = { ...updatedWatchlist[idx], lastChecked: new Date().toISOString() };
            // IMMEDIATE STORAGE PERSISTENCE for watchlist timestamp
            setWatchlist([...updatedWatchlist]);
            Storage.saveWatchlist(updatedWatchlist);
          }
          success = true;
        } else {
          success = true; 
        }
      }
    }

    if (newItemsCount > 0) {
      const msg = currentT.foundUpdates(newItemsCount);
      if (document.hidden) {
        sendSystemNotification('ShowScout AI', msg);
      } else {
        showToast(msg, 'success');
      }
    } else if (!isAuto) {
      showToast(currentT.noNewUpdates, 'info');
    }
    
    if (isAuto) {
      const newSettings = {...currentSettings, lastAutoCheckDate: new Date().toISOString().split('T')[0]};
      setSettings(newSettings);
      Storage.saveSettings(newSettings);
    }
    
    setIsChecking(false);
  }, []);

  // Catch-up and Scheduled Logic
  const handleTimeCheck = useCallback(() => {
    const s = settingsRef.current;
    if (!s.autoCheckTime || !s.apiKey || watchlistRef.current.length === 0 || isCheckingRef.current) return;

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    // Check if we already did it today
    if (s.lastAutoCheckDate === todayStr) return;

    const [h, m] = s.autoCheckTime.split(':').map(Number);
    const scheduledTime = new Date();
    scheduledTime.setHours(h, m, 0, 0);

    if (now >= scheduledTime) {
      console.log("Time triggered: Starting auto-update.");
      checkForUpdates(true);
    }
  }, [checkForUpdates]);

  // Listen for visibility changes to catch up on backgrounded periods
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log("App foregrounded: checking schedule catch-up.");
        handleTimeCheck();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    // Initial mount check
    handleTimeCheck();

    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [handleTimeCheck]);

  // Periodic check while app IS open
  useEffect(() => {
    const interval = setInterval(handleTimeCheck, 60000);
    return () => clearInterval(interval);
  }, [handleTimeCheck]);

  // Group News Logic
  const activeNews = news.filter(n => !n.isArchived);
  const archivedNews = news.filter(n => n.isArchived);

  const groupNews = (items: NewsCardType[]) => {
    const groups: { [key: string]: NewsCardType[] } = {};
    items.forEach(item => {
      if (!groups[item.showTitle]) groups[item.showTitle] = [];
      groups[item.showTitle].push(item);
    });
    return Object.entries(groups);
  };

  const groupedActiveNews = groupNews(activeNews);
  const groupedArchivedNews = groupNews(archivedNews);

  return (
    <div className="min-h-screen pb-24 text-gray-200 font-sans selection:bg-brand-500/30">
      <header className="sticky top-0 z-40 bg-dark-900/80 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
          {t.appTitle}
        </h1>
        <button 
          onClick={() => setShowSettings(true)}
          className="p-2 text-gray-400 hover:text-white transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </header>

      <main className="max-w-2xl mx-auto p-6">
        {isChecking && (
          <div className="mb-8 bg-dark-800 rounded-xl p-4 border border-gray-700 shadow-xl animate-pulse">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-brand-400 font-medium">{t.digging}</span>
              <span className="text-gray-400">{checkProgress.current} / {checkProgress.total}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-brand-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${(checkProgress.current / Math.max(1, checkProgress.total)) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {view === 'inbox' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">{t.latestNews}</h2>
              <button 
                onClick={() => checkForUpdates(false)}
                disabled={isChecking}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
                  ${isChecking 
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                    : 'bg-brand-600 text-white hover:bg-brand-500 shadow-lg shadow-brand-500/20 active:scale-95'
                  }
                `}
              >
                {isChecking ? t.checking : t.checkNow}
              </button>
            </div>

            {activeNews.length === 0 ? (
              <div className="text-center py-20 bg-dark-800/30 rounded-2xl border border-gray-800/50 border-dashed">
                <p className="text-gray-400 text-lg">{t.noNews}</p>
                <p className="text-gray-600 text-sm mt-2">{t.checkWatchlist}</p>
              </div>
            ) : (
              <div className="space-y-8">
                {groupedActiveNews.map(([showTitle, items]) => (
                  <div key={showTitle} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <h3 className="text-lg font-bold text-brand-500 mb-3 px-1 border-l-4 border-brand-500 pl-3">
                      {showTitle}
                    </h3>
                    <div className="grid gap-4">
                      {items.map(item => (
                        <NewsCard 
                          key={item.id} 
                          item={item} 
                          onClick={setSelectedNewsItem}
                          onArchive={handleArchiveNews}
                          onDelete={handleDeleteNews}
                          t={t}
                          locale={locale}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'watchlist' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">{t.yourWatchlist}</h2>
            <WatchlistManager 
              watchlist={watchlist}
              onAdd={handleAddWatchlist}
              onRemove={handleRemoveWatchlist}
              t={t}
              locale={locale}
            />
          </div>
        )}

        {view === 'archive' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">{t.archive}</h2>
            {archivedNews.length === 0 ? (
              <p className="text-gray-500">{t.noArchived}</p>
            ) : (
              <div className="space-y-8 opacity-80">
                {groupedArchivedNews.map(([showTitle, items]) => (
                  <div key={showTitle} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <h3 className="text-lg font-bold text-gray-400 mb-3 px-1 border-l-4 border-gray-600 pl-3">
                      {showTitle}
                    </h3>
                    <div className="grid gap-4">
                      {items.map(item => (
                        <NewsCard 
                          key={item.id} 
                          item={item} 
                          onClick={setSelectedNewsItem} 
                          onArchive={() => {}} 
                          onDelete={handleDeleteNews}
                          t={t}
                          locale={locale}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 w-full bg-dark-950/90 backdrop-blur-lg border-t border-gray-800 z-40 pb-safe">
        <div className="max-w-md mx-auto flex justify-around p-2">
          <button onClick={() => setView('inbox')} className={`flex flex-col items-center p-2 rounded-lg w-full transition ${view === 'inbox' ? 'text-brand-500' : 'text-gray-500'}`}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg><span className="text-[10px] mt-1">{t.inbox}</span></button>
          <button onClick={() => setView('watchlist')} className={`flex flex-col items-center p-2 rounded-lg w-full transition ${view === 'watchlist' ? 'text-brand-500' : 'text-gray-500'}`}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><span className="text-[10px] mt-1">{t.watchlist}</span></button>
          <button onClick={() => setView('archive')} className={`flex flex-col items-center p-2 rounded-lg w-full transition ${view === 'archive' ? 'text-brand-500' : 'text-gray-500'}`}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/></svg><span className="text-[10px] mt-1">{t.archive}</span></button>
        </div>
      </nav>

      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSave={updateSettings}
        t={t}
      />
      
      <NewsDetailModal 
        item={selectedNewsItem}
        onClose={() => setSelectedNewsItem(null)}
        onArchive={handleArchiveNews}
        t={t}
        locale={locale}
      />
      
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
};

export default App;