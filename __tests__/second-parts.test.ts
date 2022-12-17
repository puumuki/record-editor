/* eslint-disable no-new */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { describe, expect, it } from 'vitest'
import { SecondParts } from '../lib/second-parts'

describe('Convert seconds to minutes, seconds and hurdreds of second.', () => {
  it('secondsToParts(200) should be 3 minutes 20 seconds', () => {
    const secondParts = new SecondParts(200)
    const { minutes, seconds, hundredths } = secondParts.parts

    expect(minutes).toEqual('03')
    expect(seconds).toEqual('20')
    expect(hundredths).toEqual('000')
  })

  it('SecondParts(200) should be 3 minutes 20 seconds', () => {
    const secondParts = new SecondParts(180.03)
    const { minutes, seconds, hundredths } = secondParts.parts

    expect(minutes).toEqual('03')
    expect(seconds).toEqual('00')
    expect(hundredths).toEqual('030')
  })

  it('SecondParts(null) should give out 00:00.000', () => {
    const secondParts = new SecondParts(undefined)
    const { minutes, seconds, hundredths } = secondParts.parts

    expect(minutes).toEqual('00')
    expect(seconds).toEqual('00')
    expect(hundredths).toEqual('000')
  })

  it('SecondParts(null) should give out 00:00.000', () => {
    const secondParts = new SecondParts(undefined)
    const { minutes, seconds, hundredths } = secondParts.parts

    expect(minutes).toEqual('00')
    expect(seconds).toEqual('00')
    expect(hundredths).toEqual('000')
  })

  it('toString()', () => {
    const secondParts = new SecondParts('00:00.000')
    expect(secondParts.toString()).toEqual('00:00.000')
  })

  it("toString('1:1:1') -> '01:01:100' ", () => {
    const secondParts = new SecondParts('1:1.1')
    expect(secondParts.toString()).toEqual('01:01.100')

    const secondParts2 = new SecondParts('1:1.01')
    expect(secondParts2.toString()).toEqual('01:01.010')
  })

  it("validate('00:00:00') to be true", () => {
    expect(SecondParts.validate('00:00.000')).to.be.true
    expect(SecondParts.validate('99:99.990')).to.be.true
    expect(SecondParts.validate('09:09.090')).to.be.true
    expect(SecondParts.validate('9:9.9')).to.be.true
  })

  it("validate('00:00:aa') to be false", () => {
    expect(SecondParts.validate('00:00:aa')).to.be.false
  })

  it("validate('00:aa:aa') to be false", () => {
    expect(SecondParts.validate('00:aa:aa')).to.be.false
    expect(SecondParts.validate('00:aa')).to.be.false
    expect(SecondParts.validate('00::00')).to.be.false
    expect(SecondParts.validate('001:00.01')).to.be.false
    expect(SecondParts.validate('01:00.001')).to.be.true
    expect(SecondParts.validate('')).to.be.false;
  })

  it("parseTimeParts('00:aa:aa') to thrown an error", () => {
    expect(() => {
      new SecondParts('00:aa:aa')
    }).to.throw(
      'Given string "00:aa:aa" is in invalid format. Expecting mm:ss.hhh formatted string. Where mm are minutes, ss are seconds and hhh are hunderths of a second.'
    )

    expect(() => {
      new SecondParts('')
    }).to.throw(
      'Given string "" is in invalid format. Expecting mm:ss.hhh formatted string. Where mm are minutes, ss are seconds and hhh are hunderths of a second.'
    )
  })

  it('set parts()', () => {
    const secondParts = new SecondParts()
    expect(secondParts.rawvalue).toEqual(0)

    secondParts.parts = {
      minutes: '03',
      seconds: '20',
      hundredths: '022'
    }

    expect(secondParts.rawvalue).toEqual(200.022)
    expect(secondParts.format).toEqual(secondParts.toString())
  })
})
