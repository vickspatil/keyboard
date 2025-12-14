/**
 * Main Application Bootstrap
 * Musical Keyboard Visualizer
 */

import { resumeAudioContext, isAudioReady } from './audio/audioEngine.js';
import { initKeyboard, isKeyPressed } from './input/keyboard.js';
import { initVisualEngine, startRenderLoop, visualSettings, updateVisualSettings } from './visuals/visualEngine.js';
import { 
  KEY_TO_NOTE, 
  ALL_OCTAVES, 
  getKeyLabel, 
  getOctaveOffset, 
  setOctaveOffset,
  octaveUp, 
  octaveDown, 
  resetOctave,
  getOctaveOffsetRange 
} from './audio/noteMap.js';

// DOM Elements
const startOverlay = document.getElementById('start-overlay');
const canvas = document.getElementById('canvas');
const keyboardUI = document.getElementById('keyboard-ui');
const settingsPanel = document.getElementById('settings-panel');
const octaveControls = document.getElementById('octave-controls');

// App state
let isInitialized = false;

/**
 * Initialize the application
 */
async function init() {
  if (isInitialized) return;
  
  try {
    // Resume audio context (required after user interaction)
    await resumeAudioContext();
    
    // Initialize visual engine
    initVisualEngine(canvas);
    
    // Initialize keyboard with UI callbacks
    initKeyboard({
      onNoteOn: handleNoteOn,
      onNoteOff: handleNoteOff
    });
    
    // Build keyboard UI
    buildKeyboardUI();
    
    // Build octave controls
    buildOctaveControls();
    
    // Build settings UI
    buildSettingsUI();
    
    // Add keyboard shortcuts for octave shifting
    setupOctaveKeyboardShortcuts();
    
    // Start render loop
    startRenderLoop();
    
    // Hide start overlay
    startOverlay.style.display = 'none';
    
    isInitialized = true;
    
    console.log('🎹 Musical Keyboard Visualizer initialized - 4 octaves with pitch shift ready!');
  } catch (error) {
    console.error('Failed to initialize:', error);
  }
}

/**
 * Build the on-screen keyboard UI with 4 octaves in piano layout
 */
function buildKeyboardUI() {
  keyboardUI.innerHTML = '';
  
  // Create a piano-style layout with all octaves in a row
  const pianoContainer = document.createElement('div');
  pianoContainer.className = 'piano-container';
  pianoContainer.id = 'piano-container';
  
  // Build each octave
  ALL_OCTAVES.forEach((octaveData, octaveIndex) => {
    const octaveDiv = document.createElement('div');
    octaveDiv.className = 'octave';
    octaveDiv.dataset.octave = octaveData.name;
    octaveDiv.dataset.baseOctave = octaveData.baseOctave;
    
    // Add octave label (will be updated when offset changes)
    const label = document.createElement('span');
    label.className = 'octave-label';
    label.id = `octave-label-${octaveIndex}`;
    label.textContent = octaveData.name;
    octaveDiv.appendChild(label);
    
    // Create white keys container
    const whiteKeysDiv = document.createElement('div');
    whiteKeysDiv.className = 'white-keys';
    
    // Create black keys container
    const blackKeysDiv = document.createElement('div');
    blackKeysDiv.className = 'black-keys';
    
    // Separate white and black keys
    const whiteKeys = octaveData.layout.filter(k => !k.isBlack);
    const blackKeys = octaveData.layout.filter(k => k.isBlack);
    
    // Add white keys
    whiteKeys.forEach((keyData) => {
      const noteData = KEY_TO_NOTE[keyData.key];
      const keyElement = document.createElement('div');
      keyElement.className = 'key white';
      keyElement.id = `key-${normalizeKeyId(keyData.key)}`;
      keyElement.dataset.baseNote = noteData.note;
      keyElement.dataset.baseOctave = noteData.octave;
      keyElement.innerHTML = `
        <span class="note-label" data-note="${noteData.note}" data-octave="${noteData.octave}">${noteData.note}${noteData.octave}</span>
        <span class="key-label">${getKeyLabel(keyData.key)}</span>
      `;
      whiteKeysDiv.appendChild(keyElement);
    });
    
    // Add black keys with proper positioning
    blackKeys.forEach((keyData) => {
      const noteData = KEY_TO_NOTE[keyData.key];
      const keyElement = document.createElement('div');
      keyElement.className = 'key black';
      keyElement.id = `key-${normalizeKeyId(keyData.key)}`;
      // Position based on which white key it's after (36px white key + 1px gap = 37px)
      keyElement.style.left = `${(keyData.position) * 37 + 24}px`;
      keyElement.innerHTML = `
        <span class="key-label">${getKeyLabel(keyData.key)}</span>
      `;
      blackKeysDiv.appendChild(keyElement);
    });
    
    octaveDiv.appendChild(blackKeysDiv);
    octaveDiv.appendChild(whiteKeysDiv);
    pianoContainer.appendChild(octaveDiv);
  });
  
  keyboardUI.appendChild(pianoContainer);
}

/**
 * Normalize key ID for use in DOM element IDs
 */
function normalizeKeyId(key) {
  if (key === '\\') return 'backslash';
  if (key === 'Backspace') return 'backspace';
  if (key === "'") return 'quote';
  if (key === ';') return 'semicolon';
  if (key === '`') return 'backtick';
  if (key === ',') return 'comma';
  if (key === '.') return 'period';
  if (key === '/') return 'slash';
  if (key === '[') return 'lbracket';
  if (key === ']') return 'rbracket';
  return key;
}

/**
 * Build octave shift controls
 */
function buildOctaveControls() {
  const range = getOctaveOffsetRange();
  const offset = getOctaveOffset();
  
  octaveControls.innerHTML = `
    <button class="octave-btn" id="octave-down" title="Shift Down (Arrow Down)">▼</button>
    <div class="octave-display">
      <span class="octave-offset" id="octave-offset">${offset >= 0 ? '+' : ''}${offset}</span>
      <span class="octave-range" id="octave-range">C${2 + offset} - C${6 + offset}</span>
    </div>
    <button class="octave-btn" id="octave-up" title="Shift Up (Arrow Up)">▲</button>
    <button class="octave-reset" id="octave-reset" title="Reset (Home)">⌂</button>
  `;
  
  // Octave down button
  document.getElementById('octave-down').addEventListener('click', () => {
    handleOctaveChange(octaveDown());
  });
  
  // Octave up button
  document.getElementById('octave-up').addEventListener('click', () => {
    handleOctaveChange(octaveUp());
  });
  
  // Reset button
  document.getElementById('octave-reset').addEventListener('click', () => {
    handleOctaveChange(resetOctave());
  });
  
  updateOctaveDisplay();
}

/**
 * Setup keyboard shortcuts for octave shifting
 */
function setupOctaveKeyboardShortcuts() {
  window.addEventListener('keydown', (event) => {
    // Only handle octave shortcuts if initialized
    if (!isInitialized) return;
    
    // Ignore if a note key or modifier
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    
    switch (event.key) {
      case 'ArrowUp':
      case 'PageUp':
        event.preventDefault();
        handleOctaveChange(octaveUp());
        break;
      case 'ArrowDown':
      case 'PageDown':
        event.preventDefault();
        handleOctaveChange(octaveDown());
        break;
      case 'Home':
        event.preventDefault();
        handleOctaveChange(resetOctave());
        break;
    }
  });
}

/**
 * Handle octave change - update UI
 */
function handleOctaveChange(newOffset) {
  updateOctaveDisplay();
  updateOctaveLabels();
  updateButtonStates();
}

/**
 * Update the octave display
 */
function updateOctaveDisplay() {
  const offset = getOctaveOffset();
  const offsetDisplay = document.getElementById('octave-offset');
  const rangeDisplay = document.getElementById('octave-range');
  
  if (offsetDisplay) {
    offsetDisplay.textContent = offset >= 0 ? `+${offset}` : `${offset}`;
    offsetDisplay.className = `octave-offset ${offset > 0 ? 'positive' : offset < 0 ? 'negative' : 'neutral'}`;
  }
  
  if (rangeDisplay) {
    rangeDisplay.textContent = `C${2 + offset} - C${6 + offset}`;
  }
}

/**
 * Update octave labels on the keyboard
 */
function updateOctaveLabels() {
  const offset = getOctaveOffset();
  
  // Update octave section labels
  ALL_OCTAVES.forEach((octaveData, index) => {
    const label = document.getElementById(`octave-label-${index}`);
    if (label) {
      const adjustedOctave = octaveData.baseOctave + offset;
      label.textContent = `C${adjustedOctave}`;
    }
  });
  
  // Update note labels on white keys
  document.querySelectorAll('.key.white .note-label').forEach(label => {
    const baseNote = label.dataset.note;
    const baseOctave = parseInt(label.dataset.octave);
    const adjustedOctave = baseOctave + offset;
    label.textContent = `${baseNote}${adjustedOctave}`;
  });
}

/**
 * Update button enabled/disabled states
 */
function updateButtonStates() {
  const offset = getOctaveOffset();
  const range = getOctaveOffsetRange();
  
  const upBtn = document.getElementById('octave-up');
  const downBtn = document.getElementById('octave-down');
  
  if (upBtn) upBtn.disabled = offset >= range.max;
  if (downBtn) downBtn.disabled = offset <= range.min;
}

/**
 * Build the settings UI panel
 */
function buildSettingsUI() {
  settingsPanel.innerHTML = `
    <div class="settings-toggle" id="settings-toggle">⚙</div>
    <div class="settings-content" id="settings-content">
      <h3>Visual Settings</h3>
      
      <div class="setting-row">
        <label for="trail-toggle">Trail Effect</label>
        <label class="switch">
          <input type="checkbox" id="trail-toggle" ${visualSettings.trailEnabled ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </div>
      
      <div class="setting-row">
        <label for="trail-length">Trail Length</label>
        <input type="range" id="trail-length" min="1" max="50" value="${Math.round((1 - visualSettings.trailAlpha) * 50)}" ${!visualSettings.trailEnabled ? 'disabled' : ''}>
      </div>
      
      <div class="setting-row">
        <label for="fade-length">Fade Duration</label>
        <input type="range" id="fade-length" min="100" max="3000" value="${visualSettings.fadeLength}">
        <span class="setting-value" id="fade-value">${visualSettings.fadeLength}ms</span>
      </div>
    </div>
  `;
  
  // Toggle settings panel
  const toggleBtn = document.getElementById('settings-toggle');
  const content = document.getElementById('settings-content');
  toggleBtn.addEventListener('click', () => {
    content.classList.toggle('open');
    toggleBtn.classList.toggle('open');
  });
  
  // Trail toggle
  document.getElementById('trail-toggle').addEventListener('change', (e) => {
    updateVisualSettings({ trailEnabled: e.target.checked });
    document.getElementById('trail-length').disabled = !e.target.checked;
  });
  
  // Trail length slider
  document.getElementById('trail-length').addEventListener('input', (e) => {
    const alpha = 1 - (e.target.value / 50) * 0.98;
    updateVisualSettings({ trailAlpha: Math.max(0.02, alpha) });
  });
  
  // Fade length slider
  document.getElementById('fade-length').addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    updateVisualSettings({ fadeLength: value });
    document.getElementById('fade-value').textContent = `${value}ms`;
  });
}

/**
 * Handle note on event (update UI)
 * @param {string} key 
 * @param {object} noteData 
 */
function handleNoteOn(key, noteData) {
  const elementId = normalizeKeyId(key);
  const keyElement = document.getElementById(`key-${elementId}`);
  if (keyElement) {
    keyElement.classList.add('active');
  }
}

/**
 * Handle note off event (update UI)
 * @param {string} key 
 * @param {object} noteData 
 */
function handleNoteOff(key, noteData) {
  const elementId = normalizeKeyId(key);
  const keyElement = document.getElementById(`key-${elementId}`);
  if (keyElement) {
    keyElement.classList.remove('active');
  }
}

// Start app on first user interaction
startOverlay.addEventListener('click', init);

// Also start on any keydown (for users who just start pressing keys)
window.addEventListener('keydown', (event) => {
  if (!isInitialized) {
    init();
  }
}, { once: false });

// Log ready state
console.log('🎵 Click or press a key to start');
