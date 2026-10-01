import { test } from 'node:test';
import assert from 'node:assert/strict';
import { 
  deriveRoadSurfaceCondition, 
  fetchPassLiveWeather,
  UK_PASS_COORDINATES 
} from '../src/utils/openMeteoWeather.ts';
import { calculateRoadGrip } from '../src/utils/gripCalculation.ts';

test('1. deriveRoadSurfaceCondition: Freezing road with moisture triggers Frost Hazard', () => {
  const freezingWet = deriveRoadSurfaceCondition(-1.5, 0.4, 90);
  assert.equal(freezingWet, 'Frost Hazard', 'Sub-zero temperatures with moisture must return Frost Hazard');

  const freezingHighHumid = deriveRoadSurfaceCondition(0.2, 0, 88);
  assert.equal(freezingHighHumid, 'Frost Hazard', 'Near-freezing road with high humidity must warn of Frost Hazard');
});

test('2. deriveRoadSurfaceCondition: Active rain triggers Wet Bitumen, dry warm returns Dry Asphalt', () => {
  const heavyRain = deriveRoadSurfaceCondition(12.0, 3.5, 95);
  assert.equal(heavyRain, 'Wet Bitumen', 'Rain above 1.5mm/h must return Wet Bitumen');

  const dryWarm = deriveRoadSurfaceCondition(22.0, 0, 45);
  assert.equal(dryWarm, 'Dry Asphalt', 'Warm dry conditions must return Dry Asphalt');
});

test('3. fetchPassLiveWeather handles successful Open-Meteo responses without API keys', async () => {
  // Mock successful response from Open-Meteo
  const mockFetch = async () => ({
    ok: true,
    status: 200,
    json: async () => ({
      current: {
        time: '2026-10-01T21:45',
        temperature_2m: 10.6,
        surface_temperature: 9.4,
        rain: 0.0,
        relative_humidity_2m: 78,
        wind_speed_10m: 16.5
      }
    })
  });

  const weather = await fetchPassLiveWeather('snake-pass-a57', mockFetch);

  assert.equal(weather.isLive, true, 'Weather should be marked as live');
  assert.equal(weather.airTempC, 10.6, 'Air temperature should match mock');
  assert.equal(weather.surfaceTempC, 9.4, 'Surface temperature should match mock');
  assert.equal(weather.passName, 'Snake Pass', 'Pass name should match');
  assert.match(weather.sourceAttribution, /Open-Meteo/, 'Attribution should cite Open-Meteo');
});

test('4. fetchPassLiveWeather handles network failure gracefully without crashing', async () => {
  // Mock failing network
  const failingFetch = async () => {
    throw new Error('Connection refused (offline test)');
  };

  const weather = await fetchPassLiveWeather('snake-pass-a57', failingFetch);

  assert.equal(weather.isLive, false, 'Weather should indicate offline fallback');
  assert.equal(typeof weather.airTempC, 'number', 'Air temperature must still be a valid number');
  assert.equal(typeof weather.surfaceTempC, 'number', 'Surface temp must still be a valid number');
  assert.match(weather.sourceAttribution, /Offline Baseline/, 'Attribution must be transparent about offline state');
  assert.ok(weather.errorReason, 'Error reason must be recorded');
});

test('5. Seamless integration: Open-Meteo output calculates valid Road Grip', async () => {
  const mockFetch = async () => ({
    ok: true,
    status: 200,
    json: async () => ({
      current: {
        temperature_2m: 4.2,
        surface_temperature: 3.1,
        rain: 1.8,
        relative_humidity_2m: 92,
        wind_speed_10m: 22.0
      }
    })
  });

  const liveWeather = await fetchPassLiveWeather('llanberis-pass-a4086', mockFetch);
  
  const gripResult = calculateRoadGrip({
    surfaceTempC: liveWeather.surfaceTempC,
    airTempC: liveWeather.airTempC,
    rainMmPerHour: liveWeather.rainMmPerHour,
    surfaceCondition: liveWeather.surfaceCondition,
    tyreTempC: 30
  }, liveWeather.sourceAttribution, liveWeather.freshness);

  assert.equal(gripResult.isValid, true, 'Grip result must be valid');
  assert.ok(gripResult.frictionNumber > 0.4 && gripResult.frictionNumber < 0.9, 'Friction number should be in realistic damp/wet range');
  assert.match(gripResult.headline, /^Grip:/, 'Headline must use plain English prefix');
  assert.ok(gripResult.drivingAdvice.length > 5, 'Driving advice must be provided');
});
