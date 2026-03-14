import type { Ref } from 'vue'
import { isWhatsAppUrl, reportGtagConversion } from '@/ui/utils/gtagConversion'

export function createFooterWhatsAppClickHandler(whatsappHref: Readonly<Ref<string>>) {
  return (event: MouseEvent): boolean | void => {
    const whatsappUrl = whatsappHref.value
    if (!isWhatsAppUrl(whatsappUrl)) {
      return
    }

    event.preventDefault()
    return reportGtagConversion(whatsappUrl)
  }
}
