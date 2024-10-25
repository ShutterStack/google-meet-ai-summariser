// src/background/background.js

chrome.runtime.onInstalled.addListener(() => {
    console.log("Smart Meet Notes: Extension installed and ready.");
});

// Action handlers for messages from popup and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'startCapturing') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'startCapturing' }, response => {
                sendResponse(response);
            });
        });
        return true; // Keep the message channel open for async response
    } else if (request.action === 'stopCapturing') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'stopCapturing' }, response => {
                sendResponse(response);
            });
        });
        return true;
    } else if (request.action === 'getNotes') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'getNotes' }, response => {
                sendResponse(response);
            });
        });
        return true;
    } else if (request.action === 'clearNotes') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'clearNotes' }, response => {
                sendResponse(response);
            });
        });
        return true;
    }
});
