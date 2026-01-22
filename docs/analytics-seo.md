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
VITE_SITE_LOCALE=es_AR
VITE_GSC_VERIFICATION=XXXXXXXXXX
VITE_BUSINESS_NAME=Tu Empresa
VITE_BUSINESS_TELEPHONE=5491111111111
VITE_BUSINESS_EMAIL=hola@tuempresa.com.ar
VITE_BUSINESS_STREET=Av. Siempre Viva 742
VITE_BUSINESS_LOCALITY=Martinez
VITE_BUSINESS_REGION=Buenos Aires
VITE_BUSINESS_POSTAL_CODE=1650
VITE_BUSINESS_COUNTRY=AR
VITE_BUSINESS_LAT=-34.449
VITE_BUSINESS_LNG=-58.644
VITE_BUSINESS_AREA=GBA Norte,Argentina
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

- Metas globales y canonicales generadas en `src/ui/App.ts` con `@vueuse/head`.
- JSON-LD de Organization, WebSite, LocalBusiness y OfferCatalog en `src/ui/seo/defaultSeo.ts` salvo que falten datos.
- `og:locale` y `link rel="alternate"` usan `VITE_SITE_LOCALE`.
- La meta `google-site-verification` se inyecta cuando `VITE_GSC_VERIFICATION` está presente.
- El sitemap/robots se generan automáticamente antes de cada `npm run build` y se publican con `_redirects` basado en `VITE_SITE_URL`.

## Sitemap y robots

- `npm run build` ejecuta `npm run sitemap` antes de compilar, por lo que el sitemap/robots/_redirects siempre se actualizan con `VITE_SITE_URL`.
- El sitemap solo incluye rutas marcadas como indexables (`/`) y añade `<lastmod>` con fecha del build.
- `robots.txt` referencia `Sitemap: {VITE_SITE_URL}/sitemap.xml` y no bloquea assets.
- `_redirects` crea reglas 301 desde non-www/http hacia la URL canónica de `VITE_SITE_URL`.

## Search Console

Opciones de verificacion:
1. DNS (recomendada): agregar TXT en el proveedor de dominio.
2. Meta tag: configurar `VITE_GSC_VERIFICATION` para que el meta se inyecte automáticamente.
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

- Variables de entorno SEO/analytics completas (Analytics, VITE_SITE_*, VITE_BUSINESS_*, VITE_GSC_VERIFICATION).
- Consentimiento activo antes de cargar tags.
- `npm run build` (genera sitemap/robots/_redirects) exitoso.
- Eventos de conversion visibles en GA4 DebugView.
- Search Console verificada y sitemap enviado.
