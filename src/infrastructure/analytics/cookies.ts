const ANALYTICS_COOKIE_EXACT_NAMES = new Set([
  '_ga',
  '_gid',
  '_gat',
  '_clck',
  '_clsk'
])

const ANALYTICS_COOKIE_PREFIXES = ['_ga_', '_gcl_', '_gac_']

export function clearAnalyticsCookies(): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return
  }

  const cookieNames = getAnalyticsCookieNames()
  if (cookieNames.length === 0) {
    return
  }

  const domains = getDomainVariants(window.location.hostname)
  const paths = ['/', window.location.pathname || '/']

  for (const name of cookieNames) {
    for (const path of paths) {
      expireCookie(name, path)
      for (const domain of domains) {
        expireCookie(name, path, domain)
      }
    }
  }
}

function getAnalyticsCookieNames(): string[] {
  return document.cookie
    .split(';')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => entry.split('=')[0] || '')
    .filter(Boolean)
    .filter((name) => {
      if (ANALYTICS_COOKIE_EXACT_NAMES.has(name)) {
        return true
      }

      return ANALYTICS_COOKIE_PREFIXES.some((prefix) => name.startsWith(prefix))
    })
}

function getDomainVariants(hostname: string): string[] {
  const normalized = hostname.trim().toLowerCase()
  if (!normalized || normalized === 'localhost') {
    return []
  }

  const parts = normalized.split('.')
  if (parts.length < 2) {
    return [normalized, `.${normalized}`]
  }

  const variants = new Set<string>([normalized, `.${normalized}`])

  for (let index = 1; index < parts.length - 1; index += 1) {
    const domain = parts.slice(index).join('.')
    variants.add(domain)
    variants.add(`.${domain}`)
  }

  return Array.from(variants)
}

function expireCookie(name: string, cookiePath: string, domain?: string): void {
  const path = normalizePath(cookiePath)
  const domainPart = domain ? `;domain=${domain}` : ''
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path}${domainPart};SameSite=Lax`
}

function normalizePath(value: string): string {
  if (!value || !value.startsWith('/')) {
    return '/'
  }

  return value
}
