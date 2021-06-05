import { makeUsuarioValidation } from './usuario-validation-factory'
import { Validation } from '../../../presentation/protocols'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../validation'
import { CpfValidatorAdapter, EmailValidatorAdapter } from '../../../external/validators'
import { CpfValidation } from '../../../validation/cpf-validation'

jest.mock('../../../validation/validation-composite')

describe('SignupValidation Factory', () => {
  test('Deve chamar ValidationComposite com todas as validações', () => {
    makeUsuarioValidation()
    const validations: Validation[] = []
    for (const field of ['nomeCompleto', 'cpf', 'email', 'senha']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    validations.push(new CpfValidation('cpf', new CpfValidatorAdapter()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
