# datamaq-www

Landing corporativa construida con Vue 3 y Vite para promocionar servicios industriales de DataMaq.

## Caracteristicas principales
- SPA liviana optimizada para CTAs de WhatsApp y correo electronico.
- Integracion con API externa para registrar contactos del formulario.
- Instrumentacion analitica con GA4 y Microsoft Clarity.
- Componentes accesibles y reutilizables segun la guia de `docs/`.
- Banner de consentimiento que bloquea GA4/Clarity hasta aceptacion explicita.
- Monitoreo de disponibilidad del backend de contacto para deshabilitar el formulario cuando el servicio no responde.

## Requisitos previos
- Node.js >= 20.19.0
- npm >= 8
- Acceso al endpoint HTTPS del backend para recibir formularios.

## Configuracion de entorno
1. Copia `.env.example` a `.env` y completa los valores reales para cada entorno.
2. Verifica que `VITE_CONTACT_API_URL` apunte a un endpoint HTTPS valido.
3. Ajusta los IDs de analitica (`VITE_CLARITY_PROJECT_ID`, `VITE_GA4_ID`) segun la propiedad correspondiente.

## Instalacion y scripts
```sh
npm install         # instala dependencias
npm run dev         # servidor de desarrollo
npm run build       # compila assets para produccion en ./dist
npm run preview     # sirve el build localmente
npm run typecheck   # valida TypeScript estricto
npm run test        # ejecuta tests unitarios
npm run test:a11y   # auditoria heuristica de accesibilidad
npm run check:css   # valida presupuesto de CSS
npm run lint:colors # valida regla anti-HEX fuera de tokens
```

## CI/CD recomendado (GitHub Actions + FTPS)
Este repositorio incluye el workflow `./.github/workflows/ci-cd-ftps.yml` con dos jobs:
- `Quality Gate`: ejecuta `npm run quality:gate` en `pull_request` y `push`.
- `Deploy Production (FTPS)`: publica `dist/` por FTPS al hacer `push` a `main`, solo si `Quality Gate` pasa.

Secrets requeridos en GitHub:
- `FTPS_SERVER`
- `FTPS_USERNAME`
- `FTPS_PASSWORD`
- `FTPS_REMOTE_DIR` (ejemplo: `/public_html`)
- `FTPS_PORT` (opcional, default `21`)

Formato recomendado para `FTPS_SERVER`:
- Solo host (sin `ftp://`, sin path), por ejemplo: `ftp.tudominio.com`.
- El workflow tambien normaliza formato URL (`ftp://host:21/ruta`) si quedara configurado asi por error.

Valores operativos confirmados para este proyecto:
- `FTPS_REMOTE_DIR=/public_html`
- `FTPS_PORT=21` (FTPS explicito)

Configuracion recomendada en GitHub:
1. Crear environment `production` y asociar los secrets FTPS.
2. Activar branch protection en `main`.
3. Marcar `CI/CD FTPS / Quality Gate` como check obligatorio para merge.

## Analitica y eventos
- Los eventos de compromiso se envian via `gtag` y `clarity`.
- El contrato de datos esta en `src/application/analytics/engagementTracker.ts` y `src/application/analytics/trackingFacade.ts`.
- Para evitar duplicados, se deduplican eventos en una ventana de 2 segundos.
- GA4 y Clarity solo se inicializan cuando el banner de consentimiento registra aceptacion.

## Accesibilidad
- Ejecuta `npm run test:a11y` para analizar templates `.vue`.
- Corrige hallazgos antes de desplegar cambios visuales.

## Despliegue (flujo objetivo)
1. Abrir PR y esperar `Quality Gate` en verde.
2. Merge a `main`.
3. GitHub Actions ejecuta build y deploy FTPS automatico a `FTPS_REMOTE_DIR`.
4. Verificar en QA que eventos de WhatsApp y correo se registran una sola vez en GA4 y Clarity.

## Recursos adicionales
- Backlog tecnico priorizado: `docs/todo.md`.

Consultas: [contacto@datamaq.com.ar](mailto:contacto@datamaq.com.ar).
