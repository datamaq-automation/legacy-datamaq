import type { RouteLocationRaw } from 'vue-router'
import type { NavbarContent } from '@/domain/types/content'

export interface LandingRouteLink {
  label: string
  to: RouteLocationRaw
  href: string
}

const HOME_SECTION_HASHES = new Set([
  '#top',
  '#servicios',
  '#perfil',
  '#faq',
  '#contacto',
  '#contacto-mail'
])

export function toHomeSectionRoute(hash: string): RouteLocationRaw {
  return hash === '#top' ? { path: '/' } : { path: '/', hash }
}

export function mapNavbarLinks(navbar: NavbarContent): LandingRouteLink[] {
  return navbar.links.map((link) => ({
    label: link.label,
    href: link.href,
    to: normalizeNavbarTarget(link.href)
  }))
}

function normalizeNavbarTarget(href: string): RouteLocationRaw {
  if (href === '#contacto') {
    return { path: '/contact' }
  }

  if (HOME_SECTION_HASHES.has(href)) {
    return toHomeSectionRoute(href)
  }

  return href
}
