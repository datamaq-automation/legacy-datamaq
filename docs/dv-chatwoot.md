# DV - Chatwoot & Email (informativo, no fuente de verdad)

Fecha de definicion inicial: 2026-02-14  
Fecha de actualizacion: 2026-02-17

> Este documento explica el **estado y el diseño elegido**, pero **no es fuente de verdad**.  
> La fuente de verdad es: configuración real en Chatwoot/VPS/mailbox + logs + pruebas E2E.

## 1) Objetivo

- Recibir consultas desde la web y gestionarlas en Chatwoot como **conversaciones email-native**.
- Poder **responder desde Chatwoot como si fuera un mail** (reply) y que el cliente reciba y pueda contestar.

## 2) Política de correos (decisión vigente)

- `chatwoot@datamaq.com.ar` → **interno**
  - invitaciones a agentes, reset password, notificaciones del sistema Chatwoot.
- `info@datamaq.com.ar` → **público**
  - figura en la web
  - identidad de respuesta a consultas
  - inbox email público en Chatwoot

## 3) Inboxes en Chatwoot (mapa operativo)

> Completar IDs reales una vez confirmados en UI/DB.

- Inbox Email público: **info@datamaq.com.ar**
  - Tipo: Email (IMAP + SMTP)
  - Identificador: `INBOX_EMAIL_PUBLIC_ID = <pending>`
- Inbox(s) legacy (si existe):
  - Inbox API “Formulario contacto”
  - Identificador: `INBOX_API_LEGACY_ID = <pending>`

## 4) Dos formularios, dos intenciones

1) **Contacto (lead / ingreso de contacto)**
   - UX: captar datos y habilitar seguimiento comercial
   - Destino: Inbox Email público (info@) con subject “Contacto web”

2) **Enviar mail (consulta tipo email)**
   - UX: el usuario espera una respuesta por mail
   - Destino: Inbox Email público (info@) con subject “Consulta web”

## 5) Flujos posibles (y el elegido)

### 5.1) Elegido: email real vía backend (SMTP simple)
**Flujo:**
Web (Vue) → Backend (FastAPI) → SMTP → mailbox `info@datamaq.com.ar` → Chatwoot (IMAP) → Inbox Email público

**Por qué:**
- Crea un email real con headers (`Message-ID`) y threading natural.
- Evita depender de “conversaciones API” que no siempre anclan bien en email.
- Permite antispam y observabilidad server-side.

### 5.2) No elegido (solo referencia): crear conversación por API en Inbox Email
Se evita porque puede generar conversaciones sin ancla email real (riesgo de replies inconsistentes y errores tipo `message_id` faltante).

## 6) Contrato del backend (FastAPI)

### 6.1) Endpoints
- `POST /contact`
- `POST /mail`

### 6.2) Payload esperado (mínimo)
```json
{
  "name": "string",
  "email": "string",
  "message": "string",
  "meta": {
    "page_location": "string",
    "traffic_source": "string",
    "user_agent": "string",
    "created_at": "string"
  },
  "attribution": {
    "utmSource?": "string",
    "gclid?": "string"
  }
}
```

### 6.3) Reglas SMTP (mínimas)
- `From: info@datamaq.com.ar`
- `To: info@datamaq.com.ar` (o alias monitoreado por el inbox)
- `Reply-To: <email_del_cliente>`
- Subject con convención:
  - `[WEB][CONTACT] <request_id> <page_or_service>`
  - `[WEB][MAIL] <request_id> <page_or_service>`

### 6.4) Anti-spam (mínimo recomendado)
- rate-limit por IP
- honeypot field (si se implementa en frontend)
- logging con `request_id`

## 7) Configuración de frontend (Vue)

### 7.1) Estado legacy (hoy)
- `VITE_INQUIRY_API_URL=https://chatwoot.datamaq.com.ar/public/api/v1/inboxes/{INBOX_ID}/contacts`

### 7.2) Target (backend-first)
- `VITE_CONTACT_API_URL=https://api.datamaq.com.ar/contact`
- `VITE_MAIL_API_URL=https://api.datamaq.com.ar/mail`

### 7.3) Cambio solicitado de env vars (transición)
Si se necesita una transición corta manteniendo Chatwoot Public API (no recomendado a largo plazo):
- `VITE_INBOX_ID={INBOX_ID}`
- `VITE_CHATWOOT_BASE_URL=https://chatwoot.datamaq.com.ar`
Y construir la URL en runtime:
`{BASE_URL}/public/api/v1/inboxes/{VITE_INBOX_ID}/contacts`

**Nota:** El objetivo final es que el cliente NO conozca Inbox IDs.

## 8) “Forward to Email” (qué significa)

En la UI de Chatwoot Email Inbox, “Forward to Email” es una **dirección puente para entrada**:
- Sirve para reenviar correos que llegan a otra casilla hacia Chatwoot.
- Es inbound-only (no arregla SMTP saliente).
- En self-hosted, solo tiene sentido si está configurado el dominio inbound de Chatwoot; si no, usar IMAP.

## 9) Runbook mínimo de verificación (DoD)

1) Enviar formulario desde la web → conversación aparece en Inbox Email público.
2) Reply desde Chatwoot → el contacto recibe el mail (SMTP OK).
3) El contacto responde → el reply vuelve a Chatwoot en el mismo hilo.
4) Evidencias a guardar:
   - Captura del hilo en Chatwoot
   - Email recibido por el contacto
   - Logs relevantes del contenedor web/sidekiq (si aplica)

## 10) Riesgos conocidos
- Sin antispam/rate-limit: inbox se llena de spam.
- Si SMTP Chatwoot falla: no se cierra el objetivo “responder como mail”.
