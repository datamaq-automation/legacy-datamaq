import { useContent } from '@/ui/composables/useContent'
import { useContactForm } from './contactHooks'
import type { ContactFormProps } from './contactTypes'
import './ContactFormSection.css'

export function useContactFormSection(props: ContactFormProps) {
  const { contact } = useContent()

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
