# Agenda de Tareas Frontend (`docs/todo.md`)

*Las tareas completadas de auditoria, arquitectura e infraestructura del monitor backend fueron migradas a `docs/todo.done.md`.*

## Tareas Pendientes (Priorizadas)

### 0. Definiciones Abiertas del Nuevo Home DataMaq
- [ ] Confirmar si el nuevo home debe reemplazar por completo los modulos legacy hoy omitidos del flujo principal (`CaseStudiesSection` y proceso/tarifas/cobertura) o si deben reincorporarse con el mismo lenguaje visual.
- [ ] Definir si la franja de confianza llevara logos o marcas reales de clientes/partners; por ahora se resolvio con senales/capacidades porque el repo no contiene assets ni autorizaciones de marca.
- [ ] Definir si el boton secundario del banner de cookies debe abrir un centro real de preferencias. Hoy se mantuvo la logica existente de aceptar/rechazar, sin pantalla de configuracion.

### 1. Implementacion de Mejoras UX/UI (Ref: `ux_audit_report.md`)
- [x] Incorporar utilidades de glassmorphism (`backdrop-filter`) en fondos de tarjetas y paneles.
- [x] Refinar tipografia y whitespace (ajuste de `line-height` y `letter-spacing` global).
- [x] Implementar transiciones globales y `translateY(-2px)` con resplandor en hover de CTAs principales.
- [x] Suavizar colores de base y fondo de campos `.form-control` para reducir fatiga visual.
- [x] Redisenar `DevBanner.vue` a formato *pill* flotante y minimizar su impacto visual.

---
