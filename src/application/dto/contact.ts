export interface EmailContactPayload {
  firstName: string
  lastName: string
  email: string
  company?: string
  message?: string
}

export interface ContactSubmitPayload extends EmailContactPayload {
  name: string
  pageLocation: string
  trafficSource: string
  userAgent: string
  createdAt: string
  attribution?: {
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
    utmTerm?: string
    utmContent?: string
    gclid?: string
  }
}
