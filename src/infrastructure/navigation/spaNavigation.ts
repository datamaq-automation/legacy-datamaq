const NAVIGATION_EVENT = 'app:navigate'

export function navigateTo(path: string): void {
  if (typeof window === 'undefined') {
    return
  }

  const normalized = normalizePath(path)
  if (window.location.pathname === normalized) {
    return
  }

  history.pushState({}, '', normalized)
  window.dispatchEvent(new Event(NAVIGATION_EVENT))
}

export function getCurrentPath(): string {
  if (typeof window === 'undefined') {
    return '/'
  }

  return normalizePath(window.location.pathname || '/')
}

export function subscribeToNavigation(callback: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => {}
  }

  window.addEventListener('popstate', callback)
  window.addEventListener(NAVIGATION_EVENT, callback)

  return () => {
    window.removeEventListener('popstate', callback)
    window.removeEventListener(NAVIGATION_EVENT, callback)
  }
}

function normalizePath(path: string): string {
  if (!path.startsWith('/')) {
    return `/${path}`
  }

  if (path.length > 1 && path.endsWith('/')) {
    return path.slice(0, -1)
  }

  return path || '/'
}
