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
15. Si hubo cambios en `src/` o `tests/`, antes de cerrar turno se debe correr `npm run quality:merge` (runner no fail-fast), luego `npm run lint:todo-sync:merge-ready`, y registrar evidencia en `docs/todo.md`.
16. No cerrar turno mientras exista algun `P0` abierto con `Siguiente accion interna ejecutable ahora:` que sea realizable en este entorno.
17. La ultima seccion del mensaje final es obligatoria y exclusiva:
   - Si existe `C1`: `Pregunta de alto nivel` con exactamente 1 pregunta cerrada.
   - Si no existe `C1`: `Tareas externas` con bloqueadores `C2` y acciones recomendadas fuera del repo.
   - Si no hay tareas externas activas: indicar `Sin tareas externas activas`.
18. Si se modifican `src/`, `tests/`, `scripts/`, `AGENTS.md` o `package.json`, ejecutar `npm run lint:security` y registrar evidencia en `docs/todo.md`.
19. Si se modifican `src/` o `tests/`, registrar evidencia explicita de `npm run lint:test-coverage` (umbral de cobertura).
20. La politica permanente de automatizacion de tests se define en `AGENTS.md`; la ejecucion priorizada y evidencia del turno se define en `docs/todo.md`.

## Protocolo operativo por turno
1. Leer `docs/todo.md`.
2. Tomar la tarea abierta mas prioritaria.
3. Clasificar la accion como `A`, `B` o `C` (`C1`/`C2` si aplica).
4. Ejecutar cambios minimos y trazables.
5. Validar con comandos acordes al cambio.
6. Si hubo cambios en `src/`, `tests/`, `scripts/`, `AGENTS.md` o `package.json`, ejecutar `npm run lint:security`.
7. Si hubo cambios en `src/` o `tests/`, ejecutar `npm run quality:merge` para exponer en una sola corrida los fallos de `quality:gate` y `test:e2e:smoke`, y cerrar con `npm run lint:todo-sync:merge-ready`.
8. Registrar evidencia concreta (archivos, comandos, fecha) en `docs/todo.md`.
9. Si quedaron tareas `[x]` en `docs/todo.md`, ejecutar `npm run todo:archive` y volver a validar.
10. Si hay ruido operativo repetitivo (entradas de `Avance/Evidencia/Mitigacion` sin valor incremental), compactar con `npm run todo:compact:noise` y volver a validar.
11. Repetir desde el paso 2 mientras haya acciones internas ejecutables.
12. Cerrar con la seccion final obligatoria segun regla 17.

## Marco A/B/C
### A) Certeza total
- Implementar directo.
- Validar al menos con `npm run typecheck`, `npm run lint:test-coverage` y `npm run build`.
- Si hubo cambios en `src/` o `tests/`, sumar `npm run quality:merge`.
- Registrar evidencia.

### B) Duda de bajo nivel (infra/implementacion)
- Proponer 2-3 opciones breves.
- Elegir 1 con motivo tecnico corto.
- Implementar sin preguntar al usuario.
- Registrar `Decision tomada (B): ...` y evidencia.
- Circuito SB (duda de ciberseguridad de bajo nivel): comparar opciones por superficie de ataque/blast radius y elegir la de menor exposicion operativa.
- Registrar `Decision tomada (B-Seguridad): ...` cuando aplique.
- Circuito TB (duda de testing de bajo nivel): comparar opcion de prueba (unitaria/integracion/e2e/contrato), elegir la de mejor signal-to-noise y menor fragilidad.
- Registrar `Decision tomada (B-Testing): ...` cuando aplique.

### C) Duda de alto nivel
- Ejecutar mitigaciones internas primero.
- Clasificar como `C1` o `C2`.
- No modificar codigo dentro del alcance bloqueado.
- Mantener la tarea en `[ ]` o `[>]`.
- Circuito SC (duda de ciberseguridad de alto nivel): usar `C1/C2` para modelo de confianza, politicas legales, retencion de datos o credenciales maestras.
- Circuito TC (duda de testing de alto nivel): usar `C1/C2` para criterios de aceptacion de negocio, alcance de regresion requerido por producto o entornos externos no disponibles.

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

## Dimension de ciberseguridad (obligatoria)
- Principio: `least privilege` en frontend y en CI.
- En `src/`, `tests/` y `.env.example` quedan prohibidos:
  - Variables `VITE_*` con credenciales/sensibles (`SECRET`, `TOKEN`, `PASSWORD`, `API_KEY`, `CLIENT_SECRET`, `PRIVATE_KEY`, `ACCESS_KEY`).
  - Headers de autenticacion sensible en navegador (`Authorization`, `X-API-Key`, `X-Api-Key`, `X-Auth-Token`).
- Si una integracion requiere auth sensible desde cliente, clasificar primero como `C1` (decision de arquitectura) antes de implementar.
- Brechas de infraestructura externa (por ejemplo HTTPS redirect, HSTS, CSP, headers de servidor) se clasifican como `C2` con plan fuera del repo.
- Guardrails obligatorios:
  - `npm run lint:origin-verify`
  - `npm run lint:client-secrets`
  - `npm run lint:security`

## Dimension de testing (obligatoria)
- Principio: cada cambio relevante debe tener deteccion automatica de regresion proporcional al riesgo.
- Automatizacion operativa: ante fallo de `test`, `lint:test-coverage`, `test:e2e:smoke` o `lint:testing`, ejecutar ciclo detectar -> corregir -> revalidar sin pedir confirmacion intermedia.
- Alcance por defecto para autocorreccion: primero ajustar `tests/`; si no alcanza para resolver el fallo, aplicar ajuste minimo en `src/` y mantener cobertura asociada.
- Escalar por circuito `TC` solo cuando el bloqueo dependa de criterio de aceptacion de negocio o de entorno externo no disponible en este turno.
- Cobertura minima global bloqueante (sobre `coverage/coverage-summary.json`):
  - `lines >= 75%`
  - `statements >= 75%`
  - `functions >= 80%`
  - `branches >= 65%`
- Guardrails obligatorios:
  - `npm run lint:test-coverage`
  - `npm run test:e2e:smoke`
  - `npm run lint:testing`
- Si la cobertura baja de umbral, no se cierra turno hasta recuperar baseline o clasificar `C` con mitigaciones internas.
- Casos criticos (contacto, consentimiento, navegacion principal) deben mantener al menos 1 prueba automatizada estable por flujo.

## Compliance automatizado
- Comando obligatorio: `npm run lint:security`.
- Comando obligatorio: `npm run lint:test-coverage`.
- Comando obligatorio: `npm run lint:todo-sync`.
- Comando obligatorio de cierre cuando cambian `src/` o `tests/`: `npm run lint:todo-sync:merge-ready`.
- Regla base: falla si hay cambios en `src/` o `tests/` sin cambios en `docs/todo.md`.
- Regla estricta: si hay cambios en `src/` o `tests/`, `docs/todo.md` debe incluir trazabilidad explicita (`Evidencia`, `Avance`, `Decision`, `Bloqueador`, `Siguiente paso` o `Clasificacion`).
- Regla `P0` abierta (`--require-open-p0`): exige `Siguiente accion interna ejecutable ahora`; si hay `Decision tomada (C)` exige `Tipo C`; y para `Tipo C: C1` exige pregunta cerrada pendiente.
- Regla de limpieza (`--require-no-done-tasks`): falla si `docs/todo.md` contiene tareas `[x]`; se deben mover con `npm run todo:archive`.
- Compactacion de ruido: `npm run todo:compact:noise` es manual (no bloqueante) para mover historial repetitivo a `docs/todo.done.YYYY-MM.md`.
- Regla de no mutacion en gate: `quality:gate` valida; no debe ejecutar scripts que editen `docs/todo.md`.
- Regla de merge-ready local (`--require-merge-evidence`): si cambian `src/` o `tests/`, `docs/todo.md` debe incluir evidencia de `npm run quality:merge` (o `quality:gate` + `test:e2e:smoke`).
- Integracion obligatoria local y CI: usar los mismos flags de compliance para evitar desalineaciones.
- Regla de seguridad cliente: `lint:client-secrets` falla si detecta secretos `VITE_*` o headers sensibles en frontend.
- Regla de cobertura: `lint:test-coverage` falla si la cobertura global cae por debajo de umbrales definidos en `scripts/test-coverage-thresholds.json`.

## Archivos asociados
- `AGENTS.md`: contrato operativo.
- `docs/todo.md`: estado y evidencia.
- `docs/todo.done.YYYY-MM.md`: archivo mensual de tareas cerradas e historial movido desde `docs/todo.md`.
- `scripts/check-todo-sync.mjs`: enforcement local/CI.
- `scripts/check-origin-verify-leaks.mjs`: guardrail de no regresion para secreto/header legado en frontend.
- `scripts/check-client-secrets.mjs`: enforcement local/CI para evitar exposicion de secretos y headers sensibles en cliente.
- `scripts/check-test-coverage.mjs`: valida umbrales minimos de cobertura global.
- `scripts/test-coverage-thresholds.json`: umbrales de cobertura bloqueantes del repositorio.
- `scripts/archive-todo-completed.mjs`: automatiza archivo de tareas `[x]` desde `docs/todo.md` a `docs/todo.done.YYYY-MM.md`.
- `scripts/compact-todo-noise.mjs`: compacta ruido operativo repetitivo desde `docs/todo.md` hacia `docs/todo.done.YYYY-MM.md`.
- `scripts/run-quality-merge.mjs`: ejecuta `quality:gate` y `test:e2e:smoke` sin fail-fast para detectar desalineaciones locales antes de push.
- `package.json`: integra `lint:security` + `lint:test-coverage` + `lint:todo-sync` dentro de `quality:gate` y expone `todo:archive`/`todo:compact:noise` + `lint:todo-sync:merge-ready`.
- `./.github/workflows/ci-cd-ftps.yml`: gate remoto.
