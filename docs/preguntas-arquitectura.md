# Preguntas de Arquitectura y Producto (FastAPI Migration)

Este documento centraliza las dudas de alto nivel identificadas durante el análisis GAP de la migración a FastAPI.

## 1. Módulos Legacy en Home DataMaq (Tarea 34)
**Contexto**: Existen módulos legacy hoy omitidos del flujo principal (`CaseStudiesSection`, proceso/tarifas/cobertura).
- **Pregunta**: ¿Deben reincorporarse con el nuevo lenguaje visual o eliminarse definitivamente del repositorio?
- **Impacto**: Afecta el modelo de datos de `/v1/site` y el tamaño del bundle frontend.
- **Riesgo**: Mantener código muerto o perder funcionalidades críticas.

## 2. Logos en Franja de Confianza (Tarea 35)
**Contexto**: La franja de confianza usa señales/capacidades genéricas.
- **Pregunta**: ¿Se dispone de activos y autorizaciones para usar marcas reales de clientes/partners?
- **Decisión Necesitada**: Product Owner / Legal.
- **Impacto**: Estética y credibilidad del sitio `datamaq`.

## 3. Centro de Preferencias de Cookies (Tarea 36)
**Contexto**: El banner de cookies solo tiene aceptar/rechazar. El botón secundario no abre nada.
- **Pregunta**: ¿Se requiere un centro de preferencias real o se mantiene la lógica simple actual?
- **Impacto**: Cumplimiento normativo (GDPR/locales) y UX.

---
**Responsable de Decisión**: Tech Lead / Product Owner.
