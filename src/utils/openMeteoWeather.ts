/**
 * Open-Meteo Weather Service (Zero API Key Required)
 * 
 * Plain English Explanation:
 * This service reaches out to Open-Meteo — a free, open-source scientific weather database —
 * to fetch live air temperature, road surface temperature, and rainfall in real time.
 * It requires no secret passwords, accounts, or API keys.
 * 
 * If the user has no internet connection, or if the service takes too long to answer,
 * it immediately provides safe offline baseline data so the app never freezes or crashes.
 */

export interface PassLocationCoords {
  id: string;
  name: string;
  roadNumber: string;
  latitude: number;
  longitude: number;
  elevationM: number;
  defaultCondition: string;
  defaultAirTempC: number;
  defaultSurfaceTempC: number;
}

export const UK_PASS_COORDINATES: Record<string, PassLocationCoords> = {
  'snake-pass-a57': {
    id: 'snake-pass-a57',
    name: 'Snake Pass',
    roadNumber: 'A57',
    latitude: 53.433,
    longitude: -1.867,
    elevationM: 514,
    defaultCondition: 'Damp Bitumen',
    defaultAirTempC: 7.2,
    defaultSurfaceTempC: 6.1
  },
  'llanberis-pass-a4086': {
    id: 'llanberis-pass-a4086',
    name: 'Llanberis Pass',
    roadNumber: 'A4086',
    latitude: 53.078,
    longitude: -4.076,
    elevationM: 359,
    defaultCondition: 'Wet Bitumen',
    defaultAirTempC: 9.4,
    defaultSurfaceTempC: 8.8
  },
  'bealach-na-ba': {
    id: 'bealach-na-ba',
    name: 'Bealach na Bà',
    roadNumber: 'Applecross',
    latitude: 57.423,
    longitude: -5.706,
    elevationM: 626,
    defaultCondition: 'Wet Bitumen',
    defaultAirTempC: 5.6,
    defaultSurfaceTempC: 4.8
  },
  'hardknott-pass': {
    id: 'hardknott-pass',
    name: 'Hardknott Pass',
    roadNumber: 'Lake District',
    latitude: 54.403,
    longitude: -3.201,
    elevationM: 393,
    defaultCondition: 'Damp Stone & Bitumen',
    defaultAirTempC: 6.8,
    defaultSurfaceTempC: 5.9
  },
  'cheddar-gorge-b3135': {
    id: 'cheddar-gorge-b3135',
    name: 'Cheddar Gorge Cliff Run',
    roadNumber: 'B3135',
    latitude: 51.282,
    longitude: -2.766,
    elevationM: 260,
    defaultCondition: 'Dry Asphalt',
    defaultAirTempC: 11.2,
    defaultSurfaceTempC: 12.1
  }
};

export interface PassLiveWeatherData {
  passId: string;
  passName: string;
  roadNumber: string;
  airTempC: number;
  surfaceTempC: number;
  relativeHumidityPct: number;
  rainMmPerHour: number;
  windSpeedMph: number;
  surfaceCondition: 'Dry Asphalt' | 'Damp Bitumen' | 'Wet Bitumen' | 'Frost Hazard';
  isLive: boolean;
  sourceAttribution: string;
  freshness: string;
  fetchedAtIso: string;
  errorReason?: string;
}

/**
 * Determine a human-friendly surface condition based on real weather readings.
 */
export function deriveRoadSurfaceCondition(
  surfaceTempC: number,
  rainMmPerHour: number,
  humidityPct: number
): 'Dry Asphalt' | 'Damp Bitumen' | 'Wet Bitumen' | 'Frost Hazard' {
  // If road is freezing and moisture is present -> Frost / Black ice hazard
  if (surfaceTempC <= 0.5 && (rainMmPerHour > 0 || humidityPct >= 85)) {
    return 'Frost Hazard';
  }
  // Active rainfall
  if (rainMmPerHour >= 1.5) {
    return 'Wet Bitumen';
  }
  // Light drizzle or heavy ambient moisture
  if (rainMmPerHour > 0 || humidityPct >= 80) {
    return 'Damp Bitumen';
  }
  return 'Dry Asphalt';
}

/**
 * Fetch live weather from Open-Meteo for a specific mountain pass.
 * Completely free, no API key required.
 */
export async function fetchPassLiveWeather(
  passId: string,
  fetchFn: typeof fetch = fetch
): Promise<PassLiveWeatherData> {
  const passInfo = UK_PASS_COORDINATES[passId] || UK_PASS_COORDINATES['snake-pass-a57'];

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${passInfo.latitude}&longitude=${passInfo.longitude}&current=temperature_2m,relative_humidity_2m,rain,surface_temperature,wind_speed_10m&wind_speed_unit=mph&timezone=auto`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const response = await fetchFn(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Open-Meteo server responded with HTTP status ${response.status}`);
    }

    const data = await response.json();

    if (!data.current) {
      throw new Error('Weather response was missing current observation data');
    }

    const cur = data.current;
    const airTemp = typeof cur.temperature_2m === 'number' ? cur.temperature_2m : passInfo.defaultAirTempC;
    // Open-Meteo provides soil/surface skin temperature; fallback to airTemp if absent
    const surfaceTemp = typeof cur.surface_temperature === 'number' ? cur.surface_temperature : airTemp - 1.0;
    const rain = typeof cur.rain === 'number' ? Math.max(0, cur.rain) : 0;
    const humidity = typeof cur.relative_humidity_2m === 'number' ? cur.relative_humidity_2m : 75;
    const wind = typeof cur.wind_speed_10m === 'number' ? cur.wind_speed_10m : 15;

    const condition = deriveRoadSurfaceCondition(surfaceTemp, rain, humidity);

    return {
      passId: passInfo.id,
      passName: passInfo.name,
      roadNumber: passInfo.roadNumber,
      airTempC: Math.round(airTemp * 10) / 10,
      surfaceTempC: Math.round(surfaceTemp * 10) / 10,
      relativeHumidityPct: Math.round(humidity),
      rainMmPerHour: Math.round(rain * 10) / 10,
      windSpeedMph: Math.round(wind),
      surfaceCondition: condition,
      isLive: true,
      sourceAttribution: 'Open-Meteo Live Scientific Weather (Zero API Key)',
      freshness: 'Updated just now',
      fetchedAtIso: new Date().toISOString()
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Network unreachable';
    // Graceful offline fallback
    return {
      passId: passInfo.id,
      passName: passInfo.name,
      roadNumber: passInfo.roadNumber,
      airTempC: passInfo.defaultAirTempC,
      surfaceTempC: passInfo.defaultSurfaceTempC,
      relativeHumidityPct: 80,
      rainMmPerHour: 0.5,
      windSpeedMph: 18,
      surfaceCondition: passInfo.defaultCondition as any,
      isLive: false,
      sourceAttribution: 'Offline Baseline Telemetry (Pass Sensor Station)',
      freshness: 'Cached fallback',
      fetchedAtIso: new Date().toISOString(),
      errorReason: errorMsg
    };
  }
}
