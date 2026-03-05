# Backend Content, Brand And SEO Contract

Estado: contrato objetivo decidido
Fecha: 2026-03-01
Objetivo: definir un contrato backend separando `content`, `brand/config` y `seo` usando campos ya existentes en el frontend

## Decision tomada

Separar el dominio en 3 payloads logicos:

1. `content`
2. `brand`
3. `seo`

Y dejar fuera de backend los mensajes tecnicos de resiliencia del frontend:

4. `frontend operational fallback`

Motivo:

- hoy el repo ya mezcla estas responsabilidades en distintos lugares
- el `AppContentSchema` cubre contenido editorial y de UI, pero no toda la configuracion de marca ni SEO
- `runtimeProfiles.json` hoy funciona como contenedor mixto de config tecnica, marca y SEO

## Decision de endpoints

### Contrato objetivo unico

- `GET /v1/site`

Body:

```json
{
  "status": "ok",
  "request_id": "req_123",
  "brand_id": "datamaq",
  "version": "v1",
  "content_revision": "sha256-hex",
  "data": {
    "content": {},
    "brand": {},
    "seo": {}
  }
}
```

Motivos:

- un solo roundtrip
- una sola revision de contenido
- mas facil mantener consistencia entre landing, marca y SEO

Restriccion decidida:

- no duplicar contratos
- no mantener compatibilidad temporal con `GET /v1/content`, `GET /v1/brand` o `GET /v1/seo`
- no agregar adaptadores de transicion para el contrato viejo

## 1. Content

Este bloque debe mapear 1:1 con el schema ya existente del frontend.

Referencia: [contentSchema.ts](/C:/AppServ/www/plantilla-www/src/domain/schemas/contentSchema.ts#L1)

### Payload canonico

```json
{
  "hero": {
    "badge": "Servicio tecnico DataMaq",
    "title": "Diagnostico electrico para planta industrial",
    "subtitle": "Medicion, instalacion y soporte tecnico orientado a operacion.",
    "responseNote": "Base operativa: Garin (GBA Norte).",
    "primaryCta": {
      "label": "Contactar",
      "href": "https://wa.me/5491156297160",
      "action": "whatsapp"
    },
    "secondaryCta": {
      "label": "Ver servicios",
      "href": "#servicios",
      "action": "services"
    },
    "benefits": [
      {
        "title": "Respuesta rapida",
        "text": "Coordinacion tecnica y comercial segun disponibilidad.",
        "variant": "primary"
      }
    ],
    "image": {
      "src": "/media/hero-energy.svg",
      "alt": "Energia y tablero industrial",
      "width": 900,
      "height": 700
    }
  },
  "services": {
    "title": "Servicios",
    "cards": []
  },
  "about": {
    "title": "Sobre DataMaq",
    "paragraphs": [],
    "image": {
      "src": "/media/tecnico-a-cargo.webp",
      "alt": "Tecnico a cargo",
      "width": 700,
      "height": 933
    }
  },
  "profile": {
    "title": "Perfil",
    "bullets": []
  },
  "navbar": {
    "brand": "DataMaq",
    "brandAriaLabel": "DataMaq, inicio",
    "links": [],
    "contactLabel": "Contactar"
  },
  "footer": {
    "note": "DataMaq | Garin (GBA Norte)"
  },
  "legal": {
    "text": "Texto legal breve."
  },
  "contact": {
    "title": "Contacto",
    "subtitle": "Dejanos tus datos y te contactamos.",
    "labels": {
      "firstName": "Nombre",
      "lastName": "Apellido",
      "company": "Empresa",
      "email": "E-mail",
      "phone": "Nro telefono",
      "geographicLocation": "Ubicacion geografica",
      "comment": "Comentario",
      "message": "Comentario"
    },
    "submitLabel": "Enviar",
    "checkingMessage": "Verificando backend...",
    "unavailableMessage": "Servicio temporalmente no disponible.",
    "successMessage": "Mensaje enviado. Gracias por contactarte.",
    "errorMessage": "No se pudo enviar. Intentalo nuevamente.",
    "unexpectedErrorMessage": "Ocurrio un error inesperado."
  },
  "consent": {
    "title": "Privacidad",
    "description": "Configuracion de consentimiento.",
    "acceptLabel": "Aceptar",
    "rejectLabel": "Rechazar"
  },
  "decisionFlow": {
    "processTitle": "Como trabajamos",
    "processStepPrefixLabel": "Paso",
    "pricingTitle": "Tarifa base y alcance",
    "pricingSummaryFallback": "Resumen comercial.",
    "pricingIncludesTitle": "Incluye",
    "pricingIncludes": [],
    "pricingExcludesTitle": "No incluye",
    "pricingExcludes": [],
    "pricingVariablesTitle": "Puede variar por",
    "pricingVariables": [],
    "coverageTitle": "Cobertura y tiempos",
    "coverageAreasTitle": "Zona",
    "coverageAreas": [],
    "responseTimesTitle": "Tiempo de respuesta",
    "responseTimes": [],
    "whatsappLabel": "Pedir coordinacion por WhatsApp",
    "contactFormLabel": "Ir al formulario de contacto",
    "faqTitle": "Preguntas frecuentes",
    "processSteps": [],
    "faqItems": []
  },
  "thanks": {
    "badge": "Formulario enviado",
    "title": "Gracias",
    "subtitle": "Recibimos tu consulta.",
    "whatsappButtonLabel": "Escribir por WhatsApp",
    "goHomeButtonLabel": "Volver al inicio"
  }
}
```

### Observaciones

- Este bloque ya existe tipado en frontend.
- Es el candidato mas obvio para migracion backend inmediata.
- Los strings tecnicos de carga o degradacion no deberian formar parte de este contrato.
- `ContactPage.vue` tambien debe quedar gobernada por este bloque, sin copy funcional local paralelo.

## 2. Brand

Este bloque concentra identidad comercial y configuracion visible de marca que hoy esta repartida entre `runtimeProfiles.json`, componentes y contenido.

### Campos propuestos

```json
{
  "brandId": "datamaq",
  "brandName": "DataMaq",
  "brandAriaLabel": "DataMaq, inicio",
  "baseOperativa": "Garin (GBA Norte)",
  "contactEmail": "info@datamaq.com.ar",
  "contactFormActive": true,
  "emailFormActive": true,
  "whatsappUrl": "https://wa.me/5491156297160",
  "whatsappQr": {
    "phoneE164": "5491156297160",
    "message": "Hola, te contacto por la tarjeta de DataMaq. Podemos coordinar?",
    "sourceTag": "qr_card"
  },
  "technician": {
    "name": "Agustin Bustos",
    "role": "Tecnico a cargo",
    "photo": {
      "src": "/media/tecnico-a-cargo.webp",
      "alt": "Foto del tecnico a cargo",
      "width": 100,
      "height": 100
    },
    "whatsappLabel": "Coordinar por WhatsApp",
    "unavailableLabel": "Contacto no disponible"
  },
  "equipmentNames": {
    "medidorNombre": "Powermeter",
    "automateNombre": "Automate"
  }
}
```

### Campos con evidencia directa en repo

- `brandId`
- `brandName`
- `brandAriaLabel`
- `baseOperativa`
- `contactEmail`
- `contactFormActive`
- `emailFormActive`
- `whatsappUrl`
- `whatsappQrMessage`
- `whatsappQrPhoneE164`
- `whatsappQrSourceTag`
- nombres comerciales de equipos

Referencias:

- [runtimeProfiles.json](/C:/AppServ/www/plantilla-www/src/infrastructure/content/runtimeProfiles.json#L2)
- [Config.ts](/C:/AppServ/www/plantilla-www/src/application/ports/Config.ts#L1)
- [TecnicoACargo.vue](/C:/AppServ/www/plantilla-www/src/components/TecnicoACargo.vue#L17)

### Decision fina

Mover `TecnicoACargo` a este bloque.

Ventajas:

- saca identidad personal del componente
- permite multi-brand o multi-tenant sin forks de frontend
- evita que nombre/foto/rol queden dispersos

Desventaja:

- agrega un modelo nuevo que hoy no existe tipado de forma explicita

Resultado:

- `TecnicoACargo` deja de ser identidad embebida en componente y pasa a ser dato de `brand`

## 3. SEO

Este bloque debe reunir lo que hoy consume `defaultSeo`, `appSeo` y `jsonLd`.

Referencias:

- [Config.ts](/C:/AppServ/www/plantilla-www/src/application/ports/Config.ts#L1)
- [types.ts](/C:/AppServ/www/plantilla-www/src/domain/seo/types.ts#L1)

### Payload propuesto

```json
{
  "siteUrl": "https://www.datamaq.com.ar",
  "siteName": "DataMaq",
  "siteDescription": "Servicios industriales de medicion, instalacion y diagnostico electrico para PYMEs.",
  "siteOgImage": "https://www.datamaq.com.ar/og-default.png",
  "siteLocale": "es_AR",
  "gscVerification": null,
  "business": {
    "name": "DataMaq",
    "telephone": null,
    "email": "info@datamaq.com.ar",
    "street": null,
    "locality": null,
    "region": null,
    "postalCode": null,
    "country": "AR",
    "lat": null,
    "lng": null,
    "areaServed": []
  }
}
```

### Reglas recomendadas

- `seo` no debe duplicar `services`; el frontend ya puede derivarlos desde `content.services.cards`.
- `seo.business.name` puede venir informado por backend aunque el frontend use fallback a `siteName`.
- `siteName` y `brandName` pueden coincidir, pero conceptualmente no son lo mismo.

### Diferencia recomendada entre `brand` y `seo`

- `brand.brandName`: nombre comercial visible en UI
- `seo.siteName`: nombre canonico para `<title>`, Open Graph y JSON-LD

Si hoy son iguales, backend puede emitir el mismo valor en ambos.

## 4. Frontend Operational Fallback

Esto no deberia salir del backend como fuente principal:

- `Modo desarrollo sin backend.`
- `Usando fallback frontend local.`
- mensajes minimos de indisponibilidad tecnica
- placeholders de carga

Referencias:

- [App.vue](/C:/AppServ/www/plantilla-www/src/ui/App.vue#L12)
- [landingContentBuilder.ts](/C:/AppServ/www/plantilla-www/src/infrastructure/content/landingContentBuilder.ts#L7)

### Recomendacion

- mantener estos mensajes locales
- si hace falta branding, permitir override opcional, pero nunca depender del backend para renderizarlos

## Contrato final recomendado

### Response recomendada de `GET /v1/site`

```json
{
  "status": "ok",
  "request_id": "req_123",
  "brand_id": "datamaq",
  "version": "v1",
  "content_revision": "site_rev_2026_03_01_01",
  "data": {
    "content": {
      "hero": {},
      "services": {},
      "about": {},
      "profile": {},
      "navbar": {},
      "footer": {},
      "legal": {},
      "contact": {},
      "consent": {},
      "decisionFlow": {},
      "thanks": {}
    },
    "brand": {
      "brandId": "datamaq",
      "brandName": "DataMaq",
      "brandAriaLabel": "DataMaq, inicio",
      "baseOperativa": "Garin (GBA Norte)",
      "contactEmail": "info@datamaq.com.ar",
      "contactFormActive": true,
      "emailFormActive": true,
      "whatsappUrl": "https://wa.me/5491156297160",
      "whatsappQr": {
        "phoneE164": "5491156297160",
        "message": "Hola, te contacto por la tarjeta de DataMaq. Podemos coordinar?",
        "sourceTag": "qr_card"
      },
      "technician": {
        "name": "Agustin Bustos",
        "role": "Tecnico a cargo",
        "photo": {
          "src": "/media/tecnico-a-cargo.webp",
          "alt": "Foto del tecnico a cargo"
        },
        "whatsappLabel": "Coordinar por WhatsApp",
        "unavailableLabel": "Contacto no disponible"
      },
      "equipmentNames": {
        "medidorNombre": "Powermeter",
        "automateNombre": "Automate"
      }
    },
    "seo": {
      "siteUrl": "https://www.datamaq.com.ar",
      "siteName": "DataMaq",
      "siteDescription": "Servicios industriales de medicion, instalacion y diagnostico electrico para PYMEs.",
      "siteOgImage": "https://www.datamaq.com.ar/og-default.png",
      "siteLocale": "es_AR",
      "gscVerification": null,
      "business": {
        "name": "DataMaq",
        "telephone": null,
        "email": "info@datamaq.com.ar",
        "street": null,
        "locality": null,
        "region": null,
        "postalCode": null,
        "country": "AR",
        "lat": null,
        "lng": null,
        "areaServed": []
      }
    }
  }
}
```

## Estrategia de adopcion en frontend

Decision:

1. el frontend migra directo a `GET /v1/site`
2. se elimina dependencia funcional del contrato remoto anterior
3. `runtimeProfiles.json` queda solo como fallback local de desarrollo/e2e y para bootstrap tecnico mientras exista esa necesidad
4. no se implementa compatibilidad dual ni capa de adaptacion transitoria

## Que no recomiendo hacer

- no mezclar `brand` dentro de `content.hero` o `content.navbar` mas de lo necesario
- no usar SEO como fuente de verdad de UI
- no mover mensajes tecnicos de resiliencia al backend
- no seguir ampliando `runtimeProfiles.json` con contenido editorial
