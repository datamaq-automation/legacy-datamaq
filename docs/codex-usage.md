# Uso de Codex en este repositorio

## Objetivo
Definir como iniciar una conversacion con Codex para que aplique `AGENTS.md` y opere con `docs/todo.md` como fuente de verdad.

## Precondiciones
1. Abrir Codex con `cwd` en la raiz del repo.
2. Confirmar que existe `AGENTS.md` en la raiz.
3. Confirmar que `docs/todo.md` esta actualizado.

## Prompt recomendado de inicio
Usar este texto al comenzar cada sesion:

```text
Aplica AGENTS.md para este repo. Usa docs/todo.md como unica fuente de verdad.
Ejecuta la tarea abierta mas prioritaria (P0 > P1 > P2) con marco A/B/C.
Trabaja en bucle de forma ininterrumpida y no pidas confirmaciones intermedias salvo duda C1.
Actualiza docs/todo.md en el mismo turno con avance, evidencia (archivos/comandos/fecha), bloqueadores y siguiente paso.
La ultima seccion del mensaje final debe ser: "Pregunta de alto nivel" (exactamente 1 pregunta cerrada) si hay C1; si no hay C1, "Tareas externas" con C2 y acciones fuera del repo (o "Sin tareas externas activas").
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
4. Se actualizo `docs/todo.md` con evidencia concreta.
5. Si hubo bloqueo externo, quedo documentado como C.
6. Si hubo pregunta al usuario, quedo clasificada como C1 y fue exactamente una pregunta cerrada.
7. La ultima seccion del mensaje final cumple la regla de `Pregunta de alto nivel` o `Tareas externas`.

## Notas
- `AGENTS.md` define reglas operativas; `README.md` solo referencia esta guia.
- Si el agente se desvia, repetir el prompt recomendado de inicio y pedir trazabilidad explicita en `docs/todo.md`.
