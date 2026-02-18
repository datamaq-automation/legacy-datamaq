# DV-06 - Prompts para VS Code Copilot Chat (backend api.datamaq.com.ar)

Fecha: 2026-02-18

## 1) Objetivo
Guiar a Copilot Chat para ajustar el backend FastAPI existente (`api.datamaq.com.ar`) con enfoque de Arquitectura Limpia + SOLID, migrando el frontend a endpoints backend-only:
- `POST /contact`
- `POST /mail`

## 2) Decisiones recomendadas (base)
- Integracion principal: backend-only con SMTP (sin secretos en frontend).
- Contrato de respuesta recomendado: `202 Accepted` + `request_id` (escalable a asincronia).
- Anti-spam recomendado: `rate-limit por IP + honeypot`.
- CORS recomendado: allowlist estricta (dominio prod + localhost dev).
- Configuracion por entorno: variables `SMTP_*`, `CORS_*`, `RATE_LIMIT_*`, `HONEYPOT_*`.

---

## Prompt 1 - Auditoria tecnica del backend actual
```txt
Actúa como Staff Backend Engineer (FastAPI + Arquitectura Limpia + SOLID).

Objetivo:
Auditar el backend existente en este repo (api.datamaq.com.ar) para migrar correctamente el frontend Vue hacia:
- POST /contact
- POST /mail

Tareas:
1) Mapear arquitectura actual (domain/application/infrastructure/interfaces/adapters).
2) Encontrar endpoints existentes relacionados a contacto/mail y su flujo real.
3) Detectar deuda técnica que impida escalar (acoplamiento, lógica en capa incorrecta, violaciones SOLID).
4) Identificar cómo está implementado SMTP actualmente.
5) Proponer plan incremental de refactor sin romper compatibilidad.

Entregable:
- Mapa de archivos y responsabilidades.
- Riesgos críticos (P0/P1/P2).
- Plan de implementación por etapas.
No implementes aún. Solo diagnóstico.
```

## Prompt 2 - Definicion de contrato API + decision tecnica (ADR corto)
```txt
Actúa como arquitecto backend.

Con base en la auditoría, define el contrato final para:
- POST /contact
- POST /mail

Requisitos:
- Request compatible con frontend actual: name, email, message, meta, attribution.
- Response uniforme y escalable.
- Errores tipados (400/422/429/500).
- request_id obligatorio en respuesta y logs.

Quiero que compares opciones con ventajas/desventajas y recomiendes una:
A) 200 síncrono
B) 202 accepted (listo para async)
C) otro

Además:
- Define rate-limit (IP) + honeypot (campo oculto).
- Define CORS estricto (prod + localhost dev).
- Propón esquema de variables de entorno production-ready.

Entregable:
- Especificación JSON de request/response.
- Tabla de códigos HTTP y errores.
- ADR breve con decisión final recomendada.
No implementes todavía.
```

## Prompt 3 - Implementacion limpia de casos de uso
```txt
Implementa la solución aprobada usando Arquitectura Limpia + SOLID.

Objetivo:
Ajustar endpoints existentes para:
- POST /contact
- POST /mail

Requisitos técnicos:
1) Separar capas:
   - domain: entidades/reglas
   - application: casos de uso/puertos
   - infrastructure: SMTP adapter, rate-limit adapter, config/env
   - interface/api: routers FastAPI, DTOs y mapeadores
2) Validación de payload con Pydantic.
3) Sanitización básica de texto.
4) request_id por request (middleware o dependencia), propagado en logs y response.
5) Integrar SMTP ya existente vía puerto/adaptador.
6) CORS allowlist por env.
7) Honeypot + rate-limit por IP.
8) Mantener backward compatibility si hay rutas legacy (deprecación explícita).

También:
- Actualiza README operativo de backend.
- Agrega ejemplos OpenAPI para ambos endpoints.
```

## Prompt 4 - Testing y calidad
```txt
Ahora agrega pruebas completas y robustas.

Requisitos:
- Unit tests de casos de uso (application).
- Unit tests de validación/sanitización.
- Integration tests de endpoints FastAPI (TestClient).
- Mock SMTP adapter.
- Casos de error: 422, 429, 500.
- Caso honeypot activado.
- Caso CORS permitido/bloqueado.
- Verificar request_id en response/log context.

Entregable:
- Tests verdes.
- Resumen de cobertura y gaps.
- Lista de refactors mínimos si detectás fragilidad.
```

## Prompt 5 - Hardening de configuracion y deploy
```txt
Ajusta configuración para producción en AlmaLinux/Ferozo panel sin exponer secretos.

Tareas:
1) Definir .env.example del backend SIN secretos reales.
2) Enumerar variables obligatorias:
   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, SMTP_TO_DEFAULT,
   CORS_ALLOWED_ORIGINS, RATE_LIMIT_WINDOW, RATE_LIMIT_MAX, HONEYPOT_FIELD, APP_ENV
3) Agregar startup checks: fallar temprano si falta config crítica.
4) Crear script/smoke para probar POST /contact y POST /mail.
5) Documentar runbook de despliegue y rollback.

Entregable:
- Checklist de producción.
- Comandos exactos para validación post-deploy.
```

---

## 3) Orden recomendado de uso
1. Ejecutar Prompt 1 (auditoria).
2. Ejecutar Prompt 2 (contrato/ADR) y aprobar decisión.
3. Ejecutar Prompt 3 (implementación).
4. Ejecutar Prompt 4 (tests).
5. Ejecutar Prompt 5 (hardening y operación).

## 4) Criterios de aceptación mínimos
- Backend expone `/contact` y `/mail` con contrato estable.
- No hay secretos en frontend ni en repositorio.
- Anti-spam operativo (`rate-limit + honeypot`).
- Logs con `request_id` trazable.
- CORS restringido a dominios permitidos.
- Pruebas automatizadas en verde.
