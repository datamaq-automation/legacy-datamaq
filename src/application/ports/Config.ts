type NullableString = string | undefined

export interface ConfigPort {
  brandId: NullableString
  storageNamespace: NullableString
  inquiryApiUrl: NullableString
  mailApiUrl: NullableString
  pricingApiUrl: NullableString
  quoteDiagnosticApiUrl: NullableString
  quotePdfApiUrl: NullableString
  contactEmail: NullableString
  contactFormActive: boolean
  emailFormActive: boolean
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
