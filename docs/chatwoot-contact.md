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

- `first_name`
- `last_name`
- `company`
- `city`
- `country`

Si `company` no se ve en la UI, casi siempre es porque el atributo **no fue creado** en Chatwoot. Crealo con ese mismo `key` (`company`).

El endpoint publico de Chatwoot acepta `phone_number` y `custom_attributes` en el body.

Nota: Chatwoot espera valores escalares en `custom_attributes`.
Para `phone_number` se requiere formato E.164; de lo contrario la API responde 422 (observado en integracion).

Checklist rapido si `company` no aparece:
- El atributo fue creado como **Contact Attribute** (no Conversation Attribute).
- El `key` es exactamente `company` (minusculas, sin espacios).
- El formulario envia el campo (ver logs en consola: `[contactForm] submit payload`).
- Verificar que `custom_attributes` llegue con `company` (ver logs: `[contactApiGateway] submit start`).

Si el create no persiste los atributos, el flujo reintenta con PATCH a:

```
/public/api/v1/inboxes/{inbox_identifier}/contacts/{contact_identifier}
```

El `contact_identifier` se obtiene como `source_id` en la respuesta del create.

Ruta en Chatwoot:
Settings → Custom Attributes → Add Custom Attribute.

## Variables de entorno

Ejemplo (Cloudflare Pages / `.env`):

```
VITE_CONTACT_API_URL=https://chatwoot-production-2d73.up.railway.app/public/api/v1/inboxes/<INBOX_IDENTIFIER>/contacts
VITE_CONTACT_EMAIL=contacto@datamaq.com.ar
```

`VITE_ORIGIN_VERIFY_SECRET` solo aplica si tu backend valida un header propio. En el flujo directo a Chatwoot no es necesario.
