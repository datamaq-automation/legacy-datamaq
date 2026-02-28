type NullableString = string | undefined
type WarnFn = (message: string) => void

const ALLOW_INSECURE_BACKEND_FLAG = 'runtimeProfile.allowInsecureBackend'
const E2E_BUILD_MODE = 'e2e'

export type BackendConfigRuntimeOptions = {
  allowInsecureBackend: boolean
  isDev: boolean
  mode?: string | undefined
  warn?: WarnFn | undefined
}

export type ResolveBackendConfigEndpointOptions = BackendConfigRuntimeOptions & {
  directUrl: NullableString
  baseUrl: NullableString
  path: string
  configKey: string
}

export function resolveBackendConfigEndpoint(options: ResolveBackendConfigEndpointOptions): NullableString {
  const normalizedEndpoint = ensureBackendConfigEndpointUrl({
    value: options.directUrl,
    configKey: options.configKey,
    allowInsecureBackend: options.allowInsecureBackend,
    isDev: options.isDev,
    mode: options.mode,
    warn: options.warn
  })
  if (normalizedEndpoint) {
    return normalizedEndpoint
  }

  return buildBackendEndpointUrl(options.baseUrl, options.path)
}

export function ensureBackendConfigBaseUrl(
  value: NullableString,
  options: BackendConfigRuntimeOptions & { configKey: string }
): NullableString {
  if (!value) {
    return undefined
  }

  if (options.isDev) {
    if (!value.startsWith('http://') && !value.startsWith('https://')) {
      options.warn?.(
        `[config] El campo ${options.configKey} debe comenzar con "http://" o "https://" en desarrollo. Valor recibido: ${value}`
      )
      return undefined
    }
    return value
  }

  if (!value.startsWith('https://')) {
    if (canUseLocalBypass(value, options.allowInsecureBackend, options.mode)) {
      options.warn?.(
        `[config] Se habilito bypass local para ${options.configKey} via ${ALLOW_INSECURE_BACKEND_FLAG}=true. Valor recibido: ${value}`
      )
      return value
    }

    options.warn?.(
      `[config] El campo ${options.configKey} debe comenzar con "https://" en produccion. Valor recibido: ${value}`
    )
    return undefined
  }

  return value
}

export function ensureBackendConfigEndpointUrl(
  options: BackendConfigRuntimeOptions & { value: NullableString; configKey: string }
): NullableString {
  if (!options.value) {
    return undefined
  }

  if (options.value.startsWith('/')) {
    return options.value
  }

  return ensureBackendConfigBaseUrl(options.value, {
    configKey: options.configKey,
    allowInsecureBackend: options.allowInsecureBackend,
    isDev: options.isDev,
    mode: options.mode,
    warn: options.warn
  })
}

export function buildBackendEndpointUrl(baseUrl: NullableString, path: string): NullableString {
  if (!baseUrl) {
    return undefined
  }

  return `${baseUrl.replace(/\/+$/, '')}${path}`
}

function canUseLocalBypass(value: string, allowInsecureBackend: boolean, mode: string | undefined): boolean {
  if (!allowInsecureBackend || mode !== E2E_BUILD_MODE) {
    return false
  }

  try {
    const parsedUrl = new URL(value)
    const normalizedHost = parsedUrl.hostname.trim().toLowerCase()
    const isLoopbackHost =
      normalizedHost === 'localhost' || normalizedHost === '127.0.0.1' || normalizedHost === '::1'

    return parsedUrl.protocol === 'http:' && isLoopbackHost
  } catch {
    return false
  }
}
