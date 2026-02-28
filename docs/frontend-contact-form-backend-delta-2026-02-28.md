# Delta Frontend -> Backend para nuevo formulario de contacto

Fecha: 2026-02-28
Emisor: equipo frontend
Destinatario: equipo backend Laravel

## Resumen

Frontend ya fue actualizado para que el formulario principal de `contact` deje de ser solo `email + mensaje` y pase a capturar:

- `firstName`
- `lastName`
- `company`
- `email`
- `phone`
- `geographicLocation`
- `comment`

La regla de validacion en frontend ahora es:

- en canal `contact`: `email` o `phone` son obligatorios, al menos uno de los dos
- en canal `mail`: `email` sigue siendo obligatorio y `comment` mantiene validacion minima para correo

## Alcance del cambio en frontend

Este cambio ya esta aplicado en frontend para:

- formulario UI
- validacion de campos
- modelado interno
- mapping de payload a backend
- tests unitarios

No se movio todavia el formulario fuera del Home. Ese cambio queda fuera de este delta.

## Payload que frontend envia hoy a Laravel

El frontend mantiene compatibilidad parcial con el contrato legacy y hoy envia a `POST /v1/contact` este shape:

```json
{
  "name": "Juan Perez",
  "email": "juan@example.com",
  "message": "Necesito una propuesta para mantenimiento.",
  "custom_attributes": {
    "first_name": "Juan",
    "last_name": "Perez",
    "company": "ACME",
    "phone": "+54 11 5555 4444",
    "geographic_location": "Escobar",
    "comment": "Necesito una propuesta para mantenimiento.",
    "message": "Necesito una propuesta para mantenimiento."
  },
  "meta": {
    "page_location": "https://www.datamaq.com.ar/contacto",
    "traffic_source": "organic",
    "user_agent": "Mozilla/5.0 ...",
    "created_at": "2026-02-28T13:00:00.000Z"
  },
  "attribution": {
    "utm_source": "google"
  }
}
```

Observaciones:

- `name` sigue saliendo para no romper el contrato legacy.
- `message` sigue saliendo como alias legacy del nuevo campo visual `comment`.
- `email` ahora puede no venir si el usuario cargo solo telefono.
- `phone`, `company`, `first_name`, `last_name` y `geographic_location` hoy viajan en `custom_attributes`.
- frontend no envia `phone` como campo top-level para no introducir una ruptura innecesaria del request shape legacy.

## Cambios necesarios en Laravel

### 1. Aceptar contacto con `email` o `phone`

Laravel hoy debe dejar de asumir que `email` siempre viene presente en `POST /v1/contact`.

Nuevo criterio esperado:

- request valido si viene `email` valido
- request valido si viene `phone` valido
- request valido si vienen ambos
- request invalido si faltan ambos

### 2. Leer `phone` desde `custom_attributes.phone`

Como frontend mantiene el top-level lo mas parecido posible al contrato legacy, el telefono hoy viaja en:

- `custom_attributes.phone`

Backend deberia:

- leer ese valor
- validarlo
- usarlo para la logica de contacto/Chatwoot cuando `email` no venga

### 3. Dejar de exigir `message` como obligatorio si negocio realmente acepta comentario vacio

El formulario frontend nuevo no obliga `comment` en el canal `contact`.

Si backend quiere acompañar exactamente la UX nueva, Laravel deberia aceptar:

- `message` vacio o ausente en `contact`

Si negocio decide que el comentario siga siendo obligatorio, necesitamos alinear esa regla y frontend la volveria a endurecer.

### 4. Persistir y mapear los nuevos datos a Chatwoot

Laravel deberia tomar estos campos nuevos desde `custom_attributes`:

- `first_name`
- `last_name`
- `company`
- `phone`
- `geographic_location`
- `comment`

Recomendacion de uso:

- `name`: seguir armando nombre visible completo
- `email`: usarlo si viene
- `phone_number`: usar `custom_attributes.phone` si Chatwoot/implementacion lo soporta
- `additional_attributes`: conservar el resto de atributos operativos

### 5. Validacion backend alineada con frontend

Laravel deberia devolver `422` con shape legacy ya existente cuando ocurra cualquiera de estos casos:

- faltan `email` y `phone`
- `email` invalido
- `phone` invalido
- payload excede limites de longitud

Shape esperado:

```json
{
  "status": "error",
  "error_code": "VALIDATION_ERROR",
  "detail": "Ingresa e-mail o telefono.",
  "request_id": "req-..."
}
```

## Cambios recomendados pero no bloqueantes

### 1. Enriquecer `POST /v1/contact` con campos top-level opcionales

No es obligatorio, pero simplificaria el mapping futuro si Laravel acepta tambien:

- `phone`
- `company`
- `first_name`
- `last_name`
- `geographic_location`

Hoy frontend no depende de eso.

### 2. Enriquecer `/v1/content`

Frontend ya tiene fallback local para labels nuevos, asi que no bloquea.

Si backend quiere sincronizar contenido remoto con el nuevo formulario, el bloque `contact.labels` podria empezar a incluir:

- `firstName`
- `lastName`
- `company`
- `email`
- `phone`
- `geographicLocation`
- `comment`

Se mantiene compatible si tambien conservan `message`.

## Criterios de aceptacion para backend

1. `POST /v1/contact` acepta submit con solo telefono valido.
2. `POST /v1/contact` acepta submit con solo email valido.
3. `POST /v1/contact` rechaza submit sin email ni telefono con `422`.
4. `POST /v1/contact` rechaza telefono invalido con `422`.
5. El contrato de respuesta observable para frontend sigue igual:
   - `202` en success
   - `request_id`
   - `error_code`
   - `detail`
6. La integracion Laravel -> Chatwoot no pierde `phone`, `company`, `location` ni `comment`.

## Nota de compatibilidad

Frontend ya compila, testea y construye con este cambio.

Hasta que backend implemente este delta, el caso mas sensible es:

- usuario completa solo `phone` sin `email`

Ese caso ya es valido en frontend y puede ser rechazado por Laravel si el backend todavia exige `email`.
