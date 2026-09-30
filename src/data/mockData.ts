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
    id: 'car-yuki-mx5',
    ownerId: 'user-anon-4421',
    ownerIsAnonymous: true,
    name: 'YUKI',
    make: 'Mazda',
    model: 'MX-5',
    trim: '1.8i S Special',
    year: 1996,
    heroImageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [],
    vrmPlate: 'N842 WMX',
    isPlateBlurredDefault: true,
    spec: {
      engine: '1.8L BP-ZE Inline-4',
      transmission: '5-Speed Manual',
      drivetrain: 'Rear-Wheel Drive with Torsen LSD',
      powerBhp: 131,
      factoryColor: 'Chaste White',
      mileageCurrent: 114200,
    },
    metrics: {
      followerCount: 840,
      drivesCount: 210,
      buildVersionsCount: 5,
      memoryEventsCount: 52,
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
    authorType: 'car',
    authorVehicleId: 'car-maya-m3',
    authorVehicleName: 'MAYA',
    authorVehicleModel: 'BMW M3 Competition',
    authorVehicleYear: 2023,
    postType: 'DRIVE',
    title: 'Drive #184: London → Cotswolds Loop',
    content: '126 miles across the Roman roads of Gloucestershire. Testing the newly fitted KW V4 compression damping over undulating surfaces. The front-end bite in damp conditions is transformed.',
    mediaUrls: [
      '/real_uk_m3_cottage.jpg',
      '/real_uk_driveway_wash.jpg'
    ],
    provenanceTag: 'owner_experience',
    createdAt: '2 hours ago',
    likesCount: 142,
    repliesCount: 18,
    linkedDriveId: 'drive-184'
  },
  {
    id: 'post-102',
    authorType: 'car',
    authorVehicleId: 'car-maya-m3',
    authorVehicleName: 'MAYA',
    authorVehicleModel: 'BMW M3 Competition',
    authorVehicleYear: 2023,
    postType: 'BUILD_UPDATE',
    title: 'Build 04: KW Variant 4 Setup Notes',
    content: 'Installed 3-way adjustable coilovers. After 1,000 miles of settling, we dialed in 12 clicks rebound front, 6 clicks low-speed compression. The pogo bounce on high-speed B-road dips is completely gone.',
    mediaUrls: [
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1200&q=90'
    ],
    provenanceTag: 'verified_professional',
    createdAt: 'Yesterday',
    likesCount: 230,
    repliesCount: 42,
    linkedBuildVersion: 'BUILD 04'
  },
  {
    id: 'post-103',
    authorType: 'car',
    authorVehicleId: 'car-kuro-gt3',
    authorVehicleName: 'KURO',
    authorVehicleModel: 'Porsche 911 GT3 Touring',
    authorVehicleYear: 2022,
    postType: 'CAR_STORY',
    title: 'Crossing Llanberis Pass at First Light',
    content: 'No music, windows cracked down an inch to hear the 9,000 RPM valvetrain echoing off the slate cliffs of Snowdonia. A car is not a commuting appliance; it is a gateway to mornings like this.',
    mediaUrls: [
      '/real_uk_gt3_suburb.jpg'
    ],
    provenanceTag: 'owner_experience',
    createdAt: '2 days ago',
    likesCount: 489,
    repliesCount: 56
  },
  {
    id: 'post-104',
    authorType: 'user',
    postType: 'QUESTION',
    title: 'Uneven inner shoulder rear tyre wear on G80 M3 with -1.8° camber?',
    content: 'Looking at my rear Pilot Sport 4S tread: outer is at 4.8mm, but the inner shoulder has reached 3.4mm after 9,000 miles. Has anyone experimented with dropping rear camber to -1.5° for street-only use?',
    mediaUrls: [
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=90'
    ],
    provenanceTag: 'community_opinion',
    createdAt: '3 days ago',
    likesCount: 38,
    repliesCount: 24
  },
  {
    id: 'post-105',
    authorType: 'car',
    authorVehicleId: 'car-maya-m3',
    authorVehicleName: 'MAYA',
    authorVehicleModel: 'BMW M3 Competition',
    authorVehicleYear: 2023,
    postType: 'CAR_STORY',
    title: 'Sunday 07:00 AM Driveway Snow-Foam Decon Wash',
    content: 'Bilt-Hamber touchless alkaline pre-wash on the driveway before the salt crust sets in. Two-bucket method with grit guards and a cordless warm-air blower for the calipers and front grille mesh. Zero swirls, ceramic coat beading like day one.',
    mediaUrls: [
      '/real_uk_driveway_wash.jpg'
    ],
    provenanceTag: 'owner_experience',
    createdAt: '3 days ago',
    likesCount: 312,
    repliesCount: 29
  },
  {
    id: 'post-106',
    authorType: 'car',
    authorVehicleId: 'car-maya-m3',
    authorVehicleName: 'MAYA',
    authorVehicleModel: 'BMW M3 Competition',
    authorVehicleYear: 2023,
    postType: 'MILESTONE',
    title: 'Statutory DVSA MOT Inspection: PASS (0 Advisories)',
    content: 'Official DVSA roadworthiness test passed at 42,184 miles. Front brake efficiency tested at 78%, rear at 64% with 52:48 cross-balance. Zero emissions faults logged on Euro 6d OBD-II diagnostics. Cryptographically verified in vehicle passport.',
    mediaUrls: [
      '/real_uk_m3_cottage.jpg'
    ],
    provenanceTag: 'official_information',
    createdAt: '4 days ago',
    likesCount: 215,
    repliesCount: 14
  },
  {
    id: 'post-107',
    authorType: 'professional',
    authorVehicleName: 'Evolve Automotive',
    authorVehicleModel: 'Verified BMW M Specialist',
    postType: 'GUIDE',
    title: 'Technical Guide: S58 Chargecooler Heat Soak Mitigation',
    content: 'We logged IAT (Intake Air Temperatures) across 15 consecutive dyno pulls. With the stock heat exchanger, temps climbed from 32°C to 58°C by pull 4, causing DME ignition timing pull. Upgrading to a dual-pass core held IAT under 36°C even on a warm ambient afternoon.',
    mediaUrls: [
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=90'
    ],
    provenanceTag: 'verified_professional',
    createdAt: '5 days ago',
    likesCount: 540,
    repliesCount: 68
  },
  {
    id: 'post-108',
    authorType: 'car',
    authorVehicleId: 'car-kuro-gt3',
    authorVehicleName: 'KURO',
    authorVehicleModel: 'Porsche 911 GT3 Touring',
    authorVehicleYear: 2022,
    postType: 'MAINTENANCE_UPDATE',
    title: '18,000-Mile Sump Flush & Alignment Reset',
    content: 'Mobil 1 ESP X3 0W-40 full sump refresh (7.8 litres). Front axle caster dialed in to 8.2°, negative camber locked at -2.2° front, -1.8° rear on the Beissbarth optical geometry rig. Steering feedback on turn-in is now razor-sharp.',
    mediaUrls: [
      '/real_uk_gt3_suburb.jpg'
    ],
    provenanceTag: 'verified_professional',
    createdAt: '6 days ago',
    likesCount: 388,
    repliesCount: 32
  },
  {
    id: 'post-109',
    authorType: 'user',
    authorVehicleName: 'UK B-Roads Club',
    authorVehicleModel: 'Automotive Collective',
    postType: 'EVENT',
    title: 'A4067 Brecon Beacons Midnight Convoy Recap',
    content: '16 cars set off under full moonlight from Sennybridge. Zero incidents, zero dropped pace. 800m residential privacy geofence ensured silent arrival at dawn coffee stop in Crickhowell. Full GPX route available in the Clubs library.',
    mediaUrls: [
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=1200&q=90'
    ],
    provenanceTag: 'owner_experience',
    createdAt: '1 week ago',
    likesCount: 672,
    repliesCount: 84
  },
  {
    id: 'post-110',
    authorType: 'car',
    authorVehicleId: 'car-maya-m3',
    authorVehicleName: 'MAYA',
    authorVehicleModel: 'BMW M3 Competition',
    authorVehicleYear: 2023,
    postType: 'DRIVE',
    title: 'Day 3: NC500 Applecross Pass (Bealach na Bà) Solo Crossing',
    content: 'Left Inverness at 05:45 AM before tourist campers wake up. The single-track hairpin ascent over Bealach na Bà in 4°C drizzle is pure church. Kept the S58 in Sport throttle with MDM traction mode. Michelin PS4S found purchase through standing water at the crest (2,053 ft). Had hot black coffee and oatcakes in the shelter. 412 miles logged today, average 27.2 MPG. Zero mechanical hiccups.',
    mediaUrls: [
      '/real_uk_m3_cottage.jpg',
      '/real_uk_driveway_wash.jpg'
    ],
    provenanceTag: 'owner_experience',
    createdAt: '8 hours ago',
    likesCount: 482,
    repliesCount: 51,
    linkedDriveId: 'drive-184'
  },
  {
    id: 'post-111',
    authorType: 'professional',
    authorVehicleName: 'Apex Track Engineering',
    authorVehicleModel: 'Chassis & Diagnostic Workshop',
    postType: 'GUIDE',
    title: 'DIY Diagnostic: How to spot DI carbon buildup vs failing coils',
    content: 'If you have a cold-start stumble or hesitation around 2,500 RPM under load on modern direct-injected engines (B58, EA888, S58), don’t immediately throw £400 of new coilpacks at it. Log cylinder misfire counts on cold idle. If misfires occur solely on cold enrichment and disappear once coolant reaches 70°C, it is 95% intake valve carbon crust. Walnut shell blasting at 80 PSI brings volumetric airflow back by 14 CFM. Here is the step-by-step manifold removal protocol.',
    mediaUrls: [
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=90'
    ],
    provenanceTag: 'verified_professional',
    createdAt: '12 hours ago',
    likesCount: 890,
    repliesCount: 94
  },
  {
    id: 'post-112',
    authorType: 'car',
    authorVehicleId: 'car-apex-720s',
    authorVehicleName: 'VALKYRIE',
    authorVehicleModel: 'McLaren 720S Performance',
    authorVehicleYear: 2023,
    postType: 'CAR_POST',
    title: 'Meet VALKYRIE — Digital Passport Issued #0084',
    content: 'Officially naming her VALKYRIE. Handed over in Papaya Spark with full stealth carbon package. Corner-weighed dry at 1,419 kg. 710 BHP twin-turbo 4.0L flat-plane V8 that revs like a superbike. Already registered her sovereign passport on Garage with automatic plate cloaking and geofenced garaging. Maiden shake-down through Surrey hills tonight.',
    mediaUrls: [
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=90'
    ],
    provenanceTag: 'owner_experience',
    createdAt: '1 day ago',
    likesCount: 741,
    repliesCount: 88
  },
  {
    id: 'post-113',
    authorType: 'user',
    authorVehicleName: 'RetroMod_Dan',
    authorVehicleModel: '1989 BMW 318is (E30)',
    postType: 'CAR_POST',
    title: 'First post on Garage! Finally an app made for actual drivers',
    content: 'Got fed up with Instagram algorithm pushing dropshipping ads instead of real car builds, and compressing 4K photography into 1080p mush. Migrating the full restoration log of my 1989 E30 318is slicktop here. The automatic registration plate blurring on upload without having to manually smudge it in markup is an absolute game-changer. Looking forward to connecting with the UK B-Roads crew!',
    mediaUrls: [
      '/real_uk_e30_terrace.jpg'
    ],
    provenanceTag: 'owner_experience',
    createdAt: '1 day ago',
    likesCount: 412,
    repliesCount: 63
  },
  {
    id: 'post-114',
    authorType: 'car',
    authorVehicleName: 'EXPEDITION_110',
    authorVehicleModel: 'Land Rover Defender 110',
    authorVehicleYear: 2021,
    postType: 'DRIVE',
    title: 'Strata Florida River Crossings: Aired Down to 18 PSI',
    content: 'Tackled the Strata Florida green lane in mid-Wales after three days of rain. Dropped the BFGoodrich KO2s to 18 PSI on steel rims. Navigated seven submerged river crossings with the air suspension locked at off-road height (900mm wading capability). Had to winch out a bogged recovery truck near the abbey ruins. Mud up to the door handles, zero interior water ingress. Wilderness bivouac under the awning tonight.',
    mediaUrls: [
      '/real_uk_defender_farm.jpg'
    ],
    provenanceTag: 'owner_experience',
    createdAt: '2 days ago',
    likesCount: 533,
    repliesCount: 47,
    linkedDriveId: 'drive-184'
  },
  {
    id: 'post-115',
    authorType: 'user',
    authorVehicleName: 'Marcus_GT4',
    authorVehicleModel: 'Porsche 718 Cayman GT4',
    postType: 'QUESTION',
    title: 'Main dealer quoted £2,400 for a £65 PCV oil separator diaphragm?!',
    content: 'Unbelievable. Threw an erratic idle code (P0171 bank 1 lean) on my GT4. Main dealer workshop inspected it, claimed the entire integrated composite cam cover assembly had to be replaced from Stuttgart with an 8-week backorder: £2,400 plus VAT! Took it to an independent specialist in Guildford: pulled the diaphragm cap off, fitted a reinforced Viton replacement membrane in 25 minutes for £65. Idle is rock solid at 800 RPM. Always get a second opinion before signing off main dealer work.',
    mediaUrls: [
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=90'
    ],
    provenanceTag: 'community_opinion',
    createdAt: '2 days ago',
    likesCount: 928,
    repliesCount: 134
  },
  {
    id: 'post-116',
    authorType: 'user',
    authorVehicleName: 'Sunday Dawn Patrol',
    authorVehicleModel: 'Automotive Gathering',
    postType: 'EVENT',
    title: 'Caffeine & Machine 06:30 AM Yard Roll-Call',
    content: 'Gates opened at 06:30 sharp. First 30 cars parked in the Yard: everything from an immaculate Singer-style 964 to a turbocharged K20 Lotus Exige and three G80 M3s. Zero revving, zero anti-social behavior — just steam rising off engine bays, warm flat whites, and cold morning exhaust notes. Next dawn convoy route will drop in the Clubs tab Thursday evening.',
    mediaUrls: [
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=90'
    ],
    provenanceTag: 'owner_experience',
    createdAt: '3 days ago',
    likesCount: 1120,
    repliesCount: 95
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
