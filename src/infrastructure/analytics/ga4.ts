type Ga4Config = {
  id: string
  debug: boolean
}

let ga4Loaded = false

export function initGa4({ id, debug }: Ga4Config): void {
  if (ga4Loaded) {
    return
  }

  if (typeof window === 'undefined') {
    return
  }

  window.dataLayer = window.dataLayer || []
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args)
    }

  const scriptId = 'ga4-gtag'
  if (!document.getElementById(scriptId)) {
    const script = document.createElement('script')
    script.id = scriptId
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
    document.head.appendChild(script)
  }

  window.gtag('js', new Date())
  window.gtag('config', id, {
    send_page_view: false,
    debug_mode: debug
  })

  ga4Loaded = true
}

export function trackGa4PageView(path: string, title: string): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return
  }

  window.gtag('event', 'page_view', {
    page_location: window.location.href,
    page_path: path,
    page_title: title
  })
}

export function trackGa4Event(name: string, params: Record<string, unknown>): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return
  }

  window.gtag('event', name, params)
}
