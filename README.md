# ChargeShare — Peer-to-Peer EV Charging Marketplace

> **Airbnb for EV chargers in India**

ChargeShare is an interactive 3D web experience and marketplace platform that helps electric vehicle owners find and book nearby private chargers while enabling homeowners to earn passive income from chargers that would otherwise sit idle.

---

## ⚡ Tech Stack & Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS v4
- **3D Engine**: Three.js (`WebGLRenderer`, `RoomEnvironment` IBL, procedural `CanvasTexture` telemetry & terrain, scroll-interpolated camera keyframes)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Unit Testing**: Node.js built-in test runner (`node:test` via `tsx`)

### Project Structure
```text
chargeshare/
├── index.html                           # Entry HTML with SEO, OpenGraph & Schema.org JSON-LD
├── metadata.json                        # Application metadata
├── package.json                         # Scripts and dependencies
├── tsconfig.json                        # TypeScript configuration
├── vite.config.ts                       # Vite bundler configuration
├── .env.example                         # Environment variable template
├── README.md                            # Setup and architecture documentation
└── src/
    ├── main.tsx                         # React DOM entry point
    ├── App.tsx                          # Root 7-chapter 3D narrative & marketplace controller
    ├── index.css                        # Tailwind CSS v4 & typography tokens
    ├── data/
    │   └── demoChargers.ts              # Realistic Indian EV charger listings & sample host data
    ├── utils/
    │   ├── marketplaceLogic.ts          # Pure functions for earnings calculation, filtering, validation & scroll chapters
    │   └── marketplaceLogic.test.ts     # Unit tests (run with `npx tsx --test src/utils/marketplaceLogic.test.ts`)
    ├── three/
    │   ├── SceneLighting.ts             # IBL environment, directional shadow rig, hemisphere fill & software-GL detection
    │   ├── ChargerModel.ts              # Articulated 10-part 3D Wallbox, OLED CanvasTexture, cable & energy pulses
    │   ├── NeighbourhoodScene.ts        # Miniature Indian residential block, clearcoat Electric SUV, trees & network arcs
    │   └── ScrollSceneController.ts     # 7-chapter camera keyframes, pointer parallax & exponential damping
    └── components/
        ├── Navbar.tsx                   # Persistent top navigation & announcement strip
        ├── HeroScene.tsx                # Chapter 01 (Discover) 3D WebGL stage, raycast interactions & bottom 3D control dock
        ├── StoryChapters.tsx            # Chapter 02 (Connect) & Chapter 04 (Book & Charge) 3D-synced sections
        ├── DiscoverySection.tsx         # Chapter 03 (Find Your Charger) interactive map, filters & slot booking drawer
        ├── InteractiveRoleShowcase.tsx  # Dual-perspective Driver EV range planner & Host request simulator
        ├── EarningsCalculatorSection.tsx# Chapter 05 (Share Your Charger) live INR host proceeds calculator
        ├── SafetyAndFeatureShowcase.tsx # Chapter 06 (Trust & Safety) verification & marketplace capabilities
        ├── IndiaMobilityAndConversion.tsx# Chapter 07 (Final Conversion) dual pathways & footer
        ├── InteractiveModals.tsx        # Host listing onboarding modal, Sign-in/Reservations modal & Policy modal
        └── EditorialIllustrations.tsx   # Procedural SVG architectural fallback poster & hardware diagrams
```

---

## 🚀 Quick Start (Local Development)

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server** (runs on `http://localhost:3000`):
   ```bash
   npm run dev
   ```

3. **Run unit tests**:
   ```bash
   npx tsx --test src/utils/marketplaceLogic.test.ts
   ```

4. **Type-check and build for production**:
   ```bash
   npm run lint
   npm run build
   ```

---

## 📌 The Problem

EV adoption is growing rapidly in India, but public charging infrastructure remains unevenly distributed. EV drivers often face battery anxiety when public DC fast chargers are kilometres away or congested.

At the same time, thousands of private residential chargers sit idle for 80–90% of the day. ChargeShare bridges this divide, turning private residential wallboxes into a dependable, distributed peer-to-peer charging network across Indian cities.

---

## 💡 The Solution

ChargeShare enables:
- **EV drivers** to discover, reserve, and pay for verified nearby residential chargers.
- **Hosts** to list idle chargers, define schedule availability, and earn passive income.
- **The platform** to manage identity verification, electrical safety standards, booking lifecycle, payments, and ratings.

---

## 🔄 How It Works

1. **Listing**: Host lists their home charger with location, connector type, charging speed (kW), pricing, and availability slots.
2. **Verification**: ChargeShare verifies host identity and charger electrical safety checklist.
3. **Discovery**: Driver discovers nearby chargers via the interactive map and filters by plug type, power, and pricing.
4. **Booking & Escrow**: Driver reserves a slot and pays through secure escrow.
5. **Session**: Driver arrives, connects to the charger, and monitors session telemetry.
6. **Settlement**: Both driver and host exchange ratings, and payout is transferred to host account after platform commission deduction.

---

## 🛡️ Safety, Trust & Liability

### Electrical Safety
- Connector verification (Type 2, CCS2, 15A Industrial socket, GB/T, Bharat AC-001)
- Verified dedicated earthing & MCB/RCCB trip protection checklist
- Safe parking access and weatherproof cable routing

### Privacy & Location Safety
- Approximate neighbourhood location displayed prior to booking confirmation
- Precise residential address and gate access instructions revealed only after reservation is confirmed

---

## 🗺️ Roadmap & Phases

- **Phase 1 — Validate Marketplace**: Pilot in key urban hubs (Bengaluru, Mumbai, Pune, Delhi NCR), onboarding initial verified residential hosts.
- **Phase 2 — Trust & Operations**: Enhanced digital KYC, hardware IoT telemetry integration, and automated refund/dispute dispute resolution.
- **Phase 3 — Network Scaling**: Society & gated community integrations (RWA dashboards), commercial fleet charging windows, and subscription packages.
