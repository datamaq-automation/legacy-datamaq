import type { InjectionKey } from 'vue'
import type { ConsentManager } from '@/application/consent/consentManager'

export const consentManagerKey: InjectionKey<ConsentManager> = Symbol('consentManager')

