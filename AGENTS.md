# AGENTS.md

## Objetivo
Definir reglas operativas obligatorias para cualquier agente que trabaje en este repositorio.

## Reglas obligatorias (sin excepciones)
1. La unica fuente de verdad para prioridades y estado es `docs/todo.md`.
2. Si una tarea esta en `[ ]` o `[>]`, se ejecuta directamente sin pedir confirmaciones intermedias.
3. Solo se permite pausar para preguntar cuando exista una duda clasificada como `C1` (alto nivel resoluble en el turno).
4. Todo avance de estado, evidencia, bloqueo o decision A/B/C debe quedar registrado en `docs/todo.md` en el mismo turno.
5. Si se modifica `src/` o `tests/`, se debe actualizar `docs/todo.md` y pasar el check `npm run lint:todo-sync`.
6. No revertir cambios del usuario sin instruccion explicita.
7. Si hay bloqueo externo (GitHub, VPS, legal, credenciales), documentar como `C` y ejecutar primero todas las mitigaciones internas posibles.
8. En cada turno se trabaja en bucle por prioridad (`P0` > `P1` > `P2`) hasta agotar acciones internas posibles.
9. Si aparece una duda `C`, primero se ejecutan mitigaciones internas y luego se clasifica explicitamente como `C1` o `C2`.
10. `C1`: bloqueo de alto nivel resoluble dentro del turno con 1 dato/decision del usuario; se hace exactamente 1 pregunta cerrada.
11. `C2`: bloqueo externo no resoluble en el turno; no se pregunta, se documenta y se continua con la siguiente tarea prioritaria.
12. Toda tarea abierta `P0` en `docs/todo.md` debe incluir `Siguiente accion interna ejecutable ahora: ...`.
13. Si una tarea abierta `P0` incluye `Decision tomada (C):`, debe incluir tambien `Tipo C: C1` o `Tipo C: C2`.
14. Si `Tipo C: C1`, la tarea debe incluir `Pregunta cerrada pendiente (solo C1): ...`.
15. No cerrar turno mientras exista algun `P0` abierto con `Siguiente accion interna ejecutable ahora` ejecutable en este entorno.
16. El turno solo termina cuando no quedan acciones internas ejecutables o existe exactamente 1 pregunta cerrada `C1` pendiente para desbloqueo.

## Protocolo de arranque obligatorio (cada turno)
1. Leer `docs/todo.md`.
2. Tomar la tarea abierta de mayor prioridad (`P0` > `P1` > `P2`).
3. Clasificar la accion como `A`, `B` o `C` (y `C1`/`C2` si aplica).
4. Ejecutar cambios minimos y trazables.
5. Validar con comandos segun el tipo de cambio.
6. Registrar evidencia concreta en `docs/todo.md` (archivos + comandos + fecha).
7. Repetir desde el paso 2 mientras existan acciones internas ejecutables de la misma prioridad.

## Marco de decision (A/B/C)
### A) Certeza total
- Implementar completo.
- Validar al menos con `npm run typecheck`, `npm run test` y `npm run build` (o equivalente mas estricto como `npm run quality:merge`).
- Registrar evidencia en `docs/todo.md`.

### B) Duda de bajo nivel
- Proponer 2-3 opciones con ventajas/desventajas.
- Elegir 1 opcion con motivo breve.
- Implementar.
- Registrar `Decision tomada (B)` y evidencia en `docs/todo.md`.

### C) Duda de alto nivel
- Clasificar como `C1` o `C2` despues de ejecutar mitigaciones internas.
- `C1`: desbloqueable en el turno con exactamente 1 pregunta cerrada.
- `C2`: bloqueo externo no resoluble en el turno; no preguntar.
- No modificar codigo del alcance bloqueado.
- Registrar bloqueo, informacion faltante y mitigaciones internas en `docs/todo.md`.
- Mantener la tarea en `[ ]` o `[>]`.

Plantilla obligatoria para `C`:
- `Decision tomada (C): ...`
- `Tipo C: C1|C2`
- `Bloqueador residual: ...`
- `Informacion faltante: ...`
- `Mitigacion interna ejecutada: ...`
- `Pregunta cerrada pendiente (solo C1): ...`
- `Siguiente paso: ...`
- `Siguiente accion interna ejecutable ahora: ...`

## Regla para cambios de politica (consentimiento/seguridad)
Cuando cambie una decision de politica:
1. Actualizar documentacion `*.md` relevante.
2. Implementar runtime en codigo.
3. Agregar/ajustar tests.
4. Ejecutar validaciones (`npm run typecheck`, `npm run test`, y si aplica `npm run build`).
5. Dejar trazabilidad en `docs/todo.md`.

## Politica de consentimiento vigente
- Se adopta `hard revoke`.
- Al pasar a `denied`: bloquear tracking futuro, propagar consentimiento denegado a proveedores y limpiar cookies first-party de analytics en modalidad best-effort.
- Referencia: `docs/dv-01-consent-matrix.md`.

## Compliance automatizado
- Comando: `npm run lint:todo-sync`
- Regla base: falla si hay cambios en `src/` o `tests/` sin cambios en `docs/todo.md`.
- Regla estricta: si hay cambios en `src/` o `tests/`, `docs/todo.md` debe incluir trazabilidad explicita (por ejemplo `Evidencia:`, `Avance:`, `Decision tomada (A/B/C):`, `Bloqueador residual:`, `Siguiente paso:` o `Clasificacion A/B/C aplicada en:`).
- Regla `P0` abierta: con `--require-open-p0`, falla si una tarea `P0` abierta no declara `Siguiente accion interna ejecutable ahora`, o si una `Decision tomada (C)` no declara `Tipo C`, o si `Tipo C: C1` no declara pregunta cerrada pendiente.
- Integracion obligatoria: incluido en `quality:gate`.

## Archivos asociados (gobernanza)
- `AGENTS.md`: contrato operativo del agente.
- `docs/todo.md`: fuente de verdad de estado y evidencia.
- `scripts/check-todo-sync.mjs`: enforcement local/CI de trazabilidad.
- `package.json`: integra `lint:todo-sync` dentro de `quality:gate`.
- `./.github/workflows/ci-cd-ftps.yml`: gate remoto que ejecuta `quality:gate`.
