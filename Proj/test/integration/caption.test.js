// src/test/integration/caption.test.js

import captionService from '../../content/services/captionService';
import aiService from '../../content/services/aiService';
import storageService from '../../content/services/storageService';

jest.mock('../../content/services/aiService');
jest.mock('../../content/services/storageService');

describe('captionService', () => {
    let mockCaptionContainer;

    beforeAll(() => {
        // Setup a mock DOM element to simulate the caption container
        mockCaptionContainer = document.createElement('div');
        mockCaptionContainer.className = 'caption-text';
        document.body.appendChild(mockCaptionContainer);
        
        // Mock findCaptionContainer method in captionService to use mock element
        jest.spyOn(captionService, 'findCaptionContainer').mockReturnValue(mockCaptionContainer);
    });

    afterAll(() => {
        // Clean up by removing the mock element
        document.body.removeChild(mockCaptionContainer);
    });

    beforeEach(() => {
        jest.clearAllMocks();
        captionService.stopCapturing(); // Ensure capturing is stopped between tests
    });

    describe('startCapturing', () => {
        it('should start capturing captions and process them', async () => {
            // Mock aiService to resolve with a sample summary
            aiService.summarizeText.mockResolvedValue('This is a summarized text.');

            // Spy on storageService to verify if saveNote is called
            const saveNoteSpy = jest.spyOn(storageService, 'saveNote');

            captionService.startCapturing();

            // Simulate caption text mutation
            mockCaptionContainer.innerText = 'This is some new caption text.';
            await new Promise(resolve => setTimeout(resolve, 50)); // Wait for observer

            expect(aiService.summarizeText).toHaveBeenCalledWith('This is some new caption text.');
            expect(saveNoteSpy).toHaveBeenCalledWith('This is a summarized text.');
        });
    });

    describe('stopCapturing', () => {
        it('should stop capturing captions', () => {
            // Start capturing first, then stop
            captionService.startCapturing();
            captionService.stopCapturing();

            // Simulate changing caption text and ensure no processing occurs
            mockCaptionContainer.innerText = 'This text should not be captured.';
            expect(aiService.summarizeText).not.toHaveBeenCalled();
        });
    });

    describe('monitorCaptions', () => {
        it('should capture unique captions only', async () => {
            aiService.summarizeText.mockResolvedValue('Unique summary');

            // Start capturing and set initial text
            captionService.startCapturing();
            mockCaptionContainer.innerText = 'Unique caption text.';
            await new Promise(resolve => setTimeout(resolve, 50));

            // Change to new unique text and verify
            mockCaptionContainer.innerText = 'Another unique caption text.';
            await new Promise(resolve => setTimeout(resolve, 50));

            expect(aiService.summarizeText).toHaveBeenCalledTimes(2);
        });

        it('should not reprocess identical captions', async () => {
            aiService.summarizeText.mockResolvedValue('Repeated summary');

            captionService.startCapturing();

            // Set caption text and verify processing
            mockCaptionContainer.innerText = 'Repeated caption text.';
            await new Promise(resolve => setTimeout(resolve, 50));

            // Set the same text again and ensure no reprocessing
            mockCaptionContainer.innerText = 'Repeated caption text.';
            await new Promise(resolve => setTimeout(resolve, 50));

            expect(aiService.summarizeText).toHaveBeenCalledTimes(1);
        });
    });
});
