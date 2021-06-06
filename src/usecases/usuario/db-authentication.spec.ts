import { DbAuthentication } from './db-authentication'
import { Authentication } from '../../entities/usecases'
import { HashComparer, LoadAccountByEmailRepository } from '../protocols'

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
    nome: faker.name.findName(),
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

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy
  hashComparerSpy: HashComparerSpy
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy()
  const hashComparerSpy = new HashComparerSpy()
  const sut = new DbAuthentication(loadAccountByEmailRepositorySpy, hashComparerSpy)
  return {
    sut,
    loadAccountByEmailRepositorySpy,
    hashComparerSpy
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
})
