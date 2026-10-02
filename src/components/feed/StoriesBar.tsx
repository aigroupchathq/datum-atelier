import { useState } from 'react';
import type { FC } from 'react';
import { Plus } from 'lucide-react';
import { StoryViewerModal } from './StoryViewerModal';
import type { StoryItem } from './StoryViewerModal';
import { useTheme } from '../../context/ThemeContext';

interface StoriesBarProps {
  onAddStory: () => void;
}

export const StoriesBar: FC<StoriesBarProps> = ({ onAddStory }) => {
  const { isWhiteYellow } = useTheme();
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  const storiesData: StoryItem[] = [
    {
      id: 'story-nova',
      authorName: 'Callum',
      authorHandle: 'c20_k77_nova',
      authorModel: 'Nova Turbo (K77 NVA)',
      avatarUrl: '/feed/nova_turbo_arden_k77_nva.jpg',
      storyMediaUrl: '/feed/nova_turbo_arden_k77_nva.jpg',
      timeAgo: '20m',
      caption: 'K77 NVA: 6 years of cold lockup wrenching rewarded. C20LET turbo swap dialled in at 1.4 bar on the paddock.',
      location: 'National Heritage Meet • Paddock Stand #4',
      telemetry: '315 BHP @ 890kg • 1.4 Bar Boost • C20LET'
    },
    {
      id: 'story-messerschmitt',
      authorName: 'Toby',
      authorHandle: 'bubblecar_odyssey',
      authorModel: '1954 Messerschmitt KR200',
      avatarUrl: '/feed/messerschmitt_kr200_bubblecar.jpg',
      storyMediaUrl: '/feed/messerschmitt_kr200_bubblecar.jpg',
      timeAgo: '35m',
      caption: 'Canopy open, Sachs 200 buzzing over the wet cobblestones. Pure unfiltered joy behind handlebar steering!',
      location: 'Historic Old Town • Wet Cobblestones',
      telemetry: '191cc Sachs 2-Stroke • 230kg • Canopy Open'
    },
    {
      id: 'story-speedhunters',
      authorName: 'Marcus',
      authorHandle: 'timeattack_van',
      authorModel: 'Widebody Zafira A',
      avatarUrl: '/feed/widebody_zafira_speedhunters_aero.jpg',
      storyMediaUrl: '/feed/widebody_zafira_speedhunters_aero.jpg',
      timeAgo: '50m',
      caption: 'Dawn shakedown on the new track width. Splitter tie-rods and canards gave absurd front-end turn-in bite!',
      location: 'Peak District Lanes • Derbyshire',
      telemetry: '410 BHP GTX2867R • +120mm Track • AP Brakes'
    },
    {
      id: 'story-splitty',
      authorName: 'Arthur',
      authorHandle: 'aircooled_doka_69',
      authorModel: '1968 VW Single-Cab Pick-Up',
      avatarUrl: '/feed/vw_splitty_singlecab_ubd_214g.jpg',
      storyMediaUrl: '/feed/vw_splitty_singlecab_ubd_214g.jpg',
      timeAgo: '1h',
      caption: '55 years young. Teak drop-sides restored with marine oil, safari screens open cruising at 52 mph.',
      location: 'Shuttleworth Aerodrome • Airfield',
      telemetry: '1600cc Flat-4 • Safari Screens • Teak Bed'
    },
    {
      id: 'story-buggy',
      authorName: 'Trevor',
      authorHandle: 'volt_and_valley',
      authorModel: 'Electric Beach Buggy (BPO 684W)',
      avatarUrl: '/feed/green_energy_electric_buggy_bpo_684w.jpg',
      storyMediaUrl: '/feed/green_energy_electric_buggy_bpo_684w.jpg',
      timeAgo: '1h',
      caption: 'Built not bought: instant 220 Nm torque at 0 RPM in a 650kg tubular frame. The future of grassroots wrenching!',
      location: 'Kit Car Festival • Paddock',
      telemetry: 'Hyper 9 Motor • 32 kWh • 220 Nm @ 0 RPM'
    },
    {
      id: 'story-cobra',
      authorName: 'Julian Vane',
      authorHandle: 'julian_vane',
      authorModel: '427 Cobra & 488 GTB',
      avatarUrl: '/feed/stone_garage_cobra_ferrari.jpg',
      storyMediaUrl: '/feed/stone_garage_cobra_ferrari.jpg',
      timeAgo: '45m',
      caption: 'Open bay doors: letting 15-year-old Toby from down the lane sit behind the wheel and fire up the 427 side-oiler!',
      location: 'Chilterns Estate • Buckinghamshire',
      telemetry: '7.0L V8 • Twin Holleys • Open Doors'
    },
    {
      id: 'story-workshop',
      authorName: 'Hamish',
      authorHandle: 'hamish_heritage',
      authorModel: 'Heritage Engine Bench',
      avatarUrl: '/feed/heritage_wrenching_workshop.jpg',
      storyMediaUrl: '/feed/heritage_wrenching_workshop.jpg',
      timeAgo: '2h',
      caption: 'Saturday apprentice bench: teaching young Alex how to measure crank journal oil clearances on his grandfather\'s M10 block.',
      location: 'Highland Workshop • Cairngorms',
      telemetry: '0.0018" Oil Clearance • Plastigauge'
    },
    {
      id: 'story-collective',
      authorName: 'Collective',
      authorHandle: 'midlands_sanctuary',
      authorModel: 'Shared Collector Hall',
      avatarUrl: '/feed/collective_atelier_hall.jpg',
      storyMediaUrl: '/feed/collective_atelier_hall.jpg',
      timeAgo: '4h',
      caption: '24 independent owners, 1 shared sanctuary. Lifts open, coffee brewing, helping each other bleed brakes for Sunday.',
      location: 'Aviation Hall • Midlands',
      telemetry: 'Shared Lifts • 24 Custodians'
    },
    {
      id: 'story-overland',
      authorName: 'Expeditions',
      authorHandle: 'cairngorm_crew',
      authorModel: 'Highland Overland Guild',
      avatarUrl: '/feed/snow_mountain_overland_convoy.jpg',
      storyMediaUrl: '/feed/snow_mountain_overland_convoy.jpg',
      timeAgo: '6h',
      caption: 'Sub-zero trailside repair in the Cairnwell whiteout. Headlights turned around, zero rigs left behind on the mountain.',
      location: 'Cairnwell Pass • 2,198 ft',
      telemetry: 'Sub-Zero Trailside • -5°C Blizzard'
    },
    {
      id: 'story-maya',
      authorName: 'MAYA',
      authorHandle: 'maya_m3',
      authorModel: 'BMW M3 Competition (G80)',
      avatarUrl: '/real_uk_m3_cottage.jpg',
      storyMediaUrl: '/real_uk_m3_cottage.jpg',
      timeAgo: '7h',
      caption: 'Dawn run departure outside Cotswolds cottage. Damp bitumen, S58 twin-turbos spooling with zero pace drop!',
      location: 'Chipping Campden • Cotswolds',
      telemetry: '510 BHP • 1,688 ft Elevation • 0.92G Apex'
    },
    {
      id: 'story-kuro',
      authorName: 'KURO',
      authorHandle: 'kuro_gt3',
      authorModel: 'Porsche 911 GT3 (992)',
      avatarUrl: '/real_uk_gt3_suburb.jpg',
      storyMediaUrl: '/real_uk_gt3_suburb.jpg',
      timeAgo: '8h',
      caption: 'Suburban driveway 06:15 AM cold start. Respecting the neighborhood: exhaust valves locked closed until open roads.',
      location: 'Harpenden • Hertfordshire',
      telemetry: '502 BHP @ 8,400 RPM • 470 Nm Torque'
    },
    {
      id: 'story-e30',
      authorName: 'RETRO MOD',
      authorHandle: 'retromod_dan',
      authorModel: 'BMW 318is (E30) Slicktop',
      avatarUrl: '/real_uk_e30_terrace.jpg',
      storyMediaUrl: '/real_uk_e30_terrace.jpg',
      timeAgo: '10h',
      caption: 'Victorian terraced bay parking. 1989 slicktop analog survivor with period BBS 15" basketweaves.',
      location: 'Clifton • Bristol',
      telemetry: '1989 Analog • 1,120 kg • M42 Twin-Cam'
    },
    {
      id: 'story-defender',
      authorName: 'EXPEDITION',
      authorHandle: 'expedition_110',
      authorModel: 'Defender 110 P400 SE',
      avatarUrl: '/real_uk_defender_farm.jpg',
      storyMediaUrl: '/real_uk_defender_farm.jpg',
      timeAgo: '12h',
      caption: 'Yorkshire Dales parish trail maintenance: clearing fallen branches and unblocking stone culverts for local farmers.',
      location: 'Swaledale • Yorkshire Dales',
      telemetry: '900mm Wading Active • 18 PSI'
    },
    {
      id: 'story-wash',
      authorName: 'Atelier Detailing',
      authorHandle: 'decon_detail',
      authorModel: 'Sunday Morning Routine',
      avatarUrl: '/real_uk_driveway_wash.jpg',
      storyMediaUrl: '/real_uk_driveway_wash.jpg',
      timeAgo: '14h',
      caption: 'Sunday 07:00 AM snow-foam pre-wash outside suburban semi. Two-bucket method with grit guards.',
      location: 'Private Driveway • Surrey',
      telemetry: 'Bilt-Hamber Alkaline Decon • pH Neutral'
    }
  ];
  return (
    <>
      {/* ── PADDOCK DISPATCHES: HAUTE-HORLOGERIE 16:9 CHRONOGRAPH RAIL ── */}
      <div className={`p-3.5 sm:p-4 overflow-hidden rounded-[24px] border transition-all ${
        isWhiteYellow
          ? 'bg-white border-zinc-200/90 shadow-sm'
          : 'bg-[#0B0C10] border-white/[0.08] shadow-md'
      }`}>
        
        {/* Header row */}
        <div className="flex items-center justify-between pb-2.5 px-1 border-b border-white/[0.05] mb-3 text-xs font-mono-numbers">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            <span className="text-[10px] tracking-widest uppercase font-bold text-zinc-300">
              PADDOCK TELEMETRY DISPATCHES
            </span>
          </div>
          <span className="text-[10px] text-zinc-500 tracking-wider">
            {storiesData.length} ACTIVE SHIFTS
          </span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-0.5">

          {/* ── CARD 0: RECORD SHIFT DISPATCH (USER ACTION) ── */}
          <button
            onClick={onAddStory}
            className={`w-[132px] sm:w-[144px] h-[92px] rounded-2xl shrink-0 p-2.5 flex flex-col justify-between border border-dashed transition-all duration-300 group cursor-pointer text-left relative overflow-hidden ${
              isWhiteYellow
                ? 'bg-[#FAF9F6] hover:bg-yellow-50/70 border-[#D4AF37]/50 text-stone-900 bevel-porcelain'
                : 'bg-white/[0.02] hover:bg-[#C5A059]/[0.08] border-white/15 hover:border-[#C5A059]/50 text-white bevel-machined'
            }`}
            title="Log today's cold start or shakedown dispatch"
          >
            <div className="flex items-center justify-between">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 ${
                isWhiteYellow ? 'bg-[#D4AF37] text-black shadow-xs' : 'bg-[#C5A059] text-black shadow-[0_0_12px_rgba(197,160,89,0.4)]'
              }`}>
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span className="text-[8.5px] font-mono-numbers tracking-widest uppercase text-[#C5A059] font-bold">
                DISPATCH
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold block truncate leading-tight tracking-tight">
                Record Shift
              </span>
              <span className={`text-[9px] font-mono-numbers block truncate mt-0.5 ${
                isWhiteYellow ? 'text-stone-500' : 'text-zinc-500'
              }`}>
                MAYA · S58 G80
              </span>
            </div>
          </button>

          {/* ── 16:9 PANORAMIC CAR DISPATCHES ── */}
          {storiesData.map((story, idx) => (
            <button
              key={story.id}
              onClick={() => setActiveStoryIndex(idx)}
              className={`w-[132px] sm:w-[144px] h-[92px] rounded-2xl shrink-0 relative overflow-hidden group cursor-pointer border transition-all duration-300 text-left focus:outline-none ${
                isWhiteYellow
                  ? 'border-stone-200/90 hover:border-[#D4AF37]/80 bevel-porcelain'
                  : 'border-white/[0.09] hover:border-[#C5A059]/60 bevel-machined hover:shadow-[0_0_16px_rgba(197,160,89,0.20)]'
              }`}
            >
              {/* Cinematic Backdrop Image */}
              <img
                src={story.storyMediaUrl || story.avatarUrl}
                alt={story.authorName}
                className="w-full h-full object-cover brightness-[0.65] group-hover:brightness-[0.85] group-hover:scale-105 transition-all duration-500"
              />

              {/* Protective Dark Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

              {/* Top Meta: TimeAgo & Active Strobe */}
              <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-[8px] font-mono-numbers z-10">
                <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-zinc-300">
                  {story.timeAgo}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_6px_rgba(251,191,36,0.9)]" />
              </div>

              {/* Bottom Inset: Vehicle Name & Live Telemetry Stamp */}
              <div className="absolute bottom-2 left-2 right-2 z-10 space-y-0.5">
                <span className="text-[11px] font-bold text-white block truncate tracking-tight leading-none drop-shadow-sm group-hover:text-amber-200 transition-colors">
                  {story.authorName}
                </span>
                <span className="text-[8px] font-mono-numbers text-amber-300/90 block truncate tracking-wider">
                  {story.telemetry?.split('•')[0] || story.authorModel}
                </span>
              </div>
            </button>
          ))}

        </div>
      </div>

      {activeStoryIndex !== null && (
        <StoryViewerModal
          isOpen={activeStoryIndex !== null}
          activeStoryIndex={activeStoryIndex}
          stories={storiesData}
          onClose={() => setActiveStoryIndex(null)}
          onSelectStory={(index) => setActiveStoryIndex(index)}
        />
      )}
    </>
  );
};
