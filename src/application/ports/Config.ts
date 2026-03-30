type NullableString = string | undefined

export interface ConfigPort {
  brandId: NullableString
  storageNamespace: NullableString
  inquiryApiUrl: NullableString
  pricingApiUrl: NullableString
  siteApiUrl: NullableString
  healthApiUrl: NullableString
  requireRemoteContent?: boolean
  contactEmail: NullableString
  contactFormActive: boolean
  analyticsEnabled: boolean | undefined
  ga4Id: NullableString
  clarityProjectId: NullableString
  siteUrl: NullableString
  siteName: NullableString
  siteDescription: NullableString
  siteOgImage: NullableString
  siteLocale: NullableString
  gscVerification: NullableString
  businessName: NullableString
  businessTelephone: NullableString
  businessEmail: NullableString
  businessStreet: NullableString
  businessLocality: NullableString
  businessRegion: NullableString
  businessPostalCode: NullableString
  businessCountry: NullableString
  businessLat: NullableString
  businessLng: NullableString
  businessArea: NullableString
}
