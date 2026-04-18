# WordPress Migration: Master History and Status

**Project:** `plantilla-www` to WordPress Native
**Target VPS:** AlmaLinux (`168.181.184.103:5932`)
**Status:** Cutover Completed (2026-04-12)

## 1. Executive Summary
The migration of `datamaq-www` (Vue 3) to a native WordPress PHP theme (`datamaq-native`) has been successfully executed. The site is live at `cursos.datamaq.com.ar` using the native theme, with critical features like SEO, contact forms, and legacy redirects fully operational.

---

## 2. Migration Phases (History)

### Phase 0: Inventory and Strategy
- **Audit**: Mapping of all Vue routes to WP slugs.
- **SEO Requirements**: Robots (`index,follow`), Canonicals, and JSON-LD (Organization, Service, FAQ).
- **Tracking**: Persistence of GA4 and Clarity events (`contact`, `generate_lead`).
- **Redirections**: Formalized regex for `.htaccess` to handle legacy `/cotizador*` routes.

### Phase 1: Scaffolding (Theme Development)
- **Result**: Creation of `datamaq-native` theme with modular PHP setup (`inc/` directory).

### Phase 2: Initial Content Loading
- **Pages Migrated**:
    - `/contact/` (ID 196)
    - `/gracias/` (ID 195)
    - `/medicion-consumo-electrico-escobar/` (ID 197)
- **Functional Scope**: Editorial content for landings and gratitude pages successfully loaded and published.

### Phase 3: Smoke Testing
- **Validation**: Temporary activation of `datamaq-native` theme.
- **Form Verification**: Successful submission via `admin-post.php` with valid nonces.
- **Parity Check**: Confirmed `200` status for all migrated slugs and `301` for redirects.

### Phase 4: Cutover
- **Action**: Permanent activation of the theme.
- **Result**: High fidelity visual parity and functional contact flow.

### Phase 5: Hardening
- **Legacy Decoupling**: Moved `/cotizador*` redirects to a MU plugin (`wp-content/mu-plugins/datamaq-legacy-route-redirects.php`).
- **Bootstrap Robustness**: Switched to `__DIR__` for inclusion logic to prevent pathing failures during mixed theme states.
- **Nginx Optimization**: Fixed root `/` canonicalization and handled `/courses` redirects at the server level.

---

## 3. Current Technical Configuration

### Core URLs and Behavior
| URL | Type | Status | SEO |
|---|---|---|---|
| `/` | Home | 200 | index, follow |
| `/contact/` | Contact | 200 | index, follow |
| `/gracias/` | Thanks | 200 | noindex, nofollow |
| `/medicion-consumo-electrico-escobar/` | Service | 200 | index, follow |
| `/cotizador*` | Legacy | 301 | N/A (to `/contact/`) |
| `/courses/` | Legacy | 301 | N/A (to `/`) |

### Critical Hooks & Logic
- **Form Submission**: Processed via `admin-post.php`.
- **Redirects**: Managed by `datamaq-legacy-route-redirects.php` (MU Plugin).
- **Tracking**: Integrated in theme headers (GA4/Clarity).

---

## 4. Remaining Items & Risks

> [!WARNING]
> **Git Remote Desync**: The server-side repository (`wp-cursos`) has not been pushed to GitHub due to a read-only SSH key constraint in the VPS.

> [!IMPORTANT]
> **Tracking Confirmation**: Final GTAG IDs and Consent Mode policy need production verification.

---

## 5. Reference Logs
- `181d8db`: refactor(routing): move legacy redirects to mu-plugin.
- `5d08f63`: refactor(theme): add modules for forms/tracking.
- `c70a071`: refactor(theme): split bootstrap logic.
