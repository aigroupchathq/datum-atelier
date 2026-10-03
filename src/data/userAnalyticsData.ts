/**
 * DATUM USER & FLEET TELEMETRY ANALYTICS CORE
 * 
 * Provides analytical models and telemetry aggregations for:
 * 1. Active Custodian Driving Telemetry (Road friction histograms, elevation ascent, B-road vs track splits).
 * 2. Respect Velocity & Community Accolade Momentum.
 * 3. Power-to-Weight vs 0–60 MPH Performance Scatter Envelope.
 * 4. Archetype Fleet Distribution across the DATUM Motoring Society.
 * 5. Multi-Axis Chassis Attribute Radars.
 */

export interface MonthlyTelemetryPoint {
  month: string;
  loggedMiles: number;
  respectsEarned: number;
  averageFrictionMu: number;
  peakLateralG: number;
}

export interface GripExposureBucket {
  surfaceType: string;
  frictionRange: string;
  milesLogged: number;
  percentage: number;
  color: string;
}

export interface DrivingEnvironmentSplit {
  environment: string;
  percentage: number;
  miles: number;
  color: string;
}

export interface FleetScatterPoint {
  id: string;
  name: string;
  make: string;
  model: string;
  chassisCode: string;
  powerBhp: number;
  curbWeightKg: number;
  powerToWeight: number; // BHP per tonne
  zeroToSixty: number;   // seconds
  archetype: string;
  isActiveVehicle?: boolean;
}

export interface ChassisAttributeRadarPoint {
  attribute: string;
  activeVehicleScore: number;
  fleetAverageScore: number;
  fullMark: number;
}

export interface CustodianAnalyticsDossier {
  totalLoggedMiles: number;
  totalMountainAscentFeet: number;
  highestLateralGRecorded: number;
  lifetimeRespects: number;
  activeProvenanceScore: number;
  monthlyTelemetry: MonthlyTelemetryPoint[];
  gripExposure: GripExposureBucket[];
  environmentSplit: DrivingEnvironmentSplit[];
  chassisRadar: ChassisAttributeRadarPoint[];
}

export const CUSTODIAN_ANALYTICS_STABLE: CustodianAnalyticsDossier = {
  totalLoggedMiles: 24850,
  totalMountainAscentFeet: 48620,
  highestLateralGRecorded: 1.18,
  lifetimeRespects: 1840,
  activeProvenanceScore: 98,
  monthlyTelemetry: [
    { month: 'Nov', loggedMiles: 1420, respectsEarned: 180, averageFrictionMu: 0.74, peakLateralG: 1.12 },
    { month: 'Dec', loggedMiles: 980,  respectsEarned: 145, averageFrictionMu: 0.68, peakLateralG: 1.05 },
    { month: 'Jan', loggedMiles: 1150, respectsEarned: 160, averageFrictionMu: 0.62, peakLateralG: 1.08 },
    { month: 'Feb', loggedMiles: 1840, respectsEarned: 240, averageFrictionMu: 0.78, peakLateralG: 1.14 },
    { month: 'Mar', loggedMiles: 2680, respectsEarned: 390, averageFrictionMu: 0.88, peakLateralG: 1.18 },
    { month: 'Apr', loggedMiles: 3120, respectsEarned: 460, averageFrictionMu: 0.92, peakLateralG: 1.18 }
  ],
  gripExposure: [
    { surfaceType: 'Dry Warm Asphalt', frictionRange: 'µ ≥ 0.90', milesLogged: 12920, percentage: 52, color: '#F59E0B' },
    { surfaceType: 'Damp British Bitumen', frictionRange: '0.70 – 0.89 µ', milesLogged: 7455, percentage: 30, color: '#38BDF8' },
    { surfaceType: 'Standing Water / Rain', frictionRange: '0.50 – 0.69 µ', milesLogged: 3480, percentage: 14, color: '#818CF8' },
    { surfaceType: 'Frost & Cold Hazards', frictionRange: 'µ < 0.50', milesLogged: 995, percentage: 4, color: '#E11D48' }
  ],
  environmentSplit: [
    { environment: 'B-Road Canyon Passes', percentage: 54, miles: 13419, color: '#F59E0B' },
    { environment: 'Fast A-Road Transit', percentage: 26, miles: 6461, color: '#10B981' },
    { environment: 'Highland Expeditions', percentage: 14, miles: 3479, color: '#6366F1' },
    { environment: 'Circuit Trackdays', percentage: 6, miles: 1491, color: '#EC4899' }
  ],
  chassisRadar: [
    { attribute: 'Powertrain Output', activeVehicleScore: 92, fleetAverageScore: 68, fullMark: 100 },
    { attribute: 'Mechanical Character', activeVehicleScore: 88, fleetAverageScore: 74, fullMark: 100 },
    { attribute: 'Chassis Agility', activeVehicleScore: 84, fleetAverageScore: 76, fullMark: 100 },
    { attribute: 'All-Weather Adhesion', activeVehicleScore: 96, fleetAverageScore: 62, fullMark: 100 },
    { attribute: 'Braking Endurance', activeVehicleScore: 90, fleetAverageScore: 70, fullMark: 100 },
    { attribute: 'Provenance Integrity', activeVehicleScore: 98, fleetAverageScore: 78, fullMark: 100 }
  ]
};

export const FLEET_SCATTER_DATA: FleetScatterPoint[] = [
  { id: 'car-caterham-620r', name: '620R', make: 'Caterham', model: 'Seven 620R', chassisCode: 'SEVEN-620R', powerBhp: 310, curbWeightKg: 610, powerToWeight: 508, zeroToSixty: 2.79, archetype: 'Track Weapon' },
  { id: 'car-mclaren-720s', name: '720S', make: 'McLaren', model: '720S', chassisCode: 'P14-720S', powerBhp: 710, curbWeightKg: 1419, powerToWeight: 500, zeroToSixty: 2.80, archetype: 'Supercar & GT' },
  { id: 'car-porsche-911-gt3-992', name: 'KURO GT3', make: 'Porsche', model: '911 GT3 Touring', chassisCode: '992-GT3-TOURING', powerBhp: 502, curbWeightKg: 1418, powerToWeight: 354, zeroToSixty: 3.70, archetype: 'Analog Purist' },
  { id: 'car-bmw-m3-g80', name: 'MAYA M3', make: 'BMW', model: 'M3 Competition xDrive', chassisCode: 'G80-M3-COMP-LCI', powerBhp: 525, curbWeightKg: 1780, powerToWeight: 295, zeroToSixty: 3.40, archetype: 'Fast Wagon & Saloon', isActiveVehicle: true },
  { id: 'car-lotus-emira-v6', name: 'Emira V6', make: 'Lotus', model: 'Emira', chassisCode: 'EMIRA-V6-FIRST', powerBhp: 400, curbWeightKg: 1405, powerToWeight: 285, zeroToSixty: 4.20, archetype: 'Analog Purist' },
  { id: 'car-bmw-m3-e46-csl', name: 'M3 CSL', make: 'BMW', model: 'M3 CSL', chassisCode: 'E46-M3-CSL', powerBhp: 355, curbWeightKg: 1385, powerToWeight: 256, zeroToSixty: 4.80, archetype: 'Analog Purist' },
  { id: 'car-toyota-supra-a80', name: 'Supra A80', make: 'Toyota', model: 'Supra Twin Turbo', chassisCode: 'JZA80-2JZ-GTE', powerBhp: 326, curbWeightKg: 1570, powerToWeight: 208, zeroToSixty: 4.90, archetype: 'Homologation Legend' },
  { id: 'car-honda-type-r-fl5', name: 'Type R FL5', make: 'Honda', model: 'Civic Type R', chassisCode: 'FL5-K20C1', powerBhp: 325, curbWeightKg: 1430, powerToWeight: 227, zeroToSixty: 5.30, archetype: 'Hot Hatch' },
  { id: 'car-vw-golf-r-mk7', name: 'Golf R', make: 'Volkswagen', model: 'Golf R', chassisCode: 'MK7.5-GOLF-R', powerBhp: 306, curbWeightKg: 1483, powerToWeight: 206, zeroToSixty: 4.50, archetype: 'Hot Hatch' },
  { id: 'car-toyota-gr-yaris', name: 'GR Yaris', make: 'Toyota', model: 'GR Yaris Circuit', chassisCode: 'GXPA16-GR-FOUR', powerBhp: 257, curbWeightKg: 1280, powerToWeight: 201, zeroToSixty: 5.20, archetype: 'Hot Hatch' },
  { id: 'car-ford-fiesta-st-mk8', name: 'Fiesta ST', make: 'Ford', model: 'Fiesta ST', chassisCode: 'MK8-ST-PERF', powerBhp: 197, curbWeightKg: 1262, powerToWeight: 156, zeroToSixty: 6.50, archetype: 'Hot Hatch' },
  { id: 'car-defender-110-v8', name: 'Defender 110', make: 'Land Rover', model: 'Defender 110 V8', chassisCode: 'L663-DEFENDER-110-V8', powerBhp: 518, curbWeightKg: 2603, powerToWeight: 199, zeroToSixty: 5.10, archetype: 'Overland 4x4' },
  { id: 'car-vauxhall-zafira-vxr', name: 'Zafira VXR', make: 'Vauxhall', model: 'Zafira VXR', chassisCode: 'ZAFIRA-VXR-OPC', powerBhp: 237, curbWeightKg: 1590, powerToWeight: 149, zeroToSixty: 7.20, archetype: 'Hot Hatch' }
];

export const COMMUNITY_ARCHETYPE_SHARE = [
  { name: 'Hot Hatches (B-Road)', count: 48, percentage: 32, fill: '#F59E0B' },
  { name: 'Analog Purists', count: 34, percentage: 23, fill: '#10B981' },
  { name: 'Fast Saloons & Wagons', count: 28, percentage: 19, fill: '#6366F1' },
  { name: 'Homologation Icons', count: 18, percentage: 12, fill: '#EC4899' },
  { name: 'Track Weapons', count: 10, percentage: 7, fill: '#8B5CF6' },
  { name: 'Overland 4x4', count: 7, percentage: 5, fill: '#38BDF8' },
  { name: 'Historic & Restomod', count: 3, percentage: 2, fill: '#F97316' }
];
