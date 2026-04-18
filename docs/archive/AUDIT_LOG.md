# Audit Log (Archive)

Este documento centraliza los reportes de auditoría técnica y de experiencia de usuario realizados durante el desarrollo del proyecto.

---

## 1. Auditoría UX/UI (Refinamiento Estético)
**Estado Actual**: Estética "Industrial-Tech". 
**Principales Hallazgos**:
- **Fortalezas**: Layout jerárquico, CTAs efectivos, accesibilidad base cumplida.
- **Debilidades**: Rigidez visual, micro-interacciones escasas, alta fatiga visual en formularios.
**Recomendaciones implementadas/proyectadas**:
- Incorporar Glassmorfismo (blurs y bordes sutiles).
- Refinar tipografía (Inter/Manrope) y aumentar el "whitespace".
- Implementar micro-interacciones suaves (`translateY` en hover).
- Suavizar inputs de formularios (`rgba` en lugar de sólidos).

---

## 2. Auditoría de Frontend y Contenido Hardcoded
**Contexto**: Se identificó una alta dispersión de strings y configuraciones embebidas en componentes Vue.
**Hallazgos Críticos**:
- La configuración de SEO y Marca estaba duplicada entre `runtimeProfiles.json` y los componentes.
- El objeto `TecnicoACargo` estaba hardcoded en la UI.
**Acción realizada**: Migración de la fuente de verdad hacia un contrato unificado (`GET /v1/site`) que sirve `content`, `brand` y `seo`.

---

## 3. Auditoría de Backend (FastAPI Migration)
**Objetivo**: Garantizar que el backend de FastAPI replique fielmente el comportamiento esperado por el frontend de Vue.
**Requerimientos establecidos**:
- Implementación de `GET /v1/site` como contrato canónico.
- Mantenimiento de envelopes estables para `contact` y `mail` (con `submission_id` y `request_id`).
- Soporte obligatorio de CORS para `https://datamaq.com.ar`.

---

## 4. Auditoría de Entrega (Frontend-to-Backend Handover)
**Resumen**: Registro de los puntos de control para la integración final.
- **Endpoints validados**: `health`, `site`, `pricing`, `contact`, `quote`.
- **Regla de resiliencia**: El frontend debe mantener sus propios fallbacks locales para indisponibilidad técnica, sin depender de mensajes de error dinámicos del backend para el renderizado base.
- **Observabilidad**: Uso de trazas estructuradas para el seguimiento de leads.

---

## 5. Relevamiento Comparativo UI/UX (LearnPress vs Plantilla)
**Fecha**: 2026-04-09
**Objetivo**: Comparar el sitio de producción (`cursos.datamaq.com.ar`) contra el diseño de referencia.
**Hallazgos Clave**:
- **Consistencia**: Se implementó un `theme bridge` para unificar estilos entre LearnPress y la identidad visual de DataMaq.
- **Técnico**: Se corrigió una incompatibilidad crítica de PHP en el plugin MU que bloqueaba la carga de estilos bridge.
- **Conclusión**: El estado general mejoró tras los ajustes de selectores para CTA y perfil de instructor. Pendiente decidir el nivel de fidelidad final deseado para la convergencia total.
