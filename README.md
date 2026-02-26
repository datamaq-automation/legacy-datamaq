# profebustos-www

Frontend Vue 3 + Vite para landing y cotizador, con deploy FTPS multi-target desde un solo repositorio.

## Estado

- Rutas compartidas entre marcas: `/`, `/cotizador`, `/gracias`.
- Configuracion por marca centralizada en [`src/infrastructure/content/runtimeProfiles.json`](src/infrastructure/content/runtimeProfiles.json).
- Build por target sin `.env`: `npm run build -- <target>`.

## Targets disponibles

- `datamaq`
- `upp`
- `e2e`

## Comandos principales

```bash
npm install
npm run dev
npm run build
npm run build:datamaq
npm run build:upp
npm run typecheck
npm run test
npm run test:e2e:smoke
```

## CI/CD

Workflow: `.github/workflows/ci-cd-ftps.yml`

- `pull_request`: typecheck, unit tests, build, smoke e2e.
- `push` a `main`: deploy FTPS por matrix (`datamaq`, `upp`).

Runbook operativo: `docs/multi-target-deploy-runbook.md`.
