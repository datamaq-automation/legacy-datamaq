# Decisiones Arquitectonicas Pendientes

*Este archivo contiene solo preguntas activas. Las resueltas se mueven a ADRs y se eliminan de aqui.*

---

### [2026-03-15] Split de `quality-nightly-gate` en CI
- **Contexto**: el job `quality-nightly-gate` en `.github/workflows/ci.yml` corre `npm run quality:gate` de forma monolitica con `timeout-minutes: 45`, lo que reduce paralelismo y granularidad de fallos.
- **Pregunta**: conviene dividir el nightly gate en jobs especializados (`security`, `unit/coverage`, `a11y/e2e`, `layers/css`) o mantener un gate unico por simplicidad operativa.
- **Opciones consideradas**:
  - Mantener job monolitico actual.
  - Dividir en multiples jobs con `needs` y artefactos cuando aplique.
- **Decision**: (pendiente - escalado desde `docs/todo.md`)
- **ADR resultante**: (pendiente)
