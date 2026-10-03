import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  MOTORWORLD_DATABASE, 
  searchMotorworldDatabase 
} from '../src/data/motorworldIntelligence.ts';
import { 
  CUSTODIAN_ANALYTICS_STABLE, 
  FLEET_SCATTER_DATA, 
  COMMUNITY_ARCHETYPE_SHARE 
} from '../src/data/userAnalyticsData.ts';

test('1. searchMotorworldDatabase matches vehicles by chassis code and make', () => {
  const g80Results = searchMotorworldDatabase('G80');
  assert.ok(g80Results.length >= 1, 'Should find at least 1 G80 result');
  assert.equal(g80Results[0].chassisCode, 'G80-M3-COMP-LCI');

  const porscheResults = searchMotorworldDatabase('porsche');
  assert.ok(porscheResults.length >= 1);
  assert.equal(porscheResults[0].make, 'Porsche');
});

test('2. searchMotorworldDatabase finds vehicles by technical fluid viscosity', () => {
  const tenW60Results = searchMotorworldDatabase('10W-60');
  assert.ok(tenW60Results.length >= 2, 'Should match multiple high-performance NA/Turbo engines using 10W-60 (e.g. E46 CSL, Vantage, Escort RS)');
  const chassisCodes = tenW60Results.map(r => r.chassisCode);
  assert.ok(chassisCodes.includes('E46-M3-CSL') || chassisCodes.includes('VH2-VANTAGE'));
});

test('3. searchMotorworldDatabase finds vehicles by MOT failure defects', () => {
  const drcResults = searchMotorworldDatabase('DRC');
  assert.ok(drcResults.length >= 1, 'Should find Audi RS4 with DRC hydraulic suspension defect');
  assert.equal(drcResults[0].model, 'RS4 Avant');

  const subframeResults = searchMotorworldDatabase('subframe');
  assert.ok(subframeResults.length >= 1, 'Should find BMW E46 CSL with subframe floor crack defect');
});

test('4. DVSA MOT Analytics contain valid pass rates and sample counts', () => {
  for (const [key, profile] of Object.entries(MOTORWORLD_DATABASE)) {
    assert.ok(profile.dvsaMotAnalytics.overallFirstTimePassRate > 60 && profile.dvsaMotAnalytics.overallFirstTimePassRate <= 100, 
      `${key} pass rate must be between 60% and 100%`);
    assert.ok(profile.dvsaMotAnalytics.testSampleCount > 100, 
      `${key} test sample count must be substantial`);
    assert.ok(profile.dvsaMotAnalytics.topFailureCategories.length > 0, 
      `${key} must have top failure categories`);
  }
});

test('5. HowManyLeft UK Census calculates valid total fleet and rarity tier', () => {
  for (const [key, profile] of Object.entries(MOTORWORLD_DATABASE)) {
    const census = profile.howManyLeftCensus;
    assert.equal(census.totalUkFleet, census.licensedCount + census.sornCount, 
      `${key} total fleet must equal licensed + sorn`);
    assert.ok(['Extinct', 'Ultra-Rare', 'Heritage Low', 'Enthusiast Core', 'Plentiful'].includes(census.rarityTier), 
      `${key} rarity tier must be standard`);
  }
});

test('6. Fluids and Service Codex has valid dry and wet brake fluid boiling points', () => {
  for (const [key, profile] of Object.entries(MOTORWORLD_DATABASE)) {
    const fluids = profile.fluidsAndServiceCodex;
    assert.ok(fluids.brakeFluid.dryBoilingPointC > fluids.brakeFluid.wetBoilingPointC, 
      `${key} dry boiling point must exceed wet boiling point`);
    assert.ok(fluids.engineOil.sumpCapacityLitres > 3.0, 
      `${key} sump capacity must be greater than 3.0L`);
  }
});

test('7. Custodian Analytics totals and telemetry points are coherent', () => {
  assert.ok(CUSTODIAN_ANALYTICS_STABLE.totalLoggedMiles > 20000);
  assert.equal(CUSTODIAN_ANALYTICS_STABLE.monthlyTelemetry.length, 6);
  
  // Grip exposure percentages must sum to 100%
  const totalGripPct = CUSTODIAN_ANALYTICS_STABLE.gripExposure.reduce((sum, item) => sum + item.percentage, 0);
  assert.equal(totalGripPct, 100, 'Grip exposure percentages must sum to 100');

  // Environment split percentages must sum to 100%
  const totalEnvPct = CUSTODIAN_ANALYTICS_STABLE.environmentSplit.reduce((sum, item) => sum + item.percentage, 0);
  assert.equal(totalEnvPct, 100, 'Environment split percentages must sum to 100');
});

test('8. Fleet Scatter Data calculates positive power to weight and 0-60', () => {
  assert.ok(FLEET_SCATTER_DATA.length >= 10);
  for (const point of FLEET_SCATTER_DATA) {
    assert.ok(point.powerToWeight > 100, `${point.name} must have power to weight > 100 BHP/T`);
    assert.ok(point.zeroToSixty > 2.0 && point.zeroToSixty < 10.0, `${point.name} 0-60 must be realistic`);
  }

  const activeCar = FLEET_SCATTER_DATA.find(p => p.isActiveVehicle);
  assert.ok(activeCar, 'Must have active vehicle identified in scatter data');
});
