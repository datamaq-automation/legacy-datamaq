import { useContainer } from '@/di/container'
import { useContactForm } from './contactHooks'
import type { ContactFormProps, ResolvedContactFormContent } from './contactTypes'

export function useContactFormSection(props: ContactFormProps) {
  const { content } = useContainer()
  const contactContent = content.getContactContent()
  const contact: ResolvedContactFormContent = {
    ...contactContent,
    labels: {
      firstName: 'Nombre',
      lastName: 'Apellido',
      company: 'Empresa',
      email: 'E-mail',
      phone: 'Nro telefono',
      geographicLocation: 'Ubicacion geografica',
      comment: 'Comentario',
      message: 'Comentario',
      ...contactContent.labels
    },
    title: props.title ?? contactContent.title,
    subtitle: props.subtitle ?? contactContent.subtitle,
    submitLabel: props.submitLabel ?? contactContent.submitLabel
  }

  const {
    formRef,
    form,
    fieldErrors,
    sectionId,
    titleId,
    fieldMeta,
    tecnicoHeadingId,
    isLeadChannel,
    isBackendAvailable,
    isCheckingBackend,
    isChannelEnabled,
    isSubmitting,
    feedback,
    feedbackMessageRef,
    handleSubmit
  } = useContactForm(props, contact)

  return {
    contact,
    formRef,
    form,
    fieldErrors,
    sectionId,
    titleId,
    fieldMeta,
    tecnicoHeadingId,
    isLeadChannel,
    isBackendAvailable,
    isCheckingBackend,
    isChannelEnabled,
    isSubmitting,
    feedback,
    feedbackMessageRef,
    handleSubmit
  }
}
