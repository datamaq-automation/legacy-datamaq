# AGENTS.md

## Objetivo
Definir reglas operativas obligatorias para cualquier agente que trabaje en este repositorio.

## Reglas obligatorias (sin excepciones)
1. La unica fuente de verdad para prioridades y estado es `docs/todo.md`.
2. Si una tarea esta en `[ ]` o `[>]`, se ejecuta directamente sin pedir confirmaciones intermedias.
3. Solo se permite pausar para preguntar cuando exista una duda clasificada como `C` (alto nivel).
4. Todo avance de estado, evidencia, bloqueo o decision A/B/C debe quedar registrado en `docs/todo.md` en el mismo turno.
5. Si se modifica `src/` o `tests/`, se debe actualizar `docs/todo.md` y pasar el check `npm run lint:todo-sync`.
6. No revertir cambios del usuario sin instruccion explicita.
7. Si hay bloqueo externo (GitHub, VPS, legal, credenciales), documentar como `C` y ejecutar primero todas las mitigaciones internas posibles.
8. En cada turno se trabaja en bucle por prioridad (`P0` > `P1` > `P2`) hasta agotar acciones internas posibles.
9. Si aparece una duda `C`, primero se ejecutan mitigaciones internas; luego se hace exactamente 1 pregunta cerrada solo si esa respuesta destraba el trabajo dentro del turno.
10. Si el bloqueo `C` es externo y no resoluble por el usuario en el turno, no se pregunta: se documenta `C` y se continua con la siguiente tarea prioritaria.
11. El turno solo termina cuando no quedan acciones `A/B` ejecutables o existe exactamente 1 pregunta `C` pendiente para desbloqueo.

## Protocolo de arranque obligatorio (cada turno)
1. Leer `docs/todo.md`.
2. Tomar la tarea abierta de mayor prioridad (`P0` > `P1` > `P2`).
3. Clasificar la accion como `A`, `B` o `C`.
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
- No modificar codigo del alcance bloqueado.
- Registrar bloqueo, informacion faltante y mitigaciones internas en `docs/todo.md`.
- Mantener la tarea en `[ ]` o `[>]`.

Plantilla obligatoria para `C`:
- `Decision tomada (C): ...`
- `Bloqueador residual: ...`
- `Informacion faltante: ...`
- `Mitigacion interna ejecutada: ...`
- `Siguiente paso: ...`

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
- Integracion obligatoria: incluido en `quality:gate`.

## Archivos asociados (gobernanza)
- `AGENTS.md`: contrato operativo del agente.
- `docs/todo.md`: fuente de verdad de estado y evidencia.
- `scripts/check-todo-sync.mjs`: enforcement local/CI de trazabilidad.
- `package.json`: integra `lint:todo-sync` dentro de `quality:gate`.
- `./.github/workflows/ci-cd-ftps.yml`: gate remoto que ejecuta `quality:gate`.
