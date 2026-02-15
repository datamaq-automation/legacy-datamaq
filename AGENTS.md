# AGENTS.md

## Objetivo
Definir un contrato operativo claro para que el agente trabaje de forma ininterrumpida y trazable.

## Politica de continuidad (obligatoria)
1. La unica fuente de verdad para prioridades y estado es `docs/todo.md`.
2. Siempre se ejecuta la tarea abierta de mayor prioridad (`P0` > `P1` > `P2`) y, dentro de la misma prioridad, en orden de aparicion en `docs/todo.md`.
3. No se piden confirmaciones intermedias. Solo se pausa con una duda `C1`.
4. El trabajo corre en bucle hasta agotar acciones internas ejecutables en el entorno actual.
5. `C1` aplica cuando falta una decision de alto nivel (nucleo funcional: entidades, reglas de negocio, casos de uso) o una definicion externa indispensable para continuar en el turno.
6. `C2` aplica a bloqueos externos no resolubles en el turno (por ejemplo: branch protection en GitHub, despliegue backend/VPS, credenciales, legal).
7. Antes de clasificar `C1` o `C2`, se ejecutan primero todas las mitigaciones internas posibles.
8. Si hay `C1`, se hace exactamente 1 pregunta cerrada. Formatos permitidos: `Si/No`, opcion unica (`A/B/C`) o multiple choice de seleccion multiple.
9. Todo avance, decision, bloqueo y evidencia se registra en `docs/todo.md` en el mismo turno.
10. No revertir cambios del usuario sin instruccion explicita.
11. Si se modifica `src/` o `tests/`, es obligatorio actualizar `docs/todo.md` y pasar `npm run lint:todo-sync`.
12. `docs/todo.md` se mantiene como tablero activo: no debe acumular tareas `[x]` ni historial repetitivo de seguimiento.
13. Si hay tareas `[x]` en `docs/todo.md`, se deben archivar en `docs/todo.done.YYYY-MM.md` con `npm run todo:archive` en el mismo turno.
14. `quality:gate` es solo validacion; no debe ejecutar comandos que muten `docs/todo.md` (por ejemplo `todo:archive` o `todo:compact:noise`).
15. No cerrar turno mientras exista algun `P0` abierto con `Siguiente accion interna ejecutable ahora:` que sea realizable en este entorno.
16. La ultima seccion del mensaje final es obligatoria y exclusiva:
   - Si existe `C1`: `Pregunta de alto nivel` con exactamente 1 pregunta cerrada.
   - Si no existe `C1`: `Tareas externas` con bloqueadores `C2` y acciones recomendadas fuera del repo.
   - Si no hay tareas externas activas: indicar `Sin tareas externas activas`.

## Protocolo operativo por turno
1. Leer `docs/todo.md`.
2. Tomar la tarea abierta mas prioritaria.
3. Clasificar la accion como `A`, `B` o `C` (`C1`/`C2` si aplica).
4. Ejecutar cambios minimos y trazables.
5. Validar con comandos acordes al cambio.
6. Registrar evidencia concreta (archivos, comandos, fecha) en `docs/todo.md`.
7. Si quedaron tareas `[x]` en `docs/todo.md`, ejecutar `npm run todo:archive` y volver a validar.
8. Si hay ruido operativo repetitivo (entradas de `Avance/Evidencia/Mitigacion` sin valor incremental), compactar con `npm run todo:compact:noise` y volver a validar.
9. Repetir desde el paso 2 mientras haya acciones internas ejecutables.
10. Cerrar con la seccion final obligatoria segun regla 16.

## Marco A/B/C
### A) Certeza total
- Implementar directo.
- Validar al menos con `npm run typecheck`, `npm run test` y `npm run build` (o `npm run quality:merge`).
- Registrar evidencia.

### B) Duda de bajo nivel (infra/implementacion)
- Proponer 2-3 opciones breves.
- Elegir 1 con motivo tecnico corto.
- Implementar sin preguntar al usuario.
- Registrar `Decision tomada (B): ...` y evidencia.

### C) Duda de alto nivel
- Ejecutar mitigaciones internas primero.
- Clasificar como `C1` o `C2`.
- No modificar codigo dentro del alcance bloqueado.
- Mantener la tarea en `[ ]` o `[>]`.

Plantilla obligatoria para `C`:
- `Decision tomada (C): ...`
- `Tipo C: C1|C2`
- `Bloqueador residual: ...`
- `Informacion faltante: ...`
- `Mitigacion interna ejecutada: ...`
- `Pregunta cerrada pendiente (solo C1): ...`
- `Tareas externas (solo C2 y acciones fuera del repo): ...`
- `Siguiente paso: ...`
- `Siguiente accion interna ejecutable ahora: ...`

## Politicas de dominio vigentes
- Consentimiento: `hard revoke`.
- Al pasar a `denied`: bloquear tracking futuro, propagar denegacion a proveedores y limpiar cookies first-party de analytics en modalidad best-effort.
- Referencia: `docs/dv-01-consent-matrix.md`.

## Compliance automatizado
- Comando obligatorio: `npm run lint:todo-sync`.
- Regla base: falla si hay cambios en `src/` o `tests/` sin cambios en `docs/todo.md`.
- Regla estricta: si hay cambios en `src/` o `tests/`, `docs/todo.md` debe incluir trazabilidad explicita (`Evidencia`, `Avance`, `Decision`, `Bloqueador`, `Siguiente paso` o `Clasificacion`).
- Regla `P0` abierta (`--require-open-p0`): exige `Siguiente accion interna ejecutable ahora`; si hay `Decision tomada (C)` exige `Tipo C`; y para `Tipo C: C1` exige pregunta cerrada pendiente.
- Regla de limpieza (`--require-no-done-tasks`): falla si `docs/todo.md` contiene tareas `[x]`; se deben mover con `npm run todo:archive`.
- Compactacion de ruido: `npm run todo:compact:noise` es manual (no bloqueante) para mover historial repetitivo a `docs/todo.done.YYYY-MM.md`.
- Regla de no mutacion en gate: `quality:gate` valida; no debe ejecutar scripts que editen `docs/todo.md`.
- Integracion obligatoria local y CI: usar los mismos flags de compliance para evitar desalineaciones.

## Archivos asociados
- `AGENTS.md`: contrato operativo.
- `docs/todo.md`: estado y evidencia.
- `docs/todo.done.YYYY-MM.md`: archivo mensual de tareas cerradas e historial movido desde `docs/todo.md`.
- `scripts/check-todo-sync.mjs`: enforcement local/CI.
- `scripts/archive-todo-completed.mjs`: automatiza archivo de tareas `[x]` desde `docs/todo.md` a `docs/todo.done.YYYY-MM.md`.
- `scripts/compact-todo-noise.mjs`: compacta ruido operativo repetitivo desde `docs/todo.md` hacia `docs/todo.done.YYYY-MM.md`.
- `package.json`: integra `lint:todo-sync` dentro de `quality:gate` y expone `todo:archive`/`todo:compact:noise`.
- `./.github/workflows/ci-cd-ftps.yml`: gate remoto.
