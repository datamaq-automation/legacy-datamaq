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
