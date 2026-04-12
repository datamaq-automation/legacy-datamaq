# Documentacion

Indice operativo para `docs/`. Ordena los documentos por tipo y por vigencia para reducir solapamiento.

## Fuente principal

- `fastapi-backend-migration-guide.md`: documento maestro de migracion backend.
- `todo.md`: backlog activo del frontend.
- `todo.done.md`: historial archivado de tareas cerradas.
- `preguntas-arquitectura.md`: inbox canonico de preguntas abiertas de arquitectura.

## Migracion WP Nativo (cursos.datamaq.com.ar)

- `wp-native-migration-phase-0.md`: inventario de rutas/SEO/tracking inicial.
- `wp-native-migration-phase-2.md`: carga de contenido inicial.
- `wp-native-migration-phase-3-smoke.md`: smoke pre-cutover (snapshot).
- `wp-native-migration-phase-4-cutover.md`: activacion permanente del tema.
- `wp-native-migration-phase-5-hardening.md`: hardening post-cutover (MU plugin + canonicalizacion nginx).
- `wp-native-open-items.md`: pendientes operativos/documentales abiertos.

## Contratos canonicos

- `backend-content-brand-seo-contract.md`: contrato historico/objetivo de `GET /v1/site` para backend. El frontend actual usa snapshot local congelado.
- `fastapi-contact-contract.md`: contrato de `POST /v1/contact`.
- `fastapi-content-pricing-contract.md`: referencia legacy/parcial de `content` y `pricing`. Ya no es fuente activa de runtime para el frontend.
- `fastapi-quote-contract.md`: contrato de `quote`.

## Implementacion y rollout

- `fastapi-router-implementation-checklist.md`: checklist por router para implementar FastAPI.
- `frontend-pydantic-migration-guide.md`: guia de migracion del frontend al formato backend estandarizado.
- `frontend-to-backend-handover-report.md`: handover puntual frontend -> backend con estado al 2026-03-01.

## Auditorias y decisiones

- `decisions/README.md`: indice de ADRs vigentes.
- `frontend-hardcoded-content-audit.md`: inventario de contenido hardcodeado y zonas a migrar.
- `backend-audit-checklist.md`: checklist de verificacion backend.
- `ux_audit_report.md`: auditoria UX/UI.
- `decision_offline_vs_fallback.md`: decision sobre resiliencia de formularios.
- `preguntas-arquitectura.md`: preguntas abiertas de arquitectura (fuente canonica).
- `decisions/preguntas-arquitectura.md`: shim de compatibilidad de ruta para tooling/skills.

## Infraestructura

- `cors-configuration.md`: configuracion CORS para API.
- `deploy-spa-fallback.md`: fallback SPA para deploy.
- `ci-cd-baseline-2026-03-30.md`: baseline operativo de duracion/cantidad de runs para CI/CD tras optimizacion.
  Incluye nota sobre `Cloudflare purge` opcional en CD y su comportamiento cuando faltan secretos.
- `src/infrastructure/content/siteSnapshot.datamaq.ts`: snapshot local de contenido usado por el frontend en runtime.

## Convenciones

- Si un documento define la decision vigente, debe enlazarlo `todo.md` o este indice.
- Si un documento describe un estado puntual con fecha, tratarlo como snapshot, no como contrato maestro.
- Si dos documentos cubren el mismo contrato, uno debe quedar explicitamente como canonico y el otro como contexto historico o de migracion.

## Anti-sobreingenieria

- No introducir `adapter`, `facade`, `controller`, `service` o `event handler` que solo deleguen 1:1 sin agregar politica real.
- Una abstraccion nueva debe justificar al menos uno de estos casos:
  - encapsula una regla de negocio o de consentimiento,
  - aisla una variacion real de implementacion,
  - protege un boundary externo,
  - reduce acoplamiento en mas de un consumidor activo.
- Si una capa solo reexporta llamadas al container o a una implementacion concreta, preferir uso directo desde el consumidor.
- Si un modulo solo tiene referencias desde tests y ninguna desde runtime, tratarlo como candidato a codigo muerto hasta demostrar un roadmap concreto.
- Antes de agregar una nueva capa, verificar si la complejidad se puede resolver con una funcion pequena, un puerto inline o una utilidad local.

## Triggers de Refactor (ADR-011)

- Se mantiene cohesion actual en componentes grandes mientras no se activen triggers tecnicos.
- Triggers vigentes:
  - `src/ui/pages/HomePage.vue` > 1300 lineas.
  - `src/ui/features/contact/ContactFormSection.vue` > 750 lineas.
  - necesidad de reutilizacion real de secciones/pasos en otra vista.
  - bugs recurrentes vinculados a acoplamiento interno del componente.
- Control automatizado: `npm run lint:component-size` (integrado en `npm run quality:fast`).
- Referencia de decision: `docs/decisions/ADR-011-large-components-refactor-strategy.md`.

## Triggers de Refactor (ADR-012)

- Se mantiene inyeccion explicita en use-cases mientras no haya trigger tecnico.
- Trigger principal:
  - constructor de un use-case > 10 dependencias.
- Triggers adicionales:
  - nuevas preocupaciones transversales reutilizadas por multiples use-cases.
  - friccion repetida en wiring DI o tests por setup excesivo.
- Referencia de decision: `docs/decisions/ADR-012-submit-contact-dependency-strategy.md`.
