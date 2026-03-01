# plantilla-www

Frontend Vue 3 + Vite con configuracion multi-target desde un solo repositorio.

## Targets

- `datamaq`
- `upp`
- `example`
- `e2e`

Configuracion runtime centralizada en `src/infrastructure/content/runtimeProfiles.json`.

## Documentacion

- Guia principal para migracion de backend a FastAPI: `docs/fastapi-backend-migration-guide.md`
- Contrato canonico de `contact` y `mail` para FastAPI: `docs/fastapi-contact-contract.md`
- Contrato canonico de `content` y `pricing` para FastAPI: `docs/fastapi-content-pricing-contract.md`
- Contrato canonico de `quote` para FastAPI: `docs/fastapi-quote-contract.md`
- Checklist operativa por router para FastAPI: `docs/fastapi-router-implementation-checklist.md`

## Comandos

```bash
npm install
npm run dev
npm run build -- <target>
npm run typecheck
npm run test
npm run test:contracts:fastapi
npm run test:e2e:smoke
```

## CI/CD

- CI: `.github/workflows/ci-quality.yml`
- CD FTPS: `.github/workflows/ci-cd-ftps.yml`

Runbook: `docs/multi-target-deploy-runbook.md`.
