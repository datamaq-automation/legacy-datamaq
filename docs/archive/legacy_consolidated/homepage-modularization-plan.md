# Plan de Modularizacion Incremental - HomePage

Fecha: 2026-03-14

## Contexto

`src/ui/pages/HomePage.vue` mantiene alta cohesion funcional pero su tamano eleva
el costo de lectura y revision.

Este plan sigue ADR-011: cambios incrementales, de bajo riesgo y activados por
necesidad real.

## Objetivo

Reducir complejidad percibida sin refactor masivo ni regresiones visuales.

## Etapas Propuestas

### Etapa 1 - Extracciones presentacionales (bajo riesgo)
- Crear componente para bloque FAQ (solo render, sin logica de negocio).
- Crear componente para bloque de quick links del footer.
- Criterio de done:
  - HomePage consume los nuevos componentes sin cambios de comportamiento.
  - Tests existentes siguen verdes.

### Etapa 2 - Encapsular fragmentos repetitivos
- Extraer tarjetas de trust signals y/o authority highlights si comparten patron.
- Criterio de done:
  - props tipadas desde `src/domain/types/content`.
  - sin acoplar componentes a container/infra.

### Etapa 3 - Consolidacion de handlers UI
- Mantener `useHomePage()` como orquestador y mover handlers puramente visuales
  a utilidades de pagina cuando aplique.
- Criterio de done:
  - no aumenta fan-in ni dependencias cruzadas.
  - no se rompe `lint:layers`.

## Reglas de Ejecucion

- No mezclar extraccion estructural con cambios de negocio en el mismo commit.
- Cada extraccion debe cerrar con validacion minima:
  - `npm run typecheck`
  - tests unitarios impactados
- Si aparece regressión visual, revertir slice y reintentar con menor alcance.
