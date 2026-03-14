# Documentacion

Indice operativo para `docs/`. Ordena los documentos por tipo y por vigencia para reducir solapamiento.

## Fuente principal

- `fastapi-backend-migration-guide.md`: documento maestro de migracion backend.
- `todo.md`: backlog activo del frontend.
- `todo.done.md`: historial archivado de tareas cerradas.

## Contratos canonicos

- `backend-content-brand-seo-contract.md`: contrato objetivo de `GET /v1/site`.
- `fastapi-contact-contract.md`: contrato de `POST /v1/contact`.
- `fastapi-content-pricing-contract.md`: referencia legacy/parcial de `content` y `pricing`. Revisar contra `GET /v1/site` antes de usarlo como fuente canonica.
- `fastapi-quote-contract.md`: contrato de `quote`.

## Implementacion y rollout

- `fastapi-router-implementation-checklist.md`: checklist por router para implementar FastAPI.
- `frontend-pydantic-migration-guide.md`: guia de migracion del frontend al formato backend estandarizado.
- `frontend-to-backend-handover-report.md`: handover puntual frontend -> backend con estado al 2026-03-01.

## Auditorias y decisiones

- `frontend-hardcoded-content-audit.md`: inventario de contenido hardcodeado y zonas a migrar.
- `backend-audit-checklist.md`: checklist de verificacion backend.
- `ux_audit_report.md`: auditoria UX/UI.
- `decision_offline_vs_fallback.md`: decision sobre resiliencia de formularios.
- `preguntas-arquitectura.md`: preguntas abiertas de arquitectura.

## Infraestructura

- `cors-configuration.md`: configuracion CORS para API.
- `deploy-spa-fallback.md`: fallback SPA para deploy.

## Convenciones

- Si un documento define la decision vigente, debe enlazarlo `todo.md` o este indice.
- Si un documento describe un estado puntual con fecha, tratarlo como snapshot, no como contrato maestro.
- Si dos documentos cubren el mismo contrato, uno debe quedar explicitamente como canonico y el otro como contexto historico o de migracion.

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
