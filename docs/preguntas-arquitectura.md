# Decisiones Arquitectónicas Implementadas

## 1. Módulos Legacy
- **Decisión**: Eliminados (CaseStudies, DecisionFlow, Faq, etc.) del repositorio físico y de la navegación.
- **Estado**: Ejecutado.

## 2. Logos en Franja de Confianza
- **Decisión**: Usar marcas reales cuando estén disponibles.
- **Estado**: Infraestructura en `HomePage.vue` y Tipos de Dominio lista para consumir `trustLogos`.

## 3. Centro de Preferencias de Cookies (PENDIENTE)
- **Pregunta**: ¿Se requiere un centro de preferencias real o se mantiene la lógica simple actual?
- **Nota**: El usuario indicó "No lo sé". Se mantiene la lógica simple de aceptar/rechazar por ahora.
