/**
 * Math utilities for audio and visual calculations
 */

/**
 * Map a frequency to a hue value (0-360)
 * Uses logarithmic mapping across audible spectrum
 * 
 * @param {number} frequency - Frequency in Hz
 * @returns {number} Hue value 0-360
 */
export function frequencyToHue(frequency) {
  // Map C4 (261 Hz) to B4 (493 Hz) across the full hue spectrum
  const minFreq = 261.63; // C4
  const maxFreq = 493.88; // B4
  
  // Normalize to 0-1 range
  const normalized = (frequency - minFreq) / (maxFreq - minFreq);
  
  // Map to hue (offset to start from a nice color)
  // Starting from purple/blue and going through the spectrum
  return (normalized * 300 + 240) % 360;
}

/**
 * Calculate visual radius based on frequency
 * Uses logarithmic scaling for perceptual uniformity
 * 
 * @param {number} frequency - Frequency in Hz
 * @param {number} baseRadius - Base radius in pixels
 * @param {number} scale - Scaling factor
 * @returns {number} Radius in pixels
 */
export function frequencyToRadius(frequency, baseRadius = 20, scale = 15) {
  return baseRadius + Math.log2(frequency / 100) * scale;
}

/**
 * Calculate animation speed based on frequency
 * Higher frequencies = faster animation
 * 
 * @param {number} frequency - Frequency in Hz
 * @returns {number} Speed multiplier
 */
export function frequencyToSpeed(frequency) {
  // Normalize around middle C
  return 0.5 + (frequency / 440) * 0.5;
}

/**
 * Linear interpolation
 * @param {number} a - Start value
 * @param {number} b - End value
 * @param {number} t - Progress 0-1
 * @returns {number}
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Clamp a value between min and max
 * @param {number} value 
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Ease out cubic for smooth animations
 * @param {number} t - Progress 0-1
 * @returns {number}
 */
export function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Ease in out sine for smooth oscillations
 * @param {number} t - Progress 0-1
 * @returns {number}
 */
export function easeInOutSine(t) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

