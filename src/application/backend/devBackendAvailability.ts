export type DevBackendAvailability = {
  reachable: boolean
  endpoint: string | null
  status: number | null
}

type Listener = (state: DevBackendAvailability) => void

const listeners = new Set<Listener>()

let state: DevBackendAvailability = {
  reachable: true,
  endpoint: null,
  status: null
}

export function getDevBackendAvailability(): DevBackendAvailability {
  return state
}

export function setDevBackendAvailability(nextState: DevBackendAvailability): void {
  state = nextState
  listeners.forEach((listener) => listener(state))
}

export function subscribeDevBackendAvailability(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
