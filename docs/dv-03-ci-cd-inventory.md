# DV-03 - Inventario CI/CD y reglas de merge

Fecha de relevamiento: 2026-02-14

## 1) Objetivo
Confirmar el estado real del pipeline de integracion y las reglas de merge que aplican al repositorio.

## 2) Evidencia local (repo)
Hallazgos:
- Existe workflow versionado en `./.github/workflows/ci-cd-ftps.yml`.
- El workflow incluye jobs `Quality Gate`, `Smoke E2E` y `Deploy Production (FTPS)`.
- No se encontraron pipelines alternativos versionados (`.gitlab-ci.yml`, `azure-pipelines.yml`, `netlify.toml`, `vercel.json`, `railway.json`).
- Existe script local de puerta de calidad: `npm run quality:gate`.

Configuracion de despliegue detectada:
- `wrangler.jsonc` presente con assets de `dist/` (artefacto legado; no corresponde al flujo productivo vigente).
- Workflow de deploy por FTPS configurado para `main` con environment `production`.
- Flujo productivo vigente confirmado: frontend en Ferozo y backend en Docker sobre VPS (DonWeb Cloud IaaS).

Checks locales disponibles en `quality:gate`:
- `npm run typecheck`
- `npm run test`
- `npm run lint:colors`
- `npm run lint:layers`
- `npm run test:a11y`
- `npm run check:css`

Control operativo local complementario:
- `npm run quality:merge` (`quality:gate` + `test:e2e:smoke`).

Checks e2e versionados:
- `npm run test:e2e:smoke` (Playwright, Chromium).

Script de soporte operativo:
- `npm run ci:remote:status` (consulta runs/jobs del workflow FTPS por GitHub API publica).
- `npm run ci:branch-protection:check` (valida required checks en branch protection; requiere `GITHUB_TOKEN`/`GH_TOKEN`).

## 3) Evidencia de ejecucion
Ejecucion local verificada el 2026-02-15:
- `npm run quality:gate` -> OK
- `npm run quality:merge` -> OK
- `npm run ci:remote:status` -> OK
- `npm run ci:branch-protection:check` -> FAIL esperado sin token (`Falta token: define GITHUB_TOKEN o GH_TOKEN`).
- Resultado: todas las validaciones anteriores en verde.
- Revalidacion operativa (2026-02-15 12:35 -03:00):
  - `npm run ci:remote:status` -> OK; ultimo run `22026695643` (`push`) en `success` con jobs `Quality Gate`, `Smoke E2E` y `Deploy Production (FTPS)` en verde.
  - `npm run ci:branch-protection:check` -> FAIL esperado por falta de `GITHUB_TOKEN`/`GH_TOKEN`.

Evidencia remota (GitHub API publica) verificada el 2026-02-15:
- Workflow run `22026695643` (`push`) en `main`: `conclusion=success`.
  - Jobs observados: `Quality Gate`, `Smoke E2E` y `Deploy Production (FTPS)` en `success`.
- Workflow run `22026083056` (`workflow_dispatch`) en `main`: `conclusion=success`.
  - Jobs observados: `Quality Gate` y `Deploy Production (FTPS)` en `success`.
- Workflow run `22026104230` (`push`) en `main`: jobs `Quality Gate=success` y `Smoke E2E=success` (deploy en curso al momento de la consulta).
- Check-runs observados en `main`:
  - `Quality Gate` (`success`)
  - `Smoke E2E` (`success`)
  - `Deploy Production (FTPS)` (`in_progress` al momento de la consulta)
  - `Cloudflare Pages` (`success`, legacy/externo al flujo FTPS vigente)
- Endpoint consultado:
  - `GET /repos/AgustinMadygraf/profebustos-www/actions/workflows/ci-cd-ftps.yml/runs`
  - `GET /repos/AgustinMadygraf/profebustos-www/actions/runs/{run_id}/jobs`
  - `GET /repos/AgustinMadygraf/profebustos-www/commits/main/check-runs`

Hallazgo de performance CI/CD (2026-02-15):
- En el run `22026104230`, el paso `Deploy dist via FTPS` quedo en ejecucion ~41 minutos y termino `cancelled` por `concurrency` al iniciar un run nuevo.
- Duracion observada del paso (job `Deploy Production (FTPS)`): `2026-02-14T23:32:04Z` -> `2026-02-15T00:13:06Z`.
- Interpretacion: transferencia FTPS sin timeout estricto en el paso de deploy.

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
- Marcar `CI/CD FTPS / Quality Gate` y `CI/CD FTPS / Smoke E2E` como required checks.

Nota operativa (GitHub sin rulesets):
- Si no aparecen checks en "Require status checks to pass", primero ejecutar al menos 1 corrida del workflow sobre `main` (sin PR) para que GitHub indexe los status checks.
- Usar branch protection clasica en `main` (no requiere rulesets) y seleccionar exactamente:
  - `CI/CD FTPS / Quality Gate`
  - `CI/CD FTPS / Smoke E2E`
- En repos privados puede demorar unos minutos en aparecer el listado luego de la primera corrida.

Decision de bajo nivel (B): indexar checks sin PR
- Opcion 1: `workflow_dispatch` sobre `main` (elegida).
  - Ventaja: no altera historial de commits y deja evidencia de ejecucion.
  - Desventaja: requiere disparo manual desde la UI de Actions.
- Opcion 2: push directo a `main`.
  - Ventaja: dispara pipeline automaticamente.
  - Desventaja: agrega commits operativos sin valor funcional.
- Motivo de eleccion: menor ruido en historial y cumple objetivo de indexacion de checks.

Decision de bajo nivel (B): checks a exigir en branch protection
- Opcion 1: exigir solo checks del flujo vigente FTPS (`Quality Gate`, `Smoke E2E`) (elegida).
  - Ventaja: alinea enforcement con pipeline actual versionado en repo.
  - Desventaja: no fuerza checks legacy externos.
- Opcion 2: exigir tambien `Cloudflare Pages`.
  - Ventaja: mayor cobertura si ese flujo aun fuera relevante.
  - Desventaja: acopla merges a un flujo no vigente para deploy productivo actual.
- Motivo de eleccion: evitar dependencias heredadas y sostener como obligatorios los checks del flujo FTPS oficial.

Decision de bajo nivel (B): limitar tiempo maximo de deploy FTPS
- Opcion 1: agregar timeout de job + timeout de comando `lftp` (elegida).
  - Ventaja: evita runs colgados de larga duracion y acelera feedback ante fallas de red/FTPS.
  - Desventaja: si el deploy legitimo supera el umbral, podria cortar prematuramente.
- Opcion 2: mantener ejecucion sin timeout.
  - Ventaja: cero riesgo de corte por tiempo.
  - Desventaja: riesgo de esperas largas (>35m) y cancelaciones por `concurrency`.
- Implementacion aplicada:
  - `timeout-minutes: 20` en job `Deploy Production (FTPS)`.
  - `timeout 900 lftp ...` + `net:timeout`/`net:max-retries` para fallar rapido.

Parametros operativos confirmados:
- `FTPS_REMOTE_DIR=/public_html`
- `FTPS_PORT=21` (FTPS explicito)

Estado operativo actual:
- Pipeline CI/CD funcional y deploy FTPS operativo.
- Enforcement de merge pendiente de confirmacion final (required check visible y aplicado).
- Este pendiente no bloquea ejecucion de otros P0 funcionales, pero mantiene riesgo de gobernanza de cambios.
- Mitigacion transitoria en repo: ejecutar `npm run quality:merge` antes de cualquier merge/deploy manual.
- Verificacion de branch protection via API requiere autenticacion (respuesta actual: `401 Requires authentication`).
- Script disponible para cierre cuando haya token: `npm run ci:branch-protection:check`.

Procedimiento operativo sin PR:
1. Ir a `Actions` -> workflow `CI/CD FTPS`.
2. Ejecutar `Run workflow` sobre la rama `main`.
3. Verificar run en verde con jobs `Quality Gate` y `Smoke E2E`.
4. Ir a `Settings` -> `Branches` -> regla de `main`.
5. Activar `Require status checks to pass before merging` y seleccionar:
   - `CI/CD FTPS / Quality Gate`
   - `CI/CD FTPS / Smoke E2E`
6. Guardar y validar que ambos checks figuren como requeridos en la regla.

## 7) Minimo recomendado de checks obligatorios
Checks requeridos para PR/merge:
- `typecheck`
- `test`
- `lint:colors`
- `lint:layers`
- `test:a11y`
- `check:css`
- `smoke e2e` (`test:e2e:smoke`)

Implementacion recomendada:
- Reutilizar `npm run quality:gate` como comando unificado en CI.
- Exponer `Quality Gate` y `Smoke E2E` como status obligatorios.

## 8) DoD propuesto para cerrar DV-03
- Inventario de CI/CD documentado en repo.
- Decision de implementacion definida y aplicada (`GitHub Actions + FTPS`).
- Branch protection configurada con checks obligatorios.
- Evidencia de una corrida en `main` (`workflow_dispatch` o push) con status checks visibles.
- Confirmacion visual en GitHub de los checks requeridos activos sobre `main`.

## 9) Mensaje sugerido para Plataforma
"Implementamos CI/CD en repo con `GitHub Actions + FTPS` (`./.github/workflows/ci-cd-ftps.yml`). Necesitamos completar configuracion de GitHub: secrets FTPS, branch protection en `main` y required checks `CI/CD FTPS / Quality Gate` y `CI/CD FTPS / Smoke E2E`."
