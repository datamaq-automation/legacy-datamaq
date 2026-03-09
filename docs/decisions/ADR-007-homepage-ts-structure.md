# ADR-007: Estructura de HomePage.ts - Mantener Cohesión

## Estado
- **Fecha**: 2026-03-09
- **Estado**: Aceptada
- **Decisores**: Usuario + Agente

## Contexto

El archivo `src/ui/pages/HomePage.ts` contiene 267 líneas con la función `useHomePage()` y múltiples helpers. La pregunta planteada fue si extraer los mapeadores a un archivo separado (`homePageMappers.ts`) para reducir complejidad y mejorar el cumplimiento del principio SRP (Single Responsibility Principle).

El archivo actual contiene:
- Composable principal `useHomePage()` (160 líneas)
- Funciones helper específicas (`buildQuickLinks`, `buildDockLinks`, etc.)
- Constantes de mapeo (iconos, keywords, variantes)
- Un comentario TODO: *"Si aparece una tercera variante, evaluar estrategia inyectable"*

## Decisión

**Opción seleccionada**: **B - Mantener en archivo actual por cohesión funcional**

No realizar cambios estructurales en `HomePage.ts`.

### Justificación

1. **Cohesión temática ganada > Tamaño arbitrario**
   - Las funciones helper (`buildQuickLinks`, `buildDockLinks`, etc.) son **específicas de HomePage** y no tienen reuso potencial.
   - Extraerlas crearía acoplamiento artificial entre archivos sin beneficio real.

2. **El código anticipa su propio refactor futuro**
   - El comentario `SOLID-DEBATE` en línea 15 ya identifica el punto de inflexión: *"Si aparece una tercera variante, evaluar estrategia inyectable"*.
   - Con 2 variantes (`direct` | `authority`), el branching actual es suficiente.

3. **267 líneas es manejable**
   - No se compara con archivos realmente grandes (ej: `HomePage.vue` con 1,276 líneas documentado en ADR-003).
   - El archivo está bien estructurado: composable arriba, helpers abajo, constantes agrupadas.

4. **Riesgo no justifica beneficio**
   - Un refactor podría romper la detección de variantes o el mapeo de links.
   - No hay bugs ni problemas de performance que resolver.

5. **Precedente establecido en ADR-006**
   - La decisión de mantener archivos grandes por cohesión (quoteApiGateway.ts, contactHooks.ts) ya fue aceptada.
   - El criterio cohesión > tamaño se mantiene consistente.

## Consecuencias

### Positivas
- Sin riesgo de regressión
- Sin esfuerzo de refactorización
- Cohesión funcional preservada
- Código más fácil de seguir (todo en un archivo)

### Negativas / Trade-offs
- SRP teóricamente violado (pragmatismo > pureza)
- Testing unitario de helpers requiere importar todo el composable
- Si crece mucho (>400 líneas), será necesario reconsiderar

## Límites de Reconsideración

Reabrir esta decisión si:
- Se agrega una **tercera variante** de página (trigger el comentario SOLID-DEBATE)
- El archivo supera **400 líneas**
- Los helpers necesitan ser **reutilizados** en otra página

## Alternativas Rechazadas

### Opción A: Extraer mapeadores a archivo separado
**Por qué se rechazó**: Los helpers son específicos de HomePage, no reusables. Crear `homePageMappers.ts` fragmentaría la cohesión sin beneficio real.

### Opción C: Extraer a composables especializados
**Por qué se rechazó**: Overkill para el caso de uso. Crear `useHomeNavigation()`, `useHomeVariant()`, etc. aumentaría la complejidad sin mejorar la mantenibilidad. Solo se usarían en HomePage.

## Implementación

**Plan de acción**: No se requieren cambios.

**Validación**: 
```bash
npm run typecheck  # ✅ Debe pasar
npm run lint:layers  # ✅ Debe pasar
```

## Notas

- El comentario `SOLID-DEBATE` en el código actúa como trigger para futuros refactors.
- Esta decisión es consistente con ADR-006 (TypeScript Files Cohesion).
- El archivo `landingNavigation.ts` ya existe para mapeo de navegación compartido.
