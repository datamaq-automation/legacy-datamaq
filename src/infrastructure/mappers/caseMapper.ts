type JsonLike = Record<string, unknown> | unknown[] | unknown

export function mapKeysToCamelCase<T = unknown>(value: JsonLike): T {
  return mapValue(value) as T
}

function mapValue(value: JsonLike): JsonLike {
  if (Array.isArray(value)) {
    return value.map((entry) => mapValue(entry))
  }
  if (!isRecord(value)) {
    return value
  }

  const mappedEntries = Object.entries(value).map(([key, entry]) => [toCamelKey(key), mapValue(entry)] as const)
  return Object.fromEntries(mappedEntries)
}

function toCamelKey(key: string): string {
  if (!key.includes('_')) {
    return key
  }
  return key.replace(/_([a-z0-9])/gi, (_, letter: string) => letter.toUpperCase())
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
