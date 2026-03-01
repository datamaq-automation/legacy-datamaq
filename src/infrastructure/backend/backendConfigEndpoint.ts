type NullableString = string | undefined
type WarnFn = (message: string) => void

export type BackendConfigRuntimeOptions = {
  isDev: boolean
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

  if (options.isDev) {
    if (options.value.startsWith('http://') || options.value.startsWith('https://')) {
      return options.value
    }
    options.warn?.(
      `[config] El campo ${options.configKey} debe comenzar con "http://" o "https://" en desarrollo. Valor recibido: ${options.value}`
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
