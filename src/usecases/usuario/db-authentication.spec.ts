import { DbAuthentication } from './db-authentication'
import { Authentication } from '../../entities/usecases/usuario'
import { Encrypter, HashComparer, LoadAccountByEmailRepository, UpdateAccessTokenRepository } from '../protocols'

import faker from 'faker'
import { cpf } from 'cpf-cnpj-validator'

const mockAuthenticationParams = (): Authentication.Params => ({
  email: faker.internet.email(),
  senha: faker.internet.password()
})

class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
  email: string
  response = {
    id: faker.datatype.uuid(),
    nomeCompleto: faker.name.findName(),
    cpf: Number(cpf.generate()),
    senha: faker.internet.password()
  }

  async loadByEmail (email: string): Promise<LoadAccountByEmailRepository.Response> {
    this.email = email
    return this.response
  }
}

class HashComparerSpy implements HashComparer {
  senha: string
  hashedSenha: string
  response = true

  async compare (senha: string, hashedSenha: string): Promise<boolean> {
    this.senha = senha
    this.hashedSenha = hashedSenha
    return this.response
  }
}

class EncrypterSpy implements Encrypter {
  id: string
  response = faker.datatype.uuid()

  async encrypt (id: string): Promise<string> {
    this.id = id
    return this.response
  }
}

class UpdateAccessTokenRepositorySpy implements UpdateAccessTokenRepository {
  id: string
  token: string

  async updateAccessToken (id: string, token: string): Promise<void> {
    this.id = id
    this.token = token
  }
}

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy
  hashComparerSpy: HashComparerSpy
  encrypterSpy: EncrypterSpy
  updateAccessTokenRepositorySpy: UpdateAccessTokenRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy()
  const hashComparerSpy = new HashComparerSpy()
  const encrypterSpy = new EncrypterSpy()
  const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpy()
  const sut = new DbAuthentication(loadAccountByEmailRepositorySpy, hashComparerSpy, encrypterSpy, updateAccessTokenRepositorySpy)
  return {
    sut,
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy
  }
}

describe('DbAuthentication caso de uso', () => {
  test('Deve chamar LoadAccountByEmailRepository com o email correto', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    const authenticationParams = mockAuthenticationParams()
    await sut.auth(authenticationParams)
    expect(loadAccountByEmailRepositorySpy.email).toBe(authenticationParams.email)
  })

  test('Deve retornar erro de LoadAccountByEmailRepository se retornar erro', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    jest.spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  test('Deve retornar nulo se LoadAccountByEmailRepository retornar nulo', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    loadAccountByEmailRepositorySpy.response = null
    const model = await sut.auth(mockAuthenticationParams())
    expect(model).toBeNull()
  })

  test('Deve chamar HashComparer com os valores corretos', async () => {
    const { sut, hashComparerSpy, loadAccountByEmailRepositorySpy } = makeSut()
    const authenticationParams = mockAuthenticationParams()
    await sut.auth(authenticationParams)
    expect(hashComparerSpy.senha).toBe(authenticationParams.senha)
    expect(hashComparerSpy.hashedSenha).toBe(loadAccountByEmailRepositorySpy.response.senha)
  })

  test('Deve retornar erro de HashComparer se retornar erro', async () => {
    const { sut, hashComparerSpy } = makeSut()
    jest.spyOn(hashComparerSpy, 'compare').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  test('Deve retornar nulo se HashComparer retornar nulo', async () => {
    const { sut, hashComparerSpy } = makeSut()
    hashComparerSpy.response = null
    const model = await sut.auth(mockAuthenticationParams())
    expect(model).toBeNull()
  })

  test('Deve chamar Encrypter com o id correto', async () => {
    const { sut, encrypterSpy, loadAccountByEmailRepositorySpy } = makeSut()
    await sut.auth(mockAuthenticationParams())
    expect(encrypterSpy.id).toBe(loadAccountByEmailRepositorySpy.response.id)
  })

  test('Deve retornar erro de Encrypter se retornar erro', async () => {
    const { sut, encrypterSpy } = makeSut()
    jest.spyOn(encrypterSpy, 'encrypt').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  test('Deve retornar um dado de sucesso', async () => {
    const { sut, encrypterSpy, loadAccountByEmailRepositorySpy } = makeSut()
    const { tokenDeAcesso, nomeCompleto } = await sut.auth(mockAuthenticationParams())
    expect(tokenDeAcesso).toBe(encrypterSpy.response)
    expect(nomeCompleto).toBe(loadAccountByEmailRepositorySpy.response.nomeCompleto)
  })

  test('Deve chamar UpdateAccessTokenRepository com os valores corretos', async () => {
    const { sut, updateAccessTokenRepositorySpy, loadAccountByEmailRepositorySpy, encrypterSpy } = makeSut()
    await sut.auth(mockAuthenticationParams())
    expect(updateAccessTokenRepositorySpy.id).toBe(loadAccountByEmailRepositorySpy.response.id)
    expect(updateAccessTokenRepositorySpy.token).toBe(encrypterSpy.response)
  })

  test('Deve retornar erro de UpdateAccessTokenRepository se retornar erro', async () => {
    const { sut, updateAccessTokenRepositorySpy } = makeSut()
    jest.spyOn(updateAccessTokenRepositorySpy, 'updateAccessToken').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })
})
