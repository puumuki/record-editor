import Ajv from 'ajv'
import schema from './types-schema.json'

const ajv = new Ajv({ allErrors: true })

export const createCarsValidator = (): any => {
  return ajv.compile(schema.definitions.Car)
}

export const createTrackValidator = (): any => {
  return ajv.compile(schema.definitions.Track)
}

export const createDriverValidator = (): any => {
  return ajv.compile(schema.definitions.Driver)
}

export const createRecordValidator = (): any => {
  return ajv.compile(schema.definitions.Record)
}
