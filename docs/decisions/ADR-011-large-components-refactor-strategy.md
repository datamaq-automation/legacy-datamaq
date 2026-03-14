# ADR-011: Estrategia para componentes de gran tamano

## Estado
- **Fecha**: 2026-03-14
- **Estado**: Aceptada
- **Decisores**: Agente (decision-helper)

## Contexto

Hay componentes grandes en UI, en particular:
- `src/ui/pages/HomePage.vue` (1122 lineas actuales)
- `src/ui/features/contact/ContactFormSection.vue` (619 lineas actuales)

La duda era si iniciar refactor inmediato incremental, mantener la estructura actual con limites, o hacer refactor completo en rama dedicada.

Decisiones previas relevantes:
- `ADR-003` (HomePage): prioriza cohesion con logica desacoplada.
- `ADR-004` (ContactForm): extraccion puntual solo donde hay beneficio claro.
- `ADR-009` (QuotePage): mantener monolito mientras no se gatillen umbrales de riesgo/reuso.

## Decision

**Opcion seleccionada**: **2 - Mantener estructura actual con limites de reconsideracion**

No se inicia refactor estructural inmediato de `HomePage.vue` ni de `ContactFormSection.vue`.

## Justificacion

1. Es la opcion mas consistente con ADRs existentes del repositorio.
2. Evita costo y riesgo de regressiones visuales/funcionales sin un disparador tecnico claro.
3. Permite enfocar refactor cuando haya evidencia: crecimiento, reuso o bugs estructurales.
4. La decision es reversible y de bajo riesgo en el corto plazo.

## Limites de Reconsideracion

Reabrir esta decision si ocurre alguno:
- `HomePage.vue` supera 1300 lineas.
- `ContactFormSection.vue` supera 750 lineas.
- Se requiere reutilizar secciones/pasos en otra vista.
- Aparecen bugs recurrentes asociados a acoplamiento interno del componente.
- Los tiempos de review/test se degradan de forma sostenida por complejidad del archivo.

## Consecuencias

### Positivas
- Sin riesgo inmediato de regression.
- Sin costo de refactor grande en iteracion actual.
- Continuidad con criterios arquitectonicos ya aceptados.

### Negativas / Trade-offs
- Se mantiene deuda estructural controlada.
- Archivos grandes siguen elevando costo cognitivo.
- Testing unitario granular de subpartes continua limitado.

## Alternativas Rechazadas

### Opcion 1: Refactor incremental inmediato por secciones
**Por que se rechazo**: buen enfoque tecnico, pero sin gatillador de urgencia hoy; costo/beneficio no es favorable en este momento.

### Opcion 3: Refactor completo en rama dedicada
**Por que se rechazo**: mayor riesgo, mayor duracion y mayor probabilidad de conflictos/regresiones.

## Implementacion

- **Plan de accion**: ver `docs/todo.md`
- **Tipo**: implementacion gradual, orientada a governance (umbrales + trigger de refactor)

## Notas

- Esta decision no bloquea extracciones puntuales de bajo riesgo cuando aparezca reuso real.
- Mantener seguimiento de line-count y complejidad en revisiones de PR.
