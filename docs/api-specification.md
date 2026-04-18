# API Specification: FastAPI Migration and Contracts

**Status:** Living Document - Canonical Reference
**Objective:** Maintain bridge parity between the Vue frontend and the FastAPI backend.

## 1. Global API Strategy
- **Base Path**: `/v1/*` is the canonical public contract.
- **Removed**: `/v1/public/*` is deprecated and removed from frontend.
- **Auth/Internal**: `/v1/admin/*` or `/v1/internal/*` reserved for future use.
- **Headers**: Mandatory `X-Request-Id` (or `Request-Id`) for observability and CORS pre-flight support on all routes.

---

## 2. Core Endpoints & Contracts

### 2.1 Health (`GET /v1/health`)
- **JSON Response**: `{ "status": "ok", "service": "string", "version": "string", "timestamp": "ISO" }`
- **Frontend Usage**: Connectivity probe and metadata logging.

### 2.2 Site & Content (`GET /v1/site`)
- **JSON Response**:
  ```json
  {
    "status": "ok",
    "request_id": "string",
    "brand_id": "datamaq",
    "version": "v1",
    "data": {
      "content": {
        "hero": {}, "services": {}, "about": {}, "profile": {}, 
        "navbar": {}, "footer": {}, "legal": {}, "contact": {}, 
        "consent": {}, "decisionFlow": {}, "thanks": {}
      },
      "brand": {
        "brandId": "string", "brandName": "string", "whatsappUrl": "string",
        "technician": { "name": "string", "role": "string", "photo": {} }
      },
      "seo": {
        "siteUrl": "string", "siteName": "string", "siteDescription": "string",
        "business": { "name": "string", "email": "string" }
      }
    }
  }
  ```
- **Constraint**: Must deliver the full snapshot valid against `AppContentSchema`. Separates editorial content (`content`) from identity (`brand`) and indexing metadata (`seo`).

### 2.3 Pricing (`GET /v1/pricing`)
- **Canonical Key**: `data.diagnostico_lista_2h_ars`
- **Fallback**: Frontend supports legacy aliases (`visita_diagnostico_ars`, etc.) but prefers the canonical key.

### 2.4 Contact (`POST /v1/contact`)
- **Semantic Rule**: Respond `201 Created` if submission is durable.
- **Success Response**: 
  ```json
  {
    "request_id": "string",
    "submission_id": "string",
    "status": "accepted",
    "processing_status": "queued",
    "detail": "string",
    "code": "string"
  }
  ```

### 2.5 Quote (`POST /v1/quote/diagnostic`)
- **Semantic Rule**: Returns calculated pricing and PDF reference.
- **PDF Endpoint**: `GET /v1/quote/{quote_id}/pdf`
    - Must set `Content-Type: application/pdf`.
    - Must set `Content-Disposition: attachment; filename="..."`.

---

## 3. Error Handling Architecture
FastAPI must return a structured JSON error envelope for all non-2xx statuses:
```json
{
  "request_id": "string",
  "status": "rejected",
  "detail": "string | list",
  "code": "string (e.g., VALIDATION_ERROR)"
}
```

---

## 4. Infrastructure & Security

### 4.1 CORS Configuration
FastAPI must allow the following for cross-origin requests from the browser:
- **Origin**: `https://datamaq.com.ar` (and `localhost:5173` for dev).
- **Methods**: `GET, POST, PATCH, OPTIONS`.
- **Headers**: `Content-Type, Accept, Authorization`.
- **Preflight**: Must respond to `OPTIONS` with `204 No Content` or `200 OK` and correct headers.

### 4.2 Rate Limiting
- Use `429 Too Many Requests` with a `Retry-After` header.
- The frontend is equipped to parse `Retry-After` and notify the user of the wait time.

### 4.3 Request Correlation
- FastAPI must expose a request ID via body (`request_id`) or headers (`X-Request-Id`).
- This ID is logged by the frontend for debugging production issues.
