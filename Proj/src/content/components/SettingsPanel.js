// src/content/components/SettingsPanel.js
import React, { useState, useEffect } from 'react';
import { Settings, Save, X, Plus, Trash2, AlertCircle } from 'lucide-react';

const defaultSettings = {
  processingInterval: 30,
  aiModel: 'gpt-4',
  autoExport: false,
  exportFormat: 'txt',
  categories: ['key-points', 'action-items', 'decisions', 'follow-ups'],
  minimumConfidence: 0.7,
  notificationEnabled: true,
  customPrompt: '',
  language: 'en',
  maxTokens: 2000,
  temperatureValue: 0.7,
  summaryStyle: 'concise',
  highlightKeywords: true,
  autoSave: true,
  saveInterval: 5
};

const SettingsPanel = ({ isOpen, onClose, onSave }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState({});
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const result = await chrome.storage.sync.get('noteSettings');
      if (result.noteSettings) {
        setSettings(prev => ({
          ...prev,
          ...result.noteSettings
        }));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      setErrors(prev => ({
        ...prev,
        loading: 'Failed to load settings. Please try again.'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const validateSettings = () => {
    const newErrors = {};

    if (settings.processingInterval < 5 || settings.processingInterval > 300) {
      newErrors.processingInterval = 'Interval must be between 5 and 300 seconds';
    }

    if (settings.maxTokens < 100 || settings.maxTokens > 4000) {
      newErrors.maxTokens = 'Token limit must be between 100 and 4000';
    }

    if (settings.temperatureValue < 0 || settings.temperatureValue > 1) {
      newErrors.temperatureValue = 'Temperature must be between 0 and 1';
    }

    if (settings.categories.length === 0) {
      newErrors.categories = 'At least one category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateSettings()) {
      setSaveStatus('error');
      return;
    }

    try {
      setSaveStatus('saving');
      await chrome.storage.sync.set({ noteSettings: settings });
      
      // Notify background script of settings update
      await chrome.runtime.sendMessage({
        type: 'SETTINGS_UPDATED',
        payload: settings
      });

      setIsDirty(false);
      setSaveStatus('success');
      if (onSave) onSave(settings);
      
      // Reset save status after 2 seconds
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveStatus('error');
    }
  };

  const handleCategoryAdd = () => {
    const category = prompt('Enter new category name:');
    if (category && !settings.categories.includes(category)) {
      setSettings(prev => ({
        ...prev,
        categories: [...prev.categories, category]
      }));
      setIsDirty(true);
    }
  };

  const handleCategoryRemove = (categoryToRemove) => {
    setSettings(prev => ({
      ...prev,
      categories: prev.categories.filter(category => category !== categoryToRemove)
    }));
    setIsDirty(true);
  };

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-auto">
      <div className="bg-white rounded-lg shadow-xl w-[600px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content */}
        <div className="px-6 py-4 space-y-6">
          {/* AI Model Settings */}
          <section>
            <h3 className="text-lg font-medium mb-4">AI Model Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model
                </label>
                <select
                  value={settings.aiModel}
                  onChange={(e) => handleInputChange('aiModel', e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="claude-2">Claude 2</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Tokens
                </label>
                <input
                  type="number"
                  value={settings.maxTokens}
                  onChange={(e) => handleInputChange('maxTokens', parseInt(e.target.value))}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
                {errors.maxTokens && (
                  <p className="text-red-500 text-sm mt-1">{errors.maxTokens}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temperature
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.temperatureValue}
                  onChange={(e) => handleInputChange('temperatureValue', parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="text-sm text-gray-500 mt-1">
                  {settings.temperatureValue} (Higher = more creative)
                </div>
              </div>
            </div>
          </section>

          {/* Processing Settings */}
          <section>
            <h3 className="text-lg font-medium mb-4">Processing Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Processing Interval (seconds)
                </label>
                <input
                  type="number"
                  value={settings.processingInterval}
                  onChange={(e) => handleInputChange('processingInterval', parseInt(e.target.value))}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
                {errors.processingInterval && (
                  <p className="text-red-500 text-sm mt-1">{errors.processingInterval}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Summary Style
                </label>
                <select
                  value={settings.summaryStyle}
                  onChange={(e) => handleInputChange('summaryStyle', e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="concise">Concise</option>
                  <option value="detailed">Detailed</option>
                  <option value="bullet-points">Bullet Points</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.highlightKeywords}
                  onChange={(e) => handleInputChange('highlightKeywords', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700">
                  Highlight important keywords
                </label>
              </div>
            </div>
          </section>

          {/* Categories */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Note Categories</h3>
              <button
                onClick={handleCategoryAdd}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>
            
            <div className="space-y-2">
              {settings.categories.map(category => (
                <div key={category} 
                     className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <span className="text-gray-700">{category}</span>
                  <button
                    onClick={() => handleCategoryRemove(category)}
                    className="text-red-600 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            {errors.categories && (
              <p className="text-red-500 text-sm mt-2">{errors.categories}</p>
            )}
          </section>

          {/* Custom Prompt */}
          <section>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom AI Prompt Template (Optional)
            </label>
            <textarea
              value={settings.customPrompt}
              onChange={(e) => handleInputChange('customPrompt', e.target.value)}
              placeholder="Enter custom instructions for the AI..."
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
            <p className="text-sm text-gray-500 mt-1">
              Use {'{text}'} as placeholder for meeting content
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-between items-center">
          {saveStatus && (
            <div className={`text-sm ${
              saveStatus === 'success' ? 'text-green-600' : 
              saveStatus === 'error' ? 'text-red-600' : 
              'text-blue-600'
            }`}>
              {saveStatus === 'success' && 'Settings saved successfully'}
              {saveStatus === 'error' && 'Failed to save settings'}
              {saveStatus === 'saving' && 'Saving settings...'}
            </div>
          )}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!isDirty || isLoading || saveStatus === 'saving'}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-white ${
                isDirty && !isLoading && saveStatus !== 'saving'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;