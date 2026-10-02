# ARCHITECTURAL DECISION RECORDS (ADR)
## DATUM ATELIER // VEDIC TREE OS

---

### RECORD INDEX
- [ADR-0001: Adoption of Vedic Tree OS Change Request Protocol](#adr-0001-adoption-of-vedic-tree-os-change-request-protocol)
- [ADR-0002: Dynamic Cockpit Typology Architecture](#adr-0002-dynamic-cockpit-typology-architecture)
- [ADR-0003: Client-Side SHA-256 & Pure JS ISO/IEC 18004 QR Generation](#adr-0003-client-side-sha-256--pure-js-isoiec-18004-qr-generation)
- [ADR-0004: In-Memory HTML5 Canvas Plate Scrubbing](#adr-0004-in-memory-html5-canvas-plate-scrubbing)
- [ADR-0005: Specialist Workshop Cryptographic Stamping Protocol](#adr-0005-specialist-workshop-cryptographic-stamping-protocol)

---

### ADR-0001: Adoption of Vedic Tree OS Change Request Protocol
- **Date:** 2026-10-02
- **Status:** ACCEPTED
- **Context:** Operating on an existing production-grade automotive atelier application with strict requirements: zero TypeScript errors (`tsc -b`), 100% test passing, non-negotiable Git commit authoring (`--author="vD <vD@users.noreply.github.com>"`), and disciplined multi-tier architecture.
- **Decision:** All structural and functional changes must strictly pass through the Vedic Tree OS Change Request intake:
  1. Audit AGENTS.md, rules, skills, PRD (DOSSIER.md), and ARCHITECTURE.md.
  2. Classify change (Product, UX, UI, Database, API, Security, Business Rule, Infrastructure, AI).
  3. Determine affected modules, screens, entities, APIs, tests, backward compatibility.
  4. Create formal Implementation Plan prior to writing code.
  5. Implement smallest safe change.
  6. Verify: affected tests, regression tests, typecheck, lint, browser verification.
  7. Report 10-point audit summary.
- **Consequences:** Eliminates architectural drift, accidental data loss, regressions, and ensures complete traceability.

---

### ADR-0002: Dynamic Cockpit Typology Architecture
- **Date:** 2026-10-01
- **Status:** ACCEPTED
- **Context:** Car owners require personalization that reflects their automotive subculture, not mere CSS color swaps.
- **Decision:** Color themes are bound to `LayoutMode` ('monograph', 'chronograph', 'telemetry', 'blueprint', 'expedition'), dynamically adapting feed width (`feedWidthClass`), aspect ratios, and card plinth geometry through `ThemeContext.tsx` and custom properties in `index.css`.
- **Consequences:** Ensures haute-horlogerie aesthetic integrity while maintaining a unified responsive layout.

---

### ADR-0003: Client-Side SHA-256 & Pure JS ISO/IEC 18004 QR Generation
- **Date:** 2026-10-01
- **Status:** ACCEPTED
- **Context:** Cross-border ATA Carnet and customs verification must function offline on high Alpine passes without cellular connectivity or Node.js runtime dependencies.
- **Decision:** Built zero-dependency browser-native pure JS implementations: `sha256.ts` and `qrCodeGenerator.ts` utilizing Galois Field GF(256) Reed-Solomon polynomial math and inline SVG rendering.
- **Consequences:** Enables completely offline, sovereign cryptographic verification and paper replica generation.

---

### ADR-0004: In-Memory HTML5 Canvas Plate Scrubbing
- **Date:** 2026-10-01
- **Status:** ACCEPTED
- **Context:** Vehicle registration marks (VRM) are high-risk targets for cloning and burglary syndicates. Visual SVG/CSS overlays leave raw license plate pixels intact in image payloads.
- **Decision:** `plateRedactionCanvas.ts` permanently overwrites RGB bytes in an HTML5 Canvas pixel buffer before any image is encoded, previewed, or saved.
- **Consequences:** True privacy-by-design compliance under UK GDPR Article 17/25.

---

### ADR-0005: Specialist Workshop Cryptographic Stamping Protocol
- **Date:** 2026-10-02
- **Status:** ACCEPTED
- **Context:** Classical paper service booklets and dealer databases can be forged or lost, resulting in £10,000s in vehicle depreciation at auction. Independent specialists (Litchfield, Manthey, etc.) require a tamper-proof digital sign-off mechanism.
- **Decision:** Implemented `WorkshopStampEngine.ts` utilizing:
  1. Mechanic accreditation key signing over milestone metadata.
  2. SHA-256 itemized VAT invoice hashing.
  3. Immutable cryptographic hash-chaining linking each service stamp to the vehicle's previous stamp.
  4. Instant reflection in the car's Sovereign Logbook.
- **Consequences:** Provides certified investment-grade provenance (Grade A+) verifiable in offline or disconnected environments with zero database tampering vulnerability.

