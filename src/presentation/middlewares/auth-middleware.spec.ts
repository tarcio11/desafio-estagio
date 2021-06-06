import { AuthMiddleware } from './auth-middleware'
import { LoadUserByTokenRepository } from '../../usecases/protocols'
import { forbidden, ok, serverError } from '../helpers'
import { AccessDeniedError } from '../errors'
import { LoadUserByToken } from '../../entities/usecases'

import faker from 'faker'

const mockRequest = (): AuthMiddleware.Request => ({
  tokenDeAcesso: faker.datatype.uuid()
})

export class LoadUserByTokenSpy implements LoadUserByToken {
  tokenDeAcesso: string
  response: LoadUserByTokenRepository.Response = {
    id: faker.datatype.uuid()
  }

  async load (tokenDeAcesso: string): Promise<LoadUserByTokenRepository.Response> {
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
  test('Deve chamar LoadUserByToken com o correto tokenDeAcesso', async () => {
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

  test('Deve retornar 403 se LoadUserByToken retornar nulo', async () => {
    const { sut, loadUserByTokenSpy } = makeSut()
    loadUserByTokenSpy.response = null
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Deve retornar 200 se LoadUserByToken retornar um usuario', async () => {
    const { sut, loadUserByTokenSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok({
      userId: loadUserByTokenSpy.response.id
    }))
  })

  test('Deve retornar 500 se LoadUserByToken arremessar um erro', async () => {
    const { sut, loadUserByTokenSpy } = makeSut()
    jest.spyOn(loadUserByTokenSpy, 'load').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError())
  })
})
