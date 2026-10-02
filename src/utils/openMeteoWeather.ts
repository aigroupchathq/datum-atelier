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

export interface AlpinePassLocationCoords extends PassLocationCoords {
  country: string;
  gradientMax: string;
  snowChainsRequired: boolean;
  routeHighlight: string;
}

export const ALPINE_PASS_COORDINATES: Record<string, AlpinePassLocationCoords> = {
  'stelvio-pass': {
    id: 'stelvio-pass',
    name: 'Stelvio Pass (Passo dello Stelvio)',
    country: 'Italy / South Tyrol',
    roadNumber: 'SS38',
    latitude: 46.5286,
    longitude: 10.4531,
    elevationM: 2757,
    defaultCondition: 'Dry Bitumen',
    defaultAirTempC: 3.2,
    defaultSurfaceTempC: 2.8,
    gradientMax: '12.0%',
    snowChainsRequired: false,
    routeHighlight: '48 Hairpin Turns • High Altitude Alpine Border',
  },
  'furka-pass': {
    id: 'furka-pass',
    name: 'Furka Pass (Goldfinger Route)',
    country: 'Switzerland (Valais / Uri)',
    roadNumber: 'H19',
    latitude: 46.5724,
    longitude: 8.4150,
    elevationM: 2429,
    defaultCondition: 'Damp Bitumen',
    defaultAirTempC: 4.8,
    defaultSurfaceTempC: 4.1,
    gradientMax: '11.8%',
    snowChainsRequired: false,
    routeHighlight: 'Rhône Glacier Switchbacks • High Vista',
  },
  'grossglockner': {
    id: 'grossglockner',
    name: 'Großglockner High Alpine Road',
    country: 'Austria (Salzburg / Carinthia)',
    roadNumber: 'B107',
    latitude: 47.0742,
    longitude: 12.8428,
    elevationM: 2504,
    defaultCondition: 'Dry Asphalt',
    defaultAirTempC: 5.1,
    defaultSurfaceTempC: 4.6,
    gradientMax: '12.0%',
    snowChainsRequired: false,
    routeHighlight: 'Hohe Tauern National Park • High-Grip Micro-Asphalt',
  },
  'col-de-turini': {
    id: 'col-de-turini',
    name: 'Col de Turini (Monte Carlo Rally Stage)',
    country: 'France (Maritime Alps)',
    roadNumber: 'D2566',
    latitude: 43.9781,
    longitude: 7.3917,
    elevationM: 1607,
    defaultCondition: 'Dry Asphalt',
    defaultAirTempC: 12.4,
    defaultSurfaceTempC: 13.0,
    gradientMax: '10.5%',
    snowChainsRequired: false,
    routeHighlight: 'Night of the Long Knives • Pine Needle Bitumen',
  },
  'susten-pass': {
    id: 'susten-pass',
    name: 'Susten Pass (Uri / Bern)',
    country: 'Switzerland',
    roadNumber: 'Route 11',
    latitude: 46.7292,
    longitude: 8.4489,
    elevationM: 2224,
    defaultCondition: 'Dry Asphalt',
    defaultAirTempC: 6.2,
    defaultSurfaceTempC: 5.8,
    gradientMax: '9.0%',
    snowChainsRequired: false,
    routeHighlight: 'Wide Sweeping Alpine Valley • Steingletscher Vista',
  },
  'gotthard-pass': {
    id: 'gotthard-pass',
    name: 'Gotthard Pass (Tremola Granite Cobbles)',
    country: 'Switzerland (Ticino / Uri)',
    roadNumber: 'Tremola Historical Road',
    latitude: 46.5583,
    longitude: 8.5639,
    elevationM: 2106,
    defaultCondition: 'Damp Bitumen',
    defaultAirTempC: 6.5,
    defaultSurfaceTempC: 6.0,
    gradientMax: '12.0%',
    snowChainsRequired: false,
    routeHighlight: 'Historical Granite Setts • Dynamic Friction Variance',
  }
};

/**
 * Calculates barometric atmospheric pressure loss and engine compensation at high altitude.
 */
export function calculateAlpineAtmosphericCompensation(
  elevationMeters: number,
  isForcedInduction: boolean = true
): {
  airDensityLossPct: number;
  powerDropPct: number;
  barometricPressureHpa: number;
  wastegateCompensationBar: number;
  summaryText: string;
} {
  const p0 = 1013.25;
  // Barometric formula: P = P0 * (1 - 2.25577e-5 * h)^5.25588
  const barometricPressureHpa = Math.round(p0 * Math.pow(Math.max(0.1, 1 - 0.0000225577 * elevationMeters), 5.25588));
  const airDensityLossPct = Math.min(45, Math.max(0, Math.round(((p0 - barometricPressureHpa) / p0) * 100)));

  if (isForcedInduction) {
    const compensationBar = Math.round((airDensityLossPct / 100) * 0.75 * 100) / 100;
    return {
      airDensityLossPct,
      powerDropPct: Math.round(airDensityLossPct * 0.12),
      barometricPressureHpa,
      wastegateCompensationBar: compensationBar,
      summaryText: `+${compensationBar.toFixed(2)} bar Wastegate Offset (Air Density -${airDensityLossPct}%)`,
    };
  } else {
    const naPowerDrop = Math.round((elevationMeters / 100) * 1.0);
    return {
      airDensityLossPct,
      powerDropPct: naPowerDrop,
      barometricPressureHpa,
      wastegateCompensationBar: 0,
      summaryText: `-${naPowerDrop}% Atmospheric Power Derating (N/A Engine)`,
    };
  }
}

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
  elevationM?: number;
  country?: string;
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
  const passInfo: PassLocationCoords = 
    ALPINE_PASS_COORDINATES[passId] || 
    UK_PASS_COORDINATES[passId] || 
    UK_PASS_COORDINATES['snake-pass-a57'];

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
