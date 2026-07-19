# Pulse26: Explainable AI (XAI) Crowd Management Terminal

Pulse26 is a next-generation Explainable AI (XAI) operational terminal designed specifically for stadium volunteers and event managers to monitor, analyze, and resolve front-line crowd bottlenecks in real time during the 2026 World Cup.

---

## Problem Statement & Architectural Alignment

| Hackathon Track Requirement | Pulse26 Architectural Solution | Code File/Component Reference |
| :--- | :--- | :--- |
| **Separation of Concerns & Modularity** | Decoupled view-based architecture separating cockpit settings, system blueprints, and operations. | [App.tsx](file:///c:/Users/lovea/Downloads/pulse26/src/App.tsx) & [src/views/](file:///c:/Users/lovea/Downloads/pulse26/src/views/) |
| **Reliability & Cache Tuning** | 90-second edge cache key compiling with strict string normalization and `.trim()`. | [server.ts](file:///c:/Users/lovea/Downloads/pulse26/server.ts#L240) |
| **Defensive Input Validation** | Bound validation constraints checking density range numbers (0-100) and allowed list for surges. | [server.ts](file:///c:/Users/lovea/Downloads/pulse26/server.ts#L206) |
| **Accessibility Standard Compliance** | Keyboard tabbed lists, focus ring outline visible classes, and high text contrast compliance. | [Header.tsx](file:///c:/Users/lovea/Downloads/pulse26/src/components/Header.tsx) & [Sidebar.tsx](file:///c:/Users/lovea/Downloads/pulse26/src/components/Sidebar.tsx) |
| **CI/CD Quality Enforcement** | Automated GitHub Actions executing strict typechecks and Native test runs on pushes/PRs. | [.github/workflows/ci.yml](file:///c:/Users/lovea/Downloads/pulse26/.github/workflows/ci.yml) |

---

## 1. Hackathon Rubric Alignment Mapping

| Hackathon Requirement | Pulse26 Feature Solution | Code File Reference |
| :--- | :--- | :--- |
| **Innovation** | Separation of Operations and Volunteers, dynamic plain-English reasoning tone filtering, and low-latency interactive simulation sandbox. | [App.tsx](file:///c:/Users/lovea/Downloads/pulse26/src/App.tsx) |
| **Feasibility** | 90-second TTL in-memory cache layer to reduce Gemini API calls, secure input parameters bounds validation, and robust localized overrides for offline/disconnect fallbacks. | [server.ts](file:///c:/Users/lovea/Downloads/pulse26/server.ts) |
| **Impact** | Accessibility compliance (WAI-ARIA elements, semantic HTML5 structure, keyboard navigation), memory-safe rate limiting, and robust production build pipelines. | [App.tsx](file:///c:/Users/lovea/Downloads/pulse26/src/App.tsx) & [server.ts](file:///c:/Users/lovea/Downloads/pulse26/server.ts) |
| **Security & Audits** | Safe exception handling with zero stack leaks, Helmet headers, request limiters, and complete native test runner coverage. | [server.test.ts](file:///c:/Users/lovea/Downloads/pulse26/server.test.ts) |

---

## 2. Innovation

### I. Persona Isolation
The system establishes a strict separation between high-level operations coordination and boots-on-the-ground volunteer action.
* **The Operational Director:** Interacts with dense telemetry dashboards, system status warnings, and algorithmic targets.
* **The Field Volunteer:** Receives isolated, high-impact verbal directions. AI reasoning is dynamically translated into specific operational scripts, ensuring field workers remain focused on directing crowds without needing to analyze complex charts or system telemetry.

### II. Dynamic Plain-English Human-Friendly Reasoning
Pulse26 entirely bans low-level technical jargon. The AI reasoning engine dynamically evaluates boundary thresholds to explain situations in plain, everyday language:
* **Smooth Flow (0% - 40%):** *"Gate C is moving smoothly at [Gate C]% with normal traffic from the Metro. Gate D is at [Gate D]%. Keep maintaining current flows."*
* **Busy Status (41% - 79%):** *"Gate C is getting busy at [Gate C]% due to the Metro flow. Gate D is open at [Gate D]%. We should monitor this closely."*
* **Critical Jam (80% - 100%):** *"Gate C is completely jammed right now at [Gate C]% because a massive crowd just came in from the Metro for the big game. Meanwhile, Gate D is totally empty at only [Gate D]%. We need to quickly guide people over to Gate D so everyone gets inside safely."*

---

## 3. Feasibility

### I. 90-Second Cache Performance Layer
To manage high-frequency telemetry updates and control operational costs, Pulse26 incorporates an intelligent backend Edge-Cache layer:
* **Composite Cache Key Generation:** Every incoming request compiles a unique composite state key representing the exact parameters of the active event:
  $$\text{Key} = \text{gateCDensity} \mathbin{\Vert} \text{gateDDensity} \mathbin{\Vert} \text{metroSurge} \mathbin{\Vert} \text{fanContext}$$
* **90-Second Time-To-Live (TTL):** The backend maintains an in-memory edge cache with a strict 90-second expiration window.
* **Cost & Latency Optimization:**
  * **Cache Hit:** If volunteers adjust parameters within a state already analyzed in the past 90 seconds, the terminal intercepts the request, serves the cached response instantly, and logs `[CACHE_HIT] Serving stored inference data`. This lowers telemetry processing latency to sub-milliseconds.
  * **Cache Miss:** When a state boundary is crossed or new context is selected, a cache miss occurs. Pulse26 logs `[CACHE_MISS] Fetching fresh XAI reasoning from Gemini`, queries the LLM engine, and updates the cache.

---

## 4. Impact & Scaling

### I. GCP Scaling Blueprint
For production-scale deployment at the 2026 World Cup, Pulse26 leverages a robust, high-concurrency Google Cloud Platform (GCP) native infrastructure pipeline:

```
[Turnstiles/Sensors] ──► [Load Balancer] ──► [Pub/Sub Queue] ──► [Cloud Run Workers] ──► [Redis Cache] ──► [Vertex AI]
```

* **Ingress Layer:** A Google Cloud Application Load Balancer distributes incoming telemetry and request traffic across geographically distributed zones.
* **Asynchronous Ingestion:** High-frequency tally events from thousands of physical stadium gates are streamed into Google Cloud Pub/Sub.
* **Elastic Compute Processing:** Fully containerized Google Cloud Run instances act as the scalable worker pool. Configured to scale from zero to thousands of active containers instantly.
* **High-Frequency Caching:** A dedicated Cloud Memorystore for Redis cluster serves as the high-availability inline cache.
* **Grounded Inference:** Vertex AI orchestrates the Gemini model pipelines with Active Context Caching.

---

## 5. Local Setup and Testing

To execute, verify, and test the Pulse26 operational terminal locally, follow these steps:

### I. Prerequisites & Environment
Ensure you have **Node.js** (v18+) installed. Clone the repository and configure your environment variables:
```bash
# Copy example environment configuration
cp .env.example .env
```
Open `.env` and configure your GCP Project credentials (`GOOGLE_CLOUD_PROJECT`, `GOOGLE_CLOUD_LOCATION`) or Vertex AI / Google Gen AI credentials.

### II. Installation
Install project dependencies:
```bash
npm install
```

### III. Development Server
Start the local development server in watcher mode:
```bash
npm run dev
```
The application will launch locally at [http://localhost:3000](http://localhost:3000).

### IV. Automated Tests
Run the standalone unit test suite to verify telemetry bounds checking, null validation, and status classification rules:
```bash
npm run test
```

### V. Production Compilation
Compile Vite frontend assets and bundle the Express server for production:
```bash
npm run build
npm start
```
