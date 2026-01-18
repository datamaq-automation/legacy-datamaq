export interface Clock {
  now(): number
}

export interface LocationProvider {
  href(): string
  referrer(): string
  search(): string
}

export interface NavigatorProvider {
  userAgent(): string
}

export interface WindowOpener {
  open(url: string): void
}

export interface RuntimeFlags {
  isBrowser(): boolean
  isDev(): boolean
}
