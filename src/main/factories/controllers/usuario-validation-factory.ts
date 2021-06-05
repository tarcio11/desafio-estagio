import { Validation } from '../../../presentation/protocols'
import { CpfValidation, EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../validation'
import { CpfValidatorAdapter, EmailValidatorAdapter } from '../../../external/validators'

export const makeUsuarioValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['nomeCompleto', 'cpf', 'email', 'senha']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  validations.push(new CpfValidation('cpf', new CpfValidatorAdapter()))
  return new ValidationComposite(validations)
}
