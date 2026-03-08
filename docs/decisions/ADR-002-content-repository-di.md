# ADR-002: Mantener Inyección de Dependencias con Defaults en ContentRepository

## Estado
- **Fecha**: 2026-03-08
- **Estado**: Aceptada
- **Decisores**: Usuario + Agente (decisión consensuada)

## Contexto
`ContentRepository` es un componente central de infraestructura que gestiona el contenido de la aplicación. Su constructor actual tiene dependencias concretas como valores por defecto:

```typescript
constructor(
  private config?: Pick<ConfigPort, 'pricingApiUrl' | 'siteApiUrl' | 'requireRemoteContent'>,
  private logger: LoggerPort = new NoopLogger(),
  private http: HttpClient = new FetchHttpClient(logger)
)
```

Esto técnicamente viola el principio de Dependency Inversion (DIP) de SOLID, ya que el módulo depende de implementaciones concretas en lugar de solo abstracciones.

## Decisión
**Opción seleccionada**: C - Mantener como está y documentar decisión consciente

**Justificación**:
- **Riesgo**: Las opciones A y B tenían riesgo medio-alto de romper código existente
- **Beneficio limitado**: El beneficio de la refactorización es principalmente académico/arquitectónico
- **Funcionalidad actual**: El código funciona correctamente con los defaults
- **Defaults sensatos**: `NoopLogger` y `FetchHttpClient` son implementaciones razonables para producción
- **Flexibilidad preservada**: El diseño actual permite inyectar mocks explícitamente para testing
- **DI Container**: El container DI principal (`src/di/container.ts`) ya maneja la inyección correctamente

## Consecuencias

### Positivas
- Zero riesgo de regressión
- Zero esfuerzo de implementación
- No se rompe código existente
- Código funcional se mantiene estable

### Negativas / Trade-offs
- Deuda técnica menor (violación consciente de DIP)
- Testing requiere inyección explícita de mocks (aún posible)
- Acoplamiento técnico a implementaciones concretas

## Alternativas Rechazadas

### Opción A: Eliminar defaults y forzar inyección completa
**Por qué se rechazó**:
- Rompería compatibilidad con código existente
- Requeriría modificar múltiples lugares de instanciación
- Mayor boilerplate sin beneficio funcional inmediato
- Riesgo de introducir bugs en refactorización

### Opción B: Usar factory pattern con container
**Por qué se rechazó**:
- Añade complejidad innecesaria (indirection)
- Overkill para el caso actual
- El container DI ya maneja la creación correctamente
- Mayor esfuerzo (3-4 horas) sin beneficio proporcional

## Implementación
- **Plan de acción**: Documentar decisión consciente (este ADR)
- **Fecha estimada**: Completado
- **Responsable**: N/A

## Notas
- Esta es una decisión intencional de aceptar deuda técnica menor
- Si en el futuro se necesita mayor flexibilidad de testing, se puede reconsiderar
- El código funciona correctamente; no hay bugs ni problemas de rendimiento
- Para testing, usar inyección explícita: `new ContentRepository(config, mockLogger, mockHttp)`

---

**Principio aplicado**: "No arregles lo que no está roto" - el beneficio de la refactorización no justifica el riesgo.
