import React, { useState, useEffect, useCallback } from 'react';
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

  // Persistence Effects
  useEffect(() => Storage.saveSettings(settings), [settings]);
  useEffect(() => Storage.saveWatchlist(watchlist), [watchlist]);
  useEffect(() => Storage.saveNews(news), [news]);

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
    showToast(`Added "${title}" to watchlist`, 'success');
  };

  const handleRemoveWatchlist = (id: string) => {
    setWatchlist(watchlist.filter(w => w.id !== id));
  };

  const handleArchiveNews = (id: string) => {
    setNews(news.map(n => n.id === id ? { ...n, isRead: true, isArchived: true } : n));
  };

  const handleDeleteNews = (id: string) => {
    setNews(news.filter(n => n.id !== id));
  };

  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    showToast('Settings saved', 'success');
  };
  
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({ message, type });
  };

  // Helper to trigger system notification
  const sendSystemNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: './showscout_icon_192.png',
          tag: 'showscout-updates'
        });
      } catch (e) {
        console.error("Notification failed", e);
      }
    }
  };

  // The AI Core Logic
  const checkForUpdates = useCallback(async (isAuto = false) => {
    if (watchlist.length === 0) {
      if (!isAuto) {
        showToast("Add shows to your watchlist first!", "error");
        setView('watchlist');
      }
      return;
    }
    if (!settings.apiKey) {
      if (!isAuto) setShowSettings(true);
      return;
    }

    setIsChecking(true);
    setCheckProgress({ current: 0, total: watchlist.length });

    const newNewsItems: NewsCardType[] = [];
    const updatedWatchlist = [...watchlist];

    for (let i = 0; i < watchlist.length; i++) {
      const show = watchlist[i];
      setCheckProgress({ current: i + 1, total: watchlist.length });
      
      const existingHeadlines = news
        .filter(n => n.showTitle === show.title)
        .map(n => n.headline);

      const result = await GeminiService.fetchUpdatesForShow(
        show.title, 
        show.lastChecked, 
        existingHeadlines, 
        settings
      );
      
      if (result.success && result.newsItem) {
        newNewsItems.push(result.newsItem);
      }
      
      updatedWatchlist[i] = { ...show, lastChecked: new Date().toISOString() };
    }

    setWatchlist(updatedWatchlist);

    // Notifications and Toasts logic
    if (newNewsItems.length > 0) {
      setNews(prev => [...newNewsItems, ...prev]);

      const msg = `Found ${newNewsItems.length} new updates!`;
      const finalMsg = isAuto ? `Daily Check: ${msg}` : msg;

      // Determine delivery method
      const isHidden = document.hidden;
      const hasPermission = 'Notification' in window && Notification.permission === 'granted';

      if (isHidden && hasPermission) {
        // User is in another app AND allowed notifications -> Send System Notification
        sendSystemNotification('ShowScout AI', finalMsg);
      } else {
        // User is looking at the app OR didn't allow notifications -> Show In-App Toast
        showToast(finalMsg, 'success');
      }
    } else {
      const msg = `No new updates found!`;
      const finalMsg = isAuto ? `Daily Check: ${msg}` : msg;

      // Determine delivery method
      const isHidden = document.hidden;
      const hasPermission = 'Notification' in window && Notification.permission === 'granted';

      if (isHidden && hasPermission) {
        // User is in another app AND allowed notifications -> Send System Notification
        sendSystemNotification('ShowScout AI', finalMsg);
      } else {
        // User is looking at the app OR didn't allow notifications -> Show In-App Toast
        showToast(finalMsg, 'info');
      }
    }
    
    // Update last auto check date if this was an auto run
    if (isAuto) {
      setSettings(prev => ({...prev, lastAutoCheckDate: new Date().toISOString().split('T')[0]}));
    }
    
    setIsChecking(false);
  }, [watchlist, settings, news]);

  // Auto-Check Logic
  useEffect(() => {
    if (!settings.autoCheckTime || !settings.apiKey || watchlist.length === 0) return;

    const interval = setInterval(() => {
      const now = new Date();
      const todayDateString = now.toISOString().split('T')[0];

      const [schedHour, schedMin] = settings.autoCheckTime.split(':').map(Number);
      const schedTimeInMinutes = schedHour * 60 + schedMin;
      const curTimeInMinutes = now.getHours() * 60 + now.getMinutes();

      if (curTimeInMinutes >= schedTimeInMinutes && settings.lastAutoCheckDate !== todayDateString && !isChecking) {
        console.log("Auto-checking for updates...");
        checkForUpdates(true);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [settings.autoCheckTime, settings.lastAutoCheckDate, settings.apiKey, watchlist.length, isChecking, checkForUpdates]);


  // Group News Logic
  const activeNews = news.filter(n => !n.isArchived);
  const archivedNews = news.filter(n => n.isArchived);

  // Helper to group items by showTitle
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
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-dark-900/80 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
          ShowScout AI
        </h1>
        <button 
          onClick={() => setShowSettings(true)}
          className="p-2 text-gray-400 hover:text-white transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="max-w-2xl mx-auto p-6">
        
        {/* Progress Bar for Update Check */}
        {isChecking && (
          <div className="mb-8 bg-dark-800 rounded-xl p-4 border border-gray-700 shadow-xl animate-pulse">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-brand-400 font-medium">Digging for news ...</span>
              <span className="text-gray-400">{checkProgress.current} / {checkProgress.total}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-brand-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${(checkProgress.current / checkProgress.total) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {view === 'inbox' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Latest News</h2>
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
                {isChecking ? 'Checking...' : 'Check Now'}
              </button>
            </div>

            {activeNews.length === 0 ? (
              <div className="text-center py-20 bg-dark-800/30 rounded-2xl border border-gray-800/50 border-dashed">
                <p className="text-gray-400 text-lg">No new updates found.</p>
                <p className="text-gray-600 text-sm mt-2">Check your watchlist or try refreshing.</p>
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
            <h2 className="text-2xl font-bold text-white mb-6">Your Watchlist</h2>
            <WatchlistManager 
              watchlist={watchlist}
              onAdd={handleAddWatchlist}
              onRemove={handleRemoveWatchlist}
            />
          </div>
        )}

        {view === 'archive' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">Archive</h2>
            {archivedNews.length === 0 ? (
              <p className="text-gray-500">No archived news.</p>
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
                          onClick={setSelectedNewsItem} // Can still view archived news
                          onArchive={() => {}} // Already archived
                          onDelete={handleDeleteNews}
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

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-dark-950/90 backdrop-blur-lg border-t border-gray-800 z-40 pb-safe">
        <div className="max-w-md mx-auto flex justify-around p-2">
          <button 
            onClick={() => setView('inbox')}
            className={`flex flex-col items-center p-2 rounded-lg w-full transition ${view === 'inbox' ? 'text-brand-500' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            <span className="text-[10px] font-medium mt-1">Inbox</span>
          </button>
          
          <button 
            onClick={() => setView('watchlist')}
            className={`flex flex-col items-center p-2 rounded-lg w-full transition ${view === 'watchlist' ? 'text-brand-500' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span className="text-[10px] font-medium mt-1">Watchlist</span>
          </button>

          <button 
            onClick={() => setView('archive')}
            className={`flex flex-col items-center p-2 rounded-lg w-full transition ${view === 'archive' ? 'text-brand-500' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/></svg>
            <span className="text-[10px] font-medium mt-1">Archive</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSave={updateSettings}
      />
      
      <NewsDetailModal 
        item={selectedNewsItem}
        onClose={() => setSelectedNewsItem(null)}
        onArchive={handleArchiveNews}
      />
      
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

    </div>
  );
};

export default App;