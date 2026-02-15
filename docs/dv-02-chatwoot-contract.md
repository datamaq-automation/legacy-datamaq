# DV-02 - Contrato de contacto con Chatwoot Public API

Fecha de definicion inicial: 2026-02-14  
Fecha de actualizacion: 2026-02-15

## 1) Decision de arquitectura vigente
- Frontend: sitio estatico en Ferozo.
- Integracion de contacto: `frontend -> Chatwoot Public API`.

Decision tomada:
- Se adopta integracion directa con rutas publicas de Chatwoot (`/public/api/v1/...`), sin secreto en frontend.
- `VITE_CONTACT_API_URL` queda como endpoint de create-contact por inbox.

## 2) Contrato frontend -> Chatwoot
Endpoint base configurable:
- `POST {VITE_CONTACT_API_URL}`
- Formato obligatorio:
  - `https://<chatwoot-host>/public/api/v1/inboxes/{inbox_identifier}/contacts`

Flujo implementado en frontend:
1. Crear contacto:
   - `POST /public/api/v1/inboxes/{inbox_identifier}/contacts`
2. Crear conversacion:
   - `POST /public/api/v1/inboxes/{inbox_identifier}/contacts/{contact_identifier}/conversations`
3. Crear mensaje:
   - `POST /public/api/v1/inboxes/{inbox_identifier}/contacts/{contact_identifier}/conversations/{conversation_id}/messages`

Payload resumido:
- Contacto:
  - `identifier` (email normalizado)
  - `name`
  - `email`
  - `phone_number` (si existe formato internacional valido)
  - `custom_attributes`
- Conversacion:
  - `custom_attributes`
- Mensaje:
  - `content` (resumen del formulario)

Headers:
- `Content-Type: application/json`

## 3) Seguridad y limites
- El frontend no usa `VITE_ORIGIN_VERIFY_SECRET` ni `X-Origin-Verify`.
- No se expone `api_access_token` de Chatwoot en cliente.
- Si se requiere secure mode con `identifier_hash` (HMAC), ese hash no debe calcularse en frontend.
  - Requisito externo en ese caso: firmador backend.

## 4) Criterio de cierre DV-02
- [x] Contrato sin secretos en frontend.
- [x] Flujo frontend implementado para rutas publicas de Chatwoot.
- [ ] Validacion E2E real en entorno productivo con inbox final.

## 5) Checklist operativo
1. Definir `VITE_CONTACT_API_URL` con inbox real:
   - `https://chatwoot.datamaq.com.ar/public/api/v1/inboxes/<INBOX_IDENTIFIER>/contacts`
2. Ejecutar smoke tecnico:
```bash
npm run smoke:contact:backend -- https://chatwoot.datamaq.com.ar/public/api/v1/inboxes/<INBOX_IDENTIFIER>/contacts
```
3. Confirmar en Chatwoot que se crean:
   - contacto,
   - conversacion,
   - mensaje.
4. Validar E2E funcional desde landing productiva.
5. Registrar evidencia de cierre en `docs/todo.md`.

## 6) Estado observado del endpoint previo
- `http://chatwoot.datamaq.com.ar/contact` y `https://chatwoot.datamaq.com.ar/contact` responden `404`.
- Interpretacion: `/contact` no es ruta publica nativa de Chatwoot; la ruta correcta usa `/public/api/v1/inboxes/{inbox_identifier}/contacts`.

## 7) Bloqueos C2 vigentes
- Confirmar `inbox_identifier` final publicado para produccion.
- Si se exige `identifier_hash` (secure mode), implementar firmador backend fuera de este repo.

## 8) Fuentes oficiales
- Chatwoot API Introduction:
  - https://developers.chatwoot.com/api-reference/introduction
- Chatwoot Client API - Create contact:
  - https://developers.chatwoot.com/api-reference/contacts-api/create-a-contact
- Chatwoot Client API - Create conversation:
  - https://developers.chatwoot.com/api-reference/conversations-api/create-a-conversation
- Chatwoot Client API - Create message:
  - https://developers.chatwoot.com/api-reference/messages-api/create-a-message
