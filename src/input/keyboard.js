/**
 * Keyboard Input Handler
 * Maps physical keyboard to musical notes
 */

import { getNoteForKey, isNoteKey } from '../audio/noteMap.js';
import { playNote, stopNote } from '../audio/audioEngine.js';

// Track currently pressed keys to prevent retrigger
const pressedKeys = new Set();

// Callbacks for UI updates
let onNoteOn = null;
let onNoteOff = null;

/**
 * Normalize key for consistent mapping
 * @param {string} key - Raw key from event
 * @returns {string} Normalized key
 */
function normalizeKey(key) {
  // Keep special keys as-is (Backspace, etc.)
  if (key.length > 1) return key;
  // Lowercase single character keys
  return key.toLowerCase();
}

/**
 * Initialize keyboard input handling
 * @param {object} callbacks - Optional callbacks for UI updates
 */
export function initKeyboard(callbacks = {}) {
  onNoteOn = callbacks.onNoteOn || null;
  onNoteOff = callbacks.onNoteOff || null;
  
  // Add event listeners
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  
  // Handle window blur (release all keys)
  window.addEventListener('blur', releaseAllKeys);
}

/**
 * Clean up keyboard input handling
 */
export function destroyKeyboard() {
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
  window.removeEventListener('blur', releaseAllKeys);
  
  releaseAllKeys();
}

/**
 * Handle key down events
 * @param {KeyboardEvent} event 
 */
function handleKeyDown(event) {
  // Ignore if modifier keys are held (allow browser shortcuts)
  if (event.metaKey || event.ctrlKey || event.altKey) return;
  
  const key = normalizeKey(event.key);
  
  // Check if this is a note key
  if (!isNoteKey(key)) return;
  
  // Prevent retrigger if already pressed
  if (pressedKeys.has(key)) return;
  
  // Prevent default browser behavior for these keys
  event.preventDefault();
  
  // Get note data
  const noteData = getNoteForKey(key);
  if (!noteData) return;
  
  // Track as pressed
  pressedKeys.add(key);
  
  // Play the note
  playNote(key, noteData.frequency);
  
  // Notify UI
  if (onNoteOn) {
    onNoteOn(key, noteData);
  }
}

/**
 * Handle key up events
 * @param {KeyboardEvent} event 
 */
function handleKeyUp(event) {
  const key = normalizeKey(event.key);
  
  // Check if this key was being tracked
  if (!pressedKeys.has(key)) return;
  
  // Remove from pressed keys
  pressedKeys.delete(key);
  
  // Stop the note
  stopNote(key);
  
  // Notify UI
  if (onNoteOff) {
    const noteData = getNoteForKey(key);
    onNoteOff(key, noteData);
  }
}

/**
 * Release all currently pressed keys
 */
function releaseAllKeys() {
  for (const key of pressedKeys) {
    stopNote(key);
    
    if (onNoteOff) {
      const noteData = getNoteForKey(key);
      onNoteOff(key, noteData);
    }
  }
  
  pressedKeys.clear();
}

/**
 * Check if a key is currently pressed
 * @param {string} key 
 * @returns {boolean}
 */
export function isKeyPressed(key) {
  return pressedKeys.has(normalizeKey(key));
}

/**
 * Get all currently pressed keys
 * @returns {string[]}
 */
export function getPressedKeys() {
  return Array.from(pressedKeys);
}
