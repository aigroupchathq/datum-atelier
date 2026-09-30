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
  'story-maya':     'ring-maya',
  'story-kuro':     'ring-kuro',
  'story-e30':      'ring-community',
  'story-defender': 'ring-community',
  'story-wash':     'ring-maya',
  'story-evolve':   'ring-community',
};

export const StoriesBar: FC<StoriesBarProps> = ({ onAddStory }) => {
  const { isWhiteYellow } = useTheme();
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  const storiesData: StoryItem[] = [
    {
      id: 'story-maya',
      authorName: 'MAYA',
      authorHandle: 'maya_m3',
      authorModel: 'BMW M3 Competition (G80)',
      avatarUrl: '/real_uk_m3_cottage.jpg',
      storyMediaUrl: '/real_uk_m3_cottage.jpg',
      timeAgo: '1h',
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
      timeAgo: '3h',
      caption: 'British suburban block driveway 07:00 AM cold start. 4.0L naturally aspirated flat-six 9,000 RPM idle warm-up.',
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
      timeAgo: '5h',
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
      timeAgo: '7h',
      caption: 'Yorkshire Dales rustic stone barn estate. BFGoodrich KO2s aired down after Swaledale green laning.',
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
      timeAgo: '9h',
      caption: 'Sunday 07:00 AM snow-foam pre-wash outside suburban semi. Two-bucket method with grit guards.',
      location: 'Driveway Enclave • Surrey',
      telemetry: 'Bilt-Hamber Alkaline Decon • pH Neutral'
    },
    {
      id: 'story-evolve',
      authorName: 'Evolve',
      authorHandle: 'evolve_automotive',
      authorModel: 'Verified BMW Specialist',
      avatarUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=200&q=80',
      storyMediaUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
      timeAgo: '12h',
      caption: 'Maha LPS 3000 hub-dyno session. S58 dual-pass chargecooler holding IAT at 34°C under full boost.',
      location: 'Evolve HQ • Luton Dyno Cell',
      telemetry: 'Maha Cell 1 • +38 WHP Dyno Proven'
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
