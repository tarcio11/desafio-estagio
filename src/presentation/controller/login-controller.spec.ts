import { LoginController } from './login-controller'
import { Validation } from '../protocols'
import { MissingParamError } from '../errors'
import { badRequest, ok, serverError, unauthorized } from '../helpers'
import { Authentication } from '../../entities/usecases/usuario'

import faker from 'faker'

export class ValidationSpy implements Validation {
  input: any
  error: Error = null

  validate (input: any): Error {
    this.input = input
    return this.error
  }
}

export class AuthenticationSpy implements Authentication {
  params: Authentication.Params
  response: Authentication.Result = {
    nomeCompleto: faker.name.findName(),
    tokenDeAcesso: faker.datatype.uuid()
  }

  async auth (params: Authentication.Params): Promise<Authentication.Result> {
    this.params = params
    return this.response
  }
}

const mockAuthenticationParams = (): LoginController.Request => ({
  email: faker.internet.email(),
  senha: faker.internet.password()
})

type SutTypes = {
  sut
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const authenticationSpy = new AuthenticationSpy()
  const sut = new LoginController(validationSpy, authenticationSpy)
  return {
    sut,
    validationSpy,
    authenticationSpy
  }
}

describe('Login Controller', () => {
  test('Deve chamar Validation com os valores corretos', async () => {
    const { sut, validationSpy } = makeSut()
    const request = mockAuthenticationParams()
    await sut.handle(request)
    expect(validationSpy.input).toEqual(request)
  })

  test('Deve retornar erro 400 se Validation retornar um erro', async () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.error = new MissingParamError(faker.random.word())
    const httpResponse = await sut.handle(mockAuthenticationParams())
    expect(httpResponse).toEqual(badRequest(validationSpy.error))
  })

  test('Deve chamar Authentication com os valores corretos', async () => {
    const { sut, authenticationSpy } = makeSut()
    const request = mockAuthenticationParams()
    await sut.handle(request)
    expect(authenticationSpy.params).toEqual({
      email: request.email,
      senha: request.senha
    })
  })

  test('Deve retornar 401 se credenciais inválidas forem fornecidas', async () => {
    const { sut, authenticationSpy } = makeSut()
    authenticationSpy.response = null
    const httpResponse = await sut.handle(mockAuthenticationParams())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Deve retornar erro 500 se Authentication arremessar um erro', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(mockAuthenticationParams())
    expect(httpResponse).toEqual(serverError())
  })

  test('Deve retornar 200 se credenciais válidas forem fornecidas', async () => {
    const { sut, authenticationSpy } = makeSut()
    const httpResponse = await sut.handle(mockAuthenticationParams())
    expect(httpResponse).toEqual(ok(authenticationSpy.response))
  })
})
