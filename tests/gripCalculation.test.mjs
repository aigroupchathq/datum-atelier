import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRoadGrip } from '../src/utils/gripCalculation.ts';

test('1. Baseline rule: Dry + Warm road must give higher grip than Rain + Freezing road', () => {
  const dryWarm = calculateRoadGrip({
    surfaceTempC: 22,
    airTempC: 20,
    surfaceCondition: 'Dry Asphalt',
    rainMmPerHour: 0,
    tyreTempC: 45
  });

  const rainFreezing = calculateRoadGrip({
    surfaceTempC: -2,
    airTempC: -1,
    surfaceCondition: 'Frost Hazard',
    rainMmPerHour: 2.5,
    tyreTempC: 8
  });

  assert.equal(dryWarm.isValid, true);
  assert.equal(rainFreezing.isValid, true);
  assert.ok(dryWarm.frictionNumber > rainFreezing.frictionNumber, 'Dry warm road must have higher grip than freezing rain');
  assert.equal(dryWarm.badgeTone, 'green');
  assert.equal(rainFreezing.badgeTone, 'red');
  assert.equal(rainFreezing.iconKind, 'snowflake');
});

test('2. Missing data rule: Missing both surface and air temp must return "Not enough data" and never guess', () => {
  const missingData = calculateRoadGrip({
    surfaceTempC: null,
    airTempC: null
  });

  assert.equal(missingData.isValid, false);
  assert.equal(missingData.frictionNumber, null);
  assert.equal(missingData.headline, 'Grip: Not enough data');
  assert.equal(missingData.badgeTone, 'grey');
  assert.equal(missingData.iconKind, 'help-circle');
  assert.ok(missingData.statusDescription.includes('Missing temperature data'));
});

test('3. Extreme / corrupted sensor readings must be rejected safely', () => {
  const wildHigh = calculateRoadGrip({ surfaceTempC: 999 });
  assert.equal(wildHigh.isValid, false);
  assert.equal(wildHigh.frictionNumber, null);
  assert.equal(wildHigh.headline, 'Grip: Not enough data');

  const wildLow = calculateRoadGrip({ surfaceTempC: -150 });
  assert.equal(wildLow.isValid, false);
  assert.equal(wildLow.frictionNumber, null);
});

test('4. Progressive water penalty: More rain must progressively lower friction', () => {
  const dry = calculateRoadGrip({ surfaceTempC: 15, rainMmPerHour: 0 });
  const lightRain = calculateRoadGrip({ surfaceTempC: 15, rainMmPerHour: 1.0 });
  const torrentialRain = calculateRoadGrip({ surfaceTempC: 15, rainMmPerHour: 12.0 });

  assert.ok(dry.frictionNumber > lightRain.frictionNumber, 'Light rain must have less grip than dry');
  assert.ok(lightRain.frictionNumber > torrentialRain.frictionNumber, 'Torrential rain must have less grip than light rain');
});

test('5. Tyre warmth benefit: Warm tyres must provide better adhesion than cold tyres on identical roads', () => {
  const coldTyres = calculateRoadGrip({ surfaceTempC: 12, tyreTempC: 5 });
  const warmTyres = calculateRoadGrip({ surfaceTempC: 12, tyreTempC: 50 });

  assert.ok(warmTyres.frictionNumber > coldTyres.frictionNumber, 'Warm tyres must conform better than freezing cold tyres');
});

test('6. Attribution and freshness stamps are always attached', () => {
  const result = calculateRoadGrip(
    { surfaceTempC: 18, airTempC: 16 },
    'Met Office UK Road Sensors',
    'Updated 2 min ago'
  );

  assert.equal(result.sourceAttribution, 'Met Office UK Road Sensors');
  assert.equal(result.freshness, 'Updated 2 min ago');
});
