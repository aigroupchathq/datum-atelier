import { useState } from 'react';
import type { FC } from 'react';
import { Plus } from 'lucide-react';
import { mockMayaVehicle } from '../../data/mockData';
import { StoryViewerModal } from './StoryViewerModal';
import type { StoryItem } from './StoryViewerModal';
import { useTheme } from '../../context/ThemeContext';

interface StoriesBarProps {
  onAddStory: () => void;
}

const RING_CLASS: Record<string, string> = {
  'story-cobra':      'ring-kuro',
  'story-workshop':   'ring-community',
  'story-collective': 'ring-maya',
  'story-overland':   'ring-community',
  'story-maya':       'ring-maya',
  'story-kuro':       'ring-kuro',
  'story-e30':        'ring-community',
  'story-defender':   'ring-community',
  'story-wash':       'ring-maya',
};

export const StoriesBar: FC<StoriesBarProps> = ({ onAddStory }) => {
  const { isWhiteYellow } = useTheme();
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  const storiesData: StoryItem[] = [
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
      location: 'Driveway Enclave • Surrey',
      telemetry: 'Bilt-Hamber Alkaline Decon • pH Neutral'
    }
  ];

  return (
    <>
      {/* Stories rail — sleek atelier salon gallery */}
      <div className={`px-4 sm:px-5 py-4 overflow-hidden rounded-[26px] border transition-colors ${
        isWhiteYellow
          ? 'bg-white border-zinc-200/90 shadow-xs'
          : 'card-surface'
      }`}>
        <div className="flex items-center gap-4 sm:gap-5 overflow-x-auto no-scrollbar">

          {/* ── YOUR STORY ── */}
          <button
            onClick={onAddStory}
            className="flex flex-col items-center gap-2 shrink-0 group focus:outline-none"
          >
            <div className="relative">
              {/* Dashed / subtle ring */}
              <div className="w-[64px] h-[64px] rounded-full ring-unseen p-[2px] group-hover:scale-[1.04] transition-all duration-300">
                <div className={`w-full h-full rounded-full p-[2px] ${isWhiteYellow ? 'bg-white' : 'bg-[#09090B]'}`}>
                  <img
                    src={mockMayaVehicle.heroImageUrl}
                    alt="Your Car"
                    className="w-full h-full rounded-full object-cover brightness-85 group-hover:brightness-100 transition-all duration-300"
                  />
                </div>
              </div>
              {/* Plus badge — Racing Yellow / amber medallion */}
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 shadow-md bg-gradient-to-tr from-yellow-500 to-amber-400 ${
                  isWhiteYellow ? 'border-white' : 'border-[#09090B]'
                }`}
              >
                <Plus className="w-3 h-3 text-zinc-950 stroke-[3]" />
              </div>
            </div>
            <span className={`text-[11.5px] font-semibold transition-colors tracking-tight ${
              isWhiteYellow ? 'text-zinc-600 group-hover:text-zinc-950' : 'text-zinc-400 group-hover:text-zinc-200'
            }`}>
              Your Story
            </span>
          </button>

          {/* Hairline divider */}
          <div className={`w-px h-10 shrink-0 ${isWhiteYellow ? 'bg-zinc-200' : 'bg-white/[0.07]'}`} />

          {/* ── CAR STORIES ── */}
          {storiesData.map((story, idx) => (
            <button
              key={story.id}
              onClick={() => setActiveStoryIndex(idx)}
              className="flex flex-col items-center gap-2 shrink-0 group focus:outline-none"
            >
              <div className="relative">
                <div
                  className={`w-[64px] h-[64px] rounded-full p-[2px] group-hover:scale-[1.04] transition-all duration-300 ${RING_CLASS[story.id] || 'ring-unseen'}`}
                >
                  <div className={`w-full h-full rounded-full p-[2px] ${isWhiteYellow ? 'bg-white' : 'bg-[#09090B]'}`}>
                    <img
                      src={story.avatarUrl}
                      alt={story.authorName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="text-center w-[64px]">
                <span className={`text-[11.5px] font-semibold truncate block transition-colors tracking-tight ${
                  isWhiteYellow ? 'text-zinc-900 group-hover:text-yellow-600' : 'text-zinc-300 group-hover:text-amber-200'
                }`}>
                  {story.authorName}
                </span>
                <span className={`text-[9.5px] truncate block font-mono-numbers mt-0.5 ${
                  isWhiteYellow ? 'text-zinc-500' : 'text-zinc-500'
                }`}>
                  {story.timeAgo}
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
