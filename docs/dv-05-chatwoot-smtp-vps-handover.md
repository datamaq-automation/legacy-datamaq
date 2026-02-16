# DV-05 - Handover tecnico SMTP Chatwoot (VPS)

Fecha: 2026-02-16  
Autor: Codex CLI (repo frontend)  
Destinatario: Codex CLI con acceso al VPS Chatwoot

## 1) Resumen ejecutivo
- Problema reportado: Chatwoot recibe correos (IMAP OK) pero no envia correos (SMTP FAIL).
- Sintomas observados por negocio:
  - Al responder desde Chatwoot, el destinatario no recibe email.
  - Al crear agentes nuevos, no llega email de confirmacion/invitacion.
  - Error en runtime: `undefined method 'message_id' for nil` (posible efecto secundario cuando falla pipeline de email o cuando el hilo no tiene metadata de email valida).

## 2) Certezas actuales
- No hay backend propio para el formulario; la operacion depende de Chatwoot.
- El inbox de email existe y tiene IMAP funcionando (recepcion OK).
- El bloqueo principal actual es SMTP saliente en Chatwoot (configuracion o conectividad).

## 3) Objetivo operativo para el VPS
Dejar SMTP saliente en estado operativo y verificable:
1. Guardar SMTP settings sin error en Chatwoot.
2. Enviar email de prueba desde Chatwoot con entrega confirmada.
3. Confirmar envio de invitacion de agente.
4. Confirmar reply desde conversacion email con entrega al cliente.

## 4) Configuracion recomendada inicial (baseline)
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

## 5) Runbook de diagnostico en VPS

### 5.1 Identificar stack y logs activos
Ejecutar segun despliegue:

```bash
# Docker compose
docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}'
docker compose ps

# Si usa systemd/servicios
systemctl status chatwoot --no-pager
```

### 5.2 Logs de error SMTP al momento de guardar settings o enviar
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

### 5.3 Verificar conectividad de red hacia SMTP provider
```bash
# Probar puerto 587
openssl s_client -starttls smtp -connect <SMTP_HOST>:587 -servername <SMTP_HOST> -brief

# Probar puerto 465
openssl s_client -connect <SMTP_HOST>:465 -servername <SMTP_HOST> -brief
```

Resultado esperado:
- handshake TLS exitoso, sin errores de certificado graves.
- si falla handshake, hay problema de red/cert/proveedor fuera de Chatwoot UI.

### 5.4 Verificar credenciales SMTP fuera de Chatwoot (prueba controlada)
Si hay `swaks` en VPS:
```bash
swaks --server <SMTP_HOST> --port 587 --tls --auth LOGIN \
  --auth-user "info@datamaq.com.ar" --auth-password "<PASSWORD>" \
  --from "info@datamaq.com.ar" --to "destino@ejemplo.com"
```

Si `swaks` no esta disponible, usar `openssl` + prueba manual AUTH o instalar temporalmente.

Objetivo:
- aislar si falla por credenciales/proveedor o por Chatwoot.

### 5.5 Verificar variables y config efectiva de Chatwoot
```bash
# Inspeccionar env del contenedor web
docker exec -it <chatwoot-web-container> printenv | grep -Ei "SMTP|MAILER|RAILS_ENV"
```

Revisar colisiones:
- valores SMTP en `.env`/docker compose que pisen lo configurado en UI.
- reinicio pendiente de servicios despues de cambios de env.

### 5.6 Validar Sidekiq/cola de mailers
```bash
docker logs <chatwoot-sidekiq-container> --since 30m | grep -Ei "mail|smtp|retry|dead|failed|actionmailer"
```

Si hay jobs en retry/dead relacionados a mailers:
- corregir causa raiz y reintentar envio.

## 6) Matriz de decision rapida

1. **Falla guardar SMTP en UI**  
   - Revisar logs web en el mismo timestamp.  
   - Si error TLS/cert -> ajustar encryption/puerto/verify mode.  
   - Si error auth -> validar usuario/password/app-password.

2. **Guarda SMTP pero no envia**  
   - Revisar sidekiq/logs de mailers.  
   - Verificar SPF/DKIM/DMARC y reputacion/sandbox del proveedor.

3. **Solo falla reply de conversaciones especificas**  
   - Confirmar que la conversacion sea realmente de origen Email channel.  
   - El error `message_id nil` puede indicar metadata de email faltante en hilo no-email.

## 7) Criterio de salida (Definition of Done)
- [ ] SMTP settings guardan en Chatwoot sin error.
- [ ] Test email enviado y recibido.
- [ ] Invitacion a nuevo agente enviada y recibida.
- [ ] Reply desde ticket/email conversation entregado al destinatario.
- [ ] Logs limpios sin errores SMTP en ventana de prueba.
- [ ] Evidencia archivada (comandos + timestamp + resultado).

## 8) Evidencia minima a devolver por el Codex del VPS
- Captura textual de:
  - valores SMTP finales (sin exponer password),
  - resultado de `openssl`/`swaks`,
  - fragmento de logs web + sidekiq de un envio exitoso,
  - prueba de invitacion de agente recibida.

## 9) Riesgos y notas
- `OpenSSL Verify Mode = none` solo para diagnostico puntual, no produccion.
- `no-reply@` no es recomendado para conversaciones bidireccionales.
- Si el proveedor exige OAuth2, `login/plain` no funcionara hasta completar OAuth.
