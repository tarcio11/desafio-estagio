import { RegisterImovelController } from './register-imovel-controller'
import { Validation } from '../protocols'
import { MissingParamError } from '../errors'
import { badRequest } from '../helpers'

import faker from 'faker'

export class ValidationSpy implements Validation {
  input: any
  error: Error = null

  validate (input: any): Error {
    this.input = input
    return this.error
  }
}

const mockRegisterImovelParams = (): RegisterImovelController.Request => ({
  userId: faker.datatype.uuid(),
  cep: faker.address.zipCode(),
  complemento: faker.address.cityPrefix(),
  numero: Number(faker.finance.amount(1, 3000, null)),
  quantidade_de_quartos: faker.datatype.number(4),
  valor_do_aluguel_em_reais: faker.finance.amount(600, 1500),
  disponivel: faker.datatype.boolean()
})

type SutTypes = {
  sut
  validationSpy: ValidationSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const sut = new RegisterImovelController(validationSpy)
  return {
    sut,
    validationSpy
  }
}

describe('RegisterImovel Controller', () => {
  test('Deve chamar Validation com os valores corretos', async () => {
    const { sut, validationSpy } = makeSut()
    const request = mockRegisterImovelParams()
    await sut.handle(request)
    expect(validationSpy.input).toEqual(request)
  })

  test('Deve retornar erro 400 se Validation retornar um erro', async () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.error = new MissingParamError(faker.random.word())
    const httpResponse = await sut.handle(mockRegisterImovelParams())
    expect(httpResponse).toEqual(badRequest(validationSpy.error))
  })
})
