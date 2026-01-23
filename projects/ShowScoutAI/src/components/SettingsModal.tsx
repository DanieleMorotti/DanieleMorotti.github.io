import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { DEFAULT_MODEL } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  t: any; // Translation object
}

// Embedded SVG for US Flag (optimized for icon size)
const FlagUS = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 20" className="w-7 h-auto shadow-sm rounded-sm overflow-hidden ring-1 ring-white/10">
    <rect width="26" height="20" fill="#B22234"/>
    <path d="M0,2H26M0,6H26M0,10H26M0,14H26M0,18H26" stroke="#FFF" strokeWidth="2"/>
    <rect width="12" height="11" fill="#3C3B6E"/>
    <g fill="#FFF">
      <circle cx="2" cy="2.5" r="0.8"/> <circle cx="6" cy="2.5" r="0.8"/> <circle cx="10" cy="2.5" r="0.8"/>
      <circle cx="4" cy="5.5" r="0.8"/> <circle cx="8" cy="5.5" r="0.8"/>
      <circle cx="2" cy="8.5" r="0.8"/> <circle cx="6" cy="8.5" r="0.8"/> <circle cx="10" cy="8.5" r="0.8"/>
    </g>
  </svg>
);

// Embedded SVG for Italian Flag
const FlagIT = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" className="w-7 h-auto shadow-sm rounded-sm overflow-hidden ring-1 ring-white/10">
    <rect width="1" height="2" x="0" fill="#009246"/>
    <rect width="1" height="2" x="1" fill="#FFF"/>
    <rect width="1" height="2" x="2" fill="#CE2B37"/>
  </svg>
);

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave, t }) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof AppSettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => {
        // Only close if the click lands exactly on this outer div (the backdrop),
        // not on the modal content itself.
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-dark-800 border border-dark-900 rounded-xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">{t.settingsTitle}</h2>
          
          <div className="space-y-5">
            {/* API Key */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">{t.apiKeyLabel}</label>
              <input 
                type="password" 
                value={localSettings.apiKey}
                onChange={(e) => handleChange('apiKey', e.target.value)}
                placeholder="Enter your API Key"
                className="w-full bg-dark-950 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-500 outline-none transition"
              />
              <p className="text-xs text-gray-500 mt-1">
                {t.apiKeyDesc}
              </p>
            </div>

            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">{t.languageLabel}</label>
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => handleChange('language', 'EN')}
                  className={`flex-1 flex items-center justify-center gap-3 p-3 rounded-lg border transition-all ${
                    localSettings.language === 'EN' 
                      ? 'bg-brand-900/40 border-brand-500 text-white shadow-brand-500/10 shadow-lg' 
                      : 'bg-dark-950 border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  <FlagUS />
                  <span className="font-medium">English</span>
                </button>
                <button 
                  type="button"
                  onClick={() => handleChange('language', 'IT')}
                  className={`flex-1 flex items-center justify-center gap-3 p-3 rounded-lg border transition-all ${
                    localSettings.language === 'IT' 
                      ? 'bg-brand-900/40 border-brand-500 text-white shadow-brand-500/10 shadow-lg' 
                      : 'bg-dark-950 border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  <FlagIT />
                  <span className="font-medium">Italiano</span>
                </button>
              </div>
            </div>

            {/* Auto Check */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">{t.autoCheckLabel}</label>
              <div className="flex gap-2 items-center">
                <input 
                  type="time" 
                  value={localSettings.autoCheckTime || ''}
                  onChange={(e) => handleChange('autoCheckTime', e.target.value)}
                  className="bg-dark-950 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-500 outline-none transition flex-1"
                />
                {localSettings.autoCheckTime && (
                   <button 
                     onClick={() => handleChange('autoCheckTime', '')}
                     className="text-xs text-red-400 hover:text-red-300 px-2"
                   >
                     {t.clear}
                   </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {t.autoCheckDesc}
              </p>
            </div>

            {/* Model */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">{t.modelLabel}</label>
              <select 
                value={localSettings.model}
                onChange={(e) => handleChange('model', e.target.value)}
                className="w-full bg-dark-950 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-500 outline-none"
              >
                <option value={DEFAULT_MODEL}>{DEFAULT_MODEL} (Recommended)</option>
                <option value="gemini-2.5-flash">gemini-2.5-flash</option>
                <option value="gemini-2.5-flash-lite">gemini-2.5-flash-lite</option>
              </select>
            </div>

            {/* Temperature */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                {t.creativityLabel} ({localSettings.temperature})
              </label>
              <input 
                type="range" 
                min="0" 
                max="2" 
                step="0.1"
                value={localSettings.temperature}
                onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
                className="w-full accent-brand-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{t.strict}</span>
                <span>{t.creative}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-dark-950 p-4 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition"
          >
            {t.cancel}
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-medium transition shadow-lg shadow-brand-500/20"
          >
            {t.saveChanges}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;