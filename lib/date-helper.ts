import dayjs from 'dayjs'

import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

dayjs.locale('fi-fi')

export interface DateTimeParts {
  date: string | null
  time: string | null
}

/**
 * Convert unix time to 2022-11-08 12:30:40 format.
 * @param unixTime Seconds since Jan 01 1970. (UTC)
 * @returns time as formatted like '2022-11-08 12:30:40'
 */
export function unixTimeToLocalTime(unixTime: number): string {
  const result = dateTimeSeparated(unixTime)

  if (result.date && result.time) {
    return `${result.date} ${result.time}`
  } else {
    return ''
  }
}

/**
 * Convert unix time to date time parts for use with <input type="date"> and <input type="time">
 * @param unixTime unix time seconds
 * @returns date time parts
 */
export function dateTimeSeparated(unixTime: number): DateTimeParts {
  if (unixTime) {
    const time = dayjs(unixTime) // .tz('Europe/Helsinki');

    return {
      date: time.format('YYYY-MM-DD'),
      time: time.format('HH:mm')
    }
  } else {
    return { date: null, time: null }
  }
}

/**
 * Convert DateTimeParts object back to unix time
 * @param parts date tima parts
 * @returns unix time
 */
export function dateTimeSeparatedToUnixTime(parts: DateTimeParts): number {
  return dayjs(`${parts.date} ${parts.time}`).valueOf()
}
