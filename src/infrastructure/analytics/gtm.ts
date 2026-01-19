type GtmConfig = {
  id: string
}

let gtmLoaded = false

export function initGtm({ id }: GtmConfig): void {
  if (gtmLoaded) {
    return
  }

  if (typeof window === 'undefined') {
    return
  }

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    'gtm.start': Date.now(),
    event: 'gtm.js'
  })

  const scriptId = 'gtm-script'
  if (!document.getElementById(scriptId)) {
    const script = document.createElement('script')
    script.id = scriptId
    script.async = true
    script.src = `https://www.googletagmanager.com/gtm.js?id=${id}`
    document.head.appendChild(script)
  }

  const noscriptId = 'gtm-noscript'
  if (!document.getElementById(noscriptId)) {
    const noscript = document.createElement('noscript')
    noscript.id = noscriptId
    const iframe = document.createElement('iframe')
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${id}`
    iframe.height = '0'
    iframe.width = '0'
    iframe.style.display = 'none'
    iframe.style.visibility = 'hidden'
    noscript.appendChild(iframe)
    document.body.appendChild(noscript)
  }

  gtmLoaded = true
}

export function pushToDataLayer(event: Record<string, unknown>): void {
  if (typeof window === 'undefined') {
    return
  }

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(event)
}
