# Reglas Cloudflare recomendadas — profebustos.com.ar

Documento de referencia para configurar WAF, Rate Limiting y Bot Protection en Cloudflare. Diseñado para un sitio público con formulario de contacto sin autenticación.

## Objetivo
- Reducir spam y abuso del endpoint de contacto.
- Proteger el sitio sin afectar conversiones.
- Mantener reglas simples y fáciles de ajustar.

## Alcance
- Dominio: `profebustos.com.ar`
- Endpoint de contacto (ajustar al real): `/v1/contact/email`

## 1) Rate Limiting (reglas críticas)

### Regla RL-01: Límite por IP al endpoint de contacto
- **Condición**: `http.request.uri.path eq "/v1/contact/email"`
- **Umbral**: 5 requests / 60 segundos
- **Acción**: Block (o Managed Challenge si se quiere menos fricción)
- **Notas**: Ajustar a 10/min si hay falsos positivos.

### Regla RL-02: Límite por IP en ventana corta (burst)
- **Condición**: `http.request.uri.path eq "/v1/contact/email"`
- **Umbral**: 2 requests / 10 segundos
- **Acción**: Block
- **Notas**: Previene ráfagas rápidas de bots.

## 2) WAF / Firewall Rules (protección base)

### Regla FW-01: Bloquear métodos no usados en el endpoint
- **Condición**: `http.request.uri.path eq "/v1/contact/email" and not http.request.method in {"POST","OPTIONS"}`
- **Acción**: Block
- **Notas**: Evita intentos de abuso con métodos inesperados.

### Regla FW-02: Restringir origen (si el backend permite)
- **Condición**: `http.request.uri.path eq "/v1/contact/email" and not http.request.headers["Origin"] in {"https://profebustos.com.ar"}`
- **Acción**: Block
- **Notas**: Solo si el backend responde CORS estricto. En caso de múltiples dominios, listar todos.

### Regla FW-03: Bloquear payloads vacíos o excesivos (capa WAF ligera)
- **Condición**: `http.request.uri.path eq "/v1/contact/email" and (http.request.body.size lt 20 or http.request.body.size gt 20000)`
- **Acción**: Block
- **Notas**: Ajustar tamaño máximo según validaciones reales.

## 3) Bot Protection (modo gratis)

### Regla BP-01: Bot Fight Mode
- **Activar**: Bot Fight Mode (gratis)
- **Acción**: Challenge o Block según tráfico observado
- **Notas**: Útil contra bots genéricos.

### Regla BP-02: Managed Challenge en rutas críticas
- **Condición**: `http.request.uri.path eq "/v1/contact/email" and cf.bot_management.score lt 30`
- **Acción**: Managed Challenge
- **Notas**: Requiere plan con Bot Management. Si no está disponible, omitir.

## 4) Reglas de acceso opcionales (si aplica)

### Regla OP-01: Bloqueo geográfico (opcional)
- **Condición**: `ip.geoip.country ne "AR" and http.request.uri.path eq "/v1/contact/email"`
- **Acción**: Managed Challenge
- **Notas**: Solo si la audiencia es local; revisar impacto en leads internacionales.

## 5) Headers de seguridad (via Transform Rules o Workers)

Configurar headers en Cloudflare (Response Header Modification):
- `Content-Security-Policy`: ajustar según scripts permitidos.
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`

## 6) Observabilidad mínima (Cloudflare)

Activar logging básico:
- Registrar requests bloqueadas por WAF/Rate Limiting.
- Revisar diariamente durante la primera semana.

## 7) Orden recomendado de activación
1. RL-01, RL-02
2. FW-01
3. FW-03
4. Headers de seguridad
5. Bot Fight Mode
6. FW-02 (solo si CORS estricto está confirmado)

## 8) Validación post-implementación
- Probar formulario normal (1 envío).
- Probar 3 envíos seguidos en menos de 10 segundos (debe bloquearse).
- Probar método GET al endpoint (debe bloquearse).
- Verificar que el sitio principal no se vea afectado.
