/**
 * Note mapping configuration
 * Standard Virtual Piano Layout - 4 Octaves (C2 to C6) with Octave Shift
 * 
 * Layout mirrors a real piano:
 * - Bottom rows = lower octave
 * - Top rows = higher octave
 * - Row above white keys = black keys (sharps)
 * 
 * OCTAVE 4 (C5-C6):  F1 F2    F4 F5 F6    ← Black keys (function row)
 *                    L  ;  '  ,  .  /  `  ← White keys
 * 
 * OCTAVE 3 (C4-C5):  9  0     -  =  ⌫     ← Black keys
 *                    I  O  P  [  ]  \  A K← White keys
 * 
 * OCTAVE 2 (C3-B3):  2  3     5  6  7     ← Black keys
 *                    Q  W  E  R  T  Y  U  ← White keys
 * 
 * OCTAVE 1 (C2-B2):  S  D     G  H  J     ← Black keys
 *                    Z  X  C  V  B  N  M  ← White keys
 * 
 * With octave shift: Access full piano range A0-C8
 */

// Octave offset state (can be adjusted via UI)
let currentOctaveOffset = 0;

// Complete key-to-note mapping for 4 octaves
export const KEY_TO_NOTE = {
  // ═══════════════════════════════════════════════════════════════
  // OCTAVE 1 (C2 - B2) - Bottom rows (Z-M and S-J)
  // ═══════════════════════════════════════════════════════════════
  // White keys (bottom row)
  'z': { note: 'C',  midi: 36, isBlack: false, octave: 2 },
  'x': { note: 'D',  midi: 38, isBlack: false, octave: 2 },
  'c': { note: 'E',  midi: 40, isBlack: false, octave: 2 },
  'v': { note: 'F',  midi: 41, isBlack: false, octave: 2 },
  'b': { note: 'G',  midi: 43, isBlack: false, octave: 2 },
  'n': { note: 'A',  midi: 45, isBlack: false, octave: 2 },
  'm': { note: 'B',  midi: 47, isBlack: false, octave: 2 },
  // Black keys (home row - positioned above white keys)
  's': { note: 'C#', midi: 37, isBlack: true, octave: 2 },
  'd': { note: 'D#', midi: 39, isBlack: true, octave: 2 },
  'g': { note: 'F#', midi: 42, isBlack: true, octave: 2 },
  'h': { note: 'G#', midi: 44, isBlack: true, octave: 2 },
  'j': { note: 'A#', midi: 46, isBlack: true, octave: 2 },

  // ═══════════════════════════════════════════════════════════════
  // OCTAVE 2 (C3 - B3) - Middle rows (Q-U and 2-7)
  // ═══════════════════════════════════════════════════════════════
  // White keys (top letter row)
  'q': { note: 'C',  midi: 48, isBlack: false, octave: 3 },
  'w': { note: 'D',  midi: 50, isBlack: false, octave: 3 },
  'e': { note: 'E',  midi: 52, isBlack: false, octave: 3 },
  'r': { note: 'F',  midi: 53, isBlack: false, octave: 3 },
  't': { note: 'G',  midi: 55, isBlack: false, octave: 3 },
  'y': { note: 'A',  midi: 57, isBlack: false, octave: 3 },
  'u': { note: 'B',  midi: 59, isBlack: false, octave: 3 },
  // Black keys (number row - positioned above white keys)
  '2': { note: 'C#', midi: 49, isBlack: true, octave: 3 },
  '3': { note: 'D#', midi: 51, isBlack: true, octave: 3 },
  '5': { note: 'F#', midi: 54, isBlack: true, octave: 3 },
  '6': { note: 'G#', midi: 56, isBlack: true, octave: 3 },
  '7': { note: 'A#', midi: 58, isBlack: true, octave: 3 },

  // ═══════════════════════════════════════════════════════════════
  // OCTAVE 3 (C4 - B4) - Upper rows (I-A and 9-Backspace)
  // ═══════════════════════════════════════════════════════════════
  // White keys (continuing top letter row + brackets)
  'i': { note: 'C',  midi: 60, isBlack: false, octave: 4 },  // Middle C
  'o': { note: 'D',  midi: 62, isBlack: false, octave: 4 },
  'p': { note: 'E',  midi: 64, isBlack: false, octave: 4 },
  '[': { note: 'F',  midi: 65, isBlack: false, octave: 4 },
  ']': { note: 'G',  midi: 67, isBlack: false, octave: 4 },
  '\\': { note: 'A', midi: 69, isBlack: false, octave: 4 }, // A440
  'a': { note: 'B',  midi: 71, isBlack: false, octave: 4 },
  // Black keys (number row continuation)
  '9': { note: 'C#', midi: 61, isBlack: true, octave: 4 },
  '0': { note: 'D#', midi: 63, isBlack: true, octave: 4 },
  '-': { note: 'F#', midi: 66, isBlack: true, octave: 4 },
  '=': { note: 'G#', midi: 68, isBlack: true, octave: 4 },
  'Backspace': { note: 'A#', midi: 70, isBlack: true, octave: 4 },

  // ═══════════════════════════════════════════════════════════════
  // OCTAVE 4 (C5 - C6) - Extended octave (L-` and F1-F6)
  // ═══════════════════════════════════════════════════════════════
  // White keys (home row continuation + punctuation)
  'k': { note: 'C',  midi: 72, isBlack: false, octave: 5 },
  'l': { note: 'D',  midi: 74, isBlack: false, octave: 5 },
  ';': { note: 'E',  midi: 76, isBlack: false, octave: 5 },
  "'": { note: 'F',  midi: 77, isBlack: false, octave: 5 },
  ',': { note: 'G',  midi: 79, isBlack: false, octave: 5 },
  '.': { note: 'A',  midi: 81, isBlack: false, octave: 5 },
  '/': { note: 'B',  midi: 83, isBlack: false, octave: 5 },
  '`': { note: 'C',  midi: 84, isBlack: false, octave: 6 },  // High C6
  // Black keys (function keys)
  'F1': { note: 'C#', midi: 73, isBlack: true, octave: 5 },
  'F2': { note: 'D#', midi: 75, isBlack: true, octave: 5 },
  'F4': { note: 'F#', midi: 78, isBlack: true, octave: 5 },
  'F5': { note: 'G#', midi: 80, isBlack: true, octave: 5 },
  'F6': { note: 'A#', midi: 82, isBlack: true, octave: 5 },
};

// Layout arrays for UI rendering - each octave as a visual group
export const OCTAVE_1_LAYOUT = [
  { key: 'z', isBlack: false, position: 0 },   // C2
  { key: 's', isBlack: true,  position: 0.5 }, // C#2
  { key: 'x', isBlack: false, position: 1 },   // D2
  { key: 'd', isBlack: true,  position: 1.5 }, // D#2
  { key: 'c', isBlack: false, position: 2 },   // E2
  { key: 'v', isBlack: false, position: 3 },   // F2
  { key: 'g', isBlack: true,  position: 3.5 }, // F#2
  { key: 'b', isBlack: false, position: 4 },   // G2
  { key: 'h', isBlack: true,  position: 4.5 }, // G#2
  { key: 'n', isBlack: false, position: 5 },   // A2
  { key: 'j', isBlack: true,  position: 5.5 }, // A#2
  { key: 'm', isBlack: false, position: 6 },   // B2
];

export const OCTAVE_2_LAYOUT = [
  { key: 'q', isBlack: false, position: 0 },   // C3
  { key: '2', isBlack: true,  position: 0.5 }, // C#3
  { key: 'w', isBlack: false, position: 1 },   // D3
  { key: '3', isBlack: true,  position: 1.5 }, // D#3
  { key: 'e', isBlack: false, position: 2 },   // E3
  { key: 'r', isBlack: false, position: 3 },   // F3
  { key: '5', isBlack: true,  position: 3.5 }, // F#3
  { key: 't', isBlack: false, position: 4 },   // G3
  { key: '6', isBlack: true,  position: 4.5 }, // G#3
  { key: 'y', isBlack: false, position: 5 },   // A3
  { key: '7', isBlack: true,  position: 5.5 }, // A#3
  { key: 'u', isBlack: false, position: 6 },   // B3
];

export const OCTAVE_3_LAYOUT = [
  { key: 'i', isBlack: false, position: 0 },   // C4 (Middle C)
  { key: '9', isBlack: true,  position: 0.5 }, // C#4
  { key: 'o', isBlack: false, position: 1 },   // D4
  { key: '0', isBlack: true,  position: 1.5 }, // D#4
  { key: 'p', isBlack: false, position: 2 },   // E4
  { key: '[', isBlack: false, position: 3 },   // F4
  { key: '-', isBlack: true,  position: 3.5 }, // F#4
  { key: ']', isBlack: false, position: 4 },   // G4
  { key: '=', isBlack: true,  position: 4.5 }, // G#4
  { key: '\\', isBlack: false, position: 5 },  // A4 (440 Hz)
  { key: 'Backspace', isBlack: true, position: 5.5 }, // A#4
  { key: 'a', isBlack: false, position: 6 },   // B4
];

export const OCTAVE_4_LAYOUT = [
  { key: 'k', isBlack: false, position: 0 },   // C5
  { key: 'F1', isBlack: true, position: 0.5 }, // C#5
  { key: 'l', isBlack: false, position: 1 },   // D5
  { key: 'F2', isBlack: true, position: 1.5 }, // D#5
  { key: ';', isBlack: false, position: 2 },   // E5
  { key: "'", isBlack: false, position: 3 },   // F5
  { key: 'F4', isBlack: true, position: 3.5 }, // F#5
  { key: ',', isBlack: false, position: 4 },   // G5
  { key: 'F5', isBlack: true, position: 4.5 }, // G#5
  { key: '.', isBlack: false, position: 5 },   // A5
  { key: 'F6', isBlack: true, position: 5.5 }, // A#5
  { key: '/', isBlack: false, position: 6 },   // B5
  { key: '`', isBlack: false, position: 7 },   // C6
];

// All octave layouts combined
export const ALL_OCTAVES = [
  { name: 'C2', label: 'Oct 1', layout: OCTAVE_1_LAYOUT, baseOctave: 2 },
  { name: 'C3', label: 'Oct 2', layout: OCTAVE_2_LAYOUT, baseOctave: 3 },
  { name: 'C4', label: 'Oct 3', layout: OCTAVE_3_LAYOUT, baseOctave: 4 },
  { name: 'C5', label: 'Oct 4', layout: OCTAVE_4_LAYOUT, baseOctave: 5 },
];

// Flat list of all keys
export const KEY_ORDER = [
  ...OCTAVE_1_LAYOUT.map(k => k.key),
  ...OCTAVE_2_LAYOUT.map(k => k.key),
  ...OCTAVE_3_LAYOUT.map(k => k.key),
  ...OCTAVE_4_LAYOUT.map(k => k.key),
];

export const WHITE_KEYS = KEY_ORDER.filter(k => !KEY_TO_NOTE[k]?.isBlack);
export const BLACK_KEYS = KEY_ORDER.filter(k => KEY_TO_NOTE[k]?.isBlack);

// ═══════════════════════════════════════════════════════════════
// OCTAVE OFFSET MANAGEMENT
// ═══════════════════════════════════════════════════════════════

const MIN_OCTAVE_OFFSET = -2;  // Can go down to A0 range
const MAX_OCTAVE_OFFSET = 2;   // Can go up to C8 range

/**
 * Get current octave offset
 * @returns {number}
 */
export function getOctaveOffset() {
  return currentOctaveOffset;
}

/**
 * Set octave offset
 * @param {number} offset - Octave offset (-2 to +2)
 * @returns {number} The actual offset set (clamped to valid range)
 */
export function setOctaveOffset(offset) {
  currentOctaveOffset = Math.max(MIN_OCTAVE_OFFSET, Math.min(MAX_OCTAVE_OFFSET, offset));
  return currentOctaveOffset;
}

/**
 * Shift octave up by 1
 * @returns {number} New offset
 */
export function octaveUp() {
  return setOctaveOffset(currentOctaveOffset + 1);
}

/**
 * Shift octave down by 1
 * @returns {number} New offset
 */
export function octaveDown() {
  return setOctaveOffset(currentOctaveOffset - 1);
}

/**
 * Reset octave offset to 0
 * @returns {number}
 */
export function resetOctave() {
  return setOctaveOffset(0);
}

/**
 * Get the octave offset range limits
 * @returns {{min: number, max: number}}
 */
export function getOctaveOffsetRange() {
  return { min: MIN_OCTAVE_OFFSET, max: MAX_OCTAVE_OFFSET };
}

// ═══════════════════════════════════════════════════════════════
// FREQUENCY CALCULATIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Calculate frequency from MIDI note number
 * Formula: f = 440 * 2^((n - 69) / 12)
 * where n is the MIDI note number
 * A4 = MIDI 69 = 440 Hz
 * 
 * @param {number} midiNote - MIDI note number
 * @param {number} octaveOffset - Optional octave offset (default: current offset)
 * @returns {number} Frequency in Hz
 */
export function midiToFrequency(midiNote, octaveOffset = currentOctaveOffset) {
  const adjustedMidi = midiNote + (octaveOffset * 12);
  return 440 * Math.pow(2, (adjustedMidi - 69) / 12);
}

/**
 * Get note data for a keyboard key (with octave offset applied)
 * @param {string} key - Keyboard key
 * @returns {object|null} Note data or null if not mapped
 */
export function getNoteForKey(key) {
  // Normalize key (handle special keys)
  const normalizedKey = key.length === 1 ? key.toLowerCase() : key;
  const noteData = KEY_TO_NOTE[normalizedKey];
  if (!noteData) return null;
  
  const adjustedOctave = noteData.octave + currentOctaveOffset;
  const adjustedMidi = noteData.midi + (currentOctaveOffset * 12);
  
  return {
    ...noteData,
    frequency: midiToFrequency(noteData.midi),
    adjustedOctave,
    adjustedMidi,
    key: normalizedKey
  };
}

/**
 * Check if a key is mapped to a note
 * @param {string} key - Keyboard key
 * @returns {boolean}
 */
export function isNoteKey(key) {
  const normalizedKey = key.length === 1 ? key.toLowerCase() : key;
  return normalizedKey in KEY_TO_NOTE;
}

/**
 * Get display label for a key
 * @param {string} key 
 * @returns {string}
 */
export function getKeyLabel(key) {
  if (key === 'Backspace') return '⌫';
  if (key === '\\') return '\\';
  if (key === '[') return '[';
  if (key === ']') return ']';
  if (key === "'") return "'";
  if (key === '`') return '`';
  if (key.startsWith('F') && key.length <= 3) return key; // F1-F12
  return key.toUpperCase();
}

/**
 * Get note name with octave (e.g., "C4", "F#5")
 * @param {object} noteData 
 * @returns {string}
 */
export function getNoteDisplayName(noteData) {
  const octave = noteData.octave + currentOctaveOffset;
  return `${noteData.note}${octave}`;
}
