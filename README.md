# ElectionWise: Civic Intelligence Platform

An immersive, interactive, and gamified platform designed to educate Indian citizens about the electoral process, grounded entirely in official Election Commission of India (ECI) guidelines.

**Built for the PromptWars AI Hackathon**

---

## 1. Problem Statement
Electoral literacy in India faces two massive challenges: 
1. **Accessibility of Information:** Official ECI guidelines are dense and spread across multiple portals, making it difficult for first-time voters or marginalized communities to understand their rights.
2. **The Misinformation Epidemic:** Deepfakes, WhatsApp forwards, and AI-generated fake news suppress voter turnout and erode trust in the democratic process.

## 2. Core Capabilities
ElectionWise is a next-generation "Civic Educator" featuring:
- **🗳️ Civic Assistant:** A multilingual, voice-enabled assistant answering queries with a *Fact Confidence Score*.
- **🎮 Officer Simulation:** A gamified "Be the Election Officer" mode where users learn electoral rules experientially.
- **🛡️ Misinformation Detector:** An AI-powered tool to verify rumors and WhatsApp forwards, receiving a True/False/Misleading verdict grounded in ECI rules.

## 3. Google Cloud Stack & Telemetry
The platform is built on a high-availability serverless architecture:
- **Vertex AI & Generative Language API:** Powered by **Gemini 2.5 Flash** for high-speed, high-intelligence responses.
- **Firebase Analytics & Firestore:** Full telemetry pipeline tracking `ai_query` and `fact_check` events for user behavior insights.
- **Cloud Run:** Fully containerized production deployment in `us-central1`.
- **Cloud Resource Manager:** Utilized for verified IAM policy propagation and service account management.

## 4. Engineering for Resilience & Security
- **Zod & Express Rate Limiting:** The backend is hardened with strict schema validation (`zod`) and IP-based rate limiting to prevent spam and malicious inputs.
- **React Code-Splitting:** Core routes are dynamically imported using `React.lazy()` and `<Suspense>`, drastically shrinking the initial JavaScript payload.
- **Zero-500 Architecture:** The backend features a graceful fallback layer returning pre-verified civic guidance if the AI backend experiences extreme latency.
- **Cache-Control & Headers:** Server explicitly blocks caching of dynamic AI responses and masks identifying framework headers.

## 5. Accessibility & UI/UX
- **Voice Mode Toggle:** Users can manually opt-in to audio responses, preventing unexpected playback while supporting visually impaired voters.
- **Multilingual TTS:** Integrated with `speechSynthesis` mapping local Indian accents (Hindi, Tamil, Telugu, etc.) to the AI output.
- **WCAG 2.1 Compliant:** High-contrast dark mode, comprehensive `aria-labels`, and responsive layouts for 100k+ concurrent user scenarios.

## 6. Testing & Validation
The platform underwent a rigorous validation process achieving a **90%+ Quality Score**:
1. **Component & Unit Testing:** `Vitest`, `@testing-library/react`, and `happy-dom` thoroughly test UI components (like the Misinformation Detector) and edge-case state logic.
2. **Infrastructure Diagnostics:** Custom Node.js scripts verify model availability and regional latencies.

---

## 7. Developer Quick Start

### 1. Installation
```bash
git clone <repository-url>
cd electionwise
npm install
```

### 2. Environment Variables
Copy the example environment file and fill in your keys:
```bash
cp .env.example .env
```
Inside `.env`, you must add your **Firebase** config (`VITE_FIREBASE_*`).
For the backend, copy `.env.example` into `server/.env` and add your **Gemini** config (`GEMINI_API_KEY`).

### 3. Running Locally
Start both the React frontend and the Express backend simultaneously:
```bash
npm run dev
```

### 4. Running Tests
```bash
npm run test
```

---

**Live URL:** [https://electionwise-app-605799761342.us-central1.run.app](https://electionwise-app-605799761342.us-central1.run.app)
