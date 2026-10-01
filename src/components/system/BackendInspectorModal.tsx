import { useState, useEffect, useCallback, useRef } from 'react';
import type { FC } from 'react';
import {
  X,
  Activity,
  Shield,
  Cpu,
  Database,
  Radio,
  Gauge,
  Lock,
  GitBranch,
  FileKey2,
  Eye,
  Pause,
  Play
} from 'lucide-react';

import type { DecodedTelemetryPacket } from '../../core/telemetry/CanBusStreamDecoder';
import type { GripAnalysisResult } from '../../core/radar/GripPhysicsEngine';
import { datumBackend } from '../../services/backend/DatumBackendEngine';

interface BackendInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type InspectorTab = 'telemetry' | 'ledger' | 'geofence' | 'grip' | 'carnet';

export const BackendInspectorModal: FC<BackendInspectorModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<InspectorTab>('telemetry');
  const [telemetry, setTelemetry] = useState<DecodedTelemetryPacket | null>(null);
  const [gripData, setGripData] = useState<GripAnalysisResult | null>(null);
  const [canDumpLog, setCanDumpLog] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [systemStatus, setSystemStatus] = useState<{
    rootHash: string;
    blockCount: number;
    activeTokens: number;
    totalCerts: number;
    uptime: number;
    simHz: number;
  } | null>(null);
  const [ledgerBlocks, setLedgerBlocks] = useState<Array<{
    blockIndex: number;
    eventType: string;
    timestamp: string;
    mileage: number;
    leafHash: string;
    details: string;
  }>>([]);
  const [carnetTokens, setCarnetTokens] = useState<Array<{
    id: string;
    vin: string;
    status: string;
    coverageType: string;
    jurisdictions: string[];
    expiresAt: string;
  }>>([]);

  const canLogRef = useRef<HTMLDivElement>(null);
  const unsubRef = useRef<(() => void) | null>(null);

  // Initialize backend and start stream
  const initBackend = useCallback(() => {
    datumBackend.seedDemoData();

    // Refresh static data
    const status = datumBackend.getSystemStatus();
    setSystemStatus({
      rootHash: status.ledger.rootHash,
      blockCount: status.ledger.blockCount,
      activeTokens: status.carnet.activeTokens,
      totalCerts: status.carnet.totalCertificates,
      uptime: status.uptime,
      simHz: status.simulationHz,
    });

    const blocks = datumBackend.getLedger().getBlocks();
    setLedgerBlocks(blocks.map(b => ({
      blockIndex: b.blockIndex,
      eventType: b.eventType,
      timestamp: b.timestamp,
      mileage: b.mileage,
      leafHash: b.leafHash || '',
      details: b.details,
    })));

    const tokens = datumBackend.getVaultEngine().getAllTokens();
    setCarnetTokens(tokens.map(t => ({
      id: t.id,
      vin: t.vin,
      status: t.status,
      coverageType: t.coverageType,
      jurisdictions: t.jurisdictions,
      expiresAt: t.expiresAt,
    })));
  }, []);

  const startStream = useCallback(() => {
    datumBackend.startTelemetryStream(10);
    setIsStreaming(true);

    unsubRef.current = datumBackend.subscribe((frame) => {
      setTelemetry(frame.decoded);
      setGripData(frame.gripSnapshot);
      setCanDumpLog(prev => {
        const next = [...prev, frame.canDump];
        return next.length > 80 ? next.slice(-80) : next;
      });
    });
  }, []);

  const stopStream = useCallback(() => {
    datumBackend.stopTelemetryStream();
    setIsStreaming(false);
    if (unsubRef.current) {
      unsubRef.current();
      unsubRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      initBackend();
      startStream();
    }
    return () => {
      if (unsubRef.current) {
        unsubRef.current();
        unsubRef.current = null;
      }
    };
  }, [isOpen, initBackend, startStream]);

  // Auto-scroll CAN log
  useEffect(() => {
    if (canLogRef.current) {
      canLogRef.current.scrollTop = canLogRef.current.scrollHeight;
    }
  }, [canDumpLog]);

  // Refresh system status periodically
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      const status = datumBackend.getSystemStatus();
      setSystemStatus({
        rootHash: status.ledger.rootHash,
        blockCount: status.ledger.blockCount,
        activeTokens: status.carnet.activeTokens,
        totalCerts: status.carnet.totalCertificates,
        uptime: status.uptime,
        simHz: status.simulationHz,
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const tabs: { id: InspectorTab; label: string; icon: typeof Activity }[] = [
    { id: 'telemetry', label: 'CAN Telemetry', icon: Radio },
    { id: 'ledger', label: 'Merkle DAG', icon: GitBranch },
    { id: 'geofence', label: 'ZK Cloak', icon: Shield },
    { id: 'grip', label: 'Grip Physics', icon: Gauge },
    { id: 'carnet', label: 'Carnet Vault', icon: FileKey2 },
  ];

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      {/* Modal Container */}
      <div
        className="relative w-[95vw] max-w-6xl h-[88vh] rounded-2xl overflow-hidden flex flex-col border shadow-2xl"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        {/* ─── Header Bar ─── */}
        <header
          className="flex items-center justify-between px-5 py-3 border-b shrink-0"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              <Cpu className="w-4 h-4 text-black" />
            </div>
            <div>
              <h2
                className="text-sm font-bold font-luxury-display tracking-[0.15em] uppercase"
                style={{ color: 'var(--text-primary)' }}
              >
                Backend Systems Inspector
              </h2>
              <p className="text-[10px] font-mono-numbers tracking-widest" style={{ color: 'var(--text-secondary)' }}>
                DATUM CORE // LIVE MICROSERVICE CONTROL ROOM
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Stream Toggle */}
            <button
              onClick={isStreaming ? stopStream : startStream}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono-numbers font-bold uppercase tracking-widest border transition cursor-pointer"
              style={{
                backgroundColor: isStreaming ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                borderColor: isStreaming ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)',
                color: isStreaming ? '#10B981' : '#EF4444',
              }}
            >
              {isStreaming ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
              {isStreaming ? 'STREAMING 10 Hz' : 'PAUSED'}
            </button>

            {/* Status Kickers */}
            {systemStatus && (
              <div className="hidden md:flex items-center gap-3 text-[10px] font-mono-numbers" style={{ color: 'var(--text-secondary)' }}>
                <span>UPTIME {Math.floor(systemStatus.uptime)}s</span>
                <span className="w-px h-4" style={{ backgroundColor: 'var(--border-subtle)' }} />
                <span>BLOCKS {systemStatus.blockCount}</span>
                <span className="w-px h-4" style={{ backgroundColor: 'var(--border-subtle)' }} />
                <span style={{ color: 'var(--accent)' }}>ROOT {systemStatus.rootHash.slice(0, 12)}…</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-lg transition cursor-pointer hover:opacity-70"
              style={{ color: 'var(--text-secondary)' }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* ─── Tab Strip ─── */}
        <nav
          className="flex items-center gap-1 px-4 py-2 border-b overflow-x-auto no-scrollbar shrink-0"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono-numbers font-bold uppercase tracking-widest whitespace-nowrap transition cursor-pointer"
                style={{
                  backgroundColor: isActive ? 'var(--accent)' : 'transparent',
                  color: isActive ? '#09090B' : 'var(--text-secondary)',
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* ─── Content Area ─── */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* ═══ TAB: CAN Telemetry ═══ */}
          {activeTab === 'telemetry' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 h-full">
              {/* Live Gauges */}
              <div className="space-y-4">
                <SectionTitle icon={Activity} label="Live Vehicle Telemetry" />

                {telemetry ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <GaugeCard label="Engine RPM" value={`${telemetry.engineRpm}`} unit="RPM" highlight={telemetry.engineRpm > 6500} />
                    <GaugeCard label="Speed" value={`${telemetry.speedKph}`} unit="km/h" />
                    <GaugeCard label="Throttle" value={`${telemetry.throttlePct}`} unit="%" />
                    <GaugeCard label="Gear" value={`${telemetry.gear}`} unit="" />
                    <GaugeCard label="Brake" value={`${telemetry.brakePressureBar}`} unit="bar" highlight={telemetry.brakePressureBar > 30} />
                    <GaugeCard label="Steering" value={`${telemetry.steeringAngleDeg}`} unit="°" />
                    <GaugeCard label="Oil Temp" value={`${telemetry.oilTempC}`} unit="°C" />
                    <GaugeCard label="Coolant" value={`${telemetry.coolantTempC}`} unit="°C" />
                    <GaugeCard label="Oil Press" value={`${telemetry.oilPressureBar}`} unit="bar" />
                    <GaugeCard label="Lat G" value={`${telemetry.lateralG}`} unit="g" />
                    <GaugeCard label="Long G" value={`${telemetry.longitudinalG}`} unit="g" />
                    <GaugeCard label="Yaw Rate" value={`${telemetry.yawRateDegS}`} unit="°/s" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48 text-sm font-mono-numbers" style={{ color: 'var(--text-secondary)' }}>
                    Waiting for CAN stream…
                  </div>
                )}

                {/* Anomaly Alerts */}
                {telemetry?.anomalies && telemetry.anomalies.length > 0 && (
                  <div className="space-y-1.5 mt-3">
                    {telemetry.anomalies.map((a, i) => (
                      <div key={i} className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-xs font-mono-numbers text-red-400">
                        ⚠ {a}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CAN Hex Dump */}
              <div className="flex flex-col h-full">
                <SectionTitle icon={Radio} label="CAN-Bus Hex Stream (candump)" />
                <div
                  ref={canLogRef}
                  className="flex-1 rounded-xl p-3 font-mono text-[10px] leading-relaxed overflow-y-auto border max-h-[55vh]"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    borderColor: 'var(--border-subtle)',
                    color: '#10B981',
                  }}
                >
                  {canDumpLog.length === 0 ? (
                    <span style={{ color: 'var(--text-secondary)' }}>Awaiting CAN frames…</span>
                  ) : (
                    canDumpLog.map((line, i) => (
                      <div key={i} className="whitespace-nowrap">
                        <span className="text-zinc-500">{String(i).padStart(3, '0')}</span>{' '}
                        {line}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ═══ TAB: Merkle DAG ═══ */}
          {activeTab === 'ledger' && (
            <div className="space-y-5">
              <SectionTitle icon={GitBranch} label="Merkle DAG Provenance Ledger" />

              {/* Root Hash Banner */}
              {systemStatus && (
                <div
                  className="rounded-xl p-4 border flex items-center gap-4"
                  style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderColor: 'var(--border-subtle)' }}
                >
                  <Database className="w-6 h-6 shrink-0" style={{ color: 'var(--accent)' }} />
                  <div className="min-w-0">
                    <p className="text-[10px] font-mono-numbers uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
                      MERKLE ROOT HASH
                    </p>
                    <p className="text-sm font-mono-numbers font-bold truncate" style={{ color: 'var(--accent)' }}>
                      {systemStatus.rootHash}
                    </p>
                    <p className="text-[10px] font-mono-numbers" style={{ color: 'var(--text-secondary)' }}>
                      {systemStatus.blockCount} verified blocks • Tamper detection active
                    </p>
                  </div>
                </div>
              )}

              {/* Block Explorer */}
              <div className="space-y-2">
                {ledgerBlocks.map((block) => (
                  <div
                    key={block.blockIndex}
                    className="rounded-xl p-4 border flex items-start gap-4 group transition"
                    style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold font-mono-numbers"
                      style={{ backgroundColor: 'var(--accent)', color: '#09090B' }}
                    >
                      #{block.blockIndex}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono-numbers font-bold uppercase" style={{ color: 'var(--text-primary)' }}>
                          {block.eventType.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[10px] font-mono-numbers" style={{ color: 'var(--text-secondary)' }}>
                          {block.mileage.toLocaleString()} mi
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{block.details}</p>
                      <p className="text-[9px] font-mono-numbers truncate" style={{ color: 'var(--accent)' }}>
                        HASH {block.leafHash}
                      </p>
                      <p className="text-[9px] font-mono-numbers" style={{ color: 'var(--text-secondary)' }}>
                        {block.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ TAB: ZK Geofence ═══ */}
          {activeTab === 'geofence' && (
            <div className="space-y-5">
              <SectionTitle icon={Shield} label="Zero-Knowledge 800m Privacy Cloaking Engine" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Concept Card */}
                <div
                  className="rounded-xl p-5 border space-y-3"
                  style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderColor: 'var(--border-subtle)' }}
                >
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                    <h3 className="text-sm font-bold font-luxury-display uppercase" style={{ color: 'var(--text-primary)' }}>
                      Privacy Architecture
                    </h3>
                  </div>
                  <div className="space-y-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <p>• Haversine geodesic distance with WGS-84 ellipsoid approximation</p>
                    <p>• 800m radial vector truncation with 12-point dodecagonal privacy envelope</p>
                    <p>• Deterministic pseudo-random centroid shift per 1-hour epoch bucket</p>
                    <p>• SHA-256 salted zero-knowledge proof-of-proximity</p>
                    <p>• k-anonymity guarantee for high-value collector vehicles</p>
                  </div>
                </div>

                {/* Live Demo Card */}
                <div
                  className="rounded-xl p-5 border space-y-3"
                  style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderColor: 'var(--border-subtle)' }}
                >
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-sm font-bold font-luxury-display uppercase" style={{ color: 'var(--text-primary)' }}>
                      Live Geofence Status
                    </h3>
                  </div>
                  <div className="space-y-2.5">
                    <InfoRow label="Privacy Radius" value="800m ATELIER_PRIVACY_COMPLIANT" />
                    <InfoRow label="Epoch Bucket" value={`${Math.floor(Date.now() / 1000 / 3600)}`} />
                    <InfoRow label="Algorithm" value="Haversine + SHA-256 Vector Truncation" />
                    <InfoRow label="Polygon Vertices" value="12 (dodecagonal envelope)" />
                    <InfoRow label="Status" value="ACTIVE — Residential coordinates protected" accent />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══ TAB: Grip Physics ═══ */}
          {activeTab === 'grip' && (
            <div className="space-y-5">
              <SectionTitle icon={Gauge} label="Dynamic Pass Grip & Thermodynamic Friction Engine" />

              {gripData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Primary Metrics */}
                  <div
                    className="rounded-xl p-5 border space-y-3"
                    style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderColor: 'var(--border-subtle)' }}
                  >
                    <h3 className="text-sm font-bold font-luxury-display uppercase" style={{ color: 'var(--text-primary)' }}>
                      Friction Coefficients
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <GaugeCard label="μ Effective" value={`${gripData.muEffective}`} unit="" highlight={gripData.muEffective < 0.7} />
                      <GaugeCard label="μ Base" value={`${gripData.muBase}`} unit="" />
                      <GaugeCard label="Lat Grip" value={`${gripData.lateralGripLimitG}`} unit="g" />
                      <GaugeCard label="Corner Stiff" value={`${gripData.corneringStiffnessNmPerDeg}`} unit="N/°" />
                    </div>
                  </div>

                  {/* Safety & Thermal */}
                  <div
                    className="rounded-xl p-5 border space-y-3"
                    style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderColor: 'var(--border-subtle)' }}
                  >
                    <h3 className="text-sm font-bold font-luxury-display uppercase" style={{ color: 'var(--text-primary)' }}>
                      Pass Safety Index
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="text-4xl font-bold font-mono-numbers" style={{
                        color: gripData.passSafetyIndex > 80 ? '#10B981' : gripData.passSafetyIndex > 50 ? '#F59E0B' : '#EF4444'
                      }}>
                        {gripData.passSafetyIndex}
                      </div>
                      <div>
                        <span className="text-xs font-mono-numbers font-bold uppercase px-2 py-0.5 rounded-full" style={{
                          backgroundColor: gripData.passStatus === 'OPTIMAL' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
                          color: gripData.passStatus === 'OPTIMAL' ? '#10B981' : '#F59E0B',
                        }}>
                          {gripData.passStatus}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <InfoRow label="Hydroplaning Risk" value={`${(gripData.hydroplaningRiskScore * 100).toFixed(0)}%`} />
                      <InfoRow label="Thermal Δ from Opt" value={`${gripData.thermodynamicState.deltaFromOptC}°C`} />
                      <InfoRow label="Thermal Grip Factor" value={`${gripData.thermodynamicState.thermalGripFactor}`} />
                    </div>

                    {gripData.recommendations.length > 0 && (
                      <div className="pt-2 space-y-1">
                        {gripData.recommendations.map((r, i) => (
                          <p key={i} className="text-[10px] font-mono-numbers" style={{ color: 'var(--accent)' }}>
                            → {r}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-48 text-sm font-mono-numbers" style={{ color: 'var(--text-secondary)' }}>
                  Awaiting grip analysis frames…
                </div>
              )}
            </div>
          )}

          {/* ═══ TAB: Carnet Vault ═══ */}
          {activeTab === 'carnet' && (
            <div className="space-y-5">
              <SectionTitle icon={FileKey2} label="Carnet Vault Engine — Time-Locked Transit Tokens" />

              {systemStatus && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <GaugeCard label="Active Tokens" value={`${systemStatus.activeTokens}`} unit="" />
                  <GaugeCard label="Total Certs" value={`${systemStatus.totalCerts}`} unit="" />
                  <GaugeCard label="Coverage" value="ATA CARNET" unit="" />
                  <GaugeCard label="Multi-Sig" value="2-of-4" unit="council" />
                </div>
              )}

              {/* Token List */}
              <div className="space-y-2">
                {carnetTokens.map((token) => (
                  <div
                    key={token.id}
                    className="rounded-xl p-4 border flex items-start gap-4"
                    style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: 'rgba(16,185,129,0.15)' }}
                    >
                      <FileKey2 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono-numbers font-bold" style={{ color: 'var(--text-primary)' }}>
                          {token.id}
                        </span>
                        <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded-full" style={{
                          backgroundColor: token.status === 'ACTIVE' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                          color: token.status === 'ACTIVE' ? '#10B981' : '#EF4444',
                        }}>
                          {token.status}
                        </span>
                      </div>
                      <p className="text-[10px] font-mono-numbers" style={{ color: 'var(--text-secondary)' }}>
                        VIN: {token.vin} • {token.coverageType} • Jurisdictions: {token.jurisdictions.join(', ')}
                      </p>
                      <p className="text-[10px] font-mono-numbers" style={{ color: 'var(--text-secondary)' }}>
                        Expires: {token.expiresAt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Shared Sub-Components ─── */

const SectionTitle: FC<{ icon: typeof Activity; label: string }> = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2 mb-2">
    <Icon className="w-4 h-4" style={{ color: 'var(--accent)' }} />
    <h3
      className="text-xs font-bold font-luxury-display uppercase tracking-[0.15em]"
      style={{ color: 'var(--text-primary)' }}
    >
      {label}
    </h3>
  </div>
);

const GaugeCard: FC<{ label: string; value: string; unit: string; highlight?: boolean }> = ({
  label,
  value,
  unit,
  highlight = false,
}) => (
  <div
    className="rounded-xl p-3 border transition"
    style={{
      backgroundColor: highlight ? 'rgba(239,68,68,0.08)' : 'rgba(0,0,0,0.25)',
      borderColor: highlight ? 'rgba(239,68,68,0.3)' : 'var(--border-subtle)',
    }}
  >
    <p className="text-[9px] font-mono-numbers uppercase tracking-widest mb-1" style={{ color: 'var(--text-secondary)' }}>
      {label}
    </p>
    <div className="flex items-baseline gap-1">
      <span
        className="text-lg font-bold font-mono-numbers"
        style={{ color: highlight ? '#EF4444' : 'var(--text-primary)' }}
      >
        {value}
      </span>
      {unit && (
        <span className="text-[10px] font-mono-numbers" style={{ color: 'var(--text-secondary)' }}>
          {unit}
        </span>
      )}
    </div>
  </div>
);

const InfoRow: FC<{ label: string; value: string; accent?: boolean }> = ({ label, value, accent }) => (
  <div className="flex items-center justify-between text-xs font-mono-numbers">
    <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
    <span className="font-bold" style={{ color: accent ? '#10B981' : 'var(--text-primary)' }}>
      {value}
    </span>
  </div>
);
