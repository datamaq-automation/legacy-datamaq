import { computed, onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

type NullableString = string | undefined

type TurnstileRenderOptions = {
  sitekey: string
  callback?: (token: string) => void
  'expired-callback'?: () => void
  'error-callback'?: () => void
  theme?: 'light' | 'dark' | 'auto'
}

type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string
  reset: (widgetId: string) => void
  remove: (widgetId: string) => void
}

const TURNSTILE_SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

let turnstileScriptPromise: Promise<void> | null = null

export function useTurnstile() {
  const siteKey = normalize(import.meta.env.VITE_TURNSTILE_SITE_KEY)
  const enabled = computed(() => Boolean(siteKey))
  const token = ref('')
  const isReady = ref(false)
  const errorMessage = ref('')
  const containerRef = ref<HTMLElement | null>(null)
  const widgetId = ref<string | null>(null)

  onMounted(async () => {
    if (!enabled.value || !containerRef.value) {
      return
    }
    try {
      await ensureTurnstileScript()
      const api = resolveTurnstileApi()
      if (!api || !containerRef.value || !siteKey) {
        errorMessage.value = 'No se pudo inicializar la verificacion anti-bot.'
        return
      }
      widgetId.value = api.render(containerRef.value, {
        sitekey: siteKey,
        callback: (value: string) => {
          token.value = value
          errorMessage.value = ''
          isReady.value = true
        },
        'expired-callback': () => {
          token.value = ''
          isReady.value = false
        },
        'error-callback': () => {
          token.value = ''
          isReady.value = false
          errorMessage.value = 'No se pudo validar anti-bot. Intenta de nuevo.'
        },
        theme: 'dark'
      })
      isReady.value = true
    } catch {
      errorMessage.value = 'No se pudo cargar la verificacion anti-bot.'
    }
  })

  onBeforeUnmount(() => {
    const id = widgetId.value
    const api = resolveTurnstileApi()
    if (id && api) {
      api.remove(id)
    }
    widgetId.value = null
  })

  function reset(): void {
    token.value = ''
    errorMessage.value = ''
    const id = widgetId.value
    const api = resolveTurnstileApi()
    if (!id || !api) {
      return
    }
    api.reset(id)
  }

  return {
    enabled,
    token,
    isReady,
    errorMessage,
    containerRef: containerRef as Ref<HTMLElement | null>,
    reset
  }
}

async function ensureTurnstileScript(): Promise<void> {
  if (resolveTurnstileApi()) {
    return
  }
  if (turnstileScriptPromise) {
    return turnstileScriptPromise
  }

  turnstileScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SCRIPT_SRC}"]`)
    if (existing) {
      if (resolveTurnstileApi()) {
        resolve()
        return
      }
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('turnstile-load-error')), { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = TURNSTILE_SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('turnstile-load-error'))
    document.head.appendChild(script)
  })

  try {
    await turnstileScriptPromise
  } finally {
    turnstileScriptPromise = null
  }
}

function resolveTurnstileApi(): TurnstileApi | undefined {
  return window.turnstile
}

function normalize(value: string | null | undefined): NullableString {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}
