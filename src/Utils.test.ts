import { preprocessArgs } from './Utils'

describe('preprocessArgs', () => {

  it('should accept boolean', () => {
    const result = preprocessArgs({ value: true })
    expect(result.value).toEqual(true)
  })

  it('should accept number', () => {
    const result = preprocessArgs({ value: 1 })
    expect(result.value).toEqual(1)
  })

  it('should accept bigint', () => {
    const result = preprocessArgs({ value: BigInt(1) })
    expect(result.value).toEqual(BigInt(1))
  })

  it('should cover string with double quotes', () => {
    const result = preprocessArgs({ value: 'test' })
    expect(result.value).toEqual('"test"')
  })

  it('should accept nested object', () => {
    const result = preprocessArgs({ nest1: { nest2: true } })
    expect(result).toEqual({ nest1: { nest2: true }})
  })

  it('should covert array value to string', () => {
    const result = preprocessArgs({ value: [1, 'test', true] })
    expect(result.value).toEqual('[1,"test",true]')
  })
})
