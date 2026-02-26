# TODO Done - Escalado a 2 marcas / 2 FTPS

## Convencion

- `[x]` tarea finalizada

## Decisiones confirmadas

- [x] Ambas marcas comparten las mismas rutas/paginas: `/`, `/cotizador`, `/gracias`.

## P0 finalizado

- [x] Restablecer build reproducible.
  - Evidencia: `npm run build` funcional con generacion de `sitemap`, `robots` y `/w`.

- [x] Separar configuracion por target de marca en build-time.
  - Evidencia: perfiles en `src/infrastructure/content/runtimeProfiles.json`.

- [x] Actualizar workflow FTPS a despliegue automatico dual.
  - Evidencia: matrix `datamaq` + `upp` en `.github/workflows/ci-cd-ftps.yml`.

- [x] Aislar backend por target.
  - Evidencia: cada target consume su propio `backendBaseUrl`.

- [x] Eliminar `.env` versionados y migrar configuracion publica a perfiles en codigo.
  - Evidencia: `runtimeProfiles.json` + workflow FTPS sin `VITE_ENV_FILE_*`.

## P1 finalizado

- [x] Eliminar hardcodes de branding en UI y estaticos.
- [x] Desacoplar analytics de `publicConfig` concreto.

## P2 finalizado

- [x] Estandarizar nomenclatura neutral de marca en storage keys.
- [x] Documentar runbook multi-target (`docs/multi-target-deploy-runbook.md`).
- [x] Agregar validacion automatica de hardcodes de marca (`npm run lint:brand-hardcodes`).

## Actualizacion 2026-02-26

### P0 finalizado

- [x] Migrar backend operativo a `public/api/*.php` manteniendo contrato del frontend.
  - Evidencia: endpoints disponibles en `public/api/contact.php`, `public/api/mail.php`, `public/api/pricing.php`, `public/api/quote/diagnostic.php`, `public/api/quote/pdf.php`.
  - Evidencia: errores estandarizados con `request_id`, `error_code`, `detail` via `public/api/_bootstrap.php` (`dmq_error_response`).
  - Evidencia: build publica `.php` dentro de `dist/api/*` (verificado con `npm run build -- example` + listado de `dist/api`).

### P1 finalizado

- [x] Cobertura E2E por target en CI.
  - Evidencia: matrix `datamaq` + `upp` en `.github/workflows/ci-quality.yml` (job `build-smoke-e2e`).
  - Evidencia: Playwright parametrizado por target con `PLAYWRIGHT_MODE` en `playwright.config.ts`.

- [x] Pruebas de configuracion runtime de endpoints.
  - Evidencia: `tests/unit/infrastructure/viteConfig.test.ts` cubre endpoints relativos, absolutos y fallback por `backendBaseUrl`.

- [x] Pruebas de contrato frontend <-> PHP.
  - Evidencia: `tests/unit/infrastructure/phpApiContracts.test.ts` valida contratos de `contact`, `mail`, `pricing`, `quote/diagnostic`, `quote/pdf`.

### P2 finalizado

- [x] Reducir responsabilidades de `ContentRepository`.
  - Evidencia: separacion en `src/infrastructure/content/contentStore.ts`, `src/infrastructure/content/dynamicPricingService.ts`, `src/infrastructure/content/navbarNormalizer.ts`.

- [x] Transformar contenido a plantilla generica (`Appcontent.*.ts`).
  - Evidencia: eliminacion de `src/infrastructure/content/Appcontent.ts`.
  - Evidencia: selector activo en `src/infrastructure/content/Appcontent.active.ts` con fallback `example`.
  - Evidencia: variantes conservadas en `Appcontent.datamaq.ts`, `Appcontent.upp.ts`, `Appcontent.example.ts` y builder comun en `landingContentBuilder.ts`.
  - Evidencia: target `example` soportado por `runtimeProfiles.json`, `runtimeProfile.ts`, `scripts/build-target.mjs` y `scripts/generate-sitemap.mjs`.

### P0 finalizado - 2026-02-26 (`hero.title` remoto)

- [x] Obtener `hero.title` desde `GET /api/content.php` con fallback local.
  - Evidencia: endpoint dedicado en `public/api/content.php` (payload `data.hero.title`, `brand_id`, `version`, `request_id`).
  - Evidencia: `contentApiUrl` agregado en runtime/config (`runtimeProfiles.json`, `runtimeProfile.ts`, `publicConfig.ts`, `viteConfig.ts`, `ConfigPort`).
  - Evidencia: sync separado de pricing en `src/infrastructure/content/dynamicContentService.ts`.
  - Evidencia: parche reactivo acotado a `hero.title` en `src/infrastructure/content/contentStore.ts`.
  - Evidencia: `ContentRepository` integra ambos servicios sin acoplar responsabilidades.
  - Evidencia: tests frontend y contrato:
    - `tests/unit/infrastructure/contentRepository.test.ts`
    - `tests/unit/infrastructure/viteConfig.test.ts`
    - `tests/unit/infrastructure/phpApiContracts.test.ts`
