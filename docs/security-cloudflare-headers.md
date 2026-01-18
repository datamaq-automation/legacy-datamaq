Cloudflare security headers setup

Goal: enforce security headers at the CDN edge for all HTML responses.

Option A - Transform Rules (Headers)
1) Go to Cloudflare > Rules > Transform Rules > Modify Response Header.
2) Create a rule: If hostname equals your domain (and/or path starts with /).
3) Set/overwrite the headers:
   - Content-Security-Policy: use the CSP from docs/security-headers.md
   - Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
   - X-Frame-Options: DENY
   - X-Content-Type-Options: nosniff
   - Referrer-Policy: strict-origin-when-cross-origin
   - Permissions-Policy: geolocation=(), microphone=(), camera=()

Option B - Worker (full control)
- Use a Worker to add headers only for HTML responses and keep assets untouched.
- Example (ready to paste):
  ```js
  export default {
    async fetch(request) {
      const response = await fetch(request)
      const newHeaders = new Headers(response.headers)

      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('text/html')) {
        newHeaders.set('Content-Security-Policy', "default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms; connect-src 'self' https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms https://www.googletagmanager.com https://www.google.com https://www.google.com.ar https://www.google.com.br; img-src 'self' data: https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms https://www.googletagmanager.com; style-src 'self'; font-src 'self' data:; frame-ancestors 'none'; base-uri 'self'; object-src 'none'; upgrade-insecure-requests;")
        newHeaders.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
        newHeaders.set('X-Frame-Options', 'DENY')
        newHeaders.set('X-Content-Type-Options', 'nosniff')
        newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin')
        newHeaders.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
      }

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
      })
    }
  }
  ```

Consent/analytics check
- Ensure no Cloudflare app or script injection adds GA/gtag to HTML.
- Disable any automatic tracking or "Analytics" injection features if enabled.
