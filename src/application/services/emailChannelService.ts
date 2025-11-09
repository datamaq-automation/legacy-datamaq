import { config, getContactEmail as readContactEmail } from '../../infrastructure/config'

export interface EmailContactPayload {
  name: string
  email: string
  company?: string
  message?: string
}

export function isEmailChannelEnabled(): boolean {
  return Boolean(config.CONTACT_EMAIL)
}

export function getContactEmail(): string | undefined {
  const value = readContactEmail()
  return value?.trim() ? value : undefined
}

export function buildMailtoHref(payload: EmailContactPayload): string {
  const recipient = config.CONTACT_EMAIL

  if (!recipient) {
    throw new Error('Contact email is not configured')
  }

  const name = payload.name.trim()
  const email = payload.email.trim()
  const company = payload.company?.trim()
  const message = payload.message.trim()

  const subject = 'Consulta desde profebustos.com.ar'

  const bodyLines = [
    `Nombre: ${name || 'No informado'}`,
    `Email: ${email || 'No informado'}`
  ]

  if (company) {
    bodyLines.push(`Empresa: ${company}`)
  }

  if (message) {
    bodyLines.push('', message)
  }

  const body = encodeURIComponent(bodyLines.join('\n'))

  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${body}`
}
