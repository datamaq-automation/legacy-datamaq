import { useContainer } from '@/di/container'
import { useContactForm } from './contactHooks'
import type { ContactFormProps } from './contactTypes'

export function useContactFormSection(props: ContactFormProps) {
  const { content } = useContainer()
  const contactContent = content.getContactContent()
  const contact = {
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
    firstNameId,
    lastNameId,
    companyId,
    emailId,
    phoneId,
    geographicLocationId,
    commentId,
    tecnicoHeadingId,
    isLeadChannel,
    isBackendAvailable,
    isCheckingBackend,
    isChannelEnabled,
    isSubmitting,
    feedback,
    feedbackMessageRef,
    handleSubmit
  } = useContactForm(props)

  return {
    contact,
    formRef,
    form,
    fieldErrors,
    sectionId,
    titleId,
    firstNameId,
    lastNameId,
    companyId,
    emailId,
    phoneId,
    geographicLocationId,
    commentId,
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
