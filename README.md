# datamaq-www

Landing corporativa construida con Vue 3 y Vite para promocionar servicios industriales de DataMaq.

## Caracteristicas principales
- SPA liviana optimizada para CTAs de WhatsApp y correo electronico.
- Integracion con backend propio para registrar contactos y derivarlos a Chatwoot.
- Instrumentacion analitica con GA4 y Microsoft Clarity.
- Componentes accesibles y reutilizables segun la guia de `docs/`.
- Banner de consentimiento que bloquea GA4/Clarity hasta aceptacion explicita.
- Monitoreo de disponibilidad del backend de contacto para deshabilitar el formulario cuando el servicio no responde.

## Requisitos previos
- Node.js >= 20.19.0
- npm >= 8
- Acceso al endpoint HTTPS del backend propio para recibir formularios.

## Configuracion de entorno
1. Copia `.env.example` a `.env` y completa los valores reales para cada entorno.
2. Verifica que `VITE_CONTACT_API_URL` apunte al backend propio (no directo a Chatwoot).
3. Ajusta los IDs de analitica (`VITE_CLARITY_PROJECT_ID`, `VITE_GA4_ID`) segun la propiedad correspondiente.

## Arquitectura de contacto y despliegue
- Frontend estatico en Ferozo (DonWeb), publicado en `public_html` via FTPS.
- Backend propio en Docker, desplegado en VPS (DonWeb Cloud IaaS).
- Flujo de contacto: `frontend -> backend -> Chatwoot`.
- Los secretos de Chatwoot (`api_access_token` y relacionados) viven solo en backend.
- Este repositorio no incluye scaffold de backend: la implementacion se hara directamente en el backend de produccion cuando corresponda.
- Contrato tecnico DV-02: `docs/dv-02-chatwoot-contract.md`.

## Instalacion y scripts
```sh
npm install         # instala dependencias
npm run dev         # servidor de desarrollo
npm run build       # compila assets para produccion en ./dist
npm run preview     # sirve el build localmente
npm run typecheck   # valida TypeScript estricto
npm run test        # ejecuta tests unitarios
npm run test:e2e    # ejecuta suite e2e con Playwright
npm run test:e2e:smoke # ejecuta smoke e2e (home/contacto/gracias)
npm run smoke:contact:backend -- https://chatwoot.datamaq.com.ar/contact # smoke backend (estimativo, puede variar)
npm run test:a11y   # auditoria heuristica de accesibilidad
npm run check:css   # valida presupuesto de CSS
npm run lint:colors # valida regla anti-HEX fuera de tokens
npm run lint:layers # valida limites de dependencias entre capas
npm run lint:todo-sync # valida trazabilidad obligatoria src/tests -> docs/todo.md
npm run quality:merge # puerta local recomendada antes de merge/deploy
npm run ci:remote:status # estado remoto del workflow FTPS via GitHub API publica
npm run ci:branch-protection:check # valida required checks en main (requiere GITHUB_TOKEN/GH_TOKEN)
```

## CI/CD recomendado (GitHub Actions + FTPS)
Este repositorio incluye el workflow `./.github/workflows/ci-cd-ftps.yml` con tres jobs:
- `Quality Gate`: ejecuta `npm run quality:gate` en `pull_request` y `push`.
- `Smoke E2E`: ejecuta `npm run test:e2e:smoke` en `pull_request` y `push`.
- `Deploy Production (FTPS)`: publica `dist/` por FTPS al hacer `push` a `main`, solo si `Quality Gate` y `Smoke E2E` pasan.

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
3. Marcar `CI/CD FTPS / Quality Gate` y `CI/CD FTPS / Smoke E2E` como checks obligatorios para merge.
4. Si no aparecen en el selector de required checks, ejecutar una corrida manual (`workflow_dispatch`) del workflow sobre `main` y reintentar.
5. Mientras el enforcement externo no este confirmado, usar `npm run quality:merge` como control operativo manual.

## Analitica y eventos
- Los eventos de compromiso se envian via `gtag` y `clarity`.
- El contrato de datos esta en `src/application/analytics/engagementTracker.ts` y `src/application/analytics/trackingFacade.ts`.
- Para evitar duplicados, se deduplican eventos en una ventana de 2 segundos.
- GA4 y Clarity solo se inicializan cuando el banner de consentimiento registra aceptacion.
- Politica de revocacion activa: `hard revoke` (al rechazar/revocar se bloquea tracking y se limpian cookies de analytics first-party).
- Detalle de matriz y decision: `docs/dv-01-consent-matrix.md`.

## Accesibilidad
- Ejecuta `npm run test:a11y` para analizar templates `.vue`.
- Corrige hallazgos antes de desplegar cambios visuales.

## Despliegue (flujo objetivo)
1. Verificar localmente `npm run quality:gate` y `npm run test:e2e:smoke`.
2. Ejecutar workflow en GitHub (por `push` a `main` o `workflow_dispatch` sobre `main`).
3. Confirmar en verde `Quality Gate` y `Smoke E2E`.
4. GitHub Actions ejecuta build y deploy FTPS automatico a `FTPS_REMOTE_DIR`.
5. Verificar en QA que el formulario crea/actualiza conversacion en Chatwoot y que eventos de WhatsApp/correo se registran una sola vez en GA4 y Clarity.

## Smoke de backend de contacto
- Script: `npm run smoke:contact:backend -- <CONTACT_API_URL>`.
- Referencia estimativa actual: `https://chatwoot.datamaq.com.ar/contact`.
- La URL puede variar hasta cerrar infraestructura backend en VPS.
- El script falla (exit code `1`) cuando el backend no responde `2xx`.

## Recursos adicionales
- Backlog tecnico priorizado: `docs/todo.md`.
- Contrato operativo del agente: `AGENTS.md`.
- Guia de uso con Codex: `docs/codex-usage.md`.

Consultas: [contacto@datamaq.com.ar](mailto:contacto@datamaq.com.ar).
