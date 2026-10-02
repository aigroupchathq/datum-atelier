import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateFiringFrequency,
  calculateValvetrainHarmonic,
  calculateTurboWhistleHz,
  generateAcousticHash,
  analyzeAcousticProfile,
  issueAcousticPassport,
  FLEET_ACOUSTIC_PROFILES
} from '../src/utils/acousticFingerprintEngine.ts';

test('1. calculateFiringFrequency adheres to four-stroke engine combustion physics', () => {
  // 6-cylinder engine at 750 RPM idle: (750 / 60) * (6 / 2) = 12.5 * 3 = 37.5 Hz
  const idle6Cyl = calculateFiringFrequency(750, 6);
  assert.equal(idle6Cyl, 37.5);

  // 6-cylinder engine at 7,200 RPM redline: (7200 / 60) * 3 = 120 * 3 = 360 Hz
  const redline6Cyl = calculateFiringFrequency(7200, 6);
  assert.equal(redline6Cyl, 360);

  // Porsche 911 GT3 6-cylinder at 9,000 RPM: (9000 / 60) * 3 = 150 * 3 = 450 Hz
  const gt3Redline = calculateFiringFrequency(9000, 6);
  assert.equal(gt3Redline, 450);

  // 4-cylinder engine at 6,900 RPM: (6900 / 60) * (4 / 2) = 115 * 2 = 230 Hz
  const e30Redline = calculateFiringFrequency(6900, 4);
  assert.equal(e30Redline, 230);

  // Zero / negative RPM safe handling
  assert.equal(calculateFiringFrequency(0, 6), 0);
  assert.equal(calculateFiringFrequency(-500, 6), 0);
});

test('2. calculateValvetrainHarmonic calculates mechanical clatter within expected audible bands', () => {
  const m3ValvetrainIdle = calculateValvetrainHarmonic(750, 4, 6);
  assert.ok(m3ValvetrainIdle > 50, 'Idle valvetrain should be audible');

  const m3ValvetrainRedline = calculateValvetrainHarmonic(7200, 4, 6);
  assert.ok(m3ValvetrainRedline > 600, 'Redline valvetrain clatter should exceed 600 Hz');
  assert.ok(m3ValvetrainRedline < 3000, 'Redline valvetrain clatter should remain below 3000 Hz');
});

test('3. calculateTurboWhistleHz discriminates forced induction from naturally aspirated engines', () => {
  // Naturally Aspirated (Porsche GT3) must not have turbo whistle
  const naWhistle = calculateTurboWhistleHz(8000, 9000, 'NA');
  assert.equal(naWhistle, undefined);

  // Twin-Turbo (BMW M3) must have progressive spool whistle
  const turboIdleWhistle = calculateTurboWhistleHz(750, 7200, 'TWIN_TURBO');
  const turboRedlineWhistle = calculateTurboWhistleHz(7200, 7200, 'TWIN_TURBO');
  
  assert.ok(typeof turboIdleWhistle === 'number');
  assert.ok(typeof turboRedlineWhistle === 'number');
  assert.ok(turboRedlineWhistle > turboIdleWhistle, 'Turbo spool frequency must rise with engine RPM');
});

test('4. generateAcousticHash is deterministic and collision resistant', () => {
  const hash1 = generateAcousticHash('S58B30A:7200:360:Akrapovic');
  const hash2 = generateAcousticHash('S58B30A:7200:360:Akrapovic');
  const hash3 = generateAcousticHash('MA275:9000:450:PorscheMotorsport');

  assert.equal(hash1, hash2, 'Identical acoustic inputs must generate identical hash');
  assert.notEqual(hash1, hash3, 'Different acoustic inputs must generate distinct hashes');
  assert.equal(hash1.length, 8, 'Hash must be 8-character hex string');
});

test('5. analyzeAcousticProfile correctly evaluates Anti-ASD Mechanical Authenticity', () => {
  const m3Profile = FLEET_ACOUSTIC_PROFILES['car-maya-m3'];
  const m3Analysis = analyzeAcousticProfile(m3Profile, 4500);

  assert.equal(m3Analysis.mechanicalAuthenticityScore, 99, 'Pure mechanical setup must score 99% authenticity');
  assert.ok(m3Analysis.decibelSpl >= m3Profile.baselineDbAtIdle);
  assert.ok(m3Analysis.decibelSpl <= m3Profile.fullThrottleDbAtRedline);
  
  // Ratios must sum to 100%
  const totalRatios = m3Analysis.harmonicRatios.subBassThrumPct + 
                      m3Analysis.harmonicRatios.exhaustThroatPct + 
                      m3Analysis.harmonicRatios.valvetrainChatterPct + 
                      m3Analysis.harmonicRatios.inductionHowlPct;
  assert.equal(totalRatios, 100, 'Harmonic ratios must sum to exactly 100%');

  // Verify synthetic speaker audio penalty
  const syntheticProfile = { ...m3Profile, isAsdSynthesizedSpeakerAudio: true };
  const syntheticAnalysis = analyzeAcousticProfile(syntheticProfile, 4500);
  assert.equal(syntheticAnalysis.mechanicalAuthenticityScore, 24, 'Synthetic speaker audio must be heavily penalized');
});

test('6. issueAcousticPassport generates a certified, cryptographically signed passport', () => {
  const gt3Profile = FLEET_ACOUSTIC_PROFILES['car-kuro-gt3'];
  const passport = issueAcousticPassport(gt3Profile);

  assert.ok(passport.passportNumber.startsWith('PASSPORT-ACOUSTIC-'));
  assert.equal(passport.vehicleName, 'KURO');
  assert.equal(passport.engineCode, 'MA275');
  assert.equal(passport.redlineHarmonicHz, 450);
  assert.equal(passport.activeSoundDesignStatus, 'ASD_BANNED_NATURAL_COMBUSTION');
  assert.equal(passport.ukNoiseComplianceStatus, 'STATIONARY_LEGAL_PASS');
  assert.ok(passport.cryptographicSignature.startsWith('0xSIG-'));
});
