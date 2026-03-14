# Roadmap de Migracion por Features

Fecha: 2026-03-14

## Objetivo

Cerrar deuda tecnica de ubicacion de modulos UI que aun funcionan como bridge
hasta completar migracion a estructura por feature.

## Alcance Inicial

### ITEM-1: Quote bridge en `src/ui/pages/quoteWebState.ts`
- Estado actual: re-export temporal de snapshot storage.
- Objetivo: mover consumo directo a `src/features/quote/ui` y eliminar bridge.
- Criterio de done:
  - no quedan imports productivos desde `src/ui/pages/quoteWebState.ts`;
  - se elimina archivo bridge o queda sin uso y fuera del flujo principal;
  - tests de quote web siguen pasando.

### ITEM-2: `ContactFormSection.vue` en ubicacion transitoria
- Estado actual: componente en `src/ui/features/contact/` con nota de migracion.
- Objetivo: definir ubicacion final (feature/ui o page-specific) y ajustar imports.
- Criterio de done:
  - componente y companion logic quedan en la capa acordada;
  - imports internos respetan boundaries existentes;
  - tests de contacto siguen pasando.

## Politica de Ejecucion

- Aplicar migracion de manera incremental, junto a cambios funcionales relacionados.
- Evitar refactor masivo sin trigger de producto o arquitectura.
- Mantener trazabilidad en `docs/todo.md` hasta cierre de cada item.
