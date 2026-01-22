import React from 'react';
import { NewsCard as NewsCardType } from '../types';

interface NewsCardProps {
  item: NewsCardType;
  onClick: (item: NewsCardType) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ item, onClick, onArchive, onDelete }) => {
  // Use robust seed image logic (Picsum)
  const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(item.showTitle)}/400/250`;

  return (
    <div 
      className={`
        group relative overflow-hidden rounded-xl border border-gray-800 bg-dark-800 shadow-lg 
        hover:border-gray-600 transition-all duration-300 cursor-pointer flex
        ${!item.isRead ? 'ring-1 ring-brand-500/30' : ''}
      `}
      onClick={() => onClick(item)}
    >
      {/* Small Image on Left */}
      <div className="w-32 sm:w-40 shrink-0 relative overflow-hidden bg-dark-900">
        <img 
          src={imageUrl} 
          alt={item.showTitle} 
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
        <div>
          <h3 className="text-base font-semibold text-white leading-tight mb-2 line-clamp-2 group-hover:text-brand-400 transition-colors">
            {item.headline}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2">
            {item.summary}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-600">
             {new Date(item.dateFound).toLocaleDateString()}
          </span>
          
          <div className="flex gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
              className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-900/10 rounded transition"
              title="Delete"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
            {!item.isArchived && (
              <button 
                onClick={(e) => { e.stopPropagation(); onArchive(item.id); }}
                className="p-1.5 text-gray-600 hover:text-brand-400 hover:bg-brand-900/10 rounded transition"
                title="Mark as Read"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;