# CORS Configuration for api.datamaq.com.ar

## Current Issue

The frontend at `https://datamaq.com.ar` is unable to call the API at `https://api.datamaq.com.ar` due to missing CORS headers in the API responses.

**Error Message:**
```
Access to fetch at 'https://api.datamaq.com.ar/v1/site' from origin 'https://datamaq.com.ar' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Root Cause

The API backend is not responding with the required CORS (Cross-Origin Resource Sharing) headers that allow browsers to accept responses from cross-origin requests.

## Solution

The backend needs to add the following HTTP response headers to all API endpoints that are called from the frontend:

### Minimum Required Headers

```
Access-Control-Allow-Origin: https://datamaq.com.ar
Access-Control-Allow-Methods: GET, POST, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Accept
```

### Recommended Headers (if using credentials)

```
Access-Control-Allow-Origin: https://datamaq.com.ar
Access-Control-Allow-Methods: GET, POST, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Accept, Authorization
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 3600
```

## Backend Implementation

### FastAPI (Python)
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://datamaq.com.ar"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "OPTIONS"],
    allow_headers=["Content-Type", "Accept", "Authorization"],
    max_age=3600,
)
```

### Laravel (PHP)
```php
// In your route middleware or CORS package configuration
// Using fruitcake/laravel-cors package:

'cors' => [
    'allowed_origins' => ['https://datamaq.com.ar'],
    'allowed_origins_patterns' => [],
    'allowed_methods' => ['*'],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 3600,
    'supports_credentials' => true,
],
```

### Node.js/Express
```javascript
const cors = require('cors');

const corsOptions = {
  origin: 'https://datamaq.com.ar',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  maxAge: 3600
};

app.use(cors(corsOptions));
```

## Endpoints Affected

The following endpoints need CORS headers configured:

- `GET /v1/site` - Content/site information
- `GET /v1/health` - Health check endpoint
- `GET /v1/pricing` - Pricing information
- `POST /v1/quote/diagnostic` - Quote diagnostic service
- `GET /v1/quote/{quote_id}/pdf` - PDF download

## Frontend Changes

The frontend has been updated to:
- Set `mode: 'cors'` explicitly in all fetch requests
- Include `credentials: 'include'` for requests that require authentication
- Use proper headers for cross-origin requests

## Testing CORS

To verify CORS is working correctly, you can:

1. **Using curl with preflight check:**
   ```bash
   curl -H "Origin: https://datamaq.com.ar" \
        -H "Access-Control-Request-Method: GET" \
        -H "Access-Control-Request-Headers: Content-Type" \
        -X OPTIONS https://api.datamaq.com.ar/v1/site -v
   ```

2. **Using the browser console:**
   ```javascript
   fetch('https://api.datamaq.com.ar/v1/site')
     .then(r => r.json())
     .then(console.log)
     .catch(console.error)
   ```

3. **Check response headers:**
   The response should include:
   ```
   access-control-allow-origin: https://datamaq.com.ar
   access-control-allow-methods: GET, POST, PATCH, OPTIONS
   access-control-allow-headers: Content-Type, Accept
   ```

## Additional Notes

- Development environment (`localhost:5173`) may require different CORS configuration
- If the API needs to be accessed from multiple origins, use a list or wildcard (not recommended for production)
- Always handle OPTIONS preflight requests automatically (most frameworks do this)
- The `Access-Control-Max-Age` header caches the preflight response to reduce requests

