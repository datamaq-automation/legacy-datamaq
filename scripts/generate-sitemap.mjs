import fs from 'node:fs'
import path from 'node:path'

const siteUrl = (process.env.VITE_SITE_URL || '').replace(/\/$/, '')
if (!siteUrl) {
  console.warn('[sitemap] VITE_SITE_URL no esta configurada. Usando placeholder.')
}

const baseUrl = siteUrl || 'https://example.com'
const routes = ['/']

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  routes
    .map((route) => {
      return `  <url>\n    <loc>${baseUrl}${route}</loc>\n  </url>`
    })
    .join('\n') +
  `\n</urlset>\n`

const robots = `User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml\n`

const publicDir = path.resolve('public')
fs.mkdirSync(publicDir, { recursive: true })
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf8')
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots, 'utf8')

console.log('[sitemap] sitemap.xml y robots.txt generados.')
