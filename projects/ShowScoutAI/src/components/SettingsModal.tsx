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

const FlagIT = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" className="w-7 h-auto shadow-sm rounded-sm overflow-hidden ring-1 ring-white/10">
    <rect width="1" height="2" x="0" fill="#009246"/>
    <rect width="1" height="2" x="1" fill="#FFF"/>
    <rect width="1" height="2" x="2" fill="#CE2B37"/>
  </svg>
);

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave, t }) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  );

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

  const requestNotifPermission = async () => {
    if (!('Notification' in window)) return;
    const permission = await Notification.requestPermission();
    setNotifPermission(permission);
    if (permission === 'granted') {
       new Notification("ShowScout AI", { body: "Notifications enabled successfully!" });
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => {
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
              <p className="text-xs text-gray-500 mt-1">{t.apiKeyDesc}</p>
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
                      ? 'bg-brand-900/40 border-brand-500 text-white' 
                      : 'bg-dark-950 border-gray-700 text-gray-400'
                  }`}
                >
                  <FlagUS /> <span className="font-medium">English</span>
                </button>
                <button 
                  type="button"
                  onClick={() => handleChange('language', 'IT')}
                  className={`flex-1 flex items-center justify-center gap-3 p-3 rounded-lg border transition-all ${
                    localSettings.language === 'IT' 
                      ? 'bg-brand-900/40 border-brand-500 text-white' 
                      : 'bg-dark-950 border-gray-700 text-gray-400'
                  }`}
                >
                  <FlagIT /> <span className="font-medium">Italiano</span>
                </button>
              </div>
            </div>

            {/* Notifications Button */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Push Notifications</label>
              <button
                onClick={requestNotifPermission}
                className={`w-full p-3 rounded-lg border flex items-center justify-center gap-2 transition ${
                  notifPermission === 'granted'
                    ? 'bg-green-900/20 border-green-500/50 text-green-400 cursor-default'
                    : 'bg-dark-950 border-gray-700 text-gray-300 hover:border-brand-500'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                <span className="font-medium">
                  {notifPermission === 'granted' ? t.notificationsActive : (notifPermission === 'denied' ? t.notificationsBlocked : t.enableNotifications)}
                </span>
              </button>
            </div>

            {/* Auto Check */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">{t.autoCheckLabel}</label>
              <div className="flex gap-2 items-center">
                <input 
                  type="time" 
                  value={localSettings.autoCheckTime || ''}
                  onChange={(e) => handleChange('autoCheckTime', e.target.value)}
                  className="bg-dark-950 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-500 flex-1"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{t.autoCheckDesc}</p>
            </div>

            {/* Model */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">{t.modelLabel}</label>
              <select 
                value={localSettings.model}
                onChange={(e) => handleChange('model', e.target.value)}
                className="w-full bg-dark-950 border border-gray-700 rounded-lg p-3 text-white"
              >
                <option value={DEFAULT_MODEL}>{DEFAULT_MODEL}</option>
                <option value="gemini-2.5-flash">gemini-2.5-flash</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-dark-950 p-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-400">{t.cancel}</button>
          <button onClick={handleSave} className="px-6 py-2 bg-brand-600 text-white rounded-lg font-medium">{t.saveChanges}</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;