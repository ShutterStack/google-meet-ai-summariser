// src/content/services/aiService.js

import axios from 'axios';
import { processTextForSummarization } from '../utils/textProcessor';

class AIService {
    constructor() {
        this.apiUrl = process.env.AI_API_URL; // URL of the summarization API
    }

    /**
     * Summarize captions in real-time to extract important points.
     * @param {string} text - The text to be summarized.
     * @returns {Promise<string>} - A promise that resolves with summarized text.
     */
    async summarizeText(text) {
        try {
            // Preprocess the text before sending to API
            const preprocessedText = processTextForSummarization(text);
            
            // Send request to AI summarization API
            const response = await axios.post(`${this.apiUrl}/summarize`, {
                text: preprocessedText,
            });

            // Check if the API returned a valid response
            if (response && response.data && response.data.summary) {
                return response.data.summary;
            } else {
                console.error('Invalid response from AI summarization API');
                return '';
            }
        } catch (error) {
            console.error('Error while summarizing text:', error);
            return '';
        }
    }
}

export default new AIService();
    