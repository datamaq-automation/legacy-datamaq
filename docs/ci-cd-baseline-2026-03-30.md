# CI/CD Baseline (2026-03-30)

Fecha de corte: 2026-03-30

Objetivo: dejar una referencia medible de costo/flujo despues de la optimizacion de GitHub Actions.

## Baseline actual

1. CI `push` a `main` (ligero):
- Workflow: `CI / Quality`
- Duracion observada: ~27s
- Run de referencia: `23725816026`
- URL: `https://github.com/AgustinMadygraf/plantilla-www/actions/runs/23725816026`
- Comportamiento esperado:
  - ejecuta `Quality / Fast` (modo liviano)
  - no ejecuta `Actionlint`
  - no ejecuta `Quality / E2E Smoke`

2. CD por commit normal:
- Workflow: `CD / FTPS`
- Runs esperados por SHA: `1` (evento `workflow_run`)
- Duracion observada: ~214s
- Run de referencia: `23725825596`
- URL: `https://github.com/AgustinMadygraf/plantilla-www/actions/runs/23725825596`

3. Excepcion conocida (doble CD):
- Si el commit modifica alguno de estos paths, puede existir run adicional de CD por `push`:
  - `scripts/ftps-deploy.sh`
  - `.github/workflows/cd.yml`
  - `.github/actions/**`

## Reglas operativas

1. Cambios funcionales: siempre via `pull_request`.
2. Gate local obligatorio antes de push:
- Hook `pre-push` con `husky`.
- Comando: `npm run gate:push` (`quality:fast` + `quality:e2e`).
3. Full gate manual:
- `workflow_dispatch` con `run_full_gate=true` cuando se quiera auditoria completa puntual.
4. Purge de Cloudflare:
- es opcional para `datamaq`.
- si faltan `CLOUDFLARE_API_TOKEN` o `CLOUDFLARE_ZONE_ID` en `production`, el workflow deja `notice` y continua sin warning ni fallo.

## Monitoreo (proximas 48h)

1. Verificar en cada push normal a `main`:
- CI `push` alrededor de 20-40s.
- un unico `CD / FTPS` por SHA.
2. Si reaparece doble CD en pushes normales:
- revisar nuevamente triggers `on.push.paths` de `cd.yml`.
