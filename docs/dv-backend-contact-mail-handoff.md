# DV - Handoff Backend: Formularios Contacto y Mail

Fecha: 2026-02-19  
Alcance: frontend Vue + contrato esperado hacia backend custom.

## 1) Certezas verificadas en código

1. El frontend tiene **dos flujos funcionales** separados:
   - `contact` (ingreso de contacto)
   - `mail` (enviar e-mail)
2. En Home se renderizan **dos formularios visibles**:
   - Formulario lead (`backend-channel="contact"`)
   - Formulario mail (`backend-channel="mail"`)
3. Ambos flujos comparten estructura de payload base:
   - `email: string`
   - `message: string`
4. El submit agrega metadata técnica (mapper/gateway):
   - `pageLocation`, `trafficSource`, `userAgent`, `createdAt`
   - datos de attribution cuando existen (utm/gclid)
5. El frontend espera endpoints HTTP configurables por env:
   - `VITE_CONTACT_API_URL` (preferido; fallback `VITE_INQUIRY_API_URL`)
   - `VITE_MAIL_API_URL`
6. El canal se resuelve en infraestructura:
   - `contact` -> `inquiryApiUrl`
   - `mail` -> `mailApiUrl`
7. El estado de disponibilidad de backend se chequea con `OPTIONS`:
   - `200/2xx`, `400`, `404`, `405` se consideran canal disponible para no bloquear por CORS/probe.
8. El flujo UI de éxito navega a `/gracias` para ambos formularios.
9. E2E smoke valida ambos caminos (`/api/contact` y `/api/mail`) con mocks.

## 2) Certezas operativas para backend

1. El frontend está diseñado para integrarse con **API custom** (`api.datamaq.com.ar`), no con endpoint ad-hoc de Chatwoot directo en cliente.
2. Si backend responde `429`, UI muestra mensaje de rate-limit.
3. Si backend responde `5xx`, el monitor marca canal temporalmente no disponible.
4. Si backend responde error no de red, el frontend mantiene canal como disponible (para evitar falso down por validación de negocio).

## 3) Contrato mínimo recomendado de backend

### POST contacto
- URL esperada: `/contact` o `/api/contact` (definir una única canonical)
- Request (mínimo):
```json
{
  "name": "string",
  "email": "string",
  "message": "string",
  "custom_attributes": { "...": "..." },
  "meta": { "...": "..." }
}
```
- Response éxito: `200` o `201` con JSON.

### POST mail
- URL esperada: `/mail` o `/api/mail` (definir una única canonical)
- Request: mismo shape mínimo que contacto (o alias compatible).
- Response éxito: `200` o `201` con JSON.

## 4) Dudas abiertas para cerrar backend/frontend

1. CORS productivo:
   - dominios permitidos definitivos (`www` + variantes)

## 4.1) Decisiones cerradas (producto/operacion)

1. Path canónico backend confirmado:
   - `POST /api/contact`
   - `POST /api/mail`
2. `request_id` en respuesta:
   - Recomendación adoptada: **Sí, incluir `request_id`** en éxito y error.
3. Validaciones entre `contact` y `mail`:
   - Recomendación adoptada: **núcleo común + reglas específicas mínimas por canal**.
4. Anti-spam:
   - Recomendación adoptada: **rate-limit por IP + honeypot** (captcha opcional según abuso observado).
5. SMTP/Chatwoot:
   - Recomendación adoptada: **`Reply-To` obligatorio** con email de cliente validado.

## 5) Evidencia de código fuente

- `src/ui/pages/HomePage.vue`
- `src/ui/pages/HomePage.ts`
- `src/ui/features/contact/ContactFormSection.vue`
- `src/ui/features/contact/contactHooks.ts`
- `src/di/container.ts`
- `src/infrastructure/contact/contactApiGateway.ts`
- `src/application/use-cases/submitContact.ts`
- `src/infrastructure/config/viteConfig.ts`
- `tests/e2e/smoke.spec.ts`
