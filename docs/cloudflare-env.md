# Variables de entorno en Cloudflare Pages

Este proyecto usa variables `VITE_*` que se exponen al bundle del frontend. Configuralas en Cloudflare Pages por entorno (Production/Preview).

## Variables requeridas

```
VITE_ANALYTICS_ENABLED=true
VITE_GA4_ID=G-XXXXXXXXXX
VITE_CLARITY_PROJECT_ID=
VITE_SITE_URL=https://www.datamaq.com.ar
VITE_SITE_NAME=Datamaq
VITE_SITE_DESCRIPTION=Servicios industriales y eficiencia energetica para empresas.
VITE_SITE_OG_IMAGE=https://www.datamaq.com.ar/og-default.png
VITE_CONTACT_API_URL=https://api.datamaq.com.ar/contact
VITE_CONTACT_EMAIL=contacto@datamaq.com.ar
VITE_WHATSAPP_NUMBER=5491100000000
VITE_WHATSAPP_PRESET_MESSAGE=Vengo de la pagina web, quiero mas informacion.
```

Notas:
- `VITE_ANALYTICS_ENABLED=false` desactiva toda la carga de tags.

## Pasos en Cloudflare Pages

1) Ir a Cloudflare Pages > tu proyecto.  
2) Settings > Environment variables.  
3) Agregar cada variable en Production y Preview.  
4) Guardar y disparar un nuevo deploy.

## Validacion rapida

- Abrir la app y setear `localStorage.setItem('consent.analytics', 'granted')`.
- Verificar en GA4 DebugView que aparecen `page_view` y eventos.

## Token para Wrangler (deploy)

El deploy con `wrangler` requiere un token API y **no** debe guardarse en `.env` del repo.

### Como generar el token
1) Entrar al panel de Cloudflare y abrir **My Profile**.
2) Ir a **API Tokens** > **Create Token**.
3) Elegir el template **Edit Cloudflare Workers** (o crear un token personalizado).
4) Si es personalizado, permisos recomendados:
   - Account > Workers Scripts: Edit
   - Account > Workers Routes: Edit (si usas routes)
   - Account > Account Settings: Read
   - Zone > Zone: Read (si aplica)
5) Crear el token y copiarlo una sola vez.

### Donde guardarlo
- En tu maquina (PowerShell):
  ```
  setx CLOUDFLARE_API_TOKEN "TU_TOKEN"
  ```
  Abrir una nueva terminal para que tome la variable.

- En CI/CD: agregarlo como secret/variable de entorno con el nombre `CLOUDFLARE_API_TOKEN`.

### Probar deploy
```
npx wrangler deploy
```
