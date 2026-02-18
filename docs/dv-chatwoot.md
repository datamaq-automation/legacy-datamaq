# DV - Chatwoot: contrato backend-only y operacion SMTP

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

### 2.1) Compatibilidad operativa
- El frontend queda acoplado solo al contrato backend para evitar dependencia de tipos de inbox de Chatwoot en navegador.
- Cualquier compatibilidad con Chatwoot Public API se resuelve exclusivamente dentro del backend.

## 3) Seguridad y limites
- El frontend no expone secretos (`api_access_token`, SMTP, HMAC keys).
- La autenticacion sensible y la logica de entrega (Email inbox, callbacks, retries) se resuelven fuera del navegador.
- Si se requiere `secure mode` o firma (`identifier_hash`), debe implementarse en backend.

## 4) Criterio de cierre
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

## 7) Resumen ejecutivo (backend-only)
- El frontend ya no debe depender del endpoint publico de Chatwoot para modelar entrega por email.
- El envio se centraliza en backend propio para garantizar vinculacion al inbox de email antes de abrir/reusar conversacion.
- El cierre completo sigue bloqueado por operacion externa (backend productivo + evidencia SMTP/SendReplyJob).

## 8) Decisiones tecnicas clave
- `B-Arquitectura`: forzar contrato backend-only en cliente para reducir acoplamiento al canal API y evitar falsos positivos de entrega email.
- `B-Deploy`: endurecer validacion de `VITE_INQUIRY_API_URL` en pipeline para fallar si no inicia con `https://`.
- `C2`: el resultado funcional final depende de despliegue y validacion fuera del repo.

## 9) Evidencia interna relevante
- Cliente desacoplado del patron Chatwoot Public API:
  - `src/infrastructure/contact/contactApiGateway.ts`
  - `src/application/contact/contactBackendStatus.ts`
  - `tests/unit/application/contactBackendStatus.test.ts`
- Validaciones locales historicas en verde:
  - `npm run lint:security` (2026-02-16 20:31 -03:00)
  - `npm run lint:test-coverage` (2026-02-16 20:34 -03:00)
  - `npm run quality:merge` (2026-02-16 20:36 -03:00)
  - `npm run lint:todo-sync:merge-ready` (2026-02-16 20:36 -03:00)
  - `npm run typecheck` (2026-02-17 00:15 -03:00)
  - `npm run quality:merge` (2026-02-17 00:20 -03:00)
  - `npm run lint:todo-sync:merge-ready` (2026-02-17 00:20 -03:00)

## 10) Proximo chequeo tecnico al destrabarse C2
- Ejecutar: `npm run smoke:contact:backend -- <url>`
- Registrar en `docs/todo.md`: request/response del smoke + referencia de trazas operativas del backend.

## 11) Handover tecnico SMTP Chatwoot (VPS)

### 11.1) Resumen ejecutivo
- Problema reportado: Chatwoot recibe correos (IMAP OK) pero no envia correos (SMTP FAIL).
- Sintomas observados por negocio:
  - Al responder desde Chatwoot, el destinatario no recibe email.
  - Al crear agentes nuevos, no llega email de confirmacion/invitacion.
  - Error en runtime: `undefined method 'message_id' for nil`.

### 11.2) Certezas actuales
- No hay backend propio para el formulario; la operacion depende de Chatwoot.
- El inbox de email existe y tiene IMAP funcionando (recepcion OK).
- El bloqueo principal actual es SMTP saliente en Chatwoot (configuracion o conectividad).

### 11.3) Objetivo operativo para el VPS
Dejar SMTP saliente en estado operativo y verificable:
1. Guardar SMTP settings sin error en Chatwoot.
2. Enviar email de prueba desde Chatwoot con entrega confirmada.
3. Confirmar envio de invitacion de agente.
4. Confirmar reply desde conversacion email con entrega al cliente.

### 11.4) Configuracion recomendada inicial (baseline)
Usar estos valores primero, salvo que el proveedor indique otra cosa:
- `Domain`: `datamaq.com.ar`
- `Encryption`: `STARTTLS`
- `Port`: `587`
- `OpenSSL Verify Mode`: `peer`
- `Authentication`: `login` (fallback: `plain`)
- `Username`: correo completo (ej. `info@datamaq.com.ar`)
- `Password`: password real/app password del mailbox

Fallback habitual:
- `Port 465` + `SSL/TLS` + `peer` + `login`

### 11.5) Runbook de diagnostico en VPS

#### 11.5.1) Identificar stack y logs activos
```bash
# Docker compose
docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}'
docker compose ps

# Si usa systemd/servicios
systemctl status chatwoot --no-pager
```

#### 11.5.2) Logs de error SMTP
```bash
# Docker (ajustar nombre contenedor web/rails/sidekiq)
docker logs <chatwoot-web-container> --since 30m | grep -Ei "smtp|mail|actionmailer|openssl|certificate|authentication|message_id|delivery"
docker logs <chatwoot-sidekiq-container> --since 30m | grep -Ei "smtp|mail|actionmailer|openssl|certificate|authentication|message_id|delivery"

# Systemd
journalctl -u chatwoot -S -30m | grep -Ei "smtp|mail|actionmailer|openssl|certificate|authentication|message_id|delivery"
```

Buscar especialmente:
- `authentication failed`
- `certificate verify failed`
- `hostname mismatch`
- `connection timeout/refused`
- `undefined method 'message_id' for nil`

#### 11.5.3) Verificar conectividad de red hacia SMTP provider
```bash
# Probar puerto 587
openssl s_client -starttls smtp -connect <SMTP_HOST>:587 -servername <SMTP_HOST> -brief

# Probar puerto 465
openssl s_client -connect <SMTP_HOST>:465 -servername <SMTP_HOST> -brief
```

Resultado esperado:
- handshake TLS exitoso, sin errores de certificado graves.
- si falla handshake, hay problema de red/cert/proveedor fuera de Chatwoot UI.

#### 11.5.4) Verificar credenciales SMTP fuera de Chatwoot (prueba controlada)
Si hay `swaks` en VPS:
```bash
swaks --server <SMTP_HOST> --port 587 --tls --auth LOGIN \
  --auth-user "info@datamaq.com.ar" --auth-password "<PASSWORD>" \
  --from "info@datamaq.com.ar" --to "destino@ejemplo.com"
```

Si `swaks` no esta disponible, usar `openssl` + prueba manual AUTH o instalar temporalmente.

Objetivo:
- aislar si falla por credenciales/proveedor o por Chatwoot.

#### 11.5.5) Verificar variables y config efectiva de Chatwoot
```bash
# Inspeccionar env del contenedor web
docker exec -it <chatwoot-web-container> printenv | grep -Ei "SMTP|MAILER|RAILS_ENV"
```

Revisar colisiones:
- valores SMTP en `.env`/docker compose que pisen lo configurado en UI.
- reinicio pendiente de servicios despues de cambios de env.

#### 11.5.6) Validar Sidekiq/cola de mailers
```bash
docker logs <chatwoot-sidekiq-container> --since 30m | grep -Ei "mail|smtp|retry|dead|failed|actionmailer"
```

Si hay jobs en retry/dead relacionados a mailers:
- corregir causa raiz y reintentar envio.

### 11.6) Matriz de decision rapida
1. Falla guardar SMTP en UI
   - Revisar logs web en el mismo timestamp.
   - Si error TLS/cert -> ajustar encryption/puerto/verify mode.
   - Si error auth -> validar usuario/password/app-password.

2. Guarda SMTP pero no envia
   - Revisar sidekiq/logs de mailers.
   - Verificar SPF/DKIM/DMARC y reputacion/sandbox del proveedor.

3. Solo falla reply de conversaciones especificas
   - Confirmar que la conversacion sea realmente de origen Email channel.
   - El error `message_id nil` puede indicar metadata de email faltante en hilo no-email.

### 11.7) Criterio de salida (Definition of Done)
- [ ] SMTP settings guardan en Chatwoot sin error.
- [ ] Test email enviado y recibido.
- [ ] Invitacion a nuevo agente enviada y recibida.
- [ ] Reply desde ticket/email conversation entregado al destinatario.
- [ ] Logs limpios sin errores SMTP en ventana de prueba.
- [ ] Evidencia archivada (comandos + timestamp + resultado).

### 11.8) Evidencia minima a devolver por el Codex del VPS
- Captura textual de:
  - valores SMTP finales (sin exponer password),
  - resultado de `openssl`/`swaks`,
  - fragmento de logs web + sidekiq de un envio exitoso,
  - prueba de invitacion de agente recibida.

### 11.9) Riesgos y notas
- `OpenSSL Verify Mode = none` solo para diagnostico puntual, no produccion.
- `no-reply@` no es recomendado para conversaciones bidireccionales.
- Si el proveedor exige OAuth2, `login/plain` no funcionara hasta completar OAuth.

## 12) Fuentes oficiales
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
