# DV - Auditoria Contact/Mail + Logging (2026-02)

## A) Auditoria tecnica

### 1) Arquitectura Limpia
- Certeza: el dominio/caso de uso esta encapsulado y los canales `contact` y `mail` se resuelven en infraestructura/DI, no en componentes.
- Riesgo detectado: la observabilidad del formulario estaba parcialmente acoplada al composable con `console.*` (ruido y baja trazabilidad remota).
- Mejora aplicada: logger cliente dedicado + transporte de eventos a backend opcional.

### 2) SOLID
- Certeza: `ContactApiGateway` extiende comportamiento por canal sin romper contrato (`OCP`).
- Riesgo detectado: `contactHooks` acumulaba responsabilidades (submit + observabilidad + formato de logs).
- Mejora aplicada: extracción de logging y transporte a modulos dedicados para reducir acoplamiento.

### 3) Vue
- Certeza: composable orientado a logica (`contactHooks`) y componente orientado a presentacion.
- Riesgo detectado: inconsistencia de UX entre vistas (Home con dos formularios vs landing con uno).
- Mejora aplicada: ambos formularios visibles en Home y landing Escobar, con IDs/copy especificos.

### 4) TypeScript
- Certeza: canales tipados (`contact|mail`) y props tipadas en formularios.
- Riesgo detectado: falta de tipado para endpoint de ingesta de logs cliente.
- Mejora aplicada: tipado `VITE_CLIENT_LOG_INGEST_URL` y payload estructurado de logging.

## B) Oportunidades de mejora identificadas
- Reducir ruido de consola por eventos redundantes.
- Incorporar logging post-click con metadata util de diagnostico backend.
- Unificar semantica de eventos para ambos formularios.
- Evitar PII cruda en logs (email/mensaje completos).

## C) Plan de mejora ejecutado
1. Mantener dos formularios visibles por vista (contact + mail).
2. Definir semantica unificada de eventos de submit.
3. Implementar transporte de logs cliente hacia backend (opcional por env).
4. Sanitizar payload de logs para evitar PII cruda.
5. Mantener deduplicacion de warnings repetitivos.

## D) Implementacion aplicada
- Logging cliente:
  - `src/ui/logging/contactClientLogger.ts`
  - `src/ui/logging/contactLogTransport.ts`
  - niveles + dedupe + envio backend opcional + sanitizacion de PII.
- Form submit observability (`contactHooks`):
  - eventos: `submit_clicked`, `submit_blocked_*`, `submit_request_started`, `submit_response_ok|error`, `submit_exception`.
  - metadata: `channel`, `sectionId`, `endpointConfigured`, `statusCode`, `errorType`, `latencyMs`, `messageLength`, `emailDomain`.
- Formularios visibles en ambas vistas:
  - `src/ui/pages/HomePage.vue` (ya visible)
  - `src/ui/pages/MedicionConsumoEscobar.vue` (alineado en este turno)

## E) Configuracion recomendada
- `VITE_BACKEND_BASE_URL=https://api.datamaq.com.ar` (el frontend deriva `/api/contact` y `/api/mail`)
- `VITE_CLIENT_LOG_LEVEL=info`
- `VITE_CLIENT_LOG_INGEST_URL=https://api.datamaq.com.ar/api/client-logs` (opcional)

## F) Evidencia
- Archivos: `src/ui/features/contact/contactHooks.ts`, `src/ui/logging/contactClientLogger.ts`, `src/ui/logging/contactLogTransport.ts`, `src/ui/pages/HomePage.vue`, `src/ui/pages/MedicionConsumoEscobar.vue`, `.env.example`, `src/env.d.ts`.
