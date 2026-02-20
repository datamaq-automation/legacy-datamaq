import { useContainer } from '@/di/container'
import { useContactForm } from './contactHooks'
import type { ContactFormProps } from './contactTypes'

export function useContactFormSection(props: ContactFormProps) {
  const { content } = useContainer()
  const contactContent = content.getContactContent()
  const contact = {
    ...contactContent,
    title: props.title ?? contactContent.title,
    subtitle: props.subtitle ?? contactContent.subtitle,
    submitLabel: props.submitLabel ?? contactContent.submitLabel
  }

  const {
    formRef,
    form,
    sectionId,
    titleId,
    emailId,
    messageId,
    tecnicoHeadingId,
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
    sectionId,
    titleId,
    emailId,
    messageId,
    tecnicoHeadingId,
    isBackendAvailable,
    isCheckingBackend,
    isChannelEnabled,
    isSubmitting,
    feedback,
    feedbackMessageRef,
    handleSubmit
  }
}
