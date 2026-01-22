import React, { useState } from 'react';
import { WatchlistEntry } from '../types';

interface WatchlistManagerProps {
  watchlist: WatchlistEntry[];
  onAdd: (title: string) => void;
  onRemove: (id: string) => void;
}

const WatchlistManager: React.FC<WatchlistManagerProps> = ({ watchlist, onAdd, onRemove }) => {
  const [newTitle, setNewTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      onAdd(newTitle.trim());
      setNewTitle('');
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add Film or TV Series (e.g. Stranger Things)"
          className="w-full bg-dark-800 border border-gray-700 text-white p-4 pl-4 pr-14 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none shadow-lg placeholder-gray-500 transition-all"
        />
        <button 
          type="submit"
          className="absolute right-2 top-2 bottom-2 bg-brand-600 hover:bg-brand-500 text-white px-4 rounded-lg font-medium transition-colors"
        >
          Add
        </button>
      </form>

      <div className="grid grid-cols-1 gap-3">
        {watchlist.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>Your watchlist is empty.</p>
            <p className="text-sm">Add shows to start tracking news.</p>
          </div>
        ) : (
          watchlist.map((entry) => (
            <div 
              key={entry.id} 
              className="group flex items-center justify-between p-4 bg-dark-800/50 border border-gray-800 rounded-xl hover:border-gray-600 transition-all"
            >
              <div>
                <h3 className="font-medium text-gray-200">{entry.title}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Last check: {entry.lastChecked ? new Date(entry.lastChecked).toLocaleString() : 'Never'}
                </p>
              </div>
              <button
                onClick={() => onRemove(entry.id)}
                className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-900/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WatchlistManager;