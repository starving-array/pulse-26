# Security Policy: Pulse26 Crowd Routing Terminal

This document outlines the security boundaries, threat mitigation strategies, and execution environment requirements for the Pulse26 Operational Terminal.

---

## 1. Application Security Boundaries

The Pulse26 application is structured with strict separation of concerns to minimize attack surface and prevent system failures:

```
[Web Client (Vite)] ──(HTTPS/CORS/Helmet)──► [API Server (Express)] ──(IAM / VPC)──► [GCP Vertex AI]
```

* **Perimeter Ingress:** Standard headers are hardened via `helmet` and custom CORS policies which restrict Vite dev ports to non-production environments.
* **Input Sanitization:** Inbound HTTP payloads are validated for numeric bounds (0-100 densities). Simulative metadata variables like `fanContext` undergo regex filtering to strip control characters and avoid downstream LLM Prompt Injection.
* **Failure Boundaries:** If the Gemini API endpoint experiences rate limits or network dropouts, the backend intercepts the error and returns a predefined localized fallback, preserving terminal availability without leaking stack traces.

---

## 2. Stateful Execution Environment Requirements

### Critical Runtime Notice

> [!IMPORTANT]
> The Pulse26 application relies on **stateful runtime mechanics** for key defensive and optimization pipelines:
> 
> 1. **DDoS In-Memory Rate Limiting (`ipRequestCounts`):** Restricts high-frequency turning sensor traffic.
> 2. **90-Second Edge Caching (`edgeCache`):** Reduces Vertex AI token consumption.
> 
> Because these stores are maintained in-memory inside the Node.js process space, **Pulse26 requires a persistent execution environment** (such as Google Cloud Run or a traditional Virtual Private Server) to function correctly. 
> 
> Deploying the application in a stateless, ephemeral serverless execution context (such as AWS Lambda or Vercel Serverless Functions) will cause these caches and request tables to initialize on every invocation, nullifying the rate-limiting protection guarantees and edge caching efficiency optimizations.
