import { useState } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Search
} from 'lucide-react';

interface FAQItem {
  id: string;
  num: string;
  category: 'protocol' | 'provenance' | 'privacy' | 'hardware' | 'guilds';
  question: string;
  shortAnswer: string;
  detailedAnswer: string;
  tier: string;
}

export const AboutCaseStudyPage: FC = () => {
  const { isWhiteYellow } = useTheme();
  
  // Navigation tabs
  const [activeSection, setActiveSection] = useState<'all' | 'manifesto' | 'architecture' | 'lab' | 'faq'>('all');

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

  // Architecture Tier Filter
  const [selectedArchTier, setSelectedArchTier] = useState<number>(1);

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
      num: '01',
      category: 'privacy',
      tier: 'Level 2 Ingress / Zero-Knowledge Protocol',
      question: 'How does DATUM guarantee private home address security during public drive broadcasts?',
      shortAnswer: 'Deterministic 800-meter vector truncation enforced locally at the client boundary before packet transmission.',
      detailedAnswer: 'Every telemetry stream and GPS route trace is automatically clipped at an exact 800-meter radius around verified residential anchors before leaving the user\'s local client enclave. Vectors are cryptographically truncated and salted before ingestion into public or guild event logs. This mathematical boundary ensures home garages remain completely invisible on public maps while preserving open-road track data and driving dynamics.'
    },
    {
      id: 'faq-2',
      num: '02',
      category: 'provenance',
      tier: 'Level 3 Domain / Merkle DAG Ledger',
      question: 'How does the DATUM Digital Twin differ from a conventional physical service book?',
      shortAnswer: 'An immutable cryptographic Merkle DAG binding every maintenance event to an authorized Ed25519 signature.',
      detailedAnswer: 'Conventional service books rely on easily forged paper stamps or siloed dealership databases that evaporate upon sale. DATUM links each vehicle VIN to a Merkle Directed Acyclic Graph (DAG). Every maintenance event, torque specification, dyno run, and ECU calibration is signed with an authorized mechanic\'s Ed25519 keypair and hashed into an immutable ledger block, providing tamper-evident mathematical proof of heritage and mechanical integrity.'
    },
    {
      id: 'faq-3',
      num: '03',
      category: 'hardware',
      tier: 'Level 1 Client / Heritage Carnet Protocol',
      question: 'Can classic and analog vehicles without modern CAN-bus systems participate?',
      shortAnswer: 'Yes. Heritage Carnet Mode provides high-resolution photographic, acoustic, and analog sensor anchoring.',
      detailedAnswer: 'Vintage and classic custodians use DATUM\'s Heritage Carnet Mode. High-resolution photographic scans of period documentation, Weber carburetor balance sheets, dyno printouts, and master engineer voice memos are timestamped and cryptographically anchored into the vehicle\'s permanent dossier. Optional BLE analog telemetry sensors can also monitor oil pressure, coolant temp, and cylinder head thermals.'
    },
    {
      id: 'faq-4',
      num: '04',
      category: 'protocol',
      tier: 'Level 3 & 4 / Pass Grip Radar Engine',
      question: 'How does the Pass Grip Radar calculate dynamic road friction (μ) in real time?',
      shortAnswer: 'By fusing live Doppler weather feeds with peer vehicle ABS slip-angles and thermodynamic tyre curves.',
      detailedAnswer: 'The radar synthesizes micro-climate meteorological radar feeds with live telemetry from convoy vehicles traversing mountain passes. It models the thermodynamic adhesion equation: μ = μ_dry - Δμ_precip - Δμ_frost + (T_tyre - 20°C) × 0.0025. This dynamically alerts drivers to black ice or standing surface water on iconic routes like Snake Pass (A57) and Bealach na Bà before they enter hazardous corners.'
    },
    {
      id: 'faq-5',
      num: '05',
      category: 'guilds',
      tier: 'Level 3 Domain / Multi-Sig Atelier Protocol',
      question: 'How does collective garage access and multi-signature bay booking work?',
      shortAnswer: 'Time-locked cryptographic NFC passes authorized by a multi-signature guild council of peer owners.',
      detailedAnswer: 'Guild ateliers operate as decentralized collector cooperatives. Physical access to shared four-post lifts, calibrated Snap-on tool chests, and climate-controlled storage is orchestrated through temporary time-locked NFC credentials signed by the guild\'s multi-signature council. Equipment usage and consumable parts are automatically reconciled against the guild\'s collective maintenance treasury.'
    },
    {
      id: 'faq-6',
      num: '06',
      category: 'hardware',
      tier: 'Level 2 Ingress / Envoy mTLS Gateway',
      question: 'Is DATUM compatible with motorsport telemetry systems like MoTeC and AiM?',
      shortAnswer: 'Yes. High-speed bidirectional gRPC and WebSocket ingestion pipelines support standard motorsport data formats.',
      detailedAnswer: 'DATUM provides bidirectional gRPC and WebSocket API endpoints for MoTeC, AiM, RaceCapture, and custom ESP32 CAN-bus bridges. All external telemetry is validated through Envoy mTLS gateways with strict token-bucket rate limits handling up to 600,000 QPS at 10 Hz per active vehicle.'
    },
    {
      id: 'faq-7',
      num: '07',
      category: 'provenance',
      tier: 'Sovereign Code Ownership & IP',
      question: 'Who owns the intellectual property and codebase of DATUM Atelier?',
      shortAnswer: '100% of the DATUM Atelier architecture and codebase are proprietary assets authored exclusively by vD.',
      detailedAnswer: 'DATUM Atelier is built under strict sovereign code custody. All system designs, UI implementations, mathematical friction models, and cryptographic algorithms are exclusively owned and authored by vD (<vD@users.noreply.github.com>).'
    }
  ];

  // Filtered FAQs
  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeFaqCategory === 'all' || faq.category === activeFaqCategory;
    const matchesSearch = faq.question.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
                          faq.detailedAnswer.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
                          faq.tier.toLowerCase().includes(faqSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const architectureTiers = [
    {
      level: 1,
      name: 'Presentation & DSP Synthesis',
      stack: 'React 19 • Web Audio DSP • Tailwind CSS v4',
      latency: '< 16ms Frame Budget',
      description: 'Zero layout thrashing client layer featuring real-time Web Audio API harmonic synthesis that generates procedural flat-plane V8 crankshaft, starter motor, and high-RPM combustion acoustic waveforms.',
      specs: ['Web Audio API Oscillator Nodes', 'Harmonic Sine & Square Distortion Waves', 'GPU Hardware Acceleration']
    },
    {
      level: 2,
      name: 'Ingress & Protocol Gateways',
      stack: 'Envoy mTLS • Token Bucket WAF • Cloudflare',
      latency: '600k QPS Peak Throughput',
      description: 'Bi-directional gRPC and WebSocket termination handling 600,000 requests per second. Strict token-bucket rate limiters prevent distributed telemetry spoofing and DDoS injection attacks.',
      specs: ['Mutual TLS (mTLS) Vehicle Auth', 'Token Bucket Rate Limiting (50 req/s)', 'Zero-Knowledge Vector Ingress Truncation']
    },
    {
      level: 3,
      name: 'Domain Microservices',
      stack: 'Go 1.23 • Rust • Python ML Enclaves',
      latency: '< 15ms Internal Service RPC',
      description: 'Domain core orchestrating the Digital Twin State Machine, Merkle DAG Provenance Anchor, Pass Grip Radar Adhesion Engine, and Carnet Key Vault.',
      specs: ['Digital Twin State Engine', 'Merkle Directed Acyclic Graph Verifier', 'Thermodynamic Adhesion Engine (μ)']
    },
    {
      level: 4,
      name: 'Async Streaming & Event Bus',
      stack: 'Apache Kafka • RabbitMQ Workers',
      latency: '10 Hz Telemetry Fan-out',
      description: 'High-throughput Kafka topic partitions sharded by VIN hash. Decouples intensive time-series database writes from real-time peer telemetry fanout.',
      specs: ['12 Kafka Partitions sharded by VIN', 'Consumer Groups for Radar & Provenance', 'RabbitMQ Worker Queues for Media Transcoding']
    },
    {
      level: 5,
      name: 'Persistence & Dual Storage',
      stack: 'PostgreSQL (Sharded) • ClickHouse • Redis 7.2',
      latency: '< 45ms P99 Read Latency',
      description: 'Dual storage engine utilizing PostgreSQL for ACID metadata and relational identity, paired with ClickHouse for Petabyte-scale compressed CAN-bus sensor logs at 90% compression ratio.',
      specs: ['PostgreSQL Sharded by (VIN % 4)', 'ClickHouse Columnar Storage (118 TB 3yr)', 'Redis Cluster L1/L2 Cache']
    },
    {
      level: 6,
      name: 'Reliability & Fault Tolerance',
      stack: 'Active-Passive Multi-Region • RTO < 30s • RPO = 0',
      latency: '99.99% Availability SLA',
      description: 'Zero data-loss architecture with dead-letter queue retries, automated failover circuit breakers, and sub-second cryptographic state rollback protection.',
      specs: ['Automated Regional Failover', 'Dead Letter Queue (DLQ) Exponential Retries', 'Cryptographic Rollback Prevention']
    }
  ];

  return (
    <main className={`min-h-screen transition-colors duration-500 pb-24 ${
      isWhiteYellow ? 'bg-[#FAFAF8] text-zinc-900' : 'bg-[#09090B] text-zinc-100'
    }`}>
      
      {/* ========================================================= */}
      {/* 1. VOGUE EDITORIAL FOLIO & LUXURY COVER MASTHEAD          */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-10 sm:pt-16 pb-12 border-b border-black/[0.08]">
        
        {/* Top Folio Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-[10px] font-mono-numbers uppercase tracking-[0.35em] text-zinc-400 border-b border-black/[0.06] pb-4 mb-8">
          <div className="flex items-center gap-3">
            <span className="font-bold text-zinc-900 bg-yellow-400 px-2 py-0.5 rounded-xs">FOLIO 04</span>
            <span>THE ATELIER MONOGRAPH</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <span>EDITION DE LUXE</span>
            <span>•</span>
            <span>MAYFAIR // EDINBURGH // STUTTGART</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-800 font-semibold">
            <Sparkles className="w-3 h-3 text-yellow-600" />
            <span>DIRECTED BY vD</span>
          </div>
        </div>

        {/* Hero Editorial Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          
          {/* Main Title */}
          <div className="lg:col-span-8 space-y-4">
            <span className="text-[11px] font-mono-numbers uppercase tracking-[0.4em] text-yellow-700 font-semibold block">
              SYSTEM DESIGN & CUSTODIANSHIP ESSAY
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-light font-luxury-editorial leading-[0.95] tracking-tight text-zinc-950">
              The Architecture <br />
              <span className="italic font-serif font-normal text-yellow-600">of Pure Custodianship.</span>
            </h1>
          </div>

          {/* Issue Meta & Lead */}
          <div className="lg:col-span-4 space-y-4 border-l border-black/[0.08] pl-0 lg:pl-8 pb-2">
            <p className="text-xs sm:text-sm font-luxury-editorial text-zinc-600 leading-relaxed italic">
              "A definitive blueprint replacing ephemeral algorithmic feeds with cryptographic provenance, zero-knowledge residential cloaking, and generational automotive camaraderie."
            </p>
            <div className="pt-2 flex items-center justify-between text-[10px] font-mono-numbers text-zinc-400 uppercase tracking-widest border-t border-black/[0.06]">
              <span>VOL. IV // ISS. 01</span>
              <span className="text-zinc-900 font-bold">100% PROPRIETARY</span>
            </div>
          </div>

        </div>

        {/* Editorial Chapter Switcher Tabs */}
        <div className="mt-12 flex items-center gap-2 overflow-x-auto no-scrollbar pt-4 border-t border-black/[0.06]">
          {[
            { id: 'all', label: 'Complete Monograph', num: '00' },
            { id: 'manifesto', label: 'The Manifesto & Problem', num: '01' },
            { id: 'architecture', label: 'Level 1–6 Distributed System', num: '02' },
            { id: 'lab', label: 'Interactive Engineering Lab', num: '03' },
            { id: 'faq', label: 'The Technical Inquiry (FAQ)', num: '04' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex items-center gap-2.5 px-4 py-2 text-xs font-mono-numbers uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeSection === tab.id
                  ? 'border-b-2 border-zinc-950 text-zinc-950 font-bold -mb-px pb-2'
                  : 'text-zinc-500 hover:text-zinc-950 pb-2'
              }`}
            >
              <span className="text-[10px] text-yellow-600 font-bold">[{tab.num}]</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

      </section>

      {/* ========================================================= */}
      {/* 2. SECTION 01: THE MANIFESTO & THE PROBLEM                */}
      {/* ========================================================= */}
      {(activeSection === 'all' || activeSection === 'manifesto') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 border-b border-black/[0.08]">
          
          {/* Section Marker */}
          <div className="flex items-center justify-between text-[10px] font-mono-numbers uppercase tracking-[0.3em] text-zinc-400 mb-8">
            <span className="text-yellow-700 font-bold">CHAPTER 01 // THE MANIFESTO</span>
            <span>READING TIME: 4 MIN</span>
          </div>

          {/* 12-Column Asymmetrical Editorial Spread */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Editorial Text Spread */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-luxury-editorial text-zinc-950 leading-tight">
                Modern car culture is broken by advertising algorithms. We built its mathematical antidote.
              </h2>

              <div className="space-y-4 text-sm sm:text-base font-luxury-editorial text-zinc-700 leading-relaxed">
                <p className="first-letter:text-6xl first-letter:font-luxury-editorial first-letter:float-left first-letter:mr-3 first-letter:font-bold first-letter:text-zinc-950 first-letter:leading-none">
                  For the past two decades, genuine automotive culture has been fractured across fragmented WhatsApp group chats, ephemeral Instagram stories, and easily forged paper binder histories. The sacred relationship between custodian and machine has been reduced to click-driven noise and speculative auction flipping.
                </p>
                <p>
                  DATUM Atelier reclaims this domain through the tenets of haute horlogerie. We treat high-performance vehicles not as disposable content, but as living, evolving historical assets requiring mathematically immutable provenance, peer-to-peer engineering support, and sovereign privacy safeguards.
                </p>
              </div>

              {/* Editorial Pull Quote */}
              <blockquote className="my-8 pl-6 border-l-2 border-yellow-500 py-2">
                <p className="text-xl sm:text-2xl font-luxury-editorial italic text-zinc-900 leading-relaxed">
                  "A vehicle's true worth is forged in the integrity of its telemetry, the honesty of its torque specifications, and the camaraderie of the convoy that pulls you through the mountain pass."
                </p>
                <cite className="block mt-3 text-xs font-mono-numbers uppercase tracking-widest text-zinc-500 not-italic">
                  — DATUM Sovereign Custody Manifesto
                </cite>
              </blockquote>
            </div>

            {/* Right Column: Curated Photo Plate & Key Metrics */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Photo Plate 01 */}
              <figure className="group overflow-hidden border border-black/[0.08] shadow-sm bg-zinc-900">
                <img 
                  src="/feed/stone_garage_cobra_ferrari.jpg" 
                  alt="Open stone garage sanctuary" 
                  className="w-full h-80 object-cover group-hover:scale-103 transition-transform duration-700"
                />
                <figcaption className="p-4 bg-zinc-950 text-white">
                  <div className="flex justify-between items-center text-[10px] font-mono-numbers uppercase tracking-widest text-zinc-400 mb-1">
                    <span>PLATE 01 // CUSTODIAL SANCTUARY</span>
                    <span className="text-yellow-400">COTSWOLDS, UK</span>
                  </div>
                  <p className="text-xs text-zinc-300 font-luxury-editorial italic">
                    Shelby 427 & 488 Spider sharing private stone quarters under verified zero-knowledge cloaking.
                  </p>
                </figcaption>
              </figure>

              {/* Minimal Metric Trio */}
              <div className="grid grid-cols-3 gap-3 text-xs font-mono-numbers">
                <div className="p-4 border border-black/[0.08] bg-white">
                  <span className="text-[10px] text-zinc-400 block uppercase">Cloak Radius</span>
                  <strong className="text-base font-bold text-zinc-950 block mt-1">800m</strong>
                  <span className="text-[9px] text-emerald-700 uppercase font-semibold">Zero-Knowledge</span>
                </div>

                <div className="p-4 border border-black/[0.08] bg-white">
                  <span className="text-[10px] text-zinc-400 block uppercase">Ingestion</span>
                  <strong className="text-base font-bold text-yellow-600 block mt-1">600k QPS</strong>
                  <span className="text-[9px] text-zinc-500 uppercase">Kafka Stream</span>
                </div>

                <div className="p-4 border border-black/[0.08] bg-white">
                  <span className="text-[10px] text-zinc-400 block uppercase">Provenance</span>
                  <strong className="text-base font-bold text-zinc-950 block mt-1">Merkle DAG</strong>
                  <span className="text-[9px] text-zinc-500 uppercase">Ed25519 Sign</span>
                </div>
              </div>

            </div>

          </div>

          {/* The Four Tenets Strip */}
          <div className="mt-16 pt-12 border-t border-black/[0.08]">
            <div className="mb-8">
              <span className="text-[10px] font-mono-numbers uppercase tracking-[0.3em] text-yellow-700 font-bold block mb-1">
                SYSTEM PRINCIPLES
              </span>
              <h3 className="text-2xl sm:text-3xl font-luxury-editorial text-zinc-950">
                The Four Pillars of DATUM
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-6 border border-black/[0.08] bg-white space-y-3">
                <span className="text-xs font-mono-numbers text-yellow-600 font-bold block">[ 01 ]</span>
                <h4 className="text-sm font-bold uppercase tracking-wider font-luxury-display text-zinc-950">
                  The Living Digital Twin
                </h4>
                <p className="text-xs font-luxury-editorial text-zinc-600 leading-relaxed">
                  Real-time CAN-bus synchronization tracking brake pad thermals, oil degradation curves, and suspension dampening cycles with mathematical precision.
                </p>
              </div>

              <div className="p-6 border border-black/[0.08] bg-white space-y-3">
                <span className="text-xs font-mono-numbers text-yellow-600 font-bold block">[ 02 ]</span>
                <h4 className="text-sm font-bold uppercase tracking-wider font-luxury-display text-zinc-950">
                  Shared Guild Ateliers
                </h4>
                <p className="text-xs font-luxury-editorial text-zinc-600 leading-relaxed">
                  Decentralized collector workshops granting multi-signature NFC access to hydraulic lifts, tire warmers, and clean-room assembly benches.
                </p>
              </div>

              <div className="p-6 border border-black/[0.08] bg-white space-y-3">
                <span className="text-xs font-mono-numbers text-yellow-600 font-bold block">[ 03 ]</span>
                <h4 className="text-sm font-bold uppercase tracking-wider font-luxury-display text-zinc-950">
                  Pass Grip Radar
                </h4>
                <p className="text-xs font-luxury-editorial text-zinc-600 leading-relaxed">
                  Dynamic road friction ($\mu$) calculation synthesizing atmospheric radar with tyre carcass thermal curves before tires touch mountain pass asphalt.
                </p>
              </div>

              <div className="p-6 border border-black/[0.08] bg-white space-y-3">
                <span className="text-xs font-mono-numbers text-yellow-600 font-bold block">[ 04 ]</span>
                <h4 className="text-sm font-bold uppercase tracking-wider font-luxury-display text-zinc-950">
                  Autonomous Carnet
                </h4>
                <p className="text-xs font-luxury-editorial text-zinc-600 leading-relaxed">
                  Tamper-evident vehicle passports powered by Merkle DAGs. Proof of maintenance and track history transferred without disclosing private ownership identity.
                </p>
              </div>

            </div>
          </div>

        </section>
      )}

      {/* ========================================================= */}
      {/* 3. SECTION 02: LEVEL 1-6 DISTRIBUTED SYSTEM DESIGN        */}
      {/* ========================================================= */}
      {(activeSection === 'all' || activeSection === 'architecture') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 border-b border-black/[0.08]">
          
          <div className="flex items-center justify-between text-[10px] font-mono-numbers uppercase tracking-[0.3em] text-zinc-400 mb-8">
            <span className="text-yellow-700 font-bold">CHAPTER 02 // DISTRIBUTED SYSTEM DESIGN</span>
            <span>DONNE MARTIN PRIMER SPECIFICATION</span>
          </div>

          <div className="max-w-3xl mb-12 space-y-3">
            <h2 className="text-3xl sm:text-5xl font-luxury-editorial text-zinc-950">
              Level 1 to 6 Architectural Specification
            </h2>
            <p className="text-xs sm:text-sm font-luxury-editorial text-zinc-600 italic">
              Engineered to ingest 600,000 CAN-bus queries per second across 10 Hz telemetry streams with sub-45ms P99 latency.
            </p>
          </div>

          {/* Interactive Tier Browser */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Tier Selection Strip */}
            <div className="lg:col-span-4 space-y-2">
              {architectureTiers.map((tier) => (
                <button
                  key={tier.level}
                  onClick={() => setSelectedArchTier(tier.level)}
                  className={`w-full text-left p-4 border transition-all cursor-pointer ${
                    selectedArchTier === tier.level
                      ? 'bg-zinc-950 text-white border-zinc-950 shadow-md'
                      : 'bg-white text-zinc-700 border-black/[0.08] hover:border-zinc-400'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] font-mono-numbers uppercase tracking-wider mb-1">
                    <span className={selectedArchTier === tier.level ? 'text-yellow-400 font-bold' : 'text-zinc-400'}>
                      LEVEL 0{tier.level}
                    </span>
                    <span className="text-[9px] opacity-75">{tier.latency}</span>
                  </div>
                  <div className="text-xs font-bold font-luxury-display uppercase truncate">
                    {tier.name}
                  </div>
                </button>
              ))}
            </div>

            {/* Right: Selected Tier Blueprint Dossier */}
            <div className="lg:col-span-8 p-8 border border-black/[0.08] bg-white space-y-6">
              {(() => {
                const tier = architectureTiers.find(t => t.level === selectedArchTier) || architectureTiers[0];
                return (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/[0.08] pb-4">
                      <div>
                        <span className="text-[10px] font-mono-numbers uppercase tracking-widest text-yellow-700 font-bold block">
                          TIER LEVEL 0{tier.level} DOSSIER
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold font-luxury-display uppercase text-zinc-950">
                          {tier.name}
                        </h3>
                      </div>
                      <span className="text-xs font-mono-numbers px-3 py-1 bg-zinc-100 border border-zinc-200 text-zinc-800 font-semibold">
                        {tier.latency}
                      </span>
                    </div>

                    <div className="space-y-2 font-mono-numbers text-xs">
                      <span className="text-[10px] text-zinc-400 uppercase block">Technology Stack:</span>
                      <div className="p-3 bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold">
                        {tier.stack}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-mono-numbers text-zinc-400 uppercase block">Architectural Role:</span>
                      <p className="text-sm font-luxury-editorial text-zinc-700 leading-relaxed">
                        {tier.description}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-black/[0.06]">
                      <span className="text-[10px] font-mono-numbers text-zinc-400 uppercase block">Key Technical Guarantees:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {tier.specs.map((spec, idx) => (
                          <div key={idx} className="p-2.5 bg-zinc-50 border border-zinc-200 text-[11px] font-mono-numbers text-zinc-800">
                            ✓ {spec}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

          </div>

        </section>
      )}

      {/* ========================================================= */}
      {/* 4. SECTION 03: THE INTERACTIVE ENGINEERING LAB ANNEX      */}
      {/* ========================================================= */}
      {(activeSection === 'all' || activeSection === 'lab') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 border-b border-black/[0.08]">
          
          <div className="flex items-center justify-between text-[10px] font-mono-numbers uppercase tracking-[0.3em] text-zinc-400 mb-8">
            <span className="text-yellow-700 font-bold">CHAPTER 03 // THE ENGINEERING ANNEX</span>
            <span>3 LIVE ALGORITHMIC SIMULATORS</span>
          </div>

          <div className="max-w-3xl mb-12 space-y-3">
            <h2 className="text-3xl sm:text-5xl font-luxury-editorial text-zinc-950">
              Interactive Mathematical Prototyping
            </h2>
            <p className="text-xs sm:text-sm font-luxury-editorial text-zinc-600 italic">
              Directly manipulate the parameters governing residential coordinate cloaking, Merkle tree tampering detection, and road adhesion physics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Lab 1: 800m Geofencing */}
            <div className="p-6 border border-black/[0.08] bg-white space-y-4">
              <div className="flex justify-between items-center text-[10px] font-mono-numbers text-zinc-400 uppercase tracking-wider">
                <span>SIMULATOR 01</span>
                <span className="text-emerald-700 font-bold">PRIVACY</span>
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider font-luxury-display text-zinc-950">
                Zero-Knowledge 800m Truncation
              </h3>
              <p className="text-xs font-luxury-editorial text-zinc-600">
                Adjust the cloaking perimeter to observe real-time vector coordinate masking.
              </p>

              <div className="p-4 bg-zinc-50 border border-zinc-200 space-y-3 font-mono-numbers text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Radius:</span>
                  <strong className="text-zinc-950">{geofenceRadius} meters</strong>
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
                <div className="p-2.5 bg-zinc-950 text-white text-[10px] rounded-xs space-y-1">
                  <div className="text-yellow-400 font-bold">Client Ingress Boundary:</div>
                  <div className="text-zinc-400">Raw: 51.5074° N, 0.1278° W</div>
                  <div className="text-emerald-400">Masked: 51.51**° N (+{geofenceRadius}m hash)</div>
                </div>
              </div>
            </div>

            {/* Lab 2: Merkle Tree Validator */}
            <div className="p-6 border border-black/[0.08] bg-white space-y-4">
              <div className="flex justify-between items-center text-[10px] font-mono-numbers text-zinc-400 uppercase tracking-wider">
                <span>SIMULATOR 02</span>
                <span className="text-yellow-700 font-bold">PROVENANCE</span>
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider font-luxury-display text-zinc-950">
                Merkle DAG Integrity Engine
              </h3>
              <p className="text-xs font-luxury-editorial text-zinc-600">
                Simulate an unauthorized odometer tamper to trigger cryptographic rejection.
              </p>

              <div className="p-4 bg-zinc-50 border border-zinc-200 space-y-3 font-mono-numbers text-xs">
                <button
                  onClick={() => setMerkleTampered(!merkleTampered)}
                  className={`w-full py-2 px-3 text-[11px] font-bold uppercase transition cursor-pointer border ${
                    merkleTampered
                      ? 'bg-red-600 text-white border-red-700'
                      : 'bg-yellow-400 text-zinc-950 border-yellow-500 hover:bg-yellow-300'
                  }`}
                >
                  {merkleTampered ? 'Restore Genuine DAG' : 'Simulate Forged Mileage Entry'}
                </button>
                <div className={`p-2.5 text-[10px] border ${
                  merkleTampered ? 'bg-red-50 text-red-800 border-red-300' : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                }`}>
                  <div className="font-bold">
                    {merkleTampered ? '⚠️ REJECTED: ROOT HASH MISMATCH' : '✓ VERIFIED: MERKLE TREE VALID'}
                  </div>
                  <div className="truncate text-[9px] mt-0.5 text-zinc-600">
                    Root: {merkleTampered ? '0x8f02b... [CONSENSUS DROP]' : '0x4e29b18274a10f82... [AUTHENTIC]'}
                  </div>
                </div>
              </div>
            </div>

            {/* Lab 3: Road Friction Calculator */}
            <div className="p-6 border border-black/[0.08] bg-white space-y-4">
              <div className="flex justify-between items-center text-[10px] font-mono-numbers text-zinc-400 uppercase tracking-wider">
                <span>SIMULATOR 03</span>
                <span className="text-sky-700 font-bold">RADAR</span>
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider font-luxury-display text-zinc-950">
                Pass Grip Friction (μ) Engine
              </h3>
              <p className="text-xs font-luxury-editorial text-zinc-600">
                Model thermodynamic adhesion across weather and tire thermal curves.
              </p>

              <div className="p-4 bg-zinc-50 border border-zinc-200 space-y-2.5 font-mono-numbers text-xs">
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsRaining(!isRaining)}
                    className={`flex-1 py-1.5 text-[10px] font-bold uppercase border cursor-pointer ${
                      isRaining ? 'bg-sky-600 text-white border-sky-700' : 'bg-white text-zinc-700 border-zinc-300'
                    }`}
                  >
                    {isRaining ? 'Wet Spray' : 'Dry Tarmac'}
                  </button>
                  <button
                    onClick={() => setIsFrost(!isFrost)}
                    className={`flex-1 py-1.5 text-[10px] font-bold uppercase border cursor-pointer ${
                      isFrost ? 'bg-cyan-600 text-white border-cyan-700' : 'bg-white text-zinc-700 border-zinc-300'
                    }`}
                  >
                    {isFrost ? 'Black Ice' : 'Frost Clear'}
                  </button>
                </div>

                <div className="flex justify-between text-[10px]">
                  <span className="text-zinc-500">Tyre Temp:</span>
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

                <div className="p-3 bg-zinc-950 text-white text-center rounded-xs">
                  <div className="text-2xl font-black font-luxury-display text-yellow-400">
                    μ {calculatedMu.toFixed(2)}
                  </div>
                  <span className="text-[9px] text-zinc-400 block uppercase tracking-widest">
                    {calculatedMu > 0.75 ? 'Optimal Grip' : calculatedMu > 0.45 ? 'Caution Damp' : 'Hazard Ice'}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </section>
      )}

      {/* ========================================================= */}
      {/* 5. SECTION 04: THE TECHNICAL INQUIRY & FAQ DOSSIER         */}
      {/* ========================================================= */}
      {(activeSection === 'all' || activeSection === 'faq') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16">
          
          <div className="flex items-center justify-between text-[10px] font-mono-numbers uppercase tracking-[0.3em] text-zinc-400 mb-8">
            <span className="text-yellow-700 font-bold">CHAPTER 04 // THE TECHNICAL INQUIRY</span>
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>

          <div className="max-w-3xl mb-10 space-y-3">
            <h2 className="text-3xl sm:text-5xl font-luxury-editorial text-zinc-950">
              The Curated Q&A Dossier
            </h2>
            <p className="text-xs sm:text-sm font-luxury-editorial text-zinc-600 italic">
              Direct technical answers regarding zero-knowledge privacy, Merkle DAG ledger mathematics, hardware telemetry, and code custody.
            </p>
          </div>

          {/* Search & Category Filter Toolbar */}
          <div className="p-6 border border-black/[0.08] bg-white space-y-4 mb-8">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={faqSearchQuery}
                onChange={(e) => setFaqSearchQuery(e.target.value)}
                placeholder="Search queries (e.g. Geofence, Merkle, CAN-bus, Radar, Guilds, IP)..."
                className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 bg-zinc-50 text-xs font-mono-numbers text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 text-xs font-mono-numbers">
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
                  className={`px-3 py-1.5 text-[10px] uppercase tracking-wider transition whitespace-nowrap cursor-pointer border ${
                    activeFaqCategory === cat.id
                      ? 'bg-zinc-950 text-yellow-400 border-zinc-950 font-bold'
                      : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

          </div>

          {/* Q&A Dossier Items */}
          <div className="space-y-4">
            {filteredFaqs.length === 0 ? (
              <div className="p-8 text-center border border-black/[0.08] bg-white text-xs font-mono-numbers text-zinc-500">
                No matching inquiries found for "{faqSearchQuery}".
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isExpanded = expandedFaqId === faq.id;
                return (
                  <article
                    key={faq.id}
                    className={`border transition-all ${
                      isExpanded
                        ? 'border-zinc-950 bg-white shadow-sm'
                        : 'border-black/[0.08] bg-white hover:border-zinc-400'
                    }`}
                  >
                    <button
                      onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                      className="w-full text-left p-6 sm:p-8 flex items-start justify-between gap-6 cursor-pointer"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-[10px] font-mono-numbers text-zinc-400 uppercase tracking-widest">
                          <span className="text-yellow-600 font-bold">QUERY {faq.num}</span>
                          <span>•</span>
                          <span>{faq.tier}</span>
                        </div>

                        <h3 className="text-base sm:text-xl font-bold font-luxury-editorial text-zinc-950 leading-snug">
                          {faq.question}
                        </h3>

                        {!isExpanded && (
                          <p className="text-xs font-luxury-editorial text-zinc-500 italic line-clamp-1">
                            {faq.shortAnswer}
                          </p>
                        )}
                      </div>

                      <div className={`p-2 border transition-all ${
                        isExpanded ? 'bg-zinc-950 text-yellow-400 border-zinc-950' : 'bg-zinc-50 text-zinc-400 border-zinc-200'
                      }`}>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-6 sm:px-8 pb-8 pt-2 border-t border-black/[0.06] space-y-4 animate-in fade-in duration-200">
                        <p className="text-sm sm:text-base font-luxury-editorial text-zinc-800 leading-relaxed">
                          {faq.detailedAnswer}
                        </p>

                        <div className="p-3 bg-zinc-50 border border-zinc-200 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono-numbers text-zinc-500">
                          <span>Verification: Ed25519 Cryptographic Block Proof</span>
                          <span className="text-emerald-700 font-bold uppercase">✓ 100% Mathematically Proven</span>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>

          {/* Direct Concierge Contact Box */}
          <div className="mt-12 p-8 sm:p-12 border border-black/[0.08] bg-zinc-950 text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[10px] font-mono-numbers uppercase tracking-[0.3em] text-yellow-400 font-bold block">
                SYSTEM ARCHITECT CONCIERGE
              </span>
              <h3 className="text-2xl sm:text-3xl font-luxury-editorial">
                Require a bespoke integration or telematics consultation?
              </h3>
              <p className="text-xs font-luxury-editorial text-zinc-400 italic max-w-xl">
                The DATUM systems engineering council is available for custom MoTeC CAN-bus integrations and private guild deployments.
              </p>
            </div>

            <Link
              to="/pro"
              className="px-6 py-3 bg-yellow-400 text-zinc-950 font-bold text-xs font-mono-numbers uppercase tracking-widest hover:bg-yellow-300 transition whitespace-nowrap"
            >
              Consult System Architect
            </Link>
          </div>

        </section>
      )}

      {/* ========================================================= */}
      {/* 6. EDITORIAL COLOPHON & FOOTER                            */}
      {/* ========================================================= */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-12 border-t border-black/[0.08] text-center text-xs font-mono-numbers text-zinc-500 space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] uppercase tracking-[0.25em]">
          <span>DATUM ATELIER // VOL. IV</span>
          <span>•</span>
          <span>100% PROPRIETARY CODE OWNERSHIP</span>
          <span>•</span>
          <span>AUTHORED BY vD</span>
        </div>
        <p className="text-xs font-luxury-editorial italic text-zinc-400 max-w-lg mx-auto">
          "Precision in mechanics. Integrity in code. Sanctity in camaraderie."
        </p>
      </footer>

    </main>
  );
};
