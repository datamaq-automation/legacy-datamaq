# AGENT.md

## Objetivo
Este archivo define el comportamiento operativo del agente dentro de este repositorio.

## Fuente de verdad
- La unica fuente de verdad para priorizacion/estado de trabajo es `docs/todo.md`.
- Cualquier cambio de estado debe quedar reflejado en `docs/todo.md`.

## Marco de decision (A/B/C)
Para cada tarea abierta (`[ ]` pendiente o `[>]` en proceso) en `docs/todo.md`.
Las tareas `[x]` se consideran cerradas y no requieren ejecucion adicional.

### A) Certeza total
- Implementar completo.
- Validar con comandos razonables (`typecheck`, `test`, `build` o equivalentes).
- Registrar evidencia concreta (archivos y comandos) en `docs/todo.md`.

### B) Duda de bajo nivel
- Proponer 2-3 opciones.
- Listar ventajas/desventajas.
- Elegir una opcion con motivo breve.
- Implementar la opcion elegida.
- Dejar nota de "Decision tomada (B)" en `docs/todo.md`.

### C) Duda de alto nivel
- No modificar codigo relacionado.
- Registrar bloqueo/duda y la informacion faltante en `docs/todo.md`.
- Mantener tarea en `[ ]` o `[>]`.

## Regla para cambios de politica (consentimiento/seguridad)
Cuando cambie una decision de politica:
1. Actualizar documentacion `*.md` relevante.
2. Implementar runtime necesario en codigo.
3. Agregar/ajustar tests.
4. Ejecutar validaciones (`npm run typecheck`, `npm run test`, y si aplica `npm run build`).
5. Dejar trazabilidad en `docs/todo.md` (estado, evidencia, bloqueadores).

## Politica de consentimiento vigente
- Se adopta `hard revoke`.
- Al pasar a `denied`: bloquear tracking futuro, propagar consentimiento denegado a proveedores y limpiar cookies first-party de analytics en modalidad best-effort.
- Referencia: `docs/dv-01-consent-matrix.md`.

## Restricciones operativas
- No hacer refactors grandes fuera de alcance.
- Cambios minimos y trazables.
- No revertir cambios del usuario sin instruccion explicita.
- Si aparece bloqueo externo (GitHub settings, backend VPS, legal), documentar como C.
- Persistencia obligatoria: continuar ejecutando trabajo en el repo sin detenerse por confirmaciones intermedias.
- Solo detener la ejecucion para preguntar cuando exista una duda C (alto nivel) que bloquee decisiones de alcance/negocio/arquitectura.
- Si hay bloqueos externos, agotar primero todas las mitigaciones y avances internos posibles antes de pedir input.
