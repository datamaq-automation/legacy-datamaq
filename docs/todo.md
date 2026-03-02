# Agenda de Tareas Frontend (`docs/todo.md`)

*Las tareas completadas de auditoria, arquitectura e infraestructura del monitor backend fueron migradas a `docs/todo.done.md`.*

## Tareas Pendientes (Priorizadas)

### 0. Auditoria de Contenido Hardcodeado para Migracion Backend
- [x] Inventariar el contenido hardcodeado verificable del frontend y documentarlo en `docs/frontend-hardcoded-content-audit.md`.
- [x] Confirmar si existe fallback local completo de `AppContent` y distinguirlo del contenido remoto consumido por `contentApiUrl`.
- [x] Identificar vistas activas que mezclan contenido del repositorio con copy literal en la vista (`HomePage.vue`, `ContactPage.vue`, `ThanksView.vue`, `App.vue`).
- [x] Verificar si `FaqSection.vue` forma parte del flujo principal actual o si quedo residual.
- [x] Responder con evidencia que contenido conviene modelar como `content`, `brand/config`, `seo` y `frontend operational fallback`.
- [x] Definir que la configuracion de marca/SEO hoy en `runtimeProfiles.json` migra al nuevo contrato backend y `runtimeProfiles.json` queda solo como fallback local por entorno.
- [x] Definir que el bloque `TecnicoACargo` pasa a `brand` dentro del nuevo contrato backend.
- [x] Definir que `ContactPage.vue` debe ser 100% gobernada por backend dentro del nuevo contrato `GET /v1/site`.
- [x] Definir que el frontend migra directo al nuevo contrato `GET /v1/site`, sin duplicacion ni compatibilidad temporal con contratos anteriores.

### 1. Implementacion Directa del Contrato `GET /v1/site`
- [x] Introducir el modelo frontend `site` con `content`, `brand` y `seo` como contrato canonico.
- [x] Reemplazar `contentApiUrl` por `siteApiUrl` en configuracion runtime y resolucion de endpoints.
- [x] Migrar `ContentRepository` para consumir snapshot remoto completo de `GET /v1/site` sin compatibilidad temporal con el contrato anterior.
- [x] Mover la fuente activa de marca y SEO desde `config` hacia el snapshot remoto (`brand` y `seo`).
- [x] Modelar el copy de `HomePage.vue`, `ContactPage.vue` y `ThanksView.vue` dentro de `content`.
- [x] Mover `TecnicoACargo` a `brand.technician`.
- [x] Mantener mensajes tecnicos de resiliencia como fallback local de frontend.

### 2. Auditoria de Cambios Backend
- [x] Definir una estrategia de auditoria combinando tests de contrato, inspeccion en `F12` y logs estructurados del frontend.
- [x] Documentar un informe operativo para backend sobre el estado actual del frontend y las referencias en `docs/`.
- [ ] Alinear toda la documentacion de migracion y contratos FastAPI al endpoint canonico `GET /v1/site`.
- [/] Alinear la suite `tests/integration/fastApiContracts.test.ts` al contrato canonico `GET /v1/site`.

### 3. Definiciones Abiertas del Nuevo Home DataMaq
- [ ] Confirmar si el nuevo home debe reemplazar por completo los modulos legacy hoy omitidos del flujo principal (`CaseStudiesSection` y proceso/tarifas/cobertura) o si deben reincorporarse con el mismo lenguaje visual.
- [ ] Definir si la franja de confianza llevara logos o marcas reales de clientes/partners; por ahora se resolvio con senales/capacidades porque el repo no contiene assets ni autorizaciones de marca.
- [ ] Definir si el boton secundario del banner de cookies debe abrir un centro real de preferencias. Hoy se mantuvo la logica existente de aceptar/rechazar, sin pantalla de configuracion.

### 4. Implementacion de Mejoras UX/UI (Ref: `ux_audit_report.md`)
- [x] Incorporar utilidades de glassmorphism (`backdrop-filter`) en fondos de tarjetas y paneles.
- [x] Refinar tipografia y whitespace (ajuste de `line-height` y `letter-spacing` global).
- [x] Implementar transiciones globales y `translateY(-2px)` con resplandor en hover de CTAs principales.
- [x] Suavizar colores de base y fondo de campos `.form-control` para reducir fatiga visual.
- [x] Redisenar `DevBanner.vue` a formato *pill* flotante y minimizar su impacto visual.

---
