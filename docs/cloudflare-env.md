# Variables de entorno en Cloudflare Pages

Este proyecto usa variables `VITE_*` que se exponen al bundle del frontend. Configuralas en Cloudflare Pages por entorno (Production/Preview).

## Variables requeridas

```
VITE_ANALYTICS_ENABLED=true
VITE_GA4_ID=G-XXXXXXXXXX
VITE_CLARITY_PROJECT_ID=
VITE_SITE_URL=https://www.profebustos.com.ar
VITE_SITE_NAME=ProfeBustos
VITE_SITE_DESCRIPTION=Servicios industriales y eficiencia energetica para empresas.
VITE_SITE_OG_IMAGE=https://www.profebustos.com.ar/og-default.png
VITE_CONTACT_API_URL=https://api.profebustos.com.ar/contact
VITE_CONTACT_EMAIL=contacto@profebustos.com.ar
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
