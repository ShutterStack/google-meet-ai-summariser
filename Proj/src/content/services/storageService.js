// src/content/services/storageService.js

class StorageService {
    constructor() {
        this.notesKey = 'smartMeetNotes';
    }

    /**
     * Save a note to storage.
     * @param {string} note - The note text to save.
     */
    saveNote(note) {
        const notes = this.getNotes();
        notes.push({ text: note, timestamp: new Date().toISOString() });
        localStorage.setItem(this.notesKey, JSON.stringify(notes));
    }

    /**
     * Retrieve all saved notes.
     * @returns {Array} - Array of saved notes.
     */
    getNotes() {
        const notes = localStorage.getItem(this.notesKey);
        return notes ? JSON.parse(notes) : [];
    }

    /**
     * Clear all saved notes.
     */
    clearNotes() {
        localStorage.removeItem(this.notesKey);
    }
}

export default new StorageService();
