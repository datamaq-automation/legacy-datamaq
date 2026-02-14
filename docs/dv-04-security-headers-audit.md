# DV-04 - Auditoria de headers de seguridad (frontend publico)

Fecha de auditoria: 2026-02-14

## 1) Objetivo
Medir headers de seguridad efectivos en entorno deployado y priorizar brechas.

## 2) Decision de alcance (B)
URL objetivo elegida:
- `https://www.datamaq.com.ar`

Motivo:
- Es la URL publica versionada/operativa del frontend para este repositorio.
- Permite medir riesgo real de cliente sin depender de accesos extra a infraestructura.

## 3) Comandos ejecutados
```bash
curl -sSI https://www.datamaq.com.ar
curl -sSI http://www.datamaq.com.ar
curl -sSI https://www.datamaq.com.ar/assets/index-CHdJZEwT.js
```

## 4) Headers observados
Respuesta `https://www.datamaq.com.ar`:
- `HTTP/1.1 200 OK`
- `Server: Apache`
- `Content-Type: text/html; charset=UTF-8`
- `Content-Length: 434`
- `Last-Modified`, `ETag`, `Accept-Ranges`, `Vary`

Respuesta `http://www.datamaq.com.ar`:
- `HTTP/1.1 200 OK` (sin redireccion a HTTPS)

Respuesta `https://www.datamaq.com.ar/assets/index-CHdJZEwT.js`:
- `HTTP/1.1 200 OK`
- `Content-Type: text/javascript`
- `Content-Length: 255791`
- `Last-Modified`, `ETag`, `Accept-Ranges`, `Vary`

## 5) Brechas priorizadas
### Critico
1. No hay redireccion obligatoria `HTTP -> HTTPS`.
   - Impacto: trafico en claro, posible downgrading/MITM.
2. Falta `Strict-Transport-Security` (HSTS).
   - Impacto: no hay pin de HTTPS en navegadores, se facilita downgrade.

### Alto
1. Falta `Content-Security-Policy` (CSP).
   - Impacto: mayor superficie frente a XSS/carga de scripts no autorizados.
2. Falta `X-Content-Type-Options: nosniff`.
   - Impacto: riesgo de MIME sniffing.
3. Falta `Referrer-Policy`.
   - Impacto: fuga de metadata de navegacion hacia terceros.
4. Falta `Permissions-Policy`.
   - Impacto: capacidades de navegador no restringidas por politica explicita.
5. Falta `X-Frame-Options` o `frame-ancestors` en CSP.
   - Impacto: riesgo de clickjacking.

### Medio
1. Header `Server` expone tecnologia (`Apache`).
   - Impacto: fingerprinting (informacion para reconocimiento de ataque).

## 6) Baseline recomendado
Minimo sugerido en frontend publico:
- Redireccion forzada `HTTP -> HTTPS` (301).
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` (si aplica).
- CSP restrictiva ajustada al sitio (scripts, styles, connect-src, img-src, frame-ancestors).
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin` (o mas restrictiva segun producto).
- `Permissions-Policy` con capacidades no usadas en `()`.
- `X-Frame-Options: DENY` (si no se embebe en iframes).

## 7) Estado DV-04
- DoD de reporte cumplido para frontend publico en produccion: inventario de headers + brechas priorizadas.
- Pendiente complementario fuera de este repo: aplicar politicas en servidor/reverse proxy y re-auditar.
