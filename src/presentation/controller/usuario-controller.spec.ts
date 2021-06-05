import { UsuarioController } from './usuario-controller'
import { Usuario } from '../../entities/usecases'
import { Validation } from '../protocols'
import { badRequest } from '../helpers'
import { MissingParamError } from '../errors'

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
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const usuarioSpy = new UsuarioSpy()
  const sut = new UsuarioController(validationSpy, usuarioSpy)
  return {
    sut,
    validationSpy,
    usuarioSpy
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
})
