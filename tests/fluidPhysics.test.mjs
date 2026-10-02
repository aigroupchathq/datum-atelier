import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  deriveSpringConstants, 
  stepSpring1D, 
  isSpring1DSettled, 
  calculateRubberBand, 
  calculateAmbientLevitation,
  VelocityTracker,
  FLUID_PRESETS 
} from '../src/core/motion/fluidPhysics.ts';

test('1. deriveSpringConstants derives correct natural frequency and damping coefficient', () => {
  const config = { dampingRatio: 0.75, response: 0.45 };
  const { k, c } = deriveSpringConstants(config);

  const expectedOmega = (2 * Math.PI) / 0.45;
  const expectedK = expectedOmega * expectedOmega;
  const expectedC = 2 * 0.75 * expectedOmega;

  assert.ok(Math.abs(k - expectedK) < 0.001, `Stiffness k should be close to ${expectedK}, got ${k}`);
  assert.ok(Math.abs(c - expectedC) < 0.001, `Damping c should be close to ${expectedC}, got ${c}`);
});

test('2. stepSpring1D exhibits underdamped overshoot and smoothly converges', () => {
  const config = FLUID_PRESETS.weightlessModal; // ζ = 0.76, T = 0.44s
  let state = { current: 100, target: 0, velocity: 0 };

  let didOvershoot = false;
  const dt = 1 / 60; // 60 FPS

  // Step for 1.2 seconds
  for (let frame = 0; frame < 72; frame++) {
    state = stepSpring1D(state, config, dt);
    // Target is 0, so overshoot means current < 0
    if (state.current < -0.01) {
      didOvershoot = true;
    }
  }

  assert.ok(didOvershoot, 'Underdamped spring must demonstrate weightless overshoot past target');
  assert.ok(isSpring1DSettled(state, 0.5, 1.0), 'Spring must settle near target after 1.2s');
});

test('3. Mid-flight interruption maintains continuous velocity and position', () => {
  const config = FLUID_PRESETS.weightlessModal;
  let state = { current: 0, target: 100, velocity: 0 };

  // Step forward mid-flight for 10 frames
  for (let i = 0; i < 10; i++) {
    state = stepSpring1D(state, config, 1 / 60);
  }

  const midPos = state.current;
  const midVel = state.velocity;
  assert.ok(midPos > 5, 'Position must have moved mid-flight');
  assert.ok(midVel > 0, 'Velocity must be positive moving toward 100');

  // Interrupt mid-flight: redirect target to -50
  state = { current: midPos, target: -50, velocity: midVel };
  const nextStep = stepSpring1D(state, config, 1 / 60);

  // Position and velocity must be continuous without sudden teleportation
  assert.ok(Math.abs(nextStep.current - midPos) < 15, 'Position must not jump instantaneously');
  assert.ok(nextStep.velocity < midVel, 'Spring must decelerate mid-flight velocity to redirect toward new target');
});

test('4. calculateRubberBand applies inverse-square resistance at boundaries', () => {
  const dimension = 800;
  const r100 = calculateRubberBand(100, dimension, 0.55);
  const r200 = calculateRubberBand(200, dimension, 0.55);
  const r400 = calculateRubberBand(400, dimension, 0.55);

  assert.ok(r100 > 0 && r100 < 100, 'Rubber band must be less than raw displacement');
  assert.ok(r200 > r100, 'Increasing displacement increases rubber band distance');
  
  // Rate of gain must strictly decrease (asymptotic resistance)
  const delta1 = r200 - r100;
  const delta2 = r400 - r200;
  assert.ok(delta2 < delta1 * 2, 'Marginal extension must decelerate due to magnetic resistance');
});

test('5. calculateAmbientLevitation produces smooth, bounded, multi-harmonic drift', () => {
  const sample1 = calculateAmbientLevitation(0);
  const sample2 = calculateAmbientLevitation(500);
  const sample3 = calculateAmbientLevitation(1000);

  for (const s of [sample1, sample2, sample3]) {
    assert.ok(typeof s.x === 'number' && !isNaN(s.x), 'x must be a valid number');
    assert.ok(typeof s.y === 'number' && !isNaN(s.y), 'y must be a valid number');
    assert.ok(Math.abs(s.x) < 5.0, 'Ambient X drift must remain subtle (< 5px)');
    assert.ok(Math.abs(s.y) < 5.0, 'Ambient Y drift must remain subtle (< 5px)');
    assert.ok(Math.abs(s.rotateDeg) < 2.0, 'Ambient rotation must remain subtle (< 2 deg)');
  }
});

test('6. VelocityTracker captures gesture vectors accurately', () => {
  const tracker = new VelocityTracker();
  const t0 = 1000;
  
  tracker.addPoint(0, 0, t0);
  tracker.addPoint(50, 20, t0 + 20);
  tracker.addPoint(100, 40, t0 + 40);

  const vel = tracker.getVelocity(t0 + 40);
  assert.ok(vel.vx > 2000, `X velocity should reflect fast drag (got ${vel.vx} px/s)`);
  assert.ok(vel.vy > 800, `Y velocity should reflect fast drag (got ${vel.vy} px/s)`);
});
