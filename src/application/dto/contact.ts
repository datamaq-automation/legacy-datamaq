export interface EmailContactPayload {
  email: string
  message: string
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

export interface ContactSubmitFeedback {
  requestId?: string
  errorCode?: string
  backendMessage?: string
}

export type ContactSubmitSuccess = ContactSubmitFeedback
