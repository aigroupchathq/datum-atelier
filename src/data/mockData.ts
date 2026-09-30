import type { Vehicle, Drive, Build, MemoryEvent, VehicleHealth, CommunityPost, Professional, Community, GarageEvent } from '../types';

export const mockMayaVehicle: Vehicle = {
  id: 'car-maya-m3',
  ownerId: 'user-anon-8291',
  ownerIsAnonymous: true,
  name: 'MAYA',
  make: 'BMW',
  model: 'M3 Competition',
  trim: 'xDrive Saloon',
  year: 2023,
  heroImageUrl: '/real_uk_m3_cottage.jpg',
  galleryImages: [
    '/real_uk_m3_cottage.jpg',
    '/real_uk_driveway_wash.jpg'
  ],
  vrmPlate: 'LG23 BMW',
  isPlateBlurredDefault: true,
  spec: {
    engine: '3.0L Twin-Turbo S58 Inline-6',
    transmission: '8-Speed M Steptronic with Drivelogic',
    drivetrain: 'M xDrive AWD (RWD Mode capable)',
    powerBhp: 510,
    factoryColor: 'Isle of Man Green Metallic',
    mileageCurrent: 42184,
  },
  metrics: {
    followerCount: 1420,
    drivesCount: 184,
    buildVersionsCount: 4,
    memoryEventsCount: 38,
  }
};

export const mockOtherVehicles: Vehicle[] = [
  {
    id: 'car-kuro-gt3',
    ownerId: 'user-anon-1092',
    ownerIsAnonymous: true,
    name: 'KURO',
    make: 'Porsche',
    model: '911 GT3 Touring',
    year: 2022,
    heroImageUrl: '/real_uk_gt3_suburb.jpg',
    galleryImages: ['/real_uk_gt3_suburb.jpg'],
    vrmPlate: 'GT22 POR',
    isPlateBlurredDefault: true,
    spec: {
      engine: '4.0L Naturally Aspirated Boxer-6',
      transmission: '6-Speed Manual GT Sports',
      drivetrain: 'Rear-Wheel Drive',
      powerBhp: 502,
      factoryColor: 'Jet Black Metallic',
      mileageCurrent: 18400,
    },
    metrics: {
      followerCount: 2890,
      drivesCount: 76,
      buildVersionsCount: 2,
      memoryEventsCount: 16,
    }
  },
  {
    id: 'car-cobra-427',
    ownerId: 'user-julian-vane',
    ownerIsAnonymous: false,
    name: 'COBRA 427',
    make: 'AC Shelby',
    model: 'Cobra 427 S/C',
    trim: 'Side-Oiler Competition',
    year: 1966,
    heroImageUrl: '/feed/stone_garage_cobra_ferrari.jpg',
    galleryImages: ['/feed/stone_garage_cobra_ferrari.jpg'],
    vrmPlate: 'CSX 3014',
    isPlateBlurredDefault: false,
    spec: {
      engine: '7.0L Ford 427 Side-Oiler FE V8',
      transmission: 'Toploader 4-Speed Manual',
      drivetrain: 'Rear-Wheel Drive with Salisbury LSD',
      powerBhp: 485,
      factoryColor: 'Guardsman Blue with Wimbledon White Stripes',
      mileageCurrent: 28400,
    },
    metrics: {
      followerCount: 3420,
      drivesCount: 94,
      buildVersionsCount: 3,
      memoryEventsCount: 42,
    }
  },
  {
    id: 'car-hamish-bench',
    ownerId: 'user-hamish-heritage',
    ownerIsAnonymous: false,
    name: 'HERITAGE BENCH',
    make: 'DATUM',
    model: 'Open Community Workshop',
    trim: 'Highland Machine Shop',
    year: 1978,
    heroImageUrl: '/feed/heritage_wrenching_workshop.jpg',
    galleryImages: ['/feed/heritage_wrenching_workshop.jpg'],
    vrmPlate: 'WORKSHOP',
    isPlateBlurredDefault: false,
    spec: {
      engine: 'Master Engine Rebuild & Tolerance Bay',
      transmission: 'Manual Machine Tools',
      drivetrain: 'Twin Hydraulic Lifts & Dial Bore Gauges',
      powerBhp: 0,
      factoryColor: 'Patina Red & Steel',
      mileageCurrent: 0,
    },
    metrics: {
      followerCount: 4810,
      drivesCount: 0,
      buildVersionsCount: 120,
      memoryEventsCount: 88,
    }
  }
];

export const mockMayaDrive184: Drive = {
  id: 'drive-184',
  vehicleId: 'car-maya-m3',
  vehicleName: 'MAYA',
  vehicleModel: 'BMW M3 Competition',
  driveNumber: 184,
  title: 'Sunday Morning Run Through The Cotswolds',
  date: '28 September 2026',
  routeTitle: 'London Outskirts → Cotswolds Loop',
  distanceMiles: 126.4,
  durationMinutes: 134,
  efficiencyMpg: 38.4,
  costTotalGbp: 19.40,
  elevationGainFt: 1420,
  weather: 'Overcast, 12°C, damp morning roads',
  approximateStartRegion: 'West London Ring',
  approximateEndRegion: 'North Cotswolds',
  privacyProtectedEndpoints: true,
  photos: [
    '/real_uk_m3_cottage.jpg',
    '/real_uk_driveway_wash.jpg'
  ],
  ownerNotes: 'Checking the new damper rebound settings on the B4425 Roman road stretch. Turn-in feels markedly more progressive on damp bitumen with the Michelin PS4S set at 32 psi cold. Stopped at Burford for fresh espresso.',
  likesCount: 142,
  savesCount: 68
};

export const mockMayaBuild: Build = {
  id: 'build-maya-m3',
  vehicleId: 'car-maya-m3',
  currentVersion: 'BUILD 04',
  versions: [
    {
      versionCode: 'BUILD 04',
      date: 'August 2026',
      title: 'Chassis Compliance & Brake Thermal Endurance',
      summary: 'Upgraded suspension and brake pad compound for mixed B-road compliance and intermediate track work.',
      partsAdded: [
        {
          category: 'Suspension',
          componentName: 'KW Variant 4 3-Way Coilovers',
          previousPart: 'OEM M-Adaptive Dampers',
          rationale: 'Needed independent high and low speed compression adjustment to absorb sharp UK B-road frost heaves without unsettling the chassis mid-corner.',
          costGbp: 3850,
          provenance: 'verified_professional'
        },
        {
          category: 'Brakes',
          componentName: 'Ferodo DS2500 Pads + Motul RBF 660 Fluid',
          previousPart: 'OEM BMW Textar Compound',
          rationale: 'Eliminates pedal softening on long downhill passes while maintaining zero squeal during daily cold starts.',
          costGbp: 480,
          provenance: 'verified_professional'
        }
      ],
      photos: [
        'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1000&q=80'
      ]
    },
    {
      versionCode: 'BUILD 03',
      date: 'February 2026',
      title: 'Acoustic Character & Unsprung Mass',
      summary: 'Replaced stock exhaust with lightweight titanium and fitted forged wheels.',
      partsAdded: [
        {
          category: 'Exhaust',
          componentName: 'Akrapovič Evolution Titanium System',
          previousPart: 'OEM Stainless Steel System',
          rationale: 'Removes 14kg of dead weight behind the rear axle while introducing natural mechanical frequency without boom at 70mph cruise.',
          costGbp: 6200,
          provenance: 'verified_professional'
        },
        {
          category: 'Wheels',
          componentName: 'BBS FI-R Forged Monobloc (19" Front / 20" Rear)',
          previousPart: 'OEM Style 826M Cast Alloys',
          rationale: 'Shaves 7.2kg of rotational unsprung mass. Direct steering feedback improvement is palpable over broken road surfaces.',
          costGbp: 7400,
          provenance: 'verified_professional'
        }
      ],
      photos: []
    },
    {
      versionCode: 'BUILD 02',
      date: 'May 2024',
      title: 'Aero Preservation & Ceramic Treatment',
      summary: 'Full paint protection film and ceramic coating applied prior to first continental road trip.',
      partsAdded: [
        {
          category: 'Aero',
          componentName: 'OEM Carbon Fibre Front Inlets & Mirrors',
          previousPart: 'Gloss Black Plastic',
          rationale: 'Aesthetic consistency with carbon roof.',
          costGbp: 1400,
          provenance: 'verified_professional'
        }
      ],
      photos: []
    },
    {
      versionCode: 'BUILD 01',
      date: 'March 2023',
      title: 'Factory Specification Baseline',
      summary: 'Factory delivery state from BMW Park Lane with M Drivers Package and Extended Merino Leather.',
      partsAdded: [],
      photos: []
    }
  ]
};

export const mockMayaMemory: MemoryEvent[] = [
  {
    id: 'mem-01',
    vehicleId: 'car-maya-m3',
    date: 'June 2026',
    mileage: 41200,
    title: 'Brake Service & Fluid Flush',
    category: 'service',
    description: 'Fitted Ferodo DS2500 fast-road pads front/rear. Flushed brake hydraulics with Motul RBF 660 racing fluid.',
    provenance: 'verified_professional',
    verifiedSignatory: 'Evolve Automotive (Garage Pro #829)',
    costGbp: 480
  },
  {
    id: 'mem-02',
    vehicleId: 'car-maya-m3',
    date: 'March 2026',
    mileage: 38190,
    title: 'Annual Statutory MOT Inspection',
    category: 'mot',
    description: 'Official UK DVSA computerized roadworthiness test. Brakes, steering, suspension, emissions inspected. Result: PASS (0 Defects, 0 Advisories).',
    provenance: 'official_information',
    verifiedSignatory: 'DVSA MOT Inspection System',
    costGbp: 54.85
  },
  {
    id: 'mem-03',
    vehicleId: 'car-maya-m3',
    date: 'August 2025',
    mileage: 34500,
    title: 'Silverstone GP Intermediate Track Session',
    category: 'milestone',
    description: 'First intermediate track day session. 42 laps completed. Monitored engine oil temp remained at 104°C max.',
    provenance: 'owner_experience',
    verifiedSignatory: 'Silverstone Track Days'
  },
  {
    id: 'mem-04',
    vehicleId: 'car-maya-m3',
    date: 'May 2024',
    mileage: 18400,
    title: 'New Set: Michelin Pilot Sport 4S',
    category: 'tyres',
    description: 'Fitted 275/35 R19 front and 285/30 R20 rear. Complete 4-wheel Hunter optical alignment completed.',
    provenance: 'verified_professional',
    verifiedSignatory: 'Apex Tyres & Alignment',
    costGbp: 1220
  },
  {
    id: 'mem-05',
    vehicleId: 'car-maya-m3',
    date: 'March 2023',
    mileage: 12,
    title: 'Vehicle Delivery & Running-In Period',
    category: 'purchase',
    description: 'Handed over at BMW Park Lane. Initial 1,200-mile running-in service completed on schedule with rear differential fluid flush.',
    provenance: 'official_information',
    verifiedSignatory: 'BMW Park Lane Official Retailer'
  }
];

export const mockMayaHealth: VehicleHealth = {
  vehicleId: 'car-maya-m3',
  lastUpdated: '30 September 2026',
  subsystems: [
    {
      name: 'Engine Powertrain',
      metricLabel: 'OBD-II DTC Status',
      metricValue: '0 Active Faults',
      status: 'good',
      confidence: 'measured',
      notes: 'Oil life counter shows 4,200 miles remaining before next inspection cycle.'
    },
    {
      name: 'Braking Hydraulics',
      metricLabel: 'Front Pad Life',
      metricValue: '6.2 mm (~68%)',
      status: 'good',
      confidence: 'estimated',
      notes: 'Ferodo DS2500 installed at 41,200 miles. Fluid boiling point tested at 295°C.'
    },
    {
      name: '12V Electrical Battery',
      metricLabel: 'Resting Voltage',
      metricValue: '12.42 V',
      status: 'good',
      confidence: 'measured',
      notes: 'AGM battery health nominal. Alternator output reading 14.2V under full auxiliary load.'
    },
    {
      name: 'Emissions System',
      metricLabel: 'MOT Compliance',
      metricValue: 'Euro 6d Pass',
      status: 'good',
      confidence: 'recorded',
      notes: 'Official DVSA record from March 2026 statutory test.'
    }
  ],
  tyres: {
    brand: 'Michelin',
    model: 'Pilot Sport 4S',
    frontTreadMm: 5.2,
    rearTreadMm: 3.4,
    confidence: 'measured',
    advisoryNotice: 'Rear tread approaching 3.0mm wear advisory under -1.8° negative camber.'
  }
};

export const mockFeedPosts: CommunityPost[] = [
  {
    id: 'post-101',
    authorType: 'user',
    authorVehicleName: 'Julian Vane',
    authorVehicleModel: 'AC Cobra 427 & Ferrari 488',
    postType: 'CAR_STORY',
    title: 'Open Bay Doors: Why I invited a 15-year-old cyclist in to sit in the 427',
    content: 'Too many collectors treat their garages like locked vaults or tax assets. This morning, 15-year-old Toby from down our lane was leaning against the curb with his bicycle, peering into Bay 2. Instead of closing the shutter, I invited him in, handed him a clean microfiber cloth, and let him climb behind the wood-rimmed steering wheel while we fired up the 7.0L Ford side-oiler. His eyes lit up with pure mechanical wonder. We talked for an hour about twin Holley carbs, flat-plane crank harmonics on the 488, and why keeping analog machinery alive matters. A machine only lives if it inspires the next generation that will care for it. DATUM isn\'t about exclusive velvet ropes; it\'s about opening our garage doors and sharing the spark.',
    mediaUrls: [
      '/feed/stone_garage_cobra_ferrari.jpg'
    ],
    provenanceTag: 'owner_experience',
    createdAt: '1 hour ago',
    likesCount: 642,
    repliesCount: 82
  },
  {
    id: 'post-102',
    authorType: 'professional',
    authorVehicleName: 'Hamish MacLeod',
    authorVehicleModel: 'Heritage Engine Builder & Machinist',
    postType: 'GUIDE',
    title: 'Saturday Open Bench: Rescuing Alex’s seized BMW M10 cylinder block',
    content: 'Young Alex (21) arrived at 08:00 AM devastated — a franchise garage told him his grandfather\'s 1974 2002 block was scrap and quoted £4,800 for an exchange engine. We rolled it onto the engine stand in my back workshop. Cylinders 2 and 3 had stuck rings from 12 years in a damp barn, but zero bore scoring. Spent 7 hours together teaching him how to use penetrating solvent, a dial bore gauge, gentle 3-stone cylinder honing, and plastigauge tolerance checking. By 4:00 PM, the crank spun smoothly with one finger at 0.0018” oil clearance. Total cost to Alex: £35 for fresh Glyco bearings and a box of warm pasties. Never let someone abandon their dream when a few hours of shared workshop mentorship can save it.',
    mediaUrls: [
      '/feed/heritage_wrenching_workshop.jpg'
    ],
    provenanceTag: 'verified_professional',
    createdAt: '3 hours ago',
    likesCount: 1180,
    repliesCount: 142
  },
  {
    id: 'post-103',
    authorType: 'user',
    authorVehicleName: 'Midlands Collective',
    authorVehicleModel: 'Independent Custodian Cooperative',
    postType: 'EVENT',
    title: '24 Drivers, 1 Shared Sanctuary: How we solved city garaging without corporate price gouging',
    content: 'None of us had private garages or room for a two-post hydraulic lift in Victorian city terraces. Corporate vehicle vaults wanted £850/month per bay just to park cars in dark rows behind glass. So 24 of us banded together to lease this former aviation hall. We pooled funds for shared Snap-on tool cabinets, a Hunter optical wheel aligner, a dedicated wash bay with deionized water, and an open communal coffee bar. Every weekend, whether you drive an MX-5, a classic Mercedes, or a twin-turbo McLaren, we help each other bleed clutches, torque suspension links, and prepare for Sunday dawn drives. No egos, no gatekeeping, no VIP ropes. Just true enthusiasts bringing out the absolute best in each other.',
    mediaUrls: [
      '/feed/collective_atelier_hall.jpg'
    ],
    provenanceTag: 'owner_experience',
    createdAt: '5 hours ago',
    likesCount: 1590,
    repliesCount: 184
  },
  {
    id: 'post-104',
    authorType: 'user',
    authorVehicleName: 'Highland Expeditions',
    authorVehicleModel: 'Highland Overland Guild',
    postType: 'DRIVE',
    title: 'Zero Rigs Left Behind: Sub-zero trailside repair in the Cairnwell whiteout',
    content: 'At 2,198 ft on the old military trail in freezing fog, David\'s Defender cracked a lower radiator hose over a sharp granite boulder strike. In -5°C blizzard conditions, no one drove ahead. The convoy immediately formed a windbreak with three lead rigs, Marcus produced high-temp reinforced silicone hose from his recovery kit, Elena brewed boiling tea on the tailgate stove, and we refilled the system with premixed OAT coolant. 35 minutes later, the cooling circuit was bled and all six trucks safely crossed the mountain together. The true measure of an automotive community isn’t the spec sheet of your rig, but who turns their headlights around when the storm drops.',
    mediaUrls: [
      '/feed/snow_mountain_overland_convoy.jpg'
    ],
    provenanceTag: 'owner_experience',
    createdAt: '8 hours ago',
    likesCount: 914,
    repliesCount: 97,
    linkedDriveId: 'drive-184'
  },
  {
    id: 'post-105',
    authorType: 'car',
    authorVehicleId: 'car-maya-m3',
    authorVehicleName: 'MAYA',
    authorVehicleModel: 'BMW M3 Competition',
    authorVehicleYear: 2023,
    postType: 'CAR_STORY',
    title: 'Sunday 07:00 AM Driveway Ritual: Teaching road-salt protection to the neighborhood',
    content: 'Sunday morning foam bath ritual. Neighbor Mark walked over asking how to protect his high-mileage estate car against harsh winter council road salt without spending £1,200 on commercial pro details. Walked him through the Bilt-Hamber touchless alkaline pre-wash method, explained why pH neutrality saves clear coats, and gifted him my spare dual-action brass foam cannon. Seeing his pride two hours later as water beaded effortlessly off his ten-year-old daily driver was pure gold. Caring for our machines shouldn\'t be an elitist secret; sharing the craft elevates the whole street.',
    mediaUrls: [
      '/real_uk_driveway_wash.jpg'
    ],
    provenanceTag: 'owner_experience',
    createdAt: 'Yesterday',
    likesCount: 512,
    repliesCount: 49
  },
  {
    id: 'post-106',
    authorType: 'car',
    authorVehicleId: 'car-kuro-gt3',
    authorVehicleName: 'KURO',
    authorVehicleModel: 'Porsche 911 GT3 Touring',
    authorVehicleYear: 2022,
    postType: 'CAR_POST',
    title: 'The Courtesy of Silence: 06:15 AM residential departure protocol',
    content: '06:15 AM cold start on the block-paved driveway. Feathering the GT sports clutch, coasting in neutral down the street gradient, keeping exhaust valves strictly locked closed until two miles past the village limit. High-performance motoring only earns community respect when drivers show unconditional courtesy to the neighborhoods they live in. Because our local car group practices this, our neighbors wave and smile rather than complain. DATUM’s 800m privacy cloaking reminds us that genuine class is quiet until the open road begins.',
    mediaUrls: [
      '/real_uk_gt3_suburb.jpg'
    ],
    provenanceTag: 'owner_experience',
    createdAt: 'Yesterday',
    likesCount: 730,
    repliesCount: 82
  },
  {
    id: 'post-107',
    authorType: 'user',
    authorVehicleName: 'RetroMod_Dan',
    authorVehicleModel: '1989 BMW 318is (E30)',
    postType: 'CAR_POST',
    title: 'Passing the Torch: How the community helped a 22-year-old rebuild an analog gearbox',
    content: 'When my second gear synchro started crunching on the E30, three forum veterans in Bristol offered their tools, gave me an OEM Getrag 240 shift fork they had saved for a decade, and spent a rainy Sunday teaching a 22-year-old apprentice how to press gears without chipping teeth. They refused to take a single pound in payment; all they said was: \'When you are fifty, you do the same for the next young enthusiast.\' That is the DNA of DATUM. True car culture is a brotherhood of mutual preservation.',
    mediaUrls: [
      '/real_uk_e30_terrace.jpg'
    ],
    provenanceTag: 'owner_experience',
    createdAt: '2 days ago',
    likesCount: 945,
    repliesCount: 104
  },
  {
    id: 'post-108',
    authorType: 'car',
    authorVehicleName: 'EXPEDITION_110',
    authorVehicleModel: 'Land Rover Defender 110',
    authorVehicleYear: 2021,
    postType: 'DRIVE',
    title: 'Green-Laning Custodians: Clearing fallen timber and repairing parish culverts in the Dales',
    content: '60 miles of green lanes across Swaledale. Spent more time with the bow saw and winch than on the throttle. Cleared two fallen storm branches blocking the public bridleway, unclogged a stone culvert that was flooding a local sheep farmer\'s access track, and packed out three bags of tourist litter. Respect for the countryside is the only reason these historical lanes stay open for future drivers. Leave every trail cleaner and better than you found it.',
    mediaUrls: [
      '/real_uk_defender_farm.jpg'
    ],
    provenanceTag: 'owner_experience',
    createdAt: '2 days ago',
    likesCount: 812,
    repliesCount: 74,
    linkedDriveId: 'drive-184'
  },
  {
    id: 'post-109',
    authorType: 'car',
    authorVehicleId: 'car-maya-m3',
    authorVehicleName: 'MAYA',
    authorVehicleModel: 'BMW M3 Competition',
    authorVehicleYear: 2023,
    postType: 'DRIVE',
    title: 'B4425 Cotswolds Morning Loop: Exchanging setup notes with a fellow custodian',
    content: 'Met an owner running an older E46 M3 at the Burford bakery stop. Over fresh coffee, we spent an hour comparing chassis balance, KW damper rebound, and tire cold pressures on wet bitumen. He was struggling with mid-corner understeer; we checked his tire pressures with my Longacre digital gauge and found the front left was 6 psi over-inflated. Dropped it to 32 psi, went for a 10-mile tandem run over the crests, and he said his car had never felt so responsive. It costs nothing to lend an ear and a tire gauge to a fellow driver.',
    mediaUrls: [
      '/real_uk_m3_cottage.jpg'
    ],
    provenanceTag: 'owner_experience',
    createdAt: '3 days ago',
    likesCount: 678,
    repliesCount: 58,
    linkedDriveId: 'drive-184'
  },
  {
    id: 'post-110',
    authorType: 'car',
    authorVehicleId: 'car-maya-m3',
    authorVehicleName: 'MAYA',
    authorVehicleModel: 'BMW M3 Competition',
    authorVehicleYear: 2023,
    postType: 'BUILD_UPDATE',
    title: 'Open S58 Knowledge Base: KW Variant 4 damper setup notes for real UK roads',
    content: 'Publishing our full suspension setup openly for anyone struggling with G80 rebound harshness over rough UK B-roads. After 1,200 miles of telemetry logging, we ended at: 12 clicks rebound front, 6 clicks low-speed compression, 3 clicks high-speed compression. Rear: 14 clicks rebound, 5 clicks low-speed compression. Ride height: -15mm front, -10mm rear. The nervous lateral hop over crests is completely cured. Full alignment sheet published to the Community Tech Hub.',
    mediaUrls: [
      '/real_uk_m3_cottage.jpg',
      '/real_uk_driveway_wash.jpg'
    ],
    provenanceTag: 'verified_professional',
    createdAt: '4 days ago',
    likesCount: 520,
    repliesCount: 63,
    linkedBuildVersion: 'BUILD 04'
  }
];

export const mockPros: Professional[] = [
  {
    id: 'pro-evolve',
    businessName: 'Evolve Automotive',
    category: 'Mechanic',
    verifiedStatus: true,
    locationArea: 'Luton / Bedfordshire, UK',
    bio: 'Independent BMW M-Power & performance engineering specialists. Equipped with in-house dyno cell, suspension geometry rigs, and factory ISTA diagnostics.',
    verifiedJobsCount: 512,
    ratingScore: 5.0,
    specialistMakes: ['BMW M', 'MINI JCW', 'Porsche GT'],
    verifiedPortfolio: [
      { vehicleName: 'MAYA (BMW M3)', workSummary: 'KW V4 Coilovers & Fast-Road Alignment', date: 'August 2026' },
      { vehicleName: 'BMW M2 CS', workSummary: 'Eventuri Intake & Downpipe Calibration', date: 'July 2026' }
    ]
  },
  {
    id: 'pro-apex-tyres',
    businessName: 'Apex Tyres & Laser Geometry',
    category: 'Tyre Specialist',
    verifiedStatus: true,
    locationArea: 'Guildford / Surrey, UK',
    bio: 'Beissbarth 3D laser optical wheel alignment and touchless tyre mounting for high-value forged alloy wheels.',
    verifiedJobsCount: 240,
    ratingScore: 4.9,
    specialistMakes: ['All Performance Marques'],
    verifiedPortfolio: [
      { vehicleName: 'MAYA (BMW M3)', workSummary: 'Michelin PS4S Fitment & -1.8 Camber Setup', date: 'May 2024' }
    ]
  },
  {
    id: 'pro-precision-detail',
    businessName: 'Studio Ten Detailing',
    category: 'Detailer',
    verifiedStatus: true,
    locationArea: 'Henley-on-Thames, UK',
    bio: 'Gyeon certified studio specializing in self-healing paint protection film (PPF) and multi-stage paint correction for road and concours cars.',
    verifiedJobsCount: 180,
    ratingScore: 4.9,
    specialistMakes: ['Porsche', 'Ferrari', 'BMW M'],
    verifiedPortfolio: [
      { vehicleName: 'KURO (Porsche GT3)', workSummary: 'Full Front PPF & Ceramic Wheel Guard', date: 'April 2025' }
    ]
  },
  {
    id: 'pro-rpm-technik',
    businessName: 'RPM Technik Porsche Specialists',
    category: 'Mechanic',
    verifiedStatus: true,
    locationArea: 'Tring / Hertfordshire, UK',
    bio: 'Independent Porsche technical center and Manthey Racing certified partner. Dedicated engine dyno cells, chassis corner-weighting, and air-cooled/water-cooled specialists.',
    verifiedJobsCount: 420,
    ratingScore: 5.0,
    specialistMakes: ['Porsche 911', 'Cayman GT4', 'Manthey Racing'],
    verifiedPortfolio: [
      { vehicleName: 'KURO (Porsche 911 GT3)', workSummary: 'Manthey Geometry & Corner Balancing (50.1% cross-weight)', date: 'September 2026' },
      { vehicleName: 'Porsche 997.2 GT3 RS', workSummary: 'Coolant Pipe Pinning & Cup Clutch Fitment', date: 'June 2026' }
    ]
  },
  {
    id: 'pro-litchfield',
    businessName: 'Litchfield Motors',
    category: 'Mechanic',
    verifiedStatus: true,
    locationArea: 'Tewkesbury / Gloucestershire, UK',
    bio: 'World-renowned powertrain developers and suspension geometry calibrators. Official Bilstein, Akrapovič, and KW development partners with in-house Maha dyno cell.',
    verifiedJobsCount: 680,
    ratingScore: 5.0,
    specialistMakes: ['Nissan GT-R', 'BMW M', 'Porsche', 'Toyota GR'],
    verifiedPortfolio: [
      { vehicleName: 'MAYA (BMW M3)', workSummary: 'Akrapovič Evolution Titanium System & Dyno Calibration', date: 'July 2026' },
      { vehicleName: 'Toyota GR Yaris', workSummary: 'Nitron R1 Suspension & Litchfield Syvecs ECU', date: 'May 2026' }
    ]
  },
  {
    id: 'pro-motor-hub',
    businessName: 'The Classic Motor Hub Atelier',
    category: 'Restorer',
    verifiedStatus: true,
    locationArea: 'Bibury / Cotswolds, UK',
    bio: 'Historic motoring preservation atelier based on a RAF WWII airbase in the Cotswolds. DVSA historic provenance certification, lead loading, and period-correct mechanical rebuilding.',
    verifiedJobsCount: 195,
    ratingScore: 4.9,
    specialistMakes: ['Classic BMW', 'Air-Cooled Porsche', 'Jaguar', 'Aston Martin'],
    verifiedPortfolio: [
      { vehicleName: 'RetroMod_Dan (BMW E30 318is)', workSummary: 'Trailing Arm Bushing Refresh & Undercarriage Dry-Ice Blasting', date: 'March 2026' }
    ]
  }
];

export const mockCommunities: Community[] = [
  // 1. Technical & Expert Communities
  {
    id: 'comm-tuning-s58',
    name: 'S58 & M-Performance Tuning Guild',
    category: 'technical_expert',
    subcategory: 'Tuning & Forced Induction',
    type: 'model',
    description: 'ECU calibrations, downpipe flow dynamics, chargecooler heat soak data, and verified hub dyno graphs. Zero butt-dyno claims.',
    memberCount: 3820,
    activeCarsCount: 1420,
    badgeEmoji: '⚡',
    coverImageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    tags: ['Bootmod3', 'MHD', 'Pure Turbos', 'Dyno Bench'],
    featuredSpec: 'Stage 2 E50 Map • 680 BHP • 820 Nm',
    activeConvoyOrChallenge: 'Dyno Shootout @ Evolve Luton (Nov 2026)',
    topVehicles: [
      { name: 'MAYA', model: 'BMW M3 G80', imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=200&q=80', spec: 'Stage 1+ • 560 BHP' },
      { name: 'G82_TRACK', model: 'BMW M4 Competition', imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=200&q=80', spec: 'Pure Stage 2 • 710 BHP' }
    ],
    verifiedProPartner: { name: 'Evolve Automotive', specialty: 'Engine & Dyno Calibration' }
  },
  {
    id: 'comm-restoration-classics',
    name: 'Air-Cooled & Classic Barn-Find Guild',
    category: 'technical_expert',
    subcategory: 'Restoration & Preservation',
    type: 'interest',
    description: 'Dedicated to reviving vintage air-cooled metal to factory-fresh or period-correct standards. Rust mitigation ledgers, lead loading, and OEM NOS part sourcing.',
    memberCount: 2490,
    activeCarsCount: 890,
    badgeEmoji: '🛠️',
    coverImageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    tags: ['Porsche 964', '993', 'E30 M3', 'Bare Metal'],
    featuredSpec: '1973 Carrera RS 2.7 • Paint Code 220 Light Green',
    activeConvoyOrChallenge: 'Barn Find to Salon Privé Concours Challenge',
    topVehicles: [
      { name: 'HERITAGE_964', model: 'Porsche 911 (964)', imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=200&q=80', spec: 'Full Nut & Bolt Rotisserie Restoration' }
    ],
    verifiedProPartner: { name: 'Autofarm Heritage', specialty: 'Air-Cooled Engine Building' }
  },
  {
    id: 'comm-diy-maintenance',
    name: 'DIY Wrenching & Diagnostics Collective',
    category: 'technical_expert',
    subcategory: 'DIY & Maintenance',
    type: 'interest',
    description: 'Peer-to-peer torque spec blueprints, live ISTA/VCDS trouble code sharing, Bushing press tool lending, and driveway maintenance logs.',
    memberCount: 6140,
    activeCarsCount: 2980,
    badgeEmoji: '🔧',
    coverImageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
    tags: ['Torque Specs', 'OBD2 Diagnostics', 'Fluid Flushes', 'Tool Loan'],
    featuredSpec: 'Hunter 3D Alignment Guide & Corner Weight Formula',
    activeConvoyOrChallenge: 'Community Torque & Geometry Bench',
    topVehicles: [
      { name: 'MAYA', model: 'BMW M3 G80', imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=200&q=80', spec: 'Ferodo DS2500 & Motul RBF660 Self-Installed' }
    ]
  },

  // 2. Motorsport & Performance Groups
  {
    id: 'comm-time-attack',
    name: 'UK Time Attack & Circuit Sprint Association',
    category: 'motorsport_performance',
    subcategory: 'Track Day & Time Attack',
    type: 'interest',
    description: 'Closed-circuit GPS Drive telemetry leaderboards across Silverstone, Cadwell Park, and Donington. Classified strictly by tyre compound (200TW vs Semi-Slick).',
    memberCount: 4180,
    activeCarsCount: 1640,
    badgeEmoji: '🏁',
    coverImageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    tags: ['Silverstone GP', 'Cadwell Park', '200TW', 'Telemetry'],
    featuredSpec: 'Cadwell Park Club Record: 1:36.42 on Nankang AR-1',
    activeConvoyOrChallenge: 'Cadwell Paddock Time Trials • Oct 24',
    topVehicles: [
      { name: 'KURO', model: 'Porsche 911 GT3 (992)', imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=200&q=80', spec: 'Manthey Racing Aero • 1:58.2 Silverstone GP' },
      { name: 'YUKI', model: 'Toyota GR Yaris Circuit', imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=200&q=80', spec: 'Nitron R3 • Torsen LSDs' }
    ],
    verifiedProPartner: { name: 'Apex Track Engineering', specialty: 'Corner Weighting & Geo' }
  },
  {
    id: 'comm-drift-syndicate',
    name: 'Drift & Steering Angle Syndicate',
    category: 'motorsport_performance',
    subcategory: 'Drifting & Slip-Angle',
    type: 'interest',
    description: 'Lock kit steering geometry (65° angle kits), 2-way clutch LSD lock rates, hydraulic handbrake plumbing, and rear tyre delamination telemetry.',
    memberCount: 2950,
    activeCarsCount: 920,
    badgeEmoji: '💨',
    coverImageUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80',
    tags: ['Wisefab', '2-Way LSD', 'Rear Tyre Wear', 'Angle Kits'],
    featuredSpec: 'Wisefab Lock Kit • 68° Steering Angle • Kaaz 2-Way Diff',
    activeConvoyOrChallenge: 'Three Sisters Wet Skidpan Clinic',
    topVehicles: [
      { name: 'S15_SILVIA', model: 'Nissan Silvia S15', imageUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=200&q=80', spec: 'SR20DET • 450 BHP • Wisefab Angle' }
    ]
  },

  // 3. Aesthetic & Subculture Guilds
  {
    id: 'comm-stance-fitment',
    name: 'Stance, Offset & Fitment Guild',
    category: 'aesthetic_subculture',
    subcategory: 'Stance & Fitment',
    type: 'interest',
    description: 'The definitive wheel fitment database. Exact offset (ET), J width, camber angles, tyre stretch profiles, and arch lip clearance measurements with zero guess work.',
    memberCount: 5210,
    activeCarsCount: 2100,
    badgeEmoji: '📐',
    coverImageUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
    tags: ['BBS LM', 'Camber -3.2°', 'Air Lift 3P', 'Flush Fitment'],
    featuredSpec: 'Front: 19x9.5 ET14 (-2.4°) | Rear: 20x10.5 ET18 (-2.8°)',
    activeConvoyOrChallenge: 'Fender-to-Lip Millimeter Clearance Registry',
    topVehicles: [
      { name: 'E46_SLAMMED', model: 'BMW M3 (E46)', imageUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=200&q=80', spec: 'Air Lift Performance • BBS RS 3-Piece' }
    ]
  },
  {
    id: 'comm-concours-preservation',
    name: 'Show & Shine / Concours d\'Elegance Society',
    category: 'aesthetic_subculture',
    subcategory: 'Concours & Detailing',
    type: 'interest',
    description: 'Ultrasonic chassis wash logs, ultrasonic dry-ice blasting, multi-stage rotary paint correction, and paint depth gauge micron tracking (110μm original clear coat).',
    memberCount: 1840,
    activeCarsCount: 650,
    badgeEmoji: '✨',
    coverImageUrl: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=800&q=80',
    tags: ['Dry Ice Blasting', 'Gyeon Quartz', 'Micron Paint Depth', 'Concours'],
    featuredSpec: 'Paint Depth Meter: Average 118μm • 0 Swirl Holograms',
    activeConvoyOrChallenge: 'Salon Privé Blenheim Palace Roll Call',
    topVehicles: [
      { name: 'KURO', model: 'Porsche 911 GT3 (992)', imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=200&q=80', spec: 'SunTek Ultra PPF + Gyeon Mohs+ Ceramic' }
    ],
    verifiedProPartner: { name: 'Studio Ten Detailing', specialty: 'Paint Correction & Ceramic' }
  },

  // 4. Lifestyle & Adventure Collectives
  {
    id: 'comm-overland-expeditions',
    name: 'Highland Overland & 4x4 Expedition Society',
    category: 'lifestyle_adventure',
    subcategory: 'Off-Road & Overland',
    type: 'interest',
    description: 'Trail clearance grades, water-wading depth telemetry, winch recovery ratings, and off-grid lithium/solar schematics for remote wilderness bivouacs.',
    memberCount: 3410,
    activeCarsCount: 1180,
    badgeEmoji: '🌲',
    coverImageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    tags: ['Defender 110', 'Land Cruiser', 'Green Laning', 'Off-Grid'],
    featuredSpec: '200Ah Lithium • ARB Twin Compressor • 900mm Wading Depth',
    activeConvoyOrChallenge: 'Cairngorms Snow Pass Expedition • Dec 2026',
    topVehicles: [
      { name: 'EXPEDITION_DEFENDER', model: 'Land Rover Defender 110', imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=200&q=80', spec: 'Old Man Emu BP-51 Shocks • Roof Tent' }
    ]
  },
  {
    id: 'comm-cars-coffee-dawn',
    name: 'Sunday Dawn Runs & Caffeine Gathering',
    category: 'lifestyle_adventure',
    subcategory: 'Cruising & Meets',
    type: 'local',
    description: 'Unapologetically early 6:00 AM departures while the roads are empty and dew is still on the tarmac. Automatic convoy roll-calls with 800m residential privacy geofencing.',
    memberCount: 9280,
    activeCarsCount: 4100,
    badgeEmoji: '☕',
    coverImageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    tags: ['Caffeine & Machine', 'Cotswolds', 'Dawn Patrol', 'B-Roads'],
    featuredSpec: 'Next Route: B4425 Burford to Bibury Loop (42.8 mi)',
    activeConvoyOrChallenge: 'Cotswolds Dawn Patrol Convoy • Sunday 06:15 AM',
    topVehicles: [
      { name: 'MAYA', model: 'BMW M3 G80', imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=200&q=80', spec: 'Isle of Man Green • 184 Logged Drives' },
      { name: 'KURO', model: 'Porsche 911 GT3', imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=200&q=80', spec: 'Chalk Grey • 92 Logged Drives' }
    ]
  },

  // 5. Brand & Era-Specific Societies
  {
    id: 'comm-radwood-jdm',
    name: 'Radwood & Golden Age JDM Preservation',
    category: 'brand_era',
    subcategory: 'Era Preservationists',
    type: 'interest',
    description: 'The golden decade of analog Japanese and European homologation specials (1985–1999). Factory option catalogues, cassette deck restorations, and chassis registry.',
    memberCount: 4720,
    activeCarsCount: 1890,
    badgeEmoji: '📼',
    coverImageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    tags: ['R32 GT-R', 'FD3S RX-7', 'E30 M3', 'Lancia Delta'],
    featuredSpec: '1994 Nissan Skyline GT-R V-Spec II • Gun Grey Metallic KH2',
    activeConvoyOrChallenge: 'Mid-Night Tokyo & Ace Cafe Revival',
    topVehicles: [
      { name: 'GODZILLA_R32', model: 'Nissan Skyline GT-R (R32)', imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=200&q=80', spec: 'RB26DETT • Nismo Heritage Parts' }
    ]
  }
];

export const mockEvents: GarageEvent[] = [
  {
    id: 'event-01',
    title: 'Brecon Beacons Dawn Drive',
    date: 'Saturday, 10 October 2026 • 06:00 AM',
    locationRegion: 'A4067 Meeting Point, Sennybridge',
    organizerName: 'UK B-Roads Club',
    attendeesCount: 24,
    coverImageUrl: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=800&q=80',
    type: 'drive'
  },
  {
    id: 'event-02',
    title: 'Cars & Coffee at Caffeine & Machine',
    date: 'Sunday, 18 October 2026 • 09:00 AM',
    locationRegion: 'Ettington, Stratford-upon-Avon',
    organizerName: 'Garage Community UK',
    attendeesCount: 88,
    coverImageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    type: 'meet'
  }
];
