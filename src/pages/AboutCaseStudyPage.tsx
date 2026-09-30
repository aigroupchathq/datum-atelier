import { useState } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  ShieldCheck,
  Layers,
  Sparkles,
  ChevronRight,
  Cpu,
  FileText,
  Compass,
  Sliders
} from 'lucide-react';

export const AboutCaseStudyPage: FC = () => {
  const { isWhiteYellow } = useTheme();
  const [activeTab, setActiveTab] = useState<'case-study' | 'architecture' | 'lab' | 'design-system'>('case-study');

  // Interactive Lab State: Geofence Simulator
  const [geofenceRadius, setGeofenceRadius] = useState<number>(800);
  
  // Interactive Lab State: Merkle Proof Simulator
  const [merkleTampered, setMerkleTampered] = useState<boolean>(false);

  // Interactive Lab State: Grip Radar Calculator
  const [isRaining, setIsRaining] = useState<boolean>(true);
  const [isFrost, setIsFrost] = useState<boolean>(false);
  const [tyreTemp, setTyreTemp] = useState<number>(38);

  // Calculate dynamic friction coefficient mu
  const baseMu = 0.95;
  const rainPenalty = isRaining ? 0.28 : 0.0;
  const frostPenalty = isFrost ? 0.55 : 0.0;
  const tempFactor = (tyreTemp - 20) * 0.0025;
  const calculatedMu = Math.max(0.15, Math.min(1.0, baseMu - rainPenalty - frostPenalty + tempFactor));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      
      {/* ========================================================= */}
      {/* 1. HERO MANIFESTO & TITLE BLOCK                           */}
      {/* ========================================================= */}
      <section className={`rounded-3xl border p-6 sm:p-10 mb-8 relative overflow-hidden transition-all shadow-sm ${
        isWhiteYellow 
          ? 'bg-white border-zinc-200/90 text-zinc-900 shadow-[0_10px_30px_rgba(0,0,0,0.04)]' 
          : 'bg-[#111114] border-white/10 text-white'
      }`}>
        
        {/* Ambient Corner Metallic Highlights */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400 text-zinc-950 text-xs font-mono-numbers font-bold shadow-xs border border-yellow-500">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DATUM ATELIER</span>
          </div>
          <span className="text-xs font-mono-numbers px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 font-bold border border-zinc-200 uppercase tracking-wider">
            PRODUCT CASE STUDY & ARCHITECTURE BLUEPRINT
          </span>
          <span className="text-xs font-mono-numbers text-emerald-700 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Sovereign Custody Standard
          </span>
        </div>

        {/* Monumental Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-luxury-display uppercase tracking-tight leading-tight text-zinc-950 mb-4">
          Re-Architecting the Automotive Soul
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 font-serif-italic max-w-3xl leading-relaxed mb-8">
          A definitive engineering case study exploring how DATUM Atelier replaces ad-driven social media feeds with 
          cryptographic provenance, zero-knowledge residential cloaking, Web Audio mechanical DSP, and generational 
          collector camaraderie.
        </p>

        {/* 4 Pillars Quantitative Metric Rail */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono-numbers pt-2 border-t border-zinc-200/80">
          <div className="p-3.5 rounded-2xl bg-zinc-50/90 border border-zinc-200/80">
            <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Zero-Knowledge Enclave</span>
            <strong className="text-sm font-bold text-zinc-950 block mt-0.5">800m Geofenced</strong>
            <span className="text-[10px] text-emerald-600 font-semibold">● 100% Home Garages Cloaked</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-50/90 border border-zinc-200/80">
            <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Ingestion Bandwidth</span>
            <strong className="text-sm font-bold text-yellow-700 block mt-0.5">600k QPS Peak</strong>
            <span className="text-[10px] text-zinc-500">10 Hz CAN-Bus Telemetry</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-50/90 border border-zinc-200/80">
            <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Timeline Read Latency</span>
            <strong className="text-sm font-bold text-zinc-950 block mt-0.5">&lt; 45ms P99</strong>
            <span className="text-[10px] text-zinc-500">Redis Cluster L1/L2</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-50/90 border border-zinc-200/80">
            <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Codebase Ownership</span>
            <strong className="text-sm font-bold text-zinc-950 block mt-0.5">100% Proprietary</strong>
            <span className="text-[10px] text-zinc-500">Authored by vD</span>
          </div>
        </div>

      </section>

      {/* ========================================================= */}
      {/* 2. INTERACTIVE CHAPTER NAVIGATION BAR                     */}
      {/* ========================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-6 pb-1">
        {[
          { id: 'case-study', label: '1. Executive Case Study & Problem', icon: <FileText className="w-3.5 h-3.5" /> },
          { id: 'architecture', label: '2. Level 1–6 Distributed System', icon: <Layers className="w-3.5 h-3.5" /> },
          { id: 'lab', label: '3. Interactive Engineering Lab', icon: <Cpu className="w-3.5 h-3.5" /> },
          { id: 'design-system', label: '4. Haute Horlogerie Design System', icon: <Sparkles className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-full text-xs font-mono-numbers font-bold whitespace-nowrap transition-all flex items-center gap-2 shadow-xs ${
              activeTab === tab.id
                ? 'bg-yellow-400 text-zinc-950 border border-yellow-500 shadow-sm scale-102'
                : isWhiteYellow
                ? 'bg-white border border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50'
                : 'bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ========================================================= */}
      {/* 3. TAB 1: EXECUTIVE CASE STUDY & PHILOSOPHY               */}
      {/* ========================================================= */}
      {activeTab === 'case-study' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Chapter 01: The Problem */}
          <div className={`p-6 sm:p-8 rounded-3xl border ${
            isWhiteYellow ? 'bg-white border-zinc-200/90 text-zinc-900' : 'bg-[#111114] border-white/10 text-white'
          }`}>
            <span className="text-[10px] font-mono-numbers uppercase tracking-widest text-red-600 font-bold block mb-1">
              CHAPTER 01 · THE PROBLEM
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-luxury-display uppercase mb-4">
              How Algorithmic Social Media Broke Automotive Culture
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono-numbers mb-6">
              <div className="p-4 rounded-2xl bg-red-50/80 border border-red-200/80 text-red-950">
                <strong className="text-sm font-bold block mb-1">Surveillance & Theft Hazard</strong>
                <p className="text-[11px] leading-relaxed text-red-900">
                  Standard social apps embed precise EXIF geotags and residential background clues. Organized theft syndicates 
                  routinely track high-value supercars and restomods directly back to owners' home garages.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-red-50/80 border border-red-200/80 text-red-950">
                <strong className="text-sm font-bold block mb-1">4K Lossy Compression Mush</strong>
                <p className="text-[11px] leading-relaxed text-red-900">
                  Collectors spend hundreds of hours crafting bespoke paint finishes and titanium hardware, only for mainstream 
                  apps to compress 48-megapixel photography into muddy 1080p JPEG artifacts.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-red-50/80 border border-red-200/80 text-red-950">
                <strong className="text-sm font-bold block mb-1">Ad Rage-Bait & Gatekeeping</strong>
                <p className="text-[11px] leading-relaxed text-red-900">
                  Algorithms incentivize superficial flexing, rev-limiter abuse, and commercial dropshipping ads, burying real 
                  mechanical knowledge, dyno telemetry, and master wrenching mentorship.
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-zinc-700 font-sans">
              The automotive world was left with two broken choices: either hide vehicles away in locked, private vaults where 
              nobody ever learns from them, or expose them on commercial social networks at severe personal privacy risk. 
              <strong> DATUM was created to dismantle this false dilemma.</strong>
            </p>
          </div>

          {/* Chapter 02: The 4 Signature Solutions */}
          <div className={`p-6 sm:p-8 rounded-3xl border ${
            isWhiteYellow ? 'bg-white border-zinc-200/90 text-zinc-900' : 'bg-[#111114] border-white/10 text-white'
          }`}>
            <span className="text-[10px] font-mono-numbers uppercase tracking-widest text-yellow-700 font-bold block mb-1">
              CHAPTER 02 · ARCHITECTURAL PILLARS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-luxury-display uppercase mb-6">
              Four Inventions That Power DATUM Atelier
            </h2>

            <div className="space-y-6">
              {/* Pillar 1 */}
              <div className="flex flex-col sm:flex-row items-start gap-4 p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                <div className="w-10 h-10 rounded-xl bg-yellow-400 text-zinc-950 flex items-center justify-center font-bold text-sm shrink-0 border border-yellow-500 shadow-xs">
                  01
                </div>
                <div>
                  <h3 className="text-base font-bold font-luxury-display uppercase text-zinc-950">
                    The Automobile as a Sovereign Social Citizen
                  </h3>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                    Vehicles are not profile pictures attached to humans; the car <strong>is</strong> the primary citizen. All 
                    drives, diagnostic trouble codes, acoustic valvetrain recordings, and certified workshop invoices attach 
                    permanently to the chassis VIN in a cryptographically notarized digital passport.
                  </p>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="flex flex-col sm:flex-row items-start gap-4 p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                <div className="w-10 h-10 rounded-xl bg-yellow-400 text-zinc-950 flex items-center justify-center font-bold text-sm shrink-0 border border-yellow-500 shadow-xs">
                  02
                </div>
                <div>
                  <h3 className="text-base font-bold font-luxury-display uppercase text-zinc-950">
                    Zero-Knowledge 800m Geofencing & Real-Time Plate Cloaking
                  </h3>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                    Every GPS expedition automatically truncates departure and arrival polyline endpoints by 800 meters, ensuring 
                    residential driveway coordinates never touch persistent server disks. Uploaded media passes through automated 
                    client-side optical plate detection with laser scan redaction.
                  </p>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="flex flex-col sm:flex-row items-start gap-4 p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                <div className="w-10 h-10 rounded-xl bg-yellow-400 text-zinc-950 flex items-center justify-center font-bold text-sm shrink-0 border border-yellow-500 shadow-xs">
                  03
                </div>
                <div>
                  <h3 className="text-base font-bold font-luxury-display uppercase text-zinc-950">
                    Web Audio Multi-Oscillator Valvetrain Synthesizer
                  </h3>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                    Replaces silent web apps with physical mechanical reality. Synthesizes starter motor tooth engagement, 
                    fuel pump relay priming hums, combustion flares, and continuous tachometer sweeps up to 9,000 RPM with 
                    real-time FFT spectral harmonic analysis.
                  </p>
                </div>
              </div>

              {/* Pillar 4 */}
              <div className="flex flex-col sm:flex-row items-start gap-4 p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                <div className="w-10 h-10 rounded-xl bg-yellow-400 text-zinc-950 flex items-center justify-center font-bold text-sm shrink-0 border border-yellow-500 shadow-xs">
                  04
                </div>
                <div>
                  <h3 className="text-base font-bold font-luxury-display uppercase text-zinc-950">
                    Open Community Custodianship & Mentorship Ethos
                  </h3>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                    DATUM rejects commercial gatekeeping. The platform is designed around open garage doors: 24 independent 
                    owners cooperative storage hangars, master engine builders teaching apprentices to plastigauge bearing clearances, 
                    and overland convoys where zero rigs are left behind in sub-zero whiteouts.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Chapter 03: The 4 Real-World Case Studies */}
          <div className={`p-6 sm:p-8 rounded-3xl border ${
            isWhiteYellow ? 'bg-white border-zinc-200/90 text-zinc-900' : 'bg-[#111114] border-white/10 text-white'
          }`}>
            <span className="text-[10px] font-mono-numbers uppercase tracking-widest text-emerald-700 font-bold block mb-1">
              CHAPTER 03 · COMMUNITY CASE STUDIES IN THE WILD
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-luxury-display uppercase mb-6">
              How Drivers & Custodians Use DATUM Daily
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Story 1 */}
              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono-numbers mb-2">
                    <span className="font-bold text-zinc-950">Julian Vane · Chilterns</span>
                    <span className="text-yellow-700 font-semibold">427 Cobra & 488 GTB</span>
                  </div>
                  <h4 className="text-sm font-bold font-luxury-display uppercase text-zinc-950 mb-2">
                    Case 01: Open Bay Doors & Inspiring Next-Gen Custodians
                  </h4>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Instead of hiding high-value classic side-oilers behind security gates, Julian opened his workshop to a 
                    15-year-old cyclist, teaching carburetor linkages and engine harmonics. The machine lives because it inspires.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-200 text-[11px] font-mono-numbers text-zinc-500 flex items-center justify-between">
                  <span>Photo: `/feed/stone_garage_cobra_ferrari.jpg`</span>
                  <span className="text-emerald-700 font-bold">642 Community Respects</span>
                </div>
              </div>

              {/* Story 2 */}
              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono-numbers mb-2">
                    <span className="font-bold text-zinc-950">Hamish MacLeod · Highland Bench</span>
                    <span className="text-yellow-700 font-semibold">Master Engine Builder</span>
                  </div>
                  <h4 className="text-sm font-bold font-luxury-display uppercase text-zinc-950 mb-2">
                    Case 02: Rescuing Alex’s Seized BMW M10 Engine Block
                  </h4>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    When a franchise garage quoted £4,800 to scrap a family heirloom 1974 2002 engine, Hamish opened his bench, 
                    taught young Alex bore measurement and gentle honing, and restored 0.0018” clearance for £35 in parts.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-200 text-[11px] font-mono-numbers text-zinc-500 flex items-center justify-between">
                  <span>Photo: `/feed/heritage_wrenching_workshop.jpg`</span>
                  <span className="text-emerald-700 font-bold">1,180 Community Respects</span>
                </div>
              </div>

              {/* Story 3 */}
              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono-numbers mb-2">
                    <span className="font-bold text-zinc-950">Midlands Collective · 24 Bays</span>
                    <span className="text-yellow-700 font-semibold">Aviation Hall Co-Op</span>
                  </div>
                  <h4 className="text-sm font-bold font-luxury-display uppercase text-zinc-950 mb-2">
                    Case 03: Democratic Storage Without Corporate Gouging
                  </h4>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    24 drivers in Victorian London terraces pooled resources to lease a light-flooded hangar with shared Snap-on 
                    tool towers, optical alignment rigs, and communal coffee. No VIP ropes; pure peer-to-peer solidarity.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-200 text-[11px] font-mono-numbers text-zinc-500 flex items-center justify-between">
                  <span>Photo: `/feed/collective_atelier_hall.jpg`</span>
                  <span className="text-emerald-700 font-bold">1,590 Community Respects</span>
                </div>
              </div>

              {/* Story 4 */}
              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono-numbers mb-2">
                    <span className="font-bold text-zinc-950">Cairngorm Crew · 2,198 ft</span>
                    <span className="text-yellow-700 font-semibold">Highland Overland Guild</span>
                  </div>
                  <h4 className="text-sm font-bold font-luxury-display uppercase text-zinc-950 mb-2">
                    Case 04: Sub-Zero Trailside Repair on Cairnwell Pass
                  </h4>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    When a Defender popped a lower radiator hose in a -5°C blizzard, the entire convoy formed a windbreak, 
                    repaired the hose with spare silicone line, brewed boiling tea, and crossed the summit safely together.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-200 text-[11px] font-mono-numbers text-zinc-500 flex items-center justify-between">
                  <span>Photo: `/feed/snow_mountain_overland_convoy.jpg`</span>
                  <span className="text-emerald-700 font-bold">914 Community Respects</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* 4. TAB 2: LEVEL 1-6 DISTRIBUTED SYSTEMS ARCHITECTURE      */}
      {/* ========================================================= */}
      {activeTab === 'architecture' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className={`p-6 sm:p-8 rounded-3xl border ${
            isWhiteYellow ? 'bg-white border-zinc-200/90 text-zinc-900' : 'bg-[#111114] border-white/10 text-white'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-mono-numbers uppercase tracking-widest text-yellow-700 font-bold block">
                  DISTRIBUTED SYSTEMS TOPOLOGY
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-luxury-display uppercase text-zinc-950">
                  Level 1–6 Architectural Specification
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-zinc-100 border border-zinc-300 text-xs font-mono-numbers font-bold text-zinc-800">
                Donne Martin Standard
              </span>
            </div>

            <p className="text-xs text-zinc-600 font-mono-numbers mb-6">
              Reference: Active-Active Multi-AZ Kubernetes microservices cluster with Kafka high-throughput buffering, 
              ClickHouse columnar time-series storage, sharded PostgreSQL 16 metadata, and Redis 7.2 geospatial cache.
            </p>

            {/* Architectural Tier Matrix */}
            <div className="space-y-4 text-xs font-mono-numbers">
              
              {/* Tier 1 */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/90">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-zinc-950 text-sm">Tier 1: Client & Presentation Tier</span>
                  <span className="text-yellow-700 font-semibold">React 19 • Web Audio DSP • PWA</span>
                </div>
                <p className="text-zinc-600 text-[11px]">
                  Optimistic UI updates, IndexedDB offline telemetry ring buffer, 60fps HTML5 Canvas polyline renderer, 
                  and multi-channel Web Audio harmonic oscillator engines.
                </p>
              </div>

              {/* Tier 2 */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/90">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-zinc-950 text-sm">Tier 2: Ingress & Zero-Knowledge Security</span>
                  <span className="text-yellow-700 font-semibold">Envoy Proxy • Token Bucket WAF • WASM Edge</span>
                </div>
                <p className="text-zinc-600 text-[11px]">
                  Mutual TLS 1.3 termination, OAuth 2.1 + PKCE with Ed25519 asymmetric JWT tokens, zero-knowledge 800m 
                  spatial truncation in WebAssembly, and ML optical registration plate redaction.
                </p>
              </div>

              {/* Tier 3 */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/90">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-zinc-950 text-sm">Tier 3: Core Domain Microservices</span>
                  <span className="text-yellow-700 font-semibold">Golang & TypeScript Kubernetes Pods</span>
                </div>
                <p className="text-zinc-600 text-[11px]">
                  Vehicle Digital Twin Service, Merkle DAG Provenance Ledger, Pass Grip Radar Physics Engine, Acoustic Spectral 
                  FFT Analyzer, Cross-Border ATA Carnet Generator, and Hybrid Push/Pull Timeline Fan-Out.
                </p>
              </div>

              {/* Tier 4 */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/90">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-zinc-950 text-sm">Tier 4: Event Streaming & Asynchronous Bus</span>
                  <span className="text-yellow-700 font-semibold">Apache Kafka (600k QPS) • RabbitMQ DLQ</span>
                </div>
                <p className="text-zinc-600 text-[11px]">
                  Partitioned by `chassis_vin` for strict FIFO telemetry sequencing. KEDA-driven auto-scaling consumer worker pools 
                  with Dead Letter Queue isolation.
                </p>
              </div>

              {/* Tier 5 */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/90">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-zinc-950 text-sm">Tier 5: Persistence & Sharded Storage</span>
                  <span className="text-yellow-700 font-semibold">PostgreSQL (Sharded) • ClickHouse • Redis Cluster</span>
                </div>
                <p className="text-zinc-600 text-[11px]">
                  Sharded relational cluster for immutable digital passports (`hash(vin) % 4`), ClickHouse columnar compression 
                  (4:1 ZSTD) for 118TB telemetry history, and Redis 16,384 hash slots for active timelines and spatial H3 queries.
                </p>
              </div>

              {/* Tier 6 */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/90">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-zinc-950 text-sm">Tier 6: Resiliency, FMEA & Recovery</span>
                  <span className="text-yellow-700 font-semibold">Multi-AZ Active-Active • Raft Consensus</span>
                </div>
                <p className="text-zinc-600 text-[11px]">
                  CP strong consistency for digital titles / AP eventual consistency for social timelines. Resilience4j circuit breakers 
                  guarding external DVSA and Met Office government APIs.
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* 5. TAB 3: INTERACTIVE ENGINEERING LAB                    */}
      {/* ========================================================= */}
      {activeTab === 'lab' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Lab 1: Zero-Knowledge 800m Geofence Simulator */}
          <div className={`p-6 sm:p-8 rounded-3xl border ${
            isWhiteYellow ? 'bg-white border-zinc-200/90 text-zinc-900' : 'bg-[#111114] border-white/10 text-white'
          }`}>
            <span className="text-[10px] font-mono-numbers uppercase tracking-widest text-emerald-700 font-bold block mb-1">
              INTERACTIVE SIMULATOR 01
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-luxury-display uppercase text-zinc-950 mb-2">
              Zero-Knowledge Residential Geofence Vector Truncator
            </h3>
            <p className="text-xs text-zinc-600 mb-6">
              Adjust the residential privacy perimeter to observe how DATUM's Edge WASM worker automatically strips departure 
              and arrival coordinates before GPS polylines are stored in public databases.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div>
                  <label className="text-xs font-mono-numbers font-bold text-zinc-800 flex justify-between">
                    <span>Sanctuary Radius:</span>
                    <span className="text-yellow-700">{geofenceRadius} meters</span>
                  </label>
                  <input
                    type="range"
                    min="200"
                    max="1500"
                    step="50"
                    value={geofenceRadius}
                    onChange={(e) => setGeofenceRadius(Number(e.target.value))}
                    className="w-full accent-yellow-500 mt-2 cursor-pointer"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs font-mono-numbers space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Departure Vector:</span>
                    <span className="text-red-600 font-bold">-{geofenceRadius}m (Redacted)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Arrival Vector:</span>
                    <span className="text-red-600 font-bold">-{geofenceRadius}m (Redacted)</span>
                  </div>
                  <div className="flex justify-between border-t pt-1.5 border-zinc-200">
                    <span className="text-zinc-500">Public Highway Leg:</span>
                    <span className="text-emerald-700 font-bold">100% Intact</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 h-48 rounded-2xl bg-zinc-950 border border-zinc-800 p-4 relative overflow-hidden flex items-center justify-center">
                {/* SVG Visualizer */}
                <svg className="w-full h-full" viewBox="0 0 400 160">
                  {/* Public Highway Path */}
                  <path d="M 40 80 Q 120 20, 200 80 T 360 80" fill="none" stroke="#EAB308" strokeWidth="4" strokeDasharray="6 3" />
                  
                  {/* Home Sanctuary Circle Left */}
                  <circle cx="60" cy="80" r={geofenceRadius / 25} fill="rgba(239, 68, 68, 0.15)" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4 2" />
                  <circle cx="60" cy="80" r="4" fill="#EF4444" />
                  <text x="45" y="115" fill="#EF4444" fontSize="9" fontFamily="monospace" fontWeight="bold">HOME VAULT</text>

                  {/* Redacted Truncation Marker */}
                  <line x1="60" y1="80" x2={60 + geofenceRadius / 25} y2="80" stroke="#EF4444" strokeWidth="2" />
                  
                  {/* Public Departure Gate */}
                  <circle cx={60 + geofenceRadius / 25} cy="80" r="5" fill="#10B981" />
                  <text x={70 + geofenceRadius / 25} y="75" fill="#10B981" fontSize="9" fontFamily="monospace" fontWeight="bold">CLOAK GATE</text>

                  {/* Open B-Road Apex */}
                  <circle cx="200" cy="80" r="6" fill="#EAB308" />
                  <text x="175" y="55" fill="#FFFFFF" fontSize="10" fontFamily="monospace" fontWeight="bold">B-ROAD PASS</text>
                </svg>
              </div>
            </div>
          </div>

          {/* Lab 2: Merkle Proof Tamper-Detection Simulator */}
          <div className={`p-6 sm:p-8 rounded-3xl border ${
            isWhiteYellow ? 'bg-white border-zinc-200/90 text-zinc-900' : 'bg-[#111114] border-white/10 text-white'
          }`}>
            <span className="text-[10px] font-mono-numbers uppercase tracking-widest text-yellow-700 font-bold block mb-1">
              INTERACTIVE SIMULATOR 02
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-luxury-display uppercase text-zinc-950 mb-2">
              Merkle DAG Cryptographic Provenance Validator
            </h3>
            <p className="text-xs text-zinc-600 mb-6">
              Simulate an unauthorized attempt to alter a vehicle's mileage or delete an accident record to witness how Merkle root 
              cryptography instantly invalidates the passport chain.
            </p>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs font-mono-numbers">
                <div>
                  <span className="text-zinc-500 block text-[10px]">Chassis VIN Subject</span>
                  <strong className="text-zinc-950 font-bold">WBS-G80-COMP-UK-084 (MAYA M3)</strong>
                </div>

                <button
                  onClick={() => setMerkleTampered(!merkleTampered)}
                  className={`px-4 py-2 rounded-full font-bold transition flex items-center gap-1.5 shadow-xs ${
                    merkleTampered
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-zinc-900 text-white hover:bg-zinc-800'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{merkleTampered ? 'Revert Tampered Payload' : 'Inject Mileage Tamper (42k → 12k mi)'}</span>
                </button>
              </div>

              {/* Merkle Chain Visualizer */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono-numbers">
                <div className={`p-3.5 rounded-2xl border transition-all ${
                  merkleTampered ? 'bg-red-50 border-red-300 text-red-950' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                }`}>
                  <span className="text-[9px] uppercase font-bold text-zinc-400">Leaf 1 · Factory Build</span>
                  <div className="font-bold text-xs mt-1">BMW Park Lane</div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-1 truncate">Hash: 0x4a8f...91c0</div>
                  <span className="inline-block mt-2 text-[9px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    ✓ Valid
                  </span>
                </div>

                <div className={`p-3.5 rounded-2xl border transition-all ${
                  merkleTampered ? 'bg-red-500 text-white border-red-600 animate-pulse' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                }`}>
                  <span className={`text-[9px] uppercase font-bold ${merkleTampered ? 'text-red-200' : 'text-zinc-400'}`}>
                    Leaf 2 · DVSA MOT Mileage
                  </span>
                  <div className="font-bold text-xs mt-1">
                    {merkleTampered ? 'TAMPERED: 12,000 mi' : 'VERIFIED: 42,184 mi'}
                  </div>
                  <div className={`text-[10px] font-mono mt-1 truncate ${merkleTampered ? 'text-red-100' : 'text-zinc-500'}`}>
                    {merkleTampered ? 'Hash Mismatch!' : 'Hash: 0x9b32...fa84'}
                  </div>
                  <span className={`inline-block mt-2 text-[9px] px-2 py-0.5 rounded font-bold ${
                    merkleTampered ? 'bg-white text-red-900' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {merkleTampered ? '✕ CHECKSUM BROKEN' : '✓ Valid'}
                  </span>
                </div>

                <div className={`p-3.5 rounded-2xl border transition-all ${
                  merkleTampered ? 'bg-red-50 border-red-300 text-red-950' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                }`}>
                  <span className="text-[9px] uppercase font-bold text-zinc-400">Leaf 3 · KW V4 Coilovers</span>
                  <div className="font-bold text-xs mt-1">Evolve Automotive</div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-1 truncate">Hash: 0xc14d...338e</div>
                  <span className="inline-block mt-2 text-[9px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    ✓ Valid
                  </span>
                </div>

                <div className={`p-3.5 rounded-2xl border transition-all ${
                  merkleTampered ? 'bg-red-950 text-red-200 border-red-800' : 'bg-yellow-50 border-yellow-300 text-yellow-950'
                }`}>
                  <span className="text-[9px] uppercase font-bold text-yellow-700">Root Merkle Hash</span>
                  <div className="font-bold text-xs mt-1">
                    {merkleTampered ? 'CHAIN COMPROMISED' : '0x8F9A...C4B1'}
                  </div>
                  <div className="text-[10px] font-mono mt-1">
                    {merkleTampered ? 'Trust Score: 0%' : 'Trust Score: 100%'}
                  </div>
                  <span className={`inline-block mt-2 text-[9px] px-2 py-0.5 rounded font-bold ${
                    merkleTampered ? 'bg-red-600 text-white' : 'bg-yellow-400 text-zinc-950'
                  }`}>
                    {merkleTampered ? 'CRITICAL ALERT' : 'SOVEREIGN SEAL'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Lab 3: Pass Grip Radar Friction Calculator */}
          <div className={`p-6 sm:p-8 rounded-3xl border ${
            isWhiteYellow ? 'bg-white border-zinc-200/90 text-zinc-900' : 'bg-[#111114] border-white/10 text-white'
          }`}>
            <span className="text-[10px] font-mono-numbers uppercase tracking-widest text-sky-700 font-bold block mb-1">
              INTERACTIVE SIMULATOR 03
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-luxury-display uppercase text-zinc-950 mb-2">
              Pass Grip Radar Dynamic Road Friction ($\mu$) Engine
            </h3>
            <p className="text-xs text-zinc-600 mb-6">
              Simulate shifting meteorological and tyre thermal variables to observe real-time recalculation of the road friction 
              coefficient ($\mu$) across legendary passes like Snake Pass (A57) and Bealach na Bà.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 grid grid-cols-2 gap-3 text-xs font-mono-numbers">
                
                {/* Weather Toggle */}
                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <span className="text-[10px] text-zinc-500 uppercase block font-semibold mb-2">Precipitation State</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsRaining(false)}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition ${!isRaining ? 'bg-yellow-400 text-zinc-950 shadow-xs' : 'bg-zinc-200 text-zinc-600'}`}
                    >
                      Dry
                    </button>
                    <button
                      onClick={() => setIsRaining(true)}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition ${isRaining ? 'bg-sky-600 text-white shadow-xs' : 'bg-zinc-200 text-zinc-600'}`}
                    >
                      Wet Spray
                    </button>
                  </div>
                </div>

                {/* Frost Toggle */}
                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <span className="text-[10px] text-zinc-500 uppercase block font-semibold mb-2">Sub-Zero Frost</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsFrost(false)}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition ${!isFrost ? 'bg-yellow-400 text-zinc-950 shadow-xs' : 'bg-zinc-200 text-zinc-600'}`}
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => setIsFrost(true)}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition ${isFrost ? 'bg-cyan-600 text-white shadow-xs' : 'bg-zinc-200 text-zinc-600'}`}
                    >
                      Black Ice
                    </button>
                  </div>
                </div>

                {/* Tyre Temp Slider */}
                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 col-span-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] text-zinc-500 uppercase font-semibold">Tyre Bulk Temperature:</span>
                    <strong className="text-zinc-900">{tyreTemp}°C</strong>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="85"
                    value={tyreTemp}
                    onChange={(e) => setTyreTemp(Number(e.target.value))}
                    className="w-full accent-yellow-500 cursor-pointer"
                  />
                </div>

              </div>

              {/* Dynamic Readout Gauge */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-zinc-950 text-white border border-zinc-800 text-center space-y-2">
                <span className="text-[10px] font-mono-numbers uppercase tracking-widest text-zinc-400 block">
                  CALCULATED ROAD ADHESION COEFFICIENT
                </span>
                <div className="text-5xl font-black font-luxury-display text-yellow-400 tracking-tight">
                  μ {calculatedMu.toFixed(2)}
                </div>
                <div className="text-xs font-mono-numbers text-zinc-400">
                  {calculatedMu > 0.75 ? (
                    <span className="text-emerald-400 font-bold">Optimal Track Adhesion</span>
                  ) : calculatedMu > 0.45 ? (
                    <span className="text-yellow-400 font-bold">Moderate Damp Surface • Exercise Throttle Prudence</span>
                  ) : (
                    <span className="text-red-400 font-bold">Severe Slip Hazard • Engage Wet / Snow Mode</span>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* 6. TAB 4: HAUTE HORLOGERIE DESIGN SYSTEM                  */}
      {/* ========================================================= */}
      {activeTab === 'design-system' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className={`p-6 sm:p-8 rounded-3xl border ${
            isWhiteYellow ? 'bg-white border-zinc-200/90 text-zinc-900' : 'bg-[#111114] border-white/10 text-white'
          }`}>
            <span className="text-[10px] font-mono-numbers uppercase tracking-widest text-yellow-700 font-bold block mb-1">
              DESIGN SYSTEM SPECIFICATION
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-luxury-display uppercase text-zinc-950 mb-6">
              Mayfair & Goodwood Coachbuilder Aesthetics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-mono-numbers mb-8">
              
              {/* Color Palette */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                <strong className="text-sm font-bold block text-zinc-950 font-luxury-display uppercase">
                  Atelier Palette
                </strong>
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-[#F8F9FA] border border-zinc-300 shrink-0" />
                    <span>Gallery Alabaster White (`#F8F9FA`)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-[#EAB308] border border-black/20 shrink-0" />
                    <span>Racing Speed Yellow (`#EAB308`)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-[#09090B] border border-white/20 shrink-0" />
                    <span>Obsidian Ink Black (`#09090B`)</span>
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                <strong className="text-sm font-bold block text-zinc-950 font-luxury-display uppercase">
                  Typography Rules
                </strong>
                <div className="space-y-1.5 text-[11px] text-zinc-600">
                  <p><strong className="text-zinc-950">Display Headlines:</strong> `Cinzel`, uppercase, tracking `0.12em` to `0.25em`.</p>
                  <p><strong className="text-zinc-950">Editorial Subheads:</strong> `Cormorant Garamond`, serif italic.</p>
                  <p><strong className="text-zinc-950">Telemetry & Numbers:</strong> `JetBrains Mono` / Tabular figures.</p>
                </div>
              </div>

              {/* Mechanical Accents */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                <strong className="text-sm font-bold block text-zinc-950 font-luxury-display uppercase">
                  CNC Titanium Details
                </strong>
                <div className="space-y-1.5 text-[11px] text-zinc-600">
                  <p>• 4 Corner micro-rivet cross bolts (`+`).</p>
                  <p>• Precision knurled bezels with radial brush finish.</p>
                  <p>• Zero bouncy playful animations; only smooth physical easing.</p>
                </div>
              </div>

            </div>

            {/* Live Stamped Titanium Chassis Plaque Example */}
            <div className="p-6 rounded-3xl bg-zinc-950 text-white border border-zinc-800 relative overflow-hidden shadow-xl">
              <div className="absolute top-2.5 left-3 text-[10px] font-black text-zinc-600 font-mono">+</div>
              <div className="absolute top-2.5 right-3 text-[10px] font-black text-zinc-600 font-mono">+</div>
              <div className="absolute bottom-2.5 left-3 text-[10px] font-black text-zinc-600 font-mono">+</div>
              <div className="absolute bottom-2.5 right-3 text-[10px] font-black text-zinc-600 font-mono">+</div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-3 mb-3">
                <div>
                  <span className="text-[9px] font-mono-numbers uppercase tracking-widest text-yellow-500 font-bold block">
                    DATUM ATELIER · SOVEREIGN CHASSIS NOTARIZATION
                  </span>
                  <h3 className="text-xl font-bold font-luxury-display uppercase tracking-wide text-white mt-0.5">
                    MAYA · M3 COMPETITION (G80)
                  </h3>
                </div>
                <span className="text-xs font-mono-numbers px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                  PASS: DVSA-GB-9821
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono-numbers">
                <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-[9px] text-zinc-500 uppercase block">Chassis Code</span>
                  <span className="font-bold text-white text-[11px]">WBS-G80-COMP-UK-084</span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-[9px] text-zinc-500 uppercase block">Curator Custody</span>
                  <span className="font-bold text-yellow-400 text-[11px]">vD (Sovereign)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-[9px] text-zinc-500 uppercase block">Output & Spec</span>
                  <span className="font-bold text-white text-[11px]">510 BHP • KW V4</span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-[9px] text-zinc-500 uppercase block">Enclave Status</span>
                  <span className="font-bold text-emerald-400 text-[11px]">800m Cloaked</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* 7. BOTTOM CALL TO ACTION                                 */}
      {/* ========================================================= */}
      <div className={`mt-8 p-6 sm:p-8 rounded-3xl border text-center space-y-4 ${
        isWhiteYellow 
          ? 'bg-gradient-to-br from-yellow-400/20 via-white to-amber-500/10 border-yellow-300 text-zinc-950' 
          : 'bg-zinc-900/80 border-white/10 text-white'
      }`}>
        <h3 className="text-xl sm:text-2xl font-bold font-luxury-display uppercase">
          Experience the Sovereign Handover Protocol
        </h3>
        <p className="text-xs sm:text-sm text-zinc-600 max-w-xl mx-auto font-sans">
          Turn the titanium master ignition key, explore the B-Road Pass Grip Radar, or inspect the Merkle provenance ledger.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-yellow-400 hover:bg-yellow-300 text-zinc-950 text-xs font-mono-numbers font-bold transition-all shadow-sm border border-yellow-500 active:scale-98"
          >
            <span>Enter Sovereign Feed</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-zinc-50 text-zinc-900 text-xs font-mono-numbers font-bold transition-all border border-zinc-200 shadow-xs"
          >
            <Compass className="w-3.5 h-3.5 text-yellow-600" />
            <span>Explore B-Road Passes</span>
          </Link>
        </div>
      </div>

    </div>
  );
};
