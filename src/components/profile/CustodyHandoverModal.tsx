import { useState, useMemo } from 'react';
import type { FC } from 'react';
import { 
  X, 
  KeyRound, 
  ShieldCheck, 
  ArrowRightLeft, 
  UserCheck, 
  Clock, 
  MapPin, 
  History, 
  Copy, 
  Check, 
  Lock,
  Sparkles
} from 'lucide-react';
import { FluidLevitation } from '../../core/motion/FluidLevitation';
import { useToast } from '../../context/ToastContext';
import { 
  loadVehicleCustodyChain, 
  generateCustodyHandoverToken, 
  executeCustodyHandover,
  loadTokenFromStorage
} from '../../core/custody/custodyTransferEngine';
import type { CustodyHandoverToken, VehicleCustodyChain } from '../../core/custody/custodyTransferEngine';
import { generateQrSvg } from '../../core/crypto/qrCodeGenerator';

interface CustodyHandoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: string;
  vehicleName: string;
  vin: string;
  chassisCode: string;
  currentMileage: number;
  onCustodyUpdated?: (chain: VehicleCustodyChain) => void;
}

export const CustodyHandoverModal: FC<CustodyHandoverModalProps> = ({
  isOpen,
  onClose,
  vehicleId,
  vehicleName,
  vin,
  chassisCode,
  currentMileage,
  onCustodyUpdated
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'lineage' | 'generate' | 'claim'>('lineage');
  
  // Custody chain state
  const [chain, setChain] = useState<VehicleCustodyChain>(() => loadVehicleCustodyChain(vehicleId));
  
  // Handover Generation form state
  const [recipientName, setRecipientName] = useState('');
  const [passcode, setPasscode] = useState('');
  const [validHours, setValidHours] = useState(72);
  const [generatedToken, setGeneratedToken] = useState<CustodyHandoverToken | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);

  // Claim/Accept form state
  const [claimTokenInput, setClaimTokenInput] = useState('');
  const [claimPasscode, setClaimPasscode] = useState('');
  const [newCustodianName, setNewCustodianName] = useState('');
  const [newCustodianRegion, setNewCustodianRegion] = useState('');
  const [transferNotes, setTransferNotes] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);

  // Generate QR SVG for the generated token
  const qrSvg = useMemo(() => {
    if (!generatedToken) return '';
    const payload = JSON.stringify({
      datum: 'CUSTODY_HANDOVER',
      tokenId: generatedToken.tokenId,
      vin: generatedToken.vin,
      expiresAt: generatedToken.expiresAt,
      sig: generatedToken.handoverSignature.slice(0, 18),
    });
    return generateQrSvg(payload, { size: 160, margin: 1, darkColor: '#1A1A1A', lightColor: '#FFFFFF' });
  }, [generatedToken]);

  if (!isOpen) return null;

  const handleGenerateToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !passcode.trim()) {
      showToast({
        title: 'Incomplete Handover Specification',
        message: 'Intended recipient name and security passcode are mandatory.',
        type: 'privacy',
        badge: 'ALERT'
      });
      return;
    }

    const token = generateCustodyHandoverToken({
      vehicleId,
      vin,
      chassisCode,
      currentMileage,
      fromCustodianId: chain.activeCustodian.custodianId,
      fromCustodianName: chain.activeCustodian.displayName,
      intendedRecipientName: recipientName.trim(),
      authPasscode: passcode.trim(),
      validHours,
    });

    setGeneratedToken(token);
    setClaimTokenInput(token.tokenId);
    setClaimPasscode(passcode.trim());
    setNewCustodianName(recipientName.trim());
    
    showToast({
      title: 'Cryptographic Handover Token Sealed',
      message: `Token valid for ${validHours} hours. Sealed with SHA-256 state checksum.`,
      type: 'privacy',
      badge: 'TIME-LOCKED'
    });
  };

  const handleCopyToken = () => {
    if (!generatedToken) return;
    navigator.clipboard?.writeText(generatedToken.tokenId);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
    showToast({
      title: 'Handover Token Copied',
      message: 'Share this token ID securely with the prospective custodian.',
      type: 'clipboard'
    });
  };

  const handleExecuteHandover = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimTokenInput.trim() || !claimPasscode.trim() || !newCustodianName.trim()) {
      showToast({
        title: 'Missing Required Credentials',
        message: 'Token ID, Passcode, and New Custodian Name are required.',
        type: 'privacy',
        badge: 'ALERT'
      });
      return;
    }

    setIsClaiming(true);
    let token = generatedToken;
    if (!token || token.tokenId !== claimTokenInput.trim()) {
      token = loadTokenFromStorage(claimTokenInput.trim());
    }

    if (!token) {
      setIsClaiming(false);
      showToast({
        title: 'Handover Token Not Found',
        message: 'Ensure the token ID was generated on this atelier node or network.',
        type: 'privacy',
        badge: 'ALERT'
      });
      return;
    }

    const result = executeCustodyHandover({
      token,
      enteredPasscode: claimPasscode,
      newCustodianDisplayName: newCustodianName,
      newCustodianRegion: newCustodianRegion || 'United Kingdom',
      transferNotes,
    });

    setIsClaiming(false);

    if (result.success && result.updatedChain) {
      setChain(result.updatedChain);
      onCustodyUpdated?.(result.updatedChain);
      setActiveTab('lineage');
      showToast({
        title: 'Sovereign Custody Transferred',
        message: `${newCustodianName} is now the active custodian of ${vehicleName}.`,
        type: 'garage',
        badge: 'CUSTODY_HANDSHAKE'
      });
    } else {
      showToast({
        title: 'Handshake Rejected',
        message: result.message,
        type: 'privacy',
        badge: 'ALERT'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <FluidLevitation ambientIntensity={0.6} className="w-full max-w-3xl my-auto">
        <div className="relative rounded-3xl bg-[#0E1015] border border-white/[0.12] shadow-2xl overflow-hidden text-zinc-100 flex flex-col max-h-[90vh]">
          
          {/* Modal Header */}
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/[0.08] bg-zinc-950/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-luxury-display text-base sm:text-lg font-bold tracking-wider uppercase text-white">
                    Sovereign Custodian Handover
                  </h3>
                  <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30">
                    DAG LINEAGE
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-mono-numbers mt-0.5">
                  {vehicleName} • VIN: {vin} • Chassis: {chassisCode}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition"
              title="Close Protocol"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center border-b border-white/[0.08] bg-black/40 px-6 gap-4 text-xs font-mono-numbers">
            <button
              onClick={() => setActiveTab('lineage')}
              className={`py-3.5 flex items-center gap-2 border-b-2 transition font-semibold ${
                activeTab === 'lineage'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Custody History ({chain.totalCustodians})</span>
            </button>

            <button
              onClick={() => setActiveTab('generate')}
              className={`py-3.5 flex items-center gap-2 border-b-2 transition font-semibold ${
                activeTab === 'generate'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Issue Transfer Token</span>
            </button>

            <button
              onClick={() => setActiveTab('claim')}
              className={`py-3.5 flex items-center gap-2 border-b-2 transition font-semibold ${
                activeTab === 'claim'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Execute Handshake</span>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-6">

            {/* TAB 1: LINEAGE TREE */}
            {activeTab === 'lineage' && (
              <div className="space-y-6">
                
                {/* Active Custodian Spotlight */}
                <div className="rounded-2xl p-5 bg-gradient-to-br from-amber-500/10 via-zinc-900/60 to-black border border-amber-500/25 relative overflow-hidden">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono-numbers px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30 uppercase tracking-wider">
                          ACTIVE SOVEREIGN CUSTODIAN
                        </span>
                        <span className="text-xs text-zinc-400 font-mono-numbers flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                          {chain.activeCustodian.locationRegion}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold text-white mt-2">
                        {chain.activeCustodian.displayName}
                      </h4>
                      <p className="text-xs text-zinc-400 font-mono-numbers mt-1">
                        Tenure Commenced: {new Date(chain.activeCustodian.custodyStartDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} • Commenced at {chain.activeCustodian.startMileage.toLocaleString()} miles
                      </p>
                      {chain.activeCustodian.transferNotes && (
                        <p className="text-xs text-zinc-300 italic mt-3 bg-black/40 p-2.5 rounded-lg border border-white/5">
                          "{chain.activeCustodian.transferNotes}"
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mx-auto">
                        <UserCheck className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono-numbers">
                    <span className="text-zinc-500">Sovereign Signature Seal:</span>
                    <span className="text-zinc-400">{chain.activeCustodian.sovereignSignature.slice(0, 24)}…</span>
                  </div>
                </div>

                {/* Historical Custodians Sequence */}
                <div>
                  <h5 className="text-xs font-mono-numbers uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
                    <History className="w-3.5 h-3.5 text-zinc-500" />
                    Historical Custodians & Provenance Lineage
                  </h5>

                  {chain.custodyHistory.length === 0 ? (
                    <div className="text-center py-6 text-zinc-500 text-xs font-mono-numbers border border-dashed border-white/10 rounded-xl">
                      Original First Custodian. No preceding transfer transactions logged.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {chain.custodyHistory.map((hist, idx) => (
                        <div
                          key={hist.custodianId || idx}
                          className="p-4 rounded-xl bg-zinc-950/60 border border-white/[0.06] hover:border-white/15 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-semibold border border-white/10">
                                TENURE #{chain.totalCustodians - 1 - idx}
                              </span>
                              <span className="font-semibold text-zinc-200 text-sm">
                                {hist.displayName}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-400 font-mono-numbers mt-1">
                              {new Date(hist.custodyStartDate).getFullYear()} – {hist.custodyEndDate ? new Date(hist.custodyEndDate).getFullYear() : 'Present'} • {hist.startMileage.toLocaleString()} to {(hist.endMileage || currentMileage).toLocaleString()} miles ({hist.locationRegion})
                            </p>
                            {hist.transferNotes && (
                              <p className="text-xs text-zinc-500 mt-1 italic">
                                {hist.transferNotes}
                              </p>
                            )}
                          </div>
                          <div className="text-right sm:flex-shrink-0">
                            <span className="text-[10px] font-mono-numbers text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                              VERIFIED TENURE
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cryptographic Chain Integrity Indicator */}
                <div className="p-4 rounded-xl bg-black/60 border border-white/[0.08] flex items-center justify-between text-xs font-mono-numbers">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-zinc-300">Custody DAG Ledger Seal:</span>
                  </div>
                  <span className="text-emerald-400 font-bold tracking-wider">
                    {chain.provenanceIntegrityHash.slice(0, 18)}…
                  </span>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('generate')}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs tracking-wider uppercase transition flex items-center gap-2"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Initiate Custody Transfer</span>
                  </button>
                </div>

              </div>
            )}

            {/* TAB 2: GENERATE TRANSFER TOKEN */}
            {activeTab === 'generate' && (
              <div className="space-y-6">
                
                {!generatedToken ? (
                  <form onSubmit={handleGenerateToken} className="space-y-4">
                    <div className="p-4 rounded-xl bg-zinc-950/80 border border-amber-500/20 text-xs text-zinc-300 space-y-1">
                      <div className="font-bold text-amber-400 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Sovereign Handover Protocol Notice</span>
                      </div>
                      <p className="text-zinc-400 leading-relaxed">
                        Generating this token creates a time-locked cryptographic handshake binding the vehicle's current odometer ({currentMileage.toLocaleString()} miles), active Bill of Materials (BOM), and certified service records. The car's historical achievements remain permanently credited to your tenure.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono-numbers uppercase text-zinc-400 mb-1.5">
                          Intended Recipient Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          placeholder="e.g. Julian Sterling / Lord Vance"
                          className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-zinc-600 text-xs font-medium focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono-numbers uppercase text-zinc-400 mb-1.5">
                          Handshake Passcode *
                        </label>
                        <input
                          type="text"
                          required
                          value={passcode}
                          onChange={(e) => setPasscode(e.target.value)}
                          placeholder="e.g. PORSCHE-992-ATELIER"
                          className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-zinc-600 text-xs font-mono-numbers focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono-numbers uppercase text-zinc-400 mb-1.5">
                          Token Time-Lock Window
                        </label>
                        <select
                          value={validHours}
                          onChange={(e) => setValidHours(Number(e.target.value))}
                          className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono-numbers focus:border-amber-400 focus:outline-none"
                        >
                          <option value={24}>24 Hours (Immediate Handover)</option>
                          <option value={48}>48 Hours (Standard Transport Window)</option>
                          <option value={72}>72 Hours (Recommended / Auction Collection)</option>
                          <option value={168}>7 Days (International Transit)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-mono-numbers uppercase text-zinc-400 mb-1.5">
                          Verified Current Odometer
                        </label>
                        <input
                          type="text"
                          disabled
                          value={`${currentMileage.toLocaleString()} MILES`}
                          className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/5 text-zinc-400 text-xs font-mono-numbers cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="pt-3 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveTab('lineage')}
                        className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-bold text-xs tracking-wider uppercase transition shadow-lg flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Sign & Seal Handover Token</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="p-5 rounded-2xl bg-zinc-950/80 border border-emerald-500/25 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono-numbers px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30 uppercase">
                          TOKEN ARMED & SEALED
                        </span>
                        <span className="text-xs text-zinc-400 font-mono-numbers flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-zinc-500" />
                          Expires {new Date(generatedToken.expiresAt).toLocaleDateString('en-GB')}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-5 pt-2">
                        {/* Live SVG QR Code */}
                        <div className="p-2 rounded-xl bg-white flex-shrink-0 shadow-lg" dangerouslySetInnerHTML={{ __html: qrSvg }} />

                        <div className="space-y-2 w-full text-xs font-mono-numbers">
                          <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/60 border border-white/5">
                            <span className="text-zinc-500">Token Identifier:</span>
                            <span className="text-white font-bold">{generatedToken.tokenId}</span>
                          </div>

                          <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/60 border border-white/5">
                            <span className="text-zinc-500">Authorized Recipient:</span>
                            <span className="text-amber-400 font-semibold">{generatedToken.intendedRecipientName}</span>
                          </div>

                          <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/60 border border-white/5">
                            <span className="text-zinc-500">Passcode Required:</span>
                            <span className="text-zinc-300 font-semibold">{passcode}</span>
                          </div>

                          <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/60 border border-white/5">
                            <span className="text-zinc-500">SHA-256 State Checksum:</span>
                            <span className="text-zinc-400">{generatedToken.stateChecksum.slice(0, 16)}…</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={handleCopyToken}
                          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono-numbers text-xs transition flex items-center gap-2 border border-white/10"
                        >
                          {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedToken ? 'Token ID Copied' : 'Copy Token ID'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveTab('claim')}
                          className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                          <span>Switch to Acceptance Simulation</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setGeneratedToken(null)}
                          className="px-3 py-2 rounded-xl text-zinc-500 hover:text-zinc-300 text-xs transition ml-auto"
                        >
                          Create Another
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB 3: EXECUTE HANDSHAKE */}
            {activeTab === 'claim' && (
              <form onSubmit={handleExecuteHandover} className="space-y-4">
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-zinc-300 space-y-1">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Incoming Custodian Acceptance Portal</span>
                  </div>
                  <p className="text-zinc-400 leading-relaxed">
                    Executing this handshake completes the transfer of sovereignty. The vehicle's active custody record will be reassigned to your identity, and the departing custodian will be permanently archived in the car's provenance history.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono-numbers uppercase text-zinc-400 mb-1.5">
                      Handover Token ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={claimTokenInput}
                      onChange={(e) => setClaimTokenInput(e.target.value)}
                      placeholder="e.g. TOKEN-CUSTODY-1092-..."
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-zinc-600 text-xs font-mono-numbers focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono-numbers uppercase text-zinc-400 mb-1.5">
                      Security Passcode *
                    </label>
                    <input
                      type="text"
                      required
                      value={claimPasscode}
                      onChange={(e) => setClaimPasscode(e.target.value)}
                      placeholder="Enter the passcode provided by seller"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-zinc-600 text-xs font-mono-numbers focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono-numbers uppercase text-zinc-400 mb-1.5">
                      New Custodian Legal / Display Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newCustodianName}
                      onChange={(e) => setNewCustodianName(e.target.value)}
                      placeholder="e.g. Claire Redfield"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-zinc-600 text-xs font-medium focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono-numbers uppercase text-zinc-400 mb-1.5">
                      Primary Location / Region
                    </label>
                    <input
                      type="text"
                      value={newCustodianRegion}
                      onChange={(e) => setNewCustodianRegion(e.target.value)}
                      placeholder="e.g. Edinburgh, Scotland (UK)"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-zinc-600 text-xs font-medium focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono-numbers uppercase text-zinc-400 mb-1.5">
                    Custody Inscription / Notarization Notes
                  </label>
                  <textarea
                    rows={2}
                    value={transferNotes}
                    onChange={(e) => setTransferNotes(e.target.value)}
                    placeholder="e.g. Acquired for private collection and Alpine grand tours. PPI completed by certified specialist."
                    className="w-full px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-white placeholder-zinc-600 text-xs focus:border-amber-400 focus:outline-none resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('lineage')}
                    className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isClaiming}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-bold text-xs tracking-wider uppercase transition shadow-lg flex items-center gap-2 disabled:opacity-50"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>{isClaiming ? 'Executing Handshake…' : 'Execute Sovereign Custody Handshake'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>

          {/* Modal Footer */}
          <div className="px-6 py-3.5 bg-black/60 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono-numbers text-zinc-500">
            <span>UNBROKEN CHAIN OF CUSTODY • ISO-27001 AUDITED</span>
            <span>DATUM ATELIER LEDGER V1.0</span>
          </div>

        </div>
      </FluidLevitation>
    </div>
  );
};
