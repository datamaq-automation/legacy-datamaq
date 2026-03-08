# ADR-003: Mantener HomePage.vue como Monolito con Composable Extraído

## Estado
- **Fecha**: 2026-03-08
- **Estado**: Aceptada
- **Decisores**: Usuario + Agente (decisión consensuada)

## Contexto
`HomePage.vue` es la página principal con 1,124 líneas de código:
- ~50 líneas script (imports y uso de composable)
- ~390 líneas template (estructura HTML completa)
- ~680 líneas estilos SCSS (BEM con prefijos `c-home-*`)

La pregunta arquitectónica surgió: ¿Extraer sub-componentes, mantener monolito, o extraer estilos?

## Decisión
**Opción seleccionada**: B - Mantener monolito, extraer solo composables

**Justificación**:
- **Ya implementado**: El composable `useHomePage()` existe en `HomePage.ts` (~244 líneas)
- **Separación de responsabilidades**: La lógica ya está desacoplada del componente visual
- **Riesgo vs Beneficio**: Opción A (sub-componentes) implica alto esfuerzo y riesgo para beneficio limitado
- **Unicidad**: HomePage es única; sus secciones no necesitan reutilización
- **Estilos organizados**: Aunque son 680 líneas, usan BEM consistente con prefijos `c-home-*`
- **Funcionalidad**: La página cumple su propósito correctamente

## Consecuencias

### Positivas
- Zero riesgo de regressión visual
- Zero esfuerzo adicional (composable ya existe)
- Mantiene cohesión visual de la landing page
- Fácil navegación (todo en un archivo)
- Lógica testeable vía composable

### Negativas / Trade-offs
- Archivo .vue grande (1,124 líneas)
- Menor granularidad de componentes
- Template monolítico

## Alternativas Rechazadas

### Opción A: Extraer 4 sub-componentes
**Por qué se rechazó**:
- Alto esfuerzo (4-6 horas)
- Riesgo medio de bugs visuales
- Overhead de props/eventos innecesario
- Estilos muy acoplados a la página (BEM `c-home-*`)
- Sin necesidad de reutilizar sub-componentes

### Opción C: Extraer estilos a SCSS separado
**Por qué se rechazó**:
- Dificulta navegación (estilos en otro archivo)
- No mejora testeabilidad
- Beneficio marginal vs esfuerzo

## Implementación
- **Plan de acción**: Documentar decisión consciente (este ADR)
- **Estado actual**: El composable `useHomePage()` ya está implementado y funcionando
- **Fecha estimada**: Completado
- **Responsable**: N/A

## Notas
- Esta es una decisión intencional de aceptar archivo grande por simplicidad
- El composable `useHomePage()` permite testing de la lógica de negocio
- Si en el futuro alguna sección necesita reutilización, se puede extraer individualmente
- Principio aplicado: "Divide cuando haya necesidad de reutilización, no por tamaño"

---

**Patrón**: Componente monolítico + Composable separado = Balance entre simplicidad y testeabilidad.
