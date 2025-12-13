/**
 * Visual Engine using HTML5 Canvas
 * Renders frequency-driven visual effects synchronized with audio
 */

import { noteState, getNoteGain } from '../audio/audioEngine.js';
import { frequencyToHue, frequencyToRadius, frequencyToSpeed, easeOutCubic } from '../utils/math.js';

// Canvas and context
let canvas = null;
let ctx = null;

// Visual entities for each note
const visualEntities = new Map();

// Animation frame ID
let animationId = null;

// Time tracking
let lastTime = 0;

// Visual settings (configurable)
export const visualSettings = {
  trailEnabled: true,      // Whether to show trails
  trailAlpha: 0.12,        // Alpha value for trail clear (lower = longer trails)
  fadeLength: 500          // Visual fade duration in ms after note stops
};

/**
 * Initialize the visual engine
 * @param {HTMLCanvasElement} canvasElement 
 */
export function initVisualEngine(canvasElement) {
  canvas = canvasElement;
  ctx = canvas.getContext('2d');
  
  // Set initial size
  resizeCanvas();
  
  // Handle window resize
  window.addEventListener('resize', resizeCanvas);
}

/**
 * Resize canvas to fill window
 */
function resizeCanvas() {
  if (!canvas) return;
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

/**
 * Start the render loop
 */
export function startRenderLoop() {
  if (animationId) return;
  lastTime = performance.now();
  render(lastTime);
}

/**
 * Stop the render loop
 */
export function stopRenderLoop() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

/**
 * Main render function
 * @param {number} currentTime 
 */
function render(currentTime) {
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;
  
  // Clear canvas - with or without trail effect
  if (visualSettings.trailEnabled) {
    ctx.fillStyle = `rgba(10, 10, 15, ${visualSettings.trailAlpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = 'rgb(10, 10, 15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  // Update visual entities from audio state
  updateVisualEntities(currentTime);
  
  // Render all entities
  renderEntities(currentTime, deltaTime);
  
  // Continue loop
  animationId = requestAnimationFrame(render);
}

/**
 * Sync visual entities with audio state
 * @param {number} currentTime 
 */
function updateVisualEntities(currentTime) {
  // Add new entities for notes that started playing
  for (const [noteId, noteData] of noteState.active) {
    if (!visualEntities.has(noteId)) {
      visualEntities.set(noteId, createVisualEntity(noteId, noteData, currentTime));
    }
  }
  
  // Mark entities for removal if note is no longer active
  for (const [noteId, entity] of visualEntities) {
    if (!noteState.active.has(noteId) && !entity.fading) {
      entity.fading = true;
      entity.fadeStartTime = currentTime;
    }
  }
  
  // Remove fully faded entities
  for (const [noteId, entity] of visualEntities) {
    if (entity.fading && currentTime - entity.fadeStartTime > visualSettings.fadeLength) {
      visualEntities.delete(noteId);
    }
  }
}

/**
 * Update visual settings
 * @param {object} settings 
 */
export function updateVisualSettings(settings) {
  if (settings.trailEnabled !== undefined) {
    visualSettings.trailEnabled = settings.trailEnabled;
  }
  if (settings.trailAlpha !== undefined) {
    visualSettings.trailAlpha = Math.max(0.01, Math.min(1, settings.trailAlpha));
  }
  if (settings.fadeLength !== undefined) {
    visualSettings.fadeLength = Math.max(100, Math.min(5000, settings.fadeLength));
  }
}

/**
 * Create a visual entity for a note
 * @param {string} noteId 
 * @param {object} noteData 
 * @param {number} currentTime 
 * @returns {object}
 */
function createVisualEntity(noteId, noteData, currentTime) {
  const { frequency } = noteData;
  
  return {
    noteId,
    frequency,
    hue: frequencyToHue(frequency),
    baseRadius: frequencyToRadius(frequency),
    speed: frequencyToSpeed(frequency),
    startTime: currentTime,
    x: canvas.width / 2,
    y: canvas.height / 2,
    rings: [],
    fading: false,
    fadeStartTime: 0
  };
}

/**
 * Render all visual entities
 * @param {number} currentTime 
 * @param {number} deltaTime 
 */
function renderEntities(currentTime, deltaTime) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  for (const [noteId, entity] of visualEntities) {
    const elapsed = (currentTime - entity.startTime) / 1000;
    const gain = getNoteGain(noteId);
    
    // Calculate opacity based on gain and fade state
    let opacity = gain * 2; // Amplify for visibility
    if (entity.fading) {
      const fadeElapsed = (currentTime - entity.fadeStartTime) / 500;
      opacity *= Math.max(0, 1 - fadeElapsed);
    }
    opacity = Math.min(opacity, 1);
    
    // Skip if invisible
    if (opacity <= 0) continue;
    
    // Render expanding rings
    renderExpandingRings(entity, centerX, centerY, elapsed, opacity);
    
    // Render central glow
    renderCentralGlow(entity, centerX, centerY, elapsed, opacity);
    
    // Render pulsing core
    renderCore(entity, centerX, centerY, elapsed, opacity);
  }
}

/**
 * Render expanding rings for an entity
 */
function renderExpandingRings(entity, centerX, centerY, elapsed, opacity) {
  const numRings = 5;
  const ringInterval = 0.3 / entity.speed;
  
  for (let i = 0; i < numRings; i++) {
    const ringAge = elapsed - (i * ringInterval);
    if (ringAge < 0) continue;
    
    const expansion = easeOutCubic(Math.min(ringAge / 2, 1));
    const radius = entity.baseRadius + expansion * 200 * entity.speed;
    const ringOpacity = opacity * Math.max(0, 1 - expansion) * 0.6;
    
    if (ringOpacity <= 0) continue;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `hsla(${entity.hue}, 80%, 60%, ${ringOpacity})`;
    ctx.lineWidth = 2 + (1 - expansion) * 3;
    ctx.stroke();
  }
}

/**
 * Render central glow for an entity
 */
function renderCentralGlow(entity, centerX, centerY, elapsed, opacity) {
  const pulsePhase = Math.sin(elapsed * entity.speed * 8) * 0.3 + 0.7;
  const glowRadius = entity.baseRadius * 2 * pulsePhase;
  
  const gradient = ctx.createRadialGradient(
    centerX, centerY, 0,
    centerX, centerY, glowRadius
  );
  
  gradient.addColorStop(0, `hsla(${entity.hue}, 90%, 70%, ${opacity * 0.8})`);
  gradient.addColorStop(0.5, `hsla(${entity.hue}, 80%, 50%, ${opacity * 0.3})`);
  gradient.addColorStop(1, `hsla(${entity.hue}, 70%, 40%, 0)`);
  
  ctx.beginPath();
  ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
}

/**
 * Render pulsing core for an entity
 */
function renderCore(entity, centerX, centerY, elapsed, opacity) {
  const pulsePhase = Math.sin(elapsed * entity.speed * 12) * 0.2 + 0.8;
  const coreRadius = entity.baseRadius * 0.5 * pulsePhase;
  
  // Outer core
  ctx.beginPath();
  ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
  ctx.fillStyle = `hsla(${entity.hue}, 100%, 80%, ${opacity * 0.9})`;
  ctx.fill();
  
  // Inner bright core
  ctx.beginPath();
  ctx.arc(centerX, centerY, coreRadius * 0.4, 0, Math.PI * 2);
  ctx.fillStyle = `hsla(${entity.hue}, 50%, 95%, ${opacity})`;
  ctx.fill();
}

/**
 * Get the visual entity for a note (for external access)
 * @param {string} noteId 
 * @returns {object|null}
 */
export function getVisualEntity(noteId) {
  return visualEntities.get(noteId) || null;
}

/**
 * Check if visual engine is running
 * @returns {boolean}
 */
export function isRunning() {
  return animationId !== null;
}

