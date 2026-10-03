import { createContext, useContext, useState, useEffect } from 'react';
import type { FC, ReactNode } from 'react';

export interface UserVehicle {
  id: string;
  name: string;
  fullName: string;
  chassisCode: string;
  vin: string;
  year: number;
  factoryColor: string;
  location: string;
  mileage: number;
  provenanceScore: number;
  heroImage: string;
  coverImage: string;
  engineSpec: string;
  powerOutput: string;
  drivetrain: string;
  custodianNote: string;
}

export const USER_VEHICLES_STABLE: UserVehicle[] = [
  {
    id: 'car-maya-m3',
    name: 'MAYA',
    fullName: 'BMW M3 Competition xDrive (G80 LCI)',
    chassisCode: 'G80-M3-COMP-LCI',
    vin: 'WBS-8M92-0004-MAYAM3',
    year: 2023,
    factoryColor: 'Isle of Man Green Metallic (C4G)',
    location: 'Cotswolds Private Residence',
    mileage: 24850,
    provenanceScore: 98,
    heroImage: '/real_uk_m3_cottage.jpg',
    coverImage: '/real_uk_m3_cottage.jpg',
    engineSpec: '3.0L Twin-Turbo S58 Inline-6',
    powerOutput: '525 BHP • 650 Nm Torque',
    drivetrain: 'M xDrive AWD with Pure RWD Drift Mode',
    custodianNote: 'Acquired new from BMW Park Lane. Meticulously conditioned on British B-roads. Serviced strictly under BMW M protocols with Ferodo DS2500 high-friction compound.',
  },
  {
    id: 'car-kuro-gt3',
    name: 'KURO',
    fullName: 'Porsche 911 GT3 Touring (992)',
    chassisCode: '992-GT3-TOURING',
    vin: 'WP0-ZZZ-99Z-NS-1092',
    year: 2024,
    factoryColor: 'Chalk Grey / Crayon Non-Metallic (3H)',
    location: 'Surrey Private Residence',
    mileage: 18400,
    provenanceScore: 99,
    heroImage: '/real_uk_gt3_suburb.jpg',
    coverImage: '/real_uk_gt3_suburb.jpg',
    engineSpec: '4.0L Naturally Aspirated Boxer-6',
    powerOutput: '502 BHP • 9,000 RPM Redline',
    drivetrain: '6-Speed GT Sports Manual • Mechanical LSD',
    custodianNote: 'Delivered in Stuttgart-Zuffenhausen. Spec’d deliberately with the 6-speed manual and Touring package for pure analog engagement.',
  },
  {
    id: 'car-e30-retromod',
    name: 'RETRO MOD',
    fullName: 'BMW 318is Slicktop (E30)',
    chassisCode: 'E30-318IS-SLICKTOP',
    vin: 'WBA-AF92-0019-E30',
    year: 1991,
    factoryColor: 'Brilliant Red (Brilliantrot 308)',
    location: 'Bristol Victorian Residential Street',
    mileage: 114500,
    provenanceScore: 94,
    heroImage: '/real_uk_e30_terrace.jpg',
    coverImage: '/real_uk_e30_terrace.jpg',
    engineSpec: '1.8L 16V M42 Twin-Cam Inline-4',
    powerOutput: '136 BHP • 175 Nm Torque',
    drivetrain: '5-Speed Getrag 240 Manual • Small-Case 4.10 LSD',
    custodianNote: 'Acquired from original owner Arthur Pendleton. Slicktop factory sunroof delete. Serviced with Castrol classic lubricants.',
  },
  {
    id: 'car-expedition-110',
    name: 'EXPEDITION 110',
    fullName: 'Land Rover Defender 110 V8 Bond Edition',
    chassisCode: 'L663-DEF110-V8',
    vin: 'SAL-WR2-0041-DEF',
    year: 2022,
    factoryColor: 'Carpathian Grey Satin Protective Film',
    location: 'Yorkshire Dales Estate Outbuilding',
    mileage: 24600,
    provenanceScore: 96,
    heroImage: '/real_uk_defender_farm.jpg',
    coverImage: '/real_uk_defender_farm.jpg',
    engineSpec: '5.0L Supercharged V8',
    powerOutput: '518 BHP • 625 Nm Torque',
    drivetrain: 'Twin-Speed Electronic Transfer Box • Active Rear Lock',
    custodianNote: 'Commissioned as support scout vehicle for remote Welsh and Scottish expeditions. 900mm wading capability with active ultrasonic depth sonar.',
  }
];

interface ActiveVehicleContextValue {
  activeVehicle: UserVehicle;
  activeVehicleId: string;
  userVehicles: UserVehicle[];
  setActiveVehicleId: (id: string) => void;
  switchVehicle: (id: string) => void;
}

const ActiveVehicleContext = createContext<ActiveVehicleContextValue | null>(null);

const STORAGE_KEY = 'datum_active_vehicle_id';

export const ActiveVehicleProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [activeVehicleId, setActiveVehicleIdState] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && USER_VEHICLES_STABLE.some(v => v.id === saved)) {
        return saved;
      }
    }
    return 'car-maya-m3';
  });

  const activeVehicle = USER_VEHICLES_STABLE.find(v => v.id === activeVehicleId) || USER_VEHICLES_STABLE[0];

  const switchVehicle = (id: string) => {
    if (USER_VEHICLES_STABLE.some(v => v.id === id)) {
      setActiveVehicleIdState(id);
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, id);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, activeVehicleId);
    }
  }, [activeVehicleId]);

  return (
    <ActiveVehicleContext.Provider
      value={{
        activeVehicle,
        activeVehicleId,
        userVehicles: USER_VEHICLES_STABLE,
        setActiveVehicleId: switchVehicle,
        switchVehicle,
      }}
    >
      {children}
    </ActiveVehicleContext.Provider>
  );
};

export const useActiveVehicle = (): ActiveVehicleContextValue => {
  const ctx = useContext(ActiveVehicleContext);
  if (!ctx) {
    throw new Error('useActiveVehicle must be used within an ActiveVehicleProvider');
  }
  return ctx;
};
