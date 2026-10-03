import { useState } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Lightbulb,
  History,
  GitBranch,
  ShieldCheck
} from 'lucide-react';
import { MASTER_DOSSIER_FAQS } from '../data/dossierFaqs';
import { PROJECT_CHANGELOG } from '../data/projectChangelog';

export const AboutCaseStudyPage: FC = () => {
  const { themeMeta } = useTheme();
  
  // Navigation tabs
  const [activeSection, setActiveSection] = useState<'all' | 'manifesto' | 'architecture' | 'changelog' | 'lab' | 'faq'>('all');

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

  // Filtered FAQs from Master Dossier Database
  const filteredFaqs = MASTER_DOSSIER_FAQS.filter(faq => {
    const matchesCategory = activeFaqCategory === 'all' || faq.category === activeFaqCategory;
    const matchesSearch = faq.question.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
                          faq.directAnswer.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
                          faq.evidenceAndReasoning.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
                          faq.realWorldExample.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
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
      specs: ['Mutual TLS (mTLS) Vehicle Auth', 'Token Bucket Rate Limiting (50 req/s)', 'Deterministic Vector Ingress Truncation']
    },
    {
      level: 3,
      name: 'Domain Microservices',
      stack: 'Go 1.23 • Rust • Python High-Performance Services',
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
    <main 
      className="min-h-screen transition-colors duration-500 pb-24"
      style={{
        backgroundColor: 'var(--bg-void)',
        color: 'var(--text-primary)'
      }}
    >
      
      {/* ========================================================= */}
      {/* 1. VOGUE EDITORIAL FOLIO & LUXURY COVER MASTHEAD          */}
      {/* ========================================================= */}
      <section 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-10 sm:pt-16 pb-12 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        
        {/* Top Folio Bar */}
        <div 
          className="flex flex-wrap items-center justify-between gap-4 text-[10px] font-mono-numbers uppercase tracking-[0.35em] border-b pb-4 mb-8"
          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
        >
          <div className="flex items-center gap-3">
            <span 
              className="font-bold px-2 py-0.5 rounded-xs"
              style={{ backgroundColor: 'var(--accent)', color: '#09090B' }}
            >
              FOLIO 04
            </span>
            <span>THE ATELIER MONOGRAPH</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <span>EDITION DE LUXE</span>
            <span>•</span>
            <span>{themeMeta.name}</span>
          </div>
          <div className="flex items-center gap-2 font-semibold" style={{ color: 'var(--text-primary)' }}>
            <Sparkles className="w-3 h-3" style={{ color: 'var(--accent)' }} />
            <span>DIRECTED BY vD</span>
          </div>
        </div>

        {/* Hero Editorial Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          
          {/* Main Title */}
          <div className="lg:col-span-8 space-y-4">
            <span 
              className="text-[11px] font-mono-numbers uppercase tracking-[0.4em] font-semibold block"
              style={{ color: 'var(--accent)' }}
            >
              SYSTEM DESIGN & CUSTODIANSHIP ESSAY
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-light font-luxury-editorial leading-[0.95] tracking-tight">
              The Architecture <br />
              <span className="italic font-serif font-normal" style={{ color: 'var(--accent)' }}>
                of Pure Custodianship.
              </span>
            </h1>
          </div>

          {/* Issue Meta & Lead */}
          <div 
            className="lg:col-span-4 space-y-4 border-l pl-0 lg:pl-8 pb-2"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <p className="text-xs sm:text-sm font-luxury-editorial leading-relaxed italic" style={{ color: 'var(--text-secondary)' }}>
              "A definitive blueprint replacing ephemeral feeds with verified mechanical provenance, residential privacy protection, and generational automotive camaraderie."
            </p>
            <div 
              className="pt-2 flex items-center justify-between text-[10px] font-mono-numbers uppercase tracking-widest border-t"
              style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
            >
              <span>VOL. IV // ISS. 01</span>
              <span className="font-bold" style={{ color: 'var(--text-primary)' }}>100% PROPRIETARY</span>
            </div>
          </div>

        </div>

        {/* Editorial Chapter Switcher Tabs */}
        <div 
          className="mt-12 flex items-center gap-2 overflow-x-auto no-scrollbar pt-4 border-t"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          {[
            { id: 'all', label: 'Complete Monograph', num: '00' },
            { id: 'manifesto', label: 'The Manifesto & Problem', num: '01' },
            { id: 'architecture', label: 'Level 1–6 Distributed System', num: '02' },
            { id: 'changelog', label: 'Software Release Ledger', num: '03' },
            { id: 'lab', label: 'Interactive Engineering Lab', num: '04' },
            { id: 'faq', label: 'The Technical Inquiry (FAQ)', num: '05' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex items-center gap-2.5 px-4 py-2 text-xs font-mono-numbers uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeSection === tab.id
                  ? 'border-b-2 font-bold -mb-px pb-2'
                  : 'opacity-70 hover:opacity-100 pb-2'
              }`}
              style={{
                borderColor: activeSection === tab.id ? 'var(--accent)' : 'transparent',
                color: activeSection === tab.id ? 'var(--text-primary)' : 'var(--text-muted)'
              }}
            >
              <span className="text-[10px] font-bold" style={{ color: 'var(--accent)' }}>[{tab.num}]</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

      </section>

      {/* ========================================================= */}
      {/* 2. SECTION 01: THE MANIFESTO & THE PROBLEM                */}
      {/* ========================================================= */}
      {(activeSection === 'all' || activeSection === 'manifesto') && (
        <section 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 border-b"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          
          {/* Section Marker */}
          <div 
            className="flex items-center justify-between text-[10px] font-mono-numbers uppercase tracking-[0.3em] mb-8"
            style={{ color: 'var(--text-muted)' }}
          >
            <span className="font-bold" style={{ color: 'var(--accent)' }}>CHAPTER 01 // THE MANIFESTO</span>
            <span>READING TIME: 4 MIN</span>
          </div>

          {/* 12-Column Asymmetrical Editorial Spread */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Editorial Text Spread */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-luxury-editorial leading-tight">
                Modern car culture is broken by advertising algorithms. We built its mathematical antidote.
              </h2>

              <div className="space-y-4 text-sm sm:text-base font-luxury-editorial leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                <p className="first-letter:text-6xl first-letter:font-luxury-editorial first-letter:float-left first-letter:mr-3 first-letter:font-bold first-letter:leading-none">
                  For the past two decades, genuine automotive culture has been fractured across fragmented WhatsApp group chats, ephemeral Instagram stories, and easily forged paper binder histories. The sacred relationship between custodian and machine has been reduced to click-driven noise and speculative auction flipping.
                </p>
                <p>
                  DATUM Atelier reclaims this domain through the tenets of haute horlogerie. We treat high-performance vehicles not as disposable content, but as living, evolving historical assets requiring mathematically immutable provenance, peer-to-peer engineering support, and sovereign privacy safeguards.
                </p>
              </div>

              {/* Editorial Pull Quote */}
              <blockquote 
                className="my-8 pl-6 border-l-2 py-2"
                style={{ borderColor: 'var(--accent)' }}
              >
                <p className="text-xl sm:text-2xl font-luxury-editorial italic leading-relaxed">
                  "A vehicle's true worth is forged in the integrity of its telemetry, the honesty of its torque specifications, and the camaraderie of the convoy that pulls you through the mountain pass."
                </p>
                <cite 
                  className="block mt-3 text-xs font-mono-numbers uppercase tracking-widest not-italic"
                  style={{ color: 'var(--text-muted)' }}
                >
                  — DATUM Sovereign Custody Manifesto
                </cite>
              </blockquote>
            </div>

            {/* Right Column: Curated Photo Plate & Key Metrics */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Photo Plate 01 */}
              <figure 
                className="group overflow-hidden border shadow-sm"
                style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}
              >
                <img 
                  src="/feed/stone_garage_cobra_ferrari.jpg" 
                  alt="Open stone garage sanctuary" 
                  className="w-full h-80 object-cover group-hover:scale-103 transition-transform duration-700"
                />
                <figcaption 
                  className="p-4 border-t"
                  style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
                >
                  <div 
                    className="flex justify-between items-center text-[10px] font-mono-numbers uppercase tracking-widest mb-1"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <span>PLATE 01 // CUSTODIAL SANCTUARY</span>
                    <span className="font-bold" style={{ color: 'var(--accent)' }}>COTSWOLDS, UK</span>
                  </div>
                  <p className="text-xs font-luxury-editorial italic" style={{ color: 'var(--text-secondary)' }}>
                    Shelby 427 & 488 Spider sharing private stone quarters with residential privacy protection.
                  </p>
                </figcaption>
              </figure>

              {/* Minimal Metric Trio */}
              <div className="grid grid-cols-3 gap-3 text-xs font-mono-numbers">
                <div 
                  className="p-4 border"
                  style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
                >
                  <span className="text-[10px] block uppercase" style={{ color: 'var(--text-muted)' }}>Privacy Radius</span>
                  <strong className="text-base font-bold block mt-1">800m</strong>
                  <span className="text-[9px] uppercase font-semibold text-emerald-400">Protected Buffer</span>
                </div>

                <div 
                  className="p-4 border"
                  style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
                >
                  <span className="text-[10px] block uppercase" style={{ color: 'var(--text-muted)' }}>Ingestion</span>
                  <strong className="text-base font-bold block mt-1" style={{ color: 'var(--accent)' }}>600k QPS</strong>
                  <span className="text-[9px] uppercase" style={{ color: 'var(--text-muted)' }}>Kafka Stream</span>
                </div>

                <div 
                  className="p-4 border"
                  style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
                >
                  <span className="text-[10px] block uppercase" style={{ color: 'var(--text-muted)' }}>Provenance</span>
                  <strong className="text-base font-bold block mt-1">Merkle DAG</strong>
                  <span className="text-[9px] uppercase" style={{ color: 'var(--text-muted)' }}>Ed25519 Sign</span>
                </div>
              </div>

            </div>

          </div>

          {/* The Four Tenets Strip */}
          <div 
            className="mt-16 pt-12 border-t"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <div className="mb-8">
              <span 
                className="text-[10px] font-mono-numbers uppercase tracking-[0.3em] font-bold block mb-1"
                style={{ color: 'var(--accent)' }}
              >
                SYSTEM PRINCIPLES
              </span>
              <h3 className="text-2xl sm:text-3xl font-luxury-editorial">
                The Four Pillars of DATUM
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  num: '[ 01 ]',
                  title: 'The Living Digital Twin',
                  desc: 'Real-time CAN-bus synchronization tracking brake pad thermals, oil degradation curves, and suspension dampening cycles with mathematical precision.'
                },
                {
                  num: '[ 02 ]',
                  title: 'Shared Guild Ateliers',
                  desc: 'Decentralized collector workshops granting multi-signature NFC access to hydraulic lifts, tire warmers, and clean-room assembly benches.'
                },
                {
                  num: '[ 03 ]',
                  title: 'Pass Grip Radar',
                  desc: 'Dynamic road friction (μ) calculation synthesizing atmospheric radar with tyre carcass thermal curves before tires touch mountain pass asphalt.'
                },
                {
                  num: '[ 04 ]',
                  title: 'Autonomous Carnet',
                  desc: 'Tamper-evident vehicle passports powered by Merkle DAGs. Proof of maintenance and track history transferred without disclosing private ownership identity.'
                }
              ].map((tenet, idx) => (
                <div 
                  key={idx} 
                  className="p-6 border space-y-3 transition-transform hover:-translate-y-1"
                  style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
                >
                  <span className="text-xs font-mono-numbers font-bold block" style={{ color: 'var(--accent)' }}>
                    {tenet.num}
                  </span>
                  <h4 className="text-sm font-bold uppercase tracking-wider font-luxury-display">
                    {tenet.title}
                  </h4>
                  <p className="text-xs font-luxury-editorial leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {tenet.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </section>
      )}

      {/* ========================================================= */}
      {/* 3. SECTION 02: LEVEL 1-6 DISTRIBUTED SYSTEM DESIGN        */}
      {/* ========================================================= */}
      {(activeSection === 'all' || activeSection === 'architecture') && (
        <section 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 border-b"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          
          <div 
            className="flex items-center justify-between text-[10px] font-mono-numbers uppercase tracking-[0.3em] mb-8"
            style={{ color: 'var(--text-muted)' }}
          >
            <span className="font-bold" style={{ color: 'var(--accent)' }}>CHAPTER 02 // DISTRIBUTED SYSTEM DESIGN</span>
            <span>HIGH-CONCURRENCY ARCHITECTURE</span>
          </div>

          <div className="max-w-3xl mb-12 space-y-3">
            <h2 className="text-3xl sm:text-5xl font-luxury-editorial">
              High-Throughput Distributed Architecture
            </h2>
            <p className="text-xs sm:text-sm font-luxury-editorial italic" style={{ color: 'var(--text-secondary)' }}>
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
                      ? 'shadow-md ring-1'
                      : 'hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: selectedArchTier === tier.level ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                    borderColor: selectedArchTier === tier.level ? 'var(--accent)' : 'var(--border-subtle)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <div 
                    className="flex justify-between items-center text-[10px] font-mono-numbers uppercase tracking-wider mb-1"
                    style={{ color: selectedArchTier === tier.level ? 'var(--accent)' : 'var(--text-muted)' }}
                  >
                    <span className="font-bold">LEVEL 0{tier.level}</span>
                    <span className="text-[9px] opacity-75">{tier.latency}</span>
                  </div>
                  <div className="text-xs font-bold font-luxury-display uppercase truncate">
                    {tier.name}
                  </div>
                </button>
              ))}
            </div>

            {/* Right: Selected Tier Blueprint Dossier */}
            <div 
              className="lg:col-span-8 p-8 border space-y-6"
              style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
            >
              {(() => {
                const tier = architectureTiers.find(t => t.level === selectedArchTier) || architectureTiers[0];
                return (
                  <>
                    <div 
                      className="flex flex-wrap items-center justify-between gap-2 border-b pb-4"
                      style={{ borderColor: 'var(--border-subtle)' }}
                    >
                      <div>
                        <span 
                          className="text-[10px] font-mono-numbers uppercase tracking-widest font-bold block"
                          style={{ color: 'var(--accent)' }}
                        >
                          TIER LEVEL 0{tier.level} DOSSIER
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold font-luxury-display uppercase">
                          {tier.name}
                        </h3>
                      </div>
                      <span 
                        className="text-xs font-mono-numbers px-3 py-1 border font-semibold"
                        style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-default)' }}
                      >
                        {tier.latency}
                      </span>
                    </div>

                    <div className="space-y-2 font-mono-numbers text-xs">
                      <span className="text-[10px] uppercase block" style={{ color: 'var(--text-muted)' }}>Technology Stack:</span>
                      <div 
                        className="p-3 border font-bold"
                        style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-default)' }}
                      >
                        {tier.stack}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-mono-numbers uppercase block" style={{ color: 'var(--text-muted)' }}>Architectural Role:</span>
                      <p className="text-sm font-luxury-editorial leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {tier.description}
                      </p>
                    </div>

                    <div 
                      className="space-y-2 pt-2 border-t"
                      style={{ borderColor: 'var(--border-subtle)' }}
                    >
                      <span className="text-[10px] font-mono-numbers uppercase block" style={{ color: 'var(--text-muted)' }}>Key Technical Guarantees:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {tier.specs.map((spec, idx) => (
                          <div 
                            key={idx} 
                            className="p-2.5 border text-[11px] font-mono-numbers"
                            style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-default)' }}
                          >
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
      {/* 3B. SECTION 03: SOFTWARE COMPANY RELEASE LEDGER & ADRs   */}
      {/* ========================================================= */}
      {(activeSection === 'all' || activeSection === 'changelog') && (
        <section 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 border-b"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          {/* Chapter Eyebrow */}
          <div 
            className="flex flex-wrap items-center justify-between text-[10px] font-mono-numbers uppercase tracking-[0.3em] mb-8"
            style={{ color: 'var(--text-muted)' }}
          >
            <span className="font-bold flex items-center gap-1.5" style={{ color: 'var(--accent)' }}>
              <History className="w-3.5 h-3.5" />
              <span>CHAPTER 03 // SOFTWARE RELEASE LEDGER &amp; ADRs</span>
            </span>
            <span>6 PRODUCTION VERSIONS ARCHIVED &bull; ZERO REGRESSIONS</span>
          </div>

          {/* Heading */}
          <div className="max-w-3xl mb-10 space-y-3">
            <h2 className="text-3xl sm:text-5xl font-luxury-editorial">
              Auditable Engineering Changelog
            </h2>
            <p className="text-xs sm:text-sm font-luxury-editorial italic" style={{ color: 'var(--text-secondary)' }}>
              A permanent, cryptographically traceable record of all major software releases, architectural decision records (ADRs), mathematical verification suites, and compliance milestones.
            </p>
          </div>

          {/* Release Timeline */}
          <div className="space-y-6">
            {PROJECT_CHANGELOG.map((rel) => (
              <div 
                key={rel.version}
                className="p-6 sm:p-8 border rounded-2xl transition-all"
                style={{ 
                  backgroundColor: 'var(--bg-elevated)', 
                  borderColor: 'var(--border-default)' 
                }}
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 mb-5" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span 
                        className="px-2.5 py-0.5 rounded text-xs font-mono-numbers font-bold"
                        style={{ backgroundColor: 'var(--accent)', color: '#09090B' }}
                      >
                        {rel.version}
                      </span>
                      <span className="text-xs font-mono-numbers text-zinc-400 font-semibold uppercase tracking-wider">
                        {rel.codename}
                      </span>
                      <span className="text-xs font-mono-numbers text-zinc-500">
                        &bull; {rel.date}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold font-luxury-display text-white">
                      {rel.tagline}
                    </h3>
                  </div>

                  {/* Verification Pill Matrix */}
                  <div className="flex flex-wrap items-center gap-2 self-start md:self-auto font-mono-numbers text-[10px]">
                    <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{rel.verificationMetrics.unitTestsPassed} Tests Passing ({rel.verificationMetrics.testSuitesCount} Suites)</span>
                    </span>
                    <span className="px-2.5 py-1 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center gap-1 font-bold">
                      <ShieldCheck className="w-3 h-3" />
                      <span>0 Type Errors</span>
                    </span>
                    <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                      {rel.verificationMetrics.bundleTimeSec}s Vite Bundle
                    </span>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-xs sm:text-sm font-luxury-editorial leading-relaxed text-zinc-300 mb-6">
                  {rel.summary}
                </p>

                {/* Grid: Highlights & ADRs */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                  {/* Highlights */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-mono-numbers uppercase tracking-wider block font-bold text-amber-400">
                      Production Feature Deliverables:
                    </span>
                    <ul className="space-y-2 text-xs text-zinc-300">
                      {rel.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* ADRs */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-mono-numbers uppercase tracking-wider block font-bold text-sky-400">
                      Architectural Decision Records (ADRs):
                    </span>
                    <ul className="space-y-2 text-xs text-zinc-400 font-mono-numbers">
                      {rel.architecturalDecisions.map((adr, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <GitBranch className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                          <span>{adr}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================= */}
      {/* 4. SECTION 04: THE INTERACTIVE ENGINEERING LAB ANNEX      */}
      {/* ========================================================= */}
      {(activeSection === 'all' || activeSection === 'lab') && (
        <section 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 border-b"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          
          <div 
            className="flex items-center justify-between text-[10px] font-mono-numbers uppercase tracking-[0.3em] mb-8"
            style={{ color: 'var(--text-muted)' }}
          >
            <span className="font-bold" style={{ color: 'var(--accent)' }}>CHAPTER 04 // THE ENGINEERING ANNEX</span>
            <span>3 LIVE ALGORITHMIC SIMULATORS</span>
          </div>

          <div className="max-w-3xl mb-12 space-y-3">
            <h2 className="text-3xl sm:text-5xl font-luxury-editorial">
              Interactive Mathematical Prototyping
            </h2>
            <p className="text-xs sm:text-sm font-luxury-editorial italic" style={{ color: 'var(--text-secondary)' }}>
              Directly manipulate the parameters governing residential coordinate cloaking, Merkle tree tampering detection, and road adhesion physics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Lab 1: 800m Geofencing */}
            <div 
              className="p-6 border space-y-4"
              style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
            >
              <div 
                className="flex justify-between items-center text-[10px] font-mono-numbers uppercase tracking-wider"
                style={{ color: 'var(--text-muted)' }}
              >
                <span>SIMULATOR 01</span>
                <span className="font-bold" style={{ color: 'var(--accent)' }}>PRIVACY</span>
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider font-luxury-display">
                800m Residential Privacy Radius
              </h3>
              <p className="text-xs font-luxury-editorial" style={{ color: 'var(--text-secondary)' }}>
                Adjust the privacy perimeter to observe real-time vector coordinate protection.
              </p>

              <div 
                className="p-4 border space-y-3 font-mono-numbers text-xs"
                style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-default)' }}
              >
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Radius:</span>
                  <strong>{geofenceRadius} meters</strong>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={geofenceRadius}
                  onChange={(e) => setGeofenceRadius(Number(e.target.value))}
                  className="w-full cursor-pointer"
                  style={{ accentColor: 'var(--accent)' }}
                />
                <div 
                  className="p-2.5 text-[10px] rounded-xs space-y-1"
                  style={{ backgroundColor: 'var(--bg-void)', border: '1px solid var(--border-default)' }}
                >
                  <div className="font-bold" style={{ color: 'var(--accent)' }}>Client Ingress Boundary:</div>
                  <div style={{ color: 'var(--text-muted)' }}>Raw: 51.5074° N, 0.1278° W</div>
                  <div style={{ color: 'var(--text-primary)' }}>Masked: 51.51**° N (+{geofenceRadius}m hash)</div>
                </div>
              </div>
            </div>

            {/* Lab 2: Merkle Tree Validator */}
            <div 
              className="p-6 border space-y-4"
              style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
            >
              <div 
                className="flex justify-between items-center text-[10px] font-mono-numbers uppercase tracking-wider"
                style={{ color: 'var(--text-muted)' }}
              >
                <span>SIMULATOR 02</span>
                <span className="font-bold" style={{ color: 'var(--accent)' }}>PROVENANCE</span>
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider font-luxury-display">
                Merkle DAG Integrity Engine
              </h3>
              <p className="text-xs font-luxury-editorial" style={{ color: 'var(--text-secondary)' }}>
                Simulate an unauthorized odometer tamper to trigger cryptographic rejection.
              </p>

              <div 
                className="p-4 border space-y-3 font-mono-numbers text-xs"
                style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-default)' }}
              >
                <button
                  onClick={() => setMerkleTampered(!merkleTampered)}
                  className="w-full py-2 px-3 text-[11px] font-bold uppercase transition cursor-pointer border"
                  style={{
                    backgroundColor: merkleTampered ? '#DC2626' : 'var(--accent)',
                    color: merkleTampered ? '#FFFFFF' : '#09090B',
                    borderColor: merkleTampered ? '#B91C1C' : 'var(--accent)'
                  }}
                >
                  {merkleTampered ? 'Restore Genuine DAG' : 'Simulate Forged Mileage Entry'}
                </button>
                <div 
                  className="p-2.5 text-[10px] border"
                  style={{
                    backgroundColor: merkleTampered ? 'rgba(220, 38, 38, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                    borderColor: merkleTampered ? '#EF4444' : '#10B981',
                    color: merkleTampered ? '#FCA5A5' : '#6EE7B7'
                  }}
                >
                  <div className="font-bold">
                    {merkleTampered ? '⚠️ REJECTED: ROOT HASH MISMATCH' : '✓ VERIFIED: MERKLE TREE VALID'}
                  </div>
                  <div className="truncate text-[9px] mt-0.5 opacity-80">
                    Root: {merkleTampered ? '0x8f02b... [CONSENSUS DROP]' : '0x4e29b18274a10f82... [AUTHENTIC]'}
                  </div>
                </div>
              </div>
            </div>

            {/* Lab 3: Road Friction Calculator */}
            <div 
              className="p-6 border space-y-4"
              style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
            >
              <div 
                className="flex justify-between items-center text-[10px] font-mono-numbers uppercase tracking-wider"
                style={{ color: 'var(--text-muted)' }}
              >
                <span>SIMULATOR 03</span>
                <span className="font-bold" style={{ color: 'var(--accent)' }}>RADAR</span>
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider font-luxury-display">
                Pass Grip Friction (μ) Engine
              </h3>
              <p className="text-xs font-luxury-editorial" style={{ color: 'var(--text-secondary)' }}>
                Model thermodynamic adhesion across weather and tire thermal curves.
              </p>

              <div 
                className="p-4 border space-y-2.5 font-mono-numbers text-xs"
                style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-default)' }}
              >
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsRaining(!isRaining)}
                    className="flex-1 py-1.5 text-[10px] font-bold uppercase border cursor-pointer"
                    style={{
                      backgroundColor: isRaining ? 'var(--accent)' : 'var(--bg-surface)',
                      color: isRaining ? '#FFFFFF' : 'var(--text-primary)',
                      borderColor: 'var(--border-default)'
                    }}
                  >
                    {isRaining ? 'Wet Spray' : 'Dry Tarmac'}
                  </button>
                  <button
                    onClick={() => setIsFrost(!isFrost)}
                    className="flex-1 py-1.5 text-[10px] font-bold uppercase border cursor-pointer"
                    style={{
                      backgroundColor: isFrost ? '#0677A1' : 'var(--bg-surface)',
                      color: isFrost ? '#FFFFFF' : 'var(--text-primary)',
                      borderColor: 'var(--border-default)'
                    }}
                  >
                    {isFrost ? 'Black Ice' : 'Frost Clear'}
                  </button>
                </div>

                <div className="flex justify-between text-[10px]">
                  <span style={{ color: 'var(--text-muted)' }}>Tyre Temp:</span>
                  <strong>{tyreTemp}°C</strong>
                </div>
                <input
                  type="range"
                  min="10"
                  max="85"
                  value={tyreTemp}
                  onChange={(e) => setTyreTemp(Number(e.target.value))}
                  className="w-full cursor-pointer"
                  style={{ accentColor: 'var(--accent)' }}
                />

                <div 
                  className="p-3 text-center rounded-xs"
                  style={{ backgroundColor: 'var(--bg-void)', border: '1px solid var(--border-default)' }}
                >
                  <div className="text-2xl font-black font-luxury-display" style={{ color: 'var(--accent)' }}>
                    μ {calculatedMu.toFixed(2)}
                  </div>
                  <span className="text-[9px] block uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
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
          
          <div 
            className="flex items-center justify-between text-[10px] font-mono-numbers uppercase tracking-[0.3em] mb-8"
            style={{ color: 'var(--text-muted)' }}
          >
            <span className="font-bold" style={{ color: 'var(--accent)' }}>CHAPTER 05 // THE TECHNICAL INQUIRY</span>
            <span>{MASTER_DOSSIER_FAQS.length} ENTERPRISE &amp; DUE DILIGENCE INQUIRIES</span>
          </div>

          <div className="max-w-3xl mb-10 space-y-3">
            <h2 className="text-3xl sm:text-5xl font-luxury-editorial">
              The Software Company Due Diligence Dossier
            </h2>
            <p className="text-xs sm:text-sm font-luxury-editorial italic" style={{ color: 'var(--text-secondary)' }}>
              Direct answers regarding corporate monetization, zero-cost to cloud scale, DVSA data integrity, cryptographic anti-fraud, anti-ASD acoustic DSP, and GDPR Article 17 compliance.
            </p>
          </div>

          {/* Search & Category Filter Toolbar */}
          <div 
            className="p-6 border space-y-4 mb-8"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
          >
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" />
              <input
                type="text"
                value={faqSearchQuery}
                onChange={(e) => setFaqSearchQuery(e.target.value)}
                placeholder="Search queries (e.g. Monetization, Scaling, GDPR, Merkle, DVSA, ASD, Carnet, Theft)..."
                className="w-full pl-10 pr-4 py-2.5 border text-xs font-mono-numbers focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            {/* Master Dossier Announcement Banner */}
            <div 
              className="p-4 border mb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-lg"
              style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-default)' }}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold font-luxury-editorial text-white">
                    Master Software Company Dossier (Investor &amp; Enterprise Edition v2.5)
                  </h4>
                  <p className="text-[11px] text-zinc-400 font-mono-numbers">
                    Comprehensive commercial math, unit economics, regulatory compliance, and multi-tier system architecture.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono-numbers px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 whitespace-nowrap">
                {MASTER_DOSSIER_FAQS.length} Interactive Inquiries Loaded
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 text-xs font-mono-numbers">
              {[
                { id: 'all', label: `All Inquiries (${MASTER_DOSSIER_FAQS.length})` },
                { id: 'due-diligence', label: 'Due Diligence & Anti-Fraud' },
                { id: 'market', label: 'Commercial & Unit Economics' },
                { id: 'deployment', label: 'Architecture & Scaling' },
                { id: 'data', label: 'Data Sources & DSP' },
                { id: 'privacy', label: 'Privacy & GDPR' },
                { id: 'impact', label: 'Economic Impact' },
                { id: 'collaboration', label: 'Garages & Workshops' },
                { id: 'marketing', label: 'Marketing Strategy' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveFaqCategory(cat.id)}
                  className="px-3 py-1.5 text-[10px] uppercase tracking-wider transition whitespace-nowrap cursor-pointer border rounded-md"
                  style={{
                    backgroundColor: activeFaqCategory === cat.id ? 'var(--accent)' : 'var(--bg-surface)',
                    color: activeFaqCategory === cat.id ? '#000000' : 'var(--text-secondary)',
                    borderColor: activeFaqCategory === cat.id ? 'var(--accent)' : 'var(--border-default)',
                    fontWeight: activeFaqCategory === cat.id ? 'bold' : 'normal'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

          </div>

          {/* Q&A Dossier Items */}
          <div className="space-y-4">
            {filteredFaqs.length === 0 ? (
              <div 
                className="p-8 text-center border text-xs font-mono-numbers rounded-xl"
                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
              >
                No matching inquiries found for "{faqSearchQuery}".
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isExpanded = expandedFaqId === faq.id;
                return (
                  <article
                    key={faq.id}
                    className="border transition-all rounded-xl overflow-hidden"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: isExpanded ? 'var(--accent)' : 'var(--border-subtle)'
                    }}
                  >
                    <button
                      onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                      className="w-full text-left p-6 sm:p-8 flex items-start justify-between gap-6 cursor-pointer"
                    >
                      <div className="space-y-2">
                        <div 
                          className="flex items-center gap-3 text-[10px] font-mono-numbers uppercase tracking-widest"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          <span className="font-bold" style={{ color: 'var(--accent)' }}>QUERY {faq.num}</span>
                          <span>•</span>
                          <span>{faq.tier}</span>
                        </div>

                        <h3 className="text-base sm:text-xl font-bold font-luxury-editorial leading-snug">
                          {faq.question}
                        </h3>

                        {!isExpanded && (
                          <p className="text-xs font-luxury-editorial italic line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                            {faq.directAnswer}
                          </p>
                        )}
                      </div>

                      <div 
                        className="p-2 border transition-all rounded-lg shrink-0 mt-1"
                        style={{
                          backgroundColor: isExpanded ? 'var(--accent)' : 'var(--bg-elevated)',
                          color: isExpanded ? '#000000' : 'var(--text-muted)',
                          borderColor: 'var(--border-default)'
                        }}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div 
                        className="px-6 sm:px-8 pb-8 pt-2 border-t space-y-5 animate-in fade-in duration-200"
                        style={{ borderColor: 'var(--border-subtle)' }}
                      >
                        {/* 1. Direct Answer (One Sentence Callout) */}
                        <div 
                          className="p-4 border rounded-xl space-y-1"
                          style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--accent)' }}
                        >
                          <span className="text-[10px] font-mono-numbers uppercase tracking-wider font-bold block" style={{ color: 'var(--accent)' }}>
                            1. Direct Answer
                          </span>
                          <p className="text-sm font-semibold leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                            {faq.directAnswer}
                          </p>
                        </div>

                        {/* 2. Evidence & Reasoning */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-mono-numbers uppercase tracking-wider font-bold text-zinc-400 block">
                            2. Evidence & Reasoning
                          </span>
                          <p className="text-xs sm:text-sm font-luxury-editorial leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            {faq.evidenceAndReasoning}
                          </p>
                        </div>

                        {/* 3. Real-World Example */}
                        <div className="p-3.5 border rounded-xl flex items-start gap-3 bg-emerald-500/[0.04] border-emerald-500/20 text-xs">
                          <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <strong className="block text-emerald-300 font-mono-numbers text-[10px] uppercase tracking-wide">
                              3. Real-World Practical Example
                            </strong>
                            <p className="text-zinc-300 leading-relaxed font-sans text-xs">
                              {faq.realWorldExample}
                            </p>
                          </div>
                        </div>

                        {/* 4. Honest Limit or Risk */}
                        <div className="p-3.5 border rounded-xl flex items-start gap-3 bg-amber-500/[0.04] border-amber-500/20 text-xs">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <strong className="block text-amber-300 font-mono-numbers text-[10px] uppercase tracking-wide">
                              4. Honest Limit, Risk or Boundary
                            </strong>
                            <p className="text-zinc-300 leading-relaxed font-sans text-xs">
                              {faq.honestLimit}
                            </p>
                          </div>
                        </div>

                        {/* Audit Provenance Footer */}
                        <div 
                          className="p-3 border flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono-numbers rounded-xl"
                          style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-default)', color: 'var(--text-muted)' }}
                        >
                          <div className="flex items-center gap-2">
                            {faq.implementationStatus === 'real_today' ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-bold">
                                <CheckCircle2 className="w-3 h-3" />
                                REAL IN APP TODAY
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1 font-bold">
                                <Clock className="w-3 h-3" />
                                PLANNED ROADMAP // PHASE 2
                              </span>
                            )}
                            <span className="text-zinc-400">Basis: {faq.sourceOrEstimate}</span>
                          </div>
                          <span className="text-zinc-500">Strict 4-Part Provenance Audit</span>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>

          {/* Direct Concierge Contact Box */}
          <div 
            className="mt-12 p-8 sm:p-12 border flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}
          >
            <div className="space-y-2 text-center md:text-left">
              <span 
                className="text-[10px] font-mono-numbers uppercase tracking-[0.3em] font-bold block"
                style={{ color: 'var(--accent)' }}
              >
                SYSTEM ARCHITECT CONCIERGE
              </span>
              <h3 className="text-2xl sm:text-3xl font-luxury-editorial">
                Require a bespoke integration or telematics consultation?
              </h3>
              <p className="text-xs font-luxury-editorial italic max-w-xl" style={{ color: 'var(--text-secondary)' }}>
                The DATUM systems engineering council is available for custom MoTeC CAN-bus integrations and private guild deployments.
              </p>
            </div>

            <Link
              to="/pro"
              className="px-6 py-3 font-bold text-xs font-mono-numbers uppercase tracking-widest transition whitespace-nowrap shadow-md"
              style={{
                backgroundColor: 'var(--accent)',
                color: '#09090B'
              }}
            >
              Consult System Architect
            </Link>
          </div>

        </section>
      )}

      {/* ========================================================= */}
      {/* 6. EDITORIAL COLOPHON & FOOTER                            */}
      {/* ========================================================= */}
      <footer 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-12 border-t text-center text-xs font-mono-numbers space-y-4"
        style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
      >
        <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] uppercase tracking-[0.25em]">
          <span>DATUM ATELIER // VOL. IV</span>
          <span>•</span>
          <span>100% PROPRIETARY CODE OWNERSHIP</span>
          <span>•</span>
          <span>AUTHORED BY vD</span>
        </div>
        <p className="text-xs font-luxury-editorial italic max-w-lg mx-auto opacity-70">
          "Precision in mechanics. Integrity in code. Sanctity in camaraderie."
        </p>
      </footer>

    </main>
  );
};
