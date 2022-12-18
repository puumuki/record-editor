import { describe, expect, it } from 'vitest'
import { unixTimeToLocalTime, dateTimeSeparated, dateTimeSeparatedToUnixTime } from '../lib/date-helper'

describe('Convert seconds to minutes, seconds and hurdreds of second.', () => {

  it('dateTimeSeparated()', () => {
    const result = dateTimeSeparated(1667543808183)
    expect(result.date).toEqual('2022-11-04')
    expect(result.time).toEqual('08:36')
  })

  it("dateTimeSeparatedToUnixTime({ date: '2022-11-04', time: '08:36' })", () => {
    const separatedTime = { date: '2022-12-18', time: '18:55' }
    const result = dateTimeSeparatedToUnixTime(separatedTime)

    // Some precision are lost due we don't include milliseconds, notice zeros at the end.
    expect(result).toEqual(1671382500000)

    // But converting back to separated time should result same result
    const separatedTime2 = dateTimeSeparated(result)

    expect(separatedTime.date).toEqual(separatedTime2.date)
    expect(separatedTime.time).toEqual(separatedTime2.time)
  })

  it('Convert unix time to localtime', () => {
    const result = unixTimeToLocalTime(1671382500000)
    expect(result).toEqual('2022-12-18 18:55')
  })
})
