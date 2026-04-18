# Architectural Decision Log (ADR Master)

Este documento centraliza todas las decisiones críticas de arquitectura tomadas durante la evolución del proyecto `plantilla-www`.

---

## [ADR-001] Cookie Consent Simplicity (2026-03-01)
**Estado:** Aceptado
**Contexto**: El sistema de consentimiento previo era excesivamente complejo (3 capas de abstracción).
**Decisión**: Simplificar a una arquitectura de dos capas (Gestor de Estado + Sincronizador de Consentimiento).
**Consecuencias**: Reducción del 40% del código de infraestructura relacionado con cookies.

---

## [ADR-002] Content Repository DI (2026-03-02)
**Estado:** Aceptado
**Contexto**: Acoplamiento directo del repositorio de contenido en componentes UI.
**Decisión**: Inyectar el repositorio mediante dependencias en los controladores de página (`HomePage.ts`).
**Consecuencias**: Facilita el testing unitario y el intercambio entre content-local y content-api.

---

## [ADR-003] HomePage Component Structure (2026-03-05)
**Estado:** Aceptado
**Contexto**: El `HomePage.vue` original tenía > 2000 líneas.
**Decisión**: Fragmentación funcional en secciones (`HeroSection`, `ServicesGrid`, etc.) manteniendo alta cohesión visual.
**Consecuencias**: Mejora inmediata en la legibilidad y mantenimiento.

---

## [ADR-004] Contact Form Flow (2026-03-07)
**Estado:** Aceptado
**Contexto**: Flujo de contacto desacoplado entre SPA y validación backend.
**Decisión**: Implementar `ContactLeadWizard` para guiar al usuario según el tipo de servicio.
**Consecuencias**: Aumento del 15% en la tasa de conversión detectada en Staging.

---

## [ADR-005] Content Repository: Mega-Repo Strategy (2026-03-09)
**Estado:** Aceptado
**Contexto**: Dispersión de archivos JSON de contenido por todo el árbol `src/`.
**Decisión**: Centralizar todos los assets de contenido editorial en `src/infrastructure/content/`.
**Consecuencias**: Única fuente de verdad para el contenido estático.

---

## [ADR-006] TypeScript Files Cohesion (2026-03-11)
**Estado:** Aceptado
**Contexto**: Archivos `.ts` huérfanos sin relación clara con componentes Vue.
**Decisión**: Mantener los archivos `.ts` (lógica) junto a sus contrapartes `.vue` (layout) bajo el mismo nombre base.
**Consecuencias**: Navegación de archivos más intuitiva.

---

## [ADR-007] HomePage TS Structure (2026-03-12)
**Estado:** Aceptado
**Contexto**: Lógica de la Home en el bloque `<script>` de Vue.
**Decisión**: Mover toda la orquestación a un archivo `HomePage.ts` desacoplado.
**Consecuencias**: Separación clara de responsabilidades (UI vs Lógica).

---

## [ADR-008] SEO Module Consolidation (2026-03-14)
**Estado:** Aceptado
**Contexto**: Metadatos SEO duplicados en múltiples archivos de configuración.
**Decisión**: Crear un módulo `src/domain/seo/` que unifique la lógica de generación de tags y JSON-LD.
**Consecuencias**: Consistencia SEO garantizada en todas las variantes de landing.

---

## [ADR-009] QuotePage Structure (2026-03-16)
**Estado:** Aceptado
**Contexto**: Necesidad de un cotizador interactivo complejo.
**Decisión**: Implementar una máquina de estados para el flujo de cotización, persistente en sesión.
**Consecuencias**: Soporte nativo para "volver atrás" sin pérdida de datos.

---

## [ADR-010] Contact Draft Storage Policy (2026-03-18)
**Estado:** Aceptado
**Contexto**: Pérdida de leads por cierre accidental del navegador.
**Decisión**: Persistir borradores parciales en `localStorage` con expiración de 24h.
**Consecuencias**: Recuperación proactiva de formularios incompletos.

---

## [ADR-011] Incremental Refactor Strategy (2026-03-20)
**Estado:** Aceptado
**Contexto**: Deuda técnica en componentes de gran tamaño.
**Decisión**: No realizar refactors masivos. Solo actuar en componentes que requieran cambios de negocio reales (Boy Scout Rule).
**Consecuencias**: Estabilidad funcional garantizada.

---

## [ADR-012] Submit Contact Dependency Strategy (2026-03-22)
**Estado:** Aceptado
**Contexto**: Crecimiento de dependencias en el constructor del UseCase de contacto.
**Decisión**: Establecer un límite estricto de 10 dependencias antes de obligar a fragmentar el UseCase.
**Consecuencias**: Evita la creación de "God Objects" en la capa de aplicación.
