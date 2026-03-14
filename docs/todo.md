# Agenda de Tareas de Codigo (`docs/todo.md`)

Auditoria `frontend-best-practices-audit` sobre `src/` (2026-03-14, pasada preventiva).

## Resumen Ejecutivo

- Hallazgos criticos: **0**
- Hallazgos de advertencia: **2**
- Hallazgos de mejora: **0**
- `npm run typecheck`: **OK**
- `npm run lint:component-size`: **OK**

## ADVERTENCIA - Naming y Consistencia Vue

### 0. Sin hallazgos P0 abiertos en esta pasada
- Estado: sin tareas criticas de prioridad 0 en `frontend-best-practices-audit`.

### 1) Nombre de archivo composable sin prefijo `use`
- [ ] [ADVERTENCIA] Renombrar `contactHooks.ts` a nombre consistente con convencion de composables
- **Archivo**: `src/ui/features/contact/contactHooks.ts`
- **Problema**: el archivo exporta `useContactForm(...)`, pero el nombre de modulo no sigue patron `useX.ts`.
- **Impacto**: reduce descubribilidad y consistencia de navegacion para el equipo.
- **Sugerencia**: renombrar a `useContactForm.ts` y actualizar imports en `ContactFormSection.ts`.
- **Prioridad**: Media

## ADVERTENCIA - UI/UX Visual

### 2) Colores HEX hardcodeados fuera de design tokens
- [ ] [ADVERTENCIA] Migrar estilos hardcodeados a tokens de diseno existentes
- **Archivos**:
  - `src/ui/features/contact/ContactFormSection.vue`
  - `src/ui/features/contact/ContactStepper.vue`
- **Problema**: uso intensivo de HEX directos (`#ff8c00`, `#0a192f`, `#ffffff`, etc.) en lugar de variables/tokens del sistema.
- **Impacto**: dificulta consistencia visual, theming y mantenimiento cross-brand.
- **Sugerencia**: reemplazar por variables CSS de `dm-*` y centralizar estados (focus, error, active).
- **Prioridad**: Media

## ADVERTENCIA - Calidad y Arquitectura (Resueltas)

### 3) Literales de UI con mojibake (encoding inconsistente)
- [x] [ADVERTENCIA] Corregir textos con codificacion corrupta en formulario de contacto
- **Archivo**: `src/ui/features/contact/ContactFormSection.vue`
- **Problema**: textos visibles con encoding corrupto (`DescripciÃ³n`, `ElegÃ­`, `ContÃ¡ctanos`).
- **Estado**: resuelto (2026-03-14).
- **Evidencia**:
  - literales normalizados usando entidades HTML (`&oacute;`, `&iacute;`, `&eacute;`, `&aacute;`).
  - verificacion de residuos de mojibake: `rg -n "Ã|â|�" src/ui/features/contact/ContactFormSection.vue` (sin resultados).
  - validacion ejecutada: `npm run test -- tests/unit/ui/contactFormSection.test.ts` y `npm run typecheck`.
- **Prioridad**: Alta

## MEJORA - Mantenibilidad (Resueltas)

### 4) HomePage.vue mantiene alto tamano (dentro de umbral)
- [x] [MEJORA] Ejecutar primera etapa del plan incremental de modularizacion
- **Archivo**: `src/ui/pages/HomePage.vue` (1277 lineas, umbral 1300)
- **Contexto**: existe plan en `docs/homepage-modularization-plan.md`, aun sin aplicar Etapa 1.
- **Recomendacion**: extraer un bloque presentacional de bajo riesgo (FAQ o quick links) con validacion por slice.
- **Prioridad**: Media
- **Estado**: resuelto (2026-03-14).
- **Evidencia**:
  - bloque FAQ extraido a `src/ui/pages/home/HomeFaqList.vue`.
  - `HomePage.vue` ahora delega FAQ a componente presentacional y removio estilos FAQ embebidos.

### 5) Encapsular trust signals repetitivos en Hero (Etapa 2)
- [x] [MEJORA] Extraer bloque reutilizable de trust logos/chips con props tipadas
- **Archivos**: `src/ui/pages/HomePage.vue`, `src/ui/pages/home/HomeHeroTrustSignals.vue`
- **Estado**: resuelto (2026-03-14).
- **Evidencia**:
  - bloque `c-home-hero__trust-inline` extraido a `HomeHeroTrustSignals.vue`.
  - props tipadas con `ImageContent[]` y `string[]` desde `src/domain/types/content`.

### 6) Consolidacion de handlers UI en utilidades de pagina (Etapa 3)
- [x] [MEJORA] Mover handler visual de click footer WhatsApp fuera del SFC principal
- **Archivos**: `src/ui/pages/HomePage.vue`, `src/ui/pages/home/homePageUiHandlers.ts`
- **Estado**: resuelto (2026-03-14).
- **Evidencia**:
  - `handleFooterWhatsAppClick` ahora se crea desde `createFooterWhatsAppClickHandler(whatsappHref)`.
  - `HomePage.vue` reduce logica local de eventos visuales y mantiene `useHomePage()` como orquestador.

## Notas de Auditoria

- Hallazgos enfocados en estandares frontend (naming y visual tokens).
- No se detectaron problemas criticos de Vue/TypeScript que bloqueen ejecucion.
