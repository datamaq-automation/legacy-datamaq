# Agenda de Tareas de Codigo (`docs/todo.md`)

Auditoria `code-audit` sobre `src/` (2026-03-14).

## Resumen Ejecutivo

- Hallazgos criticos: **0**
- Hallazgos de advertencia: **0** (+3 resueltos)
- Hallazgos de mejora: **3**
- Verificacion de capas: `npm run lint:layers` -> **0 violaciones**

## ADVERTENCIA - Ciberseguridad y Arquitectura

### 1) Apertura de URL externa dinamica sin allowlist estricta de host
- [x] [ADVERTENCIA] Restringir destinos de `openWhatsApp` a dominios permitidos
- **Archivo**: `src/ui/controllers/contactController.ts:32`
- **Problema**: `window.open(whatsappUrl, '_blank', 'noopener,noreferrer')` abre URL externa proveniente de `href` dinamico (`resolveCandidateChatUrl`).
- **Riesgo**: redireccion a dominio no esperado/phishing si el contenido remoto es manipulado.
- **Estado**: resuelto (2026-03-14).
- **Evidencia**:
  - `buildPrefilledWhatsAppUrl` ahora rechaza URLs no parseables/no `https`/host no WhatsApp.
  - validacion de dominio endurecida con match exacto o subdominio valido (`wa.me`, `*.wa.me`, `whatsapp.com`, `*.whatsapp.com`).
  - tests actualizados: `tests/unit/ui/contactController.test.ts`.
  - validacion ejecutada: `npm run test -- tests/unit/ui/contactController.test.ts` y `npm run typecheck`.
- **Prioridad**: Alta

### 2) Persistencia en localStorage de datos de borrador sin cifrado
- [x] [ADVERTENCIA] Endurecer politica de persistencia de draft de contacto
- **Archivo**: `src/features/contact/infrastructure/contactDraftStorage.ts:72`
- **Problema**: se persiste en `localStorage` (`company`, `comment`, `preferredContact`, `currentStep`) en texto plano.
- **Riesgo**: exposicion en equipos compartidos o inspeccion local del navegador.
- **Estado**: resuelto (2026-03-14) con mitigacion UX conservadora.
- **Evidencia**:
  - se mantiene minimizacion + TTL (ADR-010).
  - agregado aviso de privacidad en UI: `src/ui/features/contact/ContactFormSection.vue` (`c-contact__privacy-note`).
  - validacion ejecutada: `npm run test -- tests/unit/ui/contactFormSection.test.ts`.
- **Prioridad**: Media

### 3) Fan-in elevado en caso de uso central
- [x] [ADVERTENCIA] Monitorear complejidad por cantidad de dependencias en use case
- **Archivo**: `src/application/use-cases/submitContact.ts:20`
- **Problema**: constructor con 8 dependencias (acoplamiento de orquestacion).
- **Riesgo**: fragilidad de mantenimiento/testing si sigue creciendo.
- **Estado**: resuelto (2026-03-14) por monitoreo automatizado.
- **Evidencia**:
  - nuevo check: `scripts/check-usecase-constructor-deps.mjs`.
  - script npm: `lint:usecase-deps`.
  - integrado en `quality:fast`.
  - validacion ejecutada: `npm run lint:usecase-deps` -> `submitContact.ts` en `8/10`.
- **Prioridad**: Media

## MEJORA - SOLID (Mantenibilidad)

### 4) Componente de pagina con alto tamano
- [ ] [MEJORA] Plan de modularizacion incremental para `HomePage.vue`
- **Archivo**: `src/ui/pages/HomePage.vue` (~1122 lineas)
- **Problema**: tamano alto para SRP y costo de review.
- **Recomendacion**: mantener criterio ADR-011 y extraer piezas solo ante triggers de reuso/complejidad.
- **Prioridad**: Media

### 5) Componente wizard de contacto de tamano elevado
- [ ] [MEJORA] Continuar extracciones puntuales en `ContactFormSection.vue`
- **Archivo**: `src/ui/features/contact/ContactFormSection.vue` (~619 lineas)
- **Problema**: mezcla de UI, flujo wizard y estados locales complejos.
- **Recomendacion**: priorizar extracciones presentacionales/composables de bajo riesgo cuando haya cambio funcional relacionado.
- **Prioridad**: Media

### 6) Deuda de migracion arquitectonica documentada
- [ ] [MEJORA] Resolver TODOs de migracion a estructura por features
- **Archivos**:
  - `src/ui/pages/quoteWebState.ts:1`
  - `src/ui/features/contact/ContactFormSection.vue:20`
- **Problema**: deuda tecnica declarada en comentarios `TODO(arch)`.
- **Recomendacion**: convertir TODOs en tareas de roadmap con alcance y criterio de done.
- **Prioridad**: Baja

## Notas de Auditoria

- No se detectaron usos de `v-html`, `eval`, `new Function` ni violaciones activas de capas (`domain -> infrastructure/ui/application`).
- Hallazgos de arquitectura recientes (ADR-011 y ADR-012) se consideran decisionados, pero siguen bajo monitoreo operativo.
