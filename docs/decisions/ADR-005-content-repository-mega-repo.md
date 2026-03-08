# ADR-005: Mantener ContentRepository como Mega-Repository (Facade)

## Estado
- **Fecha**: 2026-03-08
- **Estado**: Aceptada
- **Decisores**: Usuario + Agente (decisión consensuada)

## Contexto
`ContentRepository` implementa 15+ interfaces:

```typescript
export class ContentRepository
  implements
    ContentPort,
    SiteSnapshotPort,
    RemoteContentStatusPort,
    NavbarContentPort,
    FooterContentPort,
    ContactContentPort,
    HeroContentPort,
    AboutContentPort,
    ProfileContentPort,
    LegalContentPort,
    ConsentContentPort,
    ServicesContentPort,
    BrandContentPort,
    SeoContentPort,
    HomePageContentPort,
    ContactPageContentPort
```

Técnicamente viola Interface Segregation Principle (ISP), pero funciona como un **Facade** unificado para todo el contenido.

## Decisión
**Opción seleccionada**: C - Mantener mega-repository (documentar decisión consciente)

**Justificación**:
- **Patrón Facade válido**: Un punto de entrada para todo el contenido es intencional
- **Cohesión funcional**: Todas las interfaces son sobre "contenido" (navbar, footer, hero, etc.)
- **Riesgo muy alto**: Opciones A y B implican refactorización cross-cutting significativa
- **Beneficio limitado**: El código funciona perfectamente; refactor sería "académica"
- **Precedente**: Similar a ADR-002 (DI con defaults) - pragmatismo sobre pureza
- **Tamaño manejable**: 171 líneas no es excesivamente grande

## Consecuencias

### Positivas
- Zero riesgo de regressión
- Zero esfuerzo
- Simple para consumidores: un solo repository
- API pública estable
- Cohesión temática (todo es content)

### Negativas / Trade-offs
- Violación consciente de ISP
- Clase con muchas responsabilidades
- Potencial "god class" (mitigado por tamaño razonable)

## Alternativas Rechazadas

### Opción A: Dividir en repositorios especializados
**Por qué se rechazó**:
- Complejidad de coordinación entre repositorios
- Múltiples instancias o gestión de singletons
- Cambio disruptivo en todos los consumidores
- Pierde beneficio de punto de entrada único
- Alto esfuerzo (6-8 horas) sin beneficio funcional

### Opción B: Usar composición con servicios especializados
**Por qué se rechazó**:
- Más archivos/indirection
- Complejidad adicional
- Esfuerzo significativo (4-6 horas) sin cambio visible
- Over-engineering para el caso actual

## Implementación
- **Plan de acción**: Documentar decisión consciente (este ADR)
- **Fecha estimada**: Completado
- **Responsable**: N/A

## Notas
- Esta es una decisión intencional de aceptar deuda técnica menor por pragmatismo
- El patrón Facade es válido y común en arquitectura de software
- Límite de reconsideración: Si el archivo crece >300 líneas, revisar decisión
- El repository es cohesivo: todo método retorna algún tipo de "content"

---

**Patrón**: Facade / Unified Gateway - un punto de entrada para un subsistema completo.

**Relacionado**: ADR-002 (misma filosofía: pragmatismo sobre pureza académica)
