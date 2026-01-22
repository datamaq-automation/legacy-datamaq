import fs from 'node:fs'
import path from 'node:path'

const routeMetadataPath = path.resolve('src', 'seo', 'routes.json')
const routeMetadata = JSON.parse(fs.readFileSync(routeMetadataPath, 'utf8'))
const configuredUrl = (process.env.VITE_SITE_URL || '').replace(/\/$/, '')
const baseUrl = configuredUrl || 'https://example.com'
const timestamp = new Date().toISOString()

const indexablePaths = Array.from(
  new Set(
    routeMetadata
      .filter((route) => route.indexable !== false)
      .map((route) => normalizeRoutePath(route.path))
  )
)

const sitemap = buildSitemap(baseUrl.replace(/\/$/, ''), indexablePaths, timestamp)
const robots = buildRobots(baseUrl.replace(/\/$/, ''))
const redirectRules = buildRedirectRules(baseUrl)

const publicDir = path.resolve('public')
fs.mkdirSync(publicDir, { recursive: true })
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf8')
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots, 'utf8')

if (redirectRules.length) {
  fs.writeFileSync(path.join(publicDir, '_redirects'), redirectRules.join('\n') + '\n', 'utf8')
}

console.log('[sitemap] sitemap.xml, robots.txt y _redirects generados.')

function buildSitemap(origin, routes, lastmod) {
  const entries = routes
    .map((route) => {
      const loc = `${origin}${route}`
      return [
        '  <url>',
        `    <loc>${loc}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        '  </url>'
      ].join('\n')
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${entries}\n` +
    `</urlset>\n`
}

function buildRobots(origin) {
  return `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`
}

function buildRedirectRules(origin) {
  if (!origin.startsWith('http')) {
    return []
  }

  const canonicalUrl = new URL(origin)
  const canonicalHost = canonicalUrl.host
  const canonicalOrigin = canonicalUrl.origin.replace(/\/$/, '')
  const rules = new Set()

  const nonWwwHost = canonicalHost.replace(/^www\./, '')

  if (nonWwwHost !== canonicalHost) {
    addRule(`https://${nonWwwHost}/*`, `${canonicalOrigin}/:splat`, rules)
    addRule(`https://${nonWwwHost}`, `${canonicalOrigin}/`, rules)
    addRule(`http://${nonWwwHost}/*`, `${canonicalOrigin}/:splat`, rules)
    addRule(`http://${nonWwwHost}`, `${canonicalOrigin}/`, rules)
  } else {
    const wwwHost = `www.${canonicalHost}`
    addRule(`https://${wwwHost}/*`, `${canonicalOrigin}/:splat`, rules)
    addRule(`https://${wwwHost}`, `${canonicalOrigin}/`, rules)
    addRule(`http://${wwwHost}/*`, `${canonicalOrigin}/:splat`, rules)
    addRule(`http://${wwwHost}`, `${canonicalOrigin}/`, rules)
  }

  if (canonicalUrl.protocol === 'https:') {
    addRule(`http://${canonicalHost}/*`, `${canonicalOrigin}/:splat`, rules)
    addRule(`http://${canonicalHost}`, `${canonicalOrigin}/`, rules)
  }

  return Array.from(rules)
}

function addRule(from, to, set) {
  set.add(`${from} ${to} 301`)
}

function normalizeRoutePath(route) {
  if (!route || route === '/') {
    return '/'
  }
  const trimmed = route.endsWith('/') ? route.slice(0, -1) : route
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}
