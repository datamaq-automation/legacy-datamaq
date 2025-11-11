# profebustos-www

Landing corporativa construida con **Vue 3** y **Vite** para promocionar los servicios industriales de profebustos.

## Características principales
- SPA liviana optimizada para CTAs de WhatsApp, chat y correo electrónico.
- Integración con API externa para registrar contactos de WhatsApp y formularios.
- Instrumentación analítica con **GA4**, **Google Tag Manager (dataLayer)** y **Microsoft Clarity**.
- Componentes accesibles y reutilizables que siguen la guía de diseño definida en `docs/`.
- Banner de consentimiento que bloquea GA4/Clarity hasta que la persona usuaria otorgue permiso.
- Monitoreo de disponibilidad del backend de contacto que deshabilita el formulario y los eventos silenciosos cuando el servicio no responde.

## Requisitos previos
- **Node.js** `>= 20.19.0` (ver `.nvmrc` si corresponde).
- **npm** `>= 8`.
- Acceso a los endpoints HTTPS provistos por el backend de profebustos para recibir formularios/contactos.

## Configuración de entorno
1. Copiá `.env.example` a `.env` y completá los valores reales para cada entorno (desarrollo, staging, producción).
2. Verificá que `VITE_CONTACT_API_URL` y `VITE_CHAT_URL` apunten a endpoints **HTTPS** válidos.
3. Ajustá los IDs de analítica (`VITE_CLARITY_PROJECT_ID`, `VITE_GA4_ID`) según la propiedad correspondiente.

## Instalación y scripts
```sh
npm install       # instala dependencias
npm run dev       # levanta el servidor de desarrollo (hot reload)
npm run build     # compila los assets para producción en ./dist
npm run preview   # sirve el build localmente para validaciones finales
npm run test:a11y # ejecuta la auditoría heurística de accesibilidad y genera el build si no existe
```

## Analítica y eventos
- Los eventos de compromiso se envían vía `window.dataLayer`, `gtag` y `clarity`. El contrato de datos se documenta en
  `src/application/services/analyticsTracker.ts` y en las declaraciones globales de `src/env.d.ts`.
- Para evitar duplicidades, se deduplican los eventos en una ventana de 2 segundos antes de propagarlos a cada destino.
- GA4 y Clarity solo se inicializan cuando el banner de consentimiento registra una aceptación explícita.
- Revisá `docs/srs-profebustos-www.md` y `docs/improvement-options-2025-02-18.md` para el detalle de métricas,
  supuestos y decisiones abiertas.

## Accesibilidad
- Ejecutá `npm run test:a11y` para analizar los templates `.vue` y asegurar nombres accesibles en botones/enlaces, además de
  etiquetas `alt` en imágenes y encabezados en secciones clave.
- Corregí cualquier hallazgo reportado antes de desplegar cambios visuales.

## Despliegue sugerido
1. Ejecutar `npm run build` y publicar el contenido de `dist/` en el hosting estático elegido (Cloudflare Pages, Netlify, etc.).
2. Configurar las variables de entorno en el servicio de hosting replicando los valores de `.env`.
3. Validar que las solicitudes al endpoint `VITE_CONTACT_API_URL` respondan con código `2xx` sobre HTTPS. El monitoreo automático mostrará mensajes de indisponibilidad si falla.
4. Verificar en QA que los eventos de WhatsApp, chat y correo se registran una sola vez en GA4 y Clarity.

## Recursos adicionales
- Documentación funcional y no funcional: `docs/srs-profebustos-www.md`.
- Auditoría y alternativas de mejora: `docs/audit-2025-02-17.md` y `docs/improvement-options-2025-02-18.md`.
- Guía rápida de componentes: revisar `src/components/` y comentarios en línea.

¿Dudas o sugerencias? Escribinos a [contacto@profebustos.com.ar](mailto:contacto@profebustos.com.ar).
