# 🌾 AGROVERSE AI (AgriNexus)
> **From Satellite Intelligence to Farm-Level Decisions.**
> *AI-powered Digital Public Infrastructure (DPI) for Climate-Resilient Agriculture & Cross-Border Model Interoperability.*

[![React 19](https://img.shields.io/badge/React-19.0-blue.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google_Gemini-1.5_Flash-4285F4.svg?logo=google)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![DPI Standard](https://img.shields.io/badge/DPI_Standard-JSON--LD_v2.4-green.svg)](#7-brics-common-agriculture-data-schema-json-ld-v24)

---

## 📌 Table of Contents
1. [Overview & Problem Statement](#1-overview--problem-statement)
2. [Why AGROVERSE AI? (Core Innovation)](#2-why-agroverse-ai-core-innovation)
3. [System Architecture](#3-system-architecture)
4. [Key Features & Modules](#4-key-features--modules)
5. [AI Decision Engine & Gemini Integration](#5-ai-decision-engine--gemini-integration)
6. [Hardware Independence & Satellite Remote Sensing](#6-hardware-independence--satellite-remote-sensing)
7. [BRICS Common Agriculture Data Schema (JSON-LD v2.4)](#7-brics-common-agriculture-data-schema-json-ld-v24)
8. [Tech Stack](#8-tech-stack)
9. [Project Directory Structure](#9-project-directory-structure)
10. [Quickstart Setup Guide (Run in 2 Minutes)](#10-quickstart-setup-guide-run-in-2-minutes)
11. [Environment Variables](#11-environment-variables)
12. [Demo Credentials & User Roles (For Judges)](#12-demo-credentials--user-roles-for-judges)
13. [3-Minute Winning Demo Walkthrough Script](#13-3-minute-winning-demo-walkthrough-script)
14. [Digital Public Good (DPG) Principles](#14-digital-public-good-dpg-principles)
15. [License & Acknowledgments](#15-license--acknowledgments)

---

## 1. Overview & Problem Statement

Global agriculture faces an unprecedented convergence of systemic threats:
- 📉 **Climate Volatility**: Unpredictable rainfall patterns, unseasonal heatwaves, and droughts devastate crop yields.
- 🔬 **Data Fragmentation**: Satellite imagery, soil health telemetry, weather forecasts, and market data live in isolated silos.
- 🗣️ **Accessibility Barriers**: Smallholder farmers—who produce ~80% of food in emerging economies—lack localized, voice-assisted advisories in their regional languages.
- 🌐 **Lack of Cross-Border Collaboration**: Promising agricultural AI models developed in one region cannot easily be shared or adapted across borders due to proprietary data formats.

---

## 2. Why AGROVERSE AI? (Core Innovation)

**AGROVERSE AI (AgriNexus)** is an interoperable **Digital Public Infrastructure (DPI)** that bridges satellite remote sensing, edaphic soil science, computer vision leaf diagnostics, and multimodal LLMs (**Google Gemini**) into **actionable, voice-guided farm advisories**.

### 🌟 Highlights for Judges & Reviewers:
- 📱 **Voice-First Multi-Lingual AgroGPT**: Instant agricultural advice in local languages (English, Hindi, etc.) powered by Google Gemini 1.5 Flash with intelligent local fallbacks.
- 📡 **Hardware-Independent Satellite Intelligence**: Multi-spectral Sentinel-2 NDVI canopy mapping without requiring expensive on-field IoT hardware.
- 🌐 **BRICS Cross-Border AI Model Exchange**: Standardized JSON-LD v2.4 schema for sharing drought, pest, and climate models across BRICS nations (🇮🇳 India, 🇧🇷 Brazil, 🇷🇺 Russia, 🇨🇳 China, 🇿🇦 South Africa).
- 🩺 **AI Leaf Disease Doctor**: Computer vision model providing instant diagnosis, severity coverage %, and organic/chemical action plans.
- 🏛️ **National Crop Risk Monitor**: Macro dashboard for agricultural authorities to monitor 128,000+ farms, track regional outbreaks, and issue disaster relief.
- 🧊 **Farm Digital Twin (3D Zonal Visualization)**: Multi-plot spatial health breakdown (Zone A: Healthy, Zone B: Vegetation Stress, Zone C: High Disease Risk).

---

## 3. System Architecture

```text
┌───────────────────────────────────────────────────────────────────────────────────┐
│                          AGROVERSE INTELLIGENCE LAYER                             │
└───────────────────────────────────────────────────────────────────────────────────┘
        ▲                         ▲                         ▲                      ▲
        │                         │                         │                      │
┌───────────────┐        ┌──────────────────┐      ┌─────────────────┐   ┌──────────────────┐
│ Sentinel-2    │        │ Weather API      │      │ Soil Telemetry  │   │ Leaf CV Model    │
│ Multispectral │        │ (Live Open-Meteo)│      │ Lab Spectrum    │   │ Computer Vision  │
└───────────────┘        └──────────────────┘      └─────────────────┘   └──────────────────┘
        │                         │                         │                      │
        └─────────────────────────┴───────────┬─────────────┴──────────────────────┘
                                              ▼
                              ┌───────────────────────────────┐
                              │  Google Gemini 1.5 Flash      │
                              │  & AI Feature Fusion Engine   │
                              └───────────────┬───────────────┘
                                              │
                        ┌─────────────────────┴─────────────────────┐
                        ▼                                           ▼
┌───────────────────────────────────────┐     ┌─────────────────────────────────────┐
│ 👨‍🌾 Farmer Voice App & 7-Day Checklist │     │ 🌐 BRICS Global Model Exchange      │
│ (Actionable Localized Advisories)     │     │ (JSON-LD v2.4 Standardized Schema)  │
└───────────────────────────────────────┘     └─────────────────────────────────────┘
                        │                                           │
                        └─────────────────────┬─────────────────────┘
                                              ▼
                              ┌───────────────────────────────┐
                              │ 🏛️ National Crop Risk Monitor  │
                              │ (128k+ Monitored Farms Map)   │
                              └───────────────────────────────┘
```

---

## 4. Key Features & Modules

| Icon | Module | Core Functionality & Key Capabilities |
| :---: | :--- | :--- |
| 📊 | **Farm Overview** | Real-time aggregate Farm Health Score (0-100) with detailed breakdowns across Crop, Soil, Weather, Disease, and Sustainability. |
| 📡 | **Satellite Intelligence** | Multi-spectral NDVI canopy stress mapping, historical vegetation index trends, and field-level stress zone segmentation. |
| 🌦️ | **Weather & Climate** | Agricultural impact forecasting with live Open-Meteo weather telemetry. Converts rain probability (e.g., 78% rain) into smart decisions (e.g., postpone irrigation). |
| 🧪 | **Soil Health & Carbon** | Nutrient diagnostics (pH, NPK, Organic Carbon %), organic top-dressing advisories, and biochar carbon enrichment recommendations. |
| 🩺 | **AI Crop Doctor** | Mobile Computer Vision leaf disease diagnosis. Detects diseases (e.g., Wheat Rust, Early Blight) with confidence scores, infected area %, and care plans. |
| 🌾 | **Crop Advisor** | Explainable crop selection engine matching soil, climate, water availability, and market economics (Wheat 91%, Chickpea 82%, Mustard 76%). |
| 💰 | **Yield Forecast & Economics** | Multi-variable yield estimation (Tons/Ha), financial profit projections, market price telemetry, and harvest window calculations. |
| 🌱 | **Regenerative Agriculture** | Soil restoration tracking, carbon credit estimations, cover cropping strategies, and nitrogen footprint reduction plans. |
| 🔮 | **Climate What-If Simulator** | Interactive scenario simulator modeling crop yield impact under temperature changes (-2°C to +4°C) and rainfall deltas. |
| 🌐 | **BRICS Global AI Exchange** | Cross-border exchange for AI models (e.g., Drought Warning, Pest Prediction) using the BRICS Common Agriculture JSON-LD Schema. |
| 🏛️ | **National Crop Risk Monitor** | High-level authority dashboard tracking 128,420 farms with regional risk heatmaps and outbreak alerts. |
| 📅 | **7-Day Action Plan & Calendar** | Weather-aware daily task checklist updated in real-time for smallholder farmers. |
| 🧊 | **3D Farm Digital Twin** | High-resolution spatial plot representation highlighting zonal stress (Zone A Healthy, Zone B Stress, Zone C Risk). |

---

## 5. AI Decision Engine & Gemini Integration

AGROVERSE AI leverages **Google Gemini 1.5 Flash** for natural language advisory generation, yield explanation, and economic crop selection:

```typescript
// Architectural Flow of Google Gemini Integration
User Query / Sensor Telemetry
       │
       ▼
GoogleAiService (src/services/googleAiService.ts)
       ├── Check for GEMINI_API_KEY
       ├── Construct Structured Prompt (Farmer Context + Soil + Satellite + Weather)
       ├── API Fetch -> https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
       └── [Fallback] Localized High-Fidelity Rule Engine (if offline/no key)
```

### Key AI Features:
1. **Explainable AI (XAI)**: Provides clear *why* behind every recommendation (e.g., "Postpone irrigation because 45mm rain is expected in 36h").
2. **Multilingual Processing**: Supports English, Hindi, and local regional dialects.
3. **Multimodal Leaf Diagnosis**: Instant vision reasoning for plant pathology.

---

## 6. Hardware Independence & Satellite Remote Sensing

AGROVERSE AI is designed around a **hardware-independent architecture**. It operates seamlessly using remote sensing satellite APIs (Sentinel-2 multispectral), public weather networks (Open-Meteo), and open edaphic datasets without requiring physical IoT sensors on every field. Physical IoT sensors can be connected via standardized telemetry webhooks at any time.

```typescript
// Satellite Data Abstraction Layer
SatelliteDataProvider
    ├── getImagery(polygonCoords, date)
    ├── getNDVI(polygonCoords, date)
    ├── getVegetationHealth(polygonCoords)
    └── getStressZones(polygonCoords)
```

---

## 7. BRICS Common Agriculture Data Schema (JSON-LD v2.4)

AGROVERSE AI implements an open, standardized schema for cross-border data & model interoperability:

```json
{
  "$schema": "https://agri.brics.org/schemas/v2/farm-data.json",
  "dpiVersion": "2.4.0",
  "country": "IN",
  "region": "Bihar",
  "district": "Muzaffarpur",
  "farmId": "FARM-88219",
  "crop": {
    "name": "wheat",
    "variety": "HD-2967",
    "growthStage": "vegetative",
    "plantingDate": "2026-07-06"
  },
  "soil": {
    "ph": 6.7,
    "nitrogenStatus": "medium",
    "phosphorusStatus": "high",
    "potassiumStatus": "medium",
    "organicCarbon": 0.42,
    "moisturePercentage": 42
  },
  "weather": {
    "temperatureC": 29,
    "humidityPercent": 74,
    "rainProbabilityPercent": 78,
    "expectedRainfallMm": 45
  },
  "cropHealth": {
    "overallNdvi": 0.71,
    "stressZoneDetected": true,
    "healthScore": 72
  },
  "aiAdvisory": {
    "irrigationRecommended": false,
    "actionCode": "POSTPONE_IRRIGATION_RAIN_EXPECTED",
    "confidenceScore": 0.89
  }
}
```

---

## 8. Tech Stack

- **Frontend Core**: [React 19](https://react.dev/), [TypeScript 5.8+](https://www.typescriptlang.org/), [Vite 6](https://vitejs.dev/)
- **Styling & UI**: [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [Lucide React Icons](https://lucide.dev/)
- **Data Visualization & Maps**: [Recharts](https://recharts.org/), [Leaflet Map Engine](https://leafletjs.com/), Canvas Confetti
- **Backend Server**: [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/), CORS, Open-Meteo Weather Integration
- **AI & ML**: Google Gemini 1.5 Flash API, MobileNetV3 Leaf Pathology Model, High-Fidelity Local AI Fallback Engine

---

## 9. Project Directory Structure

```text
Agrinexsus/
├── public/                 # Static assets & public images
├── server/                 # Express backend server
│   └── index.js            # Express REST API & Open-Meteo proxy endpoints
├── src/                    # Frontend React Application
│   ├── assets/             # Images, icons & static media
│   ├── components/         # React UI Components
│   │   ├── dashboard/      # All 27 core feature modules & dashboards
│   │   │   ├── ActionPlan.tsx
│   │   │   ├── AgroGPT.tsx
│   │   │   ├── AuthorityDashboard.tsx
│   │   │   ├── BRICSNetwork.tsx
│   │   │   ├── ClimateSimulator.tsx
│   │   │   ├── CropAdvisor.tsx
│   │   │   ├── DigitalTwin.tsx
│   │   │   ├── DiseaseDoctor.tsx
│   │   │   ├── FarmOverview.tsx
│   │   │   ├── RegenerativeAg.tsx
│   │   │   ├── SatelliteIntel.tsx
│   │   │   ├── SoilHealth.tsx
│   │   │   ├── WeatherIntel.tsx
│   │   │   └── YieldForecast.tsx
│   │   ├── demo/           # Hackathon quick presentation controls
│   │   ├── layout/         # Header, Navbar, Sidebar & Navigation
│   │   ├── maps/           # Leaflet interactive map integrations
│   │   └── ui/             # Reusable UI primitives (Cards, Buttons, Modals, Toasts)
│   ├── context/            # Application state management (Auth, Language, Farm Context)
│   ├── data/               # Mock agricultural datasets & farmer profiles
│   ├── locales/            # Internationalization & language translations
│   ├── services/           # Google Gemini AI, Weather & API client services
│   ├── types/              # TypeScript interfaces & domain types
│   ├── utils/              # Geospatial & analytical utility helper functions
│   ├── App.tsx             # Main App layout & route coordinator
│   └── main.tsx            # Application entrypoint
├── .env.example            # Environment variables template file
├── package.json            # Node.js dependencies & scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build tool configuration
```

---

## 10. Quickstart Setup Guide (Run in 2 Minutes)

Follow these simple steps to run **AGROVERSE AI** on your local machine:

### 1. Prerequisites
Make sure you have Node.js installed on your computer:
- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **npm**: v9.0.0 or higher (comes with Node.js)

### 2. Clone or Extract Project
Open your terminal / command prompt and navigate to the project directory:
```bash
cd Agrinexsus
```

### 3. Install Dependencies
Run the following command to install all frontend & backend dependencies:
```bash
npm install
```

### 4. Create Local Environment Configuration
Copy the sample environment file to create `.env`:
- **Windows (PowerShell)**:
  ```powershell
  Copy-Item .env.example .env
  ```
- **Linux / macOS / Git Bash**:
  ```bash
  cp .env.example .env
  ```

### 5. Start Development Servers

You can start both the **Backend Express API** and **Frontend Vite App**:

#### Terminal 1 — Start Backend Server (Port 5000):
```bash
npm run server
```

#### Terminal 2 — Start Frontend Application (Port 5173):
```bash
npm run dev
```

### 6. Open Application in Browser
Click or navigate to:
👉 **`http://localhost:5173`**

---

## 11. Environment Variables

Create a `.env` file in the root folder based on `.env.example`:

```env
# Node Express Backend Server Port
PORT=5000

# API Base URL for Frontend Services
VITE_API_BASE_URL=http://localhost:5000/api

# Optional: Google Gemini API Key (For live Gemini LLM queries)
VITE_GEMINI_API_KEY=your_google_gemini_api_key_here

# Optional: Remote Sensing & Weather Keys
# VITE_SENTINEL_HUB_CLIENT_ID=your_sentinel_client_id_here
# VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here
```

> 💡 **Note**: Even without external API keys, AGROVERSE AI includes a **built-in high-fidelity AI engine** that seamlessly generates intelligent responses, disease diagnoses, and forecasts out of the box!

---

## 12. Demo Credentials & User Roles (For Judges)

Use these credentials to experience different user roles within the platform:

| Role | Email | Password | Recommended Experience & Features to Test |
| :--- | :--- | :--- | :--- |
| 👨‍🌾 **Farmer Mode** | `farmer@agroverse.demo` | `demo123` | Voice-assisted AgroGPT, 7-Day Checklist, AI Disease Doctor, Soil Health. |
| 🏛️ **Agricultural Authority** | `authority@agroverse.demo` | `demo123` | National Crop Risk Monitor, 128k Monitored Farms Heatmap, Disaster Alerts. |
| 🔬 **Researcher Mode** | `researcher@agroverse.demo` | `demo123` | BRICS Global AI Model Exchange, Climate Simulator, Technical Architecture. |

---

## 13. 3-Minute Winning Demo Walkthrough Script

Follow this step-by-step presentation script to showcase the platform to judges or teammates:

1. **Step 1 — Farmer Selection**: Open `http://localhost:5173`. Select **Rajesh Kumar** (*Muzaffarpur, Bihar \| Wheat HD-2967 \| 2.4 Ha*).
2. **Step 2 — Farm Overview**: Highlight the aggregate **Farm Health Score (72/100)** and point out the sub-scores (Crop: 78, Weather: 71, Disease: 82).
3. **Step 3 — Satellite NDVI Mapping**: Click **Satellite Intel**. Toggle the NDVI layer. Point out **Zone B (North-West Zone)** showing vegetation stress ($NDVI = 0.43$).
4. **Step 4 — Live Weather Decision**: Click **Weather Intel**. Note the 78% rainfall probability. Show the AI recommendation: *"Postpone irrigation — 45mm rain expected within 36 hours."*
5. **Step 5 — Explainable Crop Advisor**: Click **Crop Advisor**. Show crop suitability scoring (Wheat 91%, Chickpea 82%, Mustard 76%) with clear economic rationales.
6. **Step 6 — AI Disease Doctor**: Open **Disease Doctor**. Click to analyze leaf photo. The system identifies **Wheat Rust (91% confidence)** with actionable treatment steps.
7. **Step 7 — AgroGPT Voice Advice**: Open **AgroGPT**. Click the microphone or type *"When should I harvest my wheat?"* to see instant Gemini AI response.
8. **Step 8 — Regenerative Agriculture**: View soil organic carbon status (0.42% Low) and recommendations (Farmyard manure, cover cropping).
9. **Step 9 — National Risk Dashboard**: Switch role to **Authority Mode**. Explore the national heatmap tracking **128,420 monitored farms**.
10. **Step 10 — BRICS Global AI Exchange**: Navigate to **BRICS Network**. Select India $\rightarrow$ Brazil, and click **Share Model** to trigger real-time model exchange notification (*"Climate-Resilient Model shared successfully!"*).

---

## 14. Digital Public Good (DPG) Principles

AGROVERSE AI is built strictly in accordance with **Digital Public Goods (DPG)** standards:
- 🔓 **Open Standards**: Standardized JSON-LD v2.4 schemas for cross-system data exchange.
- 🔍 **Explainable AI (XAI)**: No black-box decisions. All crop advice displays underlying confidence factors and rationale.
- 🛡️ **Data Sovereignty & Privacy**: Farmers maintain strict consent controls over their field boundary data.
- ⚕️ **Safety Disclaimers**: Chemical intervention guidance is paired with expert safety advisories.

---

## 15. License & Acknowledgments

- **License**: Released under the [MIT License](LICENSE).
- **Built For**: Hackathons, Agricultural Research, and Climate Resilience Initiatives.
- **Special Thanks**: Sentinel-2 Copernicus Remote Sensing Program, Open-Meteo Weather API, Google Gemini AI Team.

---

<p center="align">
  <b>Built with ❤️ for Climate Resilience & Farmers Worldwide.</b>
</p>
