/**
 * DATUM ATELIER // FLUID INTERFACES & WEIGHTLESS MOTION ENGINE
 * 
 * Mathematical physics engine adhering strictly to Apple's "Designing Fluid Interfaces"
 * paradigms and anti-gravity weightless dynamics.
 * 
 * Core Invariants:
 * 1. Two-Parameter Spring Physics (Damping Ratio ζ ≈ 0.75, Response ≈ 0.45s)
 * 2. 100% Mid-flight Interruptibility (zero snapping, live sample handoff)
 * 3. Continuous Ambient Levitation (multi-harmonic anti-gravity drift)
 * 4. Velocity Handoff with Low Friction Decay
 * 5. Inverse-Square Magnetic Rubber-Banding
 * 6. Pure GPU Transform Isolation (translate3d, scale, will-change)
 */

export interface SpringConfig {
  /** Damping Ratio ζ: < 1.0 is underdamped with organic overshoot, 1.0 is critically damped */
  dampingRatio: number;
  /** Response time T in seconds: governs the natural oscillation period */
  response: number;
}

export interface SpringState1D {
  current: number;
  target: number;
  velocity: number;
}

export interface SpringState2D {
  x: SpringState1D;
  y: SpringState1D;
  scale?: SpringState1D;
}

/** Standard Apple Fluid Interface preset: underdamped weightless float */
export const FLUID_PRESETS = {
  /** Modal entrance & dispatch chambers: airy, zero-gravity overshoot */
  weightlessModal: {
    dampingRatio: 0.76,
    response: 0.44
  } satisfies SpringConfig,

  /** Toasts & Floating HUDs: quick reactive pop with gentle settle */
  floatingHud: {
    dampingRatio: 0.74,
    response: 0.38
  } satisfies SpringConfig,

  /** Interactive card touches & magnetic snapping: tactile, rapid response */
  interactiveTap: {
    dampingRatio: 0.78,
    response: 0.32
  } satisfies SpringConfig,

  /** Pure gesture dragging: critically responsive */
  directGesture: {
    dampingRatio: 0.92,
    response: 0.24
  } satisfies SpringConfig
} as const;

/**
 * Derives spring stiffness (k) and damping coefficient (c) from two parameters (ζ, T)
 */
export function deriveSpringConstants(config: SpringConfig): { k: number; c: number } {
  const omega = (2 * Math.PI) / Math.max(0.001, config.response);
  const k = omega * omega;
  const c = 2 * config.dampingRatio * omega;
  return { k, c };
}

/**
 * Steps a 1D spring forward using sub-stepped Semi-Implicit Euler integration.
 * Sub-stepping guarantees zero energy explosion or numerical instability.
 */
export function stepSpring1D(
  state: SpringState1D,
  config: SpringConfig,
  dtSeconds: number
): SpringState1D {
  const { k, c } = deriveSpringConstants(config);
  
  // Guard against massive frame drops (clamp dt to 64ms max)
  const clampedDt = Math.min(0.064, Math.max(0.0001, dtSeconds));
  
  // Sub-step at ~240Hz (<= 0.004s per step)
  const substeps = Math.ceil(clampedDt / 0.004);
  const subDt = clampedDt / substeps;

  let x = state.current;
  let v = state.velocity;
  const target = state.target;

  for (let i = 0; i < substeps; i++) {
    const displacement = x - target;
    const springForce = -k * displacement;
    const dampingForce = -c * v;
    const acceleration = springForce + dampingForce;

    // Semi-Implicit Euler (Symplectic)
    v += acceleration * subDt;
    x += v * subDt;
  }

  return {
    current: x,
    target,
    velocity: v
  };
}

/**
 * Checks if a spring state has converged within human-imperceptible tolerance
 */
export function isSpring1DSettled(
  state: SpringState1D,
  posTolerance = 0.05,
  velTolerance = 0.1
): boolean {
  return (
    Math.abs(state.current - state.target) < posTolerance &&
    Math.abs(state.velocity) < velTolerance
  );
}

/**
 * Apple Rubber Banding Formula
 * When an element is dragged past a boundary, applies an asymptotic inverse resistance
 * 
 * @param offset Distance past boundary (can be positive or negative)
 * @param dimension Viewport dimension or boundary length
 * @param constant Apple drag coefficient (default 0.55)
 */
export function calculateRubberBand(
  offset: number,
  dimension: number,
  constant = 0.55
): number {
  if (dimension <= 0 || offset === 0) return 0;
  const absOffset = Math.abs(offset);
  const result = (absOffset * dimension * constant) / (dimension + constant * absOffset);
  return Math.sign(offset) * result;
}

/**
 * Friction Decay Handoff
 * Simulates weightless glide upon gesture release before spring catch
 */
export function applyFrictionDecay(
  velocity: number,
  frictionCoefficient = 0.985
): number {
  return velocity * frictionCoefficient;
}

/**
 * Continuous Ambient Levitation
 * Computes organic, multi-harmonic 2D micro-offsets simulating anti-gravity weightlessness.
 * Produces smooth Perlin-like continuous drift with zero main-thread layout recalculations.
 * 
 * @param timeMs High-resolution timestamp from requestAnimationFrame
 * @param intensity Scalar multiplier for float amplitude (default 1.0)
 */
export function calculateAmbientLevitation(
  timeMs: number,
  intensity = 1.0
): { x: number; y: number; rotateDeg: number } {
  const t = timeMs * 0.001;

  // Primary and secondary low-frequency harmonics (out-of-phase primes to avoid repetitive loop)
  const x = (Math.sin(t * 0.85) * 1.1 + Math.cos(t * 1.42) * 0.6) * intensity;
  const y = (Math.sin(t * 0.68 + 1.2) * 2.2 + Math.cos(t * 1.15) * 0.8) * intensity;
  const rotateDeg = (Math.sin(t * 0.52) * 0.35) * intensity;

  return { x, y, rotateDeg };
}

/**
 * Rolling Gesture Velocity Tracker
 * Samples pointer movements over a 100ms rolling window for accurate velocity handoff.
 */
export class VelocityTracker {
  private history: { time: number; x: number; y: number }[] = [];
  private readonly maxWindowMs = 100;

  addPoint(x: number, y: number, time = performance.now()): void {
    this.history.push({ time, x, y });
    const cutoff = time - this.maxWindowMs;
    this.history = this.history.filter((pt) => pt.time >= cutoff);
  }

  getVelocity(currentTime = performance.now()): { vx: number; vy: number } {
    const cutoff = currentTime - this.maxWindowMs;
    const valid = this.history.filter((pt) => pt.time >= cutoff);
    if (valid.length < 2) return { vx: 0, vy: 0 };

    const first = valid[0];
    const last = valid[valid.length - 1];
    const dt = (last.time - first.time) / 1000;
    if (dt <= 0.001) return { vx: 0, vy: 0 };

    return {
      vx: (last.x - first.x) / dt,
      vy: (last.y - first.y) / dt
    };
  }

  reset(): void {
    this.history = [];
  }
}
