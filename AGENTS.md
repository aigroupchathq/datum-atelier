# AGENTS.md // VEDIC TREE OS & CODEBASE SPECIFICATION
## DATUM ATELIER (The Sovereign Digital Home for Extraordinary Automobiles)

---

## 1. Operating Rules & Core Constraints (NON-NEGOTIABLE)

1. **Git Commit Author:**
   All git commits must strictly specify the author:
   `git commit -m "..." --author="vD <vD@users.noreply.github.com>"`
   *Never omit `--author`.*

2. **Shell & Environment:**
   - Operating System: Windows PowerShell
   - Node tooling: Always use `npm.cmd` and `npx.cmd`. Never execute raw `npm` or `.ps1` scripts directly.
   - Command chaining: In PowerShell, use `;` as the statement separator, NOT `&&`.

3. **Code Quality & Build Invariants:**
   - Zero TypeScript errors (`tsc -b` must exit with code 0).
   - Zero test regressions (`npm.cmd test -- --run` must pass all tests).
   - No unused locals or parameters (`noUnusedLocals` / `noUnusedParameters` are enabled in `tsconfig`).
   - Clean Vite production builds (`npm.cmd run build` must complete cleanly).

4. **Design & UX Language (Haute Horlogerie & Sovereign Restraint):**
   - Aesthetic standard: "Haute Horlogerie", high-society editorial design, mechanical instrument precision.
   - Posh = whispers, never advertises; luxury is restraint, not opulence.
   - Respect the 5-theme typology system:
     * `white-yellow` (Monograph)
     * `obsidian` (Chronograph)
     * `bordeaux-cyan` (Telemetry)
     * `c2mtl-avantgarde` (Blueprint)
     * `alpine-emerald` (Expedition)
   - Layout geometry morphs with theme (`data-layout` attribute and `feedWidthClass`).

5. **Defensive Privacy Architecture:**
   - Client-side license plate pixel scrubbing via HTML5 Canvas before network transmission.
   - Deterministic 800m residential sanctuary geofencing on departure and arrival points.
   - No public speed leaderboards or street racing metrics (per DOSSIER.md Anti-Scope).

---

## 2. Codebase Structure & Key Modules

```
datum-app/
├── docs/                     # Architectural Decision Records (00-decisions.md)
├── src/
│   ├── components/
│   │   ├── atelier/          # Commissioning & Architectural Chamber modals
│   │   ├── common/           # ProvenanceBadge, PlateBlurImage, Passport, AcousticStudio, etc.
│   │   ├── feed/             # FeedCard, StoriesBar, StoryViewerModal, CreatePostModal, CommentsDrawer, FeedEmptyState
│   │   ├── layout/           # Navbar, MobileNav
│   │   ├── logistics/        # TransitCarnetModal (ATA Carnet & customs documentation)
│   │   ├── profile/          # DynoStudio
│   │   ├── system/           # BackendInspectorModal
│   │   └── telemetry/        # GripMetricCard, RadialDynamicsCluster, TyrePyrometerModal, PassGripRadarModal
│   ├── context/
│   │   ├── ThemeContext.tsx  # Dynamic Cockpit Typology (5 themes + layout modes)
│   │   └── ToastContext.tsx  # Sovereign toast dispatches
│   ├── core/
│   │   ├── carnet/           # CarnetVaultEngine (multi-sig signatures, customs stamp chains)
│   │   └── crypto/           # Pure JS sha256.ts & ISO/IEC 18004 qrCodeGenerator.ts
│   ├── data/                 # mockData.ts, dossierFaqs.ts
│   ├── pages/                # FeedPage, CarProfilePage, ExplorePage, CommunitiesPage, GarageProPage, AboutCaseStudyPage, DriveDetailPage
│   ├── utils/                # gripCalculation.ts, openMeteoWeather.ts, respectRatingEngine.ts, plateRedactionCanvas.ts
│   └── index.css             # Luxury theme tokens, machined bevels, guilloche textures
├── tests/                    # 6 test suites (.mjs) run via tsx --test
├── ARCHITECTURE.md           # Systems Architecture & Distributed Design (Levels 1–6)
└── DOSSIER.md                # Master Commercial & Product Specification (PRD)
```

---

## 3. Change Request Workflow (Vedic Tree OS)

Before making any modification:
1. Audit AGENTS.md, DOSSIER.md, and ARCHITECTURE.md.
2. Classify change (Product, UX, UI, Database, API, Security, Business Rule, Infrastructure, AI).
3. Determine affected modules, screens, entities, APIs, permissions, tests, backward compatibility.
4. If conflict with existing architecture exists, record in `docs/00-decisions.md`.
5. Create an implementation plan before writing code.
6. Implement the smallest safe change.
7. Run tests (`npm.cmd test -- --run`) and verify build (`npm.cmd run build`).
8. Report 10-point audit summary.
