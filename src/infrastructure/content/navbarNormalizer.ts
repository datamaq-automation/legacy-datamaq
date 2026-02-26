import type { AppContent } from '@/domain/types/content'

export function normalizeNavbarContent(navbar: AppContent['navbar']): AppContent['navbar'] {
  const labelsByHref = new Map(navbar.links.map((link) => [link.href, link.label]))

  return {
    ...navbar,
    links: [
      { href: '#servicios', label: labelsByHref.get('#servicios') ?? 'Servicios' },
      { href: '#proceso', label: labelsByHref.get('#proceso') ?? 'Proceso' },
      { href: '#tarifas', label: labelsByHref.get('#tarifas') ?? 'Tarifas' },
      { href: '#cobertura', label: labelsByHref.get('#cobertura') ?? 'Cobertura' },
      { href: '#faq', label: labelsByHref.get('#faq') ?? 'FAQ' },
      { href: '#contacto', label: labelsByHref.get('#contacto') ?? 'Contacto' }
    ]
  }
}
