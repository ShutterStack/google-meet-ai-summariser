// src/content/content.js
import { findCaptionContainer, areCaptionsVisible, enableCaptions } from './utils/domHelper';
import captionService from './services/captionService';
import storageService from './services/storageService';

(function initializeContentScript() {
    // Enable captions if not already enabled
    if (!areCaptionsVisible()) {
        enableCaptions();
    }

    // Start capturing captions when Google Meet is detected
    if (findCaptionContainer()) {
        console.log("Smart Meet Notes: Captions detected. Starting caption capture...");
        captionService.startCapturing();
    } else {
        console.warn("Smart Meet Notes: Could not detect captions on Google Meet.");
    }

    // Listen for messages from popup or background script to control capturing
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'startCapturing') {
            captionService.startCapturing();
            sendResponse({ status: 'started' });
        } else if (request.action === 'stopCapturing') {
            captionService.stopCapturing();
            sendResponse({ status: 'stopped' });
        } else if (request.action === 'getNotes') {
            const notes = storageService.getNotes();
            sendResponse({ notes });
        } else if (request.action === 'clearNotes') {
            storageService.clearNotes();
            sendResponse({ status: 'cleared' });
        } else {
            sendResponse({ status: 'unknown action' }); // Respond to unknown actions
        }
    });
})();
