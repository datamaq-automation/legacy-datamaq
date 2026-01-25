import { useContainer } from '@/di/container'
import { useContactForm } from './contactHooks'
import type { ContactFormProps } from './contactTypes'

export function useContactFormSection(props: ContactFormProps) {
  const { content } = useContainer()
  const contact = content.getContactContent()

  const {
    formRef,
    form,
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
    isBackendAvailable,
    isCheckingBackend,
    isChannelEnabled,
    isSubmitting,
    feedback,
    feedbackMessageRef,
    handleSubmit
  }
}
