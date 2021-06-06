import { DbLoadUserByToken } from './db-load-user-by-token'
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
  sut: DbLoadUserByToken
  decrypterSpy: DecrypterSpy
  loadUserByTokenRepositorySpy: LoadUserByTokenRepositorySpy
}

const makeSut = (): SutTypes => {
  const decrypterSpy = new DecrypterSpy()
  const loadUserByTokenRepositorySpy = new LoadUserByTokenRepositorySpy()
  const sut = new DbLoadUserByToken(decrypterSpy, loadUserByTokenRepositorySpy)
  return {
    sut,
    decrypterSpy,
    loadUserByTokenRepositorySpy
  }
}

let token: string

describe('DbLoadUserByToken caso de uso', () => {
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

  test('Deve chamar LoadUserByTokenRepository com o valor correto', async () => {
    const { sut, loadUserByTokenRepositorySpy } = makeSut()
    await sut.load(token)
    expect(loadUserByTokenRepositorySpy.token).toBe(token)
  })

  test('Deve retornar nulo se LoadUserByTokenRepository retornar nulo', async () => {
    const { sut, loadUserByTokenRepositorySpy } = makeSut()
    loadUserByTokenRepositorySpy.response = null
    const user = await sut.load(token)
    expect(user).toBeNull()
  })

  test('Deve retornar um usuario em caso de sucesso', async () => {
    const { sut, loadUserByTokenRepositorySpy } = makeSut()
    const user = await sut.load(token)
    expect(user).toEqual(loadUserByTokenRepositorySpy.response)
  })

  test('Deve retornar erro de LoadUserByTokenRepository retornar erro', async () => {
    const { sut, loadUserByTokenRepositorySpy } = makeSut()
    jest.spyOn(loadUserByTokenRepositorySpy, 'loadByToken').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.load(token)
    await expect(promise).rejects.toThrow()
  })
})
