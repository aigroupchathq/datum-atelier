import { useState } from 'react';
import type { FC } from 'react';
import { mockCommunities } from '../data/mockData';
import type { Community } from '../types';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Wrench, 
  Flag, 
  Sparkles, 
  Compass, 
  ShieldCheck, 
  Check, 
  ArrowRight,
  X,
  Radio,
  Award,
  Layers,
  Activity,
  CheckCircle2,
  Clock,
  MapPin
} from 'lucide-react';

interface ConvoyRosterItem {
  id: string;
  convoyTitle: string;
  departureTime: string;
  routeSector: string;
  radioFrequency: string;
  carsCount: number;
  roster: {
    vehicleName: string;
    model: string;
    driver: string;
    tyresColdPsi: string;
    fuelGrade: string;
    status: 'READY' | 'ROLLING' | 'STAGED';
    avatarUrl: string;
  }[];
}

const LIVE_CONVOYS: ConvoyRosterItem[] = [
  {
    id: 'convoy-cotswolds',
    convoyTitle: 'Cotswolds Dawn Patrol (B4425 Loop)',
    departureTime: 'Sunday 06:15 AM',
    routeSector: 'Burford High St to Bibury Roman Bridge',
    radioFrequency: 'PMR446 Ch 7 • CTCSS 12 (100.0 Hz)',
    carsCount: 14,
    roster: [
      { vehicleName: 'MAYA', model: 'BMW M3 Competition (G80)', driver: 'Lead Pilot', tyresColdPsi: '32.0 PSI', fuelGrade: 'Shell V-Power 99', status: 'READY', avatarUrl: '/real_uk_m3_cottage.jpg' },
      { vehicleName: 'KURO', model: 'Porsche 911 GT3 Touring', driver: 'Pace Setter', tyresColdPsi: '29.5 PSI', fuelGrade: 'Esso Supreme 99', status: 'READY', avatarUrl: '/real_uk_gt3_suburb.jpg' },
      { vehicleName: 'RETRO MOD', model: 'BMW 318is Slicktop (E30)', driver: 'Tail Sweeper', tyresColdPsi: '30.0 PSI', fuelGrade: '99 RON', status: 'STAGED', avatarUrl: '/real_uk_e30_terrace.jpg' },
      { vehicleName: 'EXPEDITION', model: 'Defender 110 P400 SE', driver: 'Recovery Support', tyresColdPsi: '36.0 PSI', fuelGrade: 'Super Unleaded', status: 'STAGED', avatarUrl: '/real_uk_defender_farm.jpg' }
    ]
  },
  {
    id: 'convoy-brecon',
    convoyTitle: 'Brecon Beacons Night Run (A4067)',
    departureTime: 'Friday 23:00 PM',
    routeSector: 'Sennybridge to Swansea Valley Moor',
    radioFrequency: 'PMR446 Ch 3 • CTCSS 8 (88.5 Hz)',
    carsCount: 8,
    roster: [
      { vehicleName: 'VALKYRIE', model: 'McLaren 720S Performance', driver: 'Night Lead', tyresColdPsi: '31.0 PSI', fuelGrade: 'Shell V-Power 99', status: 'READY', avatarUrl: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=150&q=90' },
      { vehicleName: 'YUKI', model: 'Toyota GR Yaris Circuit', driver: 'Mid-Pack Scout', tyresColdPsi: '28.0 PSI', fuelGrade: 'Tesco 99', status: 'STAGED', avatarUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=150&q=90' }
    ]
  }
];

const GUILD_CHALLENGES = [
  {
    id: 'ch-dawn-patrol',
    title: 'Dawn Patrol Trilogy Challenge',
    guildName: 'Sunday Dawn Runs & Caffeine Gathering',
    badge: 'GOLD MEDAL',
    objective: 'Log 3 verified B-road mountain passes departing between 05:00 AM and 07:30 AM.',
    currentLeader: 'KURO (Porsche 911 GT3) — 5 Passes Logged',
    reward: 'Stamped Titanium Grill Badge #DAWN-2026',
    progressPct: 80,
    accentClass: 'text-amber-400 border-amber-500/30 bg-amber-500/10'
  },
  {
    id: 'ch-rotisserie',
    title: 'Bare-Metal Preservation League',
    guildName: 'Air-Cooled & Classic Barn-Find Guild',
    badge: 'HISTORIC HERITAGE',
    objective: 'Document 50+ verified body rotisserie welding, lead-loading, and rust-mitigation milestones.',
    currentLeader: 'RetroMod_Dan (BMW E30 318is) — 48 Milestones',
    reward: 'DVSA Historic Provenance Master Seal',
    progressPct: 96,
    accentClass: 'text-rose-400 border-rose-500/30 bg-rose-500/10'
  },
  {
    id: 'ch-dyno-accuracy',
    title: 'Maha Hub-Dyno Consistency Cup',
    guildName: 'S58 & M-Performance Tuning Guild',
    badge: 'POWER VERIFIED',
    objective: 'Produce 3 consecutive dyno cell pulls within ±1.5% horsepower and torque delta on Maha LPS 3000.',
    currentLeader: 'MAYA (BMW M3 G80) — 612 BHP (±0.4% delta)',
    reward: 'Verified Sovereign ECU Ledger Notarization',
    progressPct: 100,
    accentClass: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
  }
];

export const CommunitiesPage: FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeClub, setActiveClub] = useState<Community | null>(null);
  const [enrolledClubs, setEnrolledClubs] = useState<Record<string, boolean>>({
    'comm-tuning-s58': true,
    'comm-cars-coffee-dawn': true,
  });
  
  // Convoy check-in status
  const [checkedInConvoys, setCheckedInConvoys] = useState<Record<string, boolean>>({
    'convoy-cotswolds': true
  });

  const { showToast } = useToast();
  const { isWhiteYellow } = useTheme();

  const categories = [
    { id: 'all', label: 'All Guilds', icon: Layers, count: mockCommunities.length },
    { 
      id: 'technical_expert', 
      label: 'Technical & Engineering', 
      icon: Wrench, 
      count: mockCommunities.filter(c => c.category === 'technical_expert').length 
    },
    { 
      id: 'motorsport_performance', 
      label: 'Motorsport & Circuit', 
      icon: Flag, 
      count: mockCommunities.filter(c => c.category === 'motorsport_performance').length 
    },
    { 
      id: 'aesthetic_subculture', 
      label: 'Coachwork & Stance', 
      icon: Sparkles, 
      count: mockCommunities.filter(c => c.category === 'aesthetic_subculture').length 
    },
    { 
      id: 'lifestyle_adventure', 
      label: 'Expedition & Dawn Patrol', 
      icon: Compass, 
      count: mockCommunities.filter(c => c.category === 'lifestyle_adventure').length 
    },
    { 
      id: 'brand_era', 
      label: 'Marque & Era Heritage', 
      icon: Activity, 
      count: mockCommunities.filter(c => c.category === 'brand_era').length 
    },
  ];

  const filteredCommunities = mockCommunities.filter((comm) => {
    if (selectedCategory === 'all') return true;
    return comm.category === selectedCategory;
  });

  const handleToggleEnroll = (clubId: string, clubName: string) => {
    setEnrolledClubs((prev) => {
      const isEnrolled = !!prev[clubId];
      const updated = { ...prev, [clubId]: !isEnrolled };
      if (!isEnrolled) {
        showToast({
          title: `Inducted: ${clubName}`,
          message: 'MAYA has been officially enrolled into the collective registry.',
          type: 'privacy'
        });
      } else {
        showToast({
          title: `Withdrawn from ${clubName}`,
          message: 'Collective telemetry synchronization paused.',
          type: 'garage'
        });
      }
      return updated;
    });
  };

  const handleToggleConvoyCheckIn = (convoyId: string, convoyTitle: string) => {
    setCheckedInConvoys((prev) => {
      const isChecked = !prev[convoyId];
      showToast({
        title: isChecked ? 'Convoy Roster Confirmed' : 'Roster Position Relinquished',
        message: isChecked 
          ? `MAYA confirmed for ${convoyTitle}. Radio frequency locked. 800m privacy geofenced.`
          : `Departure slot released for ${convoyTitle}.`,
        type: 'drive'
      });
      return { ...prev, [convoyId]: isChecked };
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-12 animate-in fade-in duration-300">
      
      {/* ========================================================= */}
      {/* 1. EDITORIAL ATELIER HEADER                               */}
      {/* ========================================================= */}
      <div className={`relative rounded-3xl p-6 sm:p-10 overflow-hidden ${
        isWhiteYellow 
          ? 'bg-gradient-to-b from-yellow-50/70 via-white to-white border border-yellow-300/80 text-zinc-900 shadow-sm' 
          : 'bg-gradient-to-b from-[#14151B] to-[#0A0B0E] border border-amber-500/20 text-white shadow-2xl'
      }`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative space-y-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-mono-numbers font-bold border flex items-center gap-1.5 shadow-xs ${
              isWhiteYellow
                ? 'bg-yellow-100 text-yellow-950 border-yellow-300'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
            }`}>
              <Sparkles className={`w-3.5 h-3.5 ${isWhiteYellow ? 'text-yellow-600' : 'text-amber-400'}`} />
              <span>SOVEREIGN PADDOCK GUILDS & EXPEDITIONS</span>
            </span>
            <span className={`text-xs font-mono-numbers ${isWhiteYellow ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Zero Generic Clones • Real Hardware Ledgers • 800m Privacy Geofenced
            </span>
          </div>

          <h1 className={`font-luxury-display text-3xl sm:text-5xl font-black tracking-wider uppercase leading-tight ${
            isWhiteYellow ? 'text-zinc-950' : 'text-white'
          }`}>
            Driver Guilds & Societies
          </h1>
          
          <p className={`text-sm sm:text-base font-luxury-editorial italic leading-relaxed text-lg ${
            isWhiteYellow ? 'text-zinc-700' : 'text-zinc-300'
          }`}>
            "Every member participates through the sovereign identity of their vehicle. Grounded in certified hub-dyno runs, Hunter optical alignment, unedited domestic photography, and synchronized convoy telemetry."
          </p>

          <div className={`pt-2 flex flex-wrap items-center gap-4 text-xs font-mono-numbers ${
            isWhiteYellow ? 'text-zinc-600' : 'text-zinc-400'
          }`}>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>800m Geofenced Departs</span>
            </div>
            <div className={isWhiteYellow ? 'text-zinc-300' : 'text-zinc-700'}>•</div>
            <div className="flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-sky-600" />
              <span>PMR446 Channel Sync</span>
            </div>
            <div className={isWhiteYellow ? 'text-zinc-300' : 'text-zinc-700'}>•</div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-yellow-600" />
              <span>Proof-of-Work Stamped</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. LIVE CONVOY ROLL-CALL HUD                              */}
      {/* ========================================================= */}
      <div className="space-y-4">
        <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b pb-3 ${
          isWhiteYellow ? 'border-zinc-200' : 'border-zinc-800'
        }`}>
          <div>
            <span className={`text-[11px] font-mono-numbers uppercase tracking-wider block font-bold ${
              isWhiteYellow ? 'text-yellow-600' : 'text-amber-400'
            }`}>
              SYNCHRONIZED PADDOCK TELEMETRY
            </span>
            <h2 className={`text-xl sm:text-2xl font-bold font-luxury-display tracking-wide ${
              isWhiteYellow ? 'text-zinc-950' : 'text-white'
            }`}>
              Live Convoy Roll-Call & Staging
            </h2>
          </div>
          <p className={`text-xs font-sans max-w-md ${
            isWhiteYellow ? 'text-zinc-600' : 'text-zinc-400'
          }`}>
            Real-time pre-flight inspection for upcoming B-road departures. Automatic 800m privacy cloaks residential start coordinates.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {LIVE_CONVOYS.map((convoy) => {
            const isCheckedIn = !!checkedInConvoys[convoy.id];
            return (
              <div 
                key={convoy.id}
                className={`posh-card rounded-2xl border p-6 flex flex-col justify-between space-y-5 transition-all shadow-xs ${
                  isWhiteYellow
                    ? 'bg-white border-zinc-200/90 text-zinc-900 hover:border-yellow-400/80 hover:shadow-md'
                    : 'bg-[#0F1014] border-zinc-800 text-white hover:border-amber-500/30 shadow-xl'
                }`}
              >
                <div className="space-y-4">
                  <div className={`flex items-start justify-between gap-3 border-b pb-3 ${isWhiteYellow ? 'border-zinc-200' : 'border-zinc-850'}`}>
                    <div>
                      <span className={`text-[10px] font-mono-numbers px-2 py-0.5 rounded border font-bold uppercase ${
                        isWhiteYellow ? 'bg-yellow-100 text-yellow-950 border-yellow-300' : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                      }`}>
                        UPCOMING DEPARTURE
                      </span>
                      <h3 className={`text-base font-bold font-luxury-display mt-1.5 ${isWhiteYellow ? 'text-zinc-950' : 'text-white'}`}>
                        {convoy.convoyTitle}
                      </h3>
                      <p className={`text-xs font-mono-numbers mt-0.5 flex items-center gap-1.5 ${isWhiteYellow ? 'text-zinc-500' : 'text-zinc-400'}`}>
                        <MapPin className={`w-3.5 h-3.5 ${isWhiteYellow ? 'text-yellow-600' : 'text-zinc-500'}`} />
                        <span>{convoy.routeSector}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <div className={`text-xs font-bold font-mono-numbers flex items-center gap-1 justify-end ${isWhiteYellow ? 'text-zinc-950' : 'text-white'}`}>
                        <Clock className={`w-3.5 h-3.5 ${isWhiteYellow ? 'text-yellow-600' : 'text-cyan-400'}`} />
                        <span>{convoy.departureTime}</span>
                      </div>
                      <span className={`text-[10px] font-mono-numbers block mt-0.5 font-medium ${isWhiteYellow ? 'text-sky-700' : 'text-cyan-300'}`}>
                        {convoy.radioFrequency}
                      </span>
                    </div>
                  </div>

                  {/* Confirmed Drivers Roster */}
                  <div className="space-y-2">
                    <span className={`text-[10px] uppercase font-mono-numbers tracking-wider block ${isWhiteYellow ? 'text-zinc-500' : 'text-zinc-400'}`}>
                      Confirmed Driver Roster ({convoy.carsCount} Cars Staged)
                    </span>
                    <div className="space-y-2">
                      {convoy.roster.map((car, idx) => (
                        <div 
                          key={idx}
                          className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 text-xs font-mono-numbers ${
                            isWhiteYellow ? 'bg-zinc-50/80 border-zinc-200/90' : 'bg-zinc-950 border-zinc-850'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img src={car.avatarUrl} alt={car.vehicleName} className={`w-8 h-8 rounded-lg object-cover border shrink-0 ${isWhiteYellow ? 'border-zinc-200' : 'border-white/10'}`} />
                            <div className="min-w-0">
                              <span className={`font-bold block truncate ${isWhiteYellow ? 'text-zinc-950' : 'text-white'}`}>{car.vehicleName} ({car.driver})</span>
                              <span className={`text-[10px] truncate ${isWhiteYellow ? 'text-zinc-500' : 'text-zinc-400'}`}>{car.model}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-[10px] shrink-0">
                            <span className={`px-2 py-0.5 rounded border ${isWhiteYellow ? 'bg-white text-zinc-700 border-zinc-200' : 'bg-zinc-900 text-zinc-300 border-zinc-800'}`}>
                              {car.tyresColdPsi}
                            </span>
                            <span className={`px-2 py-0.5 rounded border hidden sm:inline ${isWhiteYellow ? 'bg-white text-zinc-700 border-zinc-200' : 'bg-zinc-900 text-zinc-300 border-zinc-800'}`}>
                              {car.fuelGrade}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/20">
                              {car.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Check In Action Bar */}
                <div className={`pt-3 border-t flex items-center justify-between text-xs ${isWhiteYellow ? 'border-zinc-200' : 'border-zinc-850'}`}>
                  <span className={`text-[11px] font-mono-numbers flex items-center gap-1.5 ${isWhiteYellow ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>800m privacy geofence active</span>
                  </span>

                  <button
                    onClick={() => handleToggleConvoyCheckIn(convoy.id, convoy.convoyTitle)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono-numbers font-bold transition flex items-center gap-1.5 shadow-xs ${
                      isCheckedIn
                        ? isWhiteYellow
                          ? 'bg-zinc-100 text-yellow-950 border border-yellow-400/60 hover:bg-zinc-200'
                          : 'bg-zinc-800 text-amber-300 border border-amber-500/40 hover:bg-zinc-700'
                        : 'bg-yellow-400 text-zinc-950 hover:bg-yellow-300 font-bold border border-yellow-500'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isCheckedIn ? 'MAYA Checked In • Ready' : 'Check In Vehicle'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. SUBCULTURE GUILD COMPETITIONS & CHALLENGES             */}
      {/* ========================================================= */}
      <div className="space-y-4">
        <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b pb-3 ${
          isWhiteYellow ? 'border-zinc-200' : 'border-zinc-800'
        }`}>
          <div>
            <span className={`text-[11px] font-mono-numbers uppercase tracking-wider block font-bold ${
              isWhiteYellow ? 'text-yellow-600' : 'text-amber-400'
            }`}>
              PROOF-OF-WORK HONOUR ROLL
            </span>
            <h2 className={`text-xl sm:text-2xl font-bold font-luxury-display tracking-wide ${
              isWhiteYellow ? 'text-zinc-950' : 'text-white'
            }`}>
              The 2026 Paddock Challenges
            </h2>
          </div>
          <p className={`text-xs font-sans max-w-md ${
            isWhiteYellow ? 'text-zinc-600' : 'text-zinc-400'
          }`}>
            Earn stamped physical titanium grill badges and immutable cryptographic verification seals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {GUILD_CHALLENGES.map((ch) => (
            <div 
              key={ch.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between space-y-4 transition shadow-xs ${
                isWhiteYellow
                  ? 'bg-white border-zinc-200/90 text-zinc-900 hover:border-yellow-400/80 hover:shadow-md'
                  : 'bg-[#0F1014] border-zinc-800 text-white hover:border-amber-500/40 shadow-lg'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono-numbers font-bold border ${ch.accentClass}`}>
                    {ch.badge}
                  </span>
                  <span className={`text-[10px] font-mono-numbers ${isWhiteYellow ? 'text-zinc-400' : 'text-zinc-500'}`}>SEASON 2026</span>
                </div>

                <div>
                  <h3 className={`text-sm font-bold font-luxury-display ${isWhiteYellow ? 'text-zinc-950' : 'text-white'}`}>{ch.title}</h3>
                  <span className={`text-[11px] font-mono-numbers ${isWhiteYellow ? 'text-zinc-500' : 'text-zinc-400'}`}>{ch.guildName}</span>
                </div>

                <p className={`text-xs font-sans leading-relaxed ${isWhiteYellow ? 'text-zinc-700' : 'text-zinc-300'}`}>
                  {ch.objective}
                </p>

                <div className={`p-2.5 rounded-xl border text-xs font-mono-numbers space-y-1 ${
                  isWhiteYellow ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-950 border-zinc-850'
                }`}>
                  <span className="text-[10px] text-zinc-500 uppercase block">Current Leader:</span>
                  <span className={`font-bold text-[11px] block ${isWhiteYellow ? 'text-zinc-950' : 'text-white'}`}>{ch.currentLeader}</span>
                </div>
              </div>

              <div className={`pt-3 border-t space-y-2 ${isWhiteYellow ? 'border-zinc-200' : 'border-zinc-850'}`}>
                <div className={`flex items-center justify-between text-[10px] font-mono-numbers ${isWhiteYellow ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  <span>Award: {ch.reward}</span>
                  <span className="text-yellow-600 font-bold">{ch.progressPct}% Target</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-zinc-200 overflow-hidden">
                  <div className="h-full bg-yellow-400" style={{ width: `${ch.progressPct}%` }} />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => showToast({
                      title: `Telemetry Stamped: ${ch.title}`,
                      message: `MAYA telemetry submitted to ${ch.guildName}. Recorded on season leaderboard.`,
                      type: 'success',
                      badge: 'ENTERED'
                    })}
                    className={`px-3 py-1 rounded-lg border text-[10px] font-mono-numbers font-bold transition flex items-center gap-1.5 ${
                      isWhiteYellow
                        ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-950 border-yellow-300'
                        : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    <Award className="w-3 h-3 text-yellow-600" />
                    <span>Submit MAYA Telemetry</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. GUILD CATEGORY PILL SELECTOR                           */}
      {/* ========================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl transition-all whitespace-nowrap flex items-center gap-2 font-mono-numbers text-xs font-semibold ${
                isSelected
                  ? 'bg-yellow-400 text-zinc-950 shadow-sm font-bold border border-yellow-500'
                  : isWhiteYellow
                  ? 'bg-white text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 border border-zinc-200'
                  : 'bg-zinc-900/90 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
              <span className={`text-[10px] font-mono-numbers px-1.5 py-0.2 rounded-full ${
                isSelected 
                  ? 'bg-zinc-950 text-white' 
                  : isWhiteYellow 
                  ? 'bg-zinc-100 text-zinc-600' 
                  : 'bg-zinc-800 text-zinc-400'
              }`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* 5. GUILDS & CLUBS DIRECTORY GRID                          */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCommunities.map((comm) => {
          const isEnrolled = !!enrolledClubs[comm.id];
          return (
            <div
              key={comm.id}
              className={`posh-card rounded-3xl border overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-xs group ${
                isWhiteYellow
                  ? 'bg-white border-zinc-200/90 text-zinc-900 hover:border-yellow-400/80 hover:shadow-md'
                  : 'bg-[#0F1116] border-zinc-800 text-white hover:border-amber-500/30 shadow-xl'
              }`}
            >
              {/* Cover Banner */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={comm.coverImageUrl}
                  alt={comm.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className={`absolute inset-0 ${isWhiteYellow ? 'bg-gradient-to-t from-white via-white/30 to-transparent' : 'bg-gradient-to-t from-[#0F1116] via-[#0F1116]/40 to-transparent'}`} />
                
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono-numbers text-white font-bold shadow-lg">
                  <span>{comm.badgeEmoji}</span>
                  <span>{comm.subcategory}</span>
                </div>

                {isEnrolled && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 text-[10px] font-mono-numbers font-bold border border-emerald-500/40 backdrop-blur-md flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>MAYA INDUCTED</span>
                  </span>
                )}
              </div>

              {/* Club Content Card */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div>
                    <h3 className={`text-base font-bold font-luxury-display transition-colors leading-snug ${isWhiteYellow ? 'text-zinc-950 group-hover:text-yellow-600' : 'text-white group-hover:text-amber-300'}`}>
                      {comm.name}
                    </h3>
                    <p className={`text-xs leading-relaxed font-sans mt-1 ${isWhiteYellow ? 'text-zinc-600' : 'text-zinc-400'}`}>
                      {comm.description}
                    </p>
                  </div>

                  {/* Benchmark spec badge */}
                  {comm.featuredSpec && (
                    <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-mono-numbers ${isWhiteYellow ? 'bg-zinc-50 border-zinc-200 text-zinc-900' : 'bg-zinc-950/80 border-zinc-850 text-white'}`}>
                      <span className="text-[10px] text-zinc-500 uppercase">Benchmark Spec:</span>
                      <span className={`font-bold text-[11px] truncate max-w-[200px] ${isWhiteYellow ? 'text-zinc-950' : 'text-white'}`}>{comm.featuredSpec}</span>
                    </div>
                  )}

                  {/* Top Vehicles Avatar Strip */}
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex -space-x-2">
                      {comm.topVehicles.map((car, i) => (
                        <img
                          key={i}
                          src={car.imageUrl}
                          alt={car.name}
                          className={`w-7 h-7 rounded-full object-cover border-2 ${isWhiteYellow ? 'border-white' : 'border-[#0F1116]'}`}
                          title={`${car.name} (${car.model})`}
                        />
                      ))}
                    </div>
                    <span className={`text-[11px] font-mono-numbers ${isWhiteYellow ? 'text-zinc-500' : 'text-zinc-400'}`}>
                      {comm.activeCarsCount.toLocaleString()} sovereign cars
                    </span>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className={`pt-3 border-t flex items-center justify-between gap-2 ${isWhiteYellow ? 'border-zinc-200' : 'border-zinc-850'}`}>
                  <button
                    onClick={() => setActiveClub(comm)}
                    className={`text-xs font-mono-numbers transition flex items-center gap-1 ${
                      isWhiteYellow ? 'text-zinc-600 hover:text-zinc-950 font-medium' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>View Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleToggleEnroll(comm.id, comm.name)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono-numbers font-bold transition border ${
                      isEnrolled
                        ? isWhiteYellow
                          ? 'bg-zinc-100 text-rose-700 border-zinc-200 hover:bg-zinc-200'
                          : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:text-red-300'
                        : 'bg-yellow-400 text-zinc-950 border-yellow-500 hover:bg-yellow-300 shadow-xs'
                    }`}
                  >
                    {isEnrolled ? 'Enrolled' : 'Induct Car'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* 6. GUILD DOSSIER MODAL                                    */}
      {/* ========================================================= */}
      {activeClub && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className={`border rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative my-auto animate-in fade-in duration-200 ${
            isWhiteYellow
              ? 'bg-white border-zinc-200 text-zinc-900'
              : 'bg-[#0B0C0E] border-amber-500/30 text-white'
          }`}>
            
            <div className={`flex justify-between items-start border-b pb-4 ${isWhiteYellow ? 'border-zinc-200' : 'border-zinc-800'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-xl ${
                  isWhiteYellow ? 'bg-yellow-50 border-yellow-200' : 'bg-zinc-900 border-zinc-700'
                }`}>
                  {activeClub.badgeEmoji}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className={`text-base font-bold font-luxury-display ${isWhiteYellow ? 'text-zinc-950' : 'text-white'}`}>{activeClub.name}</h2>
                    <span className={`text-[10px] font-mono-numbers px-2 py-0.5 rounded-full border ${
                      isWhiteYellow ? 'bg-zinc-100 text-zinc-700 border-zinc-200' : 'bg-white/10 text-zinc-300 border-white/10'
                    }`}>
                      {activeClub.subcategory}
                    </span>
                  </div>
                  <p className={`text-xs font-mono-numbers mt-0.5 ${isWhiteYellow ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    {activeClub.activeCarsCount.toLocaleString()} Sovereign Vehicles Inducted
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveClub(null)}
                className={`p-1.5 rounded-xl transition ${
                  isWhiteYellow ? 'text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className={`text-xs sm:text-sm leading-relaxed font-sans ${isWhiteYellow ? 'text-zinc-700' : 'text-zinc-300'}`}>
              {activeClub.description}
            </p>

            {/* Key Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className={`p-3.5 rounded-2xl border space-y-1 ${
                isWhiteYellow ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-950 border-zinc-800'
              }`}>
                <span className={`text-[10px] font-mono-numbers uppercase font-bold block ${isWhiteYellow ? 'text-sky-700' : 'text-cyan-400'}`}>
                  Paddock Benchmark Spec
                </span>
                <span className={`text-xs font-bold font-mono-numbers block ${isWhiteYellow ? 'text-zinc-950' : 'text-white'}`}>
                  {activeClub.featuredSpec || 'Peer-reviewed telemetry'}
                </span>
              </div>

              <div className={`p-3.5 rounded-2xl border space-y-1 ${
                isWhiteYellow ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-950 border-zinc-800'
              }`}>
                <span className={`text-[10px] font-mono-numbers uppercase font-bold block ${isWhiteYellow ? 'text-yellow-700' : 'text-amber-400'}`}>
                  Upcoming Convoy / Trackday
                </span>
                <span className={`text-xs font-bold font-mono-numbers block ${isWhiteYellow ? 'text-zinc-950' : 'text-white'}`}>
                  {activeClub.activeConvoyOrChallenge || 'Weekly Dawn Run'}
                </span>
              </div>
            </div>

            {/* Action Bar */}
            <div className={`flex items-center justify-between pt-3 border-t ${isWhiteYellow ? 'border-zinc-200' : 'border-zinc-800'}`}>
              <div className={`text-xs font-mono-numbers flex items-center gap-2 ${isWhiteYellow ? 'text-zinc-600' : 'text-zinc-400'}`}>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Induct as MAYA (BMW M3)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveClub(null)}
                  className={`px-4 py-2 rounded-xl border text-xs font-mono-numbers transition ${
                    isWhiteYellow ? 'border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50' : 'border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleToggleEnroll(activeClub.id, activeClub.name);
                    setActiveClub(null);
                  }}
                  className={`px-5 py-2 rounded-xl font-bold text-xs uppercase font-mono-numbers transition shadow-sm ${
                    enrolledClubs[activeClub.id]
                      ? isWhiteYellow
                        ? 'bg-zinc-100 text-rose-700 border border-zinc-300'
                        : 'bg-zinc-800 text-red-400 border border-red-500/40'
                      : 'bg-yellow-400 text-zinc-950 hover:bg-yellow-300 border border-yellow-500'
                  }`}
                >
                  {enrolledClubs[activeClub.id] ? 'Withdraw Vehicle' : 'Induct Maya Into Guild'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
