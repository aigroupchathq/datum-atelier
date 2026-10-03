import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Link, useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { PlateBlurImage } from '../components/common/PlateBlurImage';
import { ProvenanceBadge } from '../components/common/ProvenanceBadge';
import { VehiclePassportModal } from '../components/common/VehiclePassportModal';
import { ProvenanceBreakdownModal } from '../components/common/ProvenanceBreakdownModal';
import { AcousticStudioModal } from '../components/common/AcousticStudioModal';
import { CommissioningAtelierModal } from '../components/atelier/CommissioningAtelierModal';
import { TransitCarnetModal } from '../components/logistics/TransitCarnetModal';
import { TyrePyrometerModal } from '../components/telemetry/TyrePyrometerModal';
import { WorkshopStampingModal } from '../components/workshop/WorkshopStampingModal';
import { loadWorkshopStamps } from '../core/workshop/WorkshopStampEngine';
import { RadialDynamicsCluster } from '../components/telemetry/RadialDynamicsCluster';
import { DynoStudio } from '../components/profile/DynoStudio';
import { SupplyChainBomView } from '../components/profile/SupplyChainBomView';
import { CustodyHandoverModal } from '../components/profile/CustodyHandoverModal';
import { ConcoursHeritageDossierModal } from '../components/profile/ConcoursHeritageDossierModal';
import { useToast } from '../context/ToastContext';
import { useActiveVehicle } from '../context/ActiveVehicleContext';
import { 
  Grid, 
  Compass, 
  Wrench, 
  Clock, 
  Activity, 
  ShieldCheck, 
  Share2, 
  ArrowRight, 
  MapPin, 
  CheckCircle2, 
  MessageSquare, 
  Award,
  Play,
  Pause,
  Volume2,
  FileCheck2,
  Lock,
  Sliders,
  Sparkles,
  Globe2,
  Thermometer,
  Layers,
  Printer,
  KeyRound,
  Star
} from 'lucide-react';

interface CarProfileData {
  id: string;
  name: string;
  fullName: string;
  chassisCode: string;
  vin: string;
  factoryColor: string;
  location: string;
  locationDetails: string;
  heroImage: string;
  coverImage: string;
  engineSpec: string;
  powerOutput: string;
  drivetrain: string;
  exhaustSpec: string;
  damperSpec: string;
  tyresSpec: string;
  mileage: number;
  drivesCount: number;
  followersCount: number;
  provenanceScore: number;
  motStatus: string;
  motExpiry: string;
  audioFrequency: number;
  audioLabel: string;
  custodianNote: string;
  accentClass: string;
  gallery: Array<{ url: string; title: string; subtitle: string; tag: string }>;
}

const ATELIER_VEHICLES: Record<string, CarProfileData> = {
  'car-maya-m3': {
    id: 'car-maya-m3',
    name: 'MAYA',
    fullName: 'BMW M3 Competition (G80)',
    chassisCode: 'G80-M3-COMP-UK',
    vin: 'WBA-31AY-0084-M3',
    factoryColor: 'Isle of Man Green Metallic (C4G)',
    location: 'Cotswolds Private Estate',
    locationDetails: 'B4425 Roman Road Sector • 800m Residential Privacy Active',
    heroImage: '/real_uk_m3_cottage.jpg',
    coverImage: '/real_uk_m3_cottage.jpg',
    engineSpec: '3.0L S58 Twin-Turbocharged Inline-6',
    powerOutput: '510 BHP • 650 Nm Torque',
    drivetrain: '8-Speed M Steptronic • M xDrive AWD with 2WD Track Mode',
    exhaustSpec: 'Akrapovič Evolution Line Titanium System (-14kg)',
    damperSpec: 'KW Variant 4 3-Way Independent Compression & Rebound',
    tyresSpec: 'Michelin Pilot Sport 4S (275/35 R19 F • 285/30 R20 R)',
    mileage: 42184,
    drivesCount: 184,
    followersCount: 1420,
    provenanceScore: 98,
    motStatus: 'DVSA Statutory Pass (0 Advisories)',
    motExpiry: 'March 2027',
    audioFrequency: 45,
    audioLabel: 'S58 Twin-Turbo Biturbo Spool & Cold-Start Rumble',
    custodianNote: 'Acquired new from BMW Park Lane. Meticulously conditioned on British B-roads. Damper compression dialed in for uneven frost heaves across the Cotswolds. Serviced strictly under BMW M protocols with Ferodo DS2500 high-friction compound.',
    accentClass: 'text-emerald-400',
    gallery: [
      { url: '/real_uk_m3_cottage.jpg', title: 'Cotswolds Stone Estate Shakedown', subtitle: 'Damp morning mist on gravel driveway', tag: 'EXPEDITION' },
      { url: '/real_uk_driveway_wash.jpg', title: 'Sunday 07:00 AM Decontamination', subtitle: 'Bilt-Hamber touchless pre-wash outside suburban home', tag: 'DETAIL' },
      { url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=90', title: 'KW Variant 4 Damper Installation', subtitle: 'Corner-weighted with 50:50 static cross-balance', tag: 'WORKSHOP' },
      { url: '/real_uk_gt3_suburb.jpg', title: 'Surrey Convoy Rendezvous (KURO)', subtitle: 'Paved driveway meetup before Llanberis Pass run', tag: 'CONVOY' },
      { url: '/real_uk_e30_terrace.jpg', title: 'Bristol Victorian Terraced Staging', subtitle: 'Classic analog stablemate (RetroMod Dan)', tag: 'HERITAGE' },
      { url: '/real_uk_defender_farm.jpg', title: 'Yorkshire Dales Barn Support Vehicle', subtitle: 'Expedition 110 chase car on green lanes', tag: 'SUPPORT' }
    ]
  },
  'car-kuro-gt3': {
    id: 'car-kuro-gt3',
    name: 'KURO',
    fullName: 'Porsche 911 GT3 Touring (992)',
    chassisCode: '992-GT3-TOURING',
    vin: 'WP0-ZZZ-99Z-NS-1092',
    factoryColor: 'Chalk Grey / Crayon Non-Metallic (3H)',
    location: 'Surrey Private Residence',
    locationDetails: 'Private Block-Paved Driveway • 800m Geofence Active',
    heroImage: '/real_uk_gt3_suburb.jpg',
    coverImage: '/real_uk_gt3_suburb.jpg',
    engineSpec: '4.0L Naturally Aspirated Boxer-6',
    powerOutput: '502 BHP • 9,000 RPM Redline',
    drivetrain: '6-Speed GT Sports Manual • Mechanical LSD',
    exhaustSpec: 'Porsche Motorsport Titanium Sports Exhaust',
    damperSpec: 'PASM Sport Suspension with Rose-Jointed Double Wishbone Front',
    tyresSpec: 'Michelin Pilot Sport Cup 2 (255/35 R20 F • 315/30 R21 R)',
    mileage: 18400,
    drivesCount: 76,
    followersCount: 2890,
    provenanceScore: 99,
    motStatus: 'DVSA Statutory Pass (0 Advisories)',
    motExpiry: 'October 2026',
    audioFrequency: 68,
    audioLabel: '4.0L Flat-Six 9,000 RPM Valvetrain Acoustics',
    custodianNote: 'Delivered in Stuttgart-Zuffenhausen. Spec’d deliberately with the 6-speed manual and Touring package for pure analog engagement. Never tracked in wet salt. Sump flushed with Mobil 1 ESP X3 0W-40 every 4,000 miles.',
    accentClass: 'text-amber-400',
    gallery: [
      { url: '/real_uk_gt3_suburb.jpg', title: 'Surrey Driveway Cold Start', subtitle: 'Block-paved morning warm-up routine', tag: 'ATELIER' },
      { url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=90', title: 'Snowdonia Llanberis Pass First Light', subtitle: 'Slate cliff valvetrain echoes at 9,000 RPM', tag: 'EXPEDITION' },
      { url: '/real_uk_m3_cottage.jpg', title: 'Cotswolds Joint Shakedown', subtitle: 'Paired alongside MAYA for Roman road testing', tag: 'CONVOY' },
      { url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=90', title: '18,000-Mile Optical Alignment', subtitle: 'Beissbarth optical geometry locked at -2.2° front', tag: 'WORKSHOP' },
      { url: '/real_uk_driveway_wash.jpg', title: 'Pre-Road Decontamination Wash', subtitle: 'Gyeon quartz ceramic hydrophobic refresh', tag: 'DETAIL' },
      { url: '/real_uk_e30_terrace.jpg', title: 'British Automotive Heritage Meet', subtitle: 'Classic E30 slicktop alongside 992 GT3', tag: 'HERITAGE' }
    ]
  },
  'car-e30-retromod': {
    id: 'car-e30-retromod',
    name: 'RETRO MOD',
    fullName: 'BMW 318is Slicktop (E30)',
    chassisCode: 'E30-318IS-SLICKTOP',
    vin: 'WBA-AF92-0019-E30',
    factoryColor: 'Brilliant Red (Brilliantrot 308)',
    location: 'Bristol Victorian Residential Street',
    locationDetails: 'Victorian Terraced Bay Curbside • Plates Protected',
    heroImage: '/real_uk_e30_terrace.jpg',
    coverImage: '/real_uk_e30_terrace.jpg',
    engineSpec: '1.8L 16V M42 Twin-Cam Inline-4',
    powerOutput: '136 BHP • 175 Nm Torque',
    drivetrain: '5-Speed Getrag 240 Manual • Small-Case 4.10 LSD',
    exhaustSpec: 'Period Supersprint Stainless Cat-Back System',
    damperSpec: 'Bilstein B12 Pro-Kit with Eibach Progressive Springs',
    tyresSpec: 'Yokohama Advan Fleva (205/55 R15 on BBS Basketweaves)',
    mileage: 118500,
    drivesCount: 242,
    followersCount: 1680,
    provenanceScore: 95,
    motStatus: 'Historic DVSA Pass • Structurally Waxoyled',
    motExpiry: 'June 2027',
    audioFrequency: 55,
    audioLabel: 'M42 Twin-Cam High-Revving Mechanical Rasp',
    custodianNote: 'Factory non-sunroof (slicktop) UK market car. Full body rotisserie bare-metal conservation in 2024. Factory cosmoline preserved under wheel wells. Driven weekly across Mendip Hills and Somerset lanes.',
    accentClass: 'text-rose-400',
    gallery: [
      { url: '/real_uk_e30_terrace.jpg', title: 'Victorian Terraced Curbside Staging', subtitle: 'Authentic Bristol residential street backdrop', tag: 'HERITAGE' },
      { url: '/real_uk_driveway_wash.jpg', title: 'Two-Bucket Hand Mitt Cleansing', subtitle: 'pH neutral single-stage paint maintenance', tag: 'DETAIL' },
      { url: '/real_uk_m3_cottage.jpg', title: 'Ancestral Lineage Meet with G80', subtitle: 'Evolution of BMW sports saloon chassis', tag: 'CONVOY' },
      { url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=90', title: 'Cotswolds B4425 Autumn Shakedown', subtitle: 'Crisp throttle response from the mechanical cable', tag: 'EXPEDITION' },
      { url: '/real_uk_gt3_suburb.jpg', title: 'Analog vs Modern Precision', subtitle: 'E30 meets 992 GT3 in Surrey courtyard', tag: 'CONVOY' },
      { url: '/real_uk_defender_farm.jpg', title: 'Country Barn Weekend Retreat', subtitle: 'Dry barn storage between Sunday morning runs', tag: 'STORAGE' }
    ]
  },
  'car-expedition-110': {
    id: 'car-expedition-110',
    name: 'EXPEDITION',
    fullName: 'Land Rover Defender 110 P400 SE',
    chassisCode: 'L663-DEFENDER-110',
    vin: 'SAL-WR2-0041-DEF',
    factoryColor: 'Pangea Green with Fuji White Roof',
    location: 'Yorkshire Dales Barn Estate',
    locationDetails: 'Rustic Stone Barn Farmstead • 900mm Wading Active',
    heroImage: '/real_uk_defender_farm.jpg',
    coverImage: '/real_uk_defender_farm.jpg',
    engineSpec: '3.0L Turbocharged Ingenium MHEV I6',
    powerOutput: '400 BHP • 550 Nm Torque',
    drivetrain: '8-Speed ZF Automatic • Twin-Speed Transfer Box & Centre/Rear Diff Locks',
    exhaustSpec: 'Factory Acoustic Muffled Overland Spec',
    damperSpec: 'Configurable Electronic Air Suspension with 291mm Ground Clearance',
    tyresSpec: 'BFGoodrich All-Terrain T/A KO2 (255/65 R19 on Steel Rims)',
    mileage: 31200,
    drivesCount: 94,
    followersCount: 1120,
    provenanceScore: 97,
    motStatus: 'DVSA Statutory Pass (0 Advisories)',
    motExpiry: 'December 2026',
    audioFrequency: 38,
    audioLabel: 'Ingenium Turbocharged 6-Cylinder Deep Burble',
    custodianNote: 'Equipped for sovereign British wilderness transit. Front expedition winch, raised air intake, onboard ARB air compressor, and full Dinitrol chassis rustproofing from day one. Regularly transverses Strata Florida and Yorkshire green lanes.',
    accentClass: 'text-lime-400',
    gallery: [
      { url: '/real_uk_defender_farm.jpg', title: 'Yorkshire Dales Farmstead Homestead', subtitle: 'Parked outside rustic stone barn after green laning', tag: 'OVERLAND' },
      { url: '/real_uk_driveway_wash.jpg', title: 'Post-Strata Florida Mud Decontamination', subtitle: 'Chassis underside pressure wash and wax check', tag: 'DETAIL' },
      { url: '/real_uk_m3_cottage.jpg', title: 'Cotswolds Supply Rendezvous', subtitle: 'Support rig for high-performance stablemates', tag: 'SUPPORT' },
      { url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=90', title: 'Mid-Wales River Crossing at 18 PSI', subtitle: '900mm wading depth locked in on Strata Florida', tag: 'EXPEDITION' },
      { url: '/real_uk_gt3_suburb.jpg', title: 'Surrey Headquarters Check-In', subtitle: 'Pre-expedition equipment inventory', tag: 'ATELIER' },
      { url: '/real_uk_e30_terrace.jpg', title: 'Bristol Urban Transit Shakedown', subtitle: 'City passage before northern wilderness trek', tag: 'TRANSIT' }
    ]
  }
};

// Vehicle-specific expeditions data
const VEHICLE_EXPEDITIONS: Record<string, {
  driveNumber: number;
  date: string;
  title: string;
  routeTitle: string;
  distanceMiles: number;
  duration: string;
  efficiencyMpg: number;
  costTotalGbp: number;
  surfaceCondition: string;
  ownerNotes: string;
  photos: string[];
}> = {
  'car-maya-m3': {
    driveNumber: 184,
    date: 'October 2024',
    title: 'Cotswolds Roman Way Autumn Shakedown',
    routeTitle: 'Burford B4425 to Bibury & Coln St Aldwyns',
    distanceMiles: 68.4,
    duration: '2h 14m',
    efficiencyMpg: 24.8,
    costTotalGbp: 29.40,
    surfaceCondition: 'Damp Bitumen (12°C)',
    ownerNotes: 'Damp morning conditions across Gloucestershire B-roads. xDrive 4WD Sport mode engaged with -1.8° camber. M Differential provided sublime traction through blind off-camber crests.',
    photos: ['/real_uk_m3_cottage.jpg', '/real_uk_driveway_wash.jpg']
  },
  'car-kuro-gt3': {
    driveNumber: 76,
    date: 'September 2024',
    title: 'Surrey Hills to Goodwood Motor Circuit Dawn Run',
    routeTitle: 'A286 Midhurst Pass to Goodwood Paddock',
    distanceMiles: 84.2,
    duration: '1h 48m',
    efficiencyMpg: 19.4,
    costTotalGbp: 38.10,
    surfaceCondition: 'Dry Micro-Asphalt (16°C)',
    ownerNotes: 'Zero traffic departing 05:45 AM. 9,000 RPM 2nd-to-3rd gear shifts through the South Downs national park. Michelin Cup 2 tyres reached 76°C operating temperature without thermal degradation.',
    photos: ['/real_uk_gt3_suburb.jpg', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=90']
  },
  'car-e30-retromod': {
    driveNumber: 242,
    date: 'August 2024',
    title: 'Mendip Hills & Cheddar Gorge Classic Cruise',
    routeTitle: 'B3135 Cliff Pass to Chew Valley Lake',
    distanceMiles: 42.0,
    duration: '1h 35m',
    efficiencyMpg: 34.2,
    costTotalGbp: 14.80,
    surfaceCondition: 'Dry Limestone Gorge Bitumen (20°C)',
    ownerNotes: 'Pure analog joy. Mechanical throttle cable gives immediate response. The twin-cam M42 16-valve engine revs smoothly past 6,500 RPM while the small-case 4.10 LSD locks predictably through tight hairpin switchbacks.',
    photos: ['/real_uk_e30_terrace.jpg', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=90']
  },
  'car-expedition-110': {
    driveNumber: 94,
    date: 'November 2024',
    title: 'Strata Florida Green Lane & Mid-Wales Ford Crossings',
    routeTitle: 'Pontrhydfendigaid to Soar y Mynydd Wilderness Track',
    distanceMiles: 112.5,
    duration: '4h 20m',
    efficiencyMpg: 21.8,
    costTotalGbp: 49.50,
    surfaceCondition: 'Riverbed Boulders, Peat Bog & Slate Gravel',
    ownerNotes: 'Traversed 9 river crossings with wading sensor reading 780mm depth. Electronic air suspension set to off-road height (+75mm). BFGoodrich KO2 tyres aired down to 20 PSI via onboard ARB compressor.',
    photos: ['/real_uk_defender_farm.jpg', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=90']
  }
};

// Vehicle-specific build evolution records
const VEHICLE_BUILDS: Record<string, Array<{
  versionCode: string;
  title: string;
  date: string;
  summary: string;
  partsAdded: Array<{
    category: string;
    componentName: string;
    rationale: string;
    costGbp?: number;
  }>;
}>> = {
  'car-maya-m3': [
    {
      versionCode: 'BUILD 04',
      title: 'Chassis Balance & Titanium Acoustic Flow',
      date: 'September 2024',
      summary: 'Upgraded to KW Variant 4 dampers with custom compression valving for bumpy British B-roads. Akrapovič titanium exhaust installed for high-frequency acoustics.',
      partsAdded: [
        { category: 'Dampers & Suspension', componentName: 'KW Variant 4 3-Way Coilovers', rationale: 'Eliminate secondary bounce over frost heaves on Cotswolds Roman Way', costGbp: 4890 },
        { category: 'Exhaust System', componentName: 'Akrapovič Evolution Line Titanium', rationale: 'Weight reduction of 14kg behind rear axle with active bypass valves', costGbp: 6450 },
        { category: 'Induction', componentName: 'Eventuri Carbon Fiber Sealed Airbox', rationale: 'Smooth laminar airflow to twin turbo inlet runners with acoustic induction roar', costGbp: 2100 },
        { category: 'Braking Friction', componentName: 'Ferodo DS2500 High-Coefficient Pads', rationale: 'Cold initial bite without track pad squeal for road tour safety', costGbp: 480 }
      ]
    },
    {
      versionCode: 'BUILD 03',
      title: 'Stage 1 Litchfield Bespoke ECU Calibration',
      date: 'April 2024',
      summary: 'Custom rolling-road engine calibration performed at Litchfield Motors on Maha LPS 3000 hub dyno.',
      partsAdded: [
        { category: 'Engine Software', componentName: 'Litchfield Stage 1 ECU Calibration', rationale: 'Linearized torque curve with 650 Nm plateau from 2,750 RPM', costGbp: 1250 },
        { category: 'Intake Filtration', componentName: 'BMC High-Flow Oiled Filters', rationale: '15% increased surface filtration area', costGbp: 185 }
      ]
    }
  ],
  'car-kuro-gt3': [
    {
      versionCode: 'BUILD 02',
      title: 'Manthey Racing Chassis Geometry & Centerlock Rig',
      date: 'June 2024',
      summary: 'Track-focused road alignment executed by Manthey specialist technicians. Centerlock hub verification.',
      partsAdded: [
        { category: 'Suspension', componentName: 'Manthey 4-Way Adjustable Damper Rig', rationale: 'Optimized high-speed compression over curbs with rose-jointed links', costGbp: 7200 },
        { category: 'Braking', componentName: 'Surface Transforms Carbon-Ceramic Rotors', rationale: 'Continuous carbon fiber matrix reduces rotating unsprung mass by 18kg', costGbp: 9800 },
        { category: 'Centerlock Tooling', componentName: 'Castrol Molub-Alloy 600 Nm Torque Kit', rationale: 'Statutory hub lubrication and calibrated 3/4-inch torque wrench set', costGbp: 650 }
      ]
    },
    {
      versionCode: 'BUILD 01',
      title: 'Zuffenhausen Factory Touring Configuration',
      date: 'October 2023',
      summary: 'Factory baseline delivery from Porsche AG. Chrome window surround delete and manual transmission.',
      partsAdded: [
        { category: 'Powertrain', componentName: '4.0L Naturally Aspirated 9,000 RPM Flat-Six', rationale: 'Rigid valvetrain with individual throttle bodies', costGbp: 0 },
        { category: 'Transmission', componentName: '6-Speed GT Sports Manual with Auto-Blip', rationale: 'Mechanical purist configuration with 4.10 final drive', costGbp: 0 }
      ]
    }
  ],
  'car-e30-retromod': [
    {
      versionCode: 'BUILD 05',
      title: 'Rotisserie Bare-Metal Preservation & Blueprinted Assembly',
      date: 'May 2024',
      summary: 'Full structural conservation carried out over 14 months. Lead loading on seams and Dinitrol cavity protection.',
      partsAdded: [
        { category: 'Body Conservation', componentName: 'Full Bare-Metal Dip & Epoxy Primer', rationale: 'Zero rust tolerance. Sealed with Dinitrol 3125 anti-corrosion cavity wax', costGbp: 8500 },
        { category: 'Dampers & Springs', componentName: 'Bilstein B12 Pro-Kit with Eibach Springs', rationale: 'Lowered 30mm with progressive rate dampening for Somerset lanes', costGbp: 820 },
        { category: 'Exhaust System', componentName: 'Period Supersprint Stainless Cat-Back', rationale: 'Authentic 1990s twin-cam mechanical acoustic resonance', costGbp: 940 },
        { category: 'Drivetrain', componentName: 'Small-Case 4.10 Limited Slip Differential', rationale: 'Rebuilt with 25% static lockup ramps and new Timken bearings', costGbp: 1150 }
      ]
    }
  ],
  'car-expedition-110': [
    {
      versionCode: 'BUILD 03',
      title: 'Expedition Transit & Autonomous Overlanding Rig',
      date: 'July 2024',
      summary: 'Wilderness-grade outfitting for sovereign UK and Arctic navigation.',
      partsAdded: [
        { category: 'Recovery Gear', componentName: 'Warn Zeon 12-S Platinum Winch (12,000 lb)', rationale: 'Spydura synthetic rope with wireless remote for solo bog recoveries', costGbp: 2450 },
        { category: 'Pneumatics', componentName: 'ARB Twin Air Compressor with Manifold', rationale: 'Onboard tire inflation from 18 PSI riverbed to 36 PSI tarmac in 90 seconds', costGbp: 890 },
        { category: 'Underbody Protection', componentName: 'Lucky8 Heavy-Duty Rock Sliders', rationale: 'Protects sill panels and battery pack over rock steps in Strata Florida', costGbp: 1100 },
        { category: 'Chassis Rustproofing', componentName: 'Full Dinitrol ML Underspray Treatment', rationale: 'Preserves subframes against corrosive peat mud and winter road salt', costGbp: 950 }
      ]
    }
  ]
};

// Vehicle-specific sovereign memories
const VEHICLE_MEMORIES: Record<string, Array<{
  id: string;
  title: string;
  date: string;
  mileage: number;
  description: string;
  provenance: 'verified_professional' | 'official_information' | 'vehicle_data' | 'owner_experience';
  verifiedSignatory: string;
  costGbp?: number;
}>> = {
  'car-maya-m3': [
    {
      id: 'mem-1',
      title: 'Comprehensive 40,000-Mile Major Inspection',
      date: '14 September 2024',
      mileage: 40150,
      description: 'Spark plugs replaced, differential fluid renewed with Castrol Syntrax 75W-140, microfilters replaced, and ISTA digital diagnosis validated 0 stored faults.',
      provenance: 'verified_professional',
      verifiedSignatory: 'Litchfield Motors, Gloucestershire',
      costGbp: 1480.00
    },
    {
      id: 'mem-2',
      title: 'DVSA Statutory Annual MOT Inspection',
      date: '10 March 2024',
      mileage: 36200,
      description: 'Clean statutory pass with zero advisories. Underbody suspension joints, brake lines, and emissions within strict EURO-6 regulatory limits.',
      provenance: 'official_information',
      verifiedSignatory: 'DVSA Authorized Testing Station #4819'
    },
    {
      id: 'mem-3',
      title: 'Maha LPS 3000 Hub Dyno Calibration Run',
      date: '18 April 2024',
      mileage: 38100,
      description: 'Produced 510.4 BHP baseline power and 652 Nm torque under controlled 1018 hPa barometric cell conditions.',
      provenance: 'vehicle_data',
      verifiedSignatory: 'Maha Dyno Cell Certification UK'
    },
    {
      id: 'mem-4',
      title: 'Running-In 1,200-Mile Differential Service',
      date: '12 May 2023',
      mileage: 1240,
      description: 'Factory running-in service performed. Engine oil and M Differential fluid flushed. Launch control protocol unlocked.',
      provenance: 'verified_professional',
      verifiedSignatory: 'BMW Park Lane, Mayfair London',
      costGbp: 495.00
    }
  ],
  'car-kuro-gt3': [
    {
      id: 'mem-k1',
      title: 'Manthey Racing Nürburgring Chassis Geometry Setup',
      date: '22 June 2024',
      mileage: 16200,
      description: 'Beissbarth optical laser alignment. Front camber set to -2.2°, rear set to -2.0°. Corner-weighted with driver ballast to 50.0% cross-weight.',
      provenance: 'verified_professional',
      verifiedSignatory: 'Manthey Meuspath Atelier',
      costGbp: 1650.00
    },
    {
      id: 'mem-k2',
      title: 'Goodwood Festival of Speed Drivers’ Paddock Certification',
      date: '11 July 2024',
      mileage: 17400,
      description: 'Inspected and certified for Michelin Supercar Paddock display. Sound meter tested at 98.4 dB at 6,750 RPM static hold.',
      provenance: 'official_information',
      verifiedSignatory: 'BARC Scrutineering Goodwood'
    },
    {
      id: 'mem-k3',
      title: 'Porsche Centre Guildford Annual Service & Oil Spectroscopy',
      date: '18 October 2023',
      mileage: 9200,
      description: 'Mobil 1 ESP X3 0W-40 flush. Laboratory oil sample confirmed 0 ppm iron/copper wear particles. Sump plug magnet clean.',
      provenance: 'verified_professional',
      verifiedSignatory: 'Porsche Centre Guildford',
      costGbp: 980.00
    }
  ],
  'car-e30-retromod': [
    {
      id: 'mem-e1',
      title: 'Original 1991 Dealer Sales Invoice & Handover Certificate',
      date: '14 August 1991',
      mileage: 18,
      description: 'Supplied new by Scotthall Leeds BMW in Brilliantrot with Anthracite cloth and factory sunroof delete option.',
      provenance: 'official_information',
      verifiedSignatory: 'Scotthall BMW Leeds',
      costGbp: 16450.00
    },
    {
      id: 'mem-e2',
      title: 'Rotisserie Bare-Metal Body Restoration Sign-Off',
      date: '28 May 2024',
      mileage: 117200,
      description: '14-month restoration completed. New OEM floor pans seam-welded, sills injected with Dinitrol 3125, three coats of Standox clear.',
      provenance: 'verified_professional',
      verifiedSignatory: 'Bristol Classic Coachwork Specialists',
      costGbp: 8500.00
    },
    {
      id: 'mem-e3',
      title: 'BMW Car Club GB Concours d’Elegance 1st in Class',
      date: '15 July 2024',
      mileage: 118100,
      description: 'Awarded 1st place in 1980s Modern Classic preservation category. Judged on mechanical originality and factory chassis cosmoline integrity.',
      provenance: 'official_information',
      verifiedSignatory: 'BMW Car Club Great Britain'
    }
  ],
  'car-expedition-110': [
    {
      id: 'mem-x1',
      title: 'Solihull Heritage Manufacturing Birth Certificate',
      date: '12 November 2021',
      mileage: 6,
      description: 'Produced at Solihull Plant with Pangea Green exterior and Khaki Resist interior. Factory air suspension and electronic active diff options verified.',
      provenance: 'official_information',
      verifiedSignatory: 'Jaguar Land Rover Solihull'
    },
    {
      id: 'mem-x2',
      title: 'Strata Florida Green Lane Expedition Completion Certificate',
      date: '24 October 2024',
      mileage: 30400,
      description: 'Successfully navigated 9 deep river fords and rocky climbs across Mid-Wales without winch assistance. Underside pressure cleaned and inspected.',
      provenance: 'official_information',
      verifiedSignatory: 'Green Lane Association (GLASS UK)'
    },
    {
      id: 'mem-x3',
      title: 'Annual Dinitrol Chassis Protection Inspection',
      date: '05 September 2024',
      mileage: 28900,
      description: 'Ultrasonic chassis thickness testing verified 0 internal rust cavities. High-impact areas re-coated with Dinitrol 4941 underbody wax.',
      provenance: 'verified_professional',
      verifiedSignatory: 'Dinitrol Treatment Centre North',
      costGbp: 420.00
    }
  ]
};

// Vehicle-specific diagnostic telemetry
const VEHICLE_DIAGNOSTICS: Record<string, {
  dtcHealth: string;
  dtcStatus: string;
  dtcDesc: string;
  tyresHeadline: string;
  tyresStatus: string;
  tyresDesc: string;
  brakesHeadline: string;
  brakesStatus: string;
  brakesDesc: string;
  batteryHeadline: string;
  batteryStatus: string;
  batteryDesc: string;
}> = {
  'car-maya-m3': {
    dtcHealth: 'PASS (0 DTC)',
    dtcStatus: '0 Active Fault Codes',
    dtcDesc: 'Powertrain parameters operating within strict factory tolerances. Last interrogation completed via BMW ISTA diagnostics protocol.',
    tyresHeadline: 'Front 5.2mm • Rear 3.4mm',
    tyresStatus: 'REAR ADVISORY',
    tyresDesc: 'Michelin Pilot Sport 4S inner shoulder wear approaching 3.0mm advisory threshold under -1.8° negative camber setting.',
    brakesHeadline: '6.2 mm (~68% Remaining)',
    brakesStatus: 'FERODO DS2500',
    brakesDesc: 'Motul RBF 660 dry boiling point tested at 295°C. Zero fade experienced under spirited B-road testing.',
    batteryHeadline: 'Alternator 14.2 V Active',
    batteryStatus: '12.42 V (NOMINAL)',
    batteryDesc: 'Battery trickle charged via CTEK lithium/AGM tender during residential garaging. Alternator diodes tested nominal.'
  },
  'car-kuro-gt3': {
    dtcHealth: 'PIWIS 3 PASS (0 DTC)',
    dtcStatus: '0 Fault Codes Stored',
    dtcDesc: 'DME Engine Electronics and PASM control units interrogated via Porsche PIWIS 3. Zero overrev events in Range 2 through 6.',
    tyresHeadline: 'Front 4.8mm • Rear 4.1mm',
    tyresStatus: 'CUP 2 OPTIMAL',
    tyresDesc: 'Michelin Pilot Sport Cup 2 heat cycles balanced. Hot pressures stabilized at 32.0 PSI across all four contact patches.',
    brakesHeadline: 'Surface Transforms Carbon-Ceramic',
    brakesStatus: '0.01% WEAR WEIGHT',
    brakesDesc: 'Discs weighed on Sartorius digital scales. Zero carbon oxidation. Endless ME20 pad thickness measures 8.4mm.',
    batteryHeadline: 'Centerlock 600 Nm Verified',
    batteryStatus: 'MOLUB-ALLOY TORQUED',
    batteryDesc: 'All four centerlock wheel nuts torqued to 600 Nm using Castrol Molub-Alloy paste. Locking safety pins fully engaged.'
  },
  'car-e30-retromod': {
    dtcHealth: 'BOSCH MOTRONIC 1.7 (0 FAULTS)',
    dtcStatus: 'Analog System Clear',
    dtcDesc: 'Airflow meter voltage output linear. Lambda sensor cycling at 0.98 to 1.02. Ignition coil secondary resistance 0.8 ohms nominal.',
    tyresHeadline: 'Front 6.8mm • Rear 6.5mm',
    tyresStatus: 'YOKOHAMA FLEVA',
    tyresDesc: 'Yokohama Advan Fleva 205/55 R15 tires mounted on restored BBS 15" basketweave wheels. Even wear across contact patches.',
    brakesHeadline: 'Pagid Classic Pads (8.5mm)',
    brakesStatus: 'REBUILT GIRLING',
    brakesDesc: 'Brake calipers rebuilt with stainless pistons and braided Goodridge hoses. Castrol React DOT 4 fluid flushed May 2024.',
    batteryHeadline: 'Valve Lash 0.20mm Cold',
    batteryStatus: 'BLUEPRINTED M42',
    batteryDesc: 'Mechanical twin-cam valvetrain clearances verified with feeler gauges. Timing chain tensioner updated to E36 M3 hydraulic unit.'
  },
  'car-expedition-110': {
    dtcHealth: 'PATHFINDER PASS (0 DTC)',
    dtcStatus: 'Terrain Response Active',
    dtcDesc: 'Twin-speed transfer box actuators, electronic rear differential lock, and configurable terrain response modules responding nominal.',
    tyresHeadline: 'Front 9.5mm • Rear 9.5mm',
    tyresStatus: 'BFGOODRICH KO2',
    tyresDesc: 'BFGoodrich All-Terrain KO2 tires showing rugged compound integrity. Zero sidewall cuts from rocky Welsh riverbeds.',
    brakesHeadline: '900mm Wading Sonar Verified',
    brakesStatus: 'WATERTIGHT SEALS',
    brakesDesc: 'Ultrasonic depth sensors calibrated. Breather lines for front/rear differentials and transfer case routed into roof pillaring.',
    batteryHeadline: 'Dual AGM Battery System',
    batteryStatus: '12.7 V ISOLATED',
    batteryDesc: 'Secondary deep-cycle auxiliary battery powers ARB compressor and 12V Engel fridge with automatic voltage-sensitive relay.'
  }
};

export const CarProfilePage: FC = () => {
  const { carId } = useParams<{ carId?: string }>();
  const navigate = useNavigate();
  const { activeVehicleId, setActiveVehicleId } = useActiveVehicle();

  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'grid';
  const [activeTab, setActiveTab] = useState<string>(initialTab === 'bom' ? 'build' : initialTab);
  const [hardwareViewMode, setHardwareViewMode] = useState<'bom' | 'evolution'>('bom');
  
  const initialVehicleId = (carId && ATELIER_VEHICLES[carId]) 
    ? carId 
    : (ATELIER_VEHICLES[activeVehicleId] ? activeVehicleId : 'car-maya-m3');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(initialVehicleId);

  useEffect(() => {
    if (carId && ATELIER_VEHICLES[carId] && carId !== selectedVehicleId) {
      setSelectedVehicleId(carId);
      setIsPlayingAudio(false);
    }
  }, [carId]);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isPassportOpen, setIsPassportOpen] = useState<boolean>(false);
  const [isAcousticStudioOpen, setIsAcousticStudioOpen] = useState<boolean>(false);
  const [isCommissioningOpen, setIsCommissioningOpen] = useState<boolean>(false);
  const [isTransitCarnetOpen, setIsTransitCarnetOpen] = useState<boolean>(false);
  const [isTyrePyrometerOpen, setIsTyrePyrometerOpen] = useState<boolean>(false);
  const [isProvenanceBreakdownOpen, setIsProvenanceBreakdownOpen] = useState<boolean>(false);
  const [isWorkshopStampingOpen, setIsWorkshopStampingOpen] = useState<boolean>(false);
  const [isCustodyHandoverOpen, setIsCustodyHandoverOpen] = useState<boolean>(false);
  const [isConcoursDossierOpen, setIsConcoursDossierOpen] = useState<boolean>(false);
  const { showToast } = useToast();

  const car = ATELIER_VEHICLES[selectedVehicleId] || ATELIER_VEHICLES['car-maya-m3'];
  const currentExpedition = VEHICLE_EXPEDITIONS[selectedVehicleId] || VEHICLE_EXPEDITIONS['car-maya-m3'];
  const currentBuilds = VEHICLE_BUILDS[selectedVehicleId] || VEHICLE_BUILDS['car-maya-m3'];
  const baseMemories = VEHICLE_MEMORIES[selectedVehicleId] || VEHICLE_MEMORIES['car-maya-m3'];
  const dynamicStamps = loadWorkshopStamps()
    .filter(s => s.vehicleId === selectedVehicleId)
    .map(s => ({
      id: s.stampId,
      title: s.title,
      date: s.serviceDate,
      mileage: s.mileage,
      description: `${s.workDescription} [Seal Hash: ${s.stampSignatureHash.slice(0, 16)}…]`,
      provenance: 'verified_professional' as const,
      verifiedSignatory: `${s.workshop.name} (${s.workshop.masterMechanic})`,
      costGbp: s.totalCostGbp
    }));
  const currentMemories = [...dynamicStamps, ...baseMemories.filter(bm => !dynamicStamps.some(ds => ds.title === bm.title))];
  const currentDiagnostics = VEHICLE_DIAGNOSTICS[selectedVehicleId] || VEHICLE_DIAGNOSTICS['car-maya-m3'];

  // Synthesize realistic acoustic rumble based on car profile
  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(car.audioFrequency, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(car.audioFrequency * 2.5, ctx.currentTime + 0.4);
      osc.frequency.exponentialRampToValueAtTime(car.audioFrequency * 1.1, ctx.currentTime + 1.2);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(650, ctx.currentTime + 0.4);
      filter.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 1.4);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.28, ctx.currentTime + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 2.5);

      setTimeout(() => {
        setIsPlayingAudio(false);
      }, 2600);
    } catch {
      setIsPlayingAudio(false);
    }

    showToast({
      title: `Acoustic Soulprint: ${car.name}`,
      message: `${car.audioLabel} • Playing calibrated valvetrain audio`,
      type: 'drive',
      badge: 'ACOUSTIC'
    });
  };

  const toggleFollow = () => {
    if (isFollowing) {
      setIsFollowing(false);
      showToast({
        title: `Watchlist Updated: ${car.name}`,
        message: 'Telemetry alerts paused for this sovereign vehicle.',
        type: 'garage',
        badge: 'WATCHLIST'
      });
    } else {
      setIsFollowing(true);
      showToast({
        title: `Subscribed to ${car.name}'s Sovereign Ledger`,
        message: 'Cryptographically verified drives and maintenance updates enabled.',
        type: 'privacy',
        badge: 'SUBSCRIBED'
      });
    }
  };

  const handleExportDossier = () => {
    setIsConcoursDossierOpen(true);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast({
      title: 'Atelier Access Pass Copied',
      message: 'Encrypted deep-link ready with residential geofence privacy protected.',
      type: 'clipboard',
      badge: 'PASSKEY'
    });
  };

  const handleMessageCustodian = () => {
    showToast({
      title: `Message Relayed to ${car.name}'s Custodian`,
      message: 'End-to-end encrypted dispatch sent. Real identities and residential coordinates remain protected.',
      type: 'privacy',
      badge: 'ENCRYPTED'
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans selection:bg-amber-500/20 selection:text-amber-300">
      
      {/* ========================================================= */}
      {/* 1. POSH ATELIER SELECTOR & HERALDIC TOP BAR               */}
      {/* ========================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-zinc-950/80 border border-white/[0.08] backdrop-blur-xl shadow-lg">
        
        {/* Heraldic Title & Tag */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/20 flex items-center justify-center shadow-inner">
            <span className="font-luxury-display text-white text-base font-bold">G</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-luxury-display text-xs sm:text-sm font-semibold tracking-[0.2em] text-zinc-100 uppercase">
                SOVEREIGN ATELIER REGISTRY
              </span>
              <span className="text-[9px] font-mono-numbers px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20 uppercase">
                VERIFIED ATELIER
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono-numbers tracking-wider uppercase mt-0.5">
              Verified British & European Automobile Dossiers
            </p>
          </div>
        </div>

        {/* Multi-Car Atelier Switcher: Pure Posh Depth */}
        <div className="flex items-center p-1 rounded-xl bg-black/60 border border-white/[0.08] text-xs font-mono-numbers overflow-x-auto no-scrollbar">
          {Object.keys(ATELIER_VEHICLES).map((vKey) => {
            const v = ATELIER_VEHICLES[vKey];
            const isSelected = selectedVehicleId === vKey;
            const isUserActive = activeVehicleId === vKey;
            return (
              <button
                key={vKey}
                onClick={() => {
                  setSelectedVehicleId(vKey);
                  setIsPlayingAudio(false);
                  navigate(`/car/${vKey}`);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all text-xs font-semibold whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-zinc-200 to-white text-black shadow-md font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>{v.name} ({v.chassisCode.split('-')[0]})</span>
                {isUserActive && (
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-amber-600' : 'bg-amber-400'}`} title="Current Active Atelier Vehicle" />
                )}
              </button>
            );
          })}
        </div>

      </div>

      {/* ========================================================= */}
      {/* 2. FLAGSHIP ATELIER HERO VIEWPORT                         */}
      {/* ========================================================= */}
      <section className="rounded-3xl bg-[#0B0C10] border border-white/[0.1] overflow-hidden shadow-2xl relative">
        
        {/* Real Domestic Photography Cover Banner */}
        <div className="relative w-full h-72 sm:h-96 bg-zinc-950 overflow-hidden">
          <img
            src={car.coverImage}
            alt={`${car.name} outside ${car.location}`}
            className="w-full h-full object-cover object-center filter brightness-[0.92] transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/40 to-black/30 pointer-events-none" />

          {/* Top Right Privacy Sovereign Seal */}
          <div className="absolute top-5 right-5 flex items-center gap-2">
            <span className="px-4 py-2 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs font-mono-numbers text-emerald-400 font-semibold flex items-center gap-2 shadow-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>V5C Verified • Custodian Anonymous</span>
            </span>
          </div>

          {/* Top Left Ambient Weather & Enclave Pill */}
          <div className="absolute top-5 left-5 hidden sm:flex items-center gap-2">
            <span className="px-4 py-2 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs font-mono-numbers text-zinc-300 font-medium flex items-center gap-2 shadow-xl">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>{car.location} • 800m Geofence Active</span>
            </span>
          </div>

          {/* Bottom Banner Telemetry Tag */}
          <div className="absolute bottom-6 right-6 hidden md:flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono-numbers text-zinc-300">
              <span className="text-zinc-500 mr-1.5">CHASSIS:</span>
              <strong className="text-white">{car.chassisCode}</strong>
            </div>
            <div className="px-3.5 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono-numbers text-zinc-300">
              <span className="text-zinc-500 mr-1.5">PROVENANCE:</span>
              <strong className="text-emerald-400">{car.provenanceScore}/100</strong>
            </div>
          </div>
        </div>

        {/* Identity, Plaque & Action Bar */}
        <div className="px-6 sm:px-10 pb-8 pt-0 relative">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 -mt-20 sm:-mt-24 mb-6">
            
            {/* Posh Dual-Hairline Knurled Avatar Roundel */}
            <div className="relative group">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl p-1.5 bg-gradient-to-b from-white/30 via-white/10 to-transparent border border-white/25 shadow-2xl backdrop-blur-md">
                <div className="w-full h-full rounded-xl bg-zinc-950 overflow-hidden relative border border-white/10">
                  <img
                    src={car.heroImage}
                    alt={car.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1.5 right-1.5 p-1 rounded-md bg-black/80 border border-white/15">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Posh Action Strip */}
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              {/* Active Vehicle State / Toggle */}
              {selectedVehicleId === activeVehicleId ? (
                <div className="px-4 py-2.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 backdrop-blur-md shadow-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>Your Active Vehicle</span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setActiveVehicleId(selectedVehicleId);
                    showToast({
                      title: `Active Vehicle Set: ${car.name}`,
                      message: `${car.fullName} is now your active vehicle for logbooks and feeds.`,
                      type: 'garage',
                      badge: 'ACTIVE CAR'
                    });
                  }}
                  className="px-4 py-2.5 rounded-full bg-white/[0.06] hover:bg-amber-400/15 border border-white/[0.15] hover:border-amber-400/40 text-zinc-200 hover:text-amber-200 font-semibold text-xs transition-all flex items-center gap-1.5 backdrop-blur-md cursor-pointer"
                  title="Make this your active vehicle across Datum"
                >
                  <Star className="w-3.5 h-3.5 text-zinc-400 group-hover:text-amber-300" />
                  <span>Set as Active Vehicle</span>
                </button>
              )}

              <button
                onClick={toggleFollow}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-full font-bold text-xs tracking-wider uppercase transition-all shadow-md ${
                  isFollowing
                    ? 'bg-zinc-800 text-zinc-200 border border-white/15 hover:bg-zinc-700'
                    : 'bg-gradient-to-r from-zinc-100 via-white to-zinc-200 hover:from-white hover:to-white text-black font-extrabold shadow-white/10'
                }`}
              >
                {isFollowing ? '✓ Subscribed to Ledger' : 'Subscribe to Ledger'}
              </button>

              <button
                onClick={handleMessageCustodian}
                className="px-4 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.12] text-zinc-200 font-semibold text-xs transition-all flex items-center gap-1.5 backdrop-blur-md"
                title="Message Anonymous Custodian"
              >
                <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden sm:inline">Encrypted Inquire</span>
              </button>

              <button
                onClick={handleExportDossier}
                className="px-4 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.12] text-zinc-200 font-semibold text-xs transition-all flex items-center gap-1.5 backdrop-blur-md"
                title="Concours d'Elegance Heritage Dossier (PDF / Print)"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span>Concours Dossier</span>
              </button>

              <button
                onClick={() => setIsCustodyHandoverOpen(true)}
                className="px-4 py-2.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-semibold text-xs transition-all flex items-center gap-1.5 backdrop-blur-md"
                title="Sovereign Custodian Handover Protocol"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Handover Protocol</span>
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.12] text-zinc-300 hover:text-white transition-all backdrop-blur-md"
                title="Share Atelier Access Passkey"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Title & Metadata */}
          <div className="space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-luxury-display text-3xl sm:text-5xl font-black text-white tracking-[0.15em] uppercase">
                  {car.name}
                </h1>
                <span className="text-xs font-mono-numbers text-zinc-400 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.1]">
                  COMMISSION NO. 04
                </span>
                <button
                  type="button"
                  onClick={() => setIsProvenanceBreakdownOpen(true)}
                  className="px-3 py-1 rounded-full text-xs font-mono-numbers font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 flex items-center gap-1 cursor-pointer transition"
                  title="Inspect Provenance Score Breakdown"
                >
                  <Award className="w-3.5 h-3.5" />
                  {car.provenanceScore}/100 PROVENANCE
                </button>
                <span className="px-3 py-1 rounded-full text-xs font-mono-numbers text-zinc-400 bg-white/[0.04] border border-white/[0.08] flex items-center gap-1">
                  <Lock className="w-3 h-3 text-zinc-500" />
                  REG: [PROTECTED]
                </span>
              </div>
              <p className="text-sm sm:text-base text-zinc-300 font-mono-numbers mt-1.5 font-medium">
                {car.fullName} • {car.factoryColor}
              </p>
            </div>

            {/* ========================================================= */}
            {/* 3. STAMPED COACHBUILDER CHASSIS PLAQUE (Aston / Singer)    */}
            {/* ========================================================= */}
            <div className="chassis-plate rounded-2xl p-5 sm:p-6 relative overflow-hidden my-4">
              
              {/* Four Stamped Corner Screw Rivets */}
              <div className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full bg-zinc-600 border border-zinc-400/50 shadow-inner flex items-center justify-center text-[7px] text-zinc-900 font-black">+</div>
              <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-zinc-600 border border-zinc-400/50 shadow-inner flex items-center justify-center text-[7px] text-zinc-900 font-black">+</div>
              <div className="absolute bottom-2.5 left-2.5 w-2 h-2 rounded-full bg-zinc-600 border border-zinc-400/50 shadow-inner flex items-center justify-center text-[7px] text-zinc-900 font-black">+</div>
              <div className="absolute bottom-2.5 right-2.5 w-2 h-2 rounded-full bg-zinc-600 border border-zinc-400/50 shadow-inner flex items-center justify-center text-[7px] text-zinc-900 font-black">+</div>

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-white/[0.08]">
                <div>
                  <span className="text-[10px] font-mono-numbers tracking-[0.25em] text-zinc-400 uppercase block font-semibold">
                    OFFICIAL COACHBUILDER IDENTIFICATION PLAQUE
                  </span>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs font-mono-numbers font-bold text-white">
                      VIN: <span className="text-amber-400">{car.vin}</span>
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-xs font-mono-numbers text-zinc-300">
                      CHASSIS: <strong className="text-zinc-100">{car.chassisCode}</strong>
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-mono-numbers text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/20 flex items-center gap-1.5">
                    <FileCheck2 className="w-3.5 h-3.5" />
                    {car.motStatus}
                  </span>
                  
                  {/* Phase 9: ATA Carnet Trigger */}
                  <button
                    onClick={() => setIsTransitCarnetOpen(true)}
                    className="text-[11px] font-luxury-display text-emerald-300 hover:text-emerald-200 font-bold bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1 rounded border border-emerald-500/30 flex items-center gap-1.5 transition shadow-sm"
                    title="Open Cross-Border ATA Carnet & Alpine Transit Pass"
                  >
                    <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ATA CARNET</span>
                  </button>

                  <button
                    onClick={() => setIsCommissioningOpen(true)}
                    className="text-[11px] font-luxury-display text-amber-300 hover:text-amber-200 font-bold bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1 rounded border border-amber-500/30 flex items-center gap-1.5 transition shadow-sm"
                    title="Open Bespoke Coachbuilder Commissioning Studio"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>BESPOKE ATELIER</span>
                  </button>

                  {/* Feature 5: Specialist Workshop Digital Stamping */}
                  <button
                    onClick={() => setIsWorkshopStampingOpen(true)}
                    className="text-[11px] font-luxury-display text-cyan-300 hover:text-cyan-200 font-bold bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-1 rounded border border-cyan-500/30 flex items-center gap-1.5 transition shadow-sm"
                    title="Sign Off Maintenance via Specialist Workshop Stamping Desk"
                  >
                    <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                    <span>WORKSHOP STAMP</span>
                  </button>
                </div>
              </div>

              {/* Plaque Hardware Ledger Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 text-xs font-mono-numbers">
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase block tracking-wider">Powertrain</span>
                  <span className="text-zinc-100 font-bold block truncate mt-0.5">{car.engineSpec}</span>
                  <span className="text-[11px] text-amber-400 font-semibold">{car.powerOutput}</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase block tracking-wider">Transmission</span>
                  <span className="text-zinc-100 font-bold block truncate mt-0.5">{car.drivetrain}</span>
                  <span className="text-[11px] text-zinc-400">Mechanical Active Differential</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase block tracking-wider">Chassis & Dampers</span>
                  <span className="text-zinc-100 font-bold block truncate mt-0.5">{car.damperSpec}</span>
                  <span className="text-[11px] text-emerald-400 font-semibold">B-Road Valving</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase block tracking-wider">Acoustic System</span>
                  <span className="text-zinc-100 font-bold block truncate mt-0.5">{car.exhaustSpec}</span>
                  <span className="text-[11px] text-zinc-400">Titanium Valved Flow</span>
                </div>
              </div>

            </div>

            {/* ========================================================= */}
            {/* 4. INTERACTIVE ACOUSTIC SOULPRINT PLAYER                   */}
            {/* ========================================================= */}
            <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/70 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-inner">
              <div className="flex items-center gap-3.5 w-full sm:w-auto">
                <button
                  onClick={handleToggleAudio}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold transition-all shadow-lg shrink-0 ${
                    isPlayingAudio
                      ? 'bg-amber-400 text-black ring-2 ring-amber-300 animate-pulse'
                      : 'bg-white hover:bg-zinc-200 text-black active:scale-95'
                  }`}
                  title="Play Acoustic Soulprint"
                >
                  {isPlayingAudio ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono-numbers font-bold text-white uppercase tracking-wider">
                      ACOUSTIC SOULPRINT • HIGH FREQUENCY
                    </span>
                    {isPlayingAudio && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 font-mono-numbers mt-0.5">
                    {car.audioLabel}
                  </p>
                </div>
              </div>

              {/* Animated VU Meter & Frequency Ribbon */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <div className="flex items-end gap-1 h-6 px-3 py-1 rounded bg-black/60 border border-white/[0.06]">
                  {[12, 18, 24, 16, 20, 14, 22, 18, 24, 15, 19, 12].map((height, i) => (
                    <span
                      key={i}
                      className={`w-1 rounded-sm transition-all duration-150 ${
                        isPlayingAudio
                          ? 'bg-amber-400'
                          : 'bg-zinc-700'
                      }`}
                      style={{
                        height: isPlayingAudio ? `${Math.max(6, (height + (i % 3) * 3))}px` : '4px'
                      }}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-mono-numbers text-zinc-400 px-2.5 py-1 rounded bg-black/40 border border-white/[0.06]">
                  <Volume2 className="w-3.5 h-3.5 inline mr-1 text-zinc-400" />
                  CALIBRATED
                </span>
                <button
                  onClick={() => setIsAcousticStudioOpen(true)}
                  className="text-[10px] font-mono-numbers text-emerald-400 hover:text-emerald-300 px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition flex items-center gap-1.5 shadow-sm"
                  title="Launch Valvetrain Harmonics & Superposition Studio"
                >
                  <Sliders className="w-3 h-3 text-emerald-400" />
                  <span className="font-semibold">ACOUSTIC ATELIER</span>
                </button>
              </div>
            </div>

            {/* Posh Editorial Metric Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-white/[0.08] text-xs font-mono-numbers">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06]">
                <span className="text-zinc-500 text-[10px] block uppercase tracking-wider">Logged Expeditions</span>
                <span className="text-xl font-bold text-white mt-0.5 block">{car.drivesCount}</span>
                <span className="text-[10px] text-zinc-500">Verified B-Roads</span>
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06]">
                <span className="text-zinc-500 text-[10px] block uppercase tracking-wider">Curated Observers</span>
                <span className="text-xl font-bold text-white mt-0.5 block">{car.followersCount.toLocaleString()}</span>
                <span className="text-[10px] text-zinc-500">Global Watchlist</span>
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06]">
                <span className="text-zinc-500 text-[10px] block uppercase tracking-wider">Certified Distance</span>
                <span className="text-xl font-bold text-white mt-0.5 block">{car.mileage.toLocaleString()} mi</span>
                <span className="text-[10px] text-emerald-400">DVSA Authenticated</span>
              </div>
              <button
                type="button"
                onClick={() => setIsProvenanceBreakdownOpen(true)}
                className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] hover:border-amber-400/40 text-left cursor-pointer transition group"
                title="Inspect Provenance Score Breakdown"
              >
                <span className="text-zinc-500 text-[10px] block uppercase tracking-wider">Provenance Index</span>
                <span className="text-xl font-bold text-amber-400 mt-0.5 block flex items-center gap-1 group-hover:text-amber-300">
                  <Award className="w-4 h-4 text-amber-400" />
                  {car.provenanceScore} / 100
                </span>
                <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400">Heritage Grade A+ · Inspect →</span>
              </button>
            </div>

            {/* Curated Atelier Dossier Bio */}
            <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans max-w-3xl pt-1 space-y-1">
              <p className="text-zinc-200">
                <span className="font-semibold text-white">Custodian Statement:</span> {car.custodianNote}
              </p>
              <p className="text-zinc-400 text-xs font-mono-numbers pt-1">
                📍 {car.locationDetails}
              </p>
            </div>
          </div>

          {/* 5. REFINED STORY HIGHLIGHTS (Brushed Titanium Rings) */}
          <div className="pt-6 border-t border-white/[0.08] mt-6">
            <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-1">
              {[
                { title: 'Cotswolds Run', tag: 'B-ROADS', cover: '/real_uk_m3_cottage.jpg' },
                { title: 'Sunday Decon', tag: 'DETAIL', cover: '/real_uk_driveway_wash.jpg' },
                { title: 'Surrey GT3', tag: 'CONVOY', cover: '/real_uk_gt3_suburb.jpg' },
                { title: 'E30 Slicktop', tag: 'HERITAGE', cover: '/real_uk_e30_terrace.jpg' },
                { title: 'Dales Farm', tag: 'OVERLAND', cover: '/real_uk_defender_farm.jpg' },
                { title: 'MOT Pass', tag: 'DVSA 0-ADV', cover: '/real_uk_m3_cottage.jpg' }
              ].map((h, i) => (
                <button
                  key={i}
                  onClick={() => showToast({
                    title: `Atelier Highlight: ${h.title}`,
                    message: `Inspecting verified photo diary • Category: ${h.tag}`,
                    type: 'garage',
                    badge: h.tag
                  })}
                  className="flex flex-col items-center gap-2 shrink-0 group focus:outline-none"
                >
                  <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-b from-white/30 via-white/10 to-transparent border border-white/20 group-hover:border-white/50 transition-all shadow-md">
                    <div className="w-full h-full rounded-full bg-zinc-950 overflow-hidden">
                      <img
                        src={h.cover}
                        alt={h.title}
                        className="w-full h-full rounded-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-semibold text-zinc-200 block group-hover:text-white transition-colors">
                      {h.title}
                    </span>
                    <span className="text-[9px] font-mono-numbers text-zinc-500 uppercase tracking-widest">
                      {h.tag}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

      </section>

      {/* ========================================================= */}
      {/* 6. MINIMALIST TABS (Understated & Editorial)               */}
      {/* ========================================================= */}
      <div className="border-b border-white/[0.08]">
        <nav className="flex justify-around sm:justify-start sm:space-x-8 text-xs font-semibold overflow-x-auto no-scrollbar" aria-label="Tabs">
          {[
            { id: 'grid', label: 'I. ATELIER GALLERY', icon: Grid },
            { id: 'drives', label: 'II. DOCUMENTED EXPEDITIONS', icon: Compass, count: car.drivesCount },
            { id: 'build', label: 'III. CHASSIS HARDWARE & BOM', icon: Wrench, count: currentBuilds.length },
            { id: 'memory', label: 'IV. SOVEREIGN LOGBOOK', icon: Clock, count: currentMemories.length },
            { id: 'health', label: 'V. DIAGNOSTIC TELEMETRY', icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3.5 px-3 border-b-2 flex items-center gap-2 transition-all shrink-0 ${
                  isActive
                    ? 'border-white text-white font-bold'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="tracking-wider text-[11px] font-mono-numbers">{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="text-[10px] font-mono-numbers text-zinc-500">({tab.count})</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ========================================================= */}
      {/* 7. TAB CONTENTS                                           */}
      {/* ========================================================= */}

      {/* TAB A: 3-COLUMN AUTHENTIC CANDID GALLERY GRID */}
      {activeTab === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {car.gallery.map((item, i) => (
            <div 
              key={i} 
              onClick={() => showToast({
                title: item.title,
                message: `${item.subtitle} • Recorded in sovereign archive`,
                type: 'garage',
                badge: item.tag
              })}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-zinc-950 border border-white/[0.08] cursor-pointer"
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                <span className="text-[9px] font-mono-numbers px-2.5 py-0.5 rounded-full bg-white/20 self-start mb-1 backdrop-blur-sm uppercase">
                  {item.tag}
                </span>
                <p className="text-xs font-semibold line-clamp-1">{item.title}</p>
                <p className="text-[11px] text-zinc-400 font-sans line-clamp-1">{item.subtitle}</p>
                <div className="flex items-center gap-3 text-xs font-mono-numbers text-zinc-300 mt-1">
                  <span>❤️ Verified Authenticity</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB B: RECORDED EXPEDITIONS (Tailored per Vehicle) */}
      {activeTab === 'drives' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0B0C10] border border-white/[0.08] space-y-5">
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono-numbers font-semibold border border-emerald-500/20">
                    EXPEDITION #{currentExpedition.driveNumber}
                  </span>
                  <span className="text-xs font-mono-numbers text-zinc-400">
                    {currentExpedition.date}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1.5">{currentExpedition.title}</h3>
                <p className="text-xs text-zinc-400 mt-0.5 font-mono-numbers">{currentExpedition.routeTitle} • {currentExpedition.surfaceCondition}</p>
              </div>

              <Link
                to="/drive/drive-184"
                className="px-5 py-2.5 rounded-full bg-white hover:bg-zinc-100 text-black text-xs font-bold transition-all flex items-center gap-2 shrink-0 shadow-md"
              >
                <span>Inspect Route Telemetry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Telemetry Metric Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono-numbers">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06]">
                <span className="text-zinc-500 text-[10px] block uppercase">Distance</span>
                <span className="text-lg font-bold text-white mt-0.5 block">{currentExpedition.distanceMiles} mi</span>
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06]">
                <span className="text-zinc-500 text-[10px] block uppercase">Moving Duration</span>
                <span className="text-lg font-bold text-white mt-0.5 block">{currentExpedition.duration}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06]">
                <span className="text-zinc-500 text-[10px] block uppercase">Average Efficiency</span>
                <span className="text-lg font-bold text-emerald-400 mt-0.5 block">{currentExpedition.efficiencyMpg} MPG</span>
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06]">
                <span className="text-zinc-500 text-[10px] block uppercase">True Fuel Cost</span>
                <span className="text-lg font-bold text-zinc-200 mt-0.5 block">£{currentExpedition.costTotalGbp.toFixed(2)}</span>
              </div>
            </div>

            {/* Route Notes */}
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-white/[0.06] text-xs text-zinc-300 font-sans leading-relaxed">
              <p className="font-semibold text-white mb-1">Custodian Observation:</p>
              {currentExpedition.ownerNotes}
            </div>

            {/* Photo Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <PlateBlurImage src={currentExpedition.photos[0] || car.heroImage} alt="Drive shakedown" aspectRatio="aspect-[16/10]" />
              <PlateBlurImage src={currentExpedition.photos[1] || car.coverImage} alt="Drive shakedown secondary" aspectRatio="aspect-[16/10]" />
            </div>
          </div>
        </div>
      )}

      {/* TAB C: CHASSIS HARDWARE SPEC & SUPPLY CHAIN BOM */}
      {activeTab === 'build' && (
        <div className="space-y-6">
          {/* Sub-Navigation Switcher: Supply Chain BOM vs Build Evolution */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 rounded-2xl bg-black/60 border border-white/[0.08] backdrop-blur-md">
            <div className="flex items-center gap-2 p-1 rounded-xl bg-zinc-950/80 border border-white/[0.06] overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setHardwareViewMode('bom')}
                className={`px-4 py-2 rounded-lg text-xs font-mono-numbers font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  hardwareViewMode === 'bom'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-lg shadow-amber-500/10'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>SUPPLY CHAIN BOM & LINEAGE</span>
              </button>

              <button
                type="button"
                onClick={() => setHardwareViewMode('evolution')}
                className={`px-4 py-2 rounded-lg text-xs font-mono-numbers font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  hardwareViewMode === 'evolution'
                    ? 'bg-white text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>BUILD EVOLUTION & DYNO BENCH</span>
              </button>
            </div>

            <div className="hidden md:flex items-center gap-2 px-3 text-[11px] font-mono-numbers text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{hardwareViewMode === 'bom' ? 'ISO 9001 / TÜV Serialization Active' : 'Maha LPS 3000 Verified'}</span>
            </div>
          </div>

          {hardwareViewMode === 'bom' ? (
            <SupplyChainBomView vehicleId={car.id} vin={car.vin} vehicleName={car.name} />
          ) : (
            <div className="space-y-6">
              {/* Interactive Dyno Studio & Torque Blueprint */}
              <DynoStudio vehicleId={car.id} vehicleName={car.name} />

              {currentBuilds.map((ver) => (
                <div key={ver.versionCode} className="p-6 sm:p-8 rounded-3xl bg-[#0B0C10] border border-white/[0.08] space-y-4 shadow-xl">
                  <div className="flex justify-between items-center border-b border-white/[0.08] pb-3.5">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-white/[0.08] text-white text-xs font-mono-numbers font-bold border border-white/[0.12]">
                        {ver.versionCode}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white">{ver.title}</h3>
                    </div>
                    <span className="text-xs font-mono-numbers text-zinc-400">{ver.date}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
                    {ver.summary}
                  </p>

                  {ver.partsAdded.length > 0 && (
                    <div className="rounded-2xl border border-white/[0.08] overflow-hidden bg-black/40 text-xs font-mono-numbers">
                      <table className="w-full text-left">
                        <thead className="bg-white/[0.04] text-zinc-400 text-[10px] uppercase border-b border-white/[0.08]">
                          <tr>
                            <th className="py-3 px-4">Component Category</th>
                            <th className="py-3 px-4">Hardware Installed</th>
                            <th className="py-3 px-4">Engineering Rationale</th>
                            <th className="py-3 px-4 text-right">Investment</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.06]">
                          {ver.partsAdded.map((part, i) => (
                            <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-3.5 px-4 font-semibold text-white">{part.category}</td>
                              <td className="py-3.5 px-4 text-amber-400 font-bold">{part.componentName}</td>
                              <td className="py-3.5 px-4 font-sans text-zinc-300 text-xs max-w-xs">{part.rationale}</td>
                              <td className="py-3.5 px-4 text-right text-zinc-300 font-bold">
                                {part.costGbp ? `£${part.costGbp.toLocaleString()}` : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB D: SOVEREIGN LOGBOOK (MEMORY - Tailored per Vehicle) */}
      {activeTab === 'memory' && (
        <div className="relative border-l border-white/[0.1] ml-4 sm:ml-6 space-y-6 pl-6 sm:pl-8">
          {currentMemories.map((item) => (
            <div key={item.id} className="relative">
              <span className="absolute -left-[31px] sm:-left-[39px] top-2 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#09090B]"></span>
              <div className="p-5 sm:p-6 rounded-2xl bg-[#0B0C10] border border-white/[0.08] space-y-2.5 shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <ProvenanceBadge type={item.provenance} signatory={item.verifiedSignatory} />
                    <h4 className="text-sm sm:text-base font-bold text-white">{item.title}</h4>
                  </div>
                  <span className="text-xs font-mono-numbers text-zinc-400">
                    {item.mileage.toLocaleString()} mi • {item.date}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
                  {item.description}
                </p>
                {item.costGbp && (
                  <div className="text-[11px] font-mono-numbers text-zinc-400 pt-2 border-t border-white/[0.06] flex items-center justify-between">
                    <span>Certified Signatory: <strong className="text-zinc-200">{item.verifiedSignatory}</strong></span>
                    <span>Recorded Cost: <strong className="text-emerald-400">£{item.costGbp.toFixed(2)}</strong></span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB E: DIAGNOSTIC TELEMETRY (Tailored per Vehicle & Interactive Pyrometer) */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          
          {/* Top Bar with Launch Pyrometer CTA */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 rounded-2xl bg-zinc-950 border border-white/[0.08]">
            <div>
              <span className="text-[10px] font-mono-numbers uppercase tracking-widest text-zinc-400 block font-semibold">
                CHASSIS SENSOR BUS • {car.chassisCode}
              </span>
              <h4 className="font-luxury-display text-white text-sm font-bold mt-0.5">
                Real-Time Mechanical & Thermal Diagnostics
              </h4>
            </div>

            <button
              onClick={() => setIsTyrePyrometerOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 border border-amber-500/30 text-xs font-mono-numbers font-bold transition flex items-center gap-2 shadow-sm"
            >
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
              <span>3-ZONE TYRE PYROMETER</span>
            </button>
          </div>

          {/* Interactive Radial Dynamics & Telemetry Radar Cluster */}
          <RadialDynamicsCluster 
            carName={car.name} 
            carModel={car.fullName} 
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-[#0B0C10] border border-white/[0.08] space-y-3">
              <div className="flex justify-between items-center text-xs font-mono-numbers">
                <span className="text-zinc-400">OBD-II CANBUS DTC HEALTH</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                  {currentDiagnostics.dtcHealth}
                </span>
              </div>
              <div className="text-2xl font-bold text-white font-mono-numbers">{currentDiagnostics.dtcStatus}</div>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                {currentDiagnostics.dtcDesc}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B0C10] border border-white/[0.08] space-y-3">
              <div className="flex justify-between items-center text-xs font-mono-numbers">
                <span className="text-zinc-400">TYRE CONTACT PATCH & WEAR</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                  {currentDiagnostics.tyresStatus}
                </span>
              </div>
              <div className="text-2xl font-bold text-amber-400 font-mono-numbers">{currentDiagnostics.tyresHeadline}</div>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                {currentDiagnostics.tyresDesc}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B0C10] border border-white/[0.08] space-y-3">
              <div className="flex justify-between items-center text-xs font-mono-numbers">
                <span className="text-zinc-400">BRAKING FRICTION & HYDRAULICS</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                  {currentDiagnostics.brakesStatus}
                </span>
              </div>
              <div className="text-2xl font-bold text-white font-mono-numbers">{currentDiagnostics.brakesHeadline}</div>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                {currentDiagnostics.brakesDesc}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B0C10] border border-white/[0.08] space-y-3">
              <div className="flex justify-between items-center text-xs font-mono-numbers">
                <span className="text-zinc-400">AUXILIARY & ELECTRICAL LEDGER</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                  {currentDiagnostics.batteryStatus}
                </span>
              </div>
              <div className="text-2xl font-bold text-white font-mono-numbers">{currentDiagnostics.batteryHeadline}</div>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                {currentDiagnostics.batteryDesc}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sovereign Digital Vehicle Passport Modal */}
      <VehiclePassportModal 
        isOpen={isPassportOpen} 
        onClose={() => setIsPassportOpen(false)} 
        vehicleName={`${car.name} (${car.fullName})`} 
      />

      {/* Valvetrain Harmonics & Acoustic Atelier Studio */}
      <AcousticStudioModal
        isOpen={isAcousticStudioOpen}
        onClose={() => setIsAcousticStudioOpen(false)}
        initialCarId={car.id}
      />

      {/* Bespoke Coachbuilder Commissioning & Plaque Forge */}
      <CommissioningAtelierModal
        isOpen={isCommissioningOpen}
        onClose={() => setIsCommissioningOpen(false)}
        carName={car.name}
        carModel={car.fullName}
        initialVin={car.vin}
      />

      {/* Cross-Border ATA Carnet & Alpine Transit Pass */}
      <TransitCarnetModal
        isOpen={isTransitCarnetOpen}
        onClose={() => setIsTransitCarnetOpen(false)}
        carName={car.name}
        carModel={car.fullName}
        vin={car.vin}
      />

      {/* 3-Zone Tyre Pyrometer & Contact Patch Studio */}
      <TyrePyrometerModal
        isOpen={isTyrePyrometerOpen}
        onClose={() => setIsTyrePyrometerOpen(false)}
        carName={car.name}
        carModel={car.fullName}
      />

      {/* Provenance Audit Matrix Breakdown */}
      <ProvenanceBreakdownModal
        isOpen={isProvenanceBreakdownOpen}
        onClose={() => setIsProvenanceBreakdownOpen(false)}
        carName={car.name}
        fullName={car.fullName}
        chassisCode={car.chassisCode}
        vin={car.vin}
        provenanceScore={car.provenanceScore}
      />

      {/* Specialist Workshop Stamping Desk Modal */}
      <WorkshopStampingModal
        isOpen={isWorkshopStampingOpen}
        onClose={() => setIsWorkshopStampingOpen(false)}
        preselectedVehicleId={selectedVehicleId}
      />

      {/* Sovereign Custodian Handover Protocol Modal */}
      <CustodyHandoverModal
        isOpen={isCustodyHandoverOpen}
        onClose={() => setIsCustodyHandoverOpen(false)}
        vehicleId={car.id}
        vehicleName={car.name}
        vin={car.vin}
        chassisCode={car.chassisCode}
        currentMileage={car.mileage}
      />

      {/* Printable Concours d'Elegance Heritage Dossier Modal */}
      <ConcoursHeritageDossierModal
        isOpen={isConcoursDossierOpen}
        onClose={() => setIsConcoursDossierOpen(false)}
        car={car}
      />

    </div>
  );
};
