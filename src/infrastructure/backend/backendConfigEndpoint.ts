type NullableString = string | undefined
type WarnFn = (message: string) => void

export type BackendEndpointPolicyMode = 'development' | 'local-preview' | 'production'

export type BackendConfigRuntimeOptions = {
  isDev: boolean
  policyMode?: BackendEndpointPolicyMode | undefined
  warn?: WarnFn | undefined
}

export type ResolveBackendConfigEndpointOptions = BackendConfigRuntimeOptions & {
  directUrl: NullableString
  configKey: string
}

export function resolveBackendConfigEndpoint(options: ResolveBackendConfigEndpointOptions): NullableString {
  return ensureBackendConfigEndpointUrl({
    value: options.directUrl,
    configKey: options.configKey,
    isDev: options.isDev,
    policyMode: options.policyMode,
    warn: options.warn
  })
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

  const policyMode = resolveBackendEndpointPolicyMode(options)

  if (policyMode === 'development') {
    if (options.value.startsWith('http://') || options.value.startsWith('https://')) {
      return options.value
    }
    options.warn?.(
      `[config] El campo ${options.configKey} debe comenzar con "http://" o "https://" en desarrollo. Valor recibido: ${options.value}`
    )
    return undefined
  }

  if (policyMode === 'local-preview') {
    if (options.value.startsWith('https://') || isLoopbackHttpEndpoint(options.value)) {
      return options.value
    }
    options.warn?.(
      `[config] El campo ${options.configKey} debe comenzar con "https://" o apuntar a loopback local ("http://localhost" o "http://127.0.0.1") en local-preview. Valor recibido: ${options.value}`
    )
    return undefined
  }

  if (!options.value.startsWith('https://')) {
    options.warn?.(
      `[config] El campo ${options.configKey} debe comenzar con "https://" en produccion. Valor recibido: ${options.value}`
    )
    return undefined
  }

  return options.value
}

export function resolveBackendEndpointPolicyMode(
  options: Pick<BackendConfigRuntimeOptions, 'isDev' | 'policyMode'>
): BackendEndpointPolicyMode {
  if (options.policyMode) {
    return options.policyMode
  }

  return options.isDev ? 'development' : 'production'
}

function isLoopbackHttpEndpoint(value: string): boolean {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' && (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1')
  } catch {
    return false
  }
}
