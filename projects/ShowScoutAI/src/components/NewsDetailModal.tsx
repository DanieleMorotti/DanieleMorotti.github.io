import React from 'react';
import { NewsCard as NewsCardType } from '../types';

interface NewsDetailModalProps {
  item: NewsCardType | null;
  onClose: () => void;
  onArchive: (id: string) => void;
}

const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ item, onClose, onArchive }) => {
  if (!item) return null;

  // Use robust seed image logic (Picsum)
  const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(item.showTitle)}/800/400`;

  // Render plain text paragraphs
  const renderText = (text: string) => {
     const paragraphs = text.split(/\n\s*\n/);
     return (
        <div className="space-y-4 text-gray-300 leading-relaxed text-base">
           {paragraphs.map((para, idx) => (
             <p key={idx}>{para}</p>
           ))}
        </div>
     );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="relative bg-dark-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl border border-gray-800 animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-md transition"
        >
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        {/* Image */}
        <div className="h-64 w-full relative bg-dark-950">
           <img 
             src={imageUrl} 
             alt={item.showTitle} 
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent" />
           <div className="absolute bottom-0 left-0 p-6">
              <span className="text-sm font-bold uppercase tracking-wider text-brand-500 bg-brand-900/30 border border-brand-500/30 px-3 py-1 rounded-md mb-2 inline-block">
                {item.showTitle}
              </span>
              <h2 className="text-2xl font-bold text-white leading-tight mt-2 text-shadow-lg">
                {item.headline}
              </h2>
           </div>
        </div>

        {/* Content */}
        <div className="p-6">
           <div className="text-xs text-gray-500 mb-6 flex justify-between items-center">
              <span>Detected: {new Date(item.dateFound).toLocaleString()}</span>
           </div>
           
           {renderText(item.summary)}

           {/* Fallback Sources List if links aren't enough */}
           <div className="mt-8 pt-6 border-t border-gray-800">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">All Sources</h4>
              <div className="flex flex-wrap gap-2">
                 {item.sources.map((s, i) => (
                    <a 
                      key={i} 
                      href={s.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs bg-dark-800 hover:bg-dark-700 border border-gray-700 text-gray-400 hover:text-white px-3 py-1 rounded-full transition"
                    >
                      {s.title || new URL(s.uri).hostname}
                    </a>
                 ))}
              </div>
           </div>

           {/* Actions */}
           <div className="mt-8 flex gap-3">
             <button 
               onClick={onClose}
               className="flex-1 px-4 py-3 bg-dark-800 hover:bg-dark-700 text-white rounded-lg font-medium transition"
             >
               Close
             </button>
             {!item.isRead && (
               <button 
                 onClick={() => { onArchive(item.id); onClose(); }}
                 className="flex-1 px-4 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-medium transition"
               >
                 Mark as Read
               </button>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailModal;