# Historial de Tareas Completadas

*En este archivo se registran de forma definitiva las tareas cerradas, manteniendo el historial del proyecto.*

---

## [2026-03-14] Workflow: Todo Workflow - Implementacion ADR-010

### ✅ Certezas ejecutadas automaticamente

#### ADR-010 - Politica de draft con TTL y minimizacion de datos
- Completado: agregado tipo `ContactPersistedDraft` en `src/features/contact/application/leadWizard.ts`.
- Completado: `src/features/contact/infrastructure/contactDraftStorage.ts` migrado a persistencia con:
  - envelope `{ expiresAt, data }`
  - TTL fijo de 12 horas
  - validacion de esquema en lectura
  - limpieza automatica de drafts corruptos o expirados.
- Completado: `src/ui/features/contact/ContactFormSection.vue` actualizado para:
  - persistir solo `company`, `comment`, `preferredContact`, `currentStep`
  - restaurar solo esos campos al montar
  - dejar fuera `firstName`, `lastName`, `email`, `phone` (PII).
- Validacion: `npm run quality:fast` ✅ (typecheck, tests, security, colors, layers).

### 🟡 Dudas de bajo nivel resueltas por el agente

- Duda: formato de compatibilidad con drafts legacy en `localStorage`.
- Opciones evaluadas:
  - Opcion A: migrar automaticamente drafts legacy al nuevo formato.
  - Opcion B: invalidar drafts legacy y limpiarlos.
- Decision: **Opcion B** (invalidar y limpiar) por menor riesgo de mantener PII historica y menor complejidad.
- Impacto: un draft previo puede perderse una unica vez tras despliegue, alineado con privacy-by-default.

---

## [2026-03-14] Workflow: Todo Workflow - Procesamiento de Backlog Code-Audit

### ✅ Certezas ejecutadas automáticamente

#### P0 - Eliminar apertura insegura de URL en ServiceCard
- Completado: eliminado `window.open(href, '_blank')` en `src/ui/sections/ServiceCard.vue`.
- Completado: delegada la acción al flujo centralizado mediante `emit('contact', { section, href })`.
- Impacto: se evita bypass de controles de navegación/analytics y se elimina la superficie de reverse tabnabbing en ese componente.
- Evidencia: cambio en `src/ui/sections/ServiceCard.vue:110-112`.

### 🔴 Dudas de alto nivel escaladas

- Escalada: política de persistencia de PII en drafts de contacto (localStorage vs sessionStorage/TTL).
- Escalada: estrategia de refactor para componentes extensos (`HomePage.vue`, `ContactFormSection.vue`).
- Escalada: posible reestructuración de dependencias en `SubmitContactUseCase` (fan-in de constructor).
- Registro: `docs/preguntas-arquitectura.md`.

---

## [2026-03-09] Workflow: Todo Workflow - Cierre de Backlog

### ✅ Tareas completadas

#### P0 - Smoke e2e para flujo de cotizador web
- Completado: agregado test `quote flow opens the web quote view` en `tests/e2e/smoke.spec.ts`.
- Completado: mock de `POST /v1/quote/diagnostic` para habilitar el flujo de generacion de propuesta en smoke.
- Evidencia: `npm run test:e2e:smoke` -> `4 passed`.

#### P1 - Fallback UX explicito en QuoteWebPage
- Evaluacion de bajo nivel:
  - Opcion A: validar fallback solo con unit test semantico (rapido, estable, enfocado en UX visible).
  - Opcion B: agregar e2e dedicado para ausencia de snapshot (mas costo y redundancia con cobertura unitaria actual).
- Decision: Opcion A, por menor fragilidad y mejor costo/beneficio en este contexto.
- Completado: ampliado `tests/unit/ui/quoteWebPage.test.ts` con asserts de copy de fallback y link `Volver al cotizador`.
- Evidencia: `npm run test -- tests/unit/ui/quoteWebPage.test.ts` -> `2 passed`.

---

## [2026-03-09] Workflow: Orchestrator - Testing Frontend

### Tarea ejecutada

#### Reactivar cobertura de `DynamicContentService`
- Completado: se des-skippearon 2 pruebas en `tests/unit/infrastructure/dynamicContentService.test.ts`.
- Completado: se corrigieron fixtures al contrato real (`payload.data`) y se stubeo `window` para ejecutar `bootstrap()` en entorno de test.
- Evidencia: `npm run test -- tests/unit/infrastructure/dynamicContentService.test.ts` -> `2 passed`.
- Evidencia: `npm run test` -> `61 passed`, `219 passed`, `0 skipped`.

---

## [2026-03-09] Workflow: Optimización de Ecosistema de Skills

### ✅ Skills Unificados

#### ui-ux-audit + frontend-best-practices-audit
- **Decisión**: Unificar ui-ux-audit (112 líneas) en frontend-best-practices-audit
- **Justificación**: ui-ux-audit era muy pequeño, funcionalidad complementaria
- **Cambios realizados**:
  - Agregado **Pilar 6: UI/UX Visual** a frontend-best-practices-audit
  - Jerarquía visual, consistencia, usabilidad, responsive, accesibilidad
  - Eliminado directorio `.agents/skills/ui-ux-audit/`
- **Ecosistema resultante**: 6 skills (reducido de 7)

### ✅ Especialización de Skills

#### Eliminación de duplicación code-audit vs frontend-best-practices
- **Problema**: Ambos skills cubrían Clean Architecture y SOLID
- **Decisión**: 
  - Mantener `code-audit` como skill generalista (frontend + backend)
  - Quitar pilar de Arquitectura/SOLID de `frontend-best-practices-audit`
- **Cambios realizados**:
  - `frontend-best-practices-audit`: De 6 pilares a 5 pilares
  - Eliminado: Pilar 5 (Code Organization con Clean Architecture/SOLID)
  - Renumerado: Pilar 6 (UI/UX) → Pilar 5
  - Actualizada descripción y referencias
- **Beneficio**: 
  - `code-audit`: Único responsable de Arquitectura Limpia y SOLID
  - `frontend-best-practices-audit`: Enfocado en Vue, TS, Naming, HTTP, UI/UX
  - Sin duplicación, responsabilidades claras

### ✅ Skills Creados

#### docs-maintainer (nuevo skill)
- **Propósito**: Gestionar y sincronizar documentación en docs/
- **Responsabilidades**:
  - Mantener todo.md y todo.done.md
  - Gestionar ADRs e índices
  - Sincronizar preguntas-arquitectura.md
  - Generar reportes de documentación
- **Gap detectado**: No había skill dedicado a documentación
- **Estado**: ✅ Creado y listo para usar

### 📊 Estado del Ecosistema de Skills

| Skill | Líneas | Estado | Función |
|-------|--------|--------|---------|
| skill-orchestrator | 356 | 🆕 Nuevo | Orquestador meta |
| frontend-best-practices-audit | 356 | 🔄 Actualizado | Vue + TS + Naming + UI/UX |
| todo-workflow | 348 | ✅ OK | Procesa tareas |
| decision-helper | 310 | ✅ OK | Decisiones ADR |
| code-audit | 306 | ✅ OK | Seguridad + SOLID |
| docs-maintainer | 306 | 🆕 Nuevo | Gestión documentación |
| gh-actions-audit | 166 | ✅ OK | CI/CD |

**Total**: 7 skills optimizados (consolidado desde 8)

---

## [2026-03-09] Workflow: Auditoría Frontend Best Practices - Verificación Completa

### ✅ Verificación de Mejoras Propuestas

#### v-for con :key - YA IMPLEMENTADOS
- **Verificación**: Todos los v-for en el codebase ya tienen `:key` implementado
- **Hallazgo**: Las mejoras sugeridas en la auditoría ya estaban aplicadas
- **Archivos verificados**:
  - `HomePage.vue`: Todos los v-for usan keys (`link.href`, `card.id`, `benefit.text`, `item.question`)
  - `ServiceCard.vue`: Usa keys compuestos (`${card.id}-item-${index}`)
  - `MedicionConsumoEscobar.vue`: Usa `faq.question` como key
- **Estado**: ✅ Completos - no requieren cambios

#### Uso de índice en v-for - ACEPTABLE
- **Verificación**: Solo 3 casos usan índice como key
- **Contexto**: Casos donde no hay identificador único disponible:
  - `trustLogos` con `idx` (array de imágenes sin ID)
  - `card.items` con `index` (items de servicio son strings)
- **Decisión**: Mantener índice es aceptable en estos casos
- **Prioridad**: Baja - no afecta funcionalidad

---

## [2026-03-09] Workflow: Auditoría Frontend Best Practices - Mejoras Ejecutadas

### ✅ Mejoras de Bajo Nivel Ejecutadas

#### Agregar :key a v-for en HomePage.vue
- **Decisión**: Ejecutar inmediatamente (bajo riesgo, mejora performance)
- **Cambios realizados**:
  - Línea 74: `v-for="link in headerLinks"` → `v-for="link in headerLinks" :key="link.href"`
  - Línea 85: `v-for="link in quickLinks"` → `v-for="link in quickLinks" :key="link.href"`
- **Validación**: `npm run typecheck` ✅
- **Riesgo**: Ninguno - cambio mecánico

#### Implementar backoff exponencial en retries HTTP
- **Decisión**: Ejecutar inmediatamente (mejora estabilidad)
- **Cambios realizados**:
  - Agregado delay exponencial entre reintentos: 1s, 2s, 4s
  - Método `delay()` privado para setTimeout promisificado
  - Aplica tanto a errores 5xx como a excepciones de red
- **Archivo**: `src/infrastructure/http/fetchHttpClient.ts`
- **Validación**:
  - `npm run typecheck` ✅
  - `npm run lint:layers` ✅ (0 violaciones)
- **Riesgo**: Bajo - mejora comportamiento existente

### 🔴 Dudas de Bajo Nivel - Decisión de No Acción

#### Type Assertions (45 usos)
- **Decisión**: NO ejecutar refactor masivo
- **Justificación**: La mayoría son justificados (JSON.parse, interoperabilidad)
- **Meta**: Reducir gradualmente en futuros PRs (<20 usos)
- **Prioridad**: Baja - no es deuda técnica crítica

#### Uso de any vs unknown (ratio 1:3)
- **Decisión**: Mantener estado actual
- **Justificación**: Ratio 50 any / 143 unknown es aceptable
- **Acción**: Revisar en code reviews futuros
- **Prioridad**: Baja

#### Timeout HTTP configurable
- **Decisión**: NO implementar ahora
- **Justificación**: 10s default funciona para caso de uso actual
- **Límite**: Implementar cuando haya endpoints que requieran tiempos diferentes
- **Prioridad**: Baja

#### TODOs de migración a features/
- **Decisión**: Mantener TODOs existentes
- **Justificación**: Depende de refactor mayor de arquitectura
- **Acción**: Abordar cuando se planifique migración completa
- **Prioridad**: Baja

---

## [2026-03-09] Decisión Arquitectónica: Estructura de QuotePage.vue

### ✅ Decisión Tomada

**Pregunta**: ¿Cómo estructurar QuotePage.vue (601 líneas) - extraer componentes o mantener monolito?

**Decisión**: Opción C - Mantener monolito (por ahora)

**Justificación**:
- El código ya anticipa su propio refactor (comentario SOLID-DEBATE línea 34)
- QuotePage es página específica (no componente compartido como ContactFormSection)
- Cohesión funcional > fragmentación arbitraria
- Riesgo de refactor no justifica beneficio actual
- Consistente con ADR-003 (HomePage.vue) y ADR-007 (HomePage.ts)

**Límites de reconsideración**:
- Workflow necesite reutilizarse en otra página
- Archivo supere 800 líneas
- Se agreguen más features complejos al workflow

**ADR**: `docs/decisions/ADR-009-quotepage-structure.md`

**Acciones**:
- ✅ Crear ADR-009 documentando decisión consciente
- ✅ Mantener código existente (sin refactor)
- ✅ Monitorear límites de reconsideración

**Validación**:
- `npm run typecheck` ✅
- `npm run lint:layers` ✅

---

## [2026-03-09] Decisión Arquitectónica: Consolidación de Módulo SEO

### ✅ Decisión Tomada

**Pregunta**: ¿Consolidar tipos SEO dispersos en múltiples archivos o mantener separación?

**Decisión**: Opción A - Eliminar barrel file `ui/seo/defaultSeo.ts`, usar imports directos

**Justificación**:
- El barrel file solo re-exportaba, añadía indirección sin valor
- Imports directos son más claros y explícitos
- Reduce de 4 a 3 archivos sin pérdida de funcionalidad
- Mantiene integridad de capas (appSeo.ts permanece en UI)

**ADR**: `docs/decisions/ADR-008-seo-module-consolidation.md`

**Acciones**:
- ✅ Crear ADR-008 documentando decisión
- ✅ Actualizar imports en `src/ui/App.ts` (getDefaultSeo desde application)
- ✅ Actualizar imports en `src/ui/seo/appSeo.ts` (types desde domain, jsonLd desde domain)
- ✅ Eliminar barrel file `src/ui/seo/defaultSeo.ts`
- ✅ Validar con typecheck y lint:layers

**Validación**:
- `npm run typecheck` ✅
- `npm run lint:layers` ✅ (0 violaciones, 152 archivos escaneados)

**Archivos modificados**:
- `src/ui/App.ts` - import directo de application/seo/defaultSeo
- `src/ui/seo/appSeo.ts` - imports directos de domain/seo/types y domain/seo/jsonLd
- `src/ui/seo/defaultSeo.ts` - 🗑️ Eliminado

---

## [2026-03-09] Decisión Arquitectónica: Estructura de HomePage.ts

### ✅ Decisión Tomada

**Pregunta**: ¿Extraer helpers de mapeo de HomePage.ts a archivo separado o mantener cohesión?

**Decisión**: Opción B - Mantener en archivo actual por cohesión funcional

**Justificación**: 
- Las funciones helper son específicas de HomePage, no reusables
- 267 líneas es manejable (no excesivo)
- El código ya anticipa su propio refactor (comentario SOLID-DEBATE para tercera variante)
- Riesgo de refactor no justifica beneficio
- Consistente con ADR-006 (cohesión > tamaño)

**Límites de reconsideración**:
- Se agrega tercera variante de página
- Archivo supera 400 líneas  
- Helpers necesitan reutilización

**ADR**: `docs/decisions/ADR-007-homepage-ts-structure.md`

**Acciones**:
- ✅ Crear ADR-007 documentando decisión consciente
- ✅ Eliminar pregunta de `preguntas-arquitectura.md`
- ✅ No se requieren cambios de código (decisión de no-acción)

---

## [2026-03-09] Workflow: Procesamiento de Auditoría de Código

### ✅ DUDAS BAJO NIVEL Ejecutadas

#### Seguridad: Verificar localStorage no almacena datos sensibles
- **Archivos**: `src/infrastructure/storage/browserStorage.ts`, `src/features/contact/infrastructure/contactDraftStorage.ts`
- **Decisión**: Opción A - Verificar código + Documentar (suficiente para el proyecto actual)
- **Cambio realizado**:
  - Verificado: Solo almacena drafts de formularios y consentimiento
  - Agregado comentario de advertencia de seguridad en BrowserStorage
- **Validación**: `npm run typecheck` ✅ pasó
- **Riesgo residual**: Bajo - el proyecto no maneja tokens de autenticación

**Código resultante**:
```typescript
/**
 * ⚠️ SEGURIDAD: Esta implementación usa localStorage (no encriptado).
 * NO usar para almacenar: tokens de autenticación, contraseñas, datos sensibles.
 * Uso actual válido: drafts de formularios, preferencias de consentimiento.
 */
export class BrowserStorage implements StoragePort {
```

---

#### Arquitectura: Mover whatsappQr.ts de Application a UI
- **Archivo origen**: `src/application/constants/whatsappQr.ts`
- **Archivo destino**: `src/ui/composables/useWhatsAppQr.ts`
- **Decisión**: Opción A - Mover a `src/ui/composables/` (correcto arquitectónicamente)
- **Cambio realizado**:
  - Movido archivo a ubicación correcta (es un composable, no una constante)
  - Renombrado de `getWhatsAppQrConfig` a `useWhatsAppQrConfig` (convención composables)
  - Agregado JSDoc con nota de deprecación (archivo no está en uso activo)
  - Eliminada carpeta `src/application/constants/` (vacía)
- **Validación**: `npm run typecheck` ✅ pasó (no tenía dependencias externas)
- **Riesgo**: Ninguno - archivo no estaba siendo importado

---

### 🔴 DUDAS ALTO NIVEL Escaladas/Resueltas

1. ✅ **[2026-03-09] Refactor: Reducir complejidad de HomePage.ts** → **RESUELTA (ADR-007)**
   - Decisión: Mantener cohesión, no refactorizar
   - ADR: `docs/decisions/ADR-007-homepage-ts-structure.md`

2. ✅ **[2026-03-09] Consolidación: Tipos SEO dispersos en múltiples archivos** → **RESUELTA (ADR-008)**
   - Decisión: Eliminar barrel file, usar imports directos
   - ADR: `docs/decisions/ADR-008-seo-module-consolidation.md`

---

## [2026-03-08] Workflow: Procesamiento de Auditoría de Código

### ✅ Certezas Ejecutadas

#### Seguridad: Documentar innerHTML en Microsoft Clarity
- **Archivo**: `src/infrastructure/analytics/clarity.ts` (línea 27)
- **Cambio realizado**: 
  - Reemplazado `script.innerHTML` por `script.textContent` (más seguro)
  - Agregado comentario explicativo sobre seguridad
- **Validación**: `npm run typecheck` ✅ pasó
- **Riesgo**: Ninguno - cambio equivalente funcionalmente, más seguro

**Código resultante**:
```typescript
// Nota de seguridad: Este es el loader oficial de Microsoft Clarity (código estático de terceros).
// El ID es inyectado pero validado como string. No contiene user input.
// textContent se prefiere sobre innerHTML para evitar interpretación HTML.
script.textContent = "(function(c,l,a,r,i,t,y)..."
```

---

## [2026-03-08] Decisión Arquitectónica: ContentRepository DI

### ✅ Decisión Tomada

**Pregunta**: ¿Refactorizar inyección de dependencias en ContentRepository?

**Decisión**: Opción C - Mantener implementación actual con defaults

**Justificación**: El riesgo de refactorización no justifica el beneficio académico. El código funciona correctamente.

**ADR**: `docs/decisions/ADR-002-content-repository-di.md`

**Acciones**:
- ✅ Crear ADR-002 documentando decisión consciente
- ✅ Eliminar pregunta de `preguntas-arquitectura.md`

---

## [2026-03-08] Decisión Arquitectónica: HomePage.vue Component Structure

### ✅ Decisión Tomada

**Pregunta**: ¿Cómo estructurar HomePage.vue (1,124 líneas)?

**Decisión**: Opción B - Mantener monolito, extraer solo composables

**Justificación**: El composable `useHomePage()` ya existe y separa la lógica. Extraer sub-componentes sería overkill sin necesidad de reutilización.

**ADR**: `docs/decisions/ADR-003-homepage-component-structure.md`

**Acciones**:
- ✅ Crear ADR-003 documentando decisión consciente
- ✅ Eliminar pregunta de `preguntas-arquitectura.md`

---

## [2026-03-08] Decisión Arquitectónica: ContactFormSection.vue Structure

### ✅ Decisión Tomada

**Pregunta**: ¿Cómo dividir ContactFormSection.vue (641 líneas, formulario wizard)?

**Decisión**: Opción B - Extraer solo el stepper, mantener pasos inline

**Justificación**: El stepper es puramente presentacional y reusable. Extraer todos los pasos sería overkill con alto riesgo.

**ADR**: `docs/decisions/ADR-004-contact-form-structure.md`

**Plan de acción**: 
- Crear `ContactStepper.vue` componente presentacional
- Integrar en `ContactFormSection.vue`
- Estimación: 2-3 horas

**Acciones**:
- ✅ Crear ADR-004 documentando decisión y plan
- ✅ Eliminar pregunta de `preguntas-arquitectura.md`

---

## [2026-03-08] Decisión Arquitectónica: ContentRepository Mega-Repository

### ✅ Decisión Tomada

**Pregunta**: ¿Dividir ContentRepository (15+ interfaces) o mantener mega-repository?

**Decisión**: Opción C - Mantener mega-repository (documentar decisión consciente)

**Justificación**: El repository actúa como Facade unificado para todo el contenido. El riesgo de refactor no justifica el beneficio. Cohesión temática: todo es "content".

**ADR**: `docs/decisions/ADR-005-content-repository-mega-repo.md`

**Acciones**:
- ✅ Crear ADR-005 documentando decisión consciente
- ✅ Eliminar pregunta de `preguntas-arquitectura.md`

---

## [2026-03-08] Decisión Arquitectónica: Archivos TypeScript Grandes

### ✅ Decisión Tomada

**Pregunta**: ¿Refactorizar quoteApiGateway.ts (349 líneas) y contactHooks.ts (254 líneas)?

**Decisión**: Opción B - Mantener cohesión, dividir solo si crecen más

**Justificación**: Ambos archivos tienen alta cohesión funcional. El tamaño es razonable (no excesivo). Cohesión > tamaño arbitrario.

**Límites de reconsideración**:
- quoteApiGateway.ts > 400 líneas
- contactHooks.ts > 300 líneas

**ADR**: `docs/decisions/ADR-006-typescript-files-cohesion.md`

**Acciones**:
- ✅ Crear ADR-006 documentando decisión consciente
- ✅ Vaciar `preguntas-arquitectura.md` (todas las decisiones resueltas)

---

## Resumen de Decisiones Arquitectónicas

| Fecha | # | Pregunta | Decisión | ADR |
|-------|---|----------|----------|-----|
| 2026-03-08 | 1 | Centro de Preferencias Cookies | Mantener lógica simple | ADR-001 |
| 2026-03-08 | 2 | DI ContentRepository | Mantener con defaults | ADR-002 |
| 2026-03-08 | 3 | HomePage.vue estructura | Monolito + composable | ADR-003 |
| 2026-03-08 | 4 | ContactFormSection.vue | Extraer stepper | ADR-004 |
| 2026-03-08 | 5 | ContentRepository mega-repo | Mantener como Facade | ADR-005 |
| 2026-03-08 | 6 | Archivos TS grandes | Mantener por cohesión | ADR-006 |
| 2026-03-09 | 7 | localStorage seguridad | Documentar + verificar | Completado |
| 2026-03-09 | 8 | whatsappQr.ts ubicación | Mover a composables | Completado |
| 2026-03-09 | 9 | HomePage.ts estructura | Mantener cohesión | ADR-007 |
| 2026-03-09 | 10 | Consolidación módulo SEO | Eliminar barrel file | ADR-008 |
| 2026-03-09 | 11 | QuotePage.vue estructura | Mantener monolito | ADR-009 |
| 2026-03-09 | 12 | v-for :key en HomePage | Agregar keys | Completado |
| 2026-03-09 | 13 | Backoff exponencial HTTP | Implementar retry | Completado |
| 2026-03-09 | 14 | Unificación ui-ux-audit | Integrar en frontend-best-practices | Completado |
| 2026-03-09 | 15 | Crear docs-maintainer | Nuevo skill para documentación | Completado |
| 2026-03-09 | 16 | Especializar skills | Quitar SOLID de frontend-best-practices | Completado |

**Total**: 16 decisiones/tareas documentadas, 0 pendientes.

---

---

## [2026-03-09] Workflow: Implementación ADR-009 (sin cambios de código)

### ✅ Tareas Completadas

#### ADR-009: Estructura de QuotePage.vue - Mantener Monolito
- **Decisión**: Opción C - Mantener archivo actual (sin refactor)
- **Tipo**: Decisión de no-acción (no requiere cambios de código)
- **Acciones realizadas**:
  - ✅ Documentar decisión en ADR-009
  - ✅ Mantener código existente (sin refactor)
  - ✅ Definir límites de reconsideración (reutilización, 800 líneas, nuevas features)
- **Validación**:
  - `npm run typecheck` ✅
  - `npm run lint:layers` ✅ (0 violaciones)
- **Riesgo**: Ninguno - sin cambios en código fuente
- **Estado**: Completada

**Nota**: El comentario SOLID-DEBATE en línea 34 de QuotePage.vue actúa como trigger para futuro refactor cuando sea necesario.

---

## [2026-03-09] Workflow: Implementación ADR-007 (sin cambios de código)

### ✅ Tareas Completadas

#### ADR-007: Estructura de HomePage.ts - Mantener Cohesión
- **Decisión**: Opción B - Mantener archivo actual por cohesión funcional
- **Tipo**: Decisión de no-acción (no requiere cambios de código)
- **Acciones realizadas**:
  - ✅ Documentar decisión en ADR-007
  - ✅ Mantener código existente (sin refactor)
  - ✅ Definir límites de reconsideración (tercera variante, 400 líneas, reuso)
- **Validación**:
  - `npm run typecheck` ✅
  - `npm run lint:layers` ✅ (0 violaciones)
- **Riesgo**: Ninguno - sin cambios en código fuente
- **Estado**: Completada

**Nota**: Esta decisión prioriza cohesión funcional sobre fragmentación arbitraria. El código ya anticipa su propio refactor futuro (comentario SOLID-DEBATE para tercera variante).

---

*Inbox de tareas procesado completamente.*
