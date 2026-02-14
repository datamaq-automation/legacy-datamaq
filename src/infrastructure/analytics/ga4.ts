type Ga4Config = {
  id: string
  debug: boolean
}

let ga4Loaded = false
let ga4Ready = false
let ga4Config: Ga4Config | null = null
const pendingEvents: Array<{ name: string; params?: Record<string, unknown> }> = []

export function initGa4({ id, debug }: Ga4Config): void {
  if (ga4Loaded) {
    return
  }

  if (typeof window === 'undefined') {
    return
  }

  const scriptId = 'ga4-gtag'
  if (!document.getElementById(scriptId)) {
    const script = document.createElement('script')
    script.id = scriptId
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
    script.addEventListener('load', () => {
      const gtag = window.gtag
      ga4Ready = typeof gtag === 'function'
      if (ga4Ready && ga4Config && typeof gtag === 'function') {
        gtag('js', new Date())
        gtag('config', ga4Config.id, {
          send_page_view: false,
          debug_mode: ga4Config.debug
        })
        flushPendingEvents()
      }
    })
    document.head.appendChild(script)
  }

  ga4Config = { id, debug }

  ga4Loaded = true
}

export function trackGa4PageView(path: string, title?: string): void {
  if (typeof window === 'undefined') {
    return
  }

  enqueueEvent('page_view', {
    page_location: window.location.href,
    page_path: path,
    page_title: title
  })
}

export function trackGa4Event(name: string, params: Record<string, unknown>): void {
  enqueueEvent(name, params)
}

function enqueueEvent(name: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') {
    return
  }

  if (ga4Ready && typeof window.gtag === 'function') {
    window.gtag('event', name, params)
    return
  }

  if (typeof params === 'undefined') {
    pendingEvents.push({ name })
    return
  }

  pendingEvents.push({ name, params })
}

function flushPendingEvents(): void {
  if (!ga4Ready || typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return
  }

  while (pendingEvents.length > 0) {
    const event = pendingEvents.shift()
    if (!event) {
      continue
    }
    window.gtag('event', event.name, event.params)
  }
}
