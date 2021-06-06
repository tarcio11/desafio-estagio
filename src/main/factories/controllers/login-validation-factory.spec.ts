import { makeLoginValidation } from './login-validation-factory'
import { Validation } from '../../../presentation/protocols'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../validation'
import { EmailValidatorAdapter } from '../../../external/validators'

jest.mock('../../../validation/validation-composite')

describe('LoginValidation Factory', () => {
  test('Deve chamar ValidationComposite com todas as validações', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const field of ['email', 'senha']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
