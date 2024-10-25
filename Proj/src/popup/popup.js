// src/popup/popup.js

// Button references
const startCaptureButton = document.getElementById('startCapture');
const stopCaptureButton = document.getElementById('stopCapture');
const clearNotesButton = document.getElementById('clearNotes');
const notesContainer = document.getElementById('notesContainer');

// Start capturing captions
startCaptureButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'startCapturing' }, response => {
        console.log(response.status === 'started' ? 'Capturing started' : 'Failed to start capturing');
    });
});

// Stop capturing captions
stopCaptureButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'stopCapturing' }, response => {
        console.log(response.status === 'stopped' ? 'Capturing stopped' : 'Failed to stop capturing');
    });
});

// Clear all captured notes
clearNotesButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'clearNotes' }, response => {
        if (response.status === 'cleared') {
            notesContainer.innerHTML = ''; // Clear notes display
            console.log('Notes cleared');
        }
    });
});

// Fetch and display notes when popup opens
chrome.runtime.sendMessage({ action: 'getNotes' }, response => {
    const notes = response.notes || [];
    displayNotes(notes);
});

// Display notes in the popup
function displayNotes(notes) {
    notesContainer.innerHTML = ''; // Clear current notes
    notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.classList.add('note');
        noteElement.textContent = `[${new Date(note.timestamp).toLocaleTimeString()}] ${note.text}`;
        notesContainer.appendChild(noteElement);
    });
}
