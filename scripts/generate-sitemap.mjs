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
const redirectRules = buildRedirectRules()

const publicDir = path.resolve('public')
fs.mkdirSync(publicDir, { recursive: true })
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf8')
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots, 'utf8')
fs.writeFileSync(path.join(publicDir, '_redirects'), redirectRules.join('\n') + '\n', 'utf8')

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

function buildRedirectRules() {
  return [
    '/ /index.html 200'
  ]
}

function normalizeRoutePath(route) {
  if (!route || route === '/') {
    return '/'
  }
  const trimmed = route.endsWith('/') ? route.slice(0, -1) : route
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}
