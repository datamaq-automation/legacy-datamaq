# Integracion con Chatwoot (solo contactos)

Este sitio envia el formulario de contacto al endpoint publico de Chatwoot para crear contactos, sin generar conversaciones.
En este flujo solo se guardan `custom_attributes` (si existen en Chatwoot). Los campos por defecto
Company/Ciudad/Pais no se actualizan con la API publica.

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


## Campos por defecto (Company/Ciudad/Pais/Bio)

Investigacion (2026-02-08):

- La API publica (API Channel) para crear contactos acepta `custom_attributes`, pero no expone `additional_attributes` en el body. Por lo tanto, si se usa el endpoint publico, los campos que dependen de `additional_attributes` no se van a persistir.
- La Account API (create/update contact) acepta `additional_attributes` y `custom_attributes`. En la documentacion indica que `custom_attributes` "debe tener una definicion valida".
- El endpoint "Show Contact" de la Account API devuelve `additional_attributes` con claves como `city`, `country` y `country_code`. Eso confirma que esos campos viven en `additional_attributes`.
- La API publica para "Get/Update contact" solo devuelve `id`, `source_id`, `name`, `email` y `pubsub_token`; no expone `additional_attributes`. Si se valida solo por la API publica, esos datos no se van a ver aunque existan.
- Para que `custom_attributes` se guarden y se vean en la UI, los atributos deben existir en Settings -> Custom Attributes y aplicarse a Contact, con un `key` exacto.

Implicancias:

- Si la app usa el endpoint publico (`/public/api/v1/inboxes/{inbox_identifier}/contacts`), los datos de Company/Ciudad/Pais no van a persistirse porque no se pueden enviar en `additional_attributes`.
- Para ver esos datos en la UI sin backend, deben existir como **Contact Attributes** y se veran en Custom Attributes.
- Si se necesita poblar Company/Ciudad/Pais en los campos por defecto, hace falta un backend propio usando la Account API (no incluido en este repo).

Referencias:

- https://developers.chatwoot.com/api-reference/contacts-api/create-a-contact
- https://developers.chatwoot.com/api-reference/contacts-api/get-a-contact
- https://developers.chatwoot.com/api-reference/contacts-api/update-a-contact
- https://developers.chatwoot.com/api-reference/contacts/create-contact
- https://developers.chatwoot.com/api-reference/contacts/show-contact
- https://www.chatwoot.com/hc/user-guide/articles/1677502327-how-to-create-and-use-custom-attributes

## Backend (opcional, no incluido)

Si se necesita completar Company/Ciudad/Pais en los campos por defecto, hace falta un backend que use la
Account API. Este repo no incluye backend en la version actual.

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
VITE_CHATWOOT_BASE_URL=https://chatwoot-production-2d73.up.railway.app
VITE_CHATWOOT_WEBSITE_TOKEN=<WEBSITE_TOKEN>
```

`VITE_ORIGIN_VERIFY_SECRET` solo aplica si tu backend valida un header propio. En el flujo directo a Chatwoot no es necesario.

## Widget web (Chatwoot)

- Configura `VITE_CHATWOOT_BASE_URL` y `VITE_CHATWOOT_WEBSITE_TOKEN` (o los mismos campos en `publicConfig`).
- Cuando el widget esta configurado, los CTAs que antes abrían WhatsApp abren el widget.
- El ícono flotante de WhatsApp fue removido; el canal principal pasa a ser el widget.
