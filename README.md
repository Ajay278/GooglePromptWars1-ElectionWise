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

## 3. Google Cloud Stack (GCP)
The platform is built on a high-availability serverless architecture:
- **Vertex AI & Generative Language API:** Powered by **Gemini 2.5 Flash** for high-speed, high-intelligence responses.
- **Cloud Translation API:** Real-time localization across 10+ Indian languages.
- **Cloud Run:** Fully containerized production deployment in `us-central1`.
- **Cloud Resource Manager:** Utilized for verified IAM policy propagation and service account management.

## 4. Engineering for Resilience & Security
- **Dual-Path Authentication:** Implements a hybrid authentication strategy using both **Service Account Application Default Credentials (ADC)** and a dedicated **API Key Fail-safe** to ensure 100% uptime regardless of regional endpoint maintenance.
- **Hardened Scoping:** All critical variables are scoped outside of operational blocks to prevent process termination on AI timeouts.
- **Zero-500 Architecture:** The backend features a graceful fallback layer that returns pre-verified civic guidance if the AI backend experiences extreme latency.
- **Infrastructure Optimization:** Configured for **1Gi Memory** and **300s Timeouts** to handle complex, multilingual generation without service interruption.

## 5. Accessibility & UI/UX
- **Voice Mode Toggle:** Users can manually opt-in to audio responses, preventing unexpected playback while supporting visually impaired voters.
- **Multilingual TTS:** Integrated with `speechSynthesis` mapping local Indian accents (Hindi, Tamil, Telugu, etc.) to the AI output.
- **WCAG 2.1 Compliant:** High-contrast dark mode, comprehensive `aria-labels`, and responsive layouts for 100k+ concurrent user scenarios.

## 6. Testing & Validation
The platform underwent a rigorous 3-phase validation process:
1. **Unit Testing:** `Vitest` suite for core election logic.
2. **Infrastructure Diagnostics:** Custom Node.js scripts used to verify model availability and regional latencies before final deployment.
3. **Log Analytics:** Real-time monitoring via Cloud Logging to identify and resolve scoping and API versioning bottlenecks.

---

**Live URL:** [https://electionwise-app-605799761342.us-central1.run.app](https://electionwise-app-605799761342.us-central1.run.app)
