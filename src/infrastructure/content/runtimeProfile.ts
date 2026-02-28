import type { CommercialConfig } from '@/domain/types/content'
import runtimeProfilesRaw from '@/infrastructure/content/runtimeProfiles.json'

type NullableString = string | undefined
type NullableStringJson = string | null

const APP_TARGETS = ['datamaq', 'upp', 'example', 'e2e', 'integration'] as const
const DEFAULT_APP_TARGET = 'datamaq'
const MODE_TARGET_ALIASES = {
  // Keep plain `vite dev` on the local integration profile so all API calls stay behind `/api`.
  development: 'integration'
} as const

export type AppTarget = (typeof APP_TARGETS)[number]

export interface RuntimeProfile {
  brandId: string
  storageNamespace: string
  clarityProjectId: NullableString
  ga4Id: NullableString
  analyticsEnabled: boolean
  siteUrl: NullableString
  siteName: NullableString
  siteDescription: NullableString
  siteOgImage: NullableString
  siteLocale: NullableString
  gscVerification: NullableString
  businessName: NullableString
  businessTelephone: NullableString
  businessEmail: NullableString
  businessStreet: NullableString
  businessLocality: NullableString
  businessRegion: NullableString
  businessPostalCode: NullableString
  businessCountry: NullableString
  businessLat: NullableString
  businessLng: NullableString
  businessArea: NullableString
  contactEmail: NullableString
  contactFormActive: boolean
  emailFormActive: boolean
  backendBaseUrl: NullableString
  inquiryApiUrl: NullableString
  mailApiUrl: NullableString
  pricingApiUrl: NullableString
  contentApiUrl: NullableString
  healthApiUrl: NullableString
  requireRemoteContent: boolean
  quoteDiagnosticApiUrl: NullableString
  quotePdfApiUrl: NullableString
  allowInsecureBackend: boolean
  whatsappUrl: NullableString
  whatsappQrPhoneE164: NullableString
  whatsappQrMessage: NullableString
  whatsappQrSourceTag: NullableString
  brandName: string
  brandAriaLabel: string
  baseOperativa: string
  commercialConfig: Omit<
    CommercialConfig,
    'brandName' | 'brandAriaLabel' | 'baseOperativa' | 'whatsappUrl'
  >
}

type RuntimeProfileJson = {
  brandId: string
  storageNamespace: string
  clarityProjectId: NullableStringJson
  ga4Id: NullableStringJson
  analyticsEnabled: boolean
  siteUrl: NullableStringJson
  siteName: NullableStringJson
  siteDescription: NullableStringJson
  siteOgImage: NullableStringJson
  siteLocale: NullableStringJson
  gscVerification: NullableStringJson
  businessName: NullableStringJson
  businessTelephone: NullableStringJson
  businessEmail: NullableStringJson
  businessStreet: NullableStringJson
  businessLocality: NullableStringJson
  businessRegion: NullableStringJson
  businessPostalCode: NullableStringJson
  businessCountry: NullableStringJson
  businessLat: NullableStringJson
  businessLng: NullableStringJson
  businessArea: NullableStringJson
  contactEmail: NullableStringJson
  contactFormActive: boolean
  emailFormActive: boolean
  backendBaseUrl: NullableStringJson
  inquiryApiUrl: NullableStringJson
  mailApiUrl: NullableStringJson
  pricingApiUrl: NullableStringJson
  contentApiUrl: NullableStringJson
  healthApiUrl: NullableStringJson
  requireRemoteContent: boolean
  quoteDiagnosticApiUrl: NullableStringJson
  quotePdfApiUrl: NullableStringJson
  allowInsecureBackend: boolean
  whatsappUrl: NullableStringJson
  whatsappQrPhoneE164: NullableStringJson
  whatsappQrMessage: NullableStringJson
  whatsappQrSourceTag: NullableStringJson
  brandName: string
  brandAriaLabel: string
  baseOperativa: string
  tarifaBaseDesdeARS: number | null
  trasladoMinimoARS: number | null
  visitaDiagnosticoHasta2hARS: number | null
  diagnosticoHoraAdicionalARS: number | null
  descuentos: {
    cooperativasPct: number
    pymeGraficaPct: number
  }
  equipos: {
    medidorNombre: string
    automateNombre: string
  }
}

type RuntimeProfilesRecordJson = Record<AppTarget, RuntimeProfileJson>

const rawProfiles = runtimeProfilesRaw as RuntimeProfilesRecordJson

const runtimeProfilesByTarget: Record<AppTarget, RuntimeProfile> = {
  datamaq: mapProfile(rawProfiles.datamaq),
  upp: mapProfile(rawProfiles.upp),
  example: mapProfile(rawProfiles.example),
  e2e: mapProfile(rawProfiles.e2e),
  integration: mapProfile(rawProfiles.integration)
}

export function normalizeAppTarget(value: string | undefined): AppTarget | undefined {
  const normalized = normalize(value)?.toLowerCase()
  if (!normalized) {
    return undefined
  }

  if ((APP_TARGETS as readonly string[]).includes(normalized)) {
    return normalized as AppTarget
  }

  return undefined
}

export function resolveAppTarget(
  explicitTarget?: string,
  currentMode: string | undefined = import.meta.env.MODE
): AppTarget {
  const fromParam = normalizeAppTarget(explicitTarget)
  if (fromParam) {
    return fromParam
  }

  const fromMode = resolveModeTarget(currentMode)
  if (fromMode) {
    return fromMode
  }

  return DEFAULT_APP_TARGET
}

export function getRuntimeProfile(target: AppTarget = resolveAppTarget()): RuntimeProfile {
  return runtimeProfilesByTarget[target]
}

export const activeAppTarget = resolveAppTarget()
export const activeRuntimeProfile = getRuntimeProfile(activeAppTarget)

function mapProfile(profile: RuntimeProfileJson): RuntimeProfile {
  return {
    brandId: profile.brandId,
    storageNamespace: profile.storageNamespace,
    clarityProjectId: normalize(profile.clarityProjectId),
    ga4Id: normalize(profile.ga4Id),
    analyticsEnabled: profile.analyticsEnabled,
    siteUrl: normalize(profile.siteUrl),
    siteName: normalize(profile.siteName),
    siteDescription: normalize(profile.siteDescription),
    siteOgImage: normalize(profile.siteOgImage),
    siteLocale: normalize(profile.siteLocale),
    gscVerification: normalize(profile.gscVerification),
    businessName: normalize(profile.businessName),
    businessTelephone: normalize(profile.businessTelephone),
    businessEmail: normalize(profile.businessEmail),
    businessStreet: normalize(profile.businessStreet),
    businessLocality: normalize(profile.businessLocality),
    businessRegion: normalize(profile.businessRegion),
    businessPostalCode: normalize(profile.businessPostalCode),
    businessCountry: normalize(profile.businessCountry),
    businessLat: normalize(profile.businessLat),
    businessLng: normalize(profile.businessLng),
    businessArea: normalize(profile.businessArea),
    contactEmail: normalize(profile.contactEmail),
    contactFormActive: profile.contactFormActive,
    emailFormActive: profile.emailFormActive,
    backendBaseUrl: normalize(profile.backendBaseUrl),
    inquiryApiUrl: normalize(profile.inquiryApiUrl),
    mailApiUrl: normalize(profile.mailApiUrl),
    pricingApiUrl: normalize(profile.pricingApiUrl),
    contentApiUrl: normalize(profile.contentApiUrl),
    healthApiUrl: normalize(profile.healthApiUrl),
    requireRemoteContent: profile.requireRemoteContent,
    quoteDiagnosticApiUrl: normalize(profile.quoteDiagnosticApiUrl),
    quotePdfApiUrl: normalize(profile.quotePdfApiUrl),
    allowInsecureBackend: profile.allowInsecureBackend,
    whatsappUrl: normalize(profile.whatsappUrl),
    whatsappQrPhoneE164: normalize(profile.whatsappQrPhoneE164),
    whatsappQrMessage: normalize(profile.whatsappQrMessage),
    whatsappQrSourceTag: normalize(profile.whatsappQrSourceTag),
    brandName: profile.brandName,
    brandAriaLabel: profile.brandAriaLabel,
    baseOperativa: profile.baseOperativa,
    commercialConfig: {
      tarifaBaseDesdeARS: profile.tarifaBaseDesdeARS,
      trasladoMinimoARS: profile.trasladoMinimoARS,
      visitaDiagnosticoHasta2hARS: profile.visitaDiagnosticoHasta2hARS,
      diagnosticoHoraAdicionalARS: profile.diagnosticoHoraAdicionalARS,
      descuentos: {
        cooperativasPct: profile.descuentos.cooperativasPct,
        pymeGraficaPct: profile.descuentos.pymeGraficaPct
      },
      equipos: {
        medidorNombre: profile.equipos.medidorNombre,
        automateNombre: profile.equipos.automateNombre
      }
    }
  }
}

function normalize(value: string | null | undefined): NullableString {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

function resolveModeTarget(value: string | undefined): AppTarget | undefined {
  const directTarget = normalizeAppTarget(value)
  if (directTarget) {
    return directTarget
  }

  const normalizedMode = normalize(value)?.toLowerCase()
  if (!normalizedMode) {
    return undefined
  }

  return MODE_TARGET_ALIASES[normalizedMode as keyof typeof MODE_TARGET_ALIASES]
}
