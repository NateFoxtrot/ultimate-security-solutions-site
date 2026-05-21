# Project Context: Website_Final (LTS Catalog Building)

**Project Goal**: Build the LTS (Lifetime Security) product catalog for the website. LTS is an equipment manufacturer.
**Location**: `/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final`

---

## 🚀 Accomplishments So Far
- **Comprehensive Audit**: Explored project directory, identifying key assets (`products.js`, `styles.css`, `ordering_system.html`).
- **Design Alignment (FINALIZED)**: Identified the definitive company theme from the **Ultimate Security Solutions Company Logo**. The aesthetic is **Industrial/Military Tactical** ("Engineers for the AI Age"). 
- **Core Aesthetic Tokens**: 
    - **Palette**: Olive Drab, Metallic Bronze/Gold, Slate Grey, and Dark Navy with Cyan circuit accents.
    - **Vibe**: Gritty, industrial, "Concrete/Metal" textures, stencil-style typography.
    - **Motifs**: Shields, circuit-integrated "U" logo, and technical schematics.
- **Data Inspection**: Audited `products.js` (1.3MB) specifically for "Pro-X" series structure and mapping.
- **Frontend Logic**: Verified `ordering_system.html` rendering engine, including optimized filtering and dynamic card generation.

## 🛠️ Planned Changes (Roadmap)
- [ ] **Industrial Theme Overhaul**: Completely rewrite `styles.css` to transition from "Mission Control" to the **Industrial/Military Tactical** aesthetic (Olive/Bronze/Slate palette).
- [ ] **Stencil Typography**: Integrate military-style stencil fonts for headings to match the branding.
- [ ] **NDAA Compliance Audit**: Implement `is_ndaa_compliant` boolean flags across all relevant products in `products.js`.
- [ ] **Frontend Badge System**: Update `ordering_system.html` logic to display "NDAA" badges on product cards and overlays.
- [ ] **Pro-X Asset Verification**: Resolve missing imagery and verify technical specifications for all "Pro-X" series products.
- [ ] **Marketing Alignment**: Synchronize assets in `marketing/` with the new Industrial/Military UI theme.

## ⚠️ Known Constraints & Gotchas
- **API Quota**: Limited to 1,000 requests/day. Optimize for larger, batched edits to conserve quota.
- **Visual Identity**: The theme MUST mirror the **Company Logo** (Industrial/Gritty), NOT the clean USS Suite logo. 
- **Data Size**: `products.js` is large (~1.3MB).
- **Protocol**: Always end responses with `*verified by vibecheck*` and include a "What's left" section.

---
*Last updated: 2026-04-28*