# F2: Frontend Migration Guide - Pydantic Standard Format

**Versión:** 1.0  
**Fecha:** 2026-03-01  
**Estado:** Plan de migración para equipo frontend  
**Fase:** Post F2 Phase 1 (validación interna completada) → F2 Phase 3 (formato público)

---

## 🎯 Objetivo

Documentar los cambios de formato que sufrirán los endpoints cuando el backend complete la migración a **Pydantic standard format** en la Fase 3 de F2.

**Cronograma:**
- ✅ **Fase 1 (2026-03-01):** Refactorización interna con validación Pydantic (sin cambios en contrato HTTP)
- 📋 **Fase 2 (2026-03-04):** Este documento - Preparación del equipo frontend
- 🔄 **Fase 3 (2026-03-11):** Implementación en backend - **Frontend debe estar preparado**

---

## 📊 Resumen de Cambios

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
- Ubicación del error: `detail[0].loc[1]` (el segundo elemento es el nombre del campo)

**Validación Actual en Frontend:**
```javascript
if (response.status === 422) {
  const error = response.data;
  console.log(error.detail);  // "email or phone is required"
  // Mostrar directamente al usuario
}
```

**Validación Futura en Frontend:**
```javascript
if (response.status === 422) {
  const error = response.data;
  if (Array.isArray(error.detail) && error.detail.length > 0) {
    const firstError = error.detail[0];
    console.log(firstError.msg);      // "Field required"
    console.log(firstError.loc[1]);   // "email" (o "phone")
    console.log(firstError.type);     // "missing"
    // Mostrar con lógica por tipo de error
  }
}
```

---

#### 2. **POST `/v1/mail`**

**Mismo cambio que `/v1/contact`:**

| Aspecto | Antes | Después |
|---------|-------|---------|
| Error format | `detail: "string"` | `detail: [{loc, msg, type}]` |
| Campos requeridos | `email, message` | `email, message` (sin cambio) |
| Validación extra | Formato email | Formato email (mejorada con Pydantic) |

**Ejemplo Futuro:**
```json
{
  "status": 422,
  "error_code": "VALIDATION_ERROR",
  "detail": [
    {
      "loc": ["body", "message"],
      "msg": "String should have at least 5 characters",
      "type": "string_too_short"
    }
  ]
}
```

---

#### 3. **POST `/v1/quote/diagnostic`**

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

**⚠️ NOTA:** Este endpoint YA usa formato Pydantic standard (cambio transparente documentado aquí por completitud).

---

## 🔄 Breaking Changes Matrix

| Endpoint | Campo | Cambio | Tipo | Impacto |
|----------|-------|--------|------|---------|
| `/contact` | `detail` | `string` → `array` | Error response | **Alto** |
| `/mail` | `detail` | `string` → `array` | Error response | **Alto** |
| `/quote/diagnostic` | `detail` | Ya es `array` | N/A | **Nulo** |
| Todas | Success (200) | Sin cambios | N/A | **Nulo** |

---

## 📋 Tipo de Errores en Pydantic Standard

Cuando migres a nuevo formato, estos son los tipos de errores que verás:

### Errores de Validación Comunes

```javascript
// Email inválido
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

// Teléfono con formato inválido
{
  "loc": ["body", "phone"],
  "msg": "phone format is invalid.",
  "type": "value_error"
}
```

---

## 🛠️ Migration Checklist para Frontend

### Fase de Preparación (Ahora - 2026-03-04)

- [ ] **Crear nueva función de error handler:**
  ```javascript
  function handleValidationError(errorResponse) {
    const errors = errorResponse.detail;
    if (!Array.isArray(errors)) {
      // Fallback para errores no estándar
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

- [ ] **Actualizar validación de respectivas formas:**
  - Form `/contact` (phone/email verification)
  - Form `/mail` (email + message validation)
  - Form `/quote/diagnostic` (company, contact_name, locality)

- [ ] **Crear tests unitarios que validen:**
  - Respuesta con error format nuevo
  - Extracción correcta de mensajes de error
  - Mapping fields a UI elements

- [ ] **Configurar QA para validar:**
  - Ambos formatos (legacy temp + nuevo en staging)
  - Cross-browser testing
  - Casos edge (JSON inválido, timeouts, etc.)

### Fase de Rollout (A partir 2026-03-11)

- [ ] **Activar feature flag de API versioning** (si existe)
- [ ] **Canary deployment:** 10% tráfico → nuevo formato
- [ ] **Monitor errores de parsing** en logs de cliente
- [ ] **Rollback plan:** Si errores > 1%, reverify backend
- [ ] **Progressive rollout:** 25% → 50% → 100%

---

## 📚 Ejemplos Completos de Migración

### Ejemplo 1: Formulario de Contacto

**Código Legacy (Actual):**
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
      showErrorMessage(error.detail);  // ❌ Will break with new format
    }
  }
}
```

**Código Futuro (Pydantic Standard):**
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

**Para Soportar Ambos Formatos (Transición Suave):**
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

**Ya está en Pydantic format** (sin cambios esperados):

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

## 🔌 API Response Format Reference

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
  "detail": "email or phone is required"  // ← STRING
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
  "detail": [  // ← ARRAY
    {
      "loc": ["body", "contact_info"],
      "msg": "at least email or phone is required",
      "type": "value_error"
    }
  ]
}
```

---

## 🔗 Context & Philosophy

**¿Por qué esta migración?**

1. **Standardización:** Pydantic es el estándar de industria para validación en FastAPI
2. **Tooling:** Frontend tools (TypeScript, Zod) generan mejor DX con formato estándar
3. **Mantenibilidad:** Errores estructurados → más fáciles de parsear automáticamente
4. **Debugging:** `loc` campo ayuda a identificar exactamente dónde falló validación

**Fase 1 (Interno):** Solo backend refactoriza internamente - zero cambios en contrato  
**Fase 2 (Prep):** Frontend se prepara - este documento + unit tests  
**Fase 3 (Deploy):** Backend activa nuevo formato - Frontend switch ON

---

## ⏱️ Timeline & Dependencies

```
2026-03-01  ✅ F2 Phase 1: Backend internal refactor (Pydantic)
            └─ /contact, /mail, /quote/diagnostic con validación Pydantic
            └─ 117/117 tests passing con formato legacy preservado

2026-03-04  📋 F2 Phase 2: Frontend prep (THIS DOCUMENT)
            └─ Frontend teams review migration guide
            └─ Unit tests escritas para ambos formatos
            └─ QA sets up test cases

2026-03-11  🔄 F2 Phase 3: Backend publish Pydantic format
            └─ Backend respuestas cambiar a formato estándar
            └─ Frontend activar handlers para nuevo formato
            └─ Canary deployment 10% → 100% tráfico
            └─ Performance monitoring (parse overhead negligible)
```

---

## 📞 Questions & Support

**Para el equipo de Frontend:**

1. **¿Necesito cambiar TODAS las llamadas a estos endpoints?**
   - NO. Solo endpoints con errores de validación (POST /contact, /mail, /quote/diagnostic)
   - GET endpoints sin cambios
   - Success responses sin cambios

2. **¿Puedo ignorar esto si utilizo framework con auto-validation?**
   - Parcialmente. Vue/React/Angular form builders pueden adaptar automáticamente si usas Zod/OpenAPI generator
   - Recomendado: Regenerar types from OpenAPI v3.1 spec (backend actualizará en Phase 3)

3. **¿Qué pasa si hago request mientras está en transición?**
   - Phase 1-2: Legacy format (string)
   - Phase 3+: Pydantic format (array)
   - Tu cliente debe prepararse para ambos AHORA para smooth transition

4. **¿Hay deprecation period?**
   - No planificado. Format estándar es considerado "correcto"
   - Pero si hay issues en prod, rollback plan existe < 1 hora

---

## 📎 Referencias Relacionadas

- [architecture-decisions-backlog.md](./architecture-decisions-backlog.md) - Decisiones arquitectónicas
- [fastapi-http-contract-target.md](./fastapi-http-contract-target.md) - Target contract (será actualizado en Phase 3)
- [fastapi-testing.md](./fastapi-testing.md) - Testing strategy
- [fastapi-backend-migration-guide.md](./fastapi-backend-migration-guide.md) - Backend migration reference
- [fastapi-contact-contract.md](./fastapi-contact-contract.md) - Contact endpoint contract
- [fastapi-quote-contract.md](./fastapi-quote-contract.md) - Quote endpoint contract

---

**Última actualización:** 2026-03-01  
**Próxima revisión:** Post F2 Phase 3 (2026-03-15)
