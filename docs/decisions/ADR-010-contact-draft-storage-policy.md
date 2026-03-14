# ADR-010: Politica de persistencia de draft en formulario de contacto

## Estado
- **Fecha**: 2026-03-14
- **Estado**: Aceptada
- **Decisores**: Agente (decision-helper)

## Contexto

El formulario de contacto persiste actualmente el draft completo en `localStorage` mediante:
- `src/features/contact/infrastructure/contactDraftStorage.ts`
- `src/ui/features/contact/ContactFormSection.vue`

El draft incluye datos de identificacion y contacto:
- `firstName`, `lastName`, `email`, `phone` (PII directa)
- `company`, `comment`, `preferredContact`, `currentStep`

Problema: mantener PII en `localStorage` sin vencimiento aumenta riesgo de exposicion en equipos compartidos y entra en tension con un enfoque privacy-by-default.

## Decision

**Opcion seleccionada**: **3 - Mantener `localStorage` con TTL + minimizacion de campos**

### Definicion de politica

1. Se mantiene `localStorage` para conservar UX entre recargas/cierre accidental.
2. Se agrega TTL de expiracion (12 horas) al draft.
3. Se minimiza el payload persistido:
   - Mantener: `company`, `comment`, `preferredContact`, `currentStep`.
   - No persistir: `firstName`, `lastName`, `email`, `phone`.
4. Si el draft esta expirado o corrupto, se elimina automaticamente.

## Justificacion

1. Balancea UX y privacidad sin rediseñar flujo completo.
2. Reduce superficie de riesgo (no guarda PII de contacto personal).
3. Es reversible y de bajo costo de implementacion.
4. Mantiene coherencia con controles de validacion ya existentes en el formulario.

## Consecuencias

### Positivas
- Menor riesgo de exposicion de datos personales en cliente.
- Mejor postura privacy-by-default sin perder continuidad basica del wizard.
- Implementacion acotada a capa de feature contact.

### Negativas / Trade-offs
- El usuario podria tener que reingresar nombre/apellido/whatsapp/email al volver.
- Mayor complejidad en serializacion/deserializacion del draft (TTL + esquema reducido).

## Alternativas Rechazadas

### Opcion 1: Mantener `localStorage` actual
**Por que se rechazo**: conserva PII sensible sin expiracion, con riesgo evitable.

### Opcion 2: Migrar a `sessionStorage`
**Por que se rechazo**: mejora privacidad, pero empeora UX ante cierre accidental del navegador y no aprovecha continuidad esperada del flujo multi-step.

## Implementacion

- **Plan de accion**: ver `docs/todo.md`
- **Alcance tecnico principal**:
  - `src/features/contact/infrastructure/contactDraftStorage.ts`
  - `src/ui/features/contact/ContactFormSection.vue`
  - `src/features/contact/application/leadWizard.ts` (si se define tipo de draft persistido dedicado)

## Notas

- Se puede recalibrar TTL (por ejemplo 6h/24h) segun metricas de abandono/retorno del formulario.
- Esta decision cubre almacenamiento local de draft, no backend ni politicas de retencion server-side.
