# Migration Master Document: Vue.js to WordPress Native

**Project:** `plantilla-www` (DataMaq)
**Target:** Native WordPress PHP Theme (`datamaq-native`) on VPS AlmaLinux (`168.181.184.103:5932`)

---

## 1. Software Requirements Specification (SRS) - Final
*Source: `srs-migration-vue-wp.md`*

### 1.1 Strategy: Hybrid Classic Theme (PHP)
- **Fidelity**: Pixel-perfect parity 1:1 with Vue dev server.
- **Styling**: Tailwind CSS v4 (Rust plugin) scanning PHP templates.
- **Architecture**: Modular parts in `template-parts/`, logic in `inc/`.

### 1.2 Functional Mapping
- **Hero**: `template-parts/home-hero.php` with dynamic backgrounds.
- **Services**: `template-parts/services.php` (ACF or CPT).
- **Contact**: Native `admin-post.php` flow with Cloudflare Turnstile.
- **Footer/Navigation**: Persistent "Dock" for mobile, standard navbar for desktop.

### 1.3 Quality Gates
- LCP < 1.5s.
- Zero "Page Builder" dependencies.
- Full A11y compliance on FAQ and navigation.

---

## 2. API Specification & Backend Contracts
*Source: `api-specification.md`*

### 2.1 Technical Handshake
- **Canonical Route**: `GET /v1/site` (Unified payload for Content, Brand, and SEO).
- **Secondary Routes**: 
    - `GET /v1/health`
    - `POST /v1/quote/diagnostic` (Response: Quote ID + Metadata).
    - `GET /v1/quote/{id}/pdf` (Response: `application/pdf`).

### 2.2 Security (CORS)
- **Origin**: `https://datamaq.com.ar`
- **Methods**: `GET, POST, PATCH, OPTIONS`.
- **Preflight**: Mandatory `204/200` response on `OPTIONS`.

---

## 3. Operations & Automation Handbook
*Source: `ops-handbook.md`*

### 3.1 Deployment
- **FTPS Baseline**: Latency ~0.08s total.
- **Alert**: TTFB > 0.20s post-deploy triggers rollback check.

### 3.2 Lead Processing (n8n)
- **Workflow**: Webhook -> Turnstile Verify -> Telegram.
- **Key**: `VITE_TURNSTILE_SITE_KEY` must be synced in production Environment Variables.

---

## 4. History & Current Status
*Source: `wp-migration-history-status.md`*

- **Phase 0-4**: Successfully completed. Site is live at `cursos.datamaq.com.ar`.
- **Current Issue**: Git Remote Desync on VPS (Read-only SSH key).
- **MU Plugins**: Legacy redirects handled via `wp-content/mu-plugins/datamaq-legacy-route-redirects.php`.
