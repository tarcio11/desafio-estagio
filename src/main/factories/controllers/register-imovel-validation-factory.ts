import { Validation } from '../../../presentation/protocols'
import { RequiredFieldValidation, ValidationComposite } from '../../../validation'

export const makeRegisterImovelValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['userId', 'cep', 'numero', 'complemento', 'valor_do_aluguel_em_reais', 'quantidade_de_quartos']) {
    validations.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite(validations)
}
