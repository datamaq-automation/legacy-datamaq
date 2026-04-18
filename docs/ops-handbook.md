# Operations Handbook: Deployment, Monitoring & Automation

**State:** Internal Reference
**Scope:** `plantilla-www` operations and infrastructure.

## 1. Deployment and CI/CD

### 1.1 FTPS Deployment (Legacy/Fallback)
- **Tooling**: GitHub Actions `ci-cd-ftps.yml`.
- **Target**: `datamaq` production.
- **Monitoring**: 
    - Verify `200` status post-deployment.
    - Reference baseline latency: ~0.08s total time.
    - Alert if total time exceeds 0.20s sustained.

### 1.2 SPA Fallback Strategy
- **Configuration**: Managed in `deploy-spa-fallback.md` logic (now consolidated).
- **Rule**: In case of infrastructure failure, prioritize serving a static version (SSG) via fallback index.

---

## 2. Monitoring & Health Checks

### 24h Post-Deploy Checklist
1. **Availability**: Check `/`, `/contact`, `/gracias`.
2. **Performance**: Max `time_total` should be < 2x baseline.
3. **Internal Errors**: Check for asset/cache failures in the browser console.
4. **Actionable Alerts**: Any non-200 response on critical routes triggers immediate rollback.

---

## 3. Automation & Security

### 3.1 n8n: Lead Processing with Anti-Bot (Turnstile)
- **Frontend**: Injects `captcha_token` into the inquiry payload.
- **n8n Workflow**:
    1. Validates token with Cloudflare `siteverify`.
    2. If successful, routes to Telegram.
    3. If failed, returns `400 Invalid Captcha`.
- **Security Rule**: Never log secret keys in n8n debug nodes.

### 3.2 Infrastructure Hardening
- **CORS**: Enforced in `api-specification.md`.
- **Secret Scanning**: Quality gates in `scripts/` (e.g., `check-client-secrets.mjs`) monitor this repository for leaks.
