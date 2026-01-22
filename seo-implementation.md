# SEO Implementation & Prerendering

## 1. Prerender / SSG pipeline

- El proyecto usa `vite-ssg` + `vue-router` para prerenderizar `/` y `/gracias`. El entry `src/main.ts` expone `createApp` con `ViteSSG(App, { routes })`, y cada ruta ya incluye las vistas `HomePage` y `ThanksView`.
- El componente `src/ui/App.vue` ahora sólo monta `<RouterView />` y `src/ui/App.ts` determina el `<head>` en función de la ruta actual (incluyendo `noindex` en `/gracias`). De este modo `npm run build` produce `dist/index.html` con contenido real, meta tags y JSON-LD (sin ejecutar analytics/clarity hasta que el cliente carga y consiente).
- La navegación a `/gracias` y la redirección desde el formulario usan `vue-router`, lo que mantiene la experiencia SPA, la lógica de tracking y el envío de eventos intactos.

## 2. SEO / LocalBusiness env vars

- `VITE_SITE_URL`: URL canónica (debe incluir `https://` y preferiblemente `www`). Esta URL se usa para canonical, OG, sitemap y `_redirects`.
- `VITE_SITE_NAME`, `VITE_SITE_DESCRIPTION`, `VITE_SITE_OG_IMAGE`, `VITE_SITE_LOCALE`: definen meta, `og:locale` y `<link rel="alternate" hreflang="es-AR">`.
- `VITE_GSC_VERIFICATION`: inyecta `<meta name="google-site-verification">` en todas las páginas si existe.
- `VITE_BUSINESS_*` (name, telephone, email, dirección, coordinates, areaServed): proveen datos para el JSON-LD `ProfessionalService` y `OfferCatalog`. Sólo se publican los campos definidos explícitamente.
- `VITE_BUSINESS_AREA` puede ser una lista separada por comas (`"GBA Norte,Argentina"`) y alimenta `areaServed`.

Documentar en `docs/cloudflare-env.md` y `docs/analytics-seo.md` cada variable requerida antes de producción.

## 3. Sitemap / Robots / Redirects

- `scripts/generate-sitemap.mjs` lee `src/seo/routes.json` (lista de rutas con `indexable`) y crea junto al build:
  - `public/sitemap.xml` con `<lastmod>` y sólo rutas indexables.
  - `public/robots.txt` que referencia el sitemap y permite todo (`Allow: /`).
  - `_redirects` que redirige non-www/http hacia la URL canónica `VITE_SITE_URL` con reglas 301.
- El script se ejecuta antes de `vite build` gracias a la nueva entrada `npm run build` y se basa en `VITE_SITE_URL`, lo que asegura consistencia entre SEO, canonical y sitemap.
- Para revisar el resultado: `dist/sitemap.xml` debe listar `/`, `dist/robots.txt` debe contener el header `Sitemap: …`, y `dist/_redirects` debe enumerar las reglas 301.

## 4. Canonical domain / Cloudflare Pages

- Cloudflare Pages reconoce `_redirects`. Con el script actual basta con mantener `VITE_SITE_URL` al valor deseado (`https://www.profebustos.com.ar`). Si alguna vez se cambia el dominio, actualizar el env y redeploy para regenerar `_redirects`.
- Si se prefiere controlar redirecciones desde Cloudflare (en lugar de `_redirects`), configurar reglas del tipo `non-www` → canonical (https + www) y `http` → `https` para asegurar un solo dominio. Registrar la URL canónica en Cloudflare SSL/TLS y DNS.

## 5. Validaciones recomendadas

1. `npm run build` pasa y genera `dist/index.html` con contenido real (H1, CTA, sections) y meta tags reales (opens in devtools 'View Page Source').
2. `dist/sitemap.xml`, `dist/robots.txt`, `dist/_redirects` existen y contienen la versión canónica de `VITE_SITE_URL`.
3. `/gracias` prerender contiene `<meta name="robots" content="noindex,nofollow">`.
4. La carga del sitio en el navegador no dispara analytics/clarity hasta que el consentimiento es `granted`.
5. En Search Console se puede subir `https://{VITE_SITE_URL}/sitemap.xml` y verificar la meta `google-site-verification` si se usa el env.
6. Verificar que la redirección non-www / http → canonical responde 301 (posiblemente con `curl -I`).
