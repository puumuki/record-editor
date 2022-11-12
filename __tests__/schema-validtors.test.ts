
import { describe, expect, it } from 'vitest'
import { createCarsValidator } from '../lib/race-recorder/schema-validtor';

describe('Test JSON-schema validating.', () => {

  it("Test validating party populated car object", () => {
    const carsValidator = createCarsValidator();

    const isValid = carsValidator({
      id: null,
      name: 'Aston martin',
      scores: '300'
    });
        
    expect(isValid).toBe(false);
    expect(typeof carsValidator.errors).toBe('object');        
  });

  it("Test validating valid car object", () => {
    const carsValidator = createCarsValidator();

    const isValid = carsValidator({
      id: null,
      name: 'Aston martin',
      scores: 300,
      drivers_id: 3
    });
        
    expect(isValid).toBe(true);
    expect(carsValidator.errors).toBe(null)
  });
});

