import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { FeedPage } from './pages/FeedPage';
import { CarProfilePage } from './pages/CarProfilePage';
import { DriveDetailPage } from './pages/DriveDetailPage';
import { ExplorePage } from './pages/ExplorePage';
import { CommunitiesPage } from './pages/CommunitiesPage';
import { GarageProPage } from './pages/GarageProPage';
import { AboutCaseStudyPage } from './pages/AboutCaseStudyPage';
import { CreatePostModal } from './components/feed/CreatePostModal';
import { PrivacyCheckModal } from './components/common/PrivacyCheckModal';
import { AcousticStudioModal } from './components/common/AcousticStudioModal';
import { PassGripRadarModal } from './components/telemetry/PassGripRadarModal';
import { TransitCarnetModal } from './components/logistics/TransitCarnetModal';
import { SplashScreen } from './components/common/SplashScreen';
import { BackendInspectorModal } from './components/system/BackendInspectorModal';
import { ToastProvider, useToast } from './context/ToastContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { mockFeedPosts } from './data/mockData';
import type { CommunityPost } from './types';

function AppContent() {
  const { showToast } = useToast();
  const { isWhiteYellow } = useTheme();
  const [posts, setPosts] = useState<CommunityPost[]>(mockFeedPosts);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState<boolean>(false);
  const [createPostMode, setCreatePostMode] = useState<'post' | 'story'>('post');
  const [isPrivacyCheckOpen, setIsPrivacyCheckOpen] = useState<boolean>(false);
  const [isAcousticStudioOpen, setIsAcousticStudioOpen] = useState<boolean>(false);
  const [isPassRadarOpen, setIsPassRadarOpen] = useState<boolean>(false);
  const [passRadarTarget, setPassRadarTarget] = useState<string>('snake-pass-a57');
  const [isTransitCarnetOpen, setIsTransitCarnetOpen] = useState<boolean>(false);
  const [isBackendInspectorOpen, setIsBackendInspectorOpen] = useState<boolean>(false);
  // Splash screen state: checks localStorage skip setting
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    return localStorage.getItem('garage_splash_skip') !== 'true';
  });

  const handleOpenCreatePost = (mode: 'post' | 'story' = 'post') => {
    setCreatePostMode(mode);
    setIsCreatePostOpen(true);
  };

  const handleNewPost = (newPostData: Partial<CommunityPost>) => {
    const createdPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorType: 'car',
      authorVehicleId: 'car-maya-m3',
      authorVehicleName: 'MAYA',
      authorVehicleModel: 'BMW M3 Competition',
      authorVehicleYear: 2023,
      postType: newPostData.postType || 'CAR_STORY',
      title: newPostData.title || (newPostData.postType === 'DRIVE' ? 'Snake Pass Morning Shakedown' : 'S58 Setup Notes'),
      content: newPostData.content || 'Tested tire pressures and damping rebound over damp tarmac. Zero drop in pace.',
      mediaUrls: newPostData.mediaUrls && newPostData.mediaUrls.length > 0 
        ? newPostData.mediaUrls 
        : ['https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=90'],
      provenanceTag: 'owner_experience',
      createdAt: 'Just now',
      likesCount: 1,
      repliesCount: 0,
      linkedDriveId: newPostData.postType === 'DRIVE' ? 'drive-184' : undefined,
      linkedBuildVersion: newPostData.postType === 'BUILD_UPDATE' ? 'BUILD 04' : undefined,
    };

    setPosts((prev) => [createdPost, ...prev]);
    setIsCreatePostOpen(false);

    showToast({
      title: 'Recorded to MAYA\'s Digital Ledger',
      message: 'Published with Privacy Veil active • Plates cloaked & 800m geofenced',
      type: 'privacy',
      badge: 'LIVE'
    });
  };

  return (
    <BrowserRouter>
      {/* Customizable Cinematic Splash Screen on Launch or on Demand */}
      {showSplash && (
        <SplashScreen
          onEnter={() => setShowSplash(false)}
          carName="MAYA"
          carModel="BMW M3 Competition"
        />
      )}

      <div className={`min-h-screen flex flex-col pb-16 md:pb-0 transition-colors duration-200 ${
        isWhiteYellow 
          ? 'bg-[#F8F9FA] text-zinc-900 selection:bg-yellow-400 selection:text-zinc-950' 
          : 'bg-[#09090B] text-zinc-100 selection:bg-amber-400/25 selection:text-amber-200'
      }`}>
        
        {/* Editorial Top Navigation */}
        <Navbar
          onOpenCreatePost={handleOpenCreatePost}
          onOpenPrivacyCheck={() => setIsPrivacyCheckOpen(true)}
          onOpenSplashScreen={() => setShowSplash(true)}
          onOpenAcousticStudio={() => setIsAcousticStudioOpen(true)}
          onOpenPassRadar={() => { setPassRadarTarget('snake-pass-a57'); setIsPassRadarOpen(true); }}
          onOpenTransitCarnet={() => setIsTransitCarnetOpen(true)}
          onOpenBackendInspector={() => setIsBackendInspectorOpen(true)}
        />

        {/* Dynamic Route Viewport */}
        <main className="flex-1">
          <Routes>
            <Route 
              path="/" 
              element={
                <FeedPage 
                  onOpenCreatePost={handleOpenCreatePost} 
                  posts={posts} 
                  onOpenPassRadar={(id) => { if (id) setPassRadarTarget(id); setIsPassRadarOpen(true); }}
                />
              } 
            />
            <Route path="/car/:carId" element={<CarProfilePage />} />
            <Route path="/drive/:driveId" element={<DriveDetailPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/communities" element={<CommunitiesPage />} />
            <Route path="/pro" element={<GarageProPage />} />
            <Route path="/about" element={<AboutCaseStudyPage />} />
            <Route path="/case-study" element={<AboutCaseStudyPage />} />
          </Routes>
        </main>

        {/* Global Footer (Desktop) */}
        <footer className={`border-t px-4 lg:px-8 py-8 text-xs font-mono-numbers mt-12 hidden md:block transition-colors duration-200 ${
          isWhiteYellow 
            ? 'bg-white border-zinc-200 text-zinc-500 shadow-xs' 
            : 'border-white/[0.06] bg-[#09090B] text-zinc-500'
        }`}>
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className={`font-bold ${isWhiteYellow ? 'text-zinc-950 font-luxury-display' : 'text-zinc-300'}`}>DATUM ATELIER</span>
              <span>•</span>
              <Link to="/about" className={`font-bold transition ${isWhiteYellow ? 'text-yellow-700 hover:text-yellow-600' : 'text-amber-400 hover:text-amber-300'}`}>
                Case Study & Blueprint →
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowSplash(true)}
                className={`transition ${isWhiteYellow ? 'hover:text-yellow-600' : 'hover:text-amber-400'}`}
              >
                Replay Splash Intro
              </button>
              <span>•</span>
              <button
                onClick={() => setIsAcousticStudioOpen(true)}
                className={`transition ${isWhiteYellow ? 'hover:text-yellow-600' : 'hover:text-emerald-400'}`}
              >
                Acoustic Harmonics Studio
              </button>
              <span>•</span>
              <button
                onClick={() => { setPassRadarTarget('snake-pass-a57'); setIsPassRadarOpen(true); }}
                className={`transition ${isWhiteYellow ? 'hover:text-yellow-600' : 'hover:text-cyan-400'}`}
              >
                Pass Surface Grip Radar
              </button>
              <span>•</span>
              <button
                onClick={() => setIsTransitCarnetOpen(true)}
                className={`transition ${isWhiteYellow ? 'hover:text-yellow-600' : 'hover:text-amber-400'}`}
              >
                ATA Carnet Transit
              </button>
              <span>•</span>
              <Link to="/about" className={`transition ${isWhiteYellow ? 'hover:text-yellow-600' : 'hover:text-amber-400'}`}>
                About
              </Link>
            </div>
          </div>
        </footer>

        {/* Mobile Simplified Navigation Bar */}
        <MobileNav />

        {/* Modal: Interactive Story / Post Recording with Animated Plate Detection */}
        <CreatePostModal
          isOpen={isCreatePostOpen}
          initialMode={createPostMode}
          onClose={() => setIsCreatePostOpen(false)}
          onSubmitPost={handleNewPost}
        />

        {/* Modal: Pre-Publish Privacy Checklist */}
        <PrivacyCheckModal
          isOpen={isPrivacyCheckOpen}
          onClose={() => setIsPrivacyCheckOpen(false)}
        />

        {/* Modal: Bespoke Valvetrain Acoustic Harmonics Lab */}
        <AcousticStudioModal
          isOpen={isAcousticStudioOpen}
          onClose={() => setIsAcousticStudioOpen(false)}
        />

        {/* Modal: Live Mountain Pass Surface Grip & Micro-Climate Radar */}
        <PassGripRadarModal
          isOpen={isPassRadarOpen}
          onClose={() => setIsPassRadarOpen(false)}
          initialPassId={passRadarTarget}
        />

        {/* Modal: Phase 9 Cross-Border Transit & Carnet Logistics Enclave */}
        <TransitCarnetModal
          isOpen={isTransitCarnetOpen}
          onClose={() => setIsTransitCarnetOpen(false)}
        />

        {/* Modal: Live Backend Systems Inspector & Control Room */}
        <BackendInspectorModal
          isOpen={isBackendInspectorOpen}
          onClose={() => setIsBackendInspectorOpen(false)}
        />

      </div>
    </BrowserRouter>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
