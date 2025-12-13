/**
 * Polyphonic Audio Engine using Web Audio API
 * Handles oscillator creation, gain envelopes, and note lifecycle
 */

// Envelope settings (in seconds)
const ATTACK_TIME = 0.02;  // 20ms
const RELEASE_TIME = 0.15; // 150ms
const MAX_GAIN = 0.3;

// Shared AudioContext (created on first user interaction)
let audioContext = null;

// Active notes: Map<noteId, { oscillator, gainNode, isReleasing, instanceId }>
const activeNotes = new Map();

// Instance counter for unique oscillator identification
let instanceCounter = 0;

// Shared state for visualization
export const noteState = {
  active: new Map(), // Map<noteId, { frequency, gain, startTime }>
};

/**
 * Initialize or get the AudioContext
 * @returns {AudioContext}
 */
export function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

/**
 * Resume AudioContext (required after user interaction)
 * @returns {Promise<void>}
 */
export async function resumeAudioContext() {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
  return ctx;
}

/**
 * Play a note with attack envelope
 * @param {string} noteId - Unique identifier for the note (e.g., keyboard key)
 * @param {number} frequency - Frequency in Hz
 * @param {string} oscillatorType - Type of oscillator (sine, square, sawtooth, triangle)
 */
export function playNote(noteId, frequency, oscillatorType = 'sine') {
  const ctx = getAudioContext();
  
  // If note is already playing, don't retrigger
  if (activeNotes.has(noteId)) {
    const existing = activeNotes.get(noteId);
    if (!existing.isReleasing) {
      return;
    }
    // If releasing, stop it and start fresh
    forceStopNote(noteId);
  }
  
  const now = ctx.currentTime;
  
  // Create oscillator
  const oscillator = ctx.createOscillator();
  oscillator.type = oscillatorType;
  oscillator.frequency.setValueAtTime(frequency, now);
  
  // Create gain node for envelope
  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0, now);
  
  // Attack envelope
  gainNode.gain.linearRampToValueAtTime(MAX_GAIN, now + ATTACK_TIME);
  
  // Connect nodes
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  // Start oscillator
  oscillator.start(now);
  
  // Generate unique instance ID for this oscillator
  const instanceId = ++instanceCounter;
  
  // Store in active notes
  activeNotes.set(noteId, {
    oscillator,
    gainNode,
    frequency,
    isReleasing: false,
    instanceId
  });
  
  // Update shared state for visuals
  noteState.active.set(noteId, {
    frequency,
    gain: MAX_GAIN,
    startTime: now,
    instanceId
  });
}

/**
 * Stop a note with release envelope
 * @param {string} noteId - Unique identifier for the note
 */
export function stopNote(noteId) {
  if (!activeNotes.has(noteId)) return;
  
  const ctx = getAudioContext();
  const note = activeNotes.get(noteId);
  
  if (note.isReleasing) return;
  note.isReleasing = true;
  const currentInstanceId = note.instanceId;
  
  const now = ctx.currentTime;
  const { gainNode, oscillator } = note;
  
  // Cancel any scheduled values
  gainNode.gain.cancelScheduledValues(now);
  gainNode.gain.setValueAtTime(gainNode.gain.value, now);
  
  // Release envelope - exponential decay to near zero
  // Note: exponentialRampToValueAtTime can't go to 0, so we use a tiny value
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + RELEASE_TIME);
  
  // Schedule oscillator stop and cleanup
  oscillator.stop(now + RELEASE_TIME + 0.01);
  
  // Cleanup after release - ONLY if this is still the same instance
  setTimeout(() => {
    // Only delete if no new note has replaced this one
    const currentNote = activeNotes.get(noteId);
    if (!currentNote || currentNote.instanceId === currentInstanceId) {
      activeNotes.delete(noteId);
      noteState.active.delete(noteId);
    }
    
    // Always disconnect the OLD oscillator nodes (they're already stopped)
    try {
      oscillator.disconnect();
      gainNode.disconnect();
    } catch (e) {
      // Already disconnected
    }
  }, (RELEASE_TIME + 0.05) * 1000);
  
  // Update visual state to show release
  if (noteState.active.has(noteId)) {
    noteState.active.get(noteId).releasing = true;
    noteState.active.get(noteId).releaseStartTime = now;
  }
}

/**
 * Force stop a note immediately (used for retrigger)
 * @param {string} noteId 
 */
function forceStopNote(noteId) {
  if (!activeNotes.has(noteId)) return;
  
  const { oscillator, gainNode } = activeNotes.get(noteId);
  
  try {
    oscillator.stop();
    oscillator.disconnect();
    gainNode.disconnect();
  } catch (e) {
    // Already stopped
  }
  
  activeNotes.delete(noteId);
  noteState.active.delete(noteId);
}

/**
 * Get current gain value for a note (for visualization)
 * @param {string} noteId 
 * @returns {number} Current gain 0-1
 */
export function getNoteGain(noteId) {
  if (!activeNotes.has(noteId)) return 0;
  
  const ctx = getAudioContext();
  const note = activeNotes.get(noteId);
  const noteData = noteState.active.get(noteId);
  
  if (!noteData) return 0;
  
  const now = ctx.currentTime;
  const elapsed = now - noteData.startTime;
  
  if (noteData.releasing) {
    const releaseElapsed = now - noteData.releaseStartTime;
    const releaseProgress = Math.min(releaseElapsed / RELEASE_TIME, 1);
    return MAX_GAIN * Math.pow(0.001 / MAX_GAIN, releaseProgress);
  }
  
  // Attack phase
  if (elapsed < ATTACK_TIME) {
    return (elapsed / ATTACK_TIME) * MAX_GAIN;
  }
  
  // Sustain phase
  return MAX_GAIN;
}

/**
 * Check if audio is ready
 * @returns {boolean}
 */
export function isAudioReady() {
  return audioContext && audioContext.state === 'running';
}

/**
 * Get all active note IDs
 * @returns {string[]}
 */
export function getActiveNoteIds() {
  return Array.from(noteState.active.keys());
}

