type NullableString = string | undefined

type BackendEndpointKey =
  | 'inquiryApiUrl'
  | 'pricingApiUrl'
  | 'siteApiUrl'
  | 'healthApiUrl'
  | 'quoteDiagnosticApiUrl'
  | 'quotePdfApiUrl'

const LOCAL_BACKEND_PATHS: Record<BackendEndpointKey, string> = {
  inquiryApiUrl: 'v1/contact',
  pricingApiUrl: 'v1/pricing',
  siteApiUrl: 'v1/site',
  healthApiUrl: 'v1/health',
  quoteDiagnosticApiUrl: 'v1/quote/diagnostic',
  quotePdfApiUrl: 'v1/quote/{quote_id}/pdf'
}

export function resolveBackendEndpointOverride(
  configKey: BackendEndpointKey,
  fallback: NullableString
): NullableString {
  const backendBaseUrl = normalize(import.meta.env.VITE_BACKEND_BASE_URL)
  if (!backendBaseUrl) {
    return fallback
  }

  return joinUrl(backendBaseUrl, LOCAL_BACKEND_PATHS[configKey])
}

function joinUrl(baseUrl: string, relativePath: string): string {
  try {
    const parsed = new URL(baseUrl)
    const basePath = parsed.pathname.endsWith('/') ? parsed.pathname : `${parsed.pathname}/`

    parsed.pathname = `${basePath}${relativePath}`.replace(/\/{2,}/g, '/')
    parsed.search = ''
    parsed.hash = ''

    return decodeURI(parsed.toString())
  } catch {
    return `${baseUrl.replace(/\/+$/, '')}/${relativePath}`
  }
}

function normalize(value: string | undefined): NullableString {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}
