// src/content/components/NotesPanel.js
import React, { useState, useEffect } from 'react';
import ProcessingIndicator from './ProcessingIndicator';

const NotesPanel = () => {
  const [notes, setNotes] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Listen for notes updates from the background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'UPDATE_NOTES') {
        setNotes(prevNotes => [...prevNotes, message.payload]);
        setIsProcessing(false);
      }
      if (message.type === 'PROCESSING_STATUS') {
        setIsProcessing(message.payload.isProcessing);
      }
    });

    // Load existing notes from storage
    chrome.storage.local.get(['meetingNotes'], (result) => {
      if (result.meetingNotes) {
        setNotes(result.meetingNotes);
      }
    });
  }, []);

  const handleExport = async () => {
    const notesText = notes.map(note => `
      Time: ${note.timestamp}
      Category: ${note.category}
      Content: ${note.content}
      Action Items: ${note.actionItems.join(', ')}
      ---
    `).join('\n');

    // Create blob and download
    const blob = new Blob([notesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-notes-${new Date().toISOString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all notes?')) {
      setNotes([]);
      chrome.storage.local.set({ meetingNotes: [] });
    }
  };

  const filteredNotes = selectedCategory === 'all' 
    ? notes 
    : notes.filter(note => note.category === selectedCategory);

  const categories = ['all', ...new Set(notes.map(note => note.category))];

  return (
    <div className={`fixed right-0 top-0 h-full bg-white shadow-lg transition-all duration-300 ${
      isMinimized ? 'w-12' : 'w-96'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-blue-600 text-white">
        {!isMinimized && <h2 className="text-lg font-semibold">Meeting Notes</h2>}
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="p-1 hover:bg-blue-700 rounded"
        >
          {isMinimized ? '➡️' : '⬅️'}
        </button>
      </div>

      {!isMinimized && (
        <>
          {/* Processing Status */}
          {isProcessing && <ProcessingIndicator />}

          {/* Category Filter */}
          <div className="px-4 py-2 border-b">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Notes List */}
          <div className="h-[calc(100%-12rem)] overflow-y-auto px-4 py-2">
            {filteredNotes.map((note, index) => (
              <div key={index} className="mb-4 p-3 bg-gray-50 rounded shadow">
                <div className="text-sm text-gray-500">{note.timestamp}</div>
                <div className="font-medium text-blue-600">{note.category}</div>
                <div className="mt-2">{note.content}</div>
                {note.actionItems.length > 0 && (
                  <div className="mt-2">
                    <div className="font-medium text-gray-700">Action Items:</div>
                    <ul className="list-disc list-inside">
                      {note.actionItems.map((item, i) => (
                        <li key={i} className="text-sm">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
            <div className="flex justify-between gap-2">
              <button
                onClick={handleExport}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Export Notes
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Clear
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotesPanel;