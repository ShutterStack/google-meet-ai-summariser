// src/test/unit/textProcessor.test.js

import { removeFillerWords, splitTextIntoChunks, processTextForSummarization } from '../../content/utils/textProcessor';

describe('textProcessor.js', () => {
    
    describe('removeFillerWords', () => {
        it('should remove filler words from text', () => {
            const inputText = 'Um, this is basically a test, you know, for actually removing filler words.';
            const expectedOutput = 'this is a test, for removing filler words.';
            expect(removeFillerWords(inputText)).toBe(expectedOutput);
        });

        it('should handle empty strings gracefully', () => {
            const inputText = '';
            expect(removeFillerWords(inputText)).toBe('');
        });
    });

    describe('splitTextIntoChunks', () => {
        it('should split long text into chunks of specified length', () => {
            const inputText = 'This is a sample text meant to be split into smaller chunks for testing.';
            const chunkLength = 20;
            const expectedOutput = [
                'This is a sample text',
                'meant to be split into',
                'smaller chunks for',
                'testing.'
            ];
            expect(splitTextIntoChunks(inputText, chunkLength)).toEqual(expectedOutput);
        });

        it('should return the entire text as one chunk if length is short', () => {
            const inputText = 'Short text';
            const chunkLength = 50;
            expect(splitTextIntoChunks(inputText, chunkLength)).toEqual([inputText]);
        });

        it('should handle empty strings gracefully', () => {
            const inputText = '';
            expect(splitTextIntoChunks(inputText, 10)).toEqual(['']);
        });
    });

    describe('processTextForSummarization', () => {
        it('should remove filler words and split text into chunks', () => {
            const inputText = 'Um, this is actually a long text meant for testing, you know, to be split into chunks.';
            const chunkLength = 20;
            const expectedOutput = [
                'this is a long text',
                'meant for testing,',
                'to be split into',
                'chunks.'
            ];
            expect(processTextForSummarization(inputText, chunkLength)).toEqual(expectedOutput);
        });

        it('should handle short text with no filler words correctly', () => {
            const inputText = 'This is a test';
            expect(processTextForSummarization(inputText)).toEqual([inputText]);
        });
    });

});
