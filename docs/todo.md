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
