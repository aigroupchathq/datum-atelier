import { useState } from 'react';
import type { FC } from 'react';
import { mockPros } from '../data/mockData';
import { 
  ShieldCheck, 
  Star, 
  MapPin, 
  ArrowRight, 
  Wrench, 
  Gauge, 
  Truck, 
  FileCheck2, 
  Calendar, 
  Check, 
  X, 
  Sparkles,
  Building2,
  ChevronRight,
  Globe2
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { CommissioningAtelierModal } from '../components/atelier/CommissioningAtelierModal';
import { TransitCarnetModal } from '../components/logistics/TransitCarnetModal';

// Concierge Bespoke Services
const CONCIERGE_SERVICES = [
  {
    id: 'bespoke-commission',
    title: 'Mayfair Bespoke Coachbuilder Commission & Plaque Forge',
    category: 'Atelier Tailoring',
    leadTime: 'Bespoke Atelier Lead',
    fixedFee: '£1,850.00',
    description: 'Heritage Paint-to-Sample (PTS) allocation, Bridge of Weir Scottish bull-hide tailoring, machine-turned billet titanium plaque, and physical Goodwood presentation box.',
    icon: Sparkles,
    recommendedFor: 'Bespoke custom builds & historic commemorations'
  },
  {
    id: 'geo-setup',
    title: 'Hunter HawkEye 3D Geometry & Corner Balancing',
    category: 'Chassis Engineering',
    leadTime: '48h Priority Slot',
    fixedFee: '£280.00',
    description: 'Laser string alignment, 4-corner wheel scales, negative camber & toe calibration with sealed printout notarized to digital vehicle passport.',
    icon: Gauge,
    recommendedFor: 'Fast-road B-roads & track-day preparation'
  },
  {
    id: 'dvsa-audit',
    title: 'V5C Sovereign Provenance & Enclave Title Audit',
    category: 'Provenance Certification',
    leadTime: '24h Digital Delivery',
    fixedFee: '£350.00',
    description: 'DVSA statutory mileage integrity verification, title history clearance, physical chassis stamping inspection, and tamper-evident NFC windscreen seal.',
    icon: FileCheck2,
    recommendedFor: 'Acquisitions & concours valuation'
  },
  {
    id: 'enclosed-transport',
    title: 'Enclosed Climate-Monitored Transporter Logistics',
    category: 'Private Logistics',
    leadTime: 'Next-Day Dispatch',
    fixedFee: '£4.20 / mi',
    description: 'Single-car enclosed Brian James transport across Great Britain, Isle of Man, and Continental European circuits (Spa-Francorchamps, Nürburgring Nordschleife).',
    icon: Truck,
    recommendedFor: 'Low-ground-clearance track & historic vehicles'
  },
  {
    id: 'dyno-cell',
    title: 'Maha LPS 3000 Hub-Dyno Diagnostic Calibration',
    category: 'Powertrain Calibration',
    leadTime: '3-Day Turnaround',
    fixedFee: '£420.00',
    description: 'Controlled dyno cell runs with wideband lambda AFR monitoring, knock-sensor telemetry recording, and 99 RON fuel map fine-tuning.',
    icon: Wrench,
    recommendedFor: 'Hardware validation & power notarization'
  },
  {
    id: 'ata-carnet',
    title: 'ATA Carnet International Customs Passage & Bond',
    category: 'International Transit',
    leadTime: '48-Hour Issuance',
    fixedFee: '£480.00',
    description: 'Official London Chamber of Commerce ATA Carnet registration, French/Swiss customs bond indemnity, and Eurotunnel wide-carriage clearance.',
    icon: Globe2,
    recommendedFor: 'Alpine Tours, Nürburgring & Concorso d’Eleganza'
  }
];

export const GarageProPage: FC = () => {
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Commission Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isCommissioningModalOpen, setIsCommissioningModalOpen] = useState(false);
  const [isTransitCarnetOpen, setIsTransitCarnetOpen] = useState(false);
  const [activeServiceName, setActiveServiceName] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('MAYA — BMW M3 Competition (G80)');
  const [preferredDate, setPreferredDate] = useState('2026-10-15');
  const [bookingNotes, setBookingNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['All', 'Mechanic', 'Tyre Specialist', 'Detailer', 'Restorer'];

  const filteredPros = mockPros.filter((pro) => {
    if (selectedCategory === 'All') return true;
    return pro.category === selectedCategory;
  });

  const handleOpenBooking = (serviceIdOrTitle: string, serviceTitle?: string) => {
    if (serviceIdOrTitle === 'bespoke-commission') {
      setIsCommissioningModalOpen(true);
      return;
    }
    if (serviceIdOrTitle === 'ata-carnet') {
      setIsTransitCarnetOpen(true);
      return;
    }
    const title = serviceTitle || serviceIdOrTitle;
    setActiveServiceName(title);
    setIsBookingOpen(true);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsBookingOpen(false);
      showToast({
        title: 'Concierge Commission Registered',
        message: `Atelier dossier #AGY-${Math.floor(1000 + Math.random() * 9000)} created for ${selectedVehicle}. Direct specialist contact initiated.`,
        type: 'garage'
      });
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Editorial Atelier Header */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#14151B] to-[#0A0B0E] border border-amber-500/20 p-6 sm:p-10 shadow-2xl overflow-hidden">
        {/* Subtle background luxury glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-zinc-700/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative space-y-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-mono-numbers font-bold border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>ATELIER CONCIERGE & SPECIALIST GUILD</span>
            </span>
            <span className="text-xs text-zinc-400 font-mono-numbers">
              DVSA & Goodwood Accredited Network
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white font-luxury-display uppercase tracking-wider leading-tight">
            The Atelier Directory
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 font-luxury-editorial italic leading-relaxed text-lg">
            "A sovereign network of master technicians, laser geometry calibrators, and coachwork preservationists. Vetted strictly through documented mechanical proof of work—never commercial pay-to-play advertisements."
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono-numbers text-zinc-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero Sponsored Placements</span>
            </div>
            <div className="text-zinc-700">•</div>
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Independent UK & EU Specialists</span>
            </div>
            <div className="text-zinc-700">•</div>
            <div className="flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-cyan-400" />
              <span>Direct Passport Stamping</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* BESPOKE CONCIERGE SERVICES (Instant Commissioning)        */}
      {/* ========================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800 pb-3">
          <div>
            <span className="text-[11px] font-mono-numbers uppercase text-amber-400 tracking-wider block font-bold">
              ATELIER CONCIERGE PACKAGES
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-luxury-display tracking-wide">
              Bespoke Engineering Commissions
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCommissioningModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold text-xs font-luxury-display uppercase tracking-wider transition shadow-lg flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
              <span>Launch Commissioning Atelier</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CONCIERGE_SERVICES.map((srv) => {
            const Icon = srv.icon;
            return (
              <div 
                key={srv.id}
                className="rounded-2xl bg-[#0F1014] border border-zinc-800/90 hover:border-amber-500/40 p-5 flex flex-col justify-between space-y-4 transition-all duration-300 hover:shadow-xl group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 group-hover:border-amber-500/50 group-hover:scale-105 transition">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono-numbers uppercase text-zinc-500 tracking-wider">
                          {srv.category}
                        </span>
                        <h3 className="text-sm font-bold text-white group-hover:text-amber-200 transition">
                          {srv.title}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-bold text-amber-400 font-mono-numbers">{srv.fixedFee}</div>
                      <span className="text-[10px] text-zinc-500 font-mono-numbers">{srv.leadTime}</span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    {srv.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-zinc-500 italic">
                    {srv.recommendedFor}
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => handleOpenBooking(srv.id, srv.title)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-amber-400 hover:text-zinc-950 text-white font-mono-numbers font-bold text-xs transition flex items-center gap-1.5"
                  >
                    <span>Commission</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* VETTED SPECIALISTS DIRECTORY                              */}
      {/* ========================================================= */}
      <div className="space-y-6">
        
        {/* Header & Filter Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <span className="text-[11px] font-mono-numbers uppercase text-zinc-400 tracking-wider block font-bold">
              VERIFIED GUILD MEMBERS
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-luxury-display tracking-wide">
              Certified Workshops & Technicians
            </h2>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl transition font-mono-numbers text-xs font-semibold ${
                  selectedCategory === cat
                    ? 'bg-amber-400 text-zinc-950 shadow-md font-bold'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Specialists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPros.map((pro) => (
            <div
              key={pro.id}
              className="posh-card rounded-2xl bg-[#0F1014] border border-zinc-800/90 p-6 flex flex-col justify-between space-y-5 hover:border-amber-500/30 transition-all duration-300 hover:shadow-2xl relative group"
            >
              <div className="space-y-3.5">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="text-base font-bold text-white font-luxury-display tracking-wide group-hover:text-amber-300 transition">
                      {pro.businessName}
                    </h3>
                    <span className="text-xs text-amber-400/90 font-mono-numbers tracking-wide">
                      {pro.category}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono-numbers font-bold flex items-center gap-1 shrink-0">
                    <ShieldCheck className="w-3 h-3" /> VERIFIED
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono-numbers">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{pro.locationArea}</span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  {pro.bio}
                </p>

                {/* Specialist Marques Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {pro.specialistMakes.map((make, idx) => (
                    <span key={idx} className="text-[10px] font-mono-numbers px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                      {make}
                    </span>
                  ))}
                </div>

                {/* Verified Portfolio Entries */}
                <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
                  <span className="text-[10px] uppercase font-mono-numbers text-zinc-500 block tracking-wider">
                    Documented Proof of Work
                  </span>
                  {pro.verifiedPortfolio.map((job, i) => (
                    <div key={i} className="text-xs bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-850 space-y-0.5">
                      <div className="font-semibold text-white flex items-center justify-between text-[11px]">
                        <span>{job.vehicleName}</span>
                        <span className="text-zinc-500 font-mono-numbers text-[10px]">{job.date}</span>
                      </div>
                      <div className="text-[11px] text-zinc-400">{job.workSummary}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 space-y-3">
                <div className="flex justify-between items-center text-xs font-mono-numbers">
                  <span className="text-zinc-400">{pro.verifiedJobsCount} jobs stamped</span>
                  <span className="text-amber-400 flex items-center gap-1 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{pro.ratingScore.toFixed(1)}</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenBooking(`Consultation: ${pro.businessName}`)}
                  className="w-full py-2.5 rounded-xl bg-zinc-850 hover:bg-amber-400 hover:text-zinc-950 text-white font-mono-numbers font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Request Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* INTERACTIVE CONCIERGE BOOKING MODAL                       */}
      {/* ========================================================= */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0B0C0E] border border-amber-500/30 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative my-auto animate-in fade-in duration-200">
            
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-luxury-display uppercase tracking-wider">
                    Atelier Commission Form
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans">
                    {activeServiceName}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsBookingOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4">
              
              {/* Selected Vehicle */}
              <div>
                <label className="text-[11px] font-mono-numbers uppercase text-zinc-400 block mb-1">
                  Commissioning Vehicle
                </label>
                <select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-mono-numbers focus:border-amber-400 outline-none"
                >
                  <option value="MAYA — BMW M3 Competition (G80)">MAYA — BMW M3 Competition (G80)</option>
                  <option value="KURO — Porsche 911 GT3 (992)">KURO — Porsche 911 GT3 (992)</option>
                  <option value="1989 BMW 318is (E30 Slicktop)">1989 BMW 318is (E30 Slicktop)</option>
                  <option value="EXPEDITION — Land Rover Defender 110">EXPEDITION — Land Rover Defender 110</option>
                </select>
              </div>

              {/* Preferred Date */}
              <div>
                <label className="text-[11px] font-mono-numbers uppercase text-zinc-400 block mb-1">
                  Target Service Date
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-mono-numbers focus:border-amber-400 outline-none"
                  required
                />
              </div>

              {/* Engineering Scope Notes */}
              <div>
                <label className="text-[11px] font-mono-numbers uppercase text-zinc-400 block mb-1">
                  Specific Engineering Requirements
                </label>
                <textarea
                  rows={3}
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder="Specify desired camber angles, tyre pressures, track vs road focus, or parts to be inspected..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-sans focus:border-amber-400 outline-none resize-none"
                />
              </div>

              {/* Sovereign Privacy Assurance */}
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-start gap-2.5 text-xs text-zinc-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed">
                  Your exact residential garaging address remains encrypted. Only vehicle technical specifications and contact details are dispatched to the certified specialist.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-800 text-xs font-mono-numbers text-zinc-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-zinc-950 font-bold text-xs font-mono-numbers uppercase tracking-wider transition-all disabled:opacity-50 active:scale-95 shadow-md flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <span>Registering...</span>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Confirm Commission</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Bespoke Mayfair Coachbuilder Commissioning Modal */}
      <CommissioningAtelierModal
        isOpen={isCommissioningModalOpen}
        onClose={() => setIsCommissioningModalOpen(false)}
        carName="MAYA"
        carModel="BMW M3 Competition (G80)"
        initialVin="WBA-33AY-08P-G8077"
      />

      {/* Cross-Border ATA Carnet & Alpine Transit Enclave Modal */}
      <TransitCarnetModal
        isOpen={isTransitCarnetOpen}
        onClose={() => setIsTransitCarnetOpen(false)}
        carName="MAYA"
        carModel="BMW M3 Competition (G80)"
        vin="WBA-31AY-0084-M3"
      />

    </div>
  );
};
