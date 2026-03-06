type GtagConversionReporter = (url?: string) => boolean

type WindowWithGtagConversion = Window & {
  gtag_report_conversion?: GtagConversionReporter
}

export function isWhatsAppUrl(url: string): boolean {
  const normalizedUrl = url.trim()
  if (!normalizedUrl || !/^https?:\/\//i.test(normalizedUrl)) {
    return false
  }

  try {
    const parsedUrl = new URL(normalizedUrl)
    const hostname = parsedUrl.hostname.trim().toLowerCase()
    return hostname === 'wa.me' || hostname.endsWith('.wa.me') || hostname.endsWith('whatsapp.com')
  } catch {
    return false
  }
}

export function reportGtagConversion(url: string): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  const normalizedUrl = url.trim()
  if (!normalizedUrl) {
    return false
  }

  const gtagReporter = (window as WindowWithGtagConversion).gtag_report_conversion
  if (typeof gtagReporter === 'function') {
    return gtagReporter(normalizedUrl)
  }

  window.location.assign(normalizedUrl)
  return false
}
