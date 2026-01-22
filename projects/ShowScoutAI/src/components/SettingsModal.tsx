import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { DEFAULT_MODEL } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof AppSettings, value: string | number) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-dark-800 border border-dark-900 rounded-xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Settings</h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Gemini API Key</label>
              <input 
                type="password" 
                value={localSettings.apiKey}
                onChange={(e) => handleChange('apiKey', e.target.value)}
                placeholder="Enter your API Key"
                className="w-full bg-dark-950 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-500 outline-none transition"
              />
              <p className="text-xs text-gray-500 mt-1">
                Your key is stored locally on your device.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Daily Auto-Check Time</label>
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
                     Clear
                   </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                The app will check for updates if open at this time (or when opened after this time).
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Model Name</label>
              <select 
                value={localSettings.model}
                onChange={(e) => handleChange('model', e.target.value)}
                className="w-full bg-dark-950 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-500 outline-none"
              >
                <option value={DEFAULT_MODEL}>{DEFAULT_MODEL} (Recommended)</option>
                <option value="gemini-3-pro-preview">gemini-3-pro-preview</option>
                <option value="gemini-2.5-flash-latest">gemini-2.5-flash-latest</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Creativity / Strictness ({localSettings.temperature})
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
                <span>Strict</span>
                <span>Creative</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-dark-950 p-4 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-medium transition shadow-lg shadow-brand-500/20"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
