# ElectionWise Project Guidelines

This document outlines the architectural standards and development patterns enforced in the ElectionWise repository.

## 1. Architectural Pattern: Service Layer
The backend is structured using a **Service Layer Pattern**. 
- **Routers (`server/index.js`)**: Handle HTTP requests/responses and input validation only.
- **Services (`server/services/`)**: Contain all business logic and external API integrations (Gemini, Google Translate).
- **Rule:** Never put AI logic directly in a route handler.

## 2. Security & Validation
- **Input Sanitization:** Every request must be validated using **Zod schemas** before reaching the service layer.
- **Rate Limiting:** IP-based rate limiting is enforced on all `/api/*` endpoints to prevent token exhaustion.
- **Secrets Management:** Sensitive keys (Gemini, Firebase) must never be committed. Use `.env` files exclusively.

## 3. Frontend Performance
- **Code Splitting:** Use `React.lazy()` and `Suspense` for all major page routes to maintain a low initial bundle size.
- **State Management:** Use `Zustand` with the `persist` middleware for lightweight, persistent global state.
- **Animations:** Use `framer-motion` for declarative, GPU-accelerated UI transitions.

## 4. Telemetry & Analytics
- Every AI interaction (`ai_query`) and fact check (`fact_check`) must be logged to **Firebase Analytics**.
- This ensures data-driven insights into voter behavior and misinformation trends.

## 5. Development Workflow
- **Linting:** Treat all CSS "Unknown at rule" warnings as ignored (managed via `.vscode/settings.json`).
- **Testing:** Maintain 95%+ test coverage using `Vitest` and `happy-dom`.
- **Deployment:** Continuous Deployment to **Google Cloud Run** using containerized Docker builds.
