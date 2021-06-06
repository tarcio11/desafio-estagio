import { LoginController } from './login-controller'
import { Validation } from '../protocols'
import { MissingParamError } from '../errors'
import { badRequest } from '../helpers'
import { Authentication } from '../../entities/usecases'

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

const mockAddAccountParams = (): LoginController.Request => ({
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
    const request = mockAddAccountParams()
    await sut.handle(request)
    expect(validationSpy.input).toEqual(request)
  })

  test('Deve retornar erro 400 se Validation retornar um erro', async () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.error = new MissingParamError(faker.random.word())
    const httpResponse = await sut.handle(mockAddAccountParams())
    expect(httpResponse).toEqual(badRequest(validationSpy.error))
  })

  test('Deve chamar Authentication com os valores corretos', async () => {
    const { sut, authenticationSpy } = makeSut()
    const request = mockAddAccountParams()
    await sut.handle(request)
    expect(authenticationSpy.params).toEqual({
      email: request.email,
      senha: request.senha
    })
  })
})
