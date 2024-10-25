// src/content/services/captionService.js

import aiService from './aiService';
import storageService from './storageService';

class CaptionService {
    constructor() {
        this.captionContainer = null;
        this.isCapturing = false;
        this.currentText = '';
        this.init();
    }

    // Initialize by setting up caption monitoring
    init() {
        this.findCaptionContainer();
        if (this.captionContainer) {
            this.startCapturing();
        } else {
            console.warn('Caption container not found.');
        }
    }

    // Locate the caption container within the Google Meet DOM
    findCaptionContainer() {
        this.captionContainer = document.querySelector('[class*="caption-text"]');
    }

    // Start listening for caption updates
    startCapturing() {
        this.isCapturing = true;
        this.monitorCaptions();
    }

    // Stop capturing captions
    stopCapturing() {
        this.isCapturing = false;
    }

    // Monitor the caption container for new text in real-time
    async monitorCaptions() {
        const observer = new MutationObserver(async () => {
            if (!this.isCapturing) return;

            const newText = this.captionContainer.innerText.trim();
            if (newText !== this.currentText) {
                this.currentText = newText;
                const summary = await aiService.summarizeText(newText);
                if (summary) {
                    storageService.saveNote(summary);
                    console.log('Captured and summarized:', summary);
                }
            }
        });

        observer.observe(this.captionContainer, {
            childList: true,
            subtree: true,
            characterData: true,
        });
    }
}

export default new CaptionService();
