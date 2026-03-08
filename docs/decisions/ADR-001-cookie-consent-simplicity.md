# ADR-001: Mantener Lógica Simple de Consentimiento de Cookies

## Estado
- **Fecha**: 2026-03-08
- **Estado**: Aceptada
- **Decisores**: Agente (decisión autónoma de bajo riesgo)

## Contexto
El banner de cookies actual implementa una lógica binaria: aceptar o rechazar todas las cookies. El diseño incluye un botón secundario que podría desplegar un centro de preferencias detallado, pero esta funcionalidad no está implementada.

La pregunta arquitectónica surgió: ¿Se requiere un centro de preferencias real con granularidad por tipo de cookie, o se mantiene la lógica simple actual?

## Decisión
**Opción seleccionada**: Mantener la lógica simple actual (aceptar/rechazar binario)

**Justificación**:
- La implementación actual cumple con los requisitos legales básicos de GDPR/consentimiento
- El usuario indicó previamente incertidumbre ("No lo sé") sobre la necesidad de esta funcionalidad
- La decisión es de bajo riesgo y completamente reversible
- Añadir un centro de preferencias implicaría complejidad significativa sin un beneficio claro
- Menor carga cognitiva para los usuarios finales

## Consecuencias

### Positivas
- Sin costo de implementación adicional
- Mantenimiento simple
- Cumplimiento legal suficiente para el contexto actual
- Posibilidad de evolucionar en el futuro sin breaking changes

### Negativas / Trade-offs
- Menor granularidad para usuarios avanzados que desean personalizar
- Posible percepción de menor transparencia (mitigable con buena redacción del banner)

## Alternativas Rechazadas

### Opción B: Implementar centro de preferencias completo
**Por qué se rechazó**:
- Requiere categorización completa de cookies (esenciales, analíticas, marketing)
- Necesita UI adicional para gestión de preferencias
- Mayor complejidad de estado y persistencia
- El usuario no identificó esta necesidad como prioritaria

## Implementación
- **Plan de acción**: No requiere acciones inmediatas. La implementación actual se mantiene.
- **Fecha estimada**: N/A
- **Responsable**: N/A

## Notas
- Esta decisión puede revisarse si cambian los requisitos legales o de negocio
- El botón secundario del banner puede redirigir a una política de cookies detallada si se requiere mayor transparencia
