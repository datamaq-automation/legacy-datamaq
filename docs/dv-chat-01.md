# DV-02 - Contrato de consultas (frontend -> backend)

Fecha de definicion inicial: 2026-02-14  
Fecha de actualizacion: 2026-02-16

## 1) Decision de arquitectura vigente
- Frontend: sitio estatico en Ferozo.
- Integracion de consultas: `frontend -> backend de contacto`.
- Integracion Chatwoot/email: responsabilidad del backend (server-to-server).

Decision tomada:
- Se reemplaza el contrato primario `frontend -> Chatwoot Public API` por `frontend -> backend`.
- `VITE_INQUIRY_API_URL` representa un endpoint backend estable (`/contact` o equivalente).
- El navegador no maneja `inbox_identifier`, `api_access_token`, ni secretos de correo.

## 2) Contrato frontend -> backend
Endpoint base configurable:
- `POST {VITE_INQUIRY_API_URL}`
- Ejemplo local: `http://127.0.0.1:4173/api/contact`
- Ejemplo productivo: `https://api.datamaq.com.ar/contact`

Payload esperado desde frontend (resumen):
- `name`
- `email`
- `message`
- `custom_attributes`
- `meta` (`page_location`, `traffic_source`, `user_agent`, `created_at`)

Headers:
- `Content-Type: application/json`

## 2.1) Compatibilidad operativa
- El frontend queda acoplado solo al contrato backend para evitar dependencia de tipos de inbox de Chatwoot en navegador.
- Cualquier compatibilidad con Chatwoot Public API se resuelve exclusivamente dentro del backend.

## 3) Seguridad y limites
- El frontend no expone secretos (`api_access_token`, SMTP, HMAC keys).
- La autenticacion sensible y la logica de entrega (Email inbox, callbacks, retries) se resuelven fuera del navegador.
- Si se requiere `secure mode` o firma (`identifier_hash`), debe implementarse en backend.

## 4) Criterio de cierre DV-02
- [x] Contrato frontend desacoplado de Chatwoot en configuracion publica.
- [x] Variables de entorno del repo alineadas a endpoint backend.
- [ ] Backend operativo disponible y conectado al inbox/canal definitivo.
- [ ] Validacion E2E real en entorno productivo con entrega/respuesta por email confirmada.

## 5) Checklist operativo
1. Definir `VITE_INQUIRY_API_URL` productivo del backend en `.env.local`.
2. Ejecutar smoke tecnico:
```bash
npm run smoke:contact:backend -- https://api.tudominio.com/contact
```
3. Validar en Chatwoot:
   - alta de consulta en el inbox esperado.
   - reply del agente entregado al email del contacto.
4. Registrar evidencia en `docs/todo.md`.

## 6) Bloqueos C2 vigentes
- Falta endpoint backend productivo publicado para este contrato.
- Falta configuracion externa final de entrega/respuesta por email en Chatwoot/canal elegido.

## 7) Fuentes oficiales
- Chatwoot API Introduction:
  - https://developers.chatwoot.com/api-reference/introduction
- Chatwoot Client API - Create contact:
  - https://developers.chatwoot.com/api-reference/contacts-api/create-a-contact
- Chatwoot Client API - Create conversation:
  - https://developers.chatwoot.com/api-reference/conversations-api/create-a-conversation
- Chatwoot Client API - Create message:
  - https://developers.chatwoot.com/api-reference/messages-api/create-a-message
- Chatwoot Application API - Create Contact Inbox:
  - https://developers.chatwoot.com/api-reference/contacts/create-contact-inbox
- Chatwoot Application API - Create New Conversation:
  - https://developers.chatwoot.com/api-reference/conversations/create-new-conversation
