import type { ContactSubmitFeedback } from '@/application/dto/contact'
import type { HttpResponse } from '@/application/ports/HttpClient'
import { mapKeysToCamelCase } from '@/infrastructure/mappers/caseMapper'

const REQUEST_ID_PATHS: string[][] = [
  ['requestId'],
  ['request', 'id'],
  ['meta', 'requestId']
]
const SUBMISSION_ID_PATHS: string[][] = [
  ['submissionId'],
  ['submission', 'id'],
  ['meta', 'submissionId']
]
const ERROR_CODE_PATHS: string[][] = [
  ['errorCode'],
  ['code'],
  ['error', 'code']
]
const SUBMIT_STATUS_PATHS: string[][] = [['status']]
const PROCESSING_STATUS_PATHS: string[][] = [['processingStatus']]
const MESSAGE_PATHS: string[][] = [
  ['detail'],
  ['message'],
  ['error'],
  ['errorMessage'],
  ['description'],
  ['error', 'message']
]
const REQUEST_ID_HEADER_KEYS = ['x-request-id', 'request-id', 'x-correlation-id']

export function extractContactSubmitFeedback(response: HttpResponse): ContactSubmitFeedback {
  const record = asRecord(mapKeysToCamelCase(response.data))
  const requestIdFromBody = extractByPaths(record, REQUEST_ID_PATHS)
  const requestIdFromHeaders = extractHeader(response.headers, REQUEST_ID_HEADER_KEYS)
  const requestId = requestIdFromHeaders ?? requestIdFromBody
  const submissionId = extractByPaths(record, SUBMISSION_ID_PATHS)
  const errorCode = extractByPaths(record, ERROR_CODE_PATHS)
  const submitStatus = extractByPaths(record, SUBMIT_STATUS_PATHS)
  const processingStatus = extractByPaths(record, PROCESSING_STATUS_PATHS)
  const backendMessage = resolveBackendMessage(record, response.text)

  const feedback: ContactSubmitFeedback = {}
  if (requestId) {
    feedback.requestId = requestId
  }
  if (submissionId) {
    feedback.submissionId = submissionId
  }
  if (submitStatus) {
    feedback.submitStatus = submitStatus
  }
  if (processingStatus) {
    feedback.processingStatus = processingStatus
  }
  if (errorCode) {
    feedback.errorCode = errorCode
  }
  if (backendMessage) {
    feedback.backendMessage = backendMessage
  }

  return feedback
}

function resolveBackendMessage(
  record: Record<string, unknown> | undefined,
  text: string | undefined
): string | undefined {
  const fromRecord = extractByPaths(record, MESSAGE_PATHS)
  if (fromRecord) {
    return fromRecord
  }
  return normalizeString(text, 240)
}

function extractByPaths(
  record: Record<string, unknown> | undefined,
  paths: string[][]
): string | undefined {
  if (!record) {
    return undefined
  }
  for (const path of paths) {
    const value = resolvePath(record, path)
    const normalized = normalizeString(value)
    if (normalized) {
      return normalized
    }
  }
  return undefined
}

function resolvePath(record: Record<string, unknown>, path: string[]): unknown {
  let current: unknown = record
  for (const key of path) {
    if (!current || typeof current !== 'object' || Array.isArray(current)) {
      return undefined
    }
    current = (current as Record<string, unknown>)[key]
  }
  return current
}

function extractHeader(
  headers: Record<string, string> | undefined,
  keys: string[]
): string | undefined {
  if (!headers) {
    return undefined
  }
  for (const key of keys) {
    const value = headers[key]
    const normalized = normalizeString(value)
    if (normalized) {
      return normalized
    }
  }
  return undefined
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined
  }
  return value as Record<string, unknown>
}

function normalizeString(value: unknown, maxLength: number = 120): string | undefined {
  if (typeof value !== 'string') {
    return undefined
  }
  const trimmed = value.trim()
  if (!trimmed) {
    return undefined
  }
  if (trimmed.length <= maxLength) {
    return trimmed
  }
  return trimmed.slice(0, maxLength)
}
