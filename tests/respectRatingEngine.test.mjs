import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  calculateDriveCadence, 
  calculateCustodianTier,
  EXPEDITION_PRESETS 
} from '../src/utils/respectRatingEngine.ts';

test('1. Full route with mid-way waypoint photo and wet weather yields S or EX rank', () => {
  const result = calculateDriveCadence({
    routeCompleted: true,
    waypointPhotosCount: 2,
    frictionMu: 0.62, // Wet rain tarmac
    durationMinutes: 45,
    flowContinuityRatio: 0.95
  });

  assert.equal(result.totalScore >= 90, true, `Score ${result.totalScore} must be >= 90`);
  assert.ok(['S', 'EX'].includes(result.rank), `Rank ${result.rank} must be S or EX`);
  assert.ok(result.respectsEarned >= 12, `Must earn at least 12 respects (earned ${result.respectsEarned})`);
  assert.equal(result.breakdown.routeCompletionPts, 40);
  assert.equal(result.breakdown.waypointCapturePts, 25);
  assert.equal(result.breakdown.gripAccordPts, 20);
});

test('2. Mid-way waypoint photo directly increases score and awards bonus respects', () => {
  const withoutWaypoint = calculateDriveCadence({
    routeCompleted: true,
    waypointPhotosCount: 0,
    frictionMu: 0.80,
    durationMinutes: 30,
    flowContinuityRatio: 0.80
  });

  const withWaypoint = calculateDriveCadence({
    routeCompleted: true,
    waypointPhotosCount: 1,
    frictionMu: 0.80,
    durationMinutes: 30,
    flowContinuityRatio: 0.80
  });

  assert.ok(
    withWaypoint.totalScore > withoutWaypoint.totalScore,
    'Capturing a mid-way waypoint must increase the cadence score'
  );
  assert.ok(
    withWaypoint.respectsEarned > withoutWaypoint.respectsEarned,
    'Capturing a mid-way waypoint must earn more respects'
  );
  assert.equal(withWaypoint.breakdown.waypointCapturePts, 20);
});

test('3. Reporting a road hazard awards community alert respects', () => {
  const baseline = calculateDriveCadence({
    routeCompleted: true,
    waypointPhotosCount: 1,
    durationMinutes: 25,
    hazardReported: false
  });

  const withHazard = calculateDriveCadence({
    routeCompleted: true,
    waypointPhotosCount: 1,
    durationMinutes: 25,
    hazardReported: true
  });

  assert.equal(withHazard.respectsEarned, baseline.respectsEarned + 2);
});

test('4. Custodian Tier progression advances logically from Pilot to Artisan to Apex Custodian', () => {
  const newDriver = calculateCustodianTier(45);
  assert.equal(newDriver.tier, 'PILOT');
  assert.equal(newDriver.tierTitle, 'Expedition Pilot');

  const regularExplorer = calculateCustodianTier(320);
  assert.equal(regularExplorer.tier, 'ARTISAN');
  assert.equal(regularExplorer.tierTitle, 'Artisan Pilot');

  const veteran = calculateCustodianTier(1200);
  assert.equal(veteran.tier, 'APEX_CUSTODIAN');
  assert.equal(veteran.tierTitle, 'Apex Custodian');

  const legendary = calculateCustodianTier(3500);
  assert.equal(legendary.tier, 'MASTER_OF_THE_MACHINE');
});

test('5. Expedition presets provide sensible data and authentic UK mountain pass metadata', () => {
  assert.ok(EXPEDITION_PRESETS.length >= 4);
  const snakePass = EXPEDITION_PRESETS.find(p => p.id === 'dawn-patrol');
  assert.ok(snakePass);
  assert.ok(snakePass.passName.includes('Snake Pass'));
  assert.ok(snakePass.frictionMu > 0 && snakePass.frictionMu < 1.0);
  assert.ok(snakePass.caption.length > 20);
});
