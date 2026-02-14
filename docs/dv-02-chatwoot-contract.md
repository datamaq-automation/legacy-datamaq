# DV-02 - Contrato backend de contacto con Chatwoot

Fecha de definicion: 2026-02-14

## 1) Decision de arquitectura
- Frontend: sitio estatico publicado en Ferozo (cuenta de hosting, directorio `public_html`).
- Backend: servicio propio desplegado en Docker dentro de un Cloud Server (VPS) en DonWeb Cloud IaaS.
- Integracion de contacto: `frontend -> backend propio -> Chatwoot`.

Objetivo de seguridad:
- El frontend no maneja secretos.
- Los secretos de Chatwoot viven solo en backend (variables de entorno del contenedor).

## 2) Opciones de contrato con Chatwoot evaluadas
### Opcion A: Client/Public APIs de Chatwoot
- Base: `/public/api/v1/inboxes/{inbox_identifier}/...`
- Pros:
  - Flujo simple para crear contacto/conversacion/mensaje.
  - Disenado para experiencias custom de chat.
- Contras:
  - Requiere exponer identificadores de inbox y manejar identificadores de sesion (`source_id`) del lado cliente.
  - Puede aumentar acoplamiento de frontend con modelo de Chatwoot.

### Opcion B (elegida): Application APIs de Chatwoot desde backend
- Base: `/api/v1/accounts/{account_id}/...`
- Auth: `api_access_token` en header.
- Pros:
  - Mantiene secretos fuera del navegador.
  - Permite centralizar validaciones, CORS, rate-limit y observabilidad en backend propio.
  - Menor acoplamiento del frontend a detalles de Chatwoot.
- Contras:
  - Requiere mantener un servicio backend adicional.

Decision tomada:
- Se adopta Opcion B para cerrar DV-02 y sostener el criterio de no secretos en frontend.

## 3) Contrato frontend -> backend (estable)
Endpoint:
- `POST {CONTACT_API_URL}` (configurado via `VITE_CONTACT_API_URL`).
- Referencia operativa estimativa (2026-02-14): base `https://chatwoot.datamaq.com.ar/` con endpoint tentativo `/contact` (`https://chatwoot.datamaq.com.ar/contact`).
- Estado: estimativo y sujeto a cambio hasta cerrar infraestructura en VPS.

Payload esperado (actual frontend):
```json
{
  "firstName": "string",
  "lastName": "string",
  "name": "string",
  "email": "string",
  "phoneNumber": "string|undefined",
  "city": "string|undefined",
  "country": "string|undefined",
  "company": "string|undefined",
  "custom_attributes": {},
  "meta": {
    "page_location": "string",
    "traffic_source": "string",
    "user_agent": "string",
    "created_at": "ISO-8601"
  },
  "attribution": {}
}
```

Respuesta esperada:
- `2xx`: envio aceptado.
- `4xx`: error validable de datos.
- `5xx`/timeout: indisponibilidad temporal.

## 4) Contrato backend -> Chatwoot (server-to-server)
Variables de entorno backend:
- `CHATWOOT_BASE_URL`
- `CHATWOOT_ACCOUNT_ID`
- `CHATWOOT_INBOX_ID`
- `CHATWOOT_API_ACCESS_TOKEN`

Flujo recomendado:
1. Crear/actualizar contacto en Chatwoot:
   - `POST /api/v1/accounts/{account_id}/contacts`
2. Crear conversacion:
   - `POST /api/v1/accounts/{account_id}/conversations`
   - Incluir `source_id`, `inbox_id`, `contact_id` y mensaje inicial con el resumen del formulario.
3. (Opcional) Enviar mensaje adicional:
   - `POST /api/v1/accounts/{account_id}/conversations/{conversation_id}/messages`

Headers requeridos:
- `Content-Type: application/json`
- `api_access_token: <token>`

## 5) Reglas de seguridad y operacion
- No usar `VITE_ORIGIN_VERIFY_SECRET` ni `X-Origin-Verify` en frontend.
- Restringir CORS del backend al dominio publico del frontend.
- Registrar errores de integracion con Chatwoot (codigo HTTP + motivo) sin exponer secretos.
- Aplicar timeout y reintentos controlados en llamadas salientes del backend.

## 6) Criterio de cierre DV-02
- [x] Contrato documentado con request/response sin secreto en frontend.
- [ ] Backend Docker implementado con adaptador a Chatwoot en VPS.
- [ ] Prueba E2E de formulario real -> conversacion visible en Chatwoot.

## 6.1) Checklist operativo de cierre (backend fuera de este repo)
1. Implementar endpoint backend `POST /contact` con validacion del payload esperado por frontend.
2. Configurar variables del contenedor:
   - `CHATWOOT_BASE_URL`
   - `CHATWOOT_ACCOUNT_ID`
   - `CHATWOOT_INBOX_ID`
   - `CHATWOOT_API_ACCESS_TOKEN`
3. Restringir CORS a los dominios frontend productivos (`https://www.datamaq.com.ar` y alias operativos que correspondan).
4. Definir `VITE_CONTACT_API_URL` en frontend apuntando al backend propio (no a Chatwoot).
   - Valor estimativo actual: `https://chatwoot.datamaq.com.ar/contact`.
   - Mantenerlo parametrizado porque puede variar.
5. Validar smoke tecnico del endpoint backend (desde terminal):
```bash
curl -i -X POST "https://<backend-domain>/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"Test",
    "lastName":"Datamaq",
    "name":"Test Datamaq",
    "email":"test@datamaq.com.ar",
    "country":"AR",
    "meta":{"page_location":"https://www.datamaq.com.ar","created_at":"2026-02-14T00:00:00.000Z"},
    "custom_attributes":{},
    "attribution":{}
  }'
```
6. Validar E2E funcional: envio desde formulario productivo y confirmacion de conversacion en Chatwoot.
7. Registrar evidencia (fecha, endpoint validado y resultado) para cerrar P0 en `docs/todo.md`.

## 6.2) Bloqueos de alto nivel vigentes (C)
- Este repositorio no contiene el codigo backend Docker, por lo que no puede completarse aqui la implementacion del adaptador Chatwoot.
- Informacion faltante para cierre operativo:
  - acceso al repositorio/servicio backend,
  - URL final del endpoint backend de contacto (hoy estimada como `https://chatwoot.datamaq.com.ar/contact`),
  - evidencia de pruebas E2E sobre entorno real.

## 7) Fuentes consultadas
- Chatwoot API Introduction:
  - https://developers.chatwoot.com/api-reference/introduction
- Chatwoot Client API - Create contact:
  - https://developers.chatwoot.com/api-reference/contacts-api/create-a-contact
- Chatwoot Client API - Create conversation:
  - https://developers.chatwoot.com/api-reference/conversations-api/create-a-conversation
- Chatwoot Client API - Create message:
  - https://developers.chatwoot.com/api-reference/messages-api/create-a-message
- Chatwoot Application API - Create Contact:
  - https://developers.chatwoot.com/api-reference/contacts/create-contact
- Chatwoot Application API - Create Contact Inbox:
  - https://developers.chatwoot.com/api-reference/contacts/create-contact-inbox
- Chatwoot Application API - Create New Conversation:
  - https://developers.chatwoot.com/api-reference/conversations/create-new-conversation
- DonWeb - Ferozo cuentas de hosting en Cloud Server:
  - https://soporte.donweb.com/hc/es/articles/19581975927444-Crear-y-gestionar-cuentas-de-hosting-en-Ferozo-DHM-Cloud-Server-Servidor-Dedicado
- DonWeb - FTP/public_html:
  - https://soporte.donweb.com/hc/es/articles/18928295875476--C%C3%B3mo-subir-el-sitio-por-FTP-al-Hosting
- DonWeb - Primeros pasos con Docker:
  - https://soporte.donweb.com/hc/es/articles/30870363855764--Primeros-pasos-con-Docker
