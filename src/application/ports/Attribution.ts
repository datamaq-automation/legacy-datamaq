export type Attribution = {
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  gclid?: string
}

export interface AttributionProvider {
  getAttribution(): Attribution | null
}
