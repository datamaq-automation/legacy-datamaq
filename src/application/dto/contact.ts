export interface EmailContactPayload {
  name: string
  email: string
  company?: string
  message?: string
}

export interface ContactSubmitPayload extends EmailContactPayload {
  pageLocation: string
  trafficSource: string
  userAgent: string
  createdAt: string
}
