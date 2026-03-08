# ADR-006: Mantener Archivos TypeScript Grandes por Cohesión

## Estado
- **Fecha**: 2026-03-08
- **Estado**: Aceptada
- **Decisores**: Usuario + Agente (decisión consensuada)

## Contexto
Dos archivos TypeScript exceden límites recomendados:

| Archivo | Líneas | Límite Recomendado | Exceso |
|---------|--------|-------------------|--------|
| `quoteApiGateway.ts` | 349 | <300 | +49 |
| `contactHooks.ts` | 254 | <200 (composables) | +54 |

## Decisión
**Opción seleccionada**: B - Mantener cohesión, dividir solo si crecen más

**Justificación**:
- **Cohesión funcional**: Ambos archivos tienen alta cohesión
  - `quoteApiGateway.ts`: Toda la lógica de integración con API de cotizaciones
  - `contactHooks.ts`: Composable `useContactForm` con lógica completa del formulario
- **Tamaño razonable**: 349 y 254 líneas no son excesivos (vs. 1000+ líneas)
- **Zero riesgo**: No introducir cambios innecesarios
- **Consistencia**: Filosofía alineada con ADR-003 (HomePage) y ADR-005 (ContentRepository)
- **Pragmatismo**: El beneficio de la refactorización no justifica el esfuerzo

## Consecuencias

### Positivas
- Zero riesgo de regressión
- Zero esfuerzo
- Preserva cohesión funcional
- Fácil entender flujo completo en un archivo
- Navegación simple (un archivo por funcionalidad)

### Negativas / Trade-offs
- Archivos ligeramente grandes
- Navegación interna del archivo más difícil (mitigado por IDE)

## Alternativas Rechazadas

### Opción A: Extraer helpers/utilidades
**Por qué se rechazó**:
- Difícil decidir qué extraer sin romper cohesión
- Más archivos pequeños = más complejidad de imports
- Riesgo de dispersar lógica relacionada
- Esfuerzo (2-3 horas) sin beneficio claro

### Opción C: Reorganizar por feature/funcionalidad
**Por qué se rechazó**:
- Cambio estructural significativo
- Rompe cohesión actual
- Alto esfuerzo (4-6 horas) sin claridad de mejor resultado
- Over-engineering para el caso actual

## Implementación
- **Plan de acción**: Documentar decisión consciente y límites de reconsideración
- **Fecha estimada**: Completado
- **Responsable**: N/A

## Límites de Reconsideración

Si alguno de estos umbrales se cruza, revisar esta decisión:

| Archivo | Umbral Actual | Umbral de Acción |
|---------|---------------|------------------|
| `quoteApiGateway.ts` | 349 líneas | > 400 líneas |
| `contactHooks.ts` | 254 líneas | > 300 líneas |

## Notas
- Principio aplicado: "Cohesión sobre tamaño arbitrario"
- Los archivos son grandes pero manejables
- IDE modernos mitigan problemas de navegación en archivos grandes
- Precedente consistente con decisiones anteriores (ADR-003, ADR-005)

---

**Filosofía**: El tamaño de archivo es una métrica, no un objetivo. La cohesión funcional es más importante que cumplir límites arbitrarios.
