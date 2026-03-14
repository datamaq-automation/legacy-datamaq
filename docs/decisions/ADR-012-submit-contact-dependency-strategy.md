# ADR-012: Estrategia de dependencias en SubmitContactUseCase

## Estado
- **Fecha**: 2026-03-14
- **Estado**: Aceptada
- **Decisores**: Agente (decision-helper)

## Contexto

`SubmitContactUseCase` recibe hoy 8 dependencias por constructor:
- `ContactService`
- `ContactGateway`
- `ContactBackendMonitor`
- `LocationProvider`
- `NavigatorProvider`
- `EventBus`
- `LeadTracking`
- `Clock`

La duda era si agrupar dependencias en un facade/policy object o mantener inyeccion explicita.

Impacto observado:
- Cambia `src/application/use-cases/submitContact.ts`.
- Cambia wiring en `src/di/container.ts`.
- Cambia varios tests unitarios que instancian el caso de uso con mocks explicitos.

## Decision

**Opcion seleccionada**: **1 - Mantener firma actual por explicitud**

No introducir facade de runtime/telemetria ni dividir el caso de uso en subcasos en esta iteracion.

## Justificacion

1. La firma actual hace visibles las dependencias reales (sin ocultarlas en un wrapper).
2. El codigo y tests existentes ya estan adaptados a este contrato de constructor.
3. Un facade hoy agregaria indirección sin reducir realmente complejidad de dominio.
4. Dividir en subcasos ahora aumenta riesgo de regresion para beneficio limitado inmediato.

## Limites de Reconsideracion

Reabrir esta decision si:
- el constructor supera 10 dependencias;
- se agregan nuevas preocupaciones transversales (observabilidad/politicas) reutilizadas por multiples use-cases;
- aparecen fricciones de mantenimiento repetidas en wiring o tests.

## Consecuencias

### Positivas
- Mantiene claridad arquitectonica sobre colaboraciones del caso de uso.
- Evita refactor cross-cutting sin trigger tecnico fuerte.
- Minimiza riesgo en una ruta critica de conversion (contact submit).

### Negativas / Trade-offs
- Constructor largo y verboso.
- Setup de tests sigue siendo extenso por mocks explicitos.

## Alternativas Rechazadas

### Opcion 2: Introducir facade de contexto runtime/telemetria
**Por que se rechazo**: reduce verbosidad superficial pero oculta dependencias y aumenta indirección en debugging/testing.

### Opcion 3: Dividir en subcasos
**Por que se rechazo**: buen objetivo a futuro, pero el costo de refactor y riesgo funcional hoy supera el beneficio.

## Implementacion

- **Plan de accion**: ver `docs/todo.md`.
- **Alcance**: gobernanza y criterios de evolucion, sin refactor estructural inmediato.

## Notas

- Esta decision no prohibe evolucion futura a facade/subcasos cuando se cumplan triggers.
- Priorizar cambios incrementales con evidencia de dolor real en mantenimiento.

## Senales de Revision (checklist)

- [ ] El constructor sigue en `<= 10` dependencias.
- [ ] No hay nueva dependencia transversal reusable entre multiples use-cases.
- [ ] El setup de tests se mantiene razonable sin wrappers artificiales.
- [ ] No hay incidencias recurrentes por acoplamiento en wiring DI.
