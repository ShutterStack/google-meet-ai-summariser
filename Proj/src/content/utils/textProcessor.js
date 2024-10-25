// src/content/utils/textProcessor.js

// A list of filler words commonly found in speech
const FILLER_WORDS = ['um', 'uh', 'you know', 'like', 'so', 'actually', 'basically', 'literally'];

/**
 * Removes filler words from text to improve summarization.
 * @param {string} text - The raw caption text.
 * @returns {string} - Cleaned text without filler words.
 */
function removeFillerWords(text) {
    const regex = new RegExp(`\\b(${FILLER_WORDS.join('|')})\\b`, 'gi');
    return text.replace(regex, '').replace(/\s{2,}/g, ' ').trim();
}

/**
 * Splits long text into smaller chunks suitable for processing by the AI.
 * @param {string} text - The text to split.
 * @param {number} maxLength - Maximum length of each chunk.
 * @returns {string[]} - Array of text chunks.
 */
function splitTextIntoChunks(text, maxLength = 500) {
    const words = text.split(' ');
    let chunks = [];
    let chunk = [];

    words.forEach(word => {
        if (chunk.join(' ').length + word.length < maxLength) {
            chunk.push(word);
        } else {
            chunks.push(chunk.join(' '));
            chunk = [word];
        }
    });

    if (chunk.length > 0) {
        chunks.push(chunk.join(' '));
    }

    return chunks;
}

/**
 * Prepares text for summarization by cleaning and chunking.
 * @param {string} text - The raw caption text.
 * @returns {string[]} - Array of cleaned and split text chunks.
 */
function processTextForSummarization(text) {
    const cleanedText = removeFillerWords(text);
    return splitTextIntoChunks(cleanedText);
}

export { removeFillerWords, splitTextIntoChunks, processTextForSummarization };
