import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CarnetVaultEngine } from '../src/core/carnet/CarnetVaultEngine.ts';
import { generateQrMatrix, generateQrSvg } from '../src/core/crypto/qrCodeGenerator.ts';
import { 
  ALPINE_PASS_COORDINATES, 
  calculateAlpineAtmosphericCompensation 
} from '../src/utils/openMeteoWeather.ts';

test('1. CarnetVaultEngine issues time-locked, cryptographically hashed transit tokens', () => {
  const vault = new CarnetVaultEngine();
  const vin = 'WBA-33AY-080P-M3COMP';
  const ownerPubKey = '0x7E3F...9A1B';
  const jurisdictions = ['GB', 'FR', 'CH', 'IT', 'AT'];
  
  const token = vault.issueToken(vin, ownerPubKey, jurisdictions, 'ATA_CARNET', 365);
  
  assert.ok(token.id.startsWith('CARNET-M3COMP-'), 'Token ID must contain sanitized VIN suffix');
  assert.equal(token.status, 'ACTIVE', 'New token must have ACTIVE status');
  assert.equal(token.coverageType, 'ATA_CARNET', 'Token coverage must match ATA_CARNET');
  assert.equal(token.jurisdictions.length, 5, 'Must record all 5 transit territories');
  assert.ok(token.tokenHash && token.tokenHash.length === 64, 'Token must contain 64-char SHA-256 hash');
  
  assert.equal(vault.isTokenValid(token.id), true, 'Active token must evaluate as valid');
  
  // Revocation
  vault.revokeToken(token.id);
  assert.equal(vault.isTokenValid(token.id), false, 'Revoked token must evaluate as invalid');
});

test('2. Customs clearance stamps form an immutable cryptographic hash chain', () => {
  const vault = new CarnetVaultEngine();
  const token = vault.issueToken('WBA-33AY-080P-M3COMP', '0xOWNER', ['GB', 'FR', 'CH'], 'ATA_CARNET', 365);
  
  // 1st Stamp: Dover / Folkestone Exportation
  const stamp1 = vault.recordClearanceStamp(token.id, {
    stationName: 'Eurotunnel Folkestone Shuttle Pier (GB)',
    countryCode: 'GB',
    checkpointType: 'EXPORT',
    officerBadge: 'BORDER-FORCE-UK-4412',
    customsSealCode: 'LCCI-SEAL-GB-2026',
    latitude: 51.0934,
    longitude: 1.1448
  });
  
  assert.equal(stamp1.previousStampHash, token.tokenHash, 'First stamp must chain to initial token hash');
  assert.ok(stamp1.merkleStampHash.length === 64, 'Stamp must have valid SHA-256 hash');
  
  // 2nd Stamp: Calais Coquelles Douane
  const stamp2 = vault.recordClearanceStamp(token.id, {
    stationName: 'Terminal Coquelles (Calais)',
    countryCode: 'FR',
    checkpointType: 'TRANSIT',
    officerBadge: 'DOUANE-FR-8821',
    customsSealCode: 'DOUANE-FR-REPUBLIQUE-2026'
  });
  
  assert.equal(stamp2.previousStampHash, stamp1.merkleStampHash, 'Second stamp must chain to first stamp hash');
  
  // 3rd Stamp: Basel St. Louis Zoll (CH)
  const stamp3 = vault.recordClearanceStamp(token.id, {
    stationName: 'Basel St. Louis Autobahn (EZV)',
    countryCode: 'CH',
    checkpointType: 'IMPORT',
    officerBadge: 'ZOLL-CH-1104',
    customsSealCode: 'EZV-CH-BASEL-ZOLL-A35'
  });
  
  assert.equal(stamp3.previousStampHash, stamp2.merkleStampHash, 'Third stamp must chain to second stamp hash');
  
  const stamps = vault.getClearanceStamps(token.id);
  assert.equal(stamps.length, 3, 'Must retain all 3 clearance stamps in sequence');
});

test('3. generateManifest produces a full LCCI/FIA compliant dossier with 40% customs bond', () => {
  const vault = new CarnetVaultEngine();
  const vin = 'WBA-33AY-080P-M3COMP';
  vault.issueToken(vin, '0xOWNER', ['GB', 'FR', 'CH'], 'ATA_CARNET', 365);
  
  const manifest = vault.generateManifest(vin, {
    callSign: 'MAYA',
    makeModel: 'BMW M3 Competition (G80)',
    agreedValueGbp: 89500,
    currency: 'GBP'
  });
  
  assert.equal(manifest.issuingChamber, 'London Chamber of Commerce & Industry (LCCI)');
  assert.equal(manifest.guaranteeAssociation, "Fédération Internationale de l'Automobile (FIA)");
  assert.equal(manifest.valuation.agreedValue, 89500);
  assert.equal(manifest.valuation.vatBondIndemnityRate, 0.40, 'Must enforce 40% EU VAT exemption bond rate');
  assert.equal(manifest.valuation.vatBondAmount, 35800, '40% of £89,500 must equal £35,800');
  assert.equal(manifest.councilSignatures.length, 4, 'Must contain 4-party quorum notary signatures');
  assert.ok(manifest.offlineEnclaveHash.length === 64, 'Must generate tamper-evident enclave hash');
});

test('4. calculateAlpineAtmosphericCompensation calculates barometric air density and turbo wastegate offsets', () => {
  // Stelvio Pass: 2,757m summit elevation
  const stelvioElev = ALPINE_PASS_COORDINATES['stelvio-pass'].elevationM;
  assert.equal(stelvioElev, 2757);
  
  // Forced Induction (Twin-Turbo)
  const turboComp = calculateAlpineAtmosphericCompensation(stelvioElev, true);
  assert.ok(turboComp.airDensityLossPct >= 25 && turboComp.airDensityLossPct <= 32, 'Stelvio must exhibit ~28% air density loss');
  assert.ok(turboComp.wastegateCompensationBar > 0.15, 'Twin-turbo wastegates must hold boost offset > 0.15 bar');
  assert.ok(turboComp.barometricPressureHpa < 750, 'Atmospheric pressure at 2757m must drop below 750 hPa');
  
  // Naturally Aspirated
  const naComp = calculateAlpineAtmosphericCompensation(stelvioElev, false);
  assert.equal(naComp.wastegateCompensationBar, 0, 'N/A engines have zero wastegate compensation');
  assert.ok(naComp.powerDropPct >= 26, 'N/A engines lose ~1% power per 100m');
});

test('5. generateQrMatrix and generateQrSvg generate compliant offline scannable QR codes', () => {
  const payload = 'CARNET:GB/LON/2026/8841-K:WBA33AY080P:0x7F4B';
  const qr = generateQrMatrix(payload);
  
  assert.ok(qr.size >= 21, 'QR size must be at least 21 modules');
  assert.equal(qr.modules.length, qr.size);
  assert.equal(qr.modules[0].length, qr.size);
  
  // Finder pattern checks: top-left 7x7 corner must have black outer box
  assert.equal(qr.modules[0][0], true, 'Top-left finder (0,0) must be dark');
  assert.equal(qr.modules[0][6], true, 'Top-left finder (0,6) must be dark');
  assert.equal(qr.modules[6][0], true, 'Top-left finder (6,0) must be dark');
  assert.equal(qr.modules[6][6], true, 'Top-left finder (6,6) must be dark');
  // Finder center 3x3 must be dark
  assert.equal(qr.modules[2][2], true, 'Finder core (2,2) must be dark');
  assert.equal(qr.modules[3][3], true, 'Finder core (3,3) must be dark');
  
  // SVG generation
  const svg = generateQrSvg(payload, { size: 180, margin: 2 });
  assert.ok(svg.includes('<svg'), 'Must render valid SVG element');
  assert.ok(svg.includes('viewBox='), 'SVG must declare viewBox');
  assert.ok(svg.includes('<path d='), 'SVG must contain crisp module path');
  assert.ok(svg.length > 500, 'SVG must be properly serialized');
});
