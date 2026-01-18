Security headers checklist

Goal: apply these at the CDN (Cloudflare) or origin so every response is protected.

Recommended headers
- Content-Security-Policy (strict, no inline scripts):
  default-src 'self';
  script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms;
  connect-src 'self' https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms https://www.googletagmanager.com https://www.google.com https://www.google.com.ar https://www.google.com.br;
  img-src 'self' data: https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms https://www.googletagmanager.com;
  style-src 'self';
  font-src 'self' data:;
  frame-ancestors 'none';
  base-uri 'self';
  object-src 'none';
  upgrade-insecure-requests;
- Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: geolocation=(), microphone=(), camera=()

Notes
- Avoid inline scripts to keep CSP simple and aligned with consent gating.
- If you load other third-party scripts, add them to script-src/connect-src/img-src.
- If you use Cloudflare, set headers via Transform Rules or a Worker.
