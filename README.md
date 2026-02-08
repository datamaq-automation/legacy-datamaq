# datamaq-www

Landing corporativa construida con **Vue 3** y **Vite** para promocionar los servicios industriales de datamaq.

## CaracterÃ­sticas principales
- SPA liviana optimizada para CTAs de WhatsApp, chat y correo electrÃ³nico.
- IntegraciÃ³n con API externa para registrar contactos de WhatsApp y formularios.
- InstrumentaciÃ³n analÃ­tica con **GA4** y **Microsoft Clarity**.
- Componentes accesibles y reutilizables que siguen la guÃ­a de diseÃ±o definida en `docs/`.
- Banner de consentimiento que bloquea GA4/Clarity hasta que la persona usuaria otorgue permiso.
- Monitoreo de disponibilidad del backend de contacto que deshabilita el formulario y los eventos silenciosos cuando el servicio no responde.

## Requisitos previos
- **Node.js** `>= 20.19.0` (ver `.nvmrc` si corresponde).
- **npm** `>= 8`.
- Acceso a los endpoints HTTPS provistos por el backend de datamaq para recibir formularios/contactos.

## ConfiguraciÃ³n de entorno
1. CopiÃ¡ `.env.example` a `.env` y completÃ¡ los valores reales para cada entorno (desarrollo, staging, producciÃ³n).
2. VerificÃ¡ que `VITE_CONTACT_API_URL` apunte a un endpoint **HTTPS** vÃ¡lido. Para completar Company/Ciudad/Pais en Chatwoot, usar el backend en `backend/` y configurar `/v1/contact`.
3. AjustÃ¡ los IDs de analÃ­tica (`VITE_CLARITY_PROJECT_ID`, `VITE_GA4_ID`) segÃºn la propiedad correspondiente.
4. Para el flujo de contactos con Chatwoot, revisÃ¡ `docs/chatwoot-contact.md`.

## InstalaciÃ³n y scripts
```sh
npm install       # instala dependencias
npm run dev       # levanta el servidor de desarrollo (hot reload)
npm run build     # compila los assets para producciÃ³n en ./dist
npm run preview   # sirve el build localmente para validaciones finales
npm run test:a11y # ejecuta la auditorÃ­a heurÃ­stica de accesibilidad y genera el build si no existe
```

## AnalÃ­tica y eventos
- Los eventos de compromiso se envÃ­an vÃ­a `gtag` y `clarity`. El contrato de datos se documenta en
  `src/application/services/analyticsTracker.ts` y en las declaraciones globales de `src/env.d.ts`.
- Para evitar duplicidades, se deduplican los eventos en una ventana de 2 segundos antes de propagarlos a cada destino.
- GA4 y Clarity solo se inicializan cuando el banner de consentimiento registra una aceptaciÃ³n explÃ­cita.
- RevisÃ¡ `docs/srs-datamaq-www.md` y `docs/improvement-options-2025-02-18.md` para el detalle de mÃ©tricas,
  supuestos y decisiones abiertas.

## Accesibilidad
- EjecutÃ¡ `npm run test:a11y` para analizar los templates `.vue` y asegurar nombres accesibles en botones/enlaces, ademÃ¡s de
  etiquetas `alt` en imÃ¡genes y encabezados en secciones clave.
- CorregÃ­ cualquier hallazgo reportado antes de desplegar cambios visuales.

## Despliegue sugerido
1. Ejecutar `npm run build` y publicar el contenido de `dist/` en el hosting estÃ¡tico elegido (Cloudflare Pages, Netlify, etc.).
2. Configurar las variables de entorno en el servicio de hosting replicando los valores de `.env`.
3. Validar que las solicitudes al endpoint `VITE_CONTACT_API_URL` respondan con cÃ³digo `2xx` sobre HTTPS. El monitoreo automÃ¡tico mostrarÃ¡ mensajes de indisponibilidad si falla.
4. Verificar en QA que los eventos de WhatsApp, chat y correo se registran una sola vez en GA4 y Clarity.

## Recursos adicionales
- DocumentaciÃ³n funcional y no funcional: `docs/srs-datamaq-www.md`.
- AuditorÃ­a y alternativas de mejora: `docs/audit-2025-02-17.md` y `docs/improvement-options-2025-02-18.md`.
- GuÃ­a rÃ¡pida de componentes: revisar `src/components/` y comentarios en lÃ­nea.

Â¿Dudas o sugerencias? Escribinos a [contacto@datamaq.com.ar](mailto:contacto@datamaq.com.ar).
