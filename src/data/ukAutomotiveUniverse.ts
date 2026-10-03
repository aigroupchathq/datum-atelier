/**
 * DATUM UK & Global Automotive Universe Intelligence Directory
 * A to Z Encyclopedia of iconic enthusiast platforms, UK B-road benchmarks,
 * homologation legends, track weapons, and mechanical specifications.
 */

export type CarArchetype = 
  | 'hot_hatch'           // UK B-Road Kings (GR Yaris, Fiesta ST, Megane RS, Type R)
  | 'analog_purist'       // High-RPM NA, Manual, Hydraulic Steering (GT3, E46 M3, Exige)
  | 'track_weapon'        // Sub-1,000kg Pure Trackers (Caterham, Ariel, Radicals)
  | 'supercar_gt'         // Mid-Engine Exotics & Continental Tourers (720S, Vantage, 911 Turbo)
  | 'homologation_legend' // Group A & WRC Legends (Evo VI TME, Impreza 22B, R34 GT-R, Cossie)
  | 'overland_4x4'        // Country, Highland & Mud Expeditions (Defender, Land Cruiser)
  | 'fast_wagon_saloon'   // Heavy-Hitting All-Weather Monsters (RS6, G80 M3, M5 CS, C63 V8)
  | 'restomod_classic';   // Air-Cooled & Historic Icons (Singer 911, E-Type, E30, Alfaholics)

export interface AutomotiveModel {
  id: string;
  make: string;
  model: string;
  variant?: string;
  chassisCode: string;
  productionYears: string;
  archetype: CarArchetype;
  heroImage: string;
  galleryImages: string[];
  specs: {
    engineCode: string;
    displacement: string;
    cylinderConfig: string;
    induction: 'Naturally Aspirated' | 'Single Turbo' | 'Twin-Turbo' | 'Supercharged' | 'Twin-Charged' | 'Twin-Rotor Twin-Turbo';
    powerBhp: number;
    torqueNm: number;
    redlineRpm: number;
    transmission: string;
    drivetrain: string;
    curbWeightKg: number;
    powerToWeightBhpPerTonne: number;
    zeroToSixtyMph: number;
    topSpeedMph: number;
    peakLateralG: number;
    factoryTireSpec: string;
    surfaceAffinity: 'dry' | 'damp' | 'frost' | 'all';
  };
  marketIntelligence: {
    ukEnthusiastStatus: string;
    soundtrackSignature: string;
    commonEnthusiastMods: string[];
    criticalInspectionPoints: string[];
    benchmarkRoadSector: string;
    estimatedPriceGbp: string;
  };
}

export const AUTOMOTIVE_UNIVERSE: AutomotiveModel[] = [
  // --- A ---
  {
    id: 'car-aston-vantage-v8',
    make: 'Aston Martin',
    model: 'V8 Vantage',
    variant: '4.7 Manual Sportshift II',
    chassisCode: 'VH2',
    productionYears: '2008–2018',
    archetype: 'supercar_gt',
    heroImage: '/feed/aston_vantage_v8_silverstone.jpg',
    galleryImages: ['/feed/aston_vantage_v8_silverstone.jpg', '/collective_atelier_hall.jpg'],
    specs: {
      engineCode: 'AM08 4.7L',
      displacement: '4,735 cc',
      cylinderConfig: 'V8 32V Quad-Cam',
      induction: 'Naturally Aspirated',
      powerBhp: 420,
      torqueNm: 470,
      redlineRpm: 7300,
      transmission: '6-Speed Graziano Manual',
      drivetrain: 'RWD (Transaxle LSD)',
      curbWeightKg: 1610,
      powerToWeightBhpPerTonne: 261,
      zeroToSixtyMph: 4.7,
      topSpeedMph: 180,
      peakLateralG: 1.15,
      factoryTireSpec: 'Bridgestone Potenza RE050A (285/35 R19 Rear)',
      surfaceAffinity: 'dry'
    },
    marketIntelligence: {
      ukEnthusiastStatus: 'Gaydon-built British masterpiece. The modern classic analog British GT sweet spot with a manual gearbox.',
      soundtrackSignature: 'Deep, dry, brassy British V8 howl that crescendos into an intoxicating metallic roar above 4,000 RPM.',
      commonEnthusiastMods: ['Bamford Rose lightweight flywheel & twin-plate clutch', '200-cell sports cats', 'V12 Vantage carbon diffuser'],
      criticalInspectionPoints: ['Subframe corrosion near suspension pickup points', 'Tail lamp moisture ingress', 'Clutch wear index via AMDS diagnostic tool'],
      benchmarkRoadSector: 'A44 Chipping Norton to Moreton-in-Marsh',
      estimatedPriceGbp: '£32,000 – £48,000'
    }
  },
  {
    id: 'car-audi-b7-rs4',
    make: 'Audi',
    model: 'RS4 Avant',
    variant: '4.2 FSI V8 Quattro',
    chassisCode: 'B7',
    productionYears: '2006–2008',
    archetype: 'fast_wagon_saloon',
    heroImage: '/feed/audi_b7_cabriolet_red_roof_brembo.jpg',
    galleryImages: ['/feed/audi_b7_cabriolet_red_roof_brembo.jpg', '/feed/audi_cabriolet_mythos_sw71_ryb.jpg'],
    specs: {
      engineCode: 'BNS 4.2L',
      displacement: '4,163 cc',
      cylinderConfig: 'V8 32V High-Rev FSI',
      induction: 'Naturally Aspirated',
      powerBhp: 414,
      torqueNm: 430,
      redlineRpm: 8250,
      transmission: 'Getrag 6-Speed Manual (0A3)',
      drivetrain: 'Permanent Quattro AWD (40:60 Torsen Split)',
      curbWeightKg: 1710,
      powerToWeightBhpPerTonne: 242,
      zeroToSixtyMph: 4.6,
      topSpeedMph: 155,
      peakLateralG: 1.18,
      factoryTireSpec: 'Michelin Pilot Sport 4S (255/35 R19)',
      surfaceAffinity: 'damp'
    },
    marketIntelligence: {
      ukEnthusiastStatus: 'The pinnacle analog RS Avant. 8,250 RPM manual V8 estate with rear-biased Quattro—a permanent British icon.',
      soundtrackSignature: 'Mechanical induction valvetrain rasp transforming into an 8,000 RPM high-pitch V8 bark.',
      commonEnthusiastMods: ['Bilstein B16 PSS9 coilovers (deleting leaky DRC)', 'Milltek valved exhaust', 'Carbon intake de-coke service'],
      criticalInspectionPoints: ['Direct injection intake valve carbon buildup', 'Dynamic Ride Control (DRC) hydraulic damper weep', 'Oil cooler hard line corrosion'],
      benchmarkRoadSector: 'Snake Pass A57 Summit in wet conditions',
      estimatedPriceGbp: '£18,000 – £28,000'
    }
  },

  // --- B ---
  {
    id: 'car-bmw-m3-g80',
    make: 'BMW',
    model: 'M3 Competition',
    variant: 'M xDrive / RWD S58',
    chassisCode: 'G80',
    productionYears: '2021–Present',
    archetype: 'fast_wagon_saloon',
    heroImage: '/real_uk_m3_cottage.jpg',
    galleryImages: ['/real_uk_m3_cottage.jpg', '/clean_garage_m3.jpg', '/real_uk_driveway_wash.jpg'],
    specs: {
      engineCode: 'S58B30T0',
      displacement: '2,993 cc',
      cylinderConfig: 'Inline-6 24V Twin-Turbo',
      induction: 'Twin-Turbo',
      powerBhp: 503,
      torqueNm: 650,
      redlineRpm: 7200,
      transmission: '8-Speed M Steptronic (ZF 8HP76)',
      drivetrain: 'M xDrive AWD (Switchable 2WD Mode)',
      curbWeightKg: 1730,
      powerToWeightBhpPerTonne: 291,
      zeroToSixtyMph: 3.4,
      topSpeedMph: 180,
      peakLateralG: 1.25,
      factoryTireSpec: 'Michelin Pilot Sport 4S (275/35 R19 Front, 285/30 R20 Rear)',
      surfaceAffinity: 'all'
    },
    marketIntelligence: {
      ukEnthusiastStatus: 'The modern point-to-point benchmark. Ferociously rigid front axle geometry with immense mid-corner poise.',
      soundtrackSignature: 'Sub-bass twin-turbo bass note building into high-velocity valvetrain whine through titanium downpipes.',
      commonEnthusiastMods: ['KW Variant 4 3-way coilovers', 'Akrapovič Evolution titanium system', 'Eventuri carbon intake', 'Forged monoblock BBS FI-R wheels'],
      criticalInspectionPoints: ['Front radiator stone impact guards', 'Ceramic brake pad edge crumb on track cars', 'Differential bush wear under launch load'],
      benchmarkRoadSector: 'Cotswolds Roman Way B4425',
      estimatedPriceGbp: '£55,000 – £78,000'
    }
  },
  {
    id: 'car-bmw-m3-e46-csl',
    make: 'BMW',
    model: 'M3 CSL',
    variant: 'Coupe Sport Lightweight',
    chassisCode: 'E46',
    productionYears: '2003–2004',
    archetype: 'analog_purist',
    heroImage: '/feed/bmw_m3_csl_e46_nurburgring.jpg',
    galleryImages: ['/feed/bmw_m3_csl_e46_nurburgring.jpg', '/clean_garage_m3.jpg'],
    specs: {
      engineCode: 'S54B32HP',
      displacement: '3,246 cc',
      cylinderConfig: 'Inline-6 24V DOHC Dual-VANOS',
      induction: 'Naturally Aspirated',
      powerBhp: 355,
      torqueNm: 370,
      redlineRpm: 8000,
      transmission: '6-Speed SMG II Drivelogic (CSL Software)',
      drivetrain: 'RWD (Variable M Differential Lock)',
      curbWeightKg: 1385,
      powerToWeightBhpPerTonne: 256,
      zeroToSixtyMph: 4.6,
      topSpeedMph: 161,
      peakLateralG: 1.28,
      factoryTireSpec: 'Michelin Pilot Sport Cup (235/35 R19 Front, 265/30 R19 Rear)',
      surfaceAffinity: 'dry'
    },
    marketIntelligence: {
      ukEnthusiastStatus: 'Holy Grail of M Division. 110 kg weight reduction, carbon airbox intake growl, thin glass, and carbon roof.',
      soundtrackSignature: 'Thunderous carbon airbox induction roar that drowns out the exhaust note completely above 4,500 RPM.',
      commonEnthusiastMods: ['Manual gearbox conversion', 'AP Racing Pro 5000R big brake kit', 'Intrax 1K2 suspension'],
      criticalInspectionPoints: ['Rear subframe boot floor crack stress lines', 'Rod bearing wear', 'VANOS hub tab failure'],
      benchmarkRoadSector: 'Llanberis Pass A4086, Snowdonia',
      estimatedPriceGbp: '£75,000 – £110,000'
    }
  },
  {
    id: 'car-bmw-318is-e30',
    make: 'BMW',
    model: '318is Slicktop',
    variant: 'M42 Twin-Cam RetroMod',
    chassisCode: 'E30',
    productionYears: '1989–1991',
    archetype: 'restomod_classic',
    heroImage: '/real_uk_e30_terrace.jpg',
    galleryImages: ['/real_uk_e30_terrace.jpg', '/heritage_wrenching_workshop.jpg'],
    specs: {
      engineCode: 'M42B18',
      displacement: '1,796 cc',
      cylinderConfig: 'Inline-4 16V DOHC',
      induction: 'Naturally Aspirated',
      powerBhp: 138,
      torqueNm: 175,
      redlineRpm: 6800,
      transmission: 'Getrag 240 5-Speed Manual',
      drivetrain: 'RWD (Small-case 4.10 Limited Slip Differential)',
      curbWeightKg: 1120,
      powerToWeightBhpPerTonne: 123,
      zeroToSixtyMph: 8.8,
      topSpeedMph: 126,
      peakLateralG: 0.98,
      factoryTireSpec: 'Yokohama Advan Neova AD08RS (205/55 R15)',
      surfaceAffinity: 'dry'
    },
    marketIntelligence: {
      ukEnthusiastStatus: 'Known as the "Baby M3". Perfect 50:50 weight distribution, rev-happy 16-valve engine, and unmatched analog steering feedback.',
      soundtrackSignature: 'Crisp mechanical valve clatter and sharp induction rasp through individual throttle bodies.',
      commonEnthusiastMods: ['Bilstein B8 + H&R sports springs', 'E36 steering rack quick-ratio conversion', 'BBS 15-inch cross-spokes'],
      criticalInspectionPoints: ['Scuttle panel and battery tray rust', 'Timing chain profile gasket failure', 'Rear trailing arm bushing play'],
      benchmarkRoadSector: 'Sussex Downs Roman Way',
      estimatedPriceGbp: '£12,000 – £19,000'
    }
  },

  // --- C ---
  {
    id: 'car-caterham-seven-620r',
    make: 'Caterham',
    model: 'Seven 620R',
    variant: '2.0 Duratec Supercharged',
    chassisCode: 'CSR Series 3',
    productionYears: '2014–Present',
    archetype: 'track_weapon',
    heroImage: '/feed/caterham_620r_cadwell.jpg',
    galleryImages: ['/feed/caterham_620r_cadwell.jpg', '/heritage_wrenching_workshop.jpg'],
    specs: {
      engineCode: 'Ford Duratec 2.0L',
      displacement: '1,999 cc',
      cylinderConfig: 'Inline-4 16V Supercharged',
      induction: 'Supercharged',
      powerBhp: 310,
      torqueNm: 297,
      redlineRpm: 7700,
      transmission: '6-Speed Sequential with Flatshift',
      drivetrain: 'RWD (Titan Limited Slip Differential)',
      curbWeightKg: 610,
      powerToWeightBhpPerTonne: 508,
      zeroToSixtyMph: 2.79,
      topSpeedMph: 155,
      peakLateralG: 1.68,
      factoryTireSpec: 'Avon ZZR Extreme (185/55 R13 Front, 215/55 R13 Rear)',
      surfaceAffinity: 'dry'
    },
    marketIntelligence: {
      ukEnthusiastStatus: 'Pure British motorsport distilled. 500+ BHP per tonne, direct manual steering rack, zero electronic aids.',
      soundtrackSignature: 'Deafening straight-cut gear whine punctuated by vicious supercharger screaming and exhaust pops on full-throttle upshifts.',
      commonEnthusiastMods: ['Full dry sump oiling kit', 'Carbon race bucket seats', 'Stack motorsport digital dash'],
      criticalInspectionPoints: ['Chassis tube brazing integrity', 'Driveshaft universal joint play', 'Dry sump belt alignment'],
      benchmarkRoadSector: 'Cadwell Park Club Circuit',
      estimatedPriceGbp: '£46,000 – £58,000'
    }
  },

  // --- F ---
  {
    id: 'car-ford-fiesta-st-mk8',
    make: 'Ford',
    model: 'Fiesta ST',
    variant: 'ST-3 Performance Pack (Quaife LSD)',
    chassisCode: 'MK8',
    productionYears: '2018–2023',
    archetype: 'hot_hatch',
    heroImage: '/feed/track_dawn_patrol_road.jpg',
    galleryImages: ['/feed/track_dawn_patrol_road.jpg', '/real_uk_driveway_wash.jpg'],
    specs: {
      engineCode: 'EcoBoost 1.5L',
      displacement: '1,497 cc',
      cylinderConfig: 'Inline-3 12V All-Alloy Turbo',
      induction: 'Single Turbo',
      powerBhp: 197,
      torqueNm: 290,
      redlineRpm: 6500,
      transmission: '6-Speed Manual',
      drivetrain: 'FWD (Quaife Helical ATB Differential)',
      curbWeightKg: 1262,
      powerToWeightBhpPerTonne: 156,
      zeroToSixtyMph: 6.3,
      topSpeedMph: 144,
      peakLateralG: 1.15,
      factoryTireSpec: 'Michelin Pilot Sport 4 (205/40 R18)',
      surfaceAffinity: 'all'
    },
    marketIntelligence: {
      ukEnthusiastStatus: 'Undisputed champion of UK B-roads. Lift-off oversteer on command, playful chassis agility, and punchy 3-cylinder thrum.',
      soundtrackSignature: 'Charismatic 3-cylinder warble with factory exhaust pops in Sport mode and turbo spool whistle.',
      commonEnthusiastMods: ['Mountune M235 / M260 calibration', 'Milltek GPF-back exhaust', 'Airtec intercooler', 'Mountune lowering springs'],
      criticalInspectionPoints: ['Keyless theft relay protection status', 'Rear twist-beam alignment after pothole strikes', 'Gearbox selector seal leaks'],
      benchmarkRoadSector: 'Evo Triangle B4501, North Wales',
      estimatedPriceGbp: '£13,000 – £19,000'
    }
  },
  {
    id: 'car-ford-escort-rs-cosworth',
    make: 'Ford',
    model: 'Escort RS Cosworth',
    variant: 'Group A Homologation (Big Turbo T34)',
    chassisCode: 'Escort Cosworth',
    productionYears: '1992–1996',
    archetype: 'homologation_legend',
    heroImage: '/feed/ford_sierra_rs_cosworth.jpg',
    galleryImages: ['/feed/ford_sierra_rs_cosworth.jpg', '/clean_garage_gt3.jpg'],
    specs: {
      engineCode: 'Cosworth YBT',
      displacement: '1,993 cc',
      cylinderConfig: 'Inline-4 16V DOHC',
      induction: 'Single Turbo',
      powerBhp: 224,
      torqueNm: 304,
      redlineRpm: 6500,
      transmission: '5-Speed Manual (Ferguson MT75 4WD)',
      drivetrain: 'Permanent 4WD (34:66 Front:Rear Split)',
      curbWeightKg: 1275,
      powerToWeightBhpPerTonne: 176,
      zeroToSixtyMph: 5.7,
      topSpeedMph: 140,
      peakLateralG: 1.10,
      factoryTireSpec: 'Pirelli P-Zero (225/45 ZR16)',
      surfaceAffinity: 'damp'
    },
    marketIntelligence: {
      ukEnthusiastStatus: 'The definitive 90s British fast Ford icon. Double-deck "whale-tail" rear spoiler designed by Frank Stephenson.',
      soundtrackSignature: 'Whale-tail turbo chatter, wastegate flutter, and deep 16-valve Cosworth induction snarl.',
      commonEnthusiastMods: ['Ahmed Bayjoo ECU chip', 'Mongoose stainless exhaust', 'Compomotive MO 18-inch rally wheels'],
      criticalInspectionPoints: ['Floorpan seam rot', 'Front differential casing fracture', 'Wiring loom insulation decay near turbo'],
      benchmarkRoadSector: 'Kielder Forest B-Road Loop',
      estimatedPriceGbp: '£55,000 – £90,000'
    }
  },

  // --- H ---
  {
    id: 'car-honda-civic-type-r-fl5',
    make: 'Honda',
    model: 'Civic Type R',
    variant: '2.0 VTEC Turbo',
    chassisCode: 'FL5',
    productionYears: '2023–Present',
    archetype: 'hot_hatch',
    heroImage: '/feed/honda_civic_fl5_typer.jpg',
    galleryImages: ['/feed/honda_civic_fl5_typer.jpg', '/real_uk_gt3_suburb.jpg'],
    specs: {
      engineCode: 'K20C1',
      displacement: '1,996 cc',
      cylinderConfig: 'Inline-4 16V DOHC VTEC Turbo',
      induction: 'Single Turbo',
      powerBhp: 325,
      torqueNm: 420,
      redlineRpm: 7000,
      transmission: '6-Speed Manual with Mechanical Rev-Match',
      drivetrain: 'FWD (Helical Limited Slip Differential)',
      curbWeightKg: 1429,
      powerToWeightBhpPerTonne: 227,
      zeroToSixtyMph: 5.3,
      topSpeedMph: 171,
      peakLateralG: 1.34,
      factoryTireSpec: 'Michelin Pilot Sport 4S (265/30 R19)',
      surfaceAffinity: 'all'
    },
    marketIntelligence: {
      ukEnthusiastStatus: 'The greatest front-wheel-drive chassis ever engineered. Tear-away manual shift linkage and sublime steering precision.',
      soundtrackSignature: 'Metallic K20 induction tone with crisp triple-exit exhaust note and high-RPM VTEC bite.',
      commonEnthusiastMods: ['Eventuri carbon induction system', 'Milltek resonated cat-back', 'Spoon Sports lowering springs'],
      criticalInspectionPoints: ['Brembo brake disc heat scoring from track days', 'Gearbox 2nd gear synchro feel when cold', 'Alcantara steering wheel wear'],
      benchmarkRoadSector: 'Anglesey Coastal Circuit',
      estimatedPriceGbp: '£44,000 – £52,000'
    }
  },

  // --- L ---
  {
    id: 'car-land-rover-defender-l663',
    make: 'Land Rover',
    model: 'Defender 110 V8',
    variant: 'Carpathian Edition 5.0 Supercharged',
    chassisCode: 'L663',
    productionYears: '2021–Present',
    archetype: 'overland_4x4',
    heroImage: '/feed/strata_florida_offroad_track.jpg',
    galleryImages: ['/feed/strata_florida_offroad_track.jpg', '/feed/offroad_mud_greenlane.jpg'],
    specs: {
      engineCode: 'AJ133 5.0L',
      displacement: '4,999 cc',
      cylinderConfig: 'V8 32V Quad-Cam Supercharged',
      induction: 'Supercharged',
      powerBhp: 518,
      torqueNm: 625,
      redlineRpm: 6500,
      transmission: '8-Speed Automatic (ZF 8HP76) with Twin-Speed Transfer Box',
      drivetrain: 'Permanent 4WD (Electronic Active Rear Locking Diff)',
      curbWeightKg: 2603,
      powerToWeightBhpPerTonne: 199,
      zeroToSixtyMph: 4.9,
      topSpeedMph: 149,
      peakLateralG: 0.78,
      factoryTireSpec: 'BFGoodrich All-Terrain T/A KO2 (275/55 R20)',
      surfaceAffinity: 'all'
    },
    marketIntelligence: {
      ukEnthusiastStatus: 'Uncompromising British cross-country weapon. 900mm wading depth, air suspension height adjustment, and supercharged V8 rumble.',
      soundtrackSignature: 'Deep, bass-heavy supercharged V8 roar with menacing quadruple exhaust thunder.',
      commonEnthusiastMods: ['BFGoodrich KO2 All-Terrain conversion', 'Tuff-Trek roof rack and recovery tracks', 'Milltek quad sports exhaust'],
      criticalInspectionPoints: ['Air suspension compressor cycle time', 'Underside rock guard scars', 'Transfer case oil freshness after deep wading'],
      benchmarkRoadSector: 'Strata Florida River Crossing, Mid Wales',
      estimatedPriceGbp: '£78,000 – £105,000'
    }
  },
  {
    id: 'car-lotus-emira-v6',
    make: 'Lotus',
    model: 'Emira V6 First Edition',
    variant: '3.5 Supercharged Manual',
    chassisCode: 'Type 131',
    productionYears: '2022–Present',
    archetype: 'analog_purist',
    heroImage: '/feed/lotus_exige_sport_410.jpg',
    galleryImages: ['/feed/lotus_exige_sport_410.jpg', '/collective_atelier_hall.jpg'],
    specs: {
      engineCode: '2GR-FE 3.5L',
      displacement: '3,456 cc',
      cylinderConfig: 'V6 24V DOHC Edelbrock Supercharged',
      induction: 'Supercharged',
      powerBhp: 400,
      torqueNm: 420,
      redlineRpm: 6800,
      transmission: '6-Speed Manual with Exposed Linkage',
      drivetrain: 'RWD (Torsen Limited Slip Differential)',
      curbWeightKg: 1405,
      powerToWeightBhpPerTonne: 285,
      zeroToSixtyMph: 4.2,
      topSpeedMph: 180,
      peakLateralG: 1.32,
      factoryTireSpec: 'Michelin Pilot Sport Cup 2 (245/35 R20 Front, 295/30 R20 Rear)',
      surfaceAffinity: 'dry'
    },
    marketIntelligence: {
      ukEnthusiastStatus: 'The final pure internal combustion Lotus. Hydraulic power steering rack, exposed mechanical gear linkage, and Norfolk chassis alchemy.',
      soundtrackSignature: 'Edelbrock TVS1050 supercharger whine layered on top of a screaming 6,800 RPM V6 exhaust howl.',
      commonEnthusiastMods: ['Komotec EX430 tuning package', 'Titanium sports silencer', 'Alcon 2-piece brake discs'],
      criticalInspectionPoints: ['Manual shift linkage adjustment', 'Air-conditioning condenser efficiency', 'Front clamshell alignment gaps'],
      benchmarkRoadSector: 'B500 Black Forest High Road & Snake Pass',
      estimatedPriceGbp: '£62,000 – £78,000'
    }
  },

  // --- M ---
  {
    id: 'car-mclaren-720s',
    make: 'McLaren',
    model: '720S Performance',
    variant: '4.0L Twin-Turbo Carbon Monocage II',
    chassisCode: 'P14',
    productionYears: '2017–2023',
    archetype: 'supercar_gt',
    heroImage: '/feed/mclaren_720s_supercar.jpg',
    galleryImages: ['/feed/mclaren_720s_supercar.jpg', '/clean_garage_gt3.jpg'],
    specs: {
      engineCode: 'M840T',
      displacement: '3,994 cc',
      cylinderConfig: 'V8 32V Twin-Scroll Turbo Flat-Plane',
      induction: 'Twin-Turbo',
      powerBhp: 710,
      torqueNm: 770,
      redlineRpm: 8500,
      transmission: '7-Speed Seamless Shift Dual-Clutch (SSG)',
      drivetrain: 'RWD (Open Diff with Brake Steer Vectoring)',
      curbWeightKg: 1419,
      powerToWeightBhpPerTonne: 500,
      zeroToSixtyMph: 2.7,
      topSpeedMph: 212,
      peakLateralG: 1.48,
      factoryTireSpec: 'Pirelli P-Zero Corsa (245/35 R19 Front, 305/30 R20 Rear)',
      surfaceAffinity: 'dry'
    },
    marketIntelligence: {
      ukEnthusiastStatus: 'Woking hyper-performance titan. Hydraulic cross-linked suspension (Proactive Chassis Control II) offers limousine compliance with Le Mans agility.',
      soundtrackSignature: 'Flat-plane crank race idle building into a howling, deafening 8,500 RPM turbine shriek.',
      commonEnthusiastMods: ['Kline Innovation Inconel exhaust', 'DME calibration to 800+ BHP', 'Novitec sport lowering springs'],
      criticalInspectionPoints: ['Proactive Chassis Control II suspension accumulator spheres', 'Door hinge wiring harness loom', 'Exhaust thermal heat shield integrity'],
      benchmarkRoadSector: 'Silverstone Grand Prix Circuit',
      estimatedPriceGbp: '£118,000 – £160,000'
    }
  },
  {
    id: 'car-mgb-roadster-sebring',
    make: 'MG',
    model: 'MGB Roadster',
    variant: 'Sebring Works Recreation',
    chassisCode: 'MGB',
    productionYears: '1962–1980',
    archetype: 'restomod_classic',
    heroImage: '/feed/mgb_roadster_sebring_bwg_15t.jpg',
    galleryImages: ['/feed/mgb_roadster_sebring_bwg_15t.jpg', '/stone_garage_cobra_ferrari.jpg'],
    specs: {
      engineCode: 'BMC B-Series',
      displacement: '1,950 cc',
      cylinderConfig: 'Inline-4 8V Pushrod',
      induction: 'Naturally Aspirated',
      powerBhp: 145,
      torqueNm: 180,
      redlineRpm: 6800,
      transmission: '4-Speed Manual with Laycock Overdrive',
      drivetrain: 'RWD (Salisbury Plate LSD)',
      curbWeightKg: 940,
      powerToWeightBhpPerTonne: 154,
      zeroToSixtyMph: 7.4,
      topSpeedMph: 122,
      peakLateralG: 1.05,
      factoryTireSpec: 'Avon CR6ZZ Historic Race (185/70 R15)',
      surfaceAffinity: 'dry'
    },
    marketIntelligence: {
      ukEnthusiastStatus: 'Grassroots British sports car royalty. Wide fiberglass Sebring arches, Minilite alloys, and Weber 45 DCOE induction.',
      soundtrackSignature: 'Raw twin-carburettor throatiness with deep rasp and crackle on throttle overrun.',
      commonEnthusiastMods: ['Oselli 1,950cc engine bore', 'Weber 45 DCOE carb', 'Gaz adjustable telescopic dampers'],
      criticalInspectionPoints: ['Castle rail and sill corrosion', 'Front kingpin trunnion grease condition', 'Differential axle oil seal leakage'],
      benchmarkRoadSector: 'Goodwood Motor Circuit Outer Loop',
      estimatedPriceGbp: '£16,000 – £28,000'
    }
  },
  {
    id: 'car-mitsubishi-evo-vi-tme',
    make: 'Mitsubishi',
    model: 'Lancer Evolution VI',
    variant: 'Tommi Mäkinen Edition (CP9A)',
    chassisCode: 'CP9A',
    productionYears: '2000–2001',
    archetype: 'homologation_legend',
    heroImage: '/feed/mitsubishi_evo6_tme_rally.jpg',
    galleryImages: ['/feed/mitsubishi_evo6_tme_rally.jpg', '/heritage_wrenching_workshop.jpg'],
    specs: {
      engineCode: '4G63T Titanium Turbine',
      displacement: '1,997 cc',
      cylinderConfig: 'Inline-4 16V DOHC Turbo',
      induction: 'Single Turbo',
      powerBhp: 276,
      torqueNm: 373,
      redlineRpm: 7500,
      transmission: '5-Speed Close-Ratio Manual',
      drivetrain: 'Permanent 4WD (Active Yaw Control AYC + Front Helical LSD)',
      curbWeightKg: 1360,
      powerToWeightBhpPerTonne: 203,
      zeroToSixtyMph: 4.4,
      topSpeedMph: 150,
      peakLateralG: 1.25,
      factoryTireSpec: 'Michelin Pilot Sport 4 (225/45 R17 on Enkei Ralliart)',
      surfaceAffinity: 'all'
    },
    marketIntelligence: {
      ukEnthusiastStatus: 'The undisputed rally king for British damp B-roads. Titanium turbine wheel spools instantly, AYC turns wet bitumen into dry grip.',
      soundtrackSignature: 'Fast spooling turbo whistle followed by aggressive wastegate dump and classic 4G63 raw mechanical grit.',
      commonEnthusiastMods: ['Öhlins Road & Track suspension', 'HKS Super Drager exhaust', 'Ralliart hard pipe kit'],
      criticalInspectionPoints: ['Rear chassis leg and boot floor rust (UK salt road rot)', 'AYC pump hydraulic pressure failure', 'Transfer case tooth wear'],
      benchmarkRoadSector: 'Kielder Forest & Buttertubs Pass',
      estimatedPriceGbp: '£42,000 – £75,000'
    }
  },

  // --- N ---
  {
    id: 'car-nissan-skyline-gtr-r34',
    make: 'Nissan',
    model: 'Skyline GT-R',
    variant: 'V-Spec II (ATTESA E-TS Pro)',
    chassisCode: 'BNR34',
    productionYears: '1999–2002',
    archetype: 'homologation_legend',
    heroImage: '/feed/nissan_r34_gtr_bayside.jpg',
    galleryImages: ['/feed/nissan_r34_gtr_bayside.jpg', '/clean_garage_gt3.jpg'],
    specs: {
      engineCode: 'RB26DETT',
      displacement: '2,568 cc',
      cylinderConfig: 'Inline-6 24V DOHC Twin-Turbo',
      induction: 'Twin-Turbo',
      powerBhp: 276,
      torqueNm: 392,
      redlineRpm: 8000,
      transmission: 'Getrag 6-Speed Manual',
      drivetrain: 'ATTESA E-TS Pro All-Wheel Drive (Active Rear LSD)',
      curbWeightKg: 1560,
      powerToWeightBhpPerTonne: 177,
      zeroToSixtyMph: 4.6,
      topSpeedMph: 165,
      peakLateralG: 1.26,
      factoryTireSpec: 'Bridgestone Potenza RE040 (245/40 ZR18)',
      surfaceAffinity: 'all'
    },
    marketIntelligence: {
      ukEnthusiastStatus: 'Godzilla. The defining cultural icon of modern automotive enthusiast lore, imported to the UK via Middlehurst and SVA.',
      soundtrackSignature: 'Iconic straight-six twin-turbo growl with spine-tingling valve harmonics up to 8,000 RPM.',
      commonEnthusiastMods: ['Nismo Weldina NE-1 exhaust', 'Nismo S-Tune coilovers', 'Mines VX-ROM ECU', 'Volk Racing TE37 forged wheels'],
      criticalInspectionPoints: ['Front strut tower corrosion (vital check on UK imports)', 'Multi-Function Display (MFD) screen degradation', 'Rear wheel arch seam rust'],
      benchmarkRoadSector: 'A57 Snake Pass to Ladybower Viaduct',
      estimatedPriceGbp: '£120,000 – £195,000'
    }
  },

  // --- P ---
  {
    id: 'car-porsche-911-gt3-992',
    make: 'Porsche',
    model: '911 GT3',
    variant: 'Touring Package 6-Speed Manual',
    chassisCode: '992.1',
    productionYears: '2021–Present',
    archetype: 'analog_purist',
    heroImage: '/real_uk_gt3_suburb.jpg',
    galleryImages: ['/real_uk_gt3_suburb.jpg', '/clean_garage_gt3.jpg'],
    specs: {
      engineCode: '4.0L MA2.75',
      displacement: '3,996 cc',
      cylinderConfig: 'Flat-6 24V DOHC Dry Sump',
      induction: 'Naturally Aspirated',
      powerBhp: 502,
      torqueNm: 470,
      redlineRpm: 9000,
      transmission: '6-Speed GT Sports Manual',
      drivetrain: 'RWD (Mechanical Locking Differential)',
      curbWeightKg: 1418,
      powerToWeightBhpPerTonne: 354,
      zeroToSixtyMph: 3.7,
      topSpeedMph: 199,
      peakLateralG: 1.44,
      factoryTireSpec: 'Michelin Pilot Sport Cup 2 (255/35 R20 Front, 315/30 R21 Rear)',
      surfaceAffinity: 'dry'
    },
    marketIntelligence: {
      ukEnthusiastStatus: 'The modern gold standard of sports car perfection. Double-wishbone front suspension derived from the 911 RSR race car and 9,000 RPM screaming flat-six.',
      soundtrackSignature: 'A mechanical valvetrain whirr at idle escalating into a hair-raising, pure motorsport flat-six howl approaching 9,000 RPM.',
      commonEnthusiastMods: ['JCR Titanium center bypass exhaust', 'Manthey Racing geometry setup', 'Surface Transforms carbon-ceramic brakes'],
      criticalInspectionPoints: ['PCCB rotor edge chips from gravel roads', 'Front axle lift system hydraulic pressure', 'Paint protection film (PPF) coverage on rear wheel arches'],
      benchmarkRoadSector: 'Cotswolds B-Road Loop & Surrey Twisties',
      estimatedPriceGbp: '£165,000 – £215,000'
    }
  },

  // --- T ---
  {
    id: 'car-toyota-gr-yaris',
    make: 'Toyota',
    model: 'GR Yaris',
    variant: 'Circuit Pack (Front & Rear Torsen LSDs)',
    chassisCode: 'GXPA16',
    productionYears: '2020–Present',
    archetype: 'hot_hatch',
    heroImage: '/feed/toyota_gr_yaris_wales.jpg',
    galleryImages: ['/feed/toyota_gr_yaris_wales.jpg', '/clean_garage_gt3.jpg'],
    specs: {
      engineCode: 'G16E-GTS',
      displacement: '1,618 cc',
      cylinderConfig: 'Inline-3 12V DOHC Ball-Bearing Turbo',
      induction: 'Single Turbo',
      powerBhp: 257,
      torqueNm: 360,
      redlineRpm: 7200,
      transmission: '6-Speed Manual with iMT Rev-Match',
      drivetrain: 'GR-FOUR AWD (Dual Torsen LSDs with 60:40 / 30:70 / 50:50 Split)',
      curbWeightKg: 1280,
      powerToWeightBhpPerTonne: 201,
      zeroToSixtyMph: 5.2,
      topSpeedMph: 143,
      peakLateralG: 1.38,
      factoryTireSpec: 'Michelin Pilot Sport 4S (225/40 R18 on BBS Forged)',
      surfaceAffinity: 'all'
    },
    marketIntelligence: {
      ukEnthusiastStatus: 'The modern homologation miracle. Carbon fiber polymer roof, aluminum doors/bonnet, bespoke WRC platform.',
      soundtrackSignature: 'Thumping 3-cylinder off-beat bark with intoxicating turbo compressor flutter on throttle lift.',
      commonEnthusiastMods: ['Litchfield Nitron R1 suspension', 'Eventuri intake', 'Milltek non-resonated exhaust', 'Forge Motorsport intercooler'],
      criticalInspectionPoints: ['Rear differential temperature sensor on track', 'Transfer box fluid life', 'Rear arch stone-chip protection'],
      benchmarkRoadSector: 'Hardknott Pass, Lake District',
      estimatedPriceGbp: '£27,000 – £36,000'
    }
  },
  {
    id: 'car-toyota-supra-a80',
    make: 'Toyota',
    model: 'Supra',
    variant: 'RZ Twin-Turbo 6-Speed Manual',
    chassisCode: 'JZA80',
    productionYears: '1993–2002',
    archetype: 'homologation_legend',
    heroImage: '/feed/toyota_supra_mk4.jpg',
    galleryImages: ['/feed/toyota_supra_mk4.jpg', '/collective_atelier_hall.jpg'],
    specs: {
      engineCode: '2JZ-GTE',
      displacement: '2,997 cc',
      cylinderConfig: 'Inline-6 24V DOHC Sequential Twin-Turbo',
      induction: 'Twin-Turbo',
      powerBhp: 320,
      torqueNm: 427,
      redlineRpm: 7200,
      transmission: 'Getrag 6-Speed Manual (V160)',
      drivetrain: 'RWD (Torsen Limited Slip Differential)',
      curbWeightKg: 1510,
      powerToWeightBhpPerTonne: 212,
      zeroToSixtyMph: 4.6,
      topSpeedMph: 155,
      peakLateralG: 1.18,
      factoryTireSpec: 'Michelin Pilot Sport 4S (235/45 R17 Front, 255/40 R17 Rear)',
      surfaceAffinity: 'dry'
    },
    marketIntelligence: {
      ukEnthusiastStatus: 'The indestructible iron-block legend. The 2JZ-GTE engine block is revered worldwide for handling 800+ BHP on stock internals.',
      soundtrackSignature: 'Sequential twin-turbo whistle followed by a turbine-smooth, bottomless straight-six crescendo.',
      commonEnthusiastMods: ['Single turbo conversion (Garrett G30-770)', 'HKS Ti exhaust', 'BC Racing coilovers', 'Brembo big brake upgrade'],
      criticalInspectionPoints: ['Rear hatch seal rust and hatch strut mounts', 'Twin-turbo transition valve vacuum lines', 'Factory wiring harness brittleness'],
      benchmarkRoadSector: 'A686 Hartside Pass, Cumbria',
      estimatedPriceGbp: '£48,000 – £85,000'
    }
  },

  // --- V ---
  {
    id: 'car-vauxhall-zafira-vxr',
    make: 'Vauxhall',
    model: 'Zafira VXR',
    variant: '2.0 Turbo 240PS Outcast Build',
    chassisCode: 'Zafira B',
    productionYears: '2005–2010',
    archetype: 'hot_hatch',
    heroImage: '/feed/zafira_vxr_outcast_black_red.jpg',
    galleryImages: ['/feed/zafira_vxr_outcast_black_red.jpg', '/feed/widebody_zafira_speedhunters_aero.jpg'],
    specs: {
      engineCode: 'Z20LEH',
      displacement: '1,998 cc',
      cylinderConfig: 'Inline-4 16V Turbo Under-Piston Oil Squirters',
      induction: 'Single Turbo',
      powerBhp: 237,
      torqueNm: 320,
      redlineRpm: 6500,
      transmission: '6-Speed Manual (M32 with Quaife ATB)',
      drivetrain: 'FWD (Quaife Helical Differential)',
      curbWeightKg: 1590,
      powerToWeightBhpPerTonne: 149,
      zeroToSixtyMph: 7.2,
      topSpeedMph: 144,
      peakLateralG: 1.12,
      factoryTireSpec: 'Michelin Pilot Sport 4 (225/40 R18)',
      surfaceAffinity: 'all'
    },
    marketIntelligence: {
      ukEnthusiastStatus: 'Cult British underdog. The 7-seat family weapon with Recaro buckets, forged Z20LEH internals, and surprising chassis agility.',
      soundtrackSignature: 'Deep turbocharged burble with distinct K04 actuator dump noise and Remus exhaust rumble.',
      commonEnthusiastMods: ['Quaife ATB differential', 'Courtney Sport Stage 2 map', 'Airtec front mount intercooler', 'Bilstein B14 coilovers'],
      criticalInspectionPoints: ['M32 gearbox 6th gear bearing whine', 'Valve stem oil seal smoke on overrun', 'Rear spring mount corrosion'],
      benchmarkRoadSector: 'Cadwell Park Circuit & Snake Pass A57',
      estimatedPriceGbp: '£4,500 – £8,500'
    }
  },
  {
    id: 'car-vw-golf-r-mk7',
    make: 'Volkswagen',
    model: 'Golf R',
    variant: '2.0 TSI 4Motion Hatchback',
    chassisCode: 'MK7.5',
    productionYears: '2017–2020',
    archetype: 'hot_hatch',
    heroImage: '/feed/vw_golf_r_mk7_lapiz.jpg',
    galleryImages: ['/feed/vw_golf_r_mk7_lapiz.jpg', '/real_uk_driveway_wash.jpg'],
    specs: {
      engineCode: 'EA888 Gen 3',
      displacement: '1,984 cc',
      cylinderConfig: 'Inline-4 16V TSI Direct & Multi-Point Injection',
      induction: 'Single Turbo',
      powerBhp: 306,
      torqueNm: 400,
      redlineRpm: 6800,
      transmission: '7-Speed Dual-Clutch (DQ381 DSG) / 6-Speed Manual',
      drivetrain: 'Haldex Gen 5 All-Wheel Drive',
      curbWeightKg: 1483,
      powerToWeightBhpPerTonne: 206,
      zeroToSixtyMph: 4.5,
      topSpeedMph: 155,
      peakLateralG: 1.20,
      factoryTireSpec: 'Michelin Pilot Sport 4S (235/35 R19)',
      surfaceAffinity: 'all'
    },
    marketIntelligence: {
      ukEnthusiastStatus: 'The ultimate British all-weather daily driver. Impeccable build quality, immense wet-weather grip, and remap potential to 380+ BHP on stock hardware.',
      soundtrackSignature: 'Crisp 4-cylinder turbo tone with unmistakable DSG dual-clutch "farts" on hard upshifts.',
      commonEnthusiastMods: ['RacingLine R600 cold air intake', 'Milltek valved cat-back exhaust', 'Revo Stage 1 ECU tune', 'Whiteline rear anti-roll bar'],
      criticalInspectionPoints: ['Haldex pump filter mesh blockage (vital check)', 'Water pump and thermostat housing coolant weep', 'IS38 turbo shaft play on tuned cars'],
      benchmarkRoadSector: 'Cat and Fiddle Pass A537, Peak District',
      estimatedPriceGbp: '£18,000 – £26,000'
    }
  }
];

export const ARCHETYPE_META: Record<CarArchetype, { label: string; icon: string; description: string }> = {
  hot_hatch: {
    label: 'B-Road Hot Hatches',
    icon: '🔥',
    description: 'The heartbeat of British motoring. Lightweight, nimble FWD/AWD pocket rockets with limited slip differentials.'
  },
  analog_purist: {
    label: 'Analog Purists',
    icon: '⚡',
    description: 'Naturally aspirated, high-RPM valvetrains, manual transmissions, and pure hydraulic steering communication.'
  },
  track_weapon: {
    label: 'Track Weapons',
    icon: '🏁',
    description: 'Sub-1,000 kg featherweights engineered purely for apex attacks, kerb riding, and circuit dominance.'
  },
  supercar_gt: {
    label: 'Supercars & GTs',
    icon: '👑',
    description: 'Carbon monocages, transaxles, and continental grand tourers built for cross-border alpine expeditions.'
  },
  homologation_legend: {
    label: 'Homologation Legends',
    icon: '🏆',
    description: 'Group A and WRC homologation specials with active yaw control, iron blocks, and motorsport pedigree.'
  },
  overland_4x4: {
    label: 'Highland Overlanders',
    icon: '⛰️',
    description: 'Low-range transfer boxes, locking differentials, deep wading snorkels, and rough gravel shakedowns.'
  },
  fast_wagon_saloon: {
    label: 'Autobahn Wagons & Saloons',
    icon: '🚀',
    description: 'All-weather continent crushers combining family estate practicality with supercar-humbling straight-line pace.'
  },
  restomod_classic: {
    label: 'Restomods & Classics',
    icon: '🏛️',
    description: 'Period-correct coachwork, individual throttle bodies, and historic concours d’elegance provenance.'
  }
};

export interface MotorsportHeritage {
  racingCategory: string;
  badge: string;
  racingBadge?: string;
  legendaryWhy: string;
  driverVibe: string;
  agilityRating: number;
  agilityScore?: number;
  thrillRating: number;
  driverThrillScore?: number;
  iconicCircuit: string;
  racingAchievements?: string[];
}

export type MotorsportModel = AutomotiveModel;

export const MOTORSPORT_HERITAGE_MAP: Record<string, MotorsportHeritage> = {
  'car-aston-vantage-v8': {
    racingCategory: 'GT4 & Le Mans Endurance',
    badge: '🏆 GT4 Endurance',
    legendaryWhy: 'The last great analog Aston Martin. A bespoke bonded-aluminum chassis with a dry-sump 4.7L V8 developed for Nürburgring 24-hour endurance competition.',
    driverVibe: 'Pure British V8 Symphony',
    agilityRating: 88,
    thrillRating: 93,
    iconicCircuit: 'Nürburgring Nordschleife'
  },
  'car-audi-b7-rs4': {
    racingCategory: 'DTM & Super Touring Lineage',
    badge: '⚡ DTM Heritage',
    legendaryWhy: 'The high-revving 8,250 RPM naturally aspirated V8 estate with rear-biased Quattro that redefined all-weather performance on British country roads.',
    driverVibe: '8,250 RPM V8 Roar',
    agilityRating: 88,
    thrillRating: 94,
    iconicCircuit: 'Spa-Francorchamps'
  },
  'car-bmw-m3-g80': {
    racingCategory: 'M4 GT3 Endurance Platform',
    badge: '🏆 DTM & GT3 DNA',
    legendaryWhy: 'The twin-turbo inline-6 powerhouse that forms the direct engineering foundation for BMW\'s championship-winning M4 GT3 endurance race cars.',
    driverVibe: 'Relentless Boost Surge',
    agilityRating: 92,
    thrillRating: 91,
    iconicCircuit: 'Nürburgring 24h & Silverstone'
  },
  'car-bmw-m3-e46-csl': {
    racingCategory: 'Touring Car & Nürburgring Icon',
    badge: '🏁 Nürburgring Cult Icon',
    legendaryWhy: 'Widely considered the ultimate analog M car. Carbon-fiber roof, no sound deadening, and an induction roar from the carbon airbox that echoes for miles.',
    driverVibe: 'Unfiltered S54 Induction',
    agilityRating: 96,
    thrillRating: 99,
    iconicCircuit: 'Nürburgring Nordschleife'
  },
  'car-bmw-e30-318is': {
    racingCategory: 'Group A Touring Car Ancestry',
    badge: '⚡ Group A Lineage',
    legendaryWhy: 'Known as the "Baby M3", the lightweight 318is possesses pure 50:50 chassis balance and rev-happy 16V twin-cam agility that teaches drivers the art of momentum.',
    driverVibe: 'Pure Momentum Flow',
    agilityRating: 91,
    thrillRating: 92,
    iconicCircuit: 'Brands Hatch Indy'
  },
  'car-caterham-620r': {
    racingCategory: 'Single-Seater Track Weapon',
    badge: '⏱️ Sub-1,000kg Pure Tracker',
    legendaryWhy: 'Weighs only 610kg with a 310 BHP supercharged engine and sequential dog-ring gearbox. The closest experience to a Formula racing car with number plates.',
    driverVibe: 'Go-Kart G-Forces',
    agilityRating: 100,
    thrillRating: 100,
    iconicCircuit: 'Cadwell Park Circuit'
  },
  'car-ford-fiesta-st-mk8': {
    racingCategory: 'WRC Junior & B-Road Benchmark',
    badge: '🏁 B-Road Giant Killer',
    legendaryWhy: 'Fitted with a Quaife mechanical limited-slip differential, this pocket rocket lifts its inside rear wheel in corners and outhandles supercars on narrow twisty roads.',
    driverVibe: 'Playful Lift-Off Oversteer',
    agilityRating: 95,
    thrillRating: 93,
    iconicCircuit: 'Anglesey Coastal'
  },
  'car-ford-escort-cosworth': {
    racingCategory: 'WRC Group A Homologation',
    badge: '🏁 WRC Homologation',
    legendaryWhy: 'Homologated to win the World Rally Championship with legendary Cosworth turbo power and a high-downforce whale-tail rear wing that made motorsport history.',
    driverVibe: 'Raw Group A Turbo Boost',
    agilityRating: 91,
    thrillRating: 97,
    iconicCircuit: 'Rally Monte Carlo & Oulton Park'
  },
  'car-honda-type-r-fl5': {
    racingCategory: 'TCR World Tour & Nürburgring FWD Record',
    badge: '🏆 TCR Champion',
    legendaryWhy: 'Holds the Nürburgring front-wheel-drive production lap record. Features dual-axis front suspension that completely eliminates torque steer under full acceleration.',
    driverVibe: 'Surgical Front-End Grip',
    agilityRating: 97,
    thrillRating: 94,
    iconicCircuit: 'Suzuka & Nürburgring'
  },
  'car-defender-110-v8': {
    racingCategory: 'Dakar & Overland Raid',
    badge: '🏜️ Overland Raid Special',
    legendaryWhy: 'A supercharged 518 BHP V8 overland conquering machine with 900mm river wading depth and active electronic locking differentials.',
    driverVibe: 'Unstoppable Mountain Torque',
    agilityRating: 78,
    thrillRating: 89,
    iconicCircuit: 'Strata Florida & Sahara Dunes'
  },
  'car-lotus-emira-v6': {
    racingCategory: 'GT4 European Series Ancestry',
    badge: '🏆 GT4 Purist',
    legendaryWhy: 'The last gas-powered analog Lotus with genuine hydraulic power steering, an exposed manual gear linkage, and supercharged mid-engine balance.',
    driverVibe: 'Telepathic Steering Feel',
    agilityRating: 96,
    thrillRating: 95,
    iconicCircuit: 'Hethel Test Track & Donington'
  },
  'car-mclaren-720s': {
    racingCategory: 'GT3 Le Mans & Supercar Apex',
    badge: '🏆 GT3 Aerodynamic Apex',
    legendaryWhy: 'Carbon-fiber Monocage II chassis with active aerodynamic airbrake. Capable of 212 MPH while providing astonishing daily ride compliance via interconnected hydraulic dampers.',
    driverVibe: 'Hypersonic Acceleration',
    agilityRating: 98,
    thrillRating: 96,
    iconicCircuit: 'Silverstone GP & Monza'
  },
  'car-mgb-roadster': {
    racingCategory: 'Sebring & Goodwood Revival Classic',
    badge: '🏛️ Historic Sebring Racer',
    legendaryWhy: 'Classic British roadster converted into a Sebring track special with Rover V8 power, flared arches, and pure wind-in-the-hair period racing romance.',
    driverVibe: 'Classic V8 Rumble',
    agilityRating: 82,
    thrillRating: 90,
    iconicCircuit: 'Goodwood Motor Circuit'
  },
  'car-mitsubishi-evo-6-tme': {
    racingCategory: 'WRC 4-Time Championship Special',
    badge: '🏁 WRC Championship Icon',
    legendaryWhy: 'Commemorates Tommi Mäkinen\'s historic 4th consecutive WRC title with titanium turbine wheel for instantaneous boost and Active Yaw Control that defies physics on wet tarmac.',
    driverVibe: 'Instant Turbo Reflexes',
    agilityRating: 98,
    thrillRating: 99,
    iconicCircuit: 'Rally Finland & Col de Turini'
  },
  'car-nissan-skyline-r34': {
    racingCategory: 'JGTC GT500 & Bathurst "Godzilla"',
    badge: '🏆 JGTC "Godzilla" Legend',
    legendaryWhy: 'Dominator of Japanese and Australian touring car championships. Equipped with the legendary RB26 twin-turbo engine and computer-guided ATTESA all-wheel drive.',
    driverVibe: 'Twin-Turbo RB26 Roar',
    agilityRating: 94,
    thrillRating: 98,
    iconicCircuit: 'Fuji Speedway & Mount Panorama'
  },
  'car-porsche-911-gt3-992': {
    racingCategory: 'Porsche Supercup & 24h Nürburgring',
    badge: '🏆 GT3 Endurance Pedigree',
    legendaryWhy: 'The motorsport crown jewel. An atmospheric 4.0-litre flat-six screaming to 9,000 RPM, double-wishbone front suspension from the 911 RSR, and a 6-speed manual gearbox.',
    driverVibe: '9,000 RPM Analog Euphoria',
    agilityRating: 99,
    thrillRating: 100,
    iconicCircuit: 'Nürburgring Nordschleife'
  },
  'car-toyota-gr-yaris': {
    racingCategory: 'WRC Rally Homologation',
    badge: '🏁 WRC Rally Homologation',
    legendaryWhy: 'Built from a clean sheet for the World Rally Championship. Features a bespoke 3-door body, carbon roof, and GR-FOUR all-wheel drive developed with Tommi Mäkinen.',
    driverVibe: 'B-Road Mountain Weapon',
    agilityRating: 97,
    thrillRating: 96,
    iconicCircuit: 'Rally Sweden & Snake Pass'
  },
  'car-toyota-supra-a80': {
    racingCategory: 'JGTC GT500 & Le Mans GT1',
    badge: '🏆 JGTC GT500 Heritage',
    legendaryWhy: 'Powered by the indestructible iron-block 2JZ-GTE twin-turbo inline-6. A GT500 touring car legend famous for immense tuning potential and timeless shape.',
    driverVibe: 'Sequential Turbo Surge',
    agilityRating: 88,
    thrillRating: 95,
    iconicCircuit: 'Fuji Speedway & Tsukuba'
  },
  'car-vauxhall-zafira-vxr': {
    racingCategory: 'Nürburgring Nordschleife Record',
    badge: '🏁 Nürburgring 7-Seat Record',
    legendaryWhy: 'Set the official 7-seater Nürburgring Nordschleife lap record (8:54.38) with Manuel Reuter at the wheel. Recaro racing buckets and a forged turbo engine in a family MPV.',
    driverVibe: 'Wild Turbo Torque Steer',
    agilityRating: 82,
    thrillRating: 88,
    iconicCircuit: 'Cadwell Park & Nürburgring'
  },
  'car-vw-golf-r-mk7': {
    racingCategory: 'TCR Touring Car Engineering',
    badge: '⚡ All-Weather Benchmark',
    legendaryWhy: 'The benchmark all-weather weapon. Haldex all-wheel drive, dual-clutch lightning shifts, and an EA888 turbo engine tuned for effortless high-speed cross-country pace.',
    driverVibe: 'Effortless Point-and-Shoot',
    agilityRating: 90,
    thrillRating: 89,
    iconicCircuit: 'Anglesey Coastal Circuit'
  }
};

export function getMotorsportHeritage(car: AutomotiveModel): Required<MotorsportHeritage> {
  const base = MOTORSPORT_HERITAGE_MAP[car.id];
  const racingAchievements = [
    `${car.specs.powerBhp} BHP / ${car.specs.curbWeightKg.toLocaleString()} kg race homologation engineering`,
    `Calibrated for ${car.specs.peakLateralG}G lateral grip with ${car.specs.drivetrain}`,
    `Iconic proving ground benchmark at ${base?.iconicCircuit || car.marketIntelligence?.benchmarkRoadSector || 'Silverstone Circuit'}`
  ];

  if (base) {
    return {
      ...base,
      racingBadge: base.badge,
      agilityScore: base.agilityRating,
      driverThrillScore: base.thrillRating,
      racingAchievements: base.racingAchievements || racingAchievements
    };
  }

  const badge = `${ARCHETYPE_META[car.archetype]?.icon || '🏁'} ${ARCHETYPE_META[car.archetype]?.label || 'Icon'}`;
  const agilityScore = Math.min(100, Math.round(car.specs.peakLateralG * 75));
  const driverThrillScore = Math.min(100, Math.round((car.specs.powerToWeightBhpPerTonne / 400) * 100));

  return {
    racingCategory: ARCHETYPE_META[car.archetype]?.label || 'Enthusiast Special',
    badge,
    racingBadge: badge,
    legendaryWhy: car.marketIntelligence?.ukEnthusiastStatus || 'An extraordinary automotive platform celebrated across British motoring lore.',
    driverVibe: car.specs.induction === 'Naturally Aspirated' ? 'High-RPM Precision' : 'Punchy Turbo Thrust',
    agilityRating: agilityScore,
    agilityScore,
    thrillRating: driverThrillScore,
    driverThrillScore,
    iconicCircuit: car.marketIntelligence?.benchmarkRoadSector || 'British B-Road Benchmark',
    racingAchievements
  };
}

