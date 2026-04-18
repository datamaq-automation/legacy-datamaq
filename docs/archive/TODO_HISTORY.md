## [2026-03-30] Operacion: CD FTPS estable + verificacion post-deploy

### Certezas ejecutadas automaticamente

#### CD por cambios en scripts sin depender de CI
- Completado: `cd.yml` ahora se dispara por `push` en `main` cuando hay cambios en `scripts/**`.
- Completado: condiciones `if` de jobs CD actualizadas para aceptar evento `push` directo.

#### Hardening de FTPS ante timeouts de data channel
- Completado: `scripts/ftps-deploy.sh` ahora soporta:
  - `FTPS_PREFLIGHT_TIMEOUT_SECONDS` (default `120`)
  - `FTPS_UPLOAD_TIMEOUT_SECONDS` (default `240`)
- Completado: validacion numerica y salida de debug para ambos valores.

### Evidencia de validacion
- GitHub Actions: pipeline en verde tras los ajustes.
- Smoke HTTP en produccion:
  - `https://datamaq.com.ar/` -> `200`
  - `https://datamaq.com.ar/contact` -> `200`
  - `https://datamaq.com.ar/gracias` -> `200`
  - `https://datamaq.com.ar/cotizador` -> `200`

---

## [2026-03-15] Workflow: Todo Workflow - Auditoria y unificacion de GitHub Actions CI

### Certezas ejecutadas automaticamente

#### [GHA][ALTA] Diagnostico en fallo para `quality-fast`
- Completado: agregado bloque `if: failure()` con contexto de runner/workspace en `.github/workflows/ci.yml`.
- Completado: agregado upload de artifact `quality-fast-debug-${{ github.run_id }}` con `retention-days: 7`.

#### [GHA][ALTA] Diagnostico en fallo para `quality-nightly-gate`
- Completado: agregado bloque `if: failure()` con snapshot de entorno/workspace en `.github/workflows/ci.yml`.
- Completado: agregado upload de artifact `quality-nightly-debug-${{ github.run_id }}` con `retention-days: 7`.

#### [GHA][MEDIA] Debug minimo para `Actionlint`
- Completado: workflow de lint unificado dentro de `.github/workflows/ci.yml` (el archivo `.github/workflows/ci-workflows-lint.yml` fue eliminado en la unificacion previa).
- Completado: agregado contexto de debug y artifact `actionlint-debug-${{ github.run_id }}` en caso de fallo.

### Dudas de alto nivel escaladas

#### [GHA][MEDIA] Evaluar split del job monolitico `quality-nightly-gate`
- Escalado a: `docs/preguntas-arquitectura.md`.
- Estado: pendiente de decision arquitectonica (mantener job unico vs dividir en jobs por dominio).

### Evidencia de validacion

- `npm run quality:fast` -> OK.

---
## [2026-03-14] Workflow: Todo Workflow - Cierre de backlog frontend-testing-vue-ts-tailwind

### Certezas ejecutadas automaticamente

#### MEJORA - Runner a11y automatizado
- Completado: implementado runner real en `scripts/run-a11y.mjs` usando Playwright.
- Completado: agregado spec `tests/e2e/a11y.spec.ts` con checks semanticos base (`main` + `h1`) en rutas criticas (`/`, `/cotizador`, `/gracias`).
- Validacion: `npm run test:a11y` -> 3/3 OK.

#### MEJORA - Smoke responsive mobile
- Completado: ampliado `tests/e2e/smoke.spec.ts` con test mobile (`390x844`) para home, thanks y quote web (`/cotizador/:quoteId/web`).
- Completado: estrategia estable para quote web en mobile con snapshot en `sessionStorage` (`quote-web:last-generated`).
- Validacion: `npm run test:e2e:smoke` -> 5/5 OK.

### Evidencia de validacion integral

- `npm run quality:fast` -> OK.
- `npm run typecheck` -> OK.
- `npm run test` -> OK.
- `npm run lint:todo-sync` -> OK.

---
## [2026-03-14] Workflow: Todo Workflow - Ejecucion de hallazgos frontend-best-practices-audit

### Certezas ejecutadas automaticamente

#### ADVERTENCIA - Migracion de RGBA hardcodeado a tokens
- Completado: reemplazo de `rgba(r,g,b,alpha)` numerico por variables tokenizadas en:
  - `src/ui/pages/HomePage.vue`
  - `src/ui/pages/ContactPage.vue`
  - `src/ui/pages/QuoteWebPage.vue`
  - `src/ui/pages/home/HomeFaqList.vue`
- Completado: normalizacion de sombras a `rgba(var(--dm-shadow-rgb), alpha)`.
- Completado: extension de tokens RGB en `src/styles/scss/_dm.tokens.scss` con:
  - `--dm-surface-0-rgb`
  - `--dm-surface-1-rgb`

#### MEJORA - Fallback CSS centralizado en bootstrap
- Completado: extraccion de mapa de fallback a constante `CRITICAL_CSS_FALLBACKS` en `src/main.ts`.
- Completado: documentacion de excepcion de bootstrap para primera pintura.

### Evidencia de validacion

- `rg -n "rgba\([0-9]{1,3},\s*[0-9]{1,3},\s*[0-9]{1,3}" src/ui/pages/HomePage.vue src/ui/pages/ContactPage.vue src/ui/pages/QuoteWebPage.vue src/ui/pages/home/HomeFaqList.vue` -> sin resultados.
- `npm run typecheck` -> OK.
- `npm run lint:colors` -> OK.
- `npm run lint:component-size` -> OK.

---
## [2026-03-14] Workflow: Todo Workflow - Cierre de backlog frontend-best-practices (pasada 2)

### Certezas ejecutadas automaticamente

#### ADVERTENCIA - Key estable en ServiceCard
- Completado: eliminado uso de indice en `v-for` de `src/ui/sections/ServiceCard.vue`.
- Completado: key ahora basada en contenido (`${card.id}-item-${item}`).

#### ADVERTENCIA - Migracion de HEX a tokens del sistema
- Completado: removidos hardcodes HEX y RGB directos en:
  - `src/ui/pages/QuoteWebPage.vue`
  - `src/ui/pages/HomePage.vue`
  - `src/ui/pages/ContactPage.vue`
  - `src/ui/features/contact/WhatsAppFab.vue`
- Completado: `WhatsAppFab.vue` reemplazo de `tw:bg-[#25D366]` por estilo tokenizado con `--dm-whatsapp-green-rgb`.

#### MEJORA - Reduccion de casts `as unknown as`
- Completado: `src/main.ts` usa alias tipado local (`VueAppProvidesContext`) en vez de cast doble.
- Completado: `src/ui/features/contact/WhatsAppFab.vue` usa tipo `Window & { gtag_report_conversion?: ... }`.
- Completado: `src/infrastructure/content/contentStore.ts` refactor de `patchObjectInPlace` para aceptar `object` y eliminar cast doble en call sites.

### Evidencia de validacion

- `npm run quality:fast` -> OK (security, typecheck, test, colors, layers, component-size, usecase-deps).
- `rg -n -g '*.ts' -g '*.vue' '\bas unknown as\b' src` -> sin resultados en archivos intervenidos.

---
## [2026-03-14] Workflow: Todo Workflow - Procesamiento de backlog frontend-best-practices

### ✅ Certezas ejecutadas automaticamente

#### ADVERTENCIA - Naming composable en contacto
- Completado: renombrado `src/ui/features/contact/contactHooks.ts` -> `src/ui/features/contact/useContactForm.ts`.
- Completado: actualizado import en `src/ui/features/contact/ContactFormSection.ts`.
- Validacion: `npm run quality:fast` ✅.

### 🟡 Dudas de bajo nivel resueltas por el agente

#### ADVERTENCIA - Migracion de colores HEX a tokens
- Duda: mantener HEX locales por rapidez o migrar a tokens del sistema de diseno.
- Opciones evaluadas:
  - Opcion A: mantener HEX (menor esfuerzo inmediato, peor consistencia).
  - Opcion B: migrar a tokens `var(--dm-*)`/`rgba(var(--dm-*-rgb), ...)` (mejor mantenibilidad y theming).
- Decision: **Opcion B** por consistencia visual y reduccion de deuda de estilos.
- Completado: reemplazo de colores hardcodeados en:
  - `src/ui/features/contact/ContactFormSection.vue`
  - `src/ui/features/contact/ContactStepper.vue`
- Validacion: `npm run quality:fast` ✅.

---
# Historial de Tareas Completadas

*En este archivo se registran de forma definitiva las tareas cerradas, manteniendo el historial del proyecto.*

---

## [2026-03-14] Workflow: Todo Workflow - Implementacion ADR-012

### âœ… Certezas ejecutadas automaticamente

#### ADR-012 - Gobernanza de dependencias en SubmitContactUseCase
- Completado: creado ADR `docs/decisions/ADR-012-submit-contact-dependency-strategy.md`.
- Completado: removida la ultima pregunta activa de `docs/preguntas-arquitectura.md`.
- Completado: agregado trigger documental en `docs/README.md` para reconsiderar cuando un use-case supere 10 dependencias.
- Completado: agregado checklist de senales de revision dentro de ADR-012.
- Validacion: `npm run lint:component-size` âœ….

### ðŸŸ¡ Dudas de bajo nivel resueltas por el agente

- Duda: definir el trigger solo por cantidad de dependencias o combinar con seÃ±ales cualitativas.
- Opciones evaluadas:
  - Opcion A: solo umbral numerico estricto.
  - Opcion B: umbral numerico + seÃ±ales de mantenimiento/testing.
- Decision: **Opcion B** por mejor equilibrio entre objetividad y contexto real de evolucion.

---

## [2026-03-14] Workflow: Todo Workflow - Implementacion ADR-011

### âœ… Certezas ejecutadas automaticamente

#### ADR-011 - Gobernanza de componentes grandes
- Completado: creado `scripts/check-component-size-thresholds.mjs` con control de umbrales:
  - `src/ui/pages/HomePage.vue` max 1300 lineas
  - `src/ui/features/contact/ContactFormSection.vue` max 750 lineas
- Completado: agregado script `lint:component-size` en `package.json`.
- Completado: integrado `lint:component-size` en `quality:fast`.
- Completado: documentados triggers tecnicos de refactor en `docs/README.md` con referencia a ADR-011.
- Validacion: `npm run quality:fast` âœ… (incluye nuevo check y sin falsos positivos).

### ðŸŸ¡ Dudas de bajo nivel resueltas por el agente

- Duda: en caso de superar umbral, Â¿warning o error de CI/local?
- Opciones evaluadas:
  - Opcion A: warning informativo sin cortar calidad.
  - Opcion B: error bloqueante en quality gate.
- Decision: **Opcion B** por alineacion con objetivo de gobernanza activa y deteccion temprana.
- Impacto: evita crecimiento no controlado de componentes y fuerza decision explicita via ADR cuando se cruza umbral.

---

## [2026-03-14] Workflow: Todo Workflow - Implementacion ADR-010

### âœ… Certezas ejecutadas automaticamente

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
- Validacion: `npm run quality:fast` âœ… (typecheck, tests, security, colors, layers).

### ðŸŸ¡ Dudas de bajo nivel resueltas por el agente

- Duda: formato de compatibilidad con drafts legacy en `localStorage`.
- Opciones evaluadas:
  - Opcion A: migrar automaticamente drafts legacy al nuevo formato.
  - Opcion B: invalidar drafts legacy y limpiarlos.
- Decision: **Opcion B** (invalidar y limpiar) por menor riesgo de mantener PII historica y menor complejidad.
- Impacto: un draft previo puede perderse una unica vez tras despliegue, alineado con privacy-by-default.

---

## [2026-03-14] Workflow: Todo Workflow - Procesamiento de Backlog Code-Audit

### âœ… Certezas ejecutadas automÃ¡ticamente

#### P0 - Eliminar apertura insegura de URL en ServiceCard
- Completado: eliminado `window.open(href, '_blank')` en `src/ui/sections/ServiceCard.vue`.
- Completado: delegada la acciÃ³n al flujo centralizado mediante `emit('contact', { section, href })`.
- Impacto: se evita bypass de controles de navegaciÃ³n/analytics y se elimina la superficie de reverse tabnabbing en ese componente.
- Evidencia: cambio en `src/ui/sections/ServiceCard.vue:110-112`.

### ðŸ”´ Dudas de alto nivel escaladas

- Escalada: polÃ­tica de persistencia de PII en drafts de contacto (localStorage vs sessionStorage/TTL).
- Escalada: estrategia de refactor para componentes extensos (`HomePage.vue`, `ContactFormSection.vue`).
- Escalada: posible reestructuraciÃ³n de dependencias en `SubmitContactUseCase` (fan-in de constructor).
- Registro: `docs/preguntas-arquitectura.md`.

---

## [2026-03-09] Workflow: Todo Workflow - Cierre de Backlog

### âœ… Tareas completadas

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

## [2026-03-09] Workflow: OptimizaciÃ³n de Ecosistema de Skills

### âœ… Skills Unificados

#### ui-ux-audit + frontend-best-practices-audit
- **DecisiÃ³n**: Unificar ui-ux-audit (112 lÃ­neas) en frontend-best-practices-audit
- **JustificaciÃ³n**: ui-ux-audit era muy pequeÃ±o, funcionalidad complementaria
- **Cambios realizados**:
  - Agregado **Pilar 6: UI/UX Visual** a frontend-best-practices-audit
  - JerarquÃ­a visual, consistencia, usabilidad, responsive, accesibilidad
  - Eliminado directorio `.agents/skills/ui-ux-audit/`
- **Ecosistema resultante**: 6 skills (reducido de 7)

### âœ… EspecializaciÃ³n de Skills

#### EliminaciÃ³n de duplicaciÃ³n code-audit vs frontend-best-practices
- **Problema**: Ambos skills cubrÃ­an Clean Architecture y SOLID
- **DecisiÃ³n**: 
  - Mantener `code-audit` como skill generalista (frontend + backend)
  - Quitar pilar de Arquitectura/SOLID de `frontend-best-practices-audit`
- **Cambios realizados**:
  - `frontend-best-practices-audit`: De 6 pilares a 5 pilares
  - Eliminado: Pilar 5 (Code Organization con Clean Architecture/SOLID)
  - Renumerado: Pilar 6 (UI/UX) â†’ Pilar 5
  - Actualizada descripciÃ³n y referencias
- **Beneficio**: 
  - `code-audit`: Ãšnico responsable de Arquitectura Limpia y SOLID
  - `frontend-best-practices-audit`: Enfocado en Vue, TS, Naming, HTTP, UI/UX
  - Sin duplicaciÃ³n, responsabilidades claras

### âœ… Skills Creados

#### docs-maintainer (nuevo skill)
- **PropÃ³sito**: Gestionar y sincronizar documentaciÃ³n en docs/
- **Responsabilidades**:
  - Mantener todo.md y todo.done.md
  - Gestionar ADRs e Ã­ndices
  - Sincronizar preguntas-arquitectura.md
  - Generar reportes de documentaciÃ³n
- **Gap detectado**: No habÃ­a skill dedicado a documentaciÃ³n
- **Estado**: âœ… Creado y listo para usar

### ðŸ“Š Estado del Ecosistema de Skills

| Skill | LÃ­neas | Estado | FunciÃ³n |
|-------|--------|--------|---------|
| skill-orchestrator | 356 | ðŸ†• Nuevo | Orquestador meta |
| frontend-best-practices-audit | 356 | ðŸ”„ Actualizado | Vue + TS + Naming + UI/UX |
| todo-workflow | 348 | âœ… OK | Procesa tareas |
| decision-helper | 310 | âœ… OK | Decisiones ADR |
| code-audit | 306 | âœ… OK | Seguridad + SOLID |
| docs-maintainer | 306 | ðŸ†• Nuevo | GestiÃ³n documentaciÃ³n |
| gh-actions-audit | 166 | âœ… OK | CI/CD |

**Total**: 7 skills optimizados (consolidado desde 8)

---

## [2026-03-09] Workflow: AuditorÃ­a Frontend Best Practices - VerificaciÃ³n Completa

### âœ… VerificaciÃ³n de Mejoras Propuestas

#### v-for con :key - YA IMPLEMENTADOS
- **VerificaciÃ³n**: Todos los v-for en el codebase ya tienen `:key` implementado
- **Hallazgo**: Las mejoras sugeridas en la auditorÃ­a ya estaban aplicadas
- **Archivos verificados**:
  - `HomePage.vue`: Todos los v-for usan keys (`link.href`, `card.id`, `benefit.text`, `item.question`)
  - `ServiceCard.vue`: Usa keys compuestos (`${card.id}-item-${index}`)
  - `MedicionConsumoEscobar.vue`: Usa `faq.question` como key
- **Estado**: âœ… Completos - no requieren cambios

#### Uso de Ã­ndice en v-for - ACEPTABLE
- **VerificaciÃ³n**: Solo 3 casos usan Ã­ndice como key
- **Contexto**: Casos donde no hay identificador Ãºnico disponible:
  - `trustLogos` con `idx` (array de imÃ¡genes sin ID)
  - `card.items` con `index` (items de servicio son strings)
- **DecisiÃ³n**: Mantener Ã­ndice es aceptable en estos casos
- **Prioridad**: Baja - no afecta funcionalidad

---

## [2026-03-09] Workflow: AuditorÃ­a Frontend Best Practices - Mejoras Ejecutadas

### âœ… Mejoras de Bajo Nivel Ejecutadas

#### Agregar :key a v-for en HomePage.vue
- **DecisiÃ³n**: Ejecutar inmediatamente (bajo riesgo, mejora performance)
- **Cambios realizados**:
  - LÃ­nea 74: `v-for="link in headerLinks"` â†’ `v-for="link in headerLinks" :key="link.href"`
  - LÃ­nea 85: `v-for="link in quickLinks"` â†’ `v-for="link in quickLinks" :key="link.href"`
- **ValidaciÃ³n**: `npm run typecheck` âœ…
- **Riesgo**: Ninguno - cambio mecÃ¡nico

#### Implementar backoff exponencial en retries HTTP
- **DecisiÃ³n**: Ejecutar inmediatamente (mejora estabilidad)
- **Cambios realizados**:
  - Agregado delay exponencial entre reintentos: 1s, 2s, 4s
  - MÃ©todo `delay()` privado para setTimeout promisificado
  - Aplica tanto a errores 5xx como a excepciones de red
- **Archivo**: `src/infrastructure/http/fetchHttpClient.ts`
- **ValidaciÃ³n**:
  - `npm run typecheck` âœ…
  - `npm run lint:layers` âœ… (0 violaciones)
- **Riesgo**: Bajo - mejora comportamiento existente

### ðŸ”´ Dudas de Bajo Nivel - DecisiÃ³n de No AcciÃ³n

#### Type Assertions (45 usos)
- **DecisiÃ³n**: NO ejecutar refactor masivo
- **JustificaciÃ³n**: La mayorÃ­a son justificados (JSON.parse, interoperabilidad)
- **Meta**: Reducir gradualmente en futuros PRs (<20 usos)
- **Prioridad**: Baja - no es deuda tÃ©cnica crÃ­tica

#### Uso de any vs unknown (ratio 1:3)
- **DecisiÃ³n**: Mantener estado actual
- **JustificaciÃ³n**: Ratio 50 any / 143 unknown es aceptable
- **AcciÃ³n**: Revisar en code reviews futuros
- **Prioridad**: Baja

#### Timeout HTTP configurable
- **DecisiÃ³n**: NO implementar ahora
- **JustificaciÃ³n**: 10s default funciona para caso de uso actual
- **LÃ­mite**: Implementar cuando haya endpoints que requieran tiempos diferentes
- **Prioridad**: Baja

#### TODOs de migraciÃ³n a features/
- **DecisiÃ³n**: Mantener TODOs existentes
- **JustificaciÃ³n**: Depende de refactor mayor de arquitectura
- **AcciÃ³n**: Abordar cuando se planifique migraciÃ³n completa
- **Prioridad**: Baja

---

## [2026-03-09] DecisiÃ³n ArquitectÃ³nica: Estructura de QuotePage.vue

### âœ… DecisiÃ³n Tomada

**Pregunta**: Â¿CÃ³mo estructurar QuotePage.vue (601 lÃ­neas) - extraer componentes o mantener monolito?

**DecisiÃ³n**: OpciÃ³n C - Mantener monolito (por ahora)

**JustificaciÃ³n**:
- El cÃ³digo ya anticipa su propio refactor (comentario SOLID-DEBATE lÃ­nea 34)
- QuotePage es pÃ¡gina especÃ­fica (no componente compartido como ContactFormSection)
- CohesiÃ³n funcional > fragmentaciÃ³n arbitraria
- Riesgo de refactor no justifica beneficio actual
- Consistente con ADR-003 (HomePage.vue) y ADR-007 (HomePage.ts)

**LÃ­mites de reconsideraciÃ³n**:
- Workflow necesite reutilizarse en otra pÃ¡gina
- Archivo supere 800 lÃ­neas
- Se agreguen mÃ¡s features complejos al workflow

**ADR**: `docs/decisions/ADR-009-quotepage-structure.md`

**Acciones**:
- âœ… Crear ADR-009 documentando decisiÃ³n consciente
- âœ… Mantener cÃ³digo existente (sin refactor)
- âœ… Monitorear lÃ­mites de reconsideraciÃ³n

**ValidaciÃ³n**:
- `npm run typecheck` âœ…
- `npm run lint:layers` âœ…

---

## [2026-03-09] DecisiÃ³n ArquitectÃ³nica: ConsolidaciÃ³n de MÃ³dulo SEO

### âœ… DecisiÃ³n Tomada

**Pregunta**: Â¿Consolidar tipos SEO dispersos en mÃºltiples archivos o mantener separaciÃ³n?

**DecisiÃ³n**: OpciÃ³n A - Eliminar barrel file `ui/seo/defaultSeo.ts`, usar imports directos

**JustificaciÃ³n**:
- El barrel file solo re-exportaba, aÃ±adÃ­a indirecciÃ³n sin valor
- Imports directos son mÃ¡s claros y explÃ­citos
- Reduce de 4 a 3 archivos sin pÃ©rdida de funcionalidad
- Mantiene integridad de capas (appSeo.ts permanece en UI)

**ADR**: `docs/decisions/ADR-008-seo-module-consolidation.md`

**Acciones**:
- âœ… Crear ADR-008 documentando decisiÃ³n
- âœ… Actualizar imports en `src/ui/App.ts` (getDefaultSeo desde application)
- âœ… Actualizar imports en `src/ui/seo/appSeo.ts` (types desde domain, jsonLd desde domain)
- âœ… Eliminar barrel file `src/ui/seo/defaultSeo.ts`
- âœ… Validar con typecheck y lint:layers

**ValidaciÃ³n**:
- `npm run typecheck` âœ…
- `npm run lint:layers` âœ… (0 violaciones, 152 archivos escaneados)

**Archivos modificados**:
- `src/ui/App.ts` - import directo de application/seo/defaultSeo
- `src/ui/seo/appSeo.ts` - imports directos de domain/seo/types y domain/seo/jsonLd
- `src/ui/seo/defaultSeo.ts` - ðŸ—‘ï¸ Eliminado

---

## [2026-03-09] DecisiÃ³n ArquitectÃ³nica: Estructura de HomePage.ts

### âœ… DecisiÃ³n Tomada

**Pregunta**: Â¿Extraer helpers de mapeo de HomePage.ts a archivo separado o mantener cohesiÃ³n?

**DecisiÃ³n**: OpciÃ³n B - Mantener en archivo actual por cohesiÃ³n funcional

**JustificaciÃ³n**: 
- Las funciones helper son especÃ­ficas de HomePage, no reusables
- 267 lÃ­neas es manejable (no excesivo)
- El cÃ³digo ya anticipa su propio refactor (comentario SOLID-DEBATE para tercera variante)
- Riesgo de refactor no justifica beneficio
- Consistente con ADR-006 (cohesiÃ³n > tamaÃ±o)

**LÃ­mites de reconsideraciÃ³n**:
- Se agrega tercera variante de pÃ¡gina
- Archivo supera 400 lÃ­neas  
- Helpers necesitan reutilizaciÃ³n

**ADR**: `docs/decisions/ADR-007-homepage-ts-structure.md`

**Acciones**:
- âœ… Crear ADR-007 documentando decisiÃ³n consciente
- âœ… Eliminar pregunta de `preguntas-arquitectura.md`
- âœ… No se requieren cambios de cÃ³digo (decisiÃ³n de no-acciÃ³n)

---

## [2026-03-09] Workflow: Procesamiento de AuditorÃ­a de CÃ³digo

### âœ… DUDAS BAJO NIVEL Ejecutadas

#### Seguridad: Verificar localStorage no almacena datos sensibles
- **Archivos**: `src/infrastructure/storage/browserStorage.ts`, `src/features/contact/infrastructure/contactDraftStorage.ts`
- **DecisiÃ³n**: OpciÃ³n A - Verificar cÃ³digo + Documentar (suficiente para el proyecto actual)
- **Cambio realizado**:
  - Verificado: Solo almacena drafts de formularios y consentimiento
  - Agregado comentario de advertencia de seguridad en BrowserStorage
- **ValidaciÃ³n**: `npm run typecheck` âœ… pasÃ³
- **Riesgo residual**: Bajo - el proyecto no maneja tokens de autenticaciÃ³n

**CÃ³digo resultante**:
```typescript
/**
 * âš ï¸ SEGURIDAD: Esta implementaciÃ³n usa localStorage (no encriptado).
 * NO usar para almacenar: tokens de autenticaciÃ³n, contraseÃ±as, datos sensibles.
 * Uso actual vÃ¡lido: drafts de formularios, preferencias de consentimiento.
 */
export class BrowserStorage implements StoragePort {
```

---

#### Arquitectura: Mover whatsappQr.ts de Application a UI
- **Archivo origen**: `src/application/constants/whatsappQr.ts`
- **Archivo destino**: `src/ui/composables/useWhatsAppQr.ts`
- **DecisiÃ³n**: OpciÃ³n A - Mover a `src/ui/composables/` (correcto arquitectÃ³nicamente)
- **Cambio realizado**:
  - Movido archivo a ubicaciÃ³n correcta (es un composable, no una constante)
  - Renombrado de `getWhatsAppQrConfig` a `useWhatsAppQrConfig` (convenciÃ³n composables)
  - Agregado JSDoc con nota de deprecaciÃ³n (archivo no estÃ¡ en uso activo)
  - Eliminada carpeta `src/application/constants/` (vacÃ­a)
- **ValidaciÃ³n**: `npm run typecheck` âœ… pasÃ³ (no tenÃ­a dependencias externas)
- **Riesgo**: Ninguno - archivo no estaba siendo importado

---

### ðŸ”´ DUDAS ALTO NIVEL Escaladas/Resueltas

1. âœ… **[2026-03-09] Refactor: Reducir complejidad de HomePage.ts** â†’ **RESUELTA (ADR-007)**
   - DecisiÃ³n: Mantener cohesiÃ³n, no refactorizar
   - ADR: `docs/decisions/ADR-007-homepage-ts-structure.md`

2. âœ… **[2026-03-09] ConsolidaciÃ³n: Tipos SEO dispersos en mÃºltiples archivos** â†’ **RESUELTA (ADR-008)**
   - DecisiÃ³n: Eliminar barrel file, usar imports directos
   - ADR: `docs/decisions/ADR-008-seo-module-consolidation.md`

---

## [2026-03-08] Workflow: Procesamiento de AuditorÃ­a de CÃ³digo

### âœ… Certezas Ejecutadas

#### Seguridad: Documentar innerHTML en Microsoft Clarity
- **Archivo**: `src/infrastructure/analytics/clarity.ts` (lÃ­nea 27)
- **Cambio realizado**: 
  - Reemplazado `script.innerHTML` por `script.textContent` (mÃ¡s seguro)
  - Agregado comentario explicativo sobre seguridad
- **ValidaciÃ³n**: `npm run typecheck` âœ… pasÃ³
- **Riesgo**: Ninguno - cambio equivalente funcionalmente, mÃ¡s seguro

**CÃ³digo resultante**:
```typescript
// Nota de seguridad: Este es el loader oficial de Microsoft Clarity (cÃ³digo estÃ¡tico de terceros).
// El ID es inyectado pero validado como string. No contiene user input.
// textContent se prefiere sobre innerHTML para evitar interpretaciÃ³n HTML.
script.textContent = "(function(c,l,a,r,i,t,y)..."
```

---

## [2026-03-08] DecisiÃ³n ArquitectÃ³nica: ContentRepository DI

### âœ… DecisiÃ³n Tomada

**Pregunta**: Â¿Refactorizar inyecciÃ³n de dependencias en ContentRepository?

**DecisiÃ³n**: OpciÃ³n C - Mantener implementaciÃ³n actual con defaults

**JustificaciÃ³n**: El riesgo de refactorizaciÃ³n no justifica el beneficio acadÃ©mico. El cÃ³digo funciona correctamente.

**ADR**: `docs/decisions/ADR-002-content-repository-di.md`

**Acciones**:
- âœ… Crear ADR-002 documentando decisiÃ³n consciente
- âœ… Eliminar pregunta de `preguntas-arquitectura.md`

---

## [2026-03-08] DecisiÃ³n ArquitectÃ³nica: HomePage.vue Component Structure

### âœ… DecisiÃ³n Tomada

**Pregunta**: Â¿CÃ³mo estructurar HomePage.vue (1,124 lÃ­neas)?

**DecisiÃ³n**: OpciÃ³n B - Mantener monolito, extraer solo composables

**JustificaciÃ³n**: El composable `useHomePage()` ya existe y separa la lÃ³gica. Extraer sub-componentes serÃ­a overkill sin necesidad de reutilizaciÃ³n.

**ADR**: `docs/decisions/ADR-003-homepage-component-structure.md`

**Acciones**:
- âœ… Crear ADR-003 documentando decisiÃ³n consciente
- âœ… Eliminar pregunta de `preguntas-arquitectura.md`

---

## [2026-03-08] DecisiÃ³n ArquitectÃ³nica: ContactFormSection.vue Structure

### âœ… DecisiÃ³n Tomada

**Pregunta**: Â¿CÃ³mo dividir ContactFormSection.vue (641 lÃ­neas, formulario wizard)?

**DecisiÃ³n**: OpciÃ³n B - Extraer solo el stepper, mantener pasos inline

**JustificaciÃ³n**: El stepper es puramente presentacional y reusable. Extraer todos los pasos serÃ­a overkill con alto riesgo.

**ADR**: `docs/decisions/ADR-004-contact-form-structure.md`

**Plan de acciÃ³n**: 
- Crear `ContactStepper.vue` componente presentacional
- Integrar en `ContactFormSection.vue`
- EstimaciÃ³n: 2-3 horas

**Acciones**:
- âœ… Crear ADR-004 documentando decisiÃ³n y plan
- âœ… Eliminar pregunta de `preguntas-arquitectura.md`

---

## [2026-03-08] DecisiÃ³n ArquitectÃ³nica: ContentRepository Mega-Repository

### âœ… DecisiÃ³n Tomada

**Pregunta**: Â¿Dividir ContentRepository (15+ interfaces) o mantener mega-repository?

**DecisiÃ³n**: OpciÃ³n C - Mantener mega-repository (documentar decisiÃ³n consciente)

**JustificaciÃ³n**: El repository actÃºa como Facade unificado para todo el contenido. El riesgo de refactor no justifica el beneficio. CohesiÃ³n temÃ¡tica: todo es "content".

**ADR**: `docs/decisions/ADR-005-content-repository-mega-repo.md`

**Acciones**:
- âœ… Crear ADR-005 documentando decisiÃ³n consciente
- âœ… Eliminar pregunta de `preguntas-arquitectura.md`

---

## [2026-03-08] DecisiÃ³n ArquitectÃ³nica: Archivos TypeScript Grandes

### âœ… DecisiÃ³n Tomada

**Pregunta**: Â¿Refactorizar quoteApiGateway.ts (349 lÃ­neas) y contactHooks.ts (254 lÃ­neas)?

**DecisiÃ³n**: OpciÃ³n B - Mantener cohesiÃ³n, dividir solo si crecen mÃ¡s

**JustificaciÃ³n**: Ambos archivos tienen alta cohesiÃ³n funcional. El tamaÃ±o es razonable (no excesivo). CohesiÃ³n > tamaÃ±o arbitrario.

**LÃ­mites de reconsideraciÃ³n**:
- quoteApiGateway.ts > 400 lÃ­neas
- contactHooks.ts > 300 lÃ­neas

**ADR**: `docs/decisions/ADR-006-typescript-files-cohesion.md`

**Acciones**:
- âœ… Crear ADR-006 documentando decisiÃ³n consciente
- âœ… Vaciar `preguntas-arquitectura.md` (todas las decisiones resueltas)

---

## Resumen de Decisiones ArquitectÃ³nicas

| Fecha | # | Pregunta | DecisiÃ³n | ADR |
|-------|---|----------|----------|-----|
| 2026-03-08 | 1 | Centro de Preferencias Cookies | Mantener lÃ³gica simple | ADR-001 |
| 2026-03-08 | 2 | DI ContentRepository | Mantener con defaults | ADR-002 |
| 2026-03-08 | 3 | HomePage.vue estructura | Monolito + composable | ADR-003 |
| 2026-03-08 | 4 | ContactFormSection.vue | Extraer stepper | ADR-004 |
| 2026-03-08 | 5 | ContentRepository mega-repo | Mantener como Facade | ADR-005 |
| 2026-03-08 | 6 | Archivos TS grandes | Mantener por cohesiÃ³n | ADR-006 |
| 2026-03-09 | 7 | localStorage seguridad | Documentar + verificar | Completado |
| 2026-03-09 | 8 | whatsappQr.ts ubicaciÃ³n | Mover a composables | Completado |
| 2026-03-09 | 9 | HomePage.ts estructura | Mantener cohesiÃ³n | ADR-007 |
| 2026-03-09 | 10 | ConsolidaciÃ³n mÃ³dulo SEO | Eliminar barrel file | ADR-008 |
| 2026-03-09 | 11 | QuotePage.vue estructura | Mantener monolito | ADR-009 |
| 2026-03-09 | 12 | v-for :key en HomePage | Agregar keys | Completado |
| 2026-03-09 | 13 | Backoff exponencial HTTP | Implementar retry | Completado |
| 2026-03-09 | 14 | UnificaciÃ³n ui-ux-audit | Integrar en frontend-best-practices | Completado |
| 2026-03-09 | 15 | Crear docs-maintainer | Nuevo skill para documentaciÃ³n | Completado |
| 2026-03-09 | 16 | Especializar skills | Quitar SOLID de frontend-best-practices | Completado |

**Total**: 16 decisiones/tareas documentadas, 0 pendientes.

---

---

## [2026-03-09] Workflow: ImplementaciÃ³n ADR-009 (sin cambios de cÃ³digo)

### âœ… Tareas Completadas

#### ADR-009: Estructura de QuotePage.vue - Mantener Monolito
- **DecisiÃ³n**: OpciÃ³n C - Mantener archivo actual (sin refactor)
- **Tipo**: DecisiÃ³n de no-acciÃ³n (no requiere cambios de cÃ³digo)
- **Acciones realizadas**:
  - âœ… Documentar decisiÃ³n en ADR-009
  - âœ… Mantener cÃ³digo existente (sin refactor)
  - âœ… Definir lÃ­mites de reconsideraciÃ³n (reutilizaciÃ³n, 800 lÃ­neas, nuevas features)
- **ValidaciÃ³n**:
  - `npm run typecheck` âœ…
  - `npm run lint:layers` âœ… (0 violaciones)
- **Riesgo**: Ninguno - sin cambios en cÃ³digo fuente
- **Estado**: Completada

**Nota**: El comentario SOLID-DEBATE en lÃ­nea 34 de QuotePage.vue actÃºa como trigger para futuro refactor cuando sea necesario.

---

## [2026-03-09] Workflow: ImplementaciÃ³n ADR-007 (sin cambios de cÃ³digo)

### âœ… Tareas Completadas

#### ADR-007: Estructura de HomePage.ts - Mantener CohesiÃ³n
- **DecisiÃ³n**: OpciÃ³n B - Mantener archivo actual por cohesiÃ³n funcional
- **Tipo**: DecisiÃ³n de no-acciÃ³n (no requiere cambios de cÃ³digo)
- **Acciones realizadas**:
  - âœ… Documentar decisiÃ³n en ADR-007
  - âœ… Mantener cÃ³digo existente (sin refactor)
  - âœ… Definir lÃ­mites de reconsideraciÃ³n (tercera variante, 400 lÃ­neas, reuso)
- **ValidaciÃ³n**:
  - `npm run typecheck` âœ…
  - `npm run lint:layers` âœ… (0 violaciones)
- **Riesgo**: Ninguno - sin cambios en cÃ³digo fuente
- **Estado**: Completada

**Nota**: Esta decisiÃ³n prioriza cohesiÃ³n funcional sobre fragmentaciÃ³n arbitraria. El cÃ³digo ya anticipa su propio refactor futuro (comentario SOLID-DEBATE para tercera variante).

---

*Inbox de tareas procesado completamente.*





