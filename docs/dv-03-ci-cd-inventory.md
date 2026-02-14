# DV-03 - Inventario CI/CD y reglas de merge

Fecha de relevamiento: 2026-02-14

## 1) Objetivo
Confirmar el estado real del pipeline de integracion y las reglas de merge que aplican al repositorio.

## 2) Evidencia local (repo)
Hallazgos:
- Existe workflow versionado en `./.github/workflows/ci-cd-ftps.yml`.
- No se encontraron pipelines alternativos versionados (`.gitlab-ci.yml`, `azure-pipelines.yml`, `netlify.toml`, `vercel.json`, `railway.json`).
- Existe script local de puerta de calidad: `npm run quality:gate`.

Configuracion de despliegue detectada:
- `wrangler.jsonc` presente con assets de `dist/` (indicio de despliegue en Cloudflare Workers/Pages).
- Workflow de deploy por FTPS configurado para `main` con environment `production`.

Checks locales disponibles en `quality:gate`:
- `npm run typecheck`
- `npm run test`
- `npm run lint:colors`
- `npm run test:a11y`
- `npm run check:css`

## 3) Evidencia de ejecucion
Ejecucion local verificada el 2026-02-14:
- `npm run quality:gate` -> OK
- Resultado: todas las validaciones anteriores en verde.

## 4) Decision tomada
Decision adoptada: `GitHub Actions + FTPS`.

Racional:
- Permite enforcement de calidad antes de deploy.
- Deja trazabilidad versionada de CI/CD en el repo.
- Evita dependencia de integraciones opacas fuera de GitHub para el flujo principal.

## 5) Ventajas y desventajas evaluadas
Opcion A: Vinculacion Git directa desde hosting
- Ventajas: configuracion rapida; menos moving parts.
- Desventajas: menor control de checks obligatorios previos al deploy; menor trazabilidad y gobernanza de merge.

Opcion B: GitHub Actions + FTPS (elegida)
- Ventajas: control total de pipeline, checks bloqueantes, auditoria en PR y runs.
- Desventajas: requiere gestionar secrets FTPS y branch protection manual en GitHub.

## 6) Brecha actual
Pendiente fuera de repo:
- Configurar secrets de FTPS en GitHub (`FTPS_SERVER`, `FTPS_USERNAME`, `FTPS_PASSWORD`, `FTPS_REMOTE_DIR`, opcional `FTPS_PORT`).
- Activar branch protection en `main`.
- Marcar `CI/CD FTPS / Quality Gate` como required check.

Parametros operativos confirmados:
- `FTPS_REMOTE_DIR=/public_html`
- `FTPS_PORT=21` (FTPS explicito)

## 7) Minimo recomendado de checks obligatorios
Checks requeridos para PR/merge:
- `typecheck`
- `test`
- `lint:colors`
- `test:a11y`
- `check:css`

Implementacion recomendada:
- Reutilizar `npm run quality:gate` como comando unificado en CI.
- Exponer cada check como status separado o al menos un status obligatorio de `quality:gate`.

## 8) DoD propuesto para cerrar DV-03
- Inventario de CI/CD documentado en repo.
- Decision de implementacion definida y aplicada (`GitHub Actions + FTPS`).
- Branch protection configurada con checks obligatorios.
- Evidencia de una corrida de PR con status bloqueante ante falla.

## 9) Mensaje sugerido para Plataforma
"Implementamos CI/CD en repo con `GitHub Actions + FTPS` (`./.github/workflows/ci-cd-ftps.yml`). Necesitamos completar configuracion de GitHub: secrets FTPS, branch protection en `main` y required check `CI/CD FTPS / Quality Gate`."
