export interface ContactFormPayload {
  firstName: string
  lastName: string
  company: string
  email: string
  phone: string
  geographicLocation: string
  comment: string
  captchaToken?: string
}

export interface ContactSubmitPayload {
  name: string
  email?: string
  phone?: string
  company?: string
  firstName?: string
  lastName?: string
  geographicLocation?: string
  comment: string
  captchaToken?: string
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
  submissionId?: string
  submitStatus?: string
  processingStatus?: string
  errorCode?: string
  backendMessage?: string
}

export type ContactSubmitSuccess = ContactSubmitFeedback
