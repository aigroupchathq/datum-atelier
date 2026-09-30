# ARCHITECTURE.MD — THE SOVEREIGN AUTOMOTIVE ATELIER SPECIFICATION
**Platform:** DATUM ATELIER (The Sovereign Digital Home for Extraordinary Automobiles)  
**System Architecture & Domain Protocol Specification**  
**Architect & Custodian:** vD  
**Tone & Philosophy:** Posh British & European Coachbuilder Atelier • Haute Horlogerie Precision • Zero Commercial Clutter  
**Jurisdiction:** United Kingdom & Continental Europe

---

## 1. Core Philosophy & Architectural Tenets

### 1.1 The Car as the Sovereign Social Object
In the Garage Atelier, cars are not mere profile thumbnails attached to humans; the automobile **is** the primary citizen.
- **Car First:** All journeys, modifications, diagnostic trouble codes, and acoustic signatures attach permanently to the vehicle's sovereign chassis record (`CAR` > `DRIVE` > `BUILD` > `MEMORY`).
- **Cryptographic Provenance:** Every vehicle maintains an immutable digital passport, tracking registered keepers, DVSA statutory MOT history, certified specialist invoices, and factory baseline configurations.

### 1.2 Unedited Candid Domestic Realism
We strictly reject generic, hyper-saturated AI renders, neon showroom floors, and promotional dealership advertisements.
- **Real British & European Environments:**
  - Cotswolds stone cottages (*Chipping Campden*)
  - British suburban block-paved driveways (*Harpenden, Hertfordshire*)
  - Victorian terraced bay curbsides (*Clifton, Bristol*)
  - Yorkshire Dales stone barn farmsteads (*Swaledale*)
  - Sunday 07:00 AM snow-foam pre-wash driveway routines
- **Authentic Weather & Topography:**
  - Overcast British skies, damp bitumen, slate cliffs, rain spray on windscreens, and low moorland mist.

### 1.3 Sovereign Privacy Enclave
Automotive collectors and driving enthusiasts demand absolute privacy:
- **Automatic Optical Cloaking:** Every uploaded photograph undergoes automated registration plate detection with laser sweep scanning and privacy veil redaction (*Frosted Glass*, *Pixelated Matrix*, or *Blackout Bar*).
- **800m Residential Sanctuary Perimeter:** All GPS routes and expedition telemetries automatically clip departure and arrival polyline endpoints by 800 meters, ensuring residential garaging locations remain encrypted.

---

## 2. Posh & Haute Horlogerie Design System

### 2.1 Typography Hierarchy
- **Luxury Display Headlines:** `Cinzel`, `Cinzel Decorative`, serif — uppercase, letter-spacing `0.12em` to `0.25em`. Evokes Mayfair coachbuilders, Savile Row tailoring, and Swiss watchmaking dials.
- **Editorial Subheads:** `Cormorant Garamond`, serif italic — warm, literary, reminiscent of vintage *Motorsport Magazine* and Goodwood Revival programs.
- **Telemetry & Engineering Metrics:** `JetBrains Mono` / `SF Mono` — tabular numerals for speed, RPM, lateral G, torque, and cryptographic hashes.
- **Clean Body Copy:** `Inter`, neutral zinc (`text-zinc-200` to `text-zinc-400`), never pure high-contrast `#FFFFFF` for continuous reading.

### 2.2 Metallic Foils & Stamped Chassis Details
- **Stamped Titanium Plates (`.chassis-plate`):**
  - Dark titanium brushed backgrounds (`#0B0C10` to `#121318`).
  - Dual-hairline border framing.
  - Four authentic corner screw rivets (`+`).
  - Machine-punched serial stamp typeface.
- **Luxury Foil Accents:**
  - `.foil-gold`: Dual-tone amber/gold metallic gradient.
  - `.foil-platinum`: Brushed rhodium/silver metallic sheen.
  - `.foil-emerald`: Deep racing green and Isle of Man emerald luster.
- **Posh Card Elevation (`.posh-card`):**
  - Subtle 1px translucent borders (`border-white/[0.08]` or `border-amber-500/20`).
  - Deep obsidian backgrounds (`#09090B`, `#0D0E12`).
  - Smooth micro-interactions without jittery bouncy animations.

---

## 3. Tone of Voice & Lexicon Guidelines

### Prohibited Patterns (What to Avoid):
- ❌ Social media slang: *"Drop a like"*, *"Smash subscribe"*, *"Influencer"*, *"Check out my content"*.
- ❌ Cheap dealership jargon: *"Buy now"*, *"Discount"*, *"Cheap car"*, *"Financing available"*.
- ❌ Cluttered notifications: Browser `alert()` popups, flashing neon banners, rainbow gradient buttons.

### Mandatory Vocabulary (What to Use):
- ✅ **Atelier & Preservation:** *Custodian*, *Provenance*, *Chassis Dossier*, *Notarization*, *Sovereign Identity*, *Heritage Grade*.
- ✅ **Engineering & Telemetry:** *Valvetrain Soulprint*, *Corner Balancing*, *Laser String Alignment*, *Barometric Telemetry*, *Lateral Load (G)*, *Hub Dyno Cell*, *Damp Bitumen*.
- ✅ **Locations & Events:** *B-Road Expedition*, *Dawn Patrol*, *Paddock Shakedown*, *Rendezvous Point*, *National Park Passes*.
- ✅ **Privacy:** *Optical Cloaking*, *Sanctuary Geofence*, *Cryptographic Enclave*, *Redacted Index*.

---

## 4. Completed Systems Architecture

1. **`CarProfilePage.tsx`:** Stamped titanium chassis plaques, multi-car fleet switching (`MAYA`, `KURO`, `RETRO MOD`, `EXPEDITION`), interactive Web Audio valvetrain soulprint synthesizer, and integrated digital passport.
2. **`VehiclePassportModal.tsx`:** 5-part leather-bound passport covering V5C Identity, DVSA MOT History, Verified Hardware Ledger, Enclave Privacy Score, and Mayfair & Goodwood Ownership Transfer Certificate with downloadable encrypted JSON dossier.
3. **`CreatePostModal.tsx`:** Atelier Log Entry with certified hardware ledger notarization (fitter, cost, dyno delta), expedition telemetry logging, and optical plate cloaking studio.
4. **`GarageProPage.tsx`:** Bespoke Atelier Directory featuring 4 fixed-fee concierge services (*Hunter 3D Alignment*, *V5C Title Audit*, *Enclosed Climate Transporter*, *Maha Hub-Dyno Calibration*) and an interactive commission booking modal.
5. **`DriveDetailPage.tsx`:** Multi-route B-Road Expedition Studio (*Snake Pass A57*, *Llanberis Pass A4086*, *Cotswolds Roman Way B4425*), synchronized canvas polyline map, topographical elevation profile with tracking cursor, sector hazard ledger, and live convoy registration.
6. **`CommunitiesPage.tsx`:** Paddock Guilds with Live Convoy Roll-Call HUD, confirmed driver check-in cards with cold tyre PSI & PMR446 radio frequencies, and the 2026 Paddock Challenges.
7. **`DynoStudio.tsx`:** Interactive SVG dyno curve comparison (*Factory* vs *Stage 1* vs *Stage 2 Akrapovič*) with real-time hover scrub for BHP, Torque, and Boost, alongside factory torque specifications.
8. **`AcousticStudioModal.tsx`:** Web Audio multi-oscillator valvetrain harmonics laboratory with continuous idle, tachometer scrubbing from 800 to 9,000 RPM, dynamic throttle blipping, multi-channel VU spectrum analyzer, and side-by-side vehicle acoustic superposition.
9. **`PassGripRadarModal.tsx`:** Real-time micro-climate & road surface friction telemetry station covering 6 legendary UK mountain passes (*Snake Pass A57*, *Llanberis Pass A4086*, *Bealach na Bà*, *Hardknott Pass*, *Cheddar Gorge B3135*, *Black Mountain Pass A4069*), tracking friction coefficient ($\mu$), dew point margins, dawn frost simulation, and PMR446 convoy radio locking.
10. **`CommissioningAtelierModal.tsx`:** Mayfair & Goodwood bespoke coachbuilder commissioning atelier featuring authentic Paint-to-Sample heritage palettes (*Oak Green Metallic Neo*, *Isle of Man Green*, *British Racing Green*, *Viola Metallic*), Scottish Bridge of Weir bull hides, open-pore timber/matte carbon architecture, interactive laser-stamped titanium chassis plaque, and exportable JSON Atelier Specification Dossier.
11. **Atelier Palette Polish:** Enforced luxury amber/gold, rose, emerald, and titanium silver accents across feed cards, comment drawers, and global UI, completely eliminating cheap neon highlights.
12. **`TransitCarnetModal.tsx`:** Official Cross-Border Transit & ATA Carnet Logistics Enclave featuring London Chamber of Commerce international customs carnet generation (`GB/LON/2026/8841-K`), European alpine pass clearance radar (*Stelvio 2,757m*, *Furka 2,429m*, *Großglockner 2,504m*, *Col de Turini 1,607m*), Eurotunnel low-clearance supercar carriage allocation, Dover-Calais approach ramp certification, Continental vignette compliance (*Swiss 40 CHF*, *Austrian Asfinag*, *French Crit’Air 1*), multi-currency agreed valuation hedging (£ GBP / € EUR / CHF), and cryptographic JSON carnet export.
13. **`TyrePyrometerModal.tsx`:** 3-Zone Infrared Tyre Pyrometer & Contact Patch Studio featuring 4-wheel thermal topology (FL, FR, RL, RR) with outer, center, and inner shoulder sensors (°C), camber delta ($\Delta T$) balancing, cold vs hot target PSI expansion predictor, and direct notarization into the vehicle's diagnostic telemetry ledger.
14. **Fleet-Wide Authentic Carriage Ledgers:** Comprehensive vehicle-specific datasets for all four stable vehicles (`MAYA` G80 M3, `KURO` 992 GT3 Touring, `RETRO MOD` E30 318is Slicktop, `EXPEDITION` Defender 110 P400 SE) spanning unique logged expeditions, build evolution versions with certified specialist workshops, sovereign memories with authentic provenance signatories, and tailored mechanical diagnostic parameters (*PCCB wear*, *Centerlock 600 Nm torque*, *Mechanical valve lash*, *900mm Wading sonar*).
15. **Serene Atelier Feed Refinement & Literary Aesthetics:** Overhauled the feed experience from high-contrast/aggressive UI into an understated, tranquil British & European atelier journal. Softened `.card-surface` with obsidian velvet gradients, 20px organic curves, and subtle warm champagne gold hairlines. Converted raw technical uppercase keys (`DRIVE`, `BUILD_UPDATE`, `CAR_POST`, etc.) into graceful literary classifications (`B-Road Expedition`, `Chassis Specification`, `DVSA Statutory Pass`, `Workshop Blueprint`, `Atelier Service Log`, `Paddock Convoy`, `Sovereign Journal`). Replaced cyan spots with warm amber and sunburst mountain elevation telemetry graphs. Added rounded-full filter pills and conversational driver perspective prompts.

---

## 5. Ongoing Protocol for Future Iterations

When introducing new capabilities:
1. Always preserve the **posh, understated, coachbuilder tone**.
2. Ground all features in **tangible automotive engineering** (e.g. damper damping curves, tyre slip angles, brake thermal capacities, fuel RON ratings).
3. Ensure every interaction gives feedback via the high-precision **HUD Toast notification system** rather than disruptive browser popups.
4. Test and verify clean compilation via `npm.cmd run build` before concluding changes.
