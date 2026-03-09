# ADR-009: Estructura de QuotePage.vue - Mantener Monolito

## Estado
- **Fecha**: 2026-03-09
- **Estado**: Aceptada
- **Decisores**: Usuario + Agente

## Contexto

El archivo `src/ui/pages/QuotePage.vue` tiene 601 líneas y contiene un formulario wizard de cotización con:
- Manejo de estado del formulario (reactive)
- Validación de campos
- Generación de quote (API call)
- Descarga de PDF
- Webview de resultado
- Integración con WhatsApp

El componente tiene un comentario SOLID-DEBATE en línea 34:
> *"Evaluar extraer el workflow generate/download/webview a un composable dedicado inyectable."*

QuotePage.vue es similar en tamaño a ContactFormSection.vue (641 líneas), el cual fue documentado en ADR-004 con decisión de extraer el stepper.

## Decisión

**Opción seleccionada**: **C - Mantener monolito (por ahora)**

No realizar cambios estructurales en QuotePage.vue en este momento.

### Justificación

1. **El código anticipa su propio refactor futuro**
   - El comentario SOLID-DEBATE identifica exactamente qué extraer cuando sea necesario
   - Similar al patrón en HomePage.ts (comentario para tercera variante)
   - El TODO está documentado y visible para futuros desarrolladores

2. **Cohesión funcional sobre fragmentación**
   - El workflow de cotización es específico de esta página
   - No hay reuso potencial en otros componentes (a diferencia de ContactFormSection)
   - Extraer crearía indirección sin valor agregado

3. **Contexto de uso diferente a ContactFormSection**
   - ContactFormSection es un **componente compartido** (usado en múltiples páginas)
   - QuotePage es una **página específica** (solo ruta `/cotizador`)
   - La decisión de ADR-004 no aplica directamente aquí

4. **Riesgo no justifica beneficio**
   - El formulario funciona correctamente
   - No hay bugs ni problemas de performance
   - Cambios podrían introducir regressions en flujo de cotización
   - Estado acoplado (form reactive) dificulta extracción limpia

5. **Precedente establecido (ADRs 003 y 007)**
   - ADR-003: HomePage.vue monolito mantenido
   - ADR-007: HomePage.ts cohesión sobre fragmentación
   - QuotePage.vue sigue mismo patrón con TODO documentado

## Consecuencias

### Positivas
- Sin riesgo de regressión
- Sin esfuerzo de refactorización
- Cohesión funcional preservada
- Código más fácil de seguir (todo en un archivo)
- TODO explícito para futuro refactor

### Negativas / Trade-offs
- 601 líneas (manejable pero grande)
- SRP teóricamente violado
- Dificulta testing unitario de workflow

## Límites de Reconsideración

Reabrir esta decisión si:
- El workflow necesita **reutilizarse** en otra página
- QuotePage.vue supera **800 líneas**
- Se agregan **más features** al workflow (nuevos canales, estados complejos)
- Se identifican **bugs** que requieran refactorización del workflow

## Alternativas Rechazadas

### Opción A: Extraer stepper (como ADR-004)
**Por qué se rechazó**: QuotePage no es un componente compartido, es una página específica. Extraer el stepper aportaría poco valor ya que el componente no se reutiliza.

### Opción B: Extraer workflow a composable
**Por qué se rechazó**: Mayor esfuerzo y riesgo. El estado del formulario (reactive) está acoplado al workflow, dificultando una extracción limpia. El comentario SOLID-DEBATE ya identifica esto para cuando sea realmente necesario.

## Implementación

**Plan de acción**: No se requieren cambios de código.

**Validación**: 
```bash
npm run typecheck  # ✅ Debe pasar
npm run lint:layers  # ✅ Debe pasar
```

## Notas

- El comentario SOLID-DEBATE en línea 34 actúa como trigger para futuros refactors
- QuotePage.vue es comparable a HomePage.vue (1,276 líneas, ADR-003) en ser una página compleja
- La decisión es consistente con el criterio: cohesión > tamaño arbitrario
- Considerar esta decisión junto con ADR-003 y ADR-007 para mantener consistencia
