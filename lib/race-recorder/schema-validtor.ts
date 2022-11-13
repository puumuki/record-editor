import Ajv from "ajv";
import schema from './types-schema.json';

const ajv = new Ajv({allErrors: true});


export const createCarsValidator = () => {
  return ajv.compile(schema.definitions.Car)
}

export const createTrackValidator = () => {
  return ajv.compile(schema.definitions.Track)
}

export const createDriverValidator = () => {
  return ajv.compile(schema.definitions.Driver)
}

export const createRecordValidator = () => {
  return ajv.compile(schema.definitions.Record)
}