# ADR-004: Extraer ContactStepper.vue, Mantener Pasos Inline

## Estado
- **Fecha**: 2026-03-08
- **Estado**: Aceptada
- **Decisores**: Usuario + Agente (decisión consensuada)

## Contexto
`ContactFormSection.vue` es un formulario wizard de 3 pasos con 641 líneas:
- ~135 líneas script (lógica de pasos, validación, draft)
- ~230 líneas template (stepper + 3 pasos del formulario)
- ~275 líneas estilos (SCSS scoped)

El formulario incluye: stepper visual, validación por paso, persistencia de draft, integración backend.

## Decisión
**Opción seleccionada**: B - Extraer solo el stepper, mantener pasos inline

**Justificación**:
- **Reutilización real**: El stepper visual puede reusarse en otros wizards (ej: cotizador)
- **Balance perfecto**: No fragmenta excesivamente pero mejora organización
- **Bajo riesgo**: El stepper es puramente presentacional
- **Cohesión preservada**: La lógica de pasos y validación queda centralizada
- **Esforzo razonable**: 2-3 horas vs 4-6 de extraer todo

## Consecuencias

### Positivas
- Stepper reusable en otros formularios wizard
- Mejor separación de responsabilidades visuales
- Componente principal más enfocado en lógica de negocio
- Bajo riesgo de regressión

### Negativas / Trade-offs
- El componente principal sigue siendo grande (~500 líneas)
- Pasos siguen inline (no testeables individualmente)

## Alternativas Rechazadas

### Opción A: Extraer ContactStepper.vue + ContactFormStep[n].vue
**Por qué se rechazó**:
- Fragmentación excesiva (4-5 componentes)
- Props drilling para datos del formulario
- Lógica de validación dispersa
- Alto esfuerzo (4-6 horas) sin beneficio proporcional

### Opción C: Mantener monolito
**Por qué se rechazó**:
- Pierde oportunidad de reutilizar stepper
- Stepper visual es claramente reusable
- Mejora marginal de organización vale el esfuerzo

## Implementación

### Plan de Acción
- [ ] Crear componente `ContactStepper.vue` extraído del stepper actual
- [ ] Props: `currentStep`, `totalSteps`, `stepLabels`, eventos `go-to-step`
- [ ] Reemplazar stepper inline en `ContactFormSection.vue` por nuevo componente
- [ ] Mover estilos del stepper al nuevo componente
- [ ] Validar que el flujo del wizard sigue funcionando

**Archivos a modificar**:
- Nuevo: `src/ui/features/contact/ContactStepper.vue`
- Modificar: `src/ui/features/contact/ContactFormSection.vue`

**Fecha estimada**: 2-3 horas de trabajo
**Responsable**: (asignar)

## Notas
- El stepper es componente puramente presentacional
- La lógica de navegación entre pasos se mantiene en el componente padre
- Si en el futuro se necesita extraer los pasos, se puede hacer incrementalmente

---

**Patrón**: Extraer componentes presentacionales reusables, mantener lógica de negocio cohesiva.
