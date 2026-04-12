# Migracion a WordPress Nativo - Fase 0 (Inventario y Congelamiento)

Fecha: 2026-04-12
Proyecto origen: `C:\AppServ\www\plantilla-www`
Objetivo: migrar a tema WordPress PHP nativo sin romper URLs actuales.

## 1) Certezas tecnicas del estado actual
- Frontend actual: Vue 3 + TypeScript + Vite (`vite-ssg`).
- Rutas publicas actuales definidas en `src/router/routes.ts`.
- SEO actual generado en runtime con `src/ui/seo/appSeo.ts`.
- Fuente de contenido/SEO central: `src/infrastructure/content/siteSnapshot.datamaq.ts`.
- Analitica actual: GA4 + Microsoft Clarity, condicionada por consentimiento.
- Eventos de conversion detectados: `generate_lead`, `contact`, `scroll_to_section`, `sign_up`, `purchase`.

## 2) Inventario de URLs y comportamiento a preservar

| URL actual | Tipo actual | Indexable | Resultado esperado en WP |
|---|---|---|---|
| `/` | pagina principal | si | pagina WP publica (`200`) |
| `/contact` | pagina contacto | si | pagina WP publica (`200`) |
| `/gracias` | pagina de confirmacion | no (`noindex,nofollow`) | pagina WP publica (`200`) con `noindex` |
| `/medicion-consumo-electrico-escobar` | landing de servicio | si | pagina WP publica (`200`) |
| `/cotizador` | redireccion | N/A | `301` a `/contact` |
| `/cotizador/:quoteId/web` | redireccion dinamica | N/A | `301` a `/contact` |

## 3) SEO minimo a replicar en WP
- Canonical por pagina con la URL final publica.
- Robots por pagina:
  - `/gracias`: `noindex,nofollow`.
  - resto: `index,follow`.
- Open Graph y Twitter Card en paginas clave.
- JSON-LD existente a conservar en alcance equivalente:
  - Organization
  - WebSite
  - LocalBusiness (si aplica)
  - OfferCatalog (si aplica)
  - Service (landing Escobar)
  - FAQPage (landing Escobar)

## 4) Tracking/analitica a mantener en la migracion
- GA4 y Clarity, activados solo con consentimiento.
- Eventos funcionales a reimplementar en tema/plugin:
  - `contact` (chat/WhatsApp)
  - `generate_lead` (envio de formulario y/o pagina gracias)
  - `scroll_to_section` (si se conserva navegacion por anclas)
- Dedupe de eventos para evitar duplicados por doble click/envio multiple.

## 5) Redirecciones obligatorias (sin romper trafico ni SEO)

Reglas requeridas:
1. `/cotizador` -> `/contact` (301)
2. `/cotizador/<cualquier_valor>/web` -> `/contact` (301)

Referencia Apache (`.htaccess`):

```apache
RewriteRule ^cotizador/?$ /contact [R=301,L]
RewriteRule ^cotizador/[^/]+/web/?$ /contact [R=301,L]
```

## 6) Checklist de salida de Fase 0
- [x] Inventario de rutas y comportamiento actual.
- [x] Reglas de redireccion necesarias documentadas.
- [x] Requisitos SEO minimos definidos.
- [x] Requisitos de analitica/eventos definidos.
- [ ] Confirmar entorno WP objetivo para `datamaq.com.ar` (staging y produccion).
- [ ] Confirmar plugin de formularios para reemplazo de flujo de contacto.

## 7) Entrada para Fase 1
Con este inventario, la siguiente fase es crear el esqueleto del tema WordPress nativo y las paginas/slugs equivalentes para validar paridad de URLs en staging.
