# Analytics + SEO

## Variables de entorno

```
VITE_ANALYTICS_ENABLED=true
VITE_GA4_ID=G-XXXXXXXXXX
VITE_CLARITY_PROJECT_ID=c-xxx
VITE_SITE_URL=https://www.tu_sitio_web.com.ar
VITE_SITE_NAME=tu_nombre_de_tu_sitio
VITE_SITE_DESCRIPTION=tu_descripcion
VITE_SITE_OG_IMAGE=https://www.tu_sitio_web.com.ar/og-default.png
```

Notas:
- `VITE_ANALYTICS_ENABLED=false` deshabilita toda la carga de tags.
- Los IDs se cargan solo si el consentimiento esta en `granted`.

## Consentimiento

El consentimiento se guarda en `localStorage` con la clave `consent.analytics`:
- `granted`
- `denied`
- `unset`

En desarrollo podes setearlo manualmente:
```
localStorage.setItem('consent.analytics', 'granted')
```

## Arquitectura

- Inicializacion: `src/infrastructure/analytics/index.ts`
- GA4: `src/infrastructure/analytics/ga4.ts`
- Atribucion UTM: `src/infrastructure/attribution/utm.ts`
- Enriquecimiento de leads: `src/infrastructure/contact/contactApiGateway.ts`

## SPA page_view

- Se habilita en `src/main.ts` con `enableSpaPageTracking()`.
- Si se agrega Vue Router en el futuro, el tracker sigue funcionando via history API.

## Eventos de conversion

Eventos recomendados (GA4):
- `generate_lead`
- `contact`
- `sign_up`
- `purchase`

WhatsApp se dispara desde `src/application/analytics/engagementTracker.ts`.
`generate_lead` se dispara en `/gracias` via `src/application/analytics/leadTracking.ts`.

## UTMs / click IDs

- Se leen desde URL y se guardan 30 dias en localStorage.
- Se anexan automaticamente al payload de leads como `attribution`.

## SEO base

- Metas globales en `src/ui/App.vue` via `@vueuse/head`.
- JSON-LD de Organization + WebSite en `src/ui/seo/defaultSeo.ts`.

## Sitemap y robots

Generar archivos con:
```
npm run sitemap
```

Eso crea:
- `public/sitemap.xml`
- `public/robots.txt`

## Search Console

Opciones de verificacion:
1. DNS (recomendada): agregar TXT en el proveedor de dominio.
2. Meta tag: agregar meta `google-site-verification` en `src/ui/App.vue`.
3. Archivo HTML: colocar el archivo de verificacion en `public/`.

Luego:
- Enviar `https://TU_DOMINIO/sitemap.xml` en Search Console.

## Google Ads - conversiones

Opcion recomendada: importar desde GA4.
1. En GA4, marcar eventos como conversion.
2. En Google Ads, importar conversiones desde GA4.

## Pagina de gracias `/gracias`

- Se usa como URL de conversion en Google Ads: `https://TU_DOMINIO/gracias`.
- El formulario redirige a `/gracias` al enviar correctamente.
- La pagina incluye `meta robots: noindex, nofollow` y canonical hacia `/gracias`.
- En `/gracias` se dispara una vez el evento GA4 `generate_lead` usando `sessionStorage`.
- Si el hosting no sirve rutas SPA, configurar fallback para que `/gracias` entregue `index.html`.

## Validacion

- GA4 DebugView: GA4 > Admin > DebugView.
- Confirmar `page_view` en cada navegacion SPA.

## Checklist pre-produccion

- Variables de entorno configuradas.
- Consentimiento activo antes de cargar tags.
- `npm run sitemap` ejecutado y publicado.
- Eventos de conversion visibles en GA4 DebugView.
- Search Console verificada y sitemap enviado.
