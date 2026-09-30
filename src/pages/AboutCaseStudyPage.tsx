import { useState } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  Layers,
  Sparkles,
  Cpu,
  FileText,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  ArrowUpRight
} from 'lucide-react';

interface FAQItem {
  id: string;
  category: 'protocol' | 'provenance' | 'privacy' | 'hardware' | 'guilds';
  question: string;
  shortAnswer: string;
  detailedAnswer: string;
  tag: string;
}

export const AboutCaseStudyPage: FC = () => {
  const { isWhiteYellow } = useTheme();
  
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'editorial' | 'architecture' | 'lab' | 'faq' | 'design-system'>('editorial');

  // FAQ interactive state
  const [activeFaqCategory, setActiveFaqCategory] = useState<string>('all');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');
  const [faqSearchQuery, setFaqSearchQuery] = useState<string>('');

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

  // FAQ Database
  const faqs: FAQItem[] = [
    {
      id: 'faq-1',
      category: 'privacy',
      tag: 'Zero-Knowledge Privacy',
      question: 'How does DATUM protect private residential addresses when sharing drives or telemetry?',
      shortAnswer: 'Through deterministic 800m zero-knowledge vector clipping around all private dwelling coordinates.',
      detailedAnswer: 'Every telemetry stream and GPS route trace is automatically truncated at an exact 800-meter radius around verified residential anchors before leaving the user\'s local client enclave. Vectors are cryptographically clipped before ingestion into public or guild event logs, ensuring physical vehicle security while preserving open-road track data and driving dynamics.'
    },
    {
      id: 'faq-2',
      category: 'provenance',
      tag: 'Merkle DAG Ledger',
      question: 'What makes the DATUM Digital Twin different from a standard dealership logbook?',
      shortAnswer: 'An immutable cryptographic Merkle DAG binding every maintenance event to an Ed25519 signature.',
      detailedAnswer: 'Standard logbooks rely on easily forged paper stamps or siloed dealership databases that evaporate upon sale. DATUM links each vehicle VIN to a Merkle Directed Acyclic Graph (DAG). Every maintenance event, torque specification, dyno run, and ECU calibration is signed with an authorized mechanic\'s Ed25519 keypair and hashed into an immutable ledger block, providing tamper-evident proof of heritage and mechanical integrity.'
    },
    {
      id: 'faq-3',
      category: 'hardware',
      tag: 'CAN-Bus & Telematics',
      question: 'Can vintage or analog cars without modern CAN-bus sensors participate in DATUM?',
      shortAnswer: 'Yes. Heritage Carnet Mode provides high-resolution photographic and acoustic acoustic anchoring for analog vehicles.',
      detailedAnswer: 'Vintage and classic custodians use DATUM\'s Heritage Carnet Mode. High-resolution photographic scans of period documentation, Weber carburetor balance sheets, dyno printouts, and master engineer voice memos are timestamped and cryptographically anchored into the vehicle\'s permanent dossier. Optional BLE analog telemetry sensors can also monitor oil pressure, coolant temp, and cylinder head temperatures.'
    },
    {
      id: 'faq-4',
      category: 'protocol',
      tag: 'Pass Grip Radar',
      question: 'How does the Pass Grip Radar calculate real-time road surface friction (μ)?',
      shortAnswer: 'By fusing live Doppler weather radar feeds with peer vehicle ABS slip-angles and tyre carcass thermal curves.',
      detailedAnswer: 'The radar synthesizes micro-climate meteorological feeds with live telemetry from convoy vehicles traversing mountain passes. It models the thermodynamic adhesion equation: μ = μ_dry - Δμ_precip - Δμ_frost + (T_tyre - 20°C) × 0.0025. This dynamically alerts drivers to black ice or standing surface water on iconic routes like Snake Pass (A57) and Bealach na Bà before they enter the hazard zone.'
    },
    {
      id: 'faq-5',
      category: 'guilds',
      tag: 'Guild Ateliers',
      question: 'How does collective garage access and multi-signature bay booking work?',
      shortAnswer: 'Time-locked cryptographic NFC passes authorized by a multi-signature guild council of peer owners.',
      detailedAnswer: 'Guild ateliers operate as decentralized collector cooperatives. Physical access to shared four-post lifts, calibrated Snap-on tool chests, and climate-controlled storage is orchestrated through temporary time-locked NFC credentials signed by the guild\'s multi-signature council. Equipment usage and consumable parts are automatically reconciled against the guild\'s collective maintenance treasury.'
    },
    {
      id: 'faq-6',
      category: 'hardware',
      tag: 'API & Interoperability',
      question: 'Is DATUM open for external motorsports telemetry systems like MoTeC and AiM?',
      shortAnswer: 'Yes. High-speed gRPC and WebSocket ingestion pipelines support standard motorsport data formats.',
      detailedAnswer: 'DATUM provides bidirectional gRPC and WebSocket API endpoints for MoTeC, AiM, RaceCapture, and custom ESP32 CAN-bus bridges. All external telemetry is validated through Envoy mTLS gateways with strict token-bucket rate limits handling up to 600,000 QPS at 10 Hz per active vehicle.'
    },
    {
      id: 'faq-7',
      category: 'provenance',
      tag: 'Ownership & IP',
      question: 'Who owns the intellectual property and codebase of DATUM Atelier?',
      shortAnswer: '100% of the DATUM Atelier architecture and codebase are proprietary assets authored by vD.',
      detailedAnswer: 'DATUM Atelier is built under strict sovereign code custody. All system designs, UI implementations, mathematical friction models, and cryptographic algorithms are exclusively owned and authored by vD (<vD@users.noreply.github.com>).'
    }
  ];

  // Filtered FAQs
  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeFaqCategory === 'all' || faq.category === activeFaqCategory;
    const matchesSearch = faq.question.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
                          faq.detailedAnswer.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
                          faq.tag.toLowerCase().includes(faqSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300 ${
      isWhiteYellow ? 'text-zinc-900' : 'text-zinc-100'
    }`}>
      
      {/* ========================================================= */}
      {/* 1. VOGUE EDITORIAL MASTHEAD & COVER HEADER                */}
      {/* ========================================================= */}
      <header className="mb-10 text-center border-b border-zinc-200/80 pb-8 relative">
        
        {/* Subtle Luxury Issue Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono-numbers uppercase tracking-[0.25em] text-zinc-500 border-b border-zinc-200/60 pb-3 mb-6">
          <span>VOL. IV // SPECIAL EDITION</span>
          <span className="hidden sm:inline">MAYFAIR • EDINBURGH • STUTTGART • TOKYO</span>
          <span className="text-yellow-600 font-bold">THE ATELIER BLUEPRINT & INQUIRY</span>
        </div>

        {/* Vogue Style High-Fashion Serif Masthead */}
        <div className="py-4">
          <span className="text-xs uppercase tracking-[0.4em] font-semibold text-zinc-400 block mb-2">
            The Monograph of Modern Motoring
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light font-luxury-display uppercase tracking-tight text-zinc-950 leading-none">
            DATUM <span className="font-serif italic font-normal text-yellow-600">Atelier</span>
          </h1>
          <p className="mt-4 text-xs sm:text-sm font-mono-numbers text-zinc-500 uppercase tracking-widest max-w-xl mx-auto">
            Sovereign Vehicle Custody • Distributed Telemetry • Cryptographic Provenance
          </p>
        </div>

        {/* Hairline Divider with Center Seal */}
        <div className="relative flex items-center justify-center mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200" />
          </div>
          <div className="relative bg-zinc-50 px-4 text-[11px] font-mono-numbers text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-yellow-500" />
            <span>Curated by vD</span>
          </div>
        </div>

      </header>

      {/* ========================================================= */}
      {/* 2. EDITORIAL CHAPTER NAVIGATION                           */}
      {/* ========================================================= */}
      <nav aria-label="Editorial Chapters" className="flex items-center justify-center gap-1 sm:gap-3 overflow-x-auto no-scrollbar mb-10 pb-2 border-b border-zinc-200/80">
        {[
          { id: 'editorial', label: 'I. The Manifesto & Case Study', icon: <FileText className="w-3.5 h-3.5" /> },
          { id: 'faq', label: 'II. The Inquiry & FAQ', icon: <HelpCircle className="w-3.5 h-3.5" /> },
          { id: 'architecture', label: 'III. System Architecture', icon: <Layers className="w-3.5 h-3.5" /> },
          { id: 'lab', label: 'IV. Interactive Engineering Lab', icon: <Cpu className="w-3.5 h-3.5" /> },
          { id: 'design-system', label: 'V. Horlogerie Design Tokens', icon: <Sparkles className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono-numbers uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-zinc-950 text-yellow-400 font-bold shadow-md scale-102'
                : 'bg-zinc-100/80 text-zinc-600 hover:bg-zinc-200/80 hover:text-zinc-950'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* ========================================================= */}
      {/* 3. TAB 1: VOGUE EDITORIAL MANIFESTO & CASE STUDY          */}
      {/* ========================================================= */}
      {activeTab === 'editorial' && (
        <article className="space-y-12 animate-in fade-in duration-300">
          
          {/* Editorial Double-Spread Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Vogue Editorial Intro */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[10px] font-mono-numbers uppercase tracking-[0.3em] text-yellow-700 font-bold block">
                EDITORIAL ESSAY // CHAPTER 01
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-zinc-950 leading-tight">
                Beyond the algorithmic noise: Returning dignity to the garage.
              </h2>
              
              <div className="text-zinc-700 leading-relaxed space-y-4 text-sm sm:text-base font-serif">
                <p className="first-letter:text-5xl first-letter:font-serif first-letter:float-left first-letter:mr-3 first-letter:font-bold first-letter:text-zinc-950 first-letter:leading-none">
                  For over a generation, automotive passion has been exiled to the superficial corridors of engagement algorithms—noisy feeds where fifteen-second rev clips masquerade as culture, and where the sacred, grease-stained bond between custodian and machine is reduced to disposable metrics.
                </p>
                <p>
                  DATUM Atelier was conceived as an architectural antidote. We reject the loud, transactional mechanics of modern web platforms in favor of a sanctuary built on the quiet principles of haute horlogerie: precision, permanence, sovereign custody, and genuine camaraderie.
                </p>
              </div>

              {/* Editorial Pull Quote */}
              <div className="p-6 rounded-2xl bg-zinc-100 border-l-4 border-yellow-500 my-6">
                <p className="text-lg font-serif italic text-zinc-900 leading-relaxed">
                  "A sports car is not merely a piece of metal; it is a repository of human intention, mechanical courage, and shared road memory."
                </p>
                <span className="block mt-2 text-xs font-mono-numbers uppercase tracking-widest text-zinc-500">
                  — DATUM Manifesto // Mayfair Edition
                </span>
              </div>
            </div>

            {/* Right Column: Curated Gallery Showcase */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-3xl overflow-hidden border border-zinc-200 shadow-xl bg-zinc-900 group">
                <img 
                  src="/feed/collective_atelier_hall.jpg" 
                  alt="Cooperative Atelier" 
                  className="w-full h-80 object-cover group-hover:scale-103 transition-transform duration-700"
                />
                <div className="p-4 bg-zinc-950 text-white">
                  <div className="flex justify-between items-center text-[10px] font-mono-numbers uppercase tracking-widest text-zinc-400 mb-1">
                    <span>PLATE 01 // SANCTUARY</span>
                    <span className="text-yellow-400">MAYFAIR VAULT</span>
                  </div>
                  <p className="text-xs text-zinc-300 font-serif italic">
                    The 24-bay collective atelier where members share master engineering tooling and climate-controlled berths.
                  </p>
                </div>
              </div>

              {/* Minimal Metric Trio */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono-numbers">
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <span className="text-[10px] text-zinc-400 block uppercase">Members</span>
                  <strong className="text-sm font-bold text-zinc-900">Invite Only</strong>
                </div>
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <span className="text-[10px] text-zinc-400 block uppercase">Privacy</span>
                  <strong className="text-sm font-bold text-emerald-700">800m Cloak</strong>
                </div>
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <span className="text-[10px] text-zinc-400 block uppercase">Custody</span>
                  <strong className="text-sm font-bold text-zinc-900">Merkle DAG</strong>
                </div>
              </div>
            </div>

          </div>

          {/* 4 Pillars Grid with Editorial Styling */}
          <section className="pt-8 border-t border-zinc-200">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-[10px] font-mono-numbers uppercase tracking-[0.3em] text-yellow-700 font-bold block mb-1">
                SYSTEM PILLARS
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-zinc-950">
                The Four Tenets of DATUM
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Pillar 1 */}
              <div className="p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full bg-yellow-400 text-zinc-950 flex items-center justify-center font-mono-numbers font-bold text-sm mb-4">
                  01
                </div>
                <h4 className="text-lg font-bold font-luxury-display uppercase text-zinc-950 mb-2">
                  The Living Digital Twin
                </h4>
                <p className="text-xs text-zinc-600 leading-relaxed font-serif">
                  A high-fidelity digital replica continuously synced to CAN-bus telemetry. Engine oil thermals, brake pad wear, suspension dampening cycles, and aerodynamic flap angles are tracked with mathematical rigor.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full bg-zinc-950 text-yellow-400 flex items-center justify-center font-mono-numbers font-bold text-sm mb-4">
                  02
                </div>
                <h4 className="text-lg font-bold font-luxury-display uppercase text-zinc-950 mb-2">
                  Bespoke Guilds & Shared Bays
                </h4>
                <p className="text-xs text-zinc-600 leading-relaxed font-serif">
                  Eliminating commercial rent burdens through cooperative wrenching ateliers. Multi-signature smart locks grant access to 4-post hydraulic lifts, diagnostic oscilloscopes, and clean-room engine assembly benches.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center font-mono-numbers font-bold text-sm mb-4">
                  03
                </div>
                <h4 className="text-lg font-bold font-luxury-display uppercase text-zinc-950 mb-2">
                  Dynamic Pass Grip Radar
                </h4>
                <p className="text-xs text-zinc-600 leading-relaxed font-serif">
                  Live atmospheric Doppler radar data synthesized with real-time ABS slip angles and tyre thermal curves. Calculates the dynamic friction coefficient ($\mu$) across legendary mountain passes before tires touch cold asphalt.
                </p>
              </div>

              {/* Pillar 4 */}
              <div className="p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-mono-numbers font-bold text-sm mb-4">
                  04
                </div>
                <h4 className="text-lg font-bold font-luxury-display uppercase text-zinc-950 mb-2">
                  Autonomous Carnet Protocol
                </h4>
                <p className="text-xs text-zinc-600 leading-relaxed font-serif">
                  A tamper-evident vehicle passport powered by Merkle trees. Maintenance invoices, ECU remaps, and track telemetry are mathematically proven upon transfer without exposing private financial disclosures.
                </p>
              </div>

            </div>
          </section>

          {/* Photo Editorial Feature Spread */}
          <section className="rounded-3xl overflow-hidden bg-zinc-950 text-white border border-zinc-800 p-8 sm:p-12 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <span className="text-[10px] font-mono-numbers uppercase tracking-[0.3em] text-yellow-400 font-bold block">
                  COMMUNITY EXPEDITION
                </span>
                <h3 className="text-2xl sm:text-4xl font-serif font-light leading-tight">
                  Sub-zero Cairnwell Pass blizzard trailside rescue.
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 font-serif leading-relaxed">
                  When a vintage Defender alternator failed during a sudden Scottish mountain blizzard, the DATUM telemetry beacon dispatched immediate cold-weather diagnostic tools from two convoy members 4 miles ahead. Mutual custodianship turned what could have been a disaster into a masterclass in camaraderie.
                </p>
                <div className="pt-2">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-xs font-mono-numbers uppercase tracking-widest text-yellow-400 hover:text-yellow-300 font-bold"
                  >
                    <span>Read Community Stories in Feed</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
                  <img 
                    src="/feed/snow_mountain_overland_convoy.jpg" 
                    alt="Cairnwell Pass Expedition" 
                    className="w-full h-72 object-cover"
                  />
                </div>
              </div>
            </div>
          </section>

        </article>
      )}

      {/* ========================================================= */}
      {/* 4. TAB 2: INTERACTIVE INQUIRY & FAQ                       */}
      {/* ========================================================= */}
      {activeTab === 'faq' && (
        <section className="space-y-8 animate-in fade-in duration-300">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-mono-numbers uppercase tracking-[0.3em] text-yellow-700 font-bold block">
              THE INQUIRY & FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-zinc-950">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-zinc-600 font-serif italic">
              Clarifying the technical architecture, zero-knowledge privacy protocols, and custodianship mechanics of DATUM Atelier.
            </p>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="p-4 rounded-3xl bg-white border border-zinc-200/90 shadow-sm space-y-4">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={faqSearchQuery}
                onChange={(e) => setFaqSearchQuery(e.target.value)}
                placeholder="Search queries (e.g. Geofence, Merkle, CAN-bus, Friction, Guilds)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs font-mono-numbers text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs font-mono-numbers">
              {[
                { id: 'all', label: 'All Inquiries' },
                { id: 'privacy', label: 'Privacy & 800m Geofencing' },
                { id: 'provenance', label: 'Merkle DAG Provenance' },
                { id: 'protocol', label: 'Pass Grip Radar' },
                { id: 'guilds', label: 'Guild Ateliers' },
                { id: 'hardware', label: 'Hardware & Telemetry' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveFaqCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full uppercase tracking-wider transition whitespace-nowrap cursor-pointer ${
                    activeFaqCategory === cat.id
                      ? 'bg-yellow-400 text-zinc-950 font-bold shadow-xs border border-yellow-500'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="p-8 text-center rounded-3xl bg-zinc-50 border border-zinc-200 text-zinc-500 text-xs font-mono-numbers">
                No matching inquiries found for "{faqSearchQuery}". Try another keyword or category.
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isExpanded = expandedFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`rounded-2xl border transition-all ${
                      isExpanded
                        ? 'bg-white border-yellow-400/80 shadow-md ring-1 ring-yellow-400/30'
                        : 'bg-white/80 border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <button
                      onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                      className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono-numbers uppercase tracking-wider px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 font-semibold">
                            {faq.tag}
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-zinc-950 font-serif leading-snug">
                          {faq.question}
                        </h4>
                        {!isExpanded && (
                          <p className="text-xs text-zinc-500 font-serif italic mt-1 line-clamp-1">
                            {faq.shortAnswer}
                          </p>
                        )}
                      </div>
                      
                      <div className={`p-1.5 rounded-full border transition-transform duration-200 ${
                        isExpanded ? 'bg-yellow-400 border-yellow-500 text-zinc-950' : 'bg-zinc-100 border-zinc-200 text-zinc-500'
                      }`}>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-zinc-100 space-y-4 animate-in fade-in duration-200">
                        <p className="text-xs sm:text-sm text-zinc-700 font-serif leading-relaxed">
                          {faq.detailedAnswer}
                        </p>
                        
                        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between text-[11px] font-mono-numbers">
                          <span className="text-zinc-500">Architecture Tier: Level 3 & 4 (Kafka / Envoy)</span>
                          <span className="text-emerald-700 font-bold">100% Cryptographically Verified</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Direct Support & Guild Concierge Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 text-white border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-mono-numbers uppercase tracking-widest text-yellow-400 block font-bold">
                PROPRIETARY ARCHITECT
              </span>
              <h3 className="text-lg sm:text-xl font-serif">
                Have a bespoke technical or integration inquiry?
              </h3>
              <p className="text-xs text-zinc-400 font-serif italic">
                Connect directly with the DATUM systems engineering council.
              </p>
            </div>
            <Link
              to="/pro"
              className="px-5 py-2.5 rounded-xl bg-yellow-400 text-zinc-950 font-bold text-xs font-mono-numbers uppercase tracking-wider hover:bg-yellow-300 transition shadow-md whitespace-nowrap"
            >
              Consult System Architect
            </Link>
          </div>

        </section>
      )}

      {/* ========================================================= */}
      {/* 5. TAB 3: LEVEL 1-6 SYSTEM ARCHITECTURE                   */}
      {/* ========================================================= */}
      {activeTab === 'architecture' && (
        <section className="space-y-8 animate-in fade-in duration-300">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-mono-numbers uppercase tracking-[0.3em] text-yellow-700 font-bold block">
              SYSTEM DESIGN PRIMER
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-zinc-950">
              Level 1–6 Distributed System
            </h2>
            <p className="text-xs text-zinc-600 font-serif italic">
              Full-stack architectural blueprint covering ingestion at 600k QPS, Merkle DAG state trees, and multi-region resilience.
            </p>
          </div>

          {/* Architecture Tier Cards */}
          <div className="space-y-6">
            
            {/* Level 1 */}
            <div className="p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <span className="text-xs font-mono-numbers font-bold text-yellow-700 uppercase">LEVEL 1 // PRESENTATION & DSP</span>
                <span className="text-[10px] font-mono-numbers text-zinc-500">React 19 • Web Audio DSP • Tailwind CSS v4</span>
              </div>
              <p className="text-xs text-zinc-700 font-serif leading-relaxed">
                Client layer rendered with zero layout thrashing. Features real-time Web Audio API harmonic synthesis generating procedural starter motor, flat-plane crankshaft, and high-RPM combustion acoustic waveforms.
              </p>
            </div>

            {/* Level 2 */}
            <div className="p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <span className="text-xs font-mono-numbers font-bold text-yellow-700 uppercase">LEVEL 2 // INGRESS & PROTOCOL GATEWAYS</span>
                <span className="text-[10px] font-mono-numbers text-zinc-500">Envoy mTLS • Token Bucket WAF • Cloudflare</span>
              </div>
              <p className="text-xs text-zinc-700 font-serif leading-relaxed">
                Bi-directional gRPC and WebSocket termination handling 600,000 requests per second. Strict token-bucket rate limiters prevent distributed telemetry spoofing and DDoS injection attacks.
              </p>
            </div>

            {/* Level 3 */}
            <div className="p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <span className="text-xs font-mono-numbers font-bold text-yellow-700 uppercase">LEVEL 3 // DOMAIN MICROSERVICES</span>
                <span className="text-[10px] font-mono-numbers text-zinc-500">Go 1.23 • Rust • Python ML Enclaves</span>
              </div>
              <p className="text-xs text-zinc-700 font-serif leading-relaxed">
                Domain engine orchestrating the Digital Twin State Machine, Merkle DAG Provenance Anchor, Pass Grip Radar Adhesion Engine, and Carnet Key Vault.
              </p>
            </div>

            {/* Level 4 */}
            <div className="p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <span className="text-xs font-mono-numbers font-bold text-yellow-700 uppercase">LEVEL 4 // ASYNC STREAMING & EVENT BUS</span>
                <span className="text-[10px] font-mono-numbers text-zinc-500">Apache Kafka • RabbitMQ Workers</span>
              </div>
              <p className="text-xs text-zinc-700 font-serif leading-relaxed">
                High-throughput Kafka topic partitions sharded by VIN hash. Decouples intensive time-series database writes from real-time peer telemetry fanout.
              </p>
            </div>

            {/* Level 5 */}
            <div className="p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <span className="text-xs font-mono-numbers font-bold text-yellow-700 uppercase">LEVEL 5 // PERSISTENCE & STORAGE MATRIX</span>
                <span className="text-[10px] font-mono-numbers text-zinc-500">PostgreSQL (Sharded) • ClickHouse • Redis 7.2</span>
              </div>
              <p className="text-xs text-zinc-700 font-serif leading-relaxed">
                Dual storage engine utilizing PostgreSQL for ACID metadata and relational identity, paired with ClickHouse for Petabyte-scale compressed CAN-bus sensor logs at 90% compression ratio.
              </p>
            </div>

            {/* Level 6 */}
            <div className="p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <span className="text-xs font-mono-numbers font-bold text-yellow-700 uppercase">LEVEL 6 // RELIABILITY, FMEA & RECOVERY</span>
                <span className="text-[10px] font-mono-numbers text-zinc-500">Active-Passive Multi-Region • RTO &lt; 30s • RPO = 0</span>
              </div>
              <p className="text-xs text-zinc-700 font-serif leading-relaxed">
                Zero data-loss architecture with dead-letter queue retries, automated failover circuit breakers, and sub-second cryptographic state rollback protection.
              </p>
            </div>

          </div>

        </section>
      )}

      {/* ========================================================= */}
      {/* 6. TAB 4: INTERACTIVE ENGINEERING LAB SIMULATORS         */}
      {/* ========================================================= */}
      {activeTab === 'lab' && (
        <section className="space-y-8 animate-in fade-in duration-300">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-mono-numbers uppercase tracking-[0.3em] text-yellow-700 font-bold block">
              THE WORKSHOP ANNEX
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-zinc-950">
              Interactive Engineering Simulators
            </h2>
            <p className="text-xs text-zinc-600 font-serif italic">
              Live algorithmic simulations of zero-knowledge cloaking, Merkle tree verification, and thermodynamic road friction.
            </p>
          </div>

          {/* Simulator 1: Zero Knowledge Geofence */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono-numbers uppercase text-yellow-700 font-bold">SIMULATOR 01 // PRIVACY</span>
              <span className="text-xs font-mono-numbers text-zinc-500">Zero-Knowledge Residential Cloaking</span>
            </div>
            <h3 className="text-xl font-bold font-luxury-display uppercase text-zinc-950">
              800m Residential Coordinate Truncation
            </h3>
            <p className="text-xs text-zinc-600 font-serif">
              Drag the radius slider to inspect how GPS vectors are dynamically clipped before leaving the vehicle client.
            </p>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
              <div className="flex justify-between text-xs font-mono-numbers">
                <span className="text-zinc-500">Cloaking Radius:</span>
                <strong className="text-zinc-950 font-bold">{geofenceRadius} meters</strong>
              </div>
              <input
                type="range"
                min="100"
                max="2000"
                step="50"
                value={geofenceRadius}
                onChange={(e) => setGeofenceRadius(Number(e.target.value))}
                className="w-full accent-yellow-500 cursor-pointer"
              />
              <div className="p-3 rounded-xl bg-zinc-950 text-white font-mono-numbers text-[11px] space-y-1">
                <div className="text-yellow-400 font-bold">Encrypted Ingress Vector:</div>
                <div className="text-zinc-400">Raw Coordinate: 51.5074° N, 0.1278° W</div>
                <div className="text-emerald-400">Broadcast Vector: 51.51**° N, 0.13**° W (Offset: +{geofenceRadius}m cryptohash)</div>
              </div>
            </div>
          </div>

          {/* Simulator 2: Merkle Proof Verifier */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono-numbers uppercase text-emerald-700 font-bold">SIMULATOR 02 // PROVENANCE</span>
              <span className="text-xs font-mono-numbers text-zinc-500">Cryptographic Merkle Integrity</span>
            </div>
            <h3 className="text-xl font-bold font-luxury-display uppercase text-zinc-950">
              Digital Twin Merkle Tree Validator
            </h3>
            <p className="text-xs text-zinc-600 font-serif">
              Simulate an unauthorized maintenance tampering attempt to watch parent SHA-256 hashes recalculate and reject the ledger block.
            </p>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
              <button
                onClick={() => setMerkleTampered(!merkleTampered)}
                className={`px-4 py-2 rounded-xl text-xs font-mono-numbers font-bold uppercase transition cursor-pointer ${
                  merkleTampered ? 'bg-red-600 text-white shadow-sm' : 'bg-yellow-400 text-zinc-950 shadow-sm'
                }`}
              >
                {merkleTampered ? 'Reset to Genuine Block' : 'Simulate Forged Mileage / Service Entry'}
              </button>

              <div className={`p-3 rounded-xl font-mono-numbers text-[11px] border ${
                merkleTampered ? 'bg-red-950/20 border-red-500 text-red-700' : 'bg-emerald-950/10 border-emerald-500 text-emerald-800'
              }`}>
                <div className="font-bold">
                  {merkleTampered ? '⚠️ MERKLE INTEGRITY FAULT: ROOT HASH MISMATCH' : '✓ MERKLE DAG INTEGRITY: VERIFIED'}
                </div>
                <div className="text-[10px] text-zinc-600 mt-1">
                  Root Hash: {merkleTampered ? '0x9fa81... [REJECTED BY CONSENSUS]' : '0x4e29b18274a10f82... [AUTHENTIC]'}
                </div>
              </div>
            </div>
          </div>

          {/* Simulator 3: Road Friction Calculator */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono-numbers uppercase text-sky-700 font-bold">SIMULATOR 03 // RADAR</span>
              <span className="text-xs font-mono-numbers text-zinc-500">Thermodynamic Road Friction (μ)</span>
            </div>
            <h3 className="text-xl font-bold font-luxury-display uppercase text-zinc-950">
              Pass Grip Dynamic Adhesion Engine
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono-numbers">
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2">
                <span className="text-zinc-500 uppercase text-[10px]">Precipitation</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsRaining(false)}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition cursor-pointer ${!isRaining ? 'bg-yellow-400 text-zinc-950' : 'bg-zinc-200 text-zinc-600'}`}
                  >
                    Dry
                  </button>
                  <button
                    onClick={() => setIsRaining(true)}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition cursor-pointer ${isRaining ? 'bg-sky-600 text-white' : 'bg-zinc-200 text-zinc-600'}`}
                  >
                    Wet Spray
                  </button>
                </div>
              </div>

              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2">
                <span className="text-zinc-500 uppercase text-[10px]">Frost / Ice</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsFrost(false)}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition cursor-pointer ${!isFrost ? 'bg-yellow-400 text-zinc-950' : 'bg-zinc-200 text-zinc-600'}`}
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setIsFrost(true)}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition cursor-pointer ${isFrost ? 'bg-cyan-600 text-white' : 'bg-zinc-200 text-zinc-600'}`}
                  >
                    Black Ice
                  </button>
                </div>
              </div>

              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 sm:col-span-2 space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-500 uppercase text-[10px]">Tyre Bulk Temperature:</span>
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

            <div className="p-6 rounded-2xl bg-zinc-950 text-white text-center space-y-1">
              <span className="text-[10px] font-mono-numbers uppercase tracking-widest text-zinc-400">
                CALCULATED ROAD ADHESION COEFFICIENT
              </span>
              <div className="text-4xl sm:text-5xl font-black font-luxury-display text-yellow-400">
                μ {calculatedMu.toFixed(2)}
              </div>
              <p className="text-xs font-mono-numbers text-zinc-400">
                {calculatedMu > 0.75 ? (
                  <span className="text-emerald-400 font-bold">Optimal Track Adhesion</span>
                ) : calculatedMu > 0.45 ? (
                  <span className="text-yellow-400 font-bold">Moderate Damp Surface • Exercise Throttle Prudence</span>
                ) : (
                  <span className="text-red-400 font-bold">Severe Slip Hazard • Engage Wet / Snow Mode</span>
                )}
              </p>
            </div>

          </div>

        </section>
      )}

      {/* ========================================================= */}
      {/* 7. TAB 5: HAUTE HORLOGERIE DESIGN SYSTEM TOKENS           */}
      {/* ========================================================= */}
      {activeTab === 'design-system' && (
        <section className="space-y-8 animate-in fade-in duration-300">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-mono-numbers uppercase tracking-[0.3em] text-yellow-700 font-bold block">
              DESIGN SYSTEM SPECIFICATION
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-zinc-950">
              Haute Horlogerie Tokens
            </h2>
            <p className="text-xs text-zinc-600 font-serif italic">
              The aesthetic grammar of DATUM Atelier: typography, calibrated palettes, and micro-elevation tokens.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono-numbers">
            
            {/* Color Palette */}
            <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-3">
              <h4 className="font-bold text-zinc-950 uppercase text-xs">Calibrated Palette</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-zinc-50 border border-zinc-200">
                  <div className="w-6 h-6 rounded-full bg-yellow-400 border border-yellow-500 shadow-xs" />
                  <div>
                    <strong className="block text-zinc-950">Racing Yellow</strong>
                    <span className="text-[10px] text-zinc-500">#FACC15 / Accent & RPM</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-zinc-50 border border-zinc-200">
                  <div className="w-6 h-6 rounded-full bg-white border border-zinc-300 shadow-xs" />
                  <div>
                    <strong className="block text-zinc-950">Pure Atelier White</strong>
                    <span className="text-[10px] text-zinc-500">#FFFFFF / Cleanroom Plinth</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-zinc-50 border border-zinc-200">
                  <div className="w-6 h-6 rounded-full bg-zinc-950 border border-zinc-800 shadow-xs" />
                  <div>
                    <strong className="block text-zinc-950">Obsidian Slate</strong>
                    <span className="text-[10px] text-zinc-500">#09090B / Deep Carbon</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Typography */}
            <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-3">
              <h4 className="font-bold text-zinc-950 uppercase text-xs">Typographic Hierarchy</h4>
              <div className="space-y-2">
                <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-200">
                  <span className="text-[10px] text-zinc-500 uppercase block">Headlines</span>
                  <span className="font-luxury-display uppercase text-sm font-bold text-zinc-950">Cinzel / Syne</span>
                </div>
                <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-200">
                  <span className="text-[10px] text-zinc-500 uppercase block">Editorial Prose</span>
                  <span className="font-serif text-sm text-zinc-950">Playfair / Cormorant</span>
                </div>
                <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-200">
                  <span className="text-[10px] text-zinc-500 uppercase block">Telemetry & Gauges</span>
                  <span className="font-mono-numbers text-sm text-zinc-950">Space Mono / JetBrains</span>
                </div>
              </div>
            </div>

            {/* Spatial Tokens */}
            <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-3">
              <h4 className="font-bold text-zinc-950 uppercase text-xs">Spatial Elevations</h4>
              <div className="space-y-2">
                <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-200">
                  <span className="text-[10px] text-zinc-500 uppercase block">Plinth Radius</span>
                  <span className="text-xs font-bold text-zinc-950">rounded-3xl (24px)</span>
                </div>
                <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-200">
                  <span className="text-[10px] text-zinc-500 uppercase block">Hairline Borders</span>
                  <span className="text-xs font-bold text-zinc-950">border-zinc-200/80</span>
                </div>
                <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-200">
                  <span className="text-[10px] text-zinc-500 uppercase block">Backdrop Filter</span>
                  <span className="text-xs font-bold text-zinc-950">backdrop-blur-xl</span>
                </div>
              </div>
            </div>

          </div>

        </section>
      )}

      {/* ========================================================= */}
      {/* 8. FOOTER COLOPHON                                        */}
      {/* ========================================================= */}
      <footer className="mt-16 pt-8 border-t border-zinc-200 text-center text-xs font-mono-numbers text-zinc-500 space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] uppercase tracking-widest">
          <span>DATUM ATELIER // ISSUE 04</span>
          <span>•</span>
          <span>100% PROPRIETARY CODEBASE</span>
          <span>•</span>
          <span>AUTHORED BY vD</span>
        </div>
        <p className="text-[11px] font-serif italic text-zinc-400">
          Published with cryptographic integrity for the discerning automotive community.
        </p>
      </footer>

    </div>
  );
};
