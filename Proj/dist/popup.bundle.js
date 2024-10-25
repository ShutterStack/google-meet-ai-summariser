/******/ (() => { // webpackBootstrap
/*!****************************!*\
  !*** ./src/popup/popup.js ***!
  \****************************/
// src/popup/popup.js

// Button references
var startCaptureButton = document.getElementById('startCapture');
var stopCaptureButton = document.getElementById('stopCapture');
var clearNotesButton = document.getElementById('clearNotes');
var notesContainer = document.getElementById('notesContainer');

// Start capturing captions
startCaptureButton.addEventListener('click', function () {
  chrome.runtime.sendMessage({
    action: 'startCapturing'
  }, function (response) {
    console.log(response.status === 'started' ? 'Capturing started' : 'Failed to start capturing');
  });
});

// Stop capturing captions
stopCaptureButton.addEventListener('click', function () {
  chrome.runtime.sendMessage({
    action: 'stopCapturing'
  }, function (response) {
    console.log(response.status === 'stopped' ? 'Capturing stopped' : 'Failed to stop capturing');
  });
});

// Clear all captured notes
clearNotesButton.addEventListener('click', function () {
  chrome.runtime.sendMessage({
    action: 'clearNotes'
  }, function (response) {
    if (response.status === 'cleared') {
      notesContainer.innerHTML = ''; // Clear notes display
      console.log('Notes cleared');
    }
  });
});

// Fetch and display notes when popup opens
chrome.runtime.sendMessage({
  action: 'getNotes'
}, function (response) {
  var notes = response.notes || [];
  displayNotes(notes);
});

// Display notes in the popup
function displayNotes(notes) {
  notesContainer.innerHTML = ''; // Clear current notes
  notes.forEach(function (note) {
    var noteElement = document.createElement('div');
    noteElement.classList.add('note');
    noteElement.textContent = "[".concat(new Date(note.timestamp).toLocaleTimeString(), "] ").concat(note.text);
    notesContainer.appendChild(noteElement);
  });
}
/******/ })()
;
//# sourceMappingURL=popup.bundle.js.map