import type { ContactContent, WhatsappFabContent } from '@/domain/types/content'

export const contactData: ContactContent = {
  title: 'Preferís coordinar por correo electrónico',
  subtitle: 'Completá el formulario y recibirás una respuesta a tu correo electrónico',
  labels: {
    name: 'Nombre y apellido',
    email: 'Correo electrónico',
    company: 'Empresa (opcional)',
    message: 'Mensaje (opcional)'
  },
  submitLabel: 'Enviar consulta por correo',
  checkingMessage: 'Verificando la disponibilidad del servicio de correo electrónico…',
  unavailableMessage:
    'El canal de correo electrónico está en mantenimiento. Nuestro canal principal es WhatsApp: agendá tu diagnóstico allí y retomá este formulario más tarde si necesitás documentación.',
  successMessage: '¡Consulta enviada correctamente! Te responderemos a la brevedad.',
  errorMessage: 'No se pudo enviar la consulta. Intenta nuevamente más tarde.',
  unexpectedErrorMessage: 'Ocurrió un error inesperado. Intenta nuevamente más tarde.'
}

export const whatsappFabData: WhatsappFabContent = {
  ariaLabel: 'Abrir chat de WhatsApp'
}
