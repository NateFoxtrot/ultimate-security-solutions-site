# 🦅 Ultimate Security Suite — Pilot's Manual

**Welcome, Operator.** You've been selected for the Beta Launch of **Ultimate Security Suite** — the industry's most advanced mission architecture platform for low-voltage professionals.

**🔗 Your Console:** [https://xr3keedn.insforge.site/](https://xr3keedn.insforge.site/)  
*Chrome or Edge desktop required. Mobile view available but 3D requires desktop.*

---

## 🏁 Phase 1: Pre-Flight Checklist

Before your first mission, confirm the following:

- [ ] **Browser**: Chrome or Edge desktop (required for 3D Tiles rendering)
- [ ] **Auth**: Create a Mission ID at the login screen — any username + password
- [ ] **API Status**: The Google Maps API Key is pre-configured. No setup required.
- [ ] **Quick Read**: Review the [Feature Showcase](FEATURES_AND_VIDEOS.md) — 5 min read, 10x better first session

---

## 🛠️ First Mission: Complete Walkthrough

### Step 1 — Site Recon (AI OSINT)

1. After login, you'll see the **Site Setup** panel
2. Type any commercial address into the address bar (try a warehouse, hospital, or campus)
3. Hit Enter or click the arrow — satellite imagery loads in 2-3 seconds
4. The AI analyzes the site: building materials, floor count, structural layout
5. Review the AI-generated site brief in the sidebar

> **Pro tip:** Dense urban locations or multi-building campuses give the AI the most data to work with.

---

### Step 2 — Build Your Tactical Ecosystem

1. Under the **Devices** palette, select **Camera** and click anywhere on the satellite map to place
2. A FOV cone appears automatically — adjust direction by dragging the cone handle
3. Place a **Node (IDF/MDF)** — this is your cable termination point
4. USS automatically draws a cable route from the camera to the nearest Node
5. Place **WiFi APs** and switch to **Heatmap View** to see signal propagation
6. Place **Access Readers** — they auto-route to the nearest Node as well

**Device Quick Reference:**
| Device | Icon | Routes To | Auto-Calculates |
|--------|------|-----------|-----------------|
| Camera | 📷 | Nearest Node | Cable footage, FOV zones |
| Node (IDF) | 🖧 | Root/MDF | Port count, rack units |
| WiFi AP | 📡 | Nearest Node | Coverage radius, overlap |
| Access Reader | 🔐 | Nearest Node | Cable footage, power draw |

---

### Step 3 — Validate in 3D

1. Click the **3D View** button in the top toolbar
2. The map transitions to photorealistic Google Maps 3D Tiles
3. **Navigate:** Left-click drag (pan) · Right-click drag (orbit) · Scroll (zoom)
4. Verify camera FOV cones are correctly positioned against the real building geometry
5. Use the **Pegman** icon to drop into Street View for a ground-level perspective

> **This is the client wow moment.** Walk them through the 3D view in your sales presentation — it closes deals.

---

### Step 4 — Export Your Quote

1. Open **Settings** (gear icon) → **Export Quote**
2. Review the auto-generated BOM:
   - Device line items with SKUs (Hanwha / Axis / Ubiquiti by default)
   - Labor hours estimated from cable footage and device count
   - Subtotal, tax, and margin fields
3. Click **Export PDF** — a professional proposal generates instantly
4. Click **Export CSV** for your distributor order sheet

---

### Step 5 — Mission Briefing (Bonus)

1. Click **Generate Briefing** from the main toolbar
2. USS generates a phased rollout presentation:
   - Phase 1: Underground/Rough-In
   - Phase 2: Device Installation
   - Phase 3: Network Commissioning
   - Phase 4: Client Handoff & Testing
3. Present in full-screen mode or export to PDF

---

## 📹 Platform Preview

The marketing walkthrough video is available via the Promo Director (run `node marketing_director.cjs` from the project root to regenerate).

Feature highlights covered:
- **[Intro]** Site Setup & Satellite Recon
- **[Core]** Device Placement & Auto-Routing
- **[Advanced]** 3D Tactical Simulation & DORI Analysis
- **[Revenue]** Quote Export & BOM Generation

---

## 📡 Reporting Tactical Friction

Use the **FEEDBACK** button at the top-right of the interface to report bugs or friction points.

**Priority Areas:**
1. 3D tile rendering performance (pan speed, black tile gaps)
2. Cable routing accuracy vs. obstacle positions
3. Quote SKU accuracy vs. placed device types
4. AI blueprint extraction — false positive wall detections

Every report goes directly to Mission Control for immediate triage. Your feedback shapes the v1.1 roadmap.

---

*Ultimate Security Suite · Intelligence-to-Install Ecosystem · v1.0.0-PRO Beta*  
*Proprietary Engineering by Ultimate Security Solutions · April 2026*
