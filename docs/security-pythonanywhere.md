PythonAnywhere security checklist

Backend responsibilities
- Validate and sanitize all inputs server-side.
- Return only generic error messages to the frontend.
- Log detailed errors server-side only.
- Enforce HTTPS-only URLs in config.

Headers at origin (if not set at Cloudflare)
- Content-Security-Policy (if serving HTML from backend)
- Strict-Transport-Security
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

Rate limiting and abuse controls
- Consider per-IP throttling for contact endpoints.
- Reject oversized payloads and enforce max lengths.
