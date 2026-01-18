type NullableString = string | undefined

export interface ConfigPort {
  contactApiUrl: NullableString
  contactEmail: NullableString
  whatsappNumber: NullableString
  whatsappPresetMessage: NullableString
}
