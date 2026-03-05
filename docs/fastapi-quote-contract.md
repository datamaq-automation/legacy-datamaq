# FastAPI Quote Contract

Estado: contrato recomendado para migracion a FastAPI
Objetivo: fijar el contrato canonico de `quote` que el frontend consume

## Endpoints

- `POST /v1/quote/diagnostic`
- `GET /v1/quote/{quote_id}/pdf`

## Quote Diagnostic

### Request

Body canonico:

```json
{
  "company": "ACME",
  "contact_name": "Juan Perez",
  "locality": "Escobar",
  "scheduled": true,
  "access_ready": true,
  "safe_window_confirmed": true,
  "bureaucracy": "medium",
  "email": "juan@example.com",
  "phone": "+54 11 5555 4444",
  "notes": "Notas opcionales"
}
```

Campos requeridos por frontend:

- `company`
- `contact_name`
- `locality`
- `scheduled`
- `access_ready`
- `safe_window_confirmed`

Campos opcionales:

- `bureaucracy`
- `email`
- `phone`
- `notes`

Valores recomendados:

- `bureaucracy`: `low | medium | high`

### Response de exito

Status code canonico:

- `200 OK`

Body canonico:

```json
{
  "quote_id": "Q-20260222-000111",
  "list_price_ars": 280000,
  "discounts": [
    {
      "code": "DISC1",
      "label": "Turno",
      "amount_ars": 14000
    }
  ],
  "discount_pct": 5,
  "discount_total_ars": 14000,
  "final_price_ars": 266000,
  "deposit_pct": 50,
  "deposit_ars": 133000,
  "valid_until": "2026-03-01T00:00:00Z",
  "whatsapp_message": "Hola DataMaq...",
  "whatsapp_url": "https://wa.me/5491168758623?text=Hola"
}
```

Reglas recomendadas:

- `quote_id` debe seguir el patron `Q-YYYYMMDD-NNNNNN`
- los importes deben devolverse como numeros enteros en ARS
- `valid_until` debe ser una fecha ISO utilizable por frontend

## Quote PDF

### Request

Path canonico:

- `GET /v1/quote/{quote_id}/pdf`

Compatibilidad actual del frontend:

- si existe `quotePdfApiUrl`, puede usar un template explicito
- si no existe, deriva el endpoint desde `quoteDiagnosticApiUrl`

Regla recomendada:

- FastAPI debe exponer directamente `/v1/quote/{quote_id}/pdf` como contrato canonico

### Response de exito

Status code canonico:

- `200 OK`

Headers recomendados:

- `Content-Type: application/pdf`
- `Content-Disposition: attachment; filename="quote-{quote_id}.pdf"`
- `X-Request-Id`
- `Cache-Control: no-store`
- `X-Content-Type-Options: nosniff`

Notas:

- el frontend soporta `filename*` en UTF-8
- el frontend puede extraer el nombre del archivo desde `Content-Disposition`

## Errores

### Diagnostic

Recomendacion:

- `422` para validacion
- `429` con `Retry-After` para rate limiting
- `503` para backend temporalmente no disponible
- body con `detail`

Compatibilidad actual del frontend:

- si `detail` es una lista estilo FastAPI, la mapea a `validationIssues`
- si `detail` es string, lo usa como mensaje principal
- si existe `Retry-After`, lo convierte a segundos

Ejemplo de validacion recomendado:

```json
{
  "detail": [
    {
      "loc": ["body", "company"],
      "msg": "Field required",
      "type": "missing"
    }
  ]
}
```

### PDF

Recomendacion:

- `404` si `quote_id` no existe
- `422` si `quote_id` es invalido
- `429` con `Retry-After` para rate limiting

Ejemplo de error simple:

```json
{
  "detail": "quote not found"
}
```

## Observabilidad

El frontend ya emite trazas estructuradas para quote:

- `[quote:ui]`
- `[quote:gateway]`

Campos visibles en logs:

- `endpoint`
- `pathname`
- `transportMode`
- `status`
- `quoteId`
- `detail`
- `retryAfterSeconds`

## Fuente de verdad en el repositorio

- DTOs: `src/application/dto/quote.ts`
- gateway: `src/infrastructure/quote/quoteApiGateway.ts`
- error model: `src/application/quote/quoteApiError.ts`
- tests gateway: `tests/unit/infrastructure/quoteApiGateway.test.ts`
- tests de contrato FastAPI: se ejecutan en backend
