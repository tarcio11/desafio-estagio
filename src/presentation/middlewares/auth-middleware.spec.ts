import { AuthMiddleware } from './auth-middleware'
import { LoadUserByTokenRepository } from '../../usecases/protocols'
import { forbidden, ok } from '../helpers'
import { AccessDeniedError } from '../errors'

import faker from 'faker'

const mockRequest = (): AuthMiddleware.Request => ({
  tokenDeAcesso: faker.datatype.uuid()
})

export class LoadUserByTokenSpy implements LoadUserByTokenRepository {
  tokenDeAcesso: string
  response: LoadUserByTokenRepository.Response = {
    id: faker.datatype.uuid()
  }

  async loadByToken (tokenDeAcesso: string): Promise<LoadUserByTokenRepository.Response> {
    this.tokenDeAcesso = tokenDeAcesso
    return this.response
  }
}

type SutTypes = {
  sut: AuthMiddleware
  loadUserByTokenSpy: LoadUserByTokenSpy
}

const makeSut = (role?: string): SutTypes => {
  const loadUserByTokenSpy = new LoadUserByTokenSpy()
  const sut = new AuthMiddleware(loadUserByTokenSpy)
  return {
    sut,
    loadUserByTokenSpy
  }
}

describe('AuthMiddleware', () => {
  test('Deve chamar LoadAccountByToken com o correto tokenDeAcesso', async () => {
    const { sut, loadUserByTokenSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(loadUserByTokenSpy.tokenDeAcesso).toEqual(request.tokenDeAcesso)
  })

  test('Deve retornar 403 se nenhum x-token-acesso existe nos headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Deve retornar 403 se LoadAccountByToken retornar nulo', async () => {
    const { sut, loadUserByTokenSpy } = makeSut()
    loadUserByTokenSpy.response = null
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Deve retornar 200 se LoadAccountByToken retornar um usuario', async () => {
    const { sut, loadUserByTokenSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok({
      userId: loadUserByTokenSpy.response.id
    }))
  })
})
