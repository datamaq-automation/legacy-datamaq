# Plan Tecnico Prioritario (informativo, no fuente de verdad)

> Este archivo es una **foto explicativa** para coordinar trabajo.  
> La **fuente de verdad** es la evidencia (config real en VPS/Chatwoot/mailbox + logs + pruebas E2E) y el estado real del repo/deploy.
>
> Baseline operativo: `docs/dv-opsr-01.md`.  
> Doc explicativo del flujo Chatwoot/email: `docs/dv-chatwoot.md`.  
> Tareas completadas: `docs/todo.done.2026-02.md`.

## 0) Objetivo (decisión vigente)

- La web tendrá **dos formularios**:
  1) **Contacto (lead / ingreso de contacto)**
  2) **Enviar mail** (consulta tipo email)

- Ambos deben terminar en **Inbox Email público** dentro de Chatwoot, para poder **responder como email**.

## 1) Identidad de correos (decisión vigente)

- `chatwoot@datamaq.com.ar`: **uso interno** (invitaciones, reset password, notificaciones de sistema Chatwoot).
- `info@datamaq.com.ar`: **uso público** (figura en la web; respuestas a consultas; identidad del inbox email público).

## 2) Estado actual (snapshot)

- Frontend (Vue) hoy usa (legacy):
  - `VITE_INQUIRY_API_URL=https://chatwoot.datamaq.com.ar/public/api/v1/inboxes/{INBOX_ID}/contacts`
- Backend objetivo:
  - FastAPI en `https://api.datamaq.com.ar` se escalará para recibir los submits y enviar email por SMTP.

## 3) Definición de Hecho (DoD) mínima

1) El submit desde la web crea una conversación en el **Inbox Email público** (info@).
2) Reply desde Chatwoot llega al email del contacto.
3) Reply del contacto vuelve a Chatwoot en el mismo hilo.
4) Se registra evidencia: fecha/hora, headers básicos (Message-ID), y logs sin errores SMTP.

## 4) Backlog activo

### P0 — Habilitar Inbox Email público (info@) en Chatwoot
- [ ] Crear o confirmar Inbox Email conectado a `info@datamaq.com.ar` (IMAP + SMTP).
- [ ] Verificar envío SMTP: desde Chatwoot se envía un reply y llega (prueba real).
- [ ] Verificar recepción IMAP: email entrante a info@ aparece en Inbox.
- [ ] Guardar evidencia mínima (capturas + logs relevantes).

### P0 — Backend FastAPI (SMTP simple) para los dos formularios
- [ ] Implementar endpoints:
  - `POST /contact`  (Contacto)
  - `POST /mail`     (Enviar mail)
- [ ] En ambos: validar payload, sanear input, loguear `request_id`, aplicar antispam.
- [ ] Envío SMTP:
  - `From: info@datamaq.com.ar`
  - `To: info@datamaq.com.ar` (o alias que lea el Inbox Email público)
  - `Reply-To: <email_del_cliente>`
  - `Subject` con convención (incluye `request_id` + tipo de formulario).
- [ ] CORS: permitir solo dominios de la web (prod) + localhost (dev).
- [ ] Rate-limit (mínimo) + honeypot (mínimo).

### P0 — Frontend: apuntar al backend (target)
- [ ] Cambiar variables de entorno en producción:
  - `VITE_CONTACT_API_URL=https://api.datamaq.com.ar/contact`
  - `VITE_MAIL_API_URL=https://api.datamaq.com.ar/mail`
- [ ] Mantener/actualizar smoke test existente para chequear backend real.
- [ ] Asegurar que el “availability check” **no** marque verde cuando alguien apunta por error a Chatwoot Public API.

### P1 — Limpieza de legacy Chatwoot Public API en cliente
- [ ] Eliminar dependencia del cliente a:
  - `https://chatwoot.datamaq.com.ar/public/api/v1/...`
- [ ] (Solo si se necesita transición corta) refactor de config:
  - Reemplazar URL embebida por `VITE_INBOX_ID={INBOX_ID}` + `VITE_CHATWOOT_BASE_URL=...`
  - **Nota:** esto es transición; el target es que el cliente no conozca Inbox IDs.

## 5) Riesgos conocidos
- Sin antispam/rate-limit: riesgo alto de inundación del inbox.
- Si SMTP en Chatwoot no está OK: no se puede cerrar el DoD “responder como mail”.

## 6) Avance turno 2026-02-18

- Decision tomada (B-Arquitectura): endurecer contrato frontend backend-only con politica explicita de endpoint permitido y bloqueo de URL Chatwoot Public API en runtime (monitor + gateway) para reducir acoplamiento y falsos positivos de disponibilidad.
- Avance: agregado modulo `src/application/contact/contactEndpointPolicy.ts` como regla unica reutilizable para validar endpoint de contacto.
- Avance: `ContactBackendMonitor` ahora marca `unavailable` cuando `inquiryApiUrl` falta o apunta a Chatwoot Public API; no marca verde por bypass legacy.
- Avance: `ContactApiGateway` rechaza endpoint no valido para backend-only y evita POST al canal Chatwoot Public API.
- Avance: migracion de config preparada sin ruptura: `VITE_CONTACT_API_URL` queda como fuente preferida, `VITE_INQUIRY_API_URL` como fallback transitorio, y se incorpora `VITE_MAIL_API_URL` para el segundo formulario.
- Avance: workflow de deploy FTPS valida `VITE_CONTACT_API_URL` (o fallback legacy) y exporta `VITE_CONTACT_API_URL` + `VITE_MAIL_API_URL` al build.
- Evidencia: `src/application/contact/contactEndpointPolicy.ts`.
- Evidencia: `src/application/contact/contactBackendStatus.ts`.
- Evidencia: `src/infrastructure/contact/contactApiGateway.ts`.
- Evidencia: `src/infrastructure/config/viteConfig.ts`, `src/infrastructure/config/publicConfig.ts`, `src/application/ports/Config.ts`, `src/env.d.ts`.
- Evidencia: `.env.example`, `.env.e2e`, `.env.local`, `.github/workflows/ci-cd-ftps.yml`.
- Evidencia: `tests/unit/application/contactBackendStatus.test.ts`, `tests/unit/infrastructure/contactApiGateway.test.ts`, `tests/unit/ui/defaultSeo.test.ts`.
- Siguiente paso: ejecutar validaciones obligatorias (`lint:security`, `lint:test-coverage`, `quality:merge`, `lint:todo-sync:merge-ready`) y corregir cualquier desvio.
- Siguiente accion interna ejecutable ahora: correr la bateria de calidad local y registrar resultados.
- Evidencia: `npm run quality:merge` (2026-02-18) fallo inicial en `quality:gate` por TypeScript (`TS2345` en `src/application/contact/contactBackendStatus.ts` y `src/infrastructure/contact/contactApiGateway.ts`) al pasar `NullableString` a funciones que esperan `string`.
- Mitigacion interna ejecutada: se reforzo narrowing en ambos puntos (`if (!apiUrl || !endpointPolicy.allowed)`) para mantener contrato tipado estricto y evitar llamadas con URL indefinida.
- Evidencia: `npm run lint:todo-sync:merge-ready` (2026-02-18) fallo esperado antes de reintento por falta de evidencia explicita de merge-readiness; se registra en este turno y se reejecuta al cierre.
- Evidencia: `npm run lint:security` OK (2026-02-18).
- Evidencia: `npm run lint:test-coverage` OK (2026-02-18). Cobertura global: lines 82.16%, statements 81.51%, functions 82.11%, branches 72.05%.
- Evidencia: `npm run lint:todo-sync` OK (2026-02-18).
- Evidencia: `npm run quality:merge` OK (2026-02-18) tras mitigacion de type narrowing; `quality:gate`, `quality:responsive` y `quality:mobile` en verde.
- Evidencia: `npm run lint:todo-sync:merge-ready` OK (2026-02-18).
- Avance: creado documento operativo de credenciales generales con detalle por plataforma y checklist (`docs/dv-cred-01.md`).
- Evidencia: `docs/dv-cred-01.md` (objetivo, inventario, procedimiento, anti-patrones, plantilla de solicitud).
- Siguiente paso: validar/ajustar responsables reales y canal corporativo de secretos segun operacion actual.
- Siguiente accion interna ejecutable ahora: correr `npm run lint:todo-sync` para confirmar trazabilidad vigente.
- Avance: creado documento solicitado en `docs/*.md` con prompts por etapas para Copilot Chat backend.
- Evidencia: `docs/dv-copilot-prompts-backend.md`.
- Siguiente accion interna ejecutable ahora: validar sincronia de tablero con `npm run lint:todo-sync`.
- Decision tomada (B-Arquitectura): desacoplar el formulario de mail del flujo legacy de contacto creando canal dedicado `mail` (gateway + monitor + caso de uso) para respetar `VITE_MAIL_API_URL` sin romper el formulario existente.
- Avance: `ContactApiGateway` ahora soporta canal configurable (`contact|mail`) y selecciona `inquiryApiUrl` o `mailApiUrl` segun corresponda.
- Avance: `ContactBackendMonitor` se refactorizo para aceptar selector de endpoint y etiqueta de monitor; se instancia `mailBackend` en DI.
- Avance: agregado `submitMail` en fachada/controlador y cableado en paginas `HomePage` y `MedicionConsumoEscobar` para que `handleEmailSubmit` use flujo mail.
- Avance: `ContactFormSection` ahora acepta `backendChannel` y las vistas de formulario lo fijan en `mail` para chequeo de disponibilidad consistente con el endpoint real.
- Evidencia: `src/infrastructure/contact/contactApiGateway.ts`, `src/application/contact/contactBackendStatus.ts`, `src/di/container.ts`.
- Evidencia: `src/ui/controllers/contactController.ts`, `src/ui/controllers/contactBackendController.ts`, `src/ui/features/contact/contactTypes.ts`, `src/ui/features/contact/contactHooks.ts`.
- Evidencia: `src/ui/pages/HomePage.ts`, `src/ui/pages/HomePage.vue`, `src/ui/pages/MedicionConsumoEscobar.ts`, `src/ui/pages/MedicionConsumoEscobar.vue`.
- Evidencia: `tests/unit/infrastructure/contactApiGateway.test.ts`, `tests/unit/ui/contactController.test.ts`.
- Evidencia: `npm run test -- tests/unit/infrastructure/contactApiGateway.test.ts tests/unit/ui/contactController.test.ts tests/unit/application/contactBackendStatus.test.ts` OK (2026-02-19).
- Evidencia: `npm run lint:security` OK (2026-02-19).
- Evidencia: `npm run lint:test-coverage` OK (2026-02-19). Cobertura global: lines 82.18%, statements 81.55%, functions 82.00%, branches 72.06%.
- Evidencia: `npm run lint:layers` OK (2026-02-19).
- Evidencia: `npm run test:a11y` OK (2026-02-19).
- Evidencia: `npm run check:css` OK (2026-02-19).
- Evidencia: `npm run quality:responsive` OK (2026-02-19). Etapas en verde y secuencia bloqueante cumplida: XS -> SM -> MD -> LG.
- Evidencia: `npm run quality:mobile` OK (2026-02-19).
- Evidencia: `npm run quality:merge` OK (2026-02-19).
- Evidencia: `npm run lint:todo-sync:merge-ready` OK (2026-02-19).
- Siguiente paso: validar el flujo real de formulario mail contra backend productivo (`POST /mail`) para confirmar disponibilidad fuera de mocks locales.
- Siguiente accion interna ejecutable ahora: en cuanto se disponga endpoint productivo operativo de mail, correr smoke tecnico sobre `/mail` y registrar resultado con timestamp.
- Decision tomada (B-Deploy): dividir `ci-cd-ftps.yml` en bloques operativos explicitos (`Build` y `Deploy`) con sub-bloques trazables para separar validacion de codigo, empaquetado y publicacion FTPS.
- Avance: auditoria de workflow actual detecto acoplamiento alto en `deploy-production` (validacion + build + preflight + upload en un solo job) y bajo aislamiento para diagnosticar fallos.
- Avance: bloque `Build` refactorizado en jobs `build-todo-sync` -> (`build-quality-gate` || `build-smoke-e2e`) para paralelizar controles independientes despues de sync.
- Avance: bloque `Deploy` refactorizado en jobs en serie `deploy-prepare` -> `deploy-build` -> `deploy-ftps-preflight` -> `deploy-ftps-upload`, con outputs tipados (endpoints, host, port, remote_dir) para trazabilidad por etapa.
- Avance: `deploy-build` publica artifact `dist-ftps`; `deploy-ftps-upload` consume artifact para evitar recompilar en etapa de transferencia.
- Avance: mitigacion CI para fallo E2E reportado (`contact flow submits and navigates to thanks`): en `build-smoke-e2e` se inyecta `VITE_MAIL_API_URL` al endpoint mockeado (`/api/contact`) para evitar falso negativo mientras el stub E2E se generaliza a `/api/mail`.
- Evidencia: `.github/workflows/ci-cd-ftps.yml` (jobs `build-*` y `deploy-*`, outputs, artifact dist, preflight dedicado y upload dedicado).
- Siguiente paso: endurecer smoke E2E para mockear de forma explicita `**/api/mail` y remover el override transitorio de `VITE_MAIL_API_URL` en workflow.
- Siguiente accion interna ejecutable ahora: correr `npm run lint:security` y `npm run lint:todo-sync` para validar compliance del cambio en workflow y trazabilidad del tablero.
- Mitigacion interna ejecutada: incidente CI en `Deploy / FTPS Preflight` por `SERVER_HOST/PORT/REMOTE_DIR` vacios al usar outputs derivados de secretos entre jobs.
- Decision tomada (B-Deploy): eliminar propagacion cross-job de valores FTPS sensibles (`server_host`, `port`, `remote_dir`) y recalcular normalizacion en cada job de deploy para evitar outputs vaciados por proteccion de secretos.
- Avance: `deploy-ftps-preflight` y `deploy-ftps-upload` ahora leen `FTPS_SERVER/FTPS_PORT/FTPS_REMOTE_DIR` directo desde `secrets` y resuelven `SERVER_HOST/PORT/REMOTE_DIR` localmente antes de `lftp`.
- Avance: `deploy-build` vuelve a consumir endpoints build directamente desde `secrets` para evitar dependencia de outputs sensibles.
- Evidencia: `.github/workflows/ci-cd-ftps.yml` (se eliminan outputs sensibles de `deploy-prepare`; normalizacion FTPS local en jobs `deploy-ftps-preflight` y `deploy-ftps-upload`).
- Evidencia: fallo reportado (2026-02-19) en preflight con env vacio (`SERVER_HOST=`, `PORT=`, `REMOTE_DIR=`) mitigado por rediseño sin outputs sensibles.
- Siguiente paso: ejecutar corrida remota del workflow para confirmar que preflight resuelve DNS correctamente con secretos reales.
- Siguiente accion interna ejecutable ahora: lanzar `workflow_dispatch` y verificar logs de `Deploy / FTPS Preflight` y `Deploy / FTPS Upload`.
- Decision tomada (B-Vue): para exponer dos formularios sin duplicar logica se reutiliza `ContactFormSection` con props tipadas de variante (`sectionId`, `title`, `subtitle`, `submitLabel`, `backendChannel`) en lugar de clonar componentes.
- Avance: Home ahora renderiza dos formularios explicitos:
  - `Ingreso de contacto` -> canal `contact` -> `submitContact`.
  - `Enviar e-mail` -> canal `mail` -> `submitMail`.
- Avance: `ContactFormSection` parametrizado para IDs unicos por formulario y copy especifico por variante, evitando colision de `id` en DOM.
- Avance: smoke E2E actualizado para mockear ambos endpoints (`/api/contact` y `/api/mail`) y validar ambos flujos de submit hacia `/gracias`.
- Avance: removido workaround temporal en CI (`VITE_MAIL_API_URL` vuelve a `/api/mail` en `Build / Smoke E2E`).
- Evidencia: `src/ui/pages/HomePage.vue`, `src/ui/pages/HomePage.ts`.
- Evidencia: `src/ui/features/contact/contactTypes.ts`, `src/ui/features/contact/contactHooks.ts`, `src/ui/features/contact/ContactFormSection.ts`, `src/ui/features/contact/ContactFormSection.vue`.
- Evidencia: `tests/e2e/smoke.spec.ts`.
- Evidencia: `.github/workflows/ci-cd-ftps.yml` (`Build / Smoke E2E` env `VITE_MAIL_API_URL=http://127.0.0.1:4173/api/mail`).
- Evidencia: `npm run quality:responsive` OK (2026-02-19). Etapas en verde y secuencia bloqueante cumplida: XS -> SM -> MD -> LG.
- Evidencia: `npm run quality:mobile` OK (2026-02-19).
- Evidencia: `npm run quality:merge` OK (2026-02-19).
- Evidencia: `npm run lint:todo-sync:merge-ready` OK (2026-02-19).
- Siguiente paso: validar corrida remota de CI para confirmar smoke E2E estable en GitHub Actions con mocks `/api/contact` y `/api/mail`.
- Siguiente accion interna ejecutable ahora: disparar `workflow_dispatch` sobre `main` y revisar job `Build / Smoke E2E`.
- Decision tomada (B-Testing): para reducir fragilidad y ruido del formulario se prioriza un logger cliente dedicado con deduplicacion por clave (`warnOnce`/`errorOnce`) y eventos estructurados sobre `console.*` directo en hooks.
- Avance: auditoria de arquitectura/formularios confirma separacion de canales en DI (`submitContact`/`submitMail`) y detecta deuda de observabilidad en `contactHooks` por logs duplicados por instancia de formulario.
- Avance: incorporado modulo `src/ui/logging/contactClientLogger.ts` con niveles (`debug|info|warn|error`), control por `VITE_CLIENT_LOG_LEVEL` y deduplicacion de eventos recurrentes.
- Avance: `contactHooks` migro de `console.*` ad-hoc a logging estructurado (`[contact-ui] event`) con contexto (`sectionId`, `backendChannel`, estado) y reduccion de ruido (se elimina payload/result redundante, errores criticos con `errorOnce`).
- Avance: tipado de entorno ampliado para logging en cliente (`VITE_CLIENT_LOG_LEVEL`) en `src/env.d.ts`.
- Avance: cobertura de regresion para deduplicacion de logging (`tests/unit/ui/contactClientLogger.test.ts`).
- Evidencia: `src/ui/logging/contactClientLogger.ts`, `src/ui/features/contact/contactHooks.ts`, `src/env.d.ts`, `tests/unit/ui/contactClientLogger.test.ts`.
- Evidencia: `npm run test -- tests/unit/ui/contactClientLogger.test.ts tests/unit/ui/contactFormSection.test.ts tests/unit/ui/contactSubmitThanksFlow.test.ts tests/e2e/smoke.spec.ts` OK (2026-02-19).
- Evidencia: `npm run quality:responsive` OK (2026-02-19). Etapas en verde: XS -> SM -> MD -> LG.
- Evidencia: `npm run quality:mobile` OK (2026-02-19).
- Evidencia: `npm run quality:merge` OK (2026-02-19).
- Evidencia: `npm run lint:todo-sync:merge-ready` OK (2026-02-19).
- Siguiente paso: evaluar nivel por defecto de logging en desarrollo (`debug` vs `info`) segun necesidad del equipo para minimizar salida en consola local.
- Siguiente accion interna ejecutable ahora: si se busca menos ruido en dev, definir `VITE_CLIENT_LOG_LEVEL=info` en `.env.local` y revalidar smoke manual.
- Avance: segunda iteracion de logging aplicada para reducir ruido observado en consola con dos formularios montados (`contacto-lead` y `contacto-mail`).
- Decision tomada (B-Vue): degradar `backend-status:unavailable` de `error` a `warn` cuando es estado esperado de configuracion faltante, preservando `error` solo para excepciones reales.
- Avance: `contactClientLogger` cambia nivel por defecto a `info` (debug solo por opt-in con `VITE_CLIENT_LOG_LEVEL=debug`) para evitar trazas de estado repetitivas en desarrollo normal.
- Avance: `contactHooks` ahora deduplica warning de indisponibilidad entre formularios por causa (`missing-both-api-urls`, `missing-mail-api-url`, `missing-contact-api-url`) mediante `warnOnce`.
- Avance: `.env.example` documenta `VITE_CLIENT_LOG_LEVEL` para controlar verbosidad sin cambios de codigo.
- Evidencia: `src/ui/logging/contactClientLogger.ts`, `src/ui/features/contact/contactHooks.ts`, `.env.example`.
- Evidencia: `npm run quality:responsive` OK (2026-02-19). Etapas en verde y secuencia bloqueante cumplida: XS -> SM -> MD -> LG.
- Evidencia: `npm run quality:mobile` OK (2026-02-19).
- Evidencia: `npm run quality:merge` OK (2026-02-19).
- Evidencia: `npm run lint:security` OK (2026-02-19).
- Evidencia: `npm run lint:test-coverage` OK (2026-02-19). Cobertura global: lines 81.40%, statements 80.82%, functions 81.22%, branches 70.15%.
- Siguiente paso: validar manualmente en navegador local el comportamiento de consola esperado:
  - 1 warning deduplicado por causa de indisponibilidad.
  - sin spam de `backend-status:ensure` salvo que se fuerce `VITE_CLIENT_LOG_LEVEL=debug`.
- Siguiente accion interna ejecutable ahora: correr `npm run lint:todo-sync:merge-ready` y preparar push para validacion remota de CI.
- Avance: generado informe de handoff para backend con certezas verificadas, contrato minimo sugerido y dudas abiertas para cierre funcional (`docs/dv-backend-contact-mail-handoff.md`).
- Evidencia: `docs/dv-backend-contact-mail-handoff.md`.
- Decision tomada (B-Deploy): path canonico backend confirmado en este turno: `POST /api/contact` y `POST /api/mail`.
- Decision tomada (B-Arquitectura): recomendaciones de cierre backend adoptadas para handoff:
  - incluir `request_id` en respuesta (exito/error),
  - validacion comun + diferencias minimas por canal,
  - `rate-limit` por IP + honeypot,
  - `Reply-To` obligatorio validado.
- Avance: informe backend actualizado con decisiones cerradas y backlog residual reducido a CORS productivo.
- Avance: `.env.example` alineado a ejemplos productivos canonicos `/api/contact` y `/api/mail`.
- Evidencia: `docs/dv-backend-contact-mail-handoff.md`, `.env.example`.
- Siguiente paso: validar implementacion backend real de `request_id`, `Reply-To` y rate-limit para ejecutar smoke contra entorno productivo.
- Siguiente accion interna ejecutable ahora: correr `npm run lint:todo-sync` para confirmar trazabilidad vigente.
- Decision tomada (B-Arquitectura): consolidar observabilidad del submit en un logger/transport dedicado para desacoplar `contactHooks` de `console.*` y permitir diagnostico backend con eventos estructurados.
- Avance: creado reporte de auditoria tecnica y plan ejecutado para contacto/mail + logging en `docs/dv-audit-contact-mail-logging-2026-02.md`.
- Avance: incorporado transporte de logs cliente a backend opcional por env (`VITE_CLIENT_LOG_INGEST_URL`) con `sendBeacon/fetch keepalive`.
- Avance: estandarizada semantica de eventos de submit para ambos canales (`submit_clicked`, `submit_request_started`, `submit_response_ok|error`, bloqueos y excepciones), con metadata util (`channel`, `sectionId`, `statusCode`, `errorType`, `latencyMs`) y sin PII cruda.
- Avance: landing `MedicionConsumoEscobar` alineada a Home con ambos formularios visibles (`contact` y `mail`) y misma semantica de logging.
- Evidencia: `src/ui/logging/contactLogTransport.ts`, `src/ui/logging/contactClientLogger.ts`, `src/ui/features/contact/contactHooks.ts`.
- Evidencia: `src/ui/pages/MedicionConsumoEscobar.ts`, `src/ui/pages/MedicionConsumoEscobar.vue`, `src/env.d.ts`, `.env.example`.
- Evidencia: `docs/dv-audit-contact-mail-logging-2026-02.md`.
- Siguiente paso: ejecutar validacion integral local y registrar merge-readiness del turno.
- Siguiente accion interna ejecutable ahora: correr `npm run quality:merge` y `npm run lint:todo-sync:merge-ready`.
- Mitigacion interna ejecutada: `quality:merge` fallo por TypeScript estricto (`TS2379`, `TS4111`) en logging/contact hooks; se corrigieron tipos de endpoint nullable y acceso por index signature en sanitizacion de payload.
- Evidencia: `src/ui/features/contact/contactHooks.ts`, `src/ui/logging/contactClientLogger.ts`.
- Evidencia: `npm run quality:responsive` OK (2026-02-20). Etapas en verde y secuencia bloqueante cumplida: XS -> SM -> MD -> LG.
- Evidencia: `npm run quality:mobile` OK (2026-02-20).
- Evidencia: `npm run quality:merge` OK (2026-02-20) tras mitigacion de tipado estricto.
- Evidencia: `npm run lint:security` OK (2026-02-20).
- Evidencia: `npm run lint:test-coverage` OK (2026-02-20). Cobertura global: lines 81.00%, statements 80.44%, functions 81.27%, branches 68.82%.
- Siguiente paso: ejecutar checks finales de trazabilidad y merge-readiness para cerrar el turno.
- Siguiente accion interna ejecutable ahora: correr `npm run lint:todo-sync:merge-ready` y `npm run lint:todo-sync`.
- Avance: generado informe tecnico para backend sobre fallo de preflight CORS (`OPTIONS 405`) en `/api/contact` y `/api/mail`, con contrato esperado, plan de fix y checklist de verificacion.
- Evidencia: `docs/dv-backend-cors-preflight-2026-02.md`.
- Siguiente paso: ejecutar validacion conjunta backend+frontend luego del fix CORS para confirmar estado `available` en ambos canales.
- Siguiente accion interna ejecutable ahora: correr `npm run lint:todo-sync` para validar trazabilidad del tablero.
- Avance: validacion manual local del formulario `Enviar e-mail` en `contacto-mail` con Vite en caliente y backend reportado como `available`; secuencia de eventos observada: `submit_clicked` -> `submit_request_started` -> `submit_response_ok`.
- Evidencia: consola navegador (2026-02-20) muestra `route: thanks`, `latencyMs: 324`, `backendChannel: mail`, `endpointConfigured: true`.
- Avance: segunda validacion manual local del formulario `Enviar e-mail` en build cliente (`ContactFormSection.vue_vue_type_script_setup_true_lang-*.js`) mantiene flujo estable de submit sin regresion funcional.
- Evidencia: consola navegador (2026-02-20) muestra nuevamente `submit_clicked` -> `submit_request_started` -> `submit_response_ok` con `route: thanks`, `latencyMs: 186`, `backendChannel: mail`, `sectionId: contacto-mail`.
- Siguiente paso: repetir validacion manual del canal `contact` bajo el mismo criterio de eventos estructurados para cerrar paridad entre formularios.
- Siguiente accion interna ejecutable ahora: ejecutar submit real desde `contacto-lead` y confirmar en consola `submit_response_ok` con navegacion a `thanks`.
- Decision tomada (B-Arquitectura): ampliar el contrato frontend de submit para propagar feedback backend estructurado (`request_id`, `error_code`, `backend_message`) desde infraestructura hacia UI sin acoplar reglas de negocio al componente.
- Avance: `ContactGateway` deja de retornar `Result<void, ContactError>` y retorna `Result<ContactSubmitSuccess, ContactError>` para habilitar correlacion en flujo de exito/error.
- Avance: `FetchHttpClient` ahora expone headers normalizados en `HttpResponse` y `ContactApiGateway` extrae feedback desde body + headers (`x-request-id`) para logs y trazabilidad.
- Avance: `contactHooks` incorpora metadata backend en eventos `submit_response_ok`/`submit_response_error` y agrega `Codigo de seguimiento: <request_id>` al mensaje de error cuando backend lo provee.
- Avance: agregada cobertura unitaria para parser de feedback backend (`tests/unit/infrastructure/contactResponseFeedback.test.ts`) y ampliada cobertura de gateway para `request_id/error_code`.
- Evidencia: `src/application/dto/contact.ts`, `src/application/types/errors.ts`, `src/application/contact/ports/ContactGateway.ts`, `src/application/ports/HttpClient.ts`.
- Evidencia: `src/infrastructure/http/fetchHttpClient.ts`, `src/infrastructure/contact/contactApiGateway.ts`, `src/infrastructure/contact/contactSubmissionErrors.ts`, `src/infrastructure/contact/contactResponseFeedback.ts`.
- Evidencia: `src/ui/features/contact/contactHooks.ts`, `src/ui/features/contact/contactTypes.ts`, `src/ui/features/contact/useContactFacade.ts`, `src/application/use-cases/submitContact.ts`.
- Evidencia: `tests/unit/infrastructure/contactApiGateway.test.ts`, `tests/unit/infrastructure/contactResponseFeedback.test.ts`, `tests/unit/application/submitContact.test.ts`, `tests/unit/ui/contactFormSection.test.ts`, `tests/unit/ui/contactSubmitThanksFlow.test.ts`, `tests/unit/ui/contactController.test.ts`.
- Evidencia: `npm run test -- tests/unit/infrastructure/contactApiGateway.test.ts tests/unit/infrastructure/contactResponseFeedback.test.ts tests/unit/application/submitContact.test.ts tests/unit/ui/contactFormSection.test.ts tests/unit/ui/contactSubmitThanksFlow.test.ts tests/unit/ui/contactController.test.ts` OK (2026-02-20).
- Siguiente paso: ejecutar bateria obligatoria completa (`lint:security`, `lint:test-coverage`, `lint:layers`, `test:a11y`, `check:css`, `quality:responsive`, `quality:mobile`, `quality:merge`, `lint:todo-sync:merge-ready`).
- Siguiente accion interna ejecutable ahora: correr comandos de compliance/merge-readiness y registrar evidencia consolidada del turno.
- Mitigacion interna ejecutada: `quality:merge` detecto fallo de TypeScript por `exactOptionalPropertyTypes` al propagar props opcionales con valor `undefined`; se corrigio retornando metadata opcional solo cuando existe valor real.
- Evidencia: `src/infrastructure/contact/contactResponseFeedback.ts` ahora construye `ContactSubmitFeedback` incremental (sin keys opcionales en `undefined`).
- Evidencia: `src/infrastructure/contact/contactSubmissionErrors.ts` ahora aplica `buildFeedbackMeta` para inyectar `requestId/errorCode/backendMessage` solo cuando vienen definidos.
- Evidencia: `tests/unit/infrastructure/contactApiGateway.test.ts`, `tests/unit/infrastructure/contactResponseFeedback.test.ts` ajustados al nuevo contrato exacto de opcionales.
- Evidencia: `npm run typecheck` OK (2026-02-20) tras mitigacion de opcionales.
- Evidencia: `npm run test -- tests/unit/infrastructure/contactApiGateway.test.ts tests/unit/infrastructure/contactResponseFeedback.test.ts` OK (2026-02-20) tras mitigacion.
- Evidencia: `npm run quality:merge` (2026-02-20) fallo en `quality:gate` por `lint:todo-sync` al detectar cambios nuevos en `src/` y `tests/` sin trazabilidad de turno.
- Mitigacion interna ejecutable ahora: registrar evidencias del fix en `docs/todo.md` y reintentar `quality:merge` + `lint:todo-sync:merge-ready`.
- Evidencia: `npm run lint:security` OK (2026-02-20).
- Evidencia: `npm run lint:layers` OK (2026-02-20).
- Evidencia: `npm run lint:test-coverage` OK (2026-02-20). Cobertura global: lines 81.53%, statements 80.98%, functions 81.52%, branches 68.64%.
- Evidencia: `npm run test:a11y` OK (2026-02-20).
- Evidencia: `npm run check:css` OK (2026-02-20).
- Evidencia: `npm run quality:responsive` OK (2026-02-20). Etapas en verde y secuencia bloqueante cumplida: XS -> SM -> MD -> LG.
- Evidencia: `npm run quality:mobile` OK (2026-02-20).
- Evidencia: `npm run quality:merge` OK (2026-02-20) tras mitigacion de `exactOptionalPropertyTypes` y sincronizacion de trazabilidad en tablero.
- Evidencia: `npm run lint:todo-sync:merge-ready` OK (2026-02-20).
- Avance: generado informe tecnico detallado para backend sobre correlacion frontend/backend (`request_id`, `error_code`, headers CORS expuestos, contrato de errores y checklist operativo).
- Evidencia: `docs/dv-backend-feedback-correlation-2026-02.md`.
- Avance: validacion manual local del canal `mail` confirma feedback backend correlacionable en exito con `requestId` propagado a UI (`submit_response_ok`) y navegacion a `thanks`.
- Evidencia: consola navegador (2026-02-20) en `contacto-mail`: `submit_clicked` -> `submit_request_started` -> `submit_response_ok` con `requestId: 6a1fc529-1b14-4d1f-a282-bda10d32ffd1`, `latencyMs: 169`, `backendStatus: available`.
- Avance: nueva corrida manual de `contacto-mail` mantiene estabilidad del flujo y confirma emision repetible de `requestId` en exito.
- Evidencia: consola navegador (2026-02-20) en `contacto-mail`: `submit_clicked` -> `submit_request_started` -> `submit_response_ok` con `requestId: 7a796417-137e-4afa-8e34-47918d84b81c`, `latencyMs: 169`, `backendStatus: available`.
- Siguiente paso: validar en entorno backend real que `X-Request-Id` se exponga en `/api/contact` y `/api/mail` y quede reflejado en eventos `submit_response_ok/error` del frontend.
- Siguiente accion interna ejecutable ahora: ejecutar prueba manual contra backend productivo/QA con DevTools (Network + Console) y confirmar correlacion `request_id` extremo a extremo.
- Decision tomada (B-Vue): agregar flags booleanos en ingles por formulario (`isContactFormActive`, `isEmailFormActive`) en los page controllers para habilitar render condicional con `v-if` sin alterar el contrato de submit ni la logica de backend availability.
- Avance: `HomePage` y `MedicionConsumoEscobar` ahora exponen ambos flags y renderizan cada `ContactFormSection` de forma condicional segun su bandera.
- Evidencia: `src/ui/pages/HomePage.ts`, `src/ui/pages/HomePage.vue`, `src/ui/pages/MedicionConsumoEscobar.ts`, `src/ui/pages/MedicionConsumoEscobar.vue`.
- Siguiente paso: definir fuente de verdad de flags (config/env/CMS) y comportamiento UX cuando un formulario esta inactivo (ocultar vs deshabilitar con mensaje).
- Siguiente accion interna ejecutable ahora: correr bateria obligatoria (`lint:security`, `test:a11y`, `check:css`, `quality:responsive`, `quality:mobile`, `lint:test-coverage`, `quality:merge`, `lint:todo-sync:merge-ready`).
- Mitigacion interna ejecutada: corrida inicial de validaciones en paralelo genero colision de cobertura (`ENOENT coverage/.tmp/coverage-13.json`) y timeout en `quality:merge`; se re-ejecutaron checks en secuencia para eliminar interferencia entre procesos.
- Evidencia: `npm run lint:security` OK (2026-02-21).
- Evidencia: `npm run test:a11y` OK (2026-02-21).
- Evidencia: `npm run check:css` OK (2026-02-21).
- Evidencia: `npm run quality:responsive` OK (2026-02-21). Etapas en verde y secuencia bloqueante cumplida: XS -> SM -> MD -> LG.
- Evidencia: `npm run quality:mobile` OK (2026-02-21).
- Evidencia: `npm run lint:test-coverage` OK (2026-02-21). Cobertura global: lines 81.53%, statements 80.98%, functions 81.52%, branches 68.64%.
- Evidencia: `npm run quality:merge` OK (2026-02-21).
- Evidencia: `npm run lint:todo-sync:merge-ready` OK (2026-02-21).
- Siguiente paso: decidir fuente de verdad de activacion de formularios para reemplazar flags locales hardcoded y alinear UX cuando un formulario quede inactivo.
- Siguiente accion interna ejecutable ahora: al definir la estrategia de flags, moverlos a config central y cubrir escenario de formulario oculto/deshabilitado con pruebas unitarias/E2E.
- Decision tomada (B-Arquitectura): centralizar activacion de formularios en `ConfigPort` con override por env (`VITE_IS_CONTACT_FORM_ACTIVE`, `VITE_IS_EMAIL_FORM_ACTIVE`) y fallback en `publicConfig` para evitar flags hardcoded por pagina.
- Avance: `contactController` expone getters (`getContactFormActive`, `getEmailFormActive`) y `HomePage`/`MedicionConsumoEscobar` consumen config central para render condicional de formularios.
- Avance: `ViteConfig` incorpora parseo robusto de booleanos (`true|false`) con warning y fallback seguro.
- Evidencia: `src/application/ports/Config.ts`, `src/infrastructure/config/publicConfig.ts`, `src/infrastructure/config/viteConfig.ts`, `src/env.d.ts`, `.env.example`.
- Evidencia: `src/ui/controllers/contactController.ts`, `src/ui/pages/HomePage.ts`, `src/ui/pages/MedicionConsumoEscobar.ts`.
- Siguiente paso: validar por entorno (dev/qa/prod) valores efectivos de `VITE_IS_CONTACT_FORM_ACTIVE` y `VITE_IS_EMAIL_FORM_ACTIVE` para coordinar habilitacion gradual.
- Siguiente accion interna ejecutable ahora: correr bateria obligatoria de calidad y merge-readiness con trazabilidad del turno.
- Mitigacion interna ejecutada: al correr `lint:test-coverage` en paralelo con otras tareas pesadas reaparecio colision intermitente de cobertura (`ENOENT coverage/.tmp/coverage-12.json`); se estandariza ejecucion secuencial para el check de cobertura en este repo.
- Evidencia: `npm run lint:security` OK (2026-02-21).
- Evidencia: `npm run test:a11y` OK (2026-02-21).
- Evidencia: `npm run check:css` OK (2026-02-21).
- Evidencia: `npm run quality:responsive` OK (2026-02-21). Etapas en verde y secuencia bloqueante cumplida: XS -> SM -> MD -> LG.
- Evidencia: `npm run quality:mobile` OK (2026-02-21).
- Evidencia: `npm run lint:test-coverage` OK (2026-02-21) en ejecucion secuencial. Cobertura global: lines 81.40%, statements 80.86%, functions 80.93%, branches 68.64%.
- Evidencia: `npm run quality:merge` OK (2026-02-21).
- Evidencia: `npm run lint:todo-sync:merge-ready` OK (2026-02-21).
- Siguiente paso: mantener `lint:test-coverage` fuera de paralelizacion con otros jobs locales para evitar race condition de archivos temporales de cobertura.
- Siguiente accion interna ejecutable ahora: conservar orden secuencial de checks al preparar commits de frontend con cobertura.
- Decision tomada (B-Arquitectura): eliminar la funcionalidad de ingesta remota de logs cliente por complejidad innecesaria y mantener logging solo local en consola con deduplicacion existente.
- Avance: removido transporte `sendBeacon/fetch keepalive` y eliminada dependencia de `contactClientLogger` al modulo de ingesta remota.
- Avance: eliminado tipado/env de `VITE_CLIENT_LOG_INGEST_URL` para evitar configuracion muerta y reducir superficie de mantenimiento.
- Evidencia: `src/ui/logging/contactClientLogger.ts`, `src/ui/logging/contactLogTransport.ts` (eliminado), `src/env.d.ts`, `.env.example`.
- Siguiente paso: ejecutar bateria obligatoria de validacion y registrar merge-readiness del turno.
- Siguiente accion interna ejecutable ahora: correr en secuencia `npm run lint:security`, `npm run test:a11y`, `npm run check:css`, `npm run quality:responsive`, `npm run quality:mobile`, `npm run lint:test-coverage`, `npm run quality:merge`, `npm run lint:todo-sync:merge-ready`.
- Evidencia: `npm run lint:security` OK (2026-02-21).
- Evidencia: `npm run test:a11y` OK (2026-02-21).
- Evidencia: `npm run check:css` OK (2026-02-21).
- Evidencia: `npm run quality:responsive` OK (2026-02-21). Etapas en verde y secuencia bloqueante cumplida: XS -> SM -> MD -> LG.
- Evidencia: `npm run quality:mobile` OK (2026-02-21).
- Evidencia: `npm run lint:test-coverage` OK (2026-02-21). Cobertura global: lines 81.90%, statements 81.34%, functions 81.09%, branches 69.67%.
- Evidencia: `npm run quality:merge` OK (2026-02-21).
- Evidencia: `npm run lint:todo-sync:merge-ready` OK (2026-02-21).
- Evidencia: `npm run lint:todo-sync` OK (2026-02-21).
- Siguiente paso: mantener logging cliente enfocado en consola local y evitar reintroducir transporte remoto salvo necesidad operativa demostrada.
- Siguiente accion interna ejecutable ahora: continuar con las tareas P0 abiertas de integracion backend/Chatwoot segun prioridad del tablero.
- Decision tomada (B-Arquitectura): eliminar completamente la capa de logging cliente configurable (`VITE_CLIENT_LOG_LEVEL` + logger dedicado) para reducir complejidad y configuracion no esencial.
- Avance: `contactHooks` removio todas las invocaciones de logging estructurado sin alterar el flujo funcional de submit/contacto.
- Avance: eliminado modulo `src/ui/logging/contactClientLogger.ts` y su prueba unitaria asociada.
- Avance: eliminado `VITE_CLIENT_LOG_LEVEL` de tipado de entorno y plantilla `.env.example`.
- Evidencia: `src/ui/features/contact/contactHooks.ts`, `src/ui/logging/contactClientLogger.ts` (eliminado), `tests/unit/ui/contactClientLogger.test.ts` (eliminado), `src/env.d.ts`, `.env.example`.
- Siguiente paso: ejecutar bateria obligatoria secuencial y validar merge-readiness.
- Siguiente accion interna ejecutable ahora: correr `npm run lint:security`, `npm run test:a11y`, `npm run check:css`, `npm run quality:responsive`, `npm run quality:mobile`, `npm run lint:test-coverage`, `npm run quality:merge`, `npm run lint:todo-sync:merge-ready`.
- Evidencia: `npm run lint:security` OK (2026-02-21).
- Evidencia: `npm run test:a11y` OK (2026-02-21).
- Evidencia: `npm run check:css` OK (2026-02-21).
- Evidencia: `npm run quality:responsive` OK (2026-02-21). Etapas en verde y secuencia bloqueante cumplida: XS -> SM -> MD -> LG.
- Evidencia: `npm run quality:mobile` OK (2026-02-21).
- Evidencia: `npm run lint:test-coverage` OK (2026-02-21). Cobertura global: lines 83.00%, statements 82.39%, functions 81.60%, branches 74.03%.
- Evidencia: `npm run quality:merge` OK (2026-02-21).
- Evidencia: `npm run lint:todo-sync:merge-ready` OK (2026-02-21).
- Siguiente paso: mantener flujo de contacto sin capa de logging cliente dedicada salvo requerimiento operativo nuevo.
- Siguiente accion interna ejecutable ahora: continuar con tareas P0 abiertas de backend/operacion segun tablero.
- Decision tomada (B-Arquitectura): eliminar `VITE_INQUIRY_API_URL` del runtime/configuracion activa y consolidar `VITE_CONTACT_API_URL` + `VITE_MAIL_API_URL` como contrato unico de endpoints.
- Avance: `ViteConfig` deja de leer fallback `VITE_INQUIRY_API_URL`; `inquiryApiUrl` ahora deriva solo de `VITE_CONTACT_API_URL` (o `publicConfig` como fallback interno).
- Avance: eliminado tipado de `VITE_INQUIRY_API_URL` en `src/env.d.ts` y removida la variable de `.env.example`, `.env.e2e` y `.env.local`.
- Avance: documentacion de handoff/credenciales alineada al contrato canonico sin fallback legacy.
- Evidencia: `src/infrastructure/config/viteConfig.ts`, `src/env.d.ts`, `.env.example`, `.env.e2e`, `.env.local`, `docs/dv-backend-contact-mail-handoff.md`, `docs/dv-cred-01.md`.
- Siguiente paso: ejecutar validaciones obligatorias y registrar merge-readiness.
- Siguiente accion interna ejecutable ahora: correr en secuencia `npm run lint:security`, `npm run test:a11y`, `npm run check:css`, `npm run quality:responsive`, `npm run quality:mobile`, `npm run lint:test-coverage`, `npm run quality:merge`, `npm run lint:todo-sync:merge-ready`.
- Evidencia: `npm run lint:security` OK (2026-02-21).
- Evidencia: `npm run test:a11y` OK (2026-02-21).
- Evidencia: `npm run check:css` OK (2026-02-21).
- Evidencia: `npm run quality:responsive` OK (2026-02-21). Etapas en verde y secuencia bloqueante cumplida: XS -> SM -> MD -> LG.
- Evidencia: `npm run quality:mobile` OK (2026-02-21).
- Evidencia: `npm run lint:test-coverage` OK (2026-02-21). Cobertura global: lines 83.00%, statements 82.39%, functions 81.60%, branches 74.03%.
- Evidencia: `npm run quality:merge` OK (2026-02-21).
- Evidencia: `npm run lint:todo-sync:merge-ready` OK (2026-02-21).
- Siguiente paso: completar limpieza documental residual donde se menciona `VITE_INQUIRY_API_URL` como referencia historica si se busca consistencia total de nomenclatura.
- Siguiente accion interna ejecutable ahora: continuar con las tareas P0 abiertas de backend/operacion en tablero.
- Decision tomada (B-Arquitectura): unificar endpoints de formularios en una sola variable `VITE_BACKEND_BASE_URL` y derivar rutas `/api/contact` y `/api/mail` dentro de configuracion frontend.
- Avance: `ViteConfig` ahora construye `inquiryApiUrl`/`mailApiUrl` desde `VITE_BACKEND_BASE_URL` (normalizando slash final) y elimina dependencia de `VITE_CONTACT_API_URL`/`VITE_MAIL_API_URL`.
- Avance: CI/CD FTPS actualizado para validar y exportar solo `VITE_BACKEND_BASE_URL`, derivando endpoints de contacto/mail en el job de preparacion.
- Avance: tipado/env/documentacion operativa alineados al nuevo contrato unico de backend base URL.
- Evidencia: `src/infrastructure/config/viteConfig.ts`, `src/infrastructure/config/publicConfig.ts`, `src/env.d.ts`, `.env.example`, `.env.e2e`, `.env.local`, `.github/workflows/ci-cd-ftps.yml`, `docs/dv-backend-contact-mail-handoff.md`, `docs/dv-cred-01.md`, `docs/dv-audit-contact-mail-logging-2026-02.md`.
- Siguiente paso: ejecutar bateria obligatoria completa y confirmar merge-readiness local.
- Siguiente accion interna ejecutable ahora: correr `npm run lint:security`, `npm run test:a11y`, `npm run check:css`, `npm run quality:responsive`, `npm run quality:mobile`, `npm run lint:test-coverage`, `npm run quality:merge`, `npm run lint:todo-sync:merge-ready`.
- Evidencia: `npm run lint:security` OK (2026-02-21).
- Evidencia: `npm run test:a11y` OK (2026-02-21).
- Evidencia: `npm run check:css` OK (2026-02-21).
- Evidencia: `npm run quality:responsive` OK (2026-02-21). Etapas en verde y secuencia bloqueante cumplida: XS -> SM -> MD -> LG.
- Evidencia: `npm run quality:mobile` OK (2026-02-21).
- Evidencia: `npm run lint:test-coverage` OK (2026-02-21). Cobertura global: lines 83.00%, statements 82.39%, functions 81.60%, branches 74.03%.
- Evidencia: `npm run quality:merge` OK (2026-02-21).
- Evidencia: `npm run lint:todo-sync:merge-ready` OK (2026-02-21).
- Evidencia deploy/operacion: workflow `.github/workflows/ci-cd-ftps.yml` migra secretos/env de build a `VITE_BACKEND_BASE_URL` unico y deriva `/api/contact` + `/api/mail` en `deploy-prepare`; impacto esperado en produccion: reducir desalineacion de endpoints por variable duplicada.
- Siguiente paso: alinear secretos de GitHub Actions en entorno `production` para usar solo `VITE_BACKEND_BASE_URL` antes del proximo deploy remoto.
- Siguiente accion interna ejecutable ahora: mantener validaciones locales en verde y continuar con P0 operativos de backend/Chatwoot.
- Decision tomada (B-Vue): implementar la URL corta de QR como ruta SPA/SSG exacta `/w` en `vue-router` (en lugar de archivo estatico) porque el proyecto usa `vite-ssg` y asi se obtiene prerender + redirect por `meta refresh` + fallback sin romper navegacion existente.
- Avance: creada configuracion centralizada de QR WhatsApp en `src/application/constants/whatsappQr.ts` con `phoneE164`, `message`, `sourceTag` y constructor de link `wa.me` con encode del mensaje.
- Avance: nueva vista `WhatsAppRedirectView` con redireccion inmediata via `window.location.replace`, `meta refresh` para escenarios sin JS y fallback mobile-first con estilo industrial (negro/blanco + acento naranja).
- Avance: ruteo actualizado con path exacto `/w` y metadata SEO no indexable; sitemap preserva indexacion actual sin incluir `/w`.
- Evidencia: `src/application/constants/whatsappQr.ts`, `src/ui/views/WhatsAppRedirectView.ts`, `src/ui/views/WhatsAppRedirectView.vue`, `src/ui/views/WhatsAppRedirectView.css`, `src/router/routes.ts`, `src/seo/routes.json`, `tests/unit/application/whatsappQr.test.ts`.
- Siguiente paso: ejecutar bateria obligatoria completa de validacion (seguridad, capas, a11y, CSS, responsive, mobile, cobertura, merge) y registrar resultados.
- Siguiente accion interna ejecutable ahora: correr en secuencia `npm run lint:security`, `npm run lint:layers`, `npm run test:a11y`, `npm run check:css`, `npm run quality:responsive`, `npm run quality:mobile`, `npm run lint:test-coverage`, `npm run quality:merge`, `npm run build`, `npm run lint:todo-sync`, `npm run lint:todo-sync:merge-ready`.
- Mitigacion interna ejecutada: ajuste de `./.github/workflows/ci-cd-ftps.yml` para evitar mutacion en preflight FTPS (`mkdir -p`) y validar solo acceso real al directorio remoto (`cd` + `pwd`), reduciendo riesgo de fallo por permisos en `Deploy / FTPS Preflight`.
- Avance: removidos outputs no usados (`contact_endpoint`, `mail_endpoint`) del job `Deploy / Prepare` para eliminar warnings de GitHub Actions (`Skip output ... may contain secret`) y mantener trazabilidad limpia.
- Evidencia deploy/operacion: `.github/workflows/ci-cd-ftps.yml` actualizado en jobs `deploy-prepare` y `deploy-ftps-preflight`; impacto esperado en produccion: preflight menos fragil y diagnostico mas claro sobre conectividad/permisos reales del directorio FTPS.
- Siguiente paso: disparar `workflow_dispatch` y confirmar que `Deploy / FTPS Preflight` valida `cd` sobre `FTPS_REMOTE_DIR` sin error de `mkdir`.
- Siguiente accion interna ejecutable ahora: ejecutar `npm run lint:todo-sync` para verificar trazabilidad del tablero con el ajuste de deploy.
- Mitigacion interna ejecutada: agregado `public/.htaccess` con fallback SPA para Apache/AppServ, permitiendo resolver rutas cliente (`/w`, `/gracias`, etc.) hacia `index.html` cuando no existen archivos fisicos.
- Evidencia: `public/.htaccess`.
- Siguiente paso: validar en servidor Apache local que `http://localhost/w` cargue la SPA y ejecute el redirect de WhatsApp.
- Siguiente accion interna ejecutable ahora: reconstruir artefactos y confirmar presencia de `.htaccess` en salida deploy (`C:/AppServ/www`).
- Mitigacion interna ejecutada: rollback de fallback `.htaccess` por incompatibilidad de Apache local sin `mod_rewrite` (error `Invalid command RewriteEngine`).
- Avance: agregado recurso fisico exacto `public/w` (sin extension) para resolver `http://localhost/w` sin depender de rewrite del servidor.
- Evidencia: `public/w`; `C:/AppServ/Apache2.4/logs/error.log` confirma causa del 500 por `RewriteEngine` no disponible.
- Siguiente paso: reemplazar `TODO_REEMPLAZAR` en links de `public/w` y en config SPA de WhatsApp QR para usar telefono real.
- Siguiente accion interna ejecutable ahora: verificar manualmente `http://localhost/w` y validar apertura de wa.me.
- Mitigacion interna ejecutada: fix para Apache local cuando `/w` se descargaba como archivo; se agrega `public/.htaccess` con `ForceType text/html` aplicado solo al archivo `w`, sin depender de `mod_rewrite`.
- Evidencia: `public/.htaccess`, `public/w`.
- Siguiente paso: validar manualmente `http://localhost/w` y confirmar render + redirect/fallback en lugar de descarga.
- Siguiente accion interna ejecutable ahora: reiniciar Apache/AppServ y reintentar `/w`.
- Mitigacion interna ejecutada: endurecido `Deploy / FTPS Upload` ante fallos intermitentes `mirror: Fatal error: max-retries exceeded`.
- Decision tomada (B-Deploy): mantener FTPS estricto (SSL verify + hostname check) y agregar resiliencia operativa con reintentos de sesion (`3` intentos) + `net:max-retries 5` + `net:persist-retries 1` + `mirror -R --continue --delete`.
- Avance: el job ahora reporta intento `n/m`, espera 15s entre reintentos y falla explicitamente solo despues del ultimo intento.
- Evidencia deploy/operacion: `.github/workflows/ci-cd-ftps.yml` (job `deploy-ftps-upload`, step `Deploy dist via FTPS`).
- Siguiente paso: ejecutar `workflow_dispatch` para validar estabilidad del upload FTPS bajo red real.
- Siguiente accion interna ejecutable ahora: correr `npm run lint:todo-sync` para verificar trazabilidad del tablero.
- Decision tomada (B): primer ajuste incremental de alineacion canvas, priorizando un cambio de copy de alta certeza y bajo riesgo en contenido estatico.
- Avance: `src/infrastructure/content/content.ts` ahora explicita en `about.paragraphs` la oferta ampliada para industria grafica: mantenimiento/reparacion solo electrico/electronico y control (sin mecanica), alineado con `docs/modelo-negocios-canvas.resumen.md` y `docs/modelo-negocios-canvas.anexo.md`.
- Evidencia: `src/infrastructure/content/content.ts`.
- Siguiente paso: ejecutar bateria obligatoria de validacion por cambio en `src/` y confirmar merge-readiness.
- Siguiente accion interna ejecutable ahora: correr `npm run lint:security`, `npm run lint:test-coverage`, `npm run quality:merge`, `npm run lint:todo-sync:merge-ready`.
- Mitigacion interna ejecutada: fix de sintaxis bash en workflow FTPS. Se elimina uso de heredoc en `deploy-ftps-preflight` y `deploy-ftps-upload` por error `here-document ... wanted EOF` / `syntax error: unexpected end of file` reportado en CI.
- Decision tomada (B-Deploy): migrar comandos `lftp` a `lftp -e "..."` con misma configuracion SSL/reintentos para evitar fragilidad de delimitadores heredoc en YAML.
- Evidencia deploy/operacion: `.github/workflows/ci-cd-ftps.yml` actualizado en steps `Validate DNS and remote dir access` y `Deploy dist via FTPS`.
- Siguiente paso: re-ejecutar workflow remoto y verificar que el step de upload pase parseo de shell y avance a transferencia.
- Siguiente accion interna ejecutable ahora: correr `npm run lint:todo-sync` para validar trazabilidad del tablero.
