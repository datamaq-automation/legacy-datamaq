# DV - Backend Feedback y Correlacion Frontend/Backend (2026-02-20)

## 1) Contexto y objetivo
Este documento baja a contrato operativo el nuevo comportamiento implementado en frontend para obtener feedback tecnico del backend en cada submit de formularios `contact` y `mail`.

Objetivo principal:
- correlacionar cada submit con `request_id`;
- distinguir errores de negocio (`error_code`) de errores tecnicos (`backendMessage/status`);
- reducir diagnosticos "ciegos" cuando falla en GitHub Actions o en produccion.

## 2) Estado actual del frontend (implementado)

### 2.1 Propagacion de feedback backend en el flujo de submit
El frontend ahora propaga metadata backend desde infraestructura hasta UI:
- `requestId` (prioridad por header `X-Request-Id`, fallback body)
- `errorCode` (body)
- `backendMessage` (body/texto plano)

Cambios aplicados:
- `src/application/dto/contact.ts`
- `src/application/types/errors.ts`
- `src/application/contact/ports/ContactGateway.ts`
- `src/application/use-cases/submitContact.ts`
- `src/infrastructure/contact/contactApiGateway.ts`
- `src/infrastructure/contact/contactResponseFeedback.ts`
- `src/infrastructure/contact/contactSubmissionErrors.ts`
- `src/application/ports/HttpClient.ts`
- `src/infrastructure/http/fetchHttpClient.ts`
- `src/ui/features/contact/contactHooks.ts`

### 2.2 Eventos de observabilidad en UI
En `contactHooks`, los eventos estructurados quedan asi:

1. `submit_clicked`
2. `submit_request_started`
3. `submit_response_ok`
4. `submit_response_error`
5. `submit_exception`

Con metadata adicional:
- `requestId` en exito/error si backend lo retorna
- `errorCode` en error de backend
- `backendMessage` en error de backend
- `statusCode`
- `latencyMs`
- `sectionId`, `backendChannel`

### 2.3 Mensaje de usuario
Cuando hay error y backend retorna `request_id`, UI agrega:
- `Codigo de seguimiento: <request_id>`

Esto permite a soporte cruzar rapidamente con logs backend.

## 3) Contrato recomendado de backend (obligatorio para correlacion completa)

## 3.1 Endpoints canonicos
- `POST /api/contact`
- `POST /api/mail`

## 3.2 Respuesta de exito (recomendada)
HTTP:
- `200` o `201` o `202` (segun estrategia sync/async)

Headers:
- `X-Request-Id: <uuid|ulid>`
- `Access-Control-Expose-Headers: X-Request-Id`

Body JSON (minimo):
```json
{
  "ok": true,
  "request_id": "req_01J...",
  "channel": "contact"
}
```

## 3.3 Respuesta de error (recomendada)
HTTP:
- `400/422`: validacion
- `429`: rate-limit
- `5xx`: error interno

Headers:
- `X-Request-Id: <uuid|ulid>`
- `Access-Control-Expose-Headers: X-Request-Id`

Body JSON (minimo):
```json
{
  "ok": false,
  "request_id": "req_01J...",
  "error_code": "RATE_LIMITED",
  "detail": "Too many requests"
}
```

Notas:
- `error_code` debe ser estable y orientado a maquina.
- `detail` puede variar, pero mantenerlo breve y sin PII sensible.

## 4) Requisitos de CORS para que frontend lea headers de correlacion

Para origen web productivo y localhost dev:
- permitir `OPTIONS` y `POST`
- permitir `Content-Type`
- exponer `X-Request-Id`

Checklist CORS:
1. `OPTIONS /api/contact` y `OPTIONS /api/mail` -> `200/204`
2. `Access-Control-Allow-Origin` correcto
3. `Access-Control-Allow-Methods` incluye `POST, OPTIONS`
4. `Access-Control-Allow-Headers` incluye `Content-Type`
5. `Access-Control-Expose-Headers` incluye `X-Request-Id`

## 5) Ingesta opcional de logs cliente

Si se habilita `VITE_CLIENT_LOG_INGEST_URL`, frontend envia envelopes:
```json
{
  "event": "submit_response_error",
  "level": "warn",
  "timestamp": "2026-02-20T23:00:00.000Z",
  "payload": {
    "sectionId": "contacto-mail",
    "backendChannel": "mail",
    "statusCode": 429,
    "requestId": "req_01J...",
    "errorCode": "RATE_LIMITED",
    "latencyMs": 186
  }
}
```

Recomendaciones backend para `/api/client-logs`:
1. autenticar por origen allowlist + rate-limit
2. almacenar en sink de observabilidad (no bloquear request principal)
3. evitar persistir payloads con PII cruda
4. retornar `202` rapido

## 6) Correlacion operativa sugerida

Flujo:
1. Usuario envia formulario.
2. Backend asigna `request_id`.
3. Backend responde con header `X-Request-Id` (y body opcional con `request_id`).
4. Frontend loguea `submit_response_ok/error` con `requestId`.
5. Soporte/ops correlaciona:
   - consola browser (o ingest client logs)
   - logs app backend
   - logs SMTP/proveedor

Campos minimos a loguear en backend por request:
- `request_id`
- `route`
- `channel`
- `origin`
- `status_code`
- `error_code` (si aplica)
- `latency_ms`

## 7) FastAPI: referencia de implementacion (esqueleto)
```py
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://www.datamaq.com.ar",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type", "Accept"],
    expose_headers=["X-Request-Id"],
)

def new_request_id() -> str:
    return f"req_{uuid.uuid4().hex}"

@app.post("/api/contact")
async def contact(request: Request, response: Response):
    request_id = new_request_id()
    response.headers["X-Request-Id"] = request_id
    # ... validar, anti-spam, SMTP ...
    return {"ok": True, "request_id": request_id, "channel": "contact"}
```

## 8) Riesgos si no se aplica en backend
1. Frontend seguira mostrando exito/error, pero sin correlacion completa de incidente.
2. Diagnostico de `5xx` o `429` sera lento por falta de `request_id`.
3. Soporte no podra cruzar tickets con logs de backend/SMTP en forma confiable.

## 9) Checklist de cierre backend
1. Exponer `X-Request-Id` en respuestas de `/api/contact` y `/api/mail`.
2. Incluir `request_id` y `error_code` en body JSON (errores y recomendado en exito).
3. Confirmar CORS con `Access-Control-Expose-Headers: X-Request-Id`.
4. Confirmar `OPTIONS` funcional en ambos endpoints.
5. Verificar desde browser que `submit_response_ok/error` incluye `requestId`.
6. Verificar en logs backend que existe el mismo `request_id` para cada request.
