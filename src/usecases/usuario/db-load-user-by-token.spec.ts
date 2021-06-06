import { DbLoadAccountByToken } from './db-load-user-by-token'
import { Decrypter, LoadUserByTokenRepository } from '../protocols'

import faker from 'faker'

class DecrypterSpy implements Decrypter {
  token: string
  response = faker.datatype.uuid()

  async decrypt (token: string): Promise<string> {
    this.token = token
    return this.response
  }
}

class LoadUserByTokenRepositorySpy implements LoadUserByTokenRepository {
  token: string
  response = {
    id: faker.datatype.uuid()
  }

  async loadByToken (token: string): Promise<LoadUserByTokenRepository.Response> {
    this.token = token
    return this.response
  }
}

type SutTypes = {
  sut: DbLoadAccountByToken
  decrypterSpy: DecrypterSpy
  loadUserByTokenRepositorySpy: LoadUserByTokenRepositorySpy
}

const makeSut = (): SutTypes => {
  const decrypterSpy = new DecrypterSpy()
  const loadUserByTokenRepositorySpy = new LoadUserByTokenRepositorySpy()
  const sut = new DbLoadAccountByToken(decrypterSpy, loadUserByTokenRepositorySpy)
  return {
    sut,
    decrypterSpy,
    loadUserByTokenRepositorySpy
  }
}

let token: string

describe('DbLoadAccountByToken caso de uso', () => {
  beforeEach(() => {
    token = faker.datatype.uuid()
  })

  test('Deve chamar Decrypter com o token correto', async () => {
    const { sut, decrypterSpy } = makeSut()
    await sut.load(token)
    expect(decrypterSpy.token).toBe(token)
  })

  test('Deve retornar nulo se Decrypter retornar nulo', async () => {
    const { sut, decrypterSpy } = makeSut()
    decrypterSpy.response = null
    const user = await sut.load(token)
    expect(user).toBeNull()
  })

  test('Deve retornar erro de Decrypter retornar erro', async () => {
    const { sut, decrypterSpy } = makeSut()
    jest.spyOn(decrypterSpy, 'decrypt').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.load(token)
    await expect(promise).rejects.toThrow()
  })

  test('Deve chamar LoadAccountByTokenRepository com o valor correto', async () => {
    const { sut, loadUserByTokenRepositorySpy } = makeSut()
    await sut.load(token)
    expect(loadUserByTokenRepositorySpy.token).toBe(token)
  })
})
