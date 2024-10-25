/******/ (() => { // webpackBootstrap
/*!**************************************!*\
  !*** ./src/background/background.js ***!
  \**************************************/
// src/background/background.js

chrome.runtime.onInstalled.addListener(function () {
  console.log("Smart Meet Notes: Extension installed and ready.");
});

// Action handlers for messages from popup and content scripts
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'startCapturing') {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'startCapturing'
      }, function (response) {
        sendResponse(response);
      });
    });
    return true; // Keep the message channel open for async response
  } else if (request.action === 'stopCapturing') {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'stopCapturing'
      }, function (response) {
        sendResponse(response);
      });
    });
    return true;
  } else if (request.action === 'getNotes') {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'getNotes'
      }, function (response) {
        sendResponse(response);
      });
    });
    return true;
  } else if (request.action === 'clearNotes') {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'clearNotes'
      }, function (response) {
        sendResponse(response);
      });
    });
    return true;
  }
});
/******/ })()
;
//# sourceMappingURL=background.bundle.js.map