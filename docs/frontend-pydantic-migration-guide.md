# F2: Frontend Migration Guide - Pydantic Standard Format

**VersiÃ³n:** 1.0  
**Fecha:** 2026-03-01  
**Estado:** Plan de migraciÃ³n para equipo frontend  
**Fase:** Post F2 Phase 1 (validaciÃ³n interna completada) â†’ F2 Phase 3 (formato pÃºblico)

---

## ðŸŽ¯ Objetivo

Documentar los cambios de formato que sufrirÃ¡n los endpoints cuando el backend complete la migraciÃ³n a **Pydantic standard format** en la Fase 3 de F2.

**Cronograma:**
- âœ… **Fase 1 (2026-03-01):** RefactorizaciÃ³n interna con validaciÃ³n Pydantic (sin cambios en contrato HTTP)
- ðŸ“‹ **Fase 2 (2026-03-04):** Este documento - PreparaciÃ³n del equipo frontend
- ðŸ”„ **Fase 3 (2026-03-11):** ImplementaciÃ³n en backend - **Frontend debe estar preparado**

---

## ðŸ“Š Resumen de Cambios

### Por Endpoint

#### 1. **POST `/v1/contact`**

**Actual (Legacy Format):**
```json
{
  "request_id": "req-20260301120000-abcd1234",
  "status": "error",
  "error_code": "VALIDATION_ERROR",
  "detail": "email or phone is required"  // Campo STRING
}
```

**Futuro (Pydantic Standard):**
```json
{
  "request_id": "req-20260301120000-abcd1234",
  "status": "error",
  "error_code": "VALIDATION_ERROR",
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "Field required",
      "type": "missing"
    }
  ]  // Campo ARRAY de objetos con loc/msg/type
}
```

**Cambios para Frontend:**
- `detail` cambia de `string` a `array[object]`
- Extraer primero error: `detail[0]`
- Mostrar mensaje: `detail[0].msg`
- UbicaciÃ³n del error: `detail[0].loc[1]` (el segundo elemento es el nombre del campo)

**ValidaciÃ³n Actual en Frontend:**
```javascript
if (response.status === 422) {
  const error = response.data;
  console.log(error.detail);  // "email or phone is required"
  // Mostrar directamente al usuario
}
```

**ValidaciÃ³n Futura en Frontend:**
```javascript
if (response.status === 422) {
  const error = response.data;
  if (Array.isArray(error.detail) && error.detail.length > 0) {
    const firstError = error.detail[0];
    console.log(firstError.msg);      // "Field required"
    console.log(firstError.loc[1]);   // "email" (o "phone")
    console.log(firstError.type);     // "missing"
    // Mostrar con lÃ³gica por tipo de error
  }
}
```

---

#### 2. **POST `/v1/quote/diagnostic`**

**Actual (Legacy Format):**
```json
{
  "request_id": "req-20260301120000-abcd1234",
  "status": "error",
  "error_code": "VALIDATION_ERROR",
  "detail": [
    {
      "loc": ["body", "company"],
      "msg": "Field required",
      "type": "missing"
    }
  ]
}
```

**Futuro (Same Pydantic Standard):**
```json
{
  "request_id": "req-20260301120000-abcd1234",
  "status": "error",
  "error_code": "VALIDATION_ERROR",
  "detail": [
    {
      "loc": ["body", "company"],
      "msg": "Field required",
      "type": "missing"
    }
  ]
}
```

**âš ï¸ NOTA:** Este endpoint YA usa formato Pydantic standard (cambio transparente documentado aquÃ­ por completitud).

---

## ðŸ”„ Breaking Changes Matrix

| Endpoint | Campo | Cambio | Tipo | Impacto |
|----------|-------|--------|------|---------|
| `/contact` | `detail` | `string` â†’ `array` | Error response | **Alto** |

| `/quote/diagnostic` | `detail` | Ya es `array` | N/A | **Nulo** |
| Todas | Success (200) | Sin cambios | N/A | **Nulo** |

---

## ðŸ“‹ Tipo de Errores en Pydantic Standard

Cuando migres a nuevo formato, estos son los tipos de errores que verÃ¡s:

### Errores de ValidaciÃ³n Comunes

```javascript
// Email invÃ¡lido
{
  "loc": ["body", "email"],
  "msg": "value is not a valid email address",
  "type": "value_error",
  "ctx": {"reason": "..."}
}

// Campo faltante
{
  "loc": ["body", "company"],
  "msg": "Field required",
  "type": "missing"
}

// String muy corto/largo
{
  "loc": ["body", "message"],
  "msg": "String should have at least 5 characters",
  "type": "string_too_short"
}

// TelÃ©fono con formato invÃ¡lido
{
  "loc": ["body", "phone"],
  "msg": "phone format is invalid.",
  "type": "value_error"
}
```

---

## ðŸ› ï¸ Migration Checklist para Frontend

### Fase de PreparaciÃ³n (Ahora - 2026-03-04)

- [ ] **Crear nueva funciÃ³n de error handler:**
  ```javascript
  function handleValidationError(errorResponse) {
    const errors = errorResponse.detail;
    if (!Array.isArray(errors)) {
      // Fallback para errores no estÃ¡ndar
      return errorResponse.detail;
    }
    
    const result = {};
    errors.forEach(error => {
      const fieldName = error.loc[error.loc.length - 1];
      result[fieldName] = {
        msg: error.msg,
        type: error.type
      };
    });
    return result;
  }
  ```

- [ ] **Actualizar validaciÃ³n de respectivas formas:**
  - Form `/contact` (phone/email verification)
  - Form `/quote/diagnostic` (company, contact_name, locality)

- [ ] **Crear tests unitarios que validen:**
  - Respuesta con error format nuevo
  - ExtracciÃ³n correcta de mensajes de error
  - Mapping fields a UI elements

- [ ] **Configurar QA para validar:**
  - Ambos formatos (legacy temp + nuevo en staging)
  - Cross-browser testing
  - Casos edge (JSON invÃ¡lido, timeouts, etc.)

### Fase de Rollout (A partir 2026-03-11)

- [ ] **Activar feature flag de API versioning** (si existe)
- [ ] **Canary deployment:** 10% trÃ¡fico â†’ nuevo formato
- [ ] **Monitor errores de parsing** en logs de cliente
- [ ] **Rollback plan:** Si errores > 1%, reverify backend
- [ ] **Progressive rollout:** 25% â†’ 50% â†’ 100%

---

## ðŸ“š Ejemplos Completos de MigraciÃ³n

### Ejemplo 1: Formulario de Contacto

**CÃ³digo Legacy (Actual):**
```javascript
async function submitContact(formData) {
  const response = await fetch('/v1/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    if (response.status === 422) {
      // Legacy: detail es string
      showErrorMessage(error.detail);  // âŒ Will break with new format
    }
  }
}
```

**CÃ³digo Futuro (Pydantic Standard):**
```javascript
async function submitContact(formData) {
  const response = await fetch('/v1/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    if (response.status === 422 && Array.isArray(error.detail)) {
      // Pydantic: detail es array de objetos
      const validationErrors = error.detail.reduce((acc, err) => {
        const field = err.loc[err.loc.length - 1];
        acc[field] = err.msg;
        return acc;
      }, {});
      
      // Mostrar errores por campo
      showFieldErrors(validationErrors);
    }
  }
}

function showFieldErrors(errors) {
  Object.entries(errors).forEach(([field, message]) => {
    const element = document.getElementById(`error-${field}`);
    if (element) {
      element.textContent = message;
      element.style.display = 'block';
    }
  });
}
```

**Para Soportar Ambos Formatos (TransiciÃ³n Suave):**
```javascript
function handleValidationError(errorDetail) {
  // Support both legacy (string) and Pydantic (array) formats
  if (typeof errorDetail === 'string') {
    // Legacy format
    return { general: errorDetail };
  }
  
  if (Array.isArray(errorDetail)) {
    // Pydantic format
    return errorDetail.reduce((acc, err) => {
      const field = err.loc[err.loc.length - 1];
      acc[field] = err.msg;
      return acc;
    }, {});
  }
  
  return { general: 'Unknown error' };
}
```

---

### Ejemplo 2: Formulario de Presupuesto /quote/diagnostic

**Ya estÃ¡ en Pydantic format** (sin cambios esperados):

```javascript
async function submitQuoteDiagnostic(data) {
  const response = await fetch('/v1/quote/diagnostic', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  
  if (response.status === 422) {
    const error = await response.json();
    // Ya es array
    const validationErrors = error.detail.map(err => ({
      field: err.loc[1],  // "company", "contact_name", "locality"
      message: err.msg,   // "Field required"
      type: err.type      // "missing"
    }));
  }
}
```

---

## ðŸ”Œ API Response Format Reference

### Success Response (Sin cambios)

```json
GET /v1/health
HTTP/1.1 200 OK

{
  "request_id": "req-20260301120000-abcd1234",
  "status": "ok",
  "timestamp": "2026-03-01T12:00:00Z",
  "version": "1.0.0"
}
```

### Validation Error - Before (Legacy)

```json
POST /v1/contact
HTTP/1.1 422 Unprocessable Entity

{
  "request_id": "req-20260301120000-abcd1234",
  "status": "error",
  "error_code": "VALIDATION_ERROR",
  "detail": "email or phone is required"  // â† STRING
}
```

### Validation Error - After (Pydantic)

```json
POST /v1/contact
HTTP/1.1 422 Unprocessable Entity

{
  "request_id": "req-20260301120000-abcd1234",
  "status": "error",
  "error_code": "VALIDATION_ERROR",
  "detail": [  // â† ARRAY
    {
      "loc": ["body", "contact_info"],
      "msg": "at least email or phone is required",
      "type": "value_error"
    }
  ]
}
```

---

## ðŸ”— Context & Philosophy

**Â¿Por quÃ© esta migraciÃ³n?**

1. **StandardizaciÃ³n:** Pydantic es el estÃ¡ndar de industria para validaciÃ³n en FastAPI
2. **Tooling:** Frontend tools (TypeScript, Zod) generan mejor DX con formato estÃ¡ndar
3. **Mantenibilidad:** Errores estructurados â†’ mÃ¡s fÃ¡ciles de parsear automÃ¡ticamente
4. **Debugging:** `loc` campo ayuda a identificar exactamente dÃ³nde fallÃ³ validaciÃ³n

**Fase 1 (Interno):** Solo backend refactoriza internamente - zero cambios en contrato  
**Fase 2 (Prep):** Frontend se prepara - este documento + unit tests  
**Fase 3 (Deploy):** Backend activa nuevo formato - Frontend switch ON

---

## â±ï¸ Timeline & Dependencies

```
2026-03-01  âœ… F2 Phase 1: Backend internal refactor (Pydantic)
            â””â”€ /contact, /quote/diagnostic con validaciÃ³n Pydantic
            â””â”€ 117/117 tests passing con formato legacy preservado

2026-03-04  ðŸ“‹ F2 Phase 2: Frontend prep (THIS DOCUMENT)
            â””â”€ Frontend teams review migration guide
            â””â”€ Unit tests escritas para ambos formatos
            â””â”€ QA sets up test cases

2026-03-11  ðŸ”„ F2 Phase 3: Backend publish Pydantic format
            â””â”€ Backend respuestas cambiar a formato estÃ¡ndar
            â””â”€ Frontend activar handlers para nuevo formato
            â””â”€ Canary deployment 10% â†’ 100% trÃ¡fico
            â””â”€ Performance monitoring (parse overhead negligible)
```

---

## ðŸ“ž Questions & Support

**Para el equipo de Frontend:**

1. **Â¿Necesito cambiar TODAS las llamadas a estos endpoints?**
   - NO. Solo endpoints con errores de validaciÃ³n (POST /contact, /quote/diagnostic)
   - GET endpoints sin cambios
   - Success responses sin cambios

2. **Â¿Puedo ignorar esto si utilizo framework con auto-validation?**
   - Parcialmente. Vue/React/Angular form builders pueden adaptar automÃ¡ticamente si usas Zod/OpenAPI generator
   - Recomendado: Regenerar types from OpenAPI v3.1 spec (backend actualizarÃ¡ en Phase 3)

3. **Â¿QuÃ© pasa si hago request mientras estÃ¡ en transiciÃ³n?**
   - Phase 1-2: Legacy format (string)
   - Phase 3+: Pydantic format (array)
   - Tu cliente debe prepararse para ambos AHORA para smooth transition

4. **Â¿Hay deprecation period?**
   - No planificado. Format estÃ¡ndar es considerado "correcto"
   - Pero si hay issues en prod, rollback plan existe < 1 hora

---

## ðŸ“Ž Referencias Relacionadas

- [decisions/README.md](./decisions/README.md) - Decisiones arquitectÃ³nicas
- [backend-content-brand-seo-contract.md](./backend-content-brand-seo-contract.md) - Target contract (serÃ¡ actualizado en Phase 3)
- [backend-audit-checklist.md](./backend-audit-checklist.md) - Testing strategy
- [fastapi-backend-migration-guide.md](./fastapi-backend-migration-guide.md) - Backend migration reference
- [fastapi-contact-contract.md](./fastapi-contact-contract.md) - Contact endpoint contract
- [fastapi-quote-contract.md](./fastapi-quote-contract.md) - Quote endpoint contract

---

**Ãšltima actualizaciÃ³n:** 2026-03-01  
**PrÃ³xima revisiÃ³n:** Post F2 Phase 3 (2026-03-15)



