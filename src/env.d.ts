
interface ImportMetaEnv {
  readonly VITE_ORIGIN_VERIFY_SECRET?: string
  readonly DEV: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

type GtagFunction = (
  command: 'event',
  eventName: string,
  params?: Record<string, unknown>
) => void

type ClarityFunction = (
  command: 'event',
  eventName: string,
  payload?: Record<string, unknown>
) => void

interface Window {
  gtag?: GtagFunction
  clarity?: ClarityFunction
}

declare module '*.svg' {
  const src: string
  export default src
}
