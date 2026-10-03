import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseKinematicSnippet,
  calculateKinematicMatch,
  CURATED_SNIPPETS
} from '../src/core/algorithm/semanticKinematicEngine.ts';

test('1. parseKinematicSnippet deconstructs arbitrary automotive forum text into multi-dimensional vectors', () => {
  const input = 'Looking for a BMW M3 G80 with KW V4 3-way dampers tackling damp British B-roads like Snake Pass with 1.2G lateral grip';
  const result = parseKinematicSnippet(input);

  assert.equal(result.rawText, input);
  assert.ok(result.detectedVectors.length >= 4, 'Should detect chassis, hardware, kinematics, topography');

  const categories = result.detectedVectors.map(v => v.category);
  assert.ok(categories.includes('chassis'), 'Should detect G80 chassis');
  assert.ok(categories.includes('hardware'), 'Should detect KW V4 dampers');
  assert.ok(categories.includes('topography'), 'Should detect Snake Pass');
  assert.ok(categories.includes('kinematics'), 'Should detect damp kinematics');

  assert.equal(result.kinematicTargetG, 1.2, 'Should parse 1.2G');
  assert.equal(result.adhesionTarget, 'damp', 'Should parse damp adhesion target');
});

test('2. parseKinematicSnippet handles pure analog classic spec correctly', () => {
  const input = '1989 E30 318is slicktop sunroof delete with 4.10 LSD and BBS wheels';
  const result = parseKinematicSnippet(input);

  assert.equal(result.inferredCategory, 'classic');
  const chassisVec = result.detectedVectors.find(v => v.category === 'chassis');
  assert.ok(chassisVec, 'Should detect E30');
  assert.ok(chassisVec.displayLabel.includes('E30'));

  const provVec = result.detectedVectors.find(v => v.category === 'provenance');
  assert.ok(provVec, 'Should detect factory slicktop provenance');
});

test('3. calculateKinematicMatch scores high-affinity vehicle higher than unrelated vehicle', () => {
  const parsed = parseKinematicSnippet('Porsche 911 GT3 Touring 992 4.0L naturally aspirated 9000 RPM manual');

  const defaultWeights = {
    mechanicalPurism: 85,
    surfaceGripTarget: 'all',
    kinematicIntensity: 75,
    provenanceStrictness: 50
  };

  const gt3Entity = {
    id: 'exp-02',
    category: 'supercar',
    authorHandle: 'kuro_gt3',
    authorName: 'KURO',
    authorCar: 'Porsche 911 GT3 (992)',
    caption: 'British suburban block-paved driveway cold start. 4.0L naturally aspirated flat-six 9,000 RPM idle warm-up.',
    telemetryTag: '9,000 RPM · 502 BHP',
    purismScore: 95,
    peakLateralG: 1.35,
    provenanceScore: 99
  };

  const unrelatedEntity = {
    id: 'exp-10',
    category: 'pass',
    authorHandle: 'overland_110',
    authorName: 'EXPEDITION',
    authorCar: 'Defender 110 V8',
    caption: 'Yorkshire Dales stone barn driveway shakedown. BFGoodrich KO2s aired down after Strata Florida river crossings.',
    telemetryTag: '900mm Wading · 18 PSI',
    purismScore: 55,
    peakLateralG: 0.65,
    provenanceScore: 96
  };

  const matchGt3 = calculateKinematicMatch(gt3Entity, parsed, defaultWeights);
  const matchDefender = calculateKinematicMatch(unrelatedEntity, parsed, defaultWeights);

  assert.ok(matchGt3.score > matchDefender.score, 'GT3 must score significantly higher than Defender for GT3 query');
  assert.ok(matchGt3.isStrongMatch, 'GT3 must be classified as a strong match');
  assert.ok(matchGt3.reasons.length > 0, 'Must provide human-readable engineering explanations for match');
});

test('4. Driver Algorithmic Weight Tuning adjusts rankings dynamically', () => {
  const parsed = parseKinematicSnippet('British weekend sports drive');

  const analogEntity = {
    id: 'e30',
    category: 'classic',
    authorHandle: 'e30_heritage',
    authorName: 'Dan',
    authorCar: 'BMW 318is (E30) Slicktop',
    caption: 'Victorian terraced street residential parking. 1989 E30 318is slicktop survivor with period-correct BBS basketweaves.',
    purismScore: 95
  };

  const hyperEntity = {
    id: '720s',
    category: 'supercar',
    authorHandle: 'valkyrie_720s',
    authorName: 'Valkyrie',
    authorCar: 'McLaren 720S Performance',
    caption: 'Papaya Spark in the evening shadows. 710 BHP twin-turbo V8, dry weight 1,419 kg.',
    purismScore: 50
  };

  // Tune weights heavily toward Analog Purist
  const puristWeights = {
    mechanicalPurism: 100,
    surfaceGripTarget: 'all',
    kinematicIntensity: 40,
    provenanceStrictness: 50
  };

  const analogScoreHigh = calculateKinematicMatch(analogEntity, parsed, puristWeights).score;
  const hyperScoreLow = calculateKinematicMatch(hyperEntity, parsed, puristWeights).score;
  assert.ok(analogScoreHigh > hyperScoreLow, 'Purist weighting must favor E30 analog car over twin-turbo hypercar');

  // Tune weights toward Modern Track Weapon
  const trackWeights = {
    mechanicalPurism: 20,
    surfaceGripTarget: 'all',
    kinematicIntensity: 90,
    provenanceStrictness: 50
  };

  const analogScoreLow = calculateKinematicMatch(analogEntity, parsed, trackWeights).score;
  const hyperScoreHigh = calculateKinematicMatch(hyperEntity, parsed, trackWeights).score;
  assert.ok(hyperScoreHigh > analogScoreLow, 'Modern weighting must favor twin-turbo 720S');
});

test('5. CURATED_SNIPPETS provide valid test scenarios with high vector coverage', () => {
  assert.equal(CURATED_SNIPPETS.length, 5);
  CURATED_SNIPPETS.forEach(s => {
    const parsed = parseKinematicSnippet(s.snippet);
    assert.ok(parsed.detectedVectors.length >= 2, `Snippet "${s.title}" should detect at least 2 vectors`);
  });
});
