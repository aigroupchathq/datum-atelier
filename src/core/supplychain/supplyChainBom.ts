import { sha256 } from '../crypto/sha256';

export type ComponentCategory =
  | 'Powertrain'
  | 'Suspension & Kinematics'
  | 'Exhaust & Induction'
  | 'Braking Friction'
  | 'Wheels & Tyres'
  | 'Tribology & Fluids'
  | 'Chassis & Structure';

export interface SerializedComponent {
  id: string;
  vehicleId: string;
  vin: string;
  partName: string;
  category: ComponentCategory;
  manufacturer: string;
  originCountry: string;
  originFacility: string;
  serialNumber: string;
  batchLotNumber: string;
  installationMileage: number;
  installationDate: string;
  installedByWorkshop: string;
  torqueSpec: string;
  isoStandardCert: string;
  serviceLifeRemainingPct: number;
  replacementIntervalMiles?: number;
  provenanceHash: string;
  engineeringRationale: string;
  verifiedByMasterMechanic?: boolean;
}

/**
 * Generates a deterministic SHA-256 cryptographic provenance hash for a serialized vehicle component.
 * Links the physical part directly to the vehicle's VIN and installation odometer.
 */
export function generateComponentHash(params: {
  vin: string;
  serialNumber: string;
  partName: string;
  batchLotNumber: string;
  installationMileage: number;
}): string {
  const payload = [
    params.vin.trim().toUpperCase(),
    params.partName.trim(),
    params.serialNumber.trim(),
    params.batchLotNumber.trim(),
    params.installationMileage.toString()
  ].join('::');

  return sha256(payload);
}

/**
 * Verifies that a component's cryptographic provenance hash matches its physical attributes.
 */
export function verifyComponentIntegrity(component: SerializedComponent): boolean {
  if (!component.provenanceHash || component.provenanceHash.length !== 64) {
    return false;
  }

  const expected = generateComponentHash({
    vin: component.vin,
    serialNumber: component.serialNumber,
    partName: component.partName,
    batchLotNumber: component.batchLotNumber,
    installationMileage: component.installationMileage
  });

  return expected.toLowerCase() === component.provenanceHash.toLowerCase();
}

/**
 * Calculates the overall supply chain integrity metrics for a vehicle's Bill of Materials.
 */
export function calculateSupplyChainHealth(components: SerializedComponent[]): {
  score: number;
  verifiedPct: number;
  counterfeitRisk: 'NONE' | 'LOW' | 'ELEVATED';
  componentsLogged: number;
  activeLifeAvg: number;
} {
  if (components.length === 0) {
    return {
      score: 70,
      verifiedPct: 0,
      counterfeitRisk: 'LOW',
      componentsLogged: 0,
      activeLifeAvg: 100
    };
  }

  const validHashes = components.filter(c => verifyComponentIntegrity(c)).length;
  const verifiedByMechanics = components.filter(c => c.verifiedByMasterMechanic).length;
  const totalLife = components.reduce((acc, c) => acc + c.serviceLifeRemainingPct, 0);

  const hashIntegrityRatio = validHashes / components.length;
  const mechanicRatio = verifiedByMechanics / components.length;
  const avgLife = Math.round(totalLife / components.length);

  // Supply chain traceability score (0 - 100)
  const score = Math.round(hashIntegrityRatio * 60 + mechanicRatio * 30 + 10);
  const verifiedPct = Math.round((mechanicRatio * 100));

  let counterfeitRisk: 'NONE' | 'LOW' | 'ELEVATED' = 'NONE';
  if (hashIntegrityRatio < 0.8) counterfeitRisk = 'ELEVATED';
  else if (mechanicRatio < 0.5) counterfeitRisk = 'LOW';

  return {
    score,
    verifiedPct,
    counterfeitRisk,
    componentsLogged: components.length,
    activeLifeAvg: avgLife
  };
}

/**
 * Curated baseline Bill of Materials (BOM) reflecting authentic European and British manufacturing lineages.
 */
export const DEFAULT_VEHICLE_BOMS: Record<string, SerializedComponent[]> = {
  'car-maya-m3': [
    {
      id: 'bom-m3-1',
      vehicleId: 'car-maya-m3',
      vin: 'WBA-31AY-0084-M3',
      partName: 'KW Variant 4 3-Way Independent Coilovers',
      category: 'Suspension & Kinematics',
      manufacturer: 'KW automotive GmbH',
      originCountry: 'Germany',
      originFacility: 'Fichtenberg, Baden-Württemberg',
      serialNumber: 'KW-V4-352-1088-DE',
      batchLotNumber: 'LOT-2024-Q3-8419',
      installationMileage: 38400,
      installationDate: '15 September 2024',
      installedByWorkshop: 'Litchfield Motors (Tewkesbury)',
      torqueSpec: 'Top mounts: 35 Nm • Lower strut clamp: 56 Nm + 90°',
      isoStandardCert: 'ISO 9001 / TÜV Teilegutachten #18-00492',
      serviceLifeRemainingPct: 92,
      replacementIntervalMiles: 60000,
      provenanceHash: '',
      engineeringRationale: 'Independent high/low-speed compression damping prevents secondary pitch over frost heaves on Cotswolds Roman Way.',
      verifiedByMasterMechanic: true
    },
    {
      id: 'bom-m3-2',
      vehicleId: 'car-maya-m3',
      vin: 'WBA-31AY-0084-M3',
      partName: 'Akrapovič Evolution Line Titanium Exhaust System',
      category: 'Exhaust & Induction',
      manufacturer: 'Akrapovič d.d.',
      originCountry: 'Slovenia',
      originFacility: 'Ivančna Gorica Foundry',
      serialNumber: 'AKR-EVO-TIT-0941',
      batchLotNumber: 'BATCH-TI-9981-SLO',
      installationMileage: 38450,
      installationDate: '18 September 2024',
      installedByWorkshop: 'Litchfield Motors (Tewkesbury)',
      torqueSpec: 'V-band flanges: 18 Nm • Hanger brackets: 22 Nm',
      isoStandardCert: 'ISO 14001 / ECE R59 Homologation Certified',
      serviceLifeRemainingPct: 98,
      replacementIntervalMiles: 150000,
      provenanceHash: '',
      engineeringRationale: 'Reduces 14.2 kg behind rear axle, optimizing static polar moment of inertia while eliminating backpressure for twin turbos.',
      verifiedByMasterMechanic: true
    },
    {
      id: 'bom-m3-3',
      vehicleId: 'car-maya-m3',
      vin: 'WBA-31AY-0084-M3',
      partName: 'Eventuri Sealed Carbon Fiber Intake Ducts',
      category: 'Exhaust & Induction',
      manufacturer: 'Eventuri UK Ltd',
      originCountry: 'United Kingdom',
      originFacility: 'Luton Composites Facility',
      serialNumber: 'EVT-G80-CF-2044',
      batchLotNumber: 'PREPREG-AUTOCLAVE-104',
      installationMileage: 38400,
      installationDate: '15 September 2024',
      installedByWorkshop: 'Litchfield Motors (Tewkesbury)',
      torqueSpec: 'Silicone coupler hose clamps: 4.5 Nm',
      isoStandardCert: 'Venturi Inverted Cone Aerodynamic Patent GB2531631',
      serviceLifeRemainingPct: 95,
      replacementIntervalMiles: 50000,
      provenanceHash: '',
      engineeringRationale: 'Maintains laminar airflow directly into S58 twin compressor housings, lowering intake air temperatures by 7°C.',
      verifiedByMasterMechanic: true
    },
    {
      id: 'bom-m3-4',
      vehicleId: 'car-maya-m3',
      vin: 'WBA-31AY-0084-M3',
      partName: 'Ferodo DS2500 High-Friction Track Compound Pads',
      category: 'Braking Friction',
      manufacturer: 'Federal-Mogul Motorparts',
      originCountry: 'Italy',
      originFacility: 'Mondovì Friction Plant',
      serialNumber: 'FRP-3135-DS25',
      batchLotNumber: 'LOT-F25-8821',
      installationMileage: 40150,
      installationDate: '14 September 2024',
      installedByWorkshop: 'Litchfield Motors (Tewkesbury)',
      torqueSpec: 'Caliper guide pins: 35 Nm',
      isoStandardCert: 'ISO/TS 16949 Automotive Friction Standard',
      serviceLifeRemainingPct: 68,
      replacementIntervalMiles: 20000,
      provenanceHash: '',
      engineeringRationale: 'Friction coefficient µ = 0.42 stable from 20°C to 500°C. Delivers sharp initial bite on cold Cotswold morning runs without pad glazing.',
      verifiedByMasterMechanic: true
    },
    {
      id: 'bom-m3-5',
      vehicleId: 'car-maya-m3',
      vin: 'WBA-31AY-0084-M3',
      partName: 'Mobil 1 ESP X3 0W-40 Synthetic Lubricant & Mahle Filter',
      category: 'Tribology & Fluids',
      manufacturer: 'ExxonMobil Petroleum & Chemical',
      originCountry: 'France',
      originFacility: 'Notre-Dame-de-Gravenchon Refinery',
      serialNumber: 'MOB-ESP-0W40-FRA',
      batchLotNumber: 'BATCH-24F-9021-G',
      installationMileage: 40150,
      installationDate: '14 September 2024',
      installedByWorkshop: 'Litchfield Motors (Tewkesbury)',
      torqueSpec: 'Sump drain plug: 25 Nm • Filter housing: 25 Nm',
      isoStandardCert: 'BMW Longlife-04 / ACEA C3 Statutory Conformity',
      serviceLifeRemainingPct: 82,
      replacementIntervalMiles: 6000,
      provenanceHash: '',
      engineeringRationale: 'High thermal shear stability protecting S58 twin-turbo thrust bearings under sustained peak boost.',
      verifiedByMasterMechanic: true
    }
  ],
  'car-kuro-gt3': [
    {
      id: 'bom-gt3-1',
      vehicleId: 'car-kuro-gt3',
      vin: 'WP0-ZZZ-99Z-NS-1092',
      partName: 'Manthey Racing 4-Way Adjustable Track Day Coilover Kit',
      category: 'Suspension & Kinematics',
      manufacturer: 'Manthey-Racing GmbH',
      originCountry: 'Germany',
      originFacility: 'Meuspath (Nürburgring Atelier)',
      serialNumber: 'MR-992GT3-SUS-081',
      batchLotNumber: 'MR-LOT-24-0019',
      installationMileage: 16200,
      installationDate: '22 June 2024',
      installedByWorkshop: 'Manthey Meuspath Atelier',
      torqueSpec: 'Front wishbone rose joints: 85 Nm • Strut top: 40 Nm',
      isoStandardCert: 'TÜV NORD Component Approval #12-TG-992',
      serviceLifeRemainingPct: 94,
      replacementIntervalMiles: 50000,
      provenanceHash: '',
      engineeringRationale: 'Calibrated specifically for kerb strikes and high-speed compression without unsettling the rear axle at 9,000 RPM.',
      verifiedByMasterMechanic: true
    },
    {
      id: 'bom-gt3-2',
      vehicleId: 'car-kuro-gt3',
      vin: 'WP0-ZZZ-99Z-NS-1092',
      partName: 'Surface Transforms Continuous Carbon-Ceramic Rotors (410mm F)',
      category: 'Braking Friction',
      manufacturer: 'Surface Transforms plc',
      originCountry: 'United Kingdom',
      originFacility: 'Ellesmere Port Aerospace Composites',
      serialNumber: 'ST-CCX-410-0982',
      batchLotNumber: 'AERO-DISC-2024-C',
      installationMileage: 16200,
      installationDate: '22 June 2024',
      installedByWorkshop: 'Manthey Meuspath Atelier',
      torqueSpec: 'Caliper mounting radial bolts: 110 Nm with Loctite 243',
      isoStandardCert: 'AS9100D Aerospace & Defense Quality Standard',
      serviceLifeRemainingPct: 99,
      replacementIntervalMiles: 180000,
      provenanceHash: '',
      engineeringRationale: 'Continuous carbon fiber weave allows 3-5 refurbishments and dissipates heat 300% faster than standard chopped-fiber discs.',
      verifiedByMasterMechanic: true
    },
    {
      id: 'bom-gt3-3',
      vehicleId: 'car-kuro-gt3',
      vin: 'WP0-ZZZ-99Z-NS-1092',
      partName: 'Castrol Molub-Alloy 600 Nm Centerlock Assembly Lubricant',
      category: 'Tribology & Fluids',
      manufacturer: 'Castrol Industrial Lubricants',
      originCountry: 'Belgium',
      originFacility: 'Gent Lubricant Facility',
      serialNumber: 'CST-MOLUB-777',
      batchLotNumber: 'LOT-B24-1188',
      installationMileage: 17400,
      installationDate: '11 July 2024',
      installedByWorkshop: 'Porsche Centre Guildford',
      torqueSpec: 'Centerlock wheel nut: 600 Nm statutory hold',
      isoStandardCert: 'DIN 51825 Heavy Duty Solid Lubricant Spec',
      serviceLifeRemainingPct: 90,
      replacementIntervalMiles: 12000,
      provenanceHash: '',
      engineeringRationale: 'Prevents galvanic fretting and cone cold-welding between forged magnesium centerlock hubs under severe lateral track loads.',
      verifiedByMasterMechanic: true
    }
  ],
  'car-e30-retromod': [
    {
      id: 'bom-e30-1',
      vehicleId: 'car-e30-retromod',
      vin: 'WBA-AF92-0019-E30',
      partName: 'Bilstein B12 Pro-Kit Monotube Inverted Dampers',
      category: 'Suspension & Kinematics',
      manufacturer: 'Thyssenkrupp Bilstein GmbH',
      originCountry: 'Germany',
      originFacility: 'Ennepetal, North Rhine-Westphalia',
      serialNumber: 'BIL-B12-E30-410',
      batchLotNumber: 'TK-BIL-8802',
      installationMileage: 115200,
      installationDate: '18 May 2024',
      installedByWorkshop: 'Dan Martin Classic Restorations (Bristol)',
      torqueSpec: 'Front top nut: 64 Nm • Rear lower bolt: 72 Nm',
      isoStandardCert: 'DIN EN ISO 9001:2015 Precision Certification',
      serviceLifeRemainingPct: 96,
      replacementIntervalMiles: 80000,
      provenanceHash: '',
      engineeringRationale: 'Inverted monotube design resists lateral bending force under hard cornering on Mendip Hills B-roads.',
      verifiedByMasterMechanic: true
    },
    {
      id: 'bom-e30-2',
      vehicleId: 'car-e30-retromod',
      vin: 'WBA-AF92-0019-E30',
      partName: 'Supersprint Stainless Steel Exhaust Header & Mid-Pipe',
      category: 'Exhaust & Induction',
      manufacturer: 'Supersprint S.r.l.',
      originCountry: 'Italy',
      originFacility: 'Mantova Manufacturing Plant',
      serialNumber: 'SSP-E30-M42-991',
      batchLotNumber: 'LOT-INOX-304-41',
      installationMileage: 115400,
      installationDate: '24 May 2024',
      installedByWorkshop: 'Dan Martin Classic Restorations (Bristol)',
      torqueSpec: 'Exhaust manifold studs: 22 Nm (copper anti-seize applied)',
      isoStandardCert: 'TÜV Rheinland Kraftfahrt Homologation #e3*70/157',
      serviceLifeRemainingPct: 98,
      replacementIntervalMiles: 200000,
      provenanceHash: '',
      engineeringRationale: '4-2-1 tuned primary pipe lengths extract scavenging wave pulses from the 16-valve M42 at 4,500-6,800 RPM.',
      verifiedByMasterMechanic: true
    }
  ],
  'car-expedition-110': [
    {
      id: 'bom-def-1',
      vehicleId: 'car-expedition-110',
      vin: 'SAL-WR2-0041-DEF',
      partName: 'Warn Zeon 12-S Platinum 12,000 lb Synthetic Winch',
      category: 'Chassis & Structure',
      manufacturer: 'Warn Industries Inc',
      originCountry: 'United States',
      originFacility: 'Clackamas, Oregon Manufacturing Plant',
      serialNumber: 'WRN-ZEON12S-8819',
      batchLotNumber: 'USA-LOT-WARN-2401',
      installationMileage: 24500,
      installationDate: '12 July 2024',
      installedByWorkshop: 'Yorkshire Overland Specialists',
      torqueSpec: 'Chassis winch tray grade 8.8 bolts: 95 Nm',
      isoStandardCert: 'SAE J706 Surface Vehicle Winch Standard',
      serviceLifeRemainingPct: 95,
      replacementIntervalMiles: 100000,
      provenanceHash: '',
      engineeringRationale: 'Spydura Pro synthetic rope provides high strength-to-weight ratio without storing lethal kinetic rebound energy in deep bog rescues.',
      verifiedByMasterMechanic: true
    },
    {
      id: 'bom-def-2',
      vehicleId: 'car-expedition-110',
      vin: 'SAL-WR2-0041-DEF',
      partName: 'ARB On-Board High-Output Twin Air Compressor',
      category: 'Chassis & Structure',
      manufacturer: 'ARB Corporation Ltd',
      originCountry: 'Australia',
      originFacility: 'Melbourne Head Office & Manufacturing',
      serialNumber: 'ARB-CKMTA12-5501',
      batchLotNumber: 'LOT-ARB-AUS-771',
      installationMileage: 24600,
      installationDate: '15 July 2024',
      installedByWorkshop: 'Yorkshire Overland Specialists',
      torqueSpec: 'Mounting bracket M8 bolts: 25 Nm',
      isoStandardCert: 'IP54 Sealed Washdown Protected Specification',
      serviceLifeRemainingPct: 97,
      replacementIntervalMiles: 150000,
      provenanceHash: '',
      engineeringRationale: '174 LPM flow rate allows airing up four 33-inch tires from 18 PSI riverbed pressure to 36 PSI bitumen pressure in under 3 minutes.',
      verifiedByMasterMechanic: true
    }
  ]
};

// Automatically seed hashes into baseline records on first initialization
Object.keys(DEFAULT_VEHICLE_BOMS).forEach(vKey => {
  DEFAULT_VEHICLE_BOMS[vKey] = DEFAULT_VEHICLE_BOMS[vKey].map(comp => {
    if (!comp.provenanceHash) {
      comp.provenanceHash = generateComponentHash({
        vin: comp.vin,
        serialNumber: comp.serialNumber,
        partName: comp.partName,
        batchLotNumber: comp.batchLotNumber,
        installationMileage: comp.installationMileage
      });
    }
    return comp;
  });
});

/**
 * Loads a vehicle's Bill of Materials from local storage or returns the verified baseline.
 */
export function loadVehicleBom(vehicleId: string): SerializedComponent[] {
  try {
    const key = `datum_vehicle_bom_${vehicleId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed: SerializedComponent[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Return baseline fallback
  }

  const baseline = DEFAULT_VEHICLE_BOMS[vehicleId] || DEFAULT_VEHICLE_BOMS['car-maya-m3'];
  return [...baseline];
}

/**
 * Saves a vehicle's Bill of Materials into local storage.
 */
export function saveVehicleBom(vehicleId: string, components: SerializedComponent[]): void {
  try {
    const key = `datum_vehicle_bom_${vehicleId}`;
    localStorage.setItem(key, JSON.stringify(components));
  } catch {
    // In-memory fallback
  }
}

/**
 * Appends a new serialized component to the vehicle's Bill of Materials, computing its provenance hash.
 */
export function addComponentToBom(
  vehicleId: string,
  newComponentData: Omit<SerializedComponent, 'id' | 'provenanceHash'>
): SerializedComponent {
  const hash = generateComponentHash({
    vin: newComponentData.vin,
    serialNumber: newComponentData.serialNumber,
    partName: newComponentData.partName,
    batchLotNumber: newComponentData.batchLotNumber,
    installationMileage: newComponentData.installationMileage
  });

  const fullComponent: SerializedComponent = {
    ...newComponentData,
    id: `bom-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    provenanceHash: hash
  };

  const existing = loadVehicleBom(vehicleId);
  const updated = [fullComponent, ...existing];
  saveVehicleBom(vehicleId, updated);

  return fullComponent;
}
