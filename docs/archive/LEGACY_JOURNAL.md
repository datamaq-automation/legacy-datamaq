# Legacy Migration Journal (Archive)

Este documento centraliza el registro histórico de la migración de `plantilla-www` hacia WordPress Native, desde la fase de relevamiento hasta el endurecimiento final de producción.

---

## 1. Relevamiento y Estrategia Inicial (Fase 0)
- **Objetivo**: Mapear inventario de URLs, requisitos SEO y tracking.
- **Logros**: Definición de redirecciones `.htaccess` para `/cotizador*` y persistencia de eventos GA4/Clarity.

## 2. Ejecución Técnica (Fases 1 - 5)
- **Fase 1 (Scaffolding)**: Creación de la estructura del tema `datamaq-native`.
- **Fase 2 (Content)**: Carga de páginas clave: `/contact/`, `/gracias/`, `/medicion-consumo-electrico-escobar/`.
- **Fase 3 (Smoke)**: Verificación de formularios (nativos vs admin-post) y estados `200` en slugs migrados.
- **Fase 4 (Cutover)**: Activación permanente del tema con paridad visual garantizada.
- **Fase 5 (Hardening)**: Desacoplamiento de rutas legacy mediante MU Plugins (`datamaq-legacy-route-redirects.php`) y optimización Nginx.

## 3. Contratos de Backend (Legacy)
- **FastAPI Migration**: Guía para la migración de controllers Python (Contact, Quote, Pricing).
- **CORS History**: Registro de configuraciones de cabeceras para permitir peticiones desde `datamaq.com.ar` hacia la API.
- **Quote Contract**: Especificación del formato `Q-YYYYMMDD-NNNNNN` para cotizaciones.

## 4. Ítems Pendientes Históricos
*Referencia al cierre de la migración (2026-04-12)*:
- Los formularios nativos quedaron funcionales con redirección a `/gracias/`.
- Se detectó un bloqueo en el push automático a GitHub debido a restricciones de clave SSH en el VPS.
- Se consolidó el tracking mediante el plugin MU de redirecciones.

---

*Nota: Este archivo es solo para referencia histórica. La documentación activa actual reside en `docs/MIGRATION.md`.*
