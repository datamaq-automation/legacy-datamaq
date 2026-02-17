# Uso de Codex en este repositorio

## Objetivo
Definir como iniciar una conversacion con Codex para que aplique `AGENTS.md` y opere con `docs/todo.md` como fuente de verdad.

## Precondiciones
1. Abrir Codex con `cwd` en la raiz del repo.
2. Confirmar que existe `AGENTS.md` en la raiz.
3. Confirmar que `docs/todo.md` esta actualizado.

## Prompt recomendado de inicio (operativo)
Usar este texto al comenzar cada sesion:

```text
Aplica AGENTS.md para este repo. Usa docs/todo.md como unica fuente de verdad.
Ejecuta la tarea abierta mas prioritaria (P0 > P1 > P2) con marco A/B/C.
Trabaja en bucle de forma ininterrumpida y no pidas confirmaciones intermedias salvo duda C1.
Actualiza docs/todo.md en el mismo turno con avance, evidencia (archivos/comandos/fecha), bloqueadores y siguiente paso.
Si se toca UI/tests-e2e, ejecuta y registra validacion responsive secuencial obligatoria:
1) XS 2) SM 3) MD 4) LG.
No avances de etapa si la anterior no esta en verde.
Luego ejecuta quality:mobile y quality:merge segun AGENTS.md.
Manten docs/todo.md sin ruido: solo decisiones vigentes, ultimo intento tecnico, bloqueador residual y siguiente accion interna ejecutable ahora.
La ultima seccion del mensaje final debe ser: "Pregunta de alto nivel" (exactamente 1 pregunta cerrada) si hay C1; si no hay C1, "Tareas externas" con C2 y acciones fuera del repo (o "Sin tareas externas activas").
```

## Prompt recomendado de inicio (UX secuencial)
Usar esta variante cuando el foco sea UI/UX:

```text
Aplica AGENTS.md usando docs/todo.md como unica fuente de verdad.
Trabaja mobile-first secuencial: XS -> SM -> MD -> LG, sin saltar etapas.
En cada etapa: diagnostica, implementa cambios minimos trazables, valida, registra evidencia y recien luego pasa a la siguiente.
No pidas confirmaciones intermedias salvo C1.
Si aparece ruido operativo en docs/todo.md, compactalo con todo:compact:noise y deja solo estado activo.
```

## Variante para auditoria/revision
Si se quiere una revision en lugar de implementar:

```text
Aplica AGENTS.md y revisa el estado actual contra docs/todo.md.
Entrega hallazgos por severidad y evidencia concreta (archivo:linea).
No propongas cambios fuera de alcance sin clasificacion A/B/C.
```

## Checklist rapido (antes de cerrar un turno)
1. Se aplico una tarea abierta de `docs/todo.md`.
2. Se uso clasificacion A/B/C.
3. Se ejecutaron validaciones acordes al cambio.
4. Si hubo cambios de UI/tests-e2e: `quality:responsive` en orden `XS -> SM -> MD -> LG`.
5. Se actualizo `docs/todo.md` con evidencia concreta y sin ruido repetitivo.
6. Si hubo ruido, se corrio `npm run todo:compact:noise`.
7. Si hubo cambios en `src/` o `tests/`: `quality:merge` + `lint:todo-sync:merge-ready`.
8. Si hubo bloqueo externo, quedo documentado como C.
9. Si hubo pregunta al usuario, quedo clasificada como C1 y fue exactamente una pregunta cerrada.
10. La ultima seccion del mensaje final cumple la regla de `Pregunta de alto nivel` o `Tareas externas`.

## Notas
- `AGENTS.md` define reglas operativas; `README.md` solo referencia esta guia.
- Si el agente se desvia, repetir el prompt recomendado de inicio y pedir trazabilidad explicita en `docs/todo.md`.
