# Integracion con Chatwoot (solo contactos)

Este sitio envia el formulario de contacto al endpoint publico de Chatwoot para crear contactos, sin generar conversaciones.

## Endpoint del formulario

El frontend debe apuntar a:

```
https://chatwoot-production-2d73.up.railway.app/public/api/v1/inboxes/<INBOX_IDENTIFIER>/contacts
```

Ese valor se configura en `VITE_CONTACT_API_URL`.

## Como obtener `INBOX_IDENTIFIER`

1) Chatwoot → Settings → Inboxes.  
2) Elegi tu **API Channel**.  
3) Settings → Configuration → copiar `inbox_identifier`.

## Webhook del API Channel (Callback URL)

El API Channel pide una **Callback URL** que recibe eventos cuando se crean mensajes.
Si solo estas creando contactos (sin mensajes), la URL no se usa, pero debe existir y responder `200`.

Ejemplo recomendado:

```
https://chatwoot-production-2d73.up.railway.app/chatwoot/webhook
```

## Custom attributes recomendados

Para ver los datos del formulario en Chatwoot, crea **Contact Attributes** para:

- `company`
- `message`
- `page_location`
- `traffic_source`
- `user_agent`
- `created_at`
- `attribution`
- `channel`
- `section`

Ruta en Chatwoot:
Settings → Custom Attributes → Add Custom Attribute.

## Variables de entorno

Ejemplo (Cloudflare Pages / `.env`):

```
VITE_CONTACT_API_URL=https://chatwoot-production-2d73.up.railway.app/public/api/v1/inboxes/<INBOX_IDENTIFIER>/contacts
VITE_CONTACT_EMAIL=contacto@datamaq.com.ar
```

`VITE_ORIGIN_VERIFY_SECRET` solo aplica si tu backend valida un header propio. En el flujo directo a Chatwoot no es necesario.
