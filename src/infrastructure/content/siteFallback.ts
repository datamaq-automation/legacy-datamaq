import type { CommercialConfig } from '@/domain/types/content'
import type { BrandContent, SeoContent } from '@/domain/types/site'
import { activeRuntimeProfile } from '@/infrastructure/content/runtimeProfile'

export function buildFallbackBrandContent(config: CommercialConfig): BrandContent {
  const phoneE164 = activeRuntimeProfile.whatsappQrPhoneE164
  const contactEmail = activeRuntimeProfile.contactEmail
  const whatsappUrl = activeRuntimeProfile.whatsappUrl
  return {
    brandId: activeRuntimeProfile.brandId,
    brandName: config.brandName,
    brandAriaLabel: config.brandAriaLabel,
    baseOperativa: config.baseOperativa,
    ...(contactEmail ? { contactEmail } : {}),
    contactFormActive: activeRuntimeProfile.contactFormActive,
    ...(whatsappUrl ? { whatsappUrl } : {}),
    whatsappQr: {
      ...(phoneE164 ? { phoneE164 } : {}),
      message: activeRuntimeProfile.whatsappQrMessage ?? 'Hola, te contacto desde la web. Podemos coordinar?',
      sourceTag: activeRuntimeProfile.whatsappQrSourceTag ?? 'qr_card'
    },
    technician: {
      name: 'Agustin Bustos',
      role: 'Tecnico a cargo',
      photo: {
        src: '/media/tecnico-a-cargo.webp',
        alt: 'Foto del tecnico a cargo',
        width: 100,
        height: 100
      },
      whatsappLabel: 'Coordinar por WhatsApp',
      unavailableLabel: 'Contacto no disponible'
    },
    equipmentNames: {
      medidorNombre: config.equipos.medidorNombre,
      automateNombre: config.equipos.automateNombre
    }
  }
}

export function buildFallbackSeoContent(): SeoContent {
  const siteUrl = activeRuntimeProfile.siteUrl ?? ''
  const siteName = activeRuntimeProfile.siteName ?? activeRuntimeProfile.brandName
  const business: SeoContent['business'] = {
    name: activeRuntimeProfile.businessName ?? siteName,
    areaServed: parseCsv(activeRuntimeProfile.businessArea)
  }
  const lat = parseNumber(activeRuntimeProfile.businessLat)
  const lng = parseNumber(activeRuntimeProfile.businessLng)
  if (activeRuntimeProfile.businessTelephone) business.telephone = activeRuntimeProfile.businessTelephone
  if (activeRuntimeProfile.businessEmail) business.email = activeRuntimeProfile.businessEmail
  if (activeRuntimeProfile.businessStreet) business.street = activeRuntimeProfile.businessStreet
  if (activeRuntimeProfile.businessLocality) business.locality = activeRuntimeProfile.businessLocality
  if (activeRuntimeProfile.businessRegion) business.region = activeRuntimeProfile.businessRegion
  if (activeRuntimeProfile.businessPostalCode) business.postalCode = activeRuntimeProfile.businessPostalCode
  if (activeRuntimeProfile.businessCountry) business.country = activeRuntimeProfile.businessCountry
  if (typeof lat === 'number') business.lat = lat
  if (typeof lng === 'number') business.lng = lng
  return {
    siteUrl,
    siteName,
    siteDescription:
      activeRuntimeProfile.siteDescription ?? 'Servicios industriales y eficiencia energetica para empresas.',
    siteOgImage: activeRuntimeProfile.siteOgImage ?? (siteUrl ? `${siteUrl.replace(/\/$/, '')}/og-default.png` : ''),
    siteLocale: activeRuntimeProfile.siteLocale ?? 'es_AR',
    ...(activeRuntimeProfile.gscVerification ? { gscVerification: activeRuntimeProfile.gscVerification } : {}),
    business
  }
}

function parseCsv(value: string | undefined): string[] {
  if (!value) {
    return ['GBA Norte', 'Argentina']
  }

  const parsed = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
  return parsed.length > 0 ? parsed : ['GBA Norte', 'Argentina']
}

function parseNumber(value: string | undefined): number | undefined {
  if (!value) {
    return undefined
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}
