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

### Auditoria backend PHP completada - 2026-02-26

- [x] Auditoria tecnica backend desde ciberseguridad, arquitectura limpia, SOLID y buenas practicas PHP.
  - Alcance auditado: `public/api/_bootstrap.php`, `health.php`, `pricing.php`, `content.php`, `contact.php`, `mail.php`, `quote/diagnostic.php`, `quote/pdf.php`.
  - Hallazgos priorizados trasladados a backlog activo en `docs/todo.md` (P0/P1/P2).
  - Riesgo principal detectado en operacion local: respuesta de codigo fuente PHP cuando endpoint no es ejecutado por handler PHP.

### Hardening backend PHP implementado - 2026-02-26

- [x] Definir politica de CORS explicita y consistente (produccion + desarrollo).
  - Evidencia: helper `dmq_apply_cors_headers()` en `public/api/_bootstrap.php`.
  - Evidencia: soporte de `OPTIONS` centralizado via `dmq_handle_preflight()` aplicado en endpoints API.
  - Origenes habilitados: `https://datamaq.com.ar`, `https://www.datamaq.com.ar`, `http://localhost:5173`, `http://127.0.0.1:5173`.

- [x] Unificar `request_id` en endpoints backend.
  - Evidencia: `contact.php` y `mail.php` ya no usan IDs `test-*`; responden con `dmq_request_id()`.
  - Evidencia: `health.php` ahora incluye `request_id` y usa `dmq_error_response()` para 405.

- [x] Extraer validaciones de input reutilizables.
  - Evidencia: `dmq_read_json_body()`, `dmq_validate_email()`, `dmq_validate_text_length()` en `public/api/_bootstrap.php`.
  - Evidencia: consumo en `contact.php`, `mail.php`, `quote/diagnostic.php`.

- [x] Centralizar headers de seguridad HTTP.
  - Evidencia: `dmq_apply_security_headers()` en `public/api/_bootstrap.php`.
  - Evidencia: aplicado en respuestas JSON (`dmq_json_response`) y PDF (`quote/pdf.php`).

- [x] Validar formato de email y limites de longitud en entradas.
  - Evidencia: `contact.php` y `mail.php` validan email (`FILTER_VALIDATE_EMAIL`) y rango de mensaje (10..2000).

- [x] Versionar contrato de `pricing.php` sin breaking changes.
  - Evidencia: `pricing.php` ahora incluye `version: v1` y `currency: ARS`, manteniendo `data.diagnostico_lista_2h_ars`.

- [x] Agregar pruebas de contrato negativas y de seguridad.
  - Evidencia: `tests/unit/infrastructure/phpApiContracts.test.ts` cubre:
    - `health.php` con `request_id`
    - `pricing.php` con `version`/`currency`
    - rechazo de email invalido en `contact.php`
    - rechazo de mensaje corto en `mail.php`
    - preflight CORS (`OPTIONS`) en `contact.php`
  - Evidencia: `npm run test -- tests/unit/infrastructure/phpApiContracts.test.ts` verde (11/11).

### Hardening backend PHP adicional - 2026-02-26 (cierre backlog)

- [x] Corregir exposicion de codigo fuente PHP en entorno dev/proxy.
  - Evidencia: proxy Vite unificado para `/api` y consumo can贸nico de endpoints `/api/v1/*`.
  - Evidencia: se evita acoplamiento a archivos `.php` en runtime frontend.

- [x] Agregar rate limit basico en endpoints sensibles.
  - Evidencia: helper `dmq_enforce_rate_limit()` en `public/api/_bootstrap.php`.
  - Evidencia: aplicado en:
    - `public/api/_contact_impl.php`
    - `public/api/_mail_impl.php`
    - `public/api/quote/_diagnostic_impl.php`
  - Comportamiento: responde `429 RATE_LIMITED` con header `Retry-After`.

- [x] Separar proveedor de contenido (SRP).
  - Evidencia: `dmq_build_app_content()` movido a `public/api/content_provider.php`.
  - Evidencia: `public/api/_content_impl.php` queda como adaptador HTTP liviano.

- [x] Agregar test de contrato para rate limiting.
  - Evidencia: `tests/unit/infrastructure/phpApiContracts.test.ts` incluye caso `429` en endpoint `contact` y verifica `Retry-After`.
  - Evidencia de ejecucion: `npm run test -- tests/unit/infrastructure/phpApiContracts.test.ts` verde (12/12).

### Migracion de endpoints versionados sin `.php` - 2026-02-26

- [x] Definir rutas can贸nicas versionadas.
  - Decisi贸n aplicada: `/api/v1/...` como can贸nico.
  - Rutas: `/api/v1/health`, `/api/v1/content`, `/api/v1/pricing`, `/api/v1/contact`, `/api/v1/mail`, `/api/v1/quote/diagnostic`, `/api/v1/quote/pdf`.

- [x] Mantener compatibilidad temporal dual-stack.
  - Evidencia: se conservan endpoints legacy `*.php`.
  - Evidencia: se agregaron aliases versionados en `public/api/v1/*` (wrappers `.php`) y rutas directorio `index.php` sin extensi贸n para entornos sin rewrite avanzado.

- [x] Actualizar frontend/runtime al endpoint can贸nico versionado.
  - Evidencia: `src/infrastructure/content/runtimeProfiles.json` actualizado a `/api/v1/...`.
  - Evidencia: `src/infrastructure/health/probeBackendHealth.ts` usa `/api/v1/health`.

- [x] Actualizar pruebas y contratos al endpoint can贸nico.
  - Evidencia: tests actualizados en:
    - `tests/unit/infrastructure/viteConfig.test.ts`
    - `tests/unit/infrastructure/publicConfig.test.ts`
    - `tests/unit/infrastructure/quoteApiGateway.test.ts`
    - `tests/unit/infrastructure/probeBackendHealth.test.ts`
    - `tests/unit/infrastructure/phpApiContracts.test.ts`
    - `tests/e2e/smoke.spec.ts`
  - Evidencia de ejecuci贸n:
    - `npm run typecheck` verde
    - `npm run test -- tests/unit/infrastructure/viteConfig.test.ts` verde
    - `npm run test -- tests/unit/infrastructure/publicConfig.test.ts` verde
    - `npm run test -- tests/unit/infrastructure/quoteApiGateway.test.ts` verde
    - `npm run test -- tests/unit/infrastructure/probeBackendHealth.test.ts` verde
    - `npm run test -- tests/unit/infrastructure/phpApiContracts.test.ts` verde

- [x] Retirar endpoints legacy `*.php`.
  - Evidencia: implementaci贸n movida a archivos internos no p煤blicos:
    - `public/api/_health_impl.php`
    - `public/api/_content_impl.php`
    - `public/api/_pricing_impl.php`
    - `public/api/_contact_impl.php`
    - `public/api/_mail_impl.php`
    - `public/api/quote/_diagnostic_impl.php`
    - `public/api/quote/_pdf_impl.php`
  - Evidencia: rutas p煤blicas can贸nicas servidas por `public/api/v1/...` (wrappers + `index.php` sin extensi贸n).
  - Evidencia: contrato de pruebas ejecutado sobre `/api/v1/*` en `tests/unit/infrastructure/phpApiContracts.test.ts`.

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

### P0 finalizado - 2026-02-26 (`content` remoto completo)

- [x] Definir contrato final completo de `GET /api/content.php` por target.
  - Evidencia: `public/api/content.php` entrega `data` con estructura completa compatible con `AppContentSchema` y `version: v2`.
  - Evidencia: soporte de `brand_id` adicional `example` en `public/api/_bootstrap.php`.

- [x] Implementar payload completo en PHP por marca/target.
  - Evidencia: `dmq_build_app_content()` con variantes `datamaq`, `upp`, `example`.
  - Evidencia: test de contrato ampliado en `tests/unit/infrastructure/phpApiContracts.test.ts`.

- [x] Retirar contenido textual hardcodeado de frontend y dejar fallback tecnico minimo.
  - Evidencia: `src/infrastructure/content/landingContentBuilder.ts` reducido a fallback tecnico neutral.
  - Evidencia: frontend prioriza snapshot remoto completo en `src/infrastructure/content/dynamicContentService.ts`.

### P0 finalizado - 2026-02-26 (`thanks` y `decisionFlow` remoto)

- [x] Extender contrato remoto para cubrir textos UI fuera del bloque landing base.
  - Evidencia: `AppContent` y `AppContentSchema` incluyen `decisionFlow` y `thanks`.
  - Evidencia: `public/api/content.php` entrega `data.decisionFlow` y `data.thanks` por target.

- [x] Adaptar consumo UI a contenido remoto.
  - Evidencia: `src/ui/sections/DecisionFlowSection.vue` consume `content.getContent().decisionFlow`.
  - Evidencia: `src/ui/views/ThanksView.ts` y `src/ui/views/ThanksView.vue` consumen `content.getContent().thanks`.

- [x] Validar contrato y comportamiento.
  - Evidencia: `tests/unit/infrastructure/phpApiContracts.test.ts` valida campos `decisionFlow` y `thanks`.
  - Evidencia: `npm run test:e2e:smoke` en verde con flujo actualizado.

### Archivado desde `docs/todo.md` - 2026-02-26

- [x] Hardening backend PHP posterior a auditor韆 (ciberseguridad + arquitectura + SOLID).
- [x] Migraci髇 de endpoints can髇icos sin `.php` (`/api/v1/...`) y deprecaci髇 controlada legacy.
- [x] Correcci髇 de exposici髇 de c骴igo PHP en entorno dev/proxy con proxy unificado `/api`.
- [x] Rate limit b醩ico en `contact`, `mail`, `quote/diagnostic` con `429` y `Retry-After`.
- [x] Separaci髇 de proveedor de contenido (`content_provider.php`) con endpoint HTTP delgado.
- [x] Tests de contrato para rate limit (`429`) en API PHP.
- [x] Extensi髇 de contrato remoto de contenido UI (`thanks`, `decisionFlow`) y consumo en frontend.
- [x] Contrato API can髇ico agn髎tico de framework (`content`, `pricing`, `health`, `contact`, `mail`).
- [x] Formato de error com鷑 congelado: `code`, `message`, `details`, `request_id` (con compatibilidad legacy).
- [x] Normalizaci髇 de versionado/rutas en `/api/v1/...` con compatibilidad transitoria para aliases legacy.
- [x] Testing de migraci髇 sin big-bang: contratos independientes del framework, compatibilidad legacy y criterio de salida.
- [x] Estrategia dual E2E en CI:
  - smoke mockeado (`npm run test:e2e:smoke`)
  - integraci髇 con backend PHP real (`npm run test:e2e:integration`) en workflow.
- [x] Unificar CORS por entorno en configuraci贸n central backend.
  - Evidencia: `CORS_ALLOWED_ORIGINS` (CSV) en `public/api/_bootstrap.php` con fallback seguro.
- [x] Consolidar validaci贸n de entrada `contact/mail` con reglas formales compartidas.
  - Evidencia: `dmq_validate_contact_payload()` reutilizado por `public/api/_contact_impl.php` y `public/api/_mail_impl.php`.
- [x] Middleware transversal backend (enfoque Laravel-like) para request-id + logging estructurado.
  - Evidencia: propagaci贸n de `x-request-id`/`request-id`/`x-correlation-id` en `public/api/_bootstrap.php`.
  - Evidencia: logging JSON por respuesta (`event=api.response`, `status`, `duration_ms`, `request_id`) v铆a `error_log`.
  - Evidencia de contrato: `tests/unit/infrastructure/phpApiContracts.test.ts` valida propagaci贸n de request id.
- [x] Desacoplar frontend de detalles de transporte.
  - Evidencia: `HttpClient` extendido con `get()` + opciones de `timeoutMs` y `retries` en `src/application/ports/HttpClient.ts`.
  - Evidencia: centralizaci贸n en `src/infrastructure/http/fetchHttpClient.ts` (GET/POST/PATCH/OPTIONS con timeout y retries).
  - Evidencia: consumo de `HttpClient` en `DynamicContentService`, `DynamicPricingService`, `probeBackendHealth`, `QuoteApiGateway`.
  - Evidencia: DI unificada en `src/di/container.ts` para compartir cliente HTTP.
  - Evidencia de tests: `44 passed` en suite enfocada de infraestructura/aplicaci贸n.
- [x] Normalizar mapeo de datos backend -> frontend (`snake_case` -> `camelCase`) mediante mappers.
  - Evidencia: mapper reutilizable `mapKeysToCamelCase()` en `src/infrastructure/mappers/caseMapper.ts`.
  - Evidencia: aplicado en `probeBackendHealth`, `contactResponseFeedback` y parseo de errores en `QuoteApiGateway`.
  - Evidencia: elimina transformaciones ad-hoc de claves en consumidores frontend.
  - Evidencia de tests:
    - `tests/unit/infrastructure/caseMapper.test.ts`
    - `tests/unit/infrastructure/contactResponseFeedback.test.ts`
    - `tests/unit/infrastructure/probeBackendHealth.test.ts`
    - `tests/unit/infrastructure/quoteApiGateway.test.ts`
- [x] Refactor backend por capas (alineado a Laravel).
  - [x] Mantener endpoints como adaptadores delgados HTTP.
  - [x] Extraer reglas de negocio a servicios reutilizables.
  - [x] Aislar serializaci贸n de respuesta en DTO/Resource equivalente.
  - Evidencia de implementaci贸n:
    - Servicios de dominio/aplicaci贸n en `public/api/_services.php`.
    - Recursos/DTO de salida en `public/api/_resources.php`.
    - Endpoints adaptadores actualizados:
      - `public/api/_contact_impl.php`
      - `public/api/_mail_impl.php`
      - `public/api/_pricing_impl.php`
      - `public/api/_health_impl.php`
      - `public/api/_content_impl.php`
      - `public/api/quote/_diagnostic_impl.php`
  - Evidencia de validaci贸n:
    - `npm run test -- tests/unit/infrastructure/phpApiContracts.test.ts` (14/14 verde).
- [x] Fortalecer controles de entrada HTTP en endpoints POST.
  - [x] Requerir y validar `Content-Type: application/json` en `contact`, `mail`, `quote/diagnostic`.
  - [x] Definir l铆mite expl铆cito de tama帽o de body y rechazo temprano (`413`) para reducir superficie DoS.
  - Evidencia de implementaci贸n:
    - `dmq_validate_json_request_headers_and_size()` en `public/api/_bootstrap.php`
    - `dmq_get_max_body_bytes()` + `dmq_read_json_body_with_limit()` en `public/api/_bootstrap.php`
    - Aplicado en `public/api/_contact_impl.php`, `public/api/_mail_impl.php`, `public/api/quote/_diagnostic_impl.php`

- [x] Completar pol铆tica CORS para request tracing.
  - Evidencia: `Access-Control-Allow-Headers` ahora incluye `Request-Id` y `X-Correlation-Id` en `public/api/_bootstrap.php`.
  - Evidencia: `Access-Control-Expose-Headers: X-Request-Id` agregado para trazabilidad desde cliente.

- [x] Endpoint `quote/pdf` definido como mock (no productivo).
  - [x] Etiquetar expl铆citamente en contrato/documentaci贸n que `quote/pdf` es mock transitorio.
  - [x] Mantener controles m铆nimos (headers de seguridad + request_id + validaci贸n de `quote_id`) sin ampliar alcance funcional.
  - Evidencia de documentaci贸n: `docs/dv-api-00.contrato-canonico-v1.md`.
  - Evidencia de contrato: `tests/unit/infrastructure/phpApiContracts.test.ts` valida `X-Request-Id` en `quote/pdf`.

- [x] Cobertura de contratos negativos adicional (parcial cerrada).
  - [x] Agregar tests de contrato para `415 Unsupported Media Type` (POST sin JSON).
  - [x] Agregar tests de contrato para `413 Payload Too Large`.
  - Evidencia: `tests/unit/infrastructure/phpApiContracts.test.ts`.
  - Evidencia de ejecuci贸n: `npm run test -- tests/unit/infrastructure/phpApiContracts.test.ts` (16/16 verde).
