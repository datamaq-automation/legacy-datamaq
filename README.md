# plantilla-www

Frontend Vue 3 + Vite con configuracion multi-target desde un solo repositorio.

## Targets

- `datamaq`
- `upp`
- `example`
- `e2e`

Configuracion runtime centralizada en `src/infrastructure/content/runtimeProfiles.json`.

## Comandos

```bash
npm install
npm run dev
npm run build -- <target>
npm run typecheck
npm run test
npm run test:e2e:smoke
```

## CI/CD

- CI: `.github/workflows/ci-quality.yml`
- CD FTPS: `.github/workflows/ci-cd-ftps.yml`

Runbook: `docs/multi-target-deploy-runbook.md`.
