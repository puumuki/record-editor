export interface HistoryState {
  track_id?: number
  modify_record_id?: number
  time?: string
  drivers_id?: number
  cars_id?: number
}

/**
 * Read a RecordEditor a "sub" state from url in the browser's address bar.
 * @returns selected part of state object
 */
export function readHistoryState(): HistoryState {
  const url = new URL(window.location.href)

  const valueAsNumber = (key: string): number | undefined => {
    if (url.searchParams.has(key)) {
      return parseInt(url.searchParams.get(key) ?? '')
    }
  }

  const historyState: HistoryState = {
    track_id: valueAsNumber('track_id'),
    modify_record_id: valueAsNumber('modify_record_id'),
    time: url.searchParams.get('time') ?? undefined,
    drivers_id: valueAsNumber('drivers_id'),
    cars_id: valueAsNumber('cars_id')
  }

  return historyState
}

/**
 * Update search parameters by given history state
 * @param state history state object
 */
export function pushHistoryState(state: HistoryState): void {
  const url = new URL(window.location.href)

  Object.entries(state).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, String(value))
    }
  })

  window.history.pushState({}, '', url)
}
