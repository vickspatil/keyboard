/**
 * Main Application Bootstrap
 * Musical Keyboard Visualizer
 */

import { resumeAudioContext, isAudioReady } from './audio/audioEngine.js';
import { initKeyboard, isKeyPressed } from './input/keyboard.js';
import { initVisualEngine, startRenderLoop, visualSettings, updateVisualSettings } from './visuals/visualEngine.js';
import { KEY_TO_NOTE, ALL_OCTAVES, getKeyLabel } from './audio/noteMap.js';

// DOM Elements
const startOverlay = document.getElementById('start-overlay');
const canvas = document.getElementById('canvas');
const keyboardUI = document.getElementById('keyboard-ui');
const settingsPanel = document.getElementById('settings-panel');

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
    
    // Build settings UI
    buildSettingsUI();
    
    // Start render loop
    startRenderLoop();
    
    // Hide start overlay
    startOverlay.style.display = 'none';
    
    isInitialized = true;
    
    console.log('🎹 Musical Keyboard Visualizer initialized - 3 octaves ready!');
  } catch (error) {
    console.error('Failed to initialize:', error);
  }
}

/**
 * Build the on-screen keyboard UI with 3 octaves in piano layout
 */
function buildKeyboardUI() {
  keyboardUI.innerHTML = '';
  
  // Create a piano-style layout with all octaves in a row
  const pianoContainer = document.createElement('div');
  pianoContainer.className = 'piano-container';
  
  // Build each octave
  ALL_OCTAVES.forEach((octaveData, octaveIndex) => {
    const octaveDiv = document.createElement('div');
    octaveDiv.className = 'octave';
    octaveDiv.dataset.octave = octaveData.name;
    
    // Add octave label
    const label = document.createElement('span');
    label.className = 'octave-label';
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
      keyElement.id = `key-${keyData.key === '\\' ? 'backslash' : keyData.key}`;
      keyElement.innerHTML = `
        <span class="note-label">${noteData.note}${noteData.octave}</span>
        <span class="key-label">${getKeyLabel(keyData.key)}</span>
      `;
      whiteKeysDiv.appendChild(keyElement);
    });
    
    // Add black keys with proper positioning
    blackKeys.forEach((keyData) => {
      const noteData = KEY_TO_NOTE[keyData.key];
      const keyElement = document.createElement('div');
      keyElement.className = 'key black';
      keyElement.id = `key-${keyData.key === 'Backspace' ? 'backspace' : keyData.key}`;
      // Position based on which white key it's after
      keyElement.style.left = `${(keyData.position) * 44 + 30}px`;
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
  const elementId = key === '\\' ? 'backslash' : (key === 'Backspace' ? 'backspace' : key);
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
  const elementId = key === '\\' ? 'backslash' : (key === 'Backspace' ? 'backspace' : key);
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
