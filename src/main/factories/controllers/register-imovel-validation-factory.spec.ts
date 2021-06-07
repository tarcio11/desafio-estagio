import { makeRegisterImovelValidation } from './register-imovel-validation-factory'
import { Validation } from '../../../presentation/protocols'
import { RequiredFieldValidation, ValidationComposite } from '../../../validation'

jest.mock('../../../validation/validation-composite')

describe('LoginValidation Factory', () => {
  test('Deve chamar ValidationComposite com todas as validações', () => {
    makeRegisterImovelValidation()
    const validations: Validation[] = []
    for (const field of ['userId', 'cep', 'numero', 'complemento', 'valor_do_aluguel_em_reais', 'quantidade_de_quartos']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
