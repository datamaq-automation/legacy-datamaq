/*
Path: src/infrastructure/config/publicConfig.ts
*/

export const publicConfig = {
  whatsappNumber: '5491156297160',
  whatsappPresetMessage:
    'Vengo de la web de DataMaq. Quiero cotizar: (1) Powermeter/Automate, (2) Chatwoot, (3) Rasa. Mi rubro es: ...',
  clarityProjectId: 'u24qtujrmg',
  ga4Id: 'G-X1ZQB8QLJC',
  analyticsEnabled: true,
  siteUrl: 'https://www.datamaq.com.ar',
  siteName: 'DataMaq',
  siteDescription:
    'Servicios industriales (medicion/diagnostico) y automatizacion comercial (Chatwoot + Rasa) para PYMEs y equipos de ventas.',
  siteOgImage: 'https://www.datamaq.com.ar/og-default.png',
  siteLocale: 'es_AR',
  gscVerification: undefined,
  businessName: undefined,
  businessTelephone: undefined,
  businessEmail: undefined,
  businessStreet: undefined,
  businessLocality: undefined,
  businessRegion: undefined,
  businessPostalCode: undefined,
  businessCountry: 'AR',
  businessLat: undefined,
  businessLng: undefined,
  businessArea: undefined,
  contactEmail: 'contacto@datamaq.com.ar',
  contactApiUrl: 'https://datamaq-flask-production.up.railway.app/v1/contact/email'
} as const
