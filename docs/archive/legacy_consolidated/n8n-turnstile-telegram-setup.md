# n8n: Turnstile + Telegram (Produccion)

Objetivo: validar anti-bot antes de enviar leads a Telegram.

## Frontend (ya implementado en este repo)

- Env var requerida: `VITE_TURNSTILE_SITE_KEY`
- El formulario envia `captcha_token` dentro del payload JSON hacia `VITE_INQUIRY_API_URL`.

## Workflow n8n recomendado

1. `Webhook` (POST, Production URL publicada).
2. `HTTP Request` (Cloudflare Turnstile siteverify):
   - URL: `https://challenges.cloudflare.com/turnstile/v0/siteverify`
   - Method: `POST`
   - Body tipo `application/x-www-form-urlencoded`:
     - `secret=<TURNSTILE_SECRET_KEY>`
     - `response={{ $json.body.captcha_token || $json.captcha_token }}`
     - `remoteip={{ $json.headers["x-forwarded-for"] || "" }}`
3. `IF`:
   - Condicion: `{{$json.success === true}}`
4. Rama `true`: enviar mensaje por nodo `Telegram`.
5. Rama `false`: responder 400/401 con mensaje `captcha invalid`.

## Reglas operativas

- No enviar a Telegram si Turnstile falla.
- No loguear `secret` ni token completo en nodos de debug.
- Configurar `Webhook -> Respond` en modo inmediato o respuesta corta para evitar latencia alta.
