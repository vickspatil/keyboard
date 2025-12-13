/**
 * Note mapping configuration
 * Standard Virtual Piano Layout - 3 Octaves (C2 to C5)
 * 
 * Layout mirrors a real piano:
 * - Bottom rows = lower octave
 * - Top rows = higher octave
 * - Row above white keys = black keys (sharps)
 * 
 * OCTAVE 3 (C4-C5):  9  0     -  =        ← Black keys
 *                    I  O  P  [  ]  \     ← White keys
 * 
 * OCTAVE 2 (C3-B3):  2  3     5  6  7     ← Black keys
 *                    Q  W  E  R  T  Y  U  ← White keys
 * 
 * OCTAVE 1 (C2-B2):  S  D     G  H  J     ← Black keys
 *                    Z  X  C  V  B  N  M  ← White keys
 */

// Complete key-to-note mapping for 3 octaves
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
  // OCTAVE 3 (C4 - C5) - Upper rows (I-\ and 9-=)
  // ═══════════════════════════════════════════════════════════════
  // White keys (continuing top letter row + brackets)
  'i': { note: 'C',  midi: 60, isBlack: false, octave: 4 },  // Middle C
  'o': { note: 'D',  midi: 62, isBlack: false, octave: 4 },
  'p': { note: 'E',  midi: 64, isBlack: false, octave: 4 },
  '[': { note: 'F',  midi: 65, isBlack: false, octave: 4 },
  ']': { note: 'G',  midi: 67, isBlack: false, octave: 4 },
  '\\': { note: 'A', midi: 69, isBlack: false, octave: 4 }, // A440
  'a': { note: 'B',  midi: 71, isBlack: false, octave: 4 },
  'k': { note: 'C',  midi: 72, isBlack: false, octave: 5 },  // High C
  // Black keys (number row continuation)
  '9': { note: 'C#', midi: 61, isBlack: true, octave: 4 },
  '0': { note: 'D#', midi: 63, isBlack: true, octave: 4 },
  '-': { note: 'F#', midi: 66, isBlack: true, octave: 4 },
  '=': { note: 'G#', midi: 68, isBlack: true, octave: 4 },
  'Backspace': { note: 'A#', midi: 70, isBlack: true, octave: 4 },
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
  { key: 'k', isBlack: false, position: 7 },   // C5 (High C)
];

// All octave layouts combined
export const ALL_OCTAVES = [
  { name: 'C2', layout: OCTAVE_1_LAYOUT },
  { name: 'C3', layout: OCTAVE_2_LAYOUT },
  { name: 'C4', layout: OCTAVE_3_LAYOUT },
];

// Flat list of all keys
export const KEY_ORDER = [
  ...OCTAVE_1_LAYOUT.map(k => k.key),
  ...OCTAVE_2_LAYOUT.map(k => k.key),
  ...OCTAVE_3_LAYOUT.map(k => k.key),
];

export const WHITE_KEYS = KEY_ORDER.filter(k => !KEY_TO_NOTE[k]?.isBlack);
export const BLACK_KEYS = KEY_ORDER.filter(k => KEY_TO_NOTE[k]?.isBlack);

/**
 * Calculate frequency from MIDI note number
 * Formula: f = 440 * 2^((n - 69) / 12)
 * where n is the MIDI note number
 * A4 = MIDI 69 = 440 Hz
 * 
 * @param {number} midiNote - MIDI note number
 * @returns {number} Frequency in Hz
 */
export function midiToFrequency(midiNote) {
  return 440 * Math.pow(2, (midiNote - 69) / 12);
}

/**
 * Get note data for a keyboard key
 * @param {string} key - Keyboard key
 * @returns {object|null} Note data or null if not mapped
 */
export function getNoteForKey(key) {
  // Normalize key (handle special keys)
  const normalizedKey = key.length === 1 ? key.toLowerCase() : key;
  const noteData = KEY_TO_NOTE[normalizedKey];
  if (!noteData) return null;
  
  return {
    ...noteData,
    frequency: midiToFrequency(noteData.midi),
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
  return key.toUpperCase();
}
