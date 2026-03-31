export type DevBackendAvailability = {
  reachable: boolean
  endpoint: string | null
  status: number | null
}

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
}
