export type LandingPageFaq = {
  question: string
  answer: string
}

export type LandingPageContent = {
  name: string
  path: string
  title: string
  description: string
  eyebrow: string
  headline: string
  lead: string
  summary: string[]
  includes: string[]
  steps: string[]
  deliverables: string[]
  faqs: LandingPageFaq[]
  service: {
    name: string
    serviceType: string
    description: string
    areaServed: string[]
  }
}

export const landingPages = {
  medicionConsumoEscobar: {
    name: 'medicion-consumo-escobar',
    path: '/medicion-consumo-electrico-escobar',
    title: 'Medicion de consumo electrico en Escobar | DataMaq',
    description:
      'Medicion de consumo electrico en Escobar para industrias y PYMEs. Instalacion de Powermeter, verificacion de lectura y reporte tecnico con recomendaciones.',
    eyebrow: 'Escobar · GBA Norte',
    headline: 'Medicion de consumo electrico en Escobar',
    lead:
      'Instalamos un Powermeter (equipo provisto por el cliente), validamos la lectura y documentamos el punto de medicion para que tengas datos confiables.',
    summary: [
      'Medicion de consumo electrico en planta con foco en seguridad y trazabilidad.',
      'Instalacion del medidor + verificacion de lectura de referencia.',
      'Registro y reporte tecnico con observaciones y recomendaciones.'
    ],
    includes: [
      'Relevamiento del tablero y punto de instalacion.',
      'Instalacion del Powermeter y puesta en marcha.',
      'Verificacion de lectura de referencia (validacion basica).',
      'Fotos, checklist y observaciones relevantes.'
    ],
    steps: [
      'Relevamiento del tablero y condiciones de seguridad.',
      'Instalacion y verificacion de lectura en el punto acordado.',
      'Registro y entrega de documentacion tecnica.'
    ],
    deliverables: [
      'Checklist del tablero y punto de medicion.',
      'Registro fotografico de la instalacion.',
      'Resumen tecnico con observaciones y proximos pasos.'
    ],
    faqs: [
      {
        question: 'Trabajan en Escobar?',
        answer:
          'Si. Nuestra base operativa esta en Garin (GBA Norte) y cubrimos Escobar y alrededores. El traslado se cotiza segun distancia.'
      },
      {
        question: 'Necesito comprar el equipo?',
        answer:
          'Si, el Powermeter lo provee el cliente. Si aun no lo tenes, podemos recomendar opciones segun la necesidad.'
      },
      {
        question: 'Cuanto tarda la instalacion?',
        answer:
          'La instalacion tipica es de media jornada (aprox. 4 horas), dependiendo del tablero y condiciones de acceso.'
      },
      {
        question: 'Que entregables incluyen?',
        answer:
          'Checklist, fotos del tablero/punto de medicion y un resumen tecnico con observaciones y recomendaciones.'
      }
    ],
    service: {
      name: 'Medicion de consumo electrico en Escobar',
      serviceType: 'Medicion de consumo electrico',
      description:
        'Instalacion de Powermeter, verificacion de lectura y reporte tecnico para mejorar el control del consumo electrico.',
      areaServed: ['Escobar', 'GBA Norte', 'Buenos Aires', 'Argentina']
    }
  }
} as const satisfies Record<string, LandingPageContent>

const landingPagesList: LandingPageContent[] = Object.values(landingPages)

export function getLandingPageByPath(path: string): LandingPageContent | undefined {
  return landingPagesList.find((page) => page.path === path)
}
