import fs from 'node:fs'
import path from 'node:path'

const ROUTES_PATH = path.resolve(process.cwd(), 'src', 'seo', 'routes.json')
const RUNTIME_PROFILES_PATH = path.resolve(
  process.cwd(),
  'src',
  'infrastructure',
  'content',
  'runtimeProfiles.json'
)
const PUBLIC_DIR = path.resolve(process.cwd(), 'public')
const SITEMAP_PATH = path.resolve(PUBLIC_DIR, 'sitemap.xml')
const ROBOTS_PATH = path.resolve(PUBLIC_DIR, 'robots.txt')
const WHATSAPP_REDIRECT_PATH = path.resolve(PUBLIC_DIR, 'w', 'index.html')

const SUPPORTED_TARGETS = new Set(['datamaq', 'upp', 'example', 'e2e'])
const DEFAULT_TARGET = 'datamaq'
const TARGET_ALIASES = new Map([['example', 'upp']])
const DEFAULT_SITE_URL = 'https://www.datamaq.com.ar'
const DEFAULT_SITE_NAME = 'DataMaq'
const DEFAULT_WHATSAPP_URL = 'https://wa.me/5491156297160'
const DEFAULT_WHATSAPP_MESSAGE = 'Hola, te contacto desde la web. Podemos coordinar?'
const DEFAULT_WHATSAPP_SOURCE_TAG = 'qr_card'

function normalize(value) {
  if (typeof value !== 'string') {
    return undefined
  }
  const trimmed = value.trim()
  return trimmed || undefined
}

function normalizeSiteUrl(raw) {
  const trimmed = normalize(raw) ?? DEFAULT_SITE_URL
  try {
    const parsed = new URL(trimmed)
    if (!parsed.protocol.startsWith('http')) {
      return DEFAULT_SITE_URL
    }
    return parsed.toString().replace(/\/$/, '')
  } catch {
    return DEFAULT_SITE_URL
  }
}

function normalizePath(pathname) {
  if (typeof pathname !== 'string' || pathname.trim() === '') {
    return '/'
  }
  const trimmed = pathname.trim()
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}

function loadIndexablePaths(routesPath) {
  const raw = fs.readFileSync(routesPath, 'utf8')
  const parsed = JSON.parse(raw)

  if (!Array.isArray(parsed)) {
    throw new Error('routes.json must contain an array.')
  }

  return parsed
    .filter((route) => route && route.indexable === true)
    .map((route) => normalizePath(route.path))
}

function buildSitemapXml(siteUrl, paths) {
  const entries = paths
    .map((pathname) => {
      const absoluteUrl = new URL(pathname, `${siteUrl}/`).toString()
      return `  <url>\n    <loc>${absoluteUrl}</loc>\n  </url>`
    })
    .join('\n')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries,
    '</urlset>',
    ''
  ].join('\n')
}

function buildRobotsTxt(siteUrl) {
  return `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`
}

function ensureDir(targetPath) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true })
}

function normalizePhone(value) {
  return normalize(value)?.replace(/[^\d]/g, '').trim() ?? ''
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function loadRuntimeProfiles() {
  const raw = fs.readFileSync(RUNTIME_PROFILES_PATH, 'utf8')
  const parsed = JSON.parse(raw)
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('runtimeProfiles.json must contain an object.')
  }
  return parsed
}

function resolveTarget(argv) {
  const maybePositional = argv.find((arg) => !arg.startsWith('--'))
  const explicitTargetArg = argv.find((arg) => arg.startsWith('--target='))
  const targetFromFlag = explicitTargetArg?.split('=')[1]
  const targetFromSeparateFlag = (() => {
    const index = argv.findIndex((arg) => arg === '--target')
    if (index === -1) {
      return undefined
    }
    return argv[index + 1]
  })()

  const normalizedRequestedTarget =
    normalize(targetFromFlag)?.toLowerCase() ??
    normalize(targetFromSeparateFlag)?.toLowerCase() ??
    normalize(maybePositional)?.toLowerCase() ??
    DEFAULT_TARGET
  const normalizedTarget = TARGET_ALIASES.get(normalizedRequestedTarget) ?? normalizedRequestedTarget

  if (!SUPPORTED_TARGETS.has(normalizedTarget)) {
    throw new Error(
      `[sitemap] invalid target "${normalizedTarget}". Expected one of: ${Array.from(SUPPORTED_TARGETS).join(', ')}`
    )
  }

  return normalizedTarget
}

function resolveProfile(target, profiles) {
  const profile = profiles[target]
  if (!profile || typeof profile !== 'object') {
    throw new Error(`[sitemap] missing runtime profile for target "${target}"`)
  }
  return profile
}

function buildWhatsAppHref(profile) {
  const phone = normalizePhone(profile.whatsappQrPhoneE164)
  if (phone) {
    const message = normalize(profile.whatsappQrMessage) ?? DEFAULT_WHATSAPP_MESSAGE
    const sourceTag = normalize(profile.whatsappQrSourceTag) ?? DEFAULT_WHATSAPP_SOURCE_TAG
    const text = sourceTag ? `${message}\n\nOrigen: ${sourceTag}` : message
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
  }

  return normalize(profile.whatsappUrl) ?? DEFAULT_WHATSAPP_URL
}

function buildWhatsAppRedirectHtml(siteName, href) {
  const escapedSiteName = escapeHtml(siteName)
  const escapedHref = escapeHtml(href)

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapedSiteName}</title>
    <meta http-equiv="refresh" content="0;url=${escapedHref}">
    <style>
      :root { color-scheme: dark; }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
        background: #0b2766;
        color: #e2e9f3;
      }
      main {
        width: min(92vw, 560px);
        border: 1px solid rgba(226, 233, 243, 0.18);
        background: rgba(12, 9, 47, 0.92);
        padding: 1.25rem;
      }
      h1 { margin: 0 0 0.75rem; font-size: 1.5rem; }
      p { margin: 0 0 1rem; }
      a.btn {
        display: inline-block;
        width: 100%;
        text-align: center;
        text-decoration: none;
        font-weight: 700;
        background: #ff6a00;
        color: #0c092f;
        padding: 0.9rem 1rem;
      }
      small { display: block; margin-top: 0.75rem; word-break: break-word; opacity: 0.8; }
    </style>
    <script>
      (function () {
        var href = '${escapedHref}';
        window.location.replace(href);
      })();
    </script>
  </head>
  <body>
    <main>
      <h1>${escapedSiteName}</h1>
      <p>Si no se abrio WhatsApp automaticamente, toca el boton.</p>
      <a class="btn" href="${escapedHref}" rel="noopener noreferrer" target="_blank">Abrir WhatsApp</a>
      <small>${escapedHref}</small>
    </main>
  </body>
</html>
`
}

function main() {
  const target = resolveTarget(process.argv.slice(2))
  const profiles = loadRuntimeProfiles()
  const profile = resolveProfile(target, profiles)
  const siteUrl = normalizeSiteUrl(profile.siteUrl)
  const siteName = normalize(profile.siteName) ?? DEFAULT_SITE_NAME
  const whatsappHref = buildWhatsAppHref(profile)
  const indexablePaths = loadIndexablePaths(ROUTES_PATH)

  ensureDir(SITEMAP_PATH)
  ensureDir(WHATSAPP_REDIRECT_PATH)
  fs.writeFileSync(SITEMAP_PATH, buildSitemapXml(siteUrl, indexablePaths), 'utf8')
  fs.writeFileSync(ROBOTS_PATH, buildRobotsTxt(siteUrl), 'utf8')
  fs.writeFileSync(WHATSAPP_REDIRECT_PATH, buildWhatsAppRedirectHtml(siteName, whatsappHref), 'utf8')

  // eslint-disable-next-line no-console
  console.info(
    `[sitemap] Generated ${indexablePaths.length} URLs for target=${target} site=${siteUrl}`
  )
}

main()
