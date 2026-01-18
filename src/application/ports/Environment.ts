export interface EnvironmentPort {
  now(): number
  href(): string
  referrer(): string
  search(): string
  userAgent(): string
  open(url: string): void
  isBrowser(): boolean
  isDev(): boolean
}
