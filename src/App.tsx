import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { FeedPage } from './pages/FeedPage';
import { CarProfilePage } from './pages/CarProfilePage';
import { DriveDetailPage } from './pages/DriveDetailPage';
import { ExplorePage } from './pages/ExplorePage';
import { CommunitiesPage } from './pages/CommunitiesPage';
import { GarageProPage } from './pages/GarageProPage';
import { AboutCaseStudyPage } from './pages/AboutCaseStudyPage';
import { CreatePostModal, type InitialDriveData } from './components/feed/CreatePostModal';
import { ActiveDriveTrackerModal } from './components/telemetry/ActiveDriveTrackerModal';
import { PrivacyCheckModal } from './components/common/PrivacyCheckModal';
import { AcousticStudioModal } from './components/common/AcousticStudioModal';
import { PassGripRadarModal } from './components/telemetry/PassGripRadarModal';
import { TransitCarnetModal } from './components/logistics/TransitCarnetModal';
import { SplashScreen } from './components/common/SplashScreen';
import { BackendInspectorModal } from './components/system/BackendInspectorModal';
import { ArchitecturalChamberModal } from './components/atelier/ArchitecturalChamberModal';
import { WorkshopStampingModal } from './components/workshop/WorkshopStampingModal';
import { ToastProvider, useToast } from './context/ToastContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { mockFeedPosts } from './data/mockData';
import type { CommunityPost } from './types';

function AppContent() {
  const { showToast } = useToast();
  const { isWhiteYellow } = useTheme();
  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    try {
      const saved = localStorage.getItem('datum_ledger_posts');
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return mockFeedPosts;
  });
  const [isCreatePostOpen, setIsCreatePostOpen] = useState<boolean>(false);
  const [createPostMode, setCreatePostMode] = useState<'post' | 'story'>('post');
  const [isDriveTrackerOpen, setIsDriveTrackerOpen] = useState<boolean>(false);
  const [initialDriveData, setInitialDriveData] = useState<InitialDriveData | null>(null);
  const [isPrivacyCheckOpen, setIsPrivacyCheckOpen] = useState<boolean>(false);
  const [isAcousticStudioOpen, setIsAcousticStudioOpen] = useState<boolean>(false);
  const [isPassRadarOpen, setIsPassRadarOpen] = useState<boolean>(false);
  const [passRadarTarget, setPassRadarTarget] = useState<string>('snake-pass-a57');
  const [isTransitCarnetOpen, setIsTransitCarnetOpen] = useState<boolean>(false);
  const [isBackendInspectorOpen, setIsBackendInspectorOpen] = useState<boolean>(false);
  const [isArchitecturalChamberOpen, setIsArchitecturalChamberOpen] = useState<boolean>(false);
  const [isWorkshopStampingOpen, setIsWorkshopStampingOpen] = useState<boolean>(false);
  // Splash screen state: checks localStorage skip setting or nosplash query param
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('nosplash')) return false;
    return localStorage.getItem('garage_splash_skip') !== 'true';
  });

  const handleOpenCreatePost = (mode: 'post' | 'story' = 'post') => {
    setCreatePostMode(mode);
    setIsCreatePostOpen(true);
  };

  const handleOpenDriveTracker = () => {
    setIsDriveTrackerOpen(true);
  };

  const handleCompleteDriveSession = (driveData: any) => {
    setInitialDriveData({
      title: driveData.title,
      caption: driveData.caption,
      passName: driveData.passName,
      durationMinutes: driveData.durationMinutes,
      cadenceResult: driveData.cadenceResult,
      waypoints: driveData.waypoints,
      carId: driveData.carId,
      carName: driveData.carName,
      carModel: driveData.carModel,
      frictionMu: driveData.frictionMu
    });
    setCreatePostMode('post');
    setIsCreatePostOpen(true);
  };

  const handleNewPost = (newPostData: Partial<CommunityPost>) => {
    const vehicleName = newPostData.authorVehicleName || 'MAYA';
    const vehicleModel = newPostData.authorVehicleModel || 'BMW M3 Competition';
    const vehicleId = newPostData.authorVehicleId || 'car-maya-m3';
    const vehicleYear = newPostData.authorVehicleYear || 2023;

    const createdPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorType: 'car',
      authorVehicleId: vehicleId,
      authorVehicleName: vehicleName,
      authorVehicleModel: vehicleModel,
      authorVehicleYear: vehicleYear,
      postType: newPostData.postType || 'CAR_STORY',
      title: newPostData.title || (newPostData.postType === 'DRIVE' ? 'Mountain Pass Shakedown' : `${vehicleModel} Journal`),
      content: newPostData.content || 'Tested tire pressures and damping rebound over damp tarmac. Zero drop in pace.',
      mediaUrls: newPostData.mediaUrls && newPostData.mediaUrls.length > 0 
        ? newPostData.mediaUrls 
        : ['https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=90'],
      provenanceTag: newPostData.provenanceTag || 'owner_experience',
      createdAt: 'Just now',
      likesCount: 1,
      repliesCount: 0,
      cadenceRank: newPostData.cadenceRank,
      cadenceScore: newPostData.cadenceScore,
      respectsEarned: newPostData.respectsEarned,
      routePassName: newPostData.routePassName,
      linkedDriveId: newPostData.postType === 'DRIVE' ? 'drive-184' : undefined,
      linkedBuildVersion: newPostData.postType === 'BUILD_UPDATE' ? 'BUILD 04' : undefined,
    };

    setPosts((prev) => {
      const updated = [createdPost, ...prev];
      try {
        localStorage.setItem('datum_ledger_posts', JSON.stringify(updated));
      } catch { /* ignore */ }
      return updated;
    });

    setIsCreatePostOpen(false);

    showToast({
      title: `Recorded to ${vehicleName}'s Digital Ledger`,
      message: 'Published to the live feed with Privacy Veil active • Plates protected',
      type: 'privacy',
      badge: 'LIVE ON FEED'
    });
  };

  return (
    <BrowserRouter>
      {/* Customizable Cinematic Splash Screen on Launch or on Demand */}
      {showSplash && (
        <SplashScreen
          onEnter={() => {
            setShowSplash(false);
            try { localStorage.setItem('garage_splash_skip', 'true'); } catch { /* ignore */ }
          }}
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
          onOpenArchitecturalChamber={() => setIsArchitecturalChamberOpen(true)}
          onOpenWorkshopStamping={() => setIsWorkshopStampingOpen(true)}
        />

        {/* Dynamic Route Viewport */}
        <main className="flex-1">
          <Routes>
            <Route 
              path="/" 
              element={
                <FeedPage 
                  onOpenCreatePost={handleOpenCreatePost} 
                  onOpenDriveTracker={handleOpenDriveTracker}
                  posts={posts} 
                  onOpenPassRadar={(id) => { if (id) setPassRadarTarget(id); setIsPassRadarOpen(true); }}
                />
              } 
            />
            <Route path="/car/:carId" element={<CarProfilePage />} />
            <Route path="/car" element={<Navigate to="/car/car-maya-m3" replace />} />
            <Route path="/drive/:driveId" element={<DriveDetailPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/communities" element={<CommunitiesPage />} />
            <Route path="/pro" element={<GarageProPage />} />
            <Route path="/about" element={<AboutCaseStudyPage />} />
            <Route path="/case-study" element={<AboutCaseStudyPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
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
                onClick={() => setIsArchitecturalChamberOpen(true)}
                className={`transition ${isWhiteYellow ? 'hover:text-yellow-600' : 'hover:text-amber-400'}`}
              >
                Chamber Studio
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
        {isCreatePostOpen && (
          <CreatePostModal
            isOpen={isCreatePostOpen}
            initialMode={createPostMode}
            initialDriveData={initialDriveData}
            onClose={() => {
              setIsCreatePostOpen(false);
              setInitialDriveData(null);
            }}
            onSubmitPost={handleNewPost}
          />
        )}

        {/* Modal: Active In-Drive Expedition & Cadence Tracker */}
        {isDriveTrackerOpen && (
          <ActiveDriveTrackerModal
            isOpen={isDriveTrackerOpen}
            onClose={() => setIsDriveTrackerOpen(false)}
            onCompleteDrive={handleCompleteDriveSession}
          />
        )}

        {/* Modal: Pre-Publish Privacy Checklist */}
        {isPrivacyCheckOpen && (
          <PrivacyCheckModal
            isOpen={isPrivacyCheckOpen}
            onClose={() => setIsPrivacyCheckOpen(false)}
          />
        )}

        {/* Modal: Bespoke Valvetrain Acoustic Harmonics Lab */}
        {isAcousticStudioOpen && (
          <AcousticStudioModal
            isOpen={isAcousticStudioOpen}
            onClose={() => setIsAcousticStudioOpen(false)}
          />
        )}

        {/* Modal: Live Mountain Pass Surface Grip & Micro-Climate Radar */}
        {isPassRadarOpen && (
          <PassGripRadarModal
            isOpen={isPassRadarOpen}
            onClose={() => setIsPassRadarOpen(false)}
            initialPassId={passRadarTarget}
          />
        )}

        {/* Modal: Cross-Border Transit & Carnet Logistics */}
        {isTransitCarnetOpen && (
          <TransitCarnetModal
            isOpen={isTransitCarnetOpen}
            onClose={() => setIsTransitCarnetOpen(false)}
          />
        )}

        {/* Modal: Live Backend Systems Inspector & Control Room */}
        {isBackendInspectorOpen && (
          <BackendInspectorModal
            isOpen={isBackendInspectorOpen}
            onClose={() => setIsBackendInspectorOpen(false)}
          />
        )}

        {/* Modal: Architectural Atelier Chamber Designer */}
        {isArchitecturalChamberOpen && (
          <ArchitecturalChamberModal
            isOpen={isArchitecturalChamberOpen}
            onClose={() => setIsArchitecturalChamberOpen(false)}
          />
        )}

        {/* Modal: Specialist Workshop Digital Stamping Desk */}
        {isWorkshopStampingOpen && (
          <WorkshopStampingModal
            isOpen={isWorkshopStampingOpen}
            onClose={() => setIsWorkshopStampingOpen(false)}
          />
        )}

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
