import { UsuarioController } from './usuario-controller'
import { Authentication, Usuario } from '../../entities/usecases'
import { Validation } from '../protocols'
import { badRequest, forbidden, ok, serverError } from '../helpers'
import { EmailInUseError, MissingParamError } from '../errors'

import faker from 'faker'
import { cpf } from 'cpf-cnpj-validator'

export class ValidationSpy implements Validation {
  input: any
  error: Error = null

  validate (input: any): Error {
    this.input = input
    return this.error
  }
}

export class UsuarioSpy implements Usuario {
  user: Usuario.Params
  response = true

  async add (user: Usuario.Params): Promise<Usuario.Response> {
    this.user = user
    return this.response
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

const mockAddAccountParams = (): Usuario.Params => ({
  nomeCompleto: faker.name.findName(),
  cpf: Number(cpf.generate()),
  email: faker.internet.email(),
  senha: faker.internet.password()
})

type SutTypes = {
  sut: UsuarioController
  validationSpy: ValidationSpy
  usuarioSpy: UsuarioSpy
  authenticationSpy: AuthenticationSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const usuarioSpy = new UsuarioSpy()
  const authenticationSpy = new AuthenticationSpy()
  const sut = new UsuarioController(validationSpy, usuarioSpy, authenticationSpy)
  return {
    sut,
    validationSpy,
    usuarioSpy,
    authenticationSpy
  }
}

describe('SignUp Controller', () => {
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

  test('Deve chamar Usuario com os valores corretos', async () => {
    const { sut, usuarioSpy } = makeSut()
    const request = mockAddAccountParams()
    await sut.handle(request)
    expect(usuarioSpy.user).toEqual(request)
  })

  test('Deve retornar erro 500 se AddAccount arremessar um erro', async () => {
    const { sut, usuarioSpy } = makeSut()
    jest.spyOn(usuarioSpy, 'add').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(mockAddAccountParams())
    expect(httpResponse).toEqual(serverError())
  })

  test('Deve retornar erro 403 se AddAccount retornar falso', async () => {
    const { sut, usuarioSpy } = makeSut()
    usuarioSpy.response = false
    const httpResponse = await sut.handle(mockAddAccountParams())
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  test('Deve retornar 200 se credenciais válidas forem fornecidas', async () => {
    const { sut, usuarioSpy } = makeSut()
    const httpResponse = await sut.handle(mockAddAccountParams())
    expect(httpResponse).toEqual(ok(usuarioSpy.response))
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
