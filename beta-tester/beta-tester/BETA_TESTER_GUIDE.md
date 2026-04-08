# Ultimate Security Suite — Beta Tester Onboarding

> **You've been selected as a lead tester for the industry's most advanced low-voltage site planning platform.**

**🔗 Live App:** [https://uss-app.insforge.site/](https://uss-app.insforge.site/)  
*Chrome or Edge desktop required for 3D Rendering.*

---

## 🚀 Quick Start (5 Minutes)

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open the [Beta URL](https://uss-app.insforge.site/) | Tactical login screen loads |
| 2 | Register a Mission ID (any username + password) | Dashboard with satellite setup |
| 3 | Enter any commercial address in the search bar | Satellite imagery loads in ~3 sec |
| 4 | Place 2-3 cameras from the device palette | FOV cones appear on the map |
| 5 | Click **3D View** button | Photorealistic 3D tile view launches |
| 6 | Open **Settings → Export Quote** | Full BOM and PDF export |

---

## 🎯 Mission Objectives

Your job is to stress-test every major workflow:

### 1. AI Site Recon (OSINT)
- Enter a complex facility address (multi-building campus, warehouse, hospital)
- Let the AI pull structural metadata
- Verify: floor count, building material, structural context

### 2. Tactical Ecosystem Layout
- Place at least one of each device: Camera, Node (IDF), Access Reader, WiFi AP
- Verify cable auto-routing connects devices to the nearest Node
- Check footage estimates match real-world expectations for the site scale

### 3. 3D Mission Visualizer
- Orbit the building from multiple angles
- Verify camera FOV cones are positioned correctly in 3D space
- Stress test: pan a dense urban area, note any tile rendering latency

### 4. WiFi Heatmap
- Switch to the Heatmap view
- Place 2-3 APs and observe signal propagation
- Test: adjust antenna gain and confirm the coverage radius changes

### 5. Enterprise Quote Export
- Open **Settings → Export Quote**
- Verify: SKUs appear for placed devices (Hanwha / Axis / Ubiquiti)
- Confirm labor hours auto-calculated from cable footage
- Export PDF and confirm formatting

### 6. AI Blueprint Extraction
- Navigate to the Blueprint tab
- Upload a photo of any floor plan (hand-drawn sketch works great)
- Verify AI generates structural wireframe

---

## 🔐 Admin Panel (Whitelabeling)

Enterprise partners can customize USS for their own brand:

**Access:**
1. Click the small **red lock icon** (ShieldAlert) at the top-right of the login box
2. Login: `admin` / `admin123`

**What you can configure:**
- Company name and logo
- Primary brand color
- Product catalog (import your own CSV price sheet)
- Default labor rates

**Price Sheet Testing:**
1. In Admin → Price Sheet tab, click **Export Template**
2. Modify SKUs/pricing in the downloaded CSV
3. Re-import with **Import Database**
4. Verify new SKUs appear in subsequent project quotes

---

## 📋 Feedback Protocol

Report **"Tactical Friction"** (UX pain points, bugs, confusing flows) via the in-app **FEEDBACK** button.

**Priority bugs to look for:**
- [ ] 3D tile rendering gaps or black holes
- [ ] Cable routing that clips through walls
- [ ] Quote SKUs that don't match placed device types
- [ ] AI blueprint extraction misidentifying walls vs. door openings

---

## 📎 Additional Resources

| Resource | Link |
|----------|------|
| Feature Showcase | [FEATURES_AND_VIDEOS.md](FEATURES_AND_VIDEOS.md) |
| Pilot's Manual | [ONBOARDING.md](ONBOARDING.md) |
| Marketing One-Pager | [index.html](index.html) |
| Outreach Templates | [outreach_templates.md](outreach_templates.md) |

---

*Proprietary Engineering by Ultimate Security Solutions · v1.0.0-PRO Beta · April 2026*
