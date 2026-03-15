# Agenda de Tareas Frontend (`docs/todo.md`)

Backlog activo. Las tareas cerradas se registran en `docs/todo.done.md`.

## Tareas Pendientes

- [ ] [GHA][ALTA] Agregar diagnostico en fallo para `CI / Quality` job `quality-fast`
  - Archivo: `.github/workflows/ci.yml`
  - Accion: anadir paso `if: failure()` con contexto de runner/workspace y subida de artefactos de debug (`retention-days: 7`).
  - Criterio de cierre: al fallar intencionalmente el job, se adjunta artifact de debug y se registran grupos de contexto en logs.

- [ ] [GHA][ALTA] Agregar diagnostico en fallo para `CI / Quality` job `quality-nightly-gate`
  - Archivo: `.github/workflows/ci.yml`
  - Accion: anadir bloque de debug en error (environment snapshot + artifacts) equivalente al patron usado en `cd.yml`.
  - Criterio de cierre: un fallo en `quality:gate` deja evidencia de depuracion descargable desde Actions.

- [ ] [GHA][MEDIA] Agregar debug minimo a `CI / Workflows Lint` (`actionlint`)
  - Archivo: `.github/workflows/ci-workflows-lint.yml`
  - Accion: incorporar pasos `if: failure()` para contexto y upload de artefactos (salida/metadata de lint si existe).
  - Criterio de cierre: fallos de `actionlint` quedan trazables sin reruns manuales.

- [ ] [GHA][MEDIA] Evaluar split del job monolitico `quality-nightly-gate`
  - Archivo: `.github/workflows/ci.yml`
  - Accion: proponer division por dominios (`security`, `unit/coverage`, `a11y/e2e`, `layers/css`) con `needs` y artefactos intermedios solo donde aporte valor.
  - Criterio de cierre: ADR o decision tecnica registrada y PR con nuevo pipeline o descarte justificado.

## Dudas de Alto Nivel (Registradas en docs/decisions/)

Ver `docs/decisions/preguntas-arquitectura.md` para decisiones arquitectonicas pendientes.
