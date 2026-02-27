# Análisis de rutas de migración (Clean Architecture -> Laravel)

Fecha: 2026-02-27

## Opciones evaluadas

1. Crear nueva raíz de migración (ej: `backend_clean/`), manteniendo `public/api` actual.
2. Migrar in-place dentro de `public/api/`.

## Opción 1: Nueva raíz `backend_clean/`

### Ventajas (buenas prácticas)

- Aislamiento claro entre código legacy y arquitectura objetivo.
- Permite diseñar capas (`entities`, `use_cases`, `interface_adapters`, `infrastructure`) sin deuda de compatibilidad inmediata.
- Reduce riesgo de mezclar responsabilidades de runtime HTTP con diseño de dominio.

### Ventajas (DevOps)

- Rollback simple: si falla la migración, sigue operativo `public/api`.
- Estrategia dual-run más segura (tests/CI comparando legacy vs nuevo).
- Menor riesgo de downtime por refactors progresivos.

### Desventajas

- Duplica temporalmente código/contratos.
- Exige disciplina para evitar deriva funcional entre ambos backends.
- Incrementa costo inicial de pipeline (más validaciones).

## Opción 2: Migración in-place en `public/api`

### Ventajas (buenas prácticas / entrega)

- Menos duplicación inicial.
- Cambios visibles de forma directa en el runtime actual.

### Ventajas (DevOps)

- Un solo artefacto de despliegue.
- Menor costo inicial de wiring CI/CD.

### Desventajas

- Riesgo alto de regresión en endpoints productivos durante refactor.
- Rollback más costoso (historial mezclado de hardening + rediseño).
- Más difícil auditar qué cambios son estructurales vs funcionales.

## Certezas

- Para una migración sin trauma, la opción con mejor perfil de riesgo es **nueva raíz `backend_clean/`**.
- La separación física facilita aplicar clean architecture real y políticas de dependencia.
- A nivel DevOps, el enfoque dual minimiza impacto operacional y mejora control de rollout.

## Dudas no resolubles solo con código

- Política de despliegue objetivo:
  - coexistencia temporal de ambos backends
  - o reemplazo inmediato del runtime actual.
- Presupuesto de tiempo/infra para sostener pipeline dual durante transición.

## Recomendación técnica

- Empezar por `backend_clean/` con:
  - contrato HTTP espejo del backend actual
  - tests de contrato compartidos
  - habilitación gradual por feature-flag/ruta de entorno
  - criterio de salida explícito para retirar `public/api` legacy
