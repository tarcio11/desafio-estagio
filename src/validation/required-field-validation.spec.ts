import { RequiredFieldValidation } from './required-field-validation'
import { MissingParamError } from '../presentation/errors'

import faker from 'faker'

const field = faker.random.word()

describe('RequiredField Validation', () => {
  test('Deve retornar um MissingParamError se a validação falhar', () => {
    const sut = new RequiredFieldValidation(field)
    const error = sut.validate({ invalidField: faker.random.word() })
    expect(error).toEqual(new MissingParamError(field))
  })
})
