interface TimeParts {
  minutes: string
  seconds: string
  hundredths: string
}

/**
 * SecondParts
 */
export class SecondParts {
  /**
   * Holds seconds internally
   */
  private value: number = 0

  /**
   * Set seconds to
   * @param seconds
   */
  constructor(seconds?: number | string) {
    this.seconds = seconds
  }

  /**
   * Return raw value
   * @return {number} raw value
   */
  get rawvalue(): number {
    return this.value
  }

  /**
   * Convert seconds to hours, minutes, seconds and hundreds of seconds.
   * @param {number} seconds - seconds
   * @returns {TimeParts} parts
   */
  get parts(): TimeParts {
    return {
      minutes: this.pad(Math.floor(this.value / 60)),
      seconds: this.pad(Math.floor(this.value % 60)),
      hundredths: this.pad((this.value % 1).toFixed(5).slice(2, 5))
    }
  }

  /**
   * Set seconds from object of TimeParts
   * @param {TimeParts} parts
   */
  set parts(parts: TimeParts) {
    const { minutes, seconds, hundredths } = parts

    let totalSeconds = parseInt(minutes) * 60
    totalSeconds += parseInt(seconds)
    totalSeconds += parseFloat(`0.${hundredths}`)

    this.seconds = totalSeconds
  }

  /**
   * Set raw seconds as a string or number
   */
  set seconds(seconds: string | number | undefined) {
    if (typeof seconds === 'string') {
      this.parts = SecondParts.parseTimeParts(seconds)
    } else if (typeof seconds === 'number') {
      this.value = seconds
    }
  }

  /**
   * Format seconds as minutes, seconds and hours as a string like 'mm:ss:hh'
   * Example string like '02:22:30' translates to 2 minutes, 22 seconds and 30 hudreths of a seconds.
   *
   * @return {string} formatted time
   */
  get format(): string {
    const { minutes, seconds, hundredths } = this.parts
    return `${minutes}:${seconds}.${hundredths}`
  }

  private pad(number: number | string): string {
    return String(number).padStart(2, '0')
  }

  /**
   * Parse timestring to parts
   * @param time time formatted like 2022-09-01 13:13:399
   * @throw {Error} if string is not valid format
   * @returns {TimeParts} parse time parts form given string
   */
  static parseTimeParts(time: string): TimeParts {
    if (!SecondParts.validate(time)) {
      throw new Error(
        `Given string "${time}" is in invalid format. Expecting mm:ss.hhh formatted string. Where mm are minutes, ss are seconds and hhh are hunderths of a second.`
      )
    }

    const partsRegExp = /^([0-9]{1,2}):([0-9]{1,2})\.([0-9]{1,3})$/
    const parts = time.match(partsRegExp)

    if (parts) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [all, minutes, seconds, hundredths] = parts
      return {
        minutes,
        seconds,
        hundredths
      }
    }

    return { minutes: '', seconds: '', hundredths: '' }
  }

  /**
   * Validate user input time string formatted like: 'mm:ss:hh'
   * where mm = minutes, ss = seconds and hh are hundreths of a second.
   * @param {string} timeString
   * @return {boolean} true if value is valid false if not.
   */
  static validate(secondString: string): boolean {
    const regexp = /^[0-9]{1,2}:[0-9]{1,2}\.[0-9]{1,3}$/
    return regexp.test(secondString)
  }

  /**
   * Return string presentation of second parts.
   * Alias to format method.
   * @return {string} format string of given second in format like mm:ss:hh
   */
  toString(): string {
    return this.format
  }
}

export default SecondParts
