# TraceGuard — Real-Time Crypto Fraud Intelligence

TraceGuard is an enterprise-grade, simulated blockchain-forensics and cybersecurity investigation platform built with React, TypeScript, and Tailwind CSS. Designed with a dark SOC aesthetic, it enables investigators, compliance officers, and threat analysts to trace suspicious cryptocurrency flows, detect obfuscation infrastructure, attribute exchange hot wallets, and generate regulatory referrals.

## Key Features

- **7-Stage Investigation Workflow**:
  1. **Seed Address Ingestion**: Input suspect wallet addresses across Ethereum, Bitcoin, BNB Smart Chain, and Polygon with source classification.
  2. **Heuristic Address Clustering**: Interactive radial SVG graph identifying entities grouped by common-input ownership, time correlation, and behavior.
  3. **Interactive SVG Transaction Graph**: Full forensic canvas with pan/zoom, directional bezier curves, animated particle flow, and real-time category filtering.
  4. **Node Inspector**: Slide-over drawer providing detailed balance metrics, transaction counts, risk scoring, and behavioral flag signatures.
  5. **Risk Intelligence**: Circular Threat Gauge (0-100), weighted risk component bars, and hop-by-hop risk escalation timeline.
  6. **Exchange Attribution**: Probabilistic matching to centralized exchange deposit/hot wallets with confidence scoring and evidence checklists.
  7. **Regulatory Compliance Referrals**: Generate simulated FIU referral numbers (`FIU-DEMO-2026-XXXX`) and export structured investigation dossiers.
- **Dedicated Forensic Workspaces**:
  - **Case Files Repository**: Filterable incident database.
  - **Transaction Graph Explorer**: Dedicated full-canvas graph inspection.
  - **Risk Intelligence Analytics**: Recharts telemetry dashboard (funds traced over time, risk density distribution, blockchain breakdown, exposure matrix).
  - **Exchange Attribution Registry**: Monitored exchange profiles, sweep cadences, and cluster IDs.
  - **Compliance Alerts Queue**: Live queue of dispatched demo referrals.
  - **Reports Center**: Printable dossiers and text/markdown exports.
  - **Settings**: Adjustable risk thresholds, graph physics, and accessibility options.

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4 (Dark SOC Theme)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Graph**: Interactive pure SVG transaction engine

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/mithulpranav24012008/TraceGaurd.git
cd TraceGaurd

# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

## Simulation Notice

TraceGuard is a simulated blockchain-forensics prototype. All wallet clustering, risk scores, exchange attributions, and transaction data shown in this platform are synthetic demonstration data and do not represent live blockchain intelligence.
