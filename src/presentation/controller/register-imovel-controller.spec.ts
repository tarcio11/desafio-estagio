import { RegisterImovelController } from './register-imovel-controller'
import { Validation } from '../protocols'
import { MissingParamError } from '../errors'
import { badRequest, serverError } from '../helpers'
import { RegisterImovel } from '../../entities/usecases/imoveis'

import faker from 'faker'

export class ValidationSpy implements Validation {
  input: any
  error: Error = null

  validate (input: any): Error {
    this.input = input
    return this.error
  }
}

export class RegisterImovelSpy implements RegisterImovel {
  imovel: RegisterImovel.Params
  response: RegisterImovel.Response = {
    id: faker.datatype.uuid(),
    userId: faker.datatype.uuid(),
    cep: faker.address.zipCode(),
    complemento: faker.address.cityPrefix(),
    numero: Number(faker.finance.amount(1, 3000, null)),
    quantidade_de_quartos: faker.datatype.number(4),
    valor_do_aluguel_em_reais: faker.finance.amount(600, 1500),
    disponivel: faker.datatype.boolean()
  }

  async register (imovel: RegisterImovel.Params): Promise<RegisterImovel.Response> {
    this.imovel = imovel
    return this.response
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
  registerImovelSpy: RegisterImovelSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const registerImovelSpy = new RegisterImovelSpy()
  const sut = new RegisterImovelController(validationSpy, registerImovelSpy)
  return {
    sut,
    validationSpy,
    registerImovelSpy
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

  test('Deve chamar RegisterImovel com os valores corretos', async () => {
    const { sut, registerImovelSpy } = makeSut()
    const request = mockRegisterImovelParams()
    await sut.handle(request)
    expect(registerImovelSpy.imovel).toEqual(request)
  })

  test('Deve retornar erro 500 se RegisterImovel arremessar um erro', async () => {
    const { sut, registerImovelSpy } = makeSut()
    jest.spyOn(registerImovelSpy, 'register').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(mockRegisterImovelParams())
    expect(httpResponse).toEqual(serverError())
  })
})
