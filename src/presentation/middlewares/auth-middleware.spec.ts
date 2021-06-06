import { AuthMiddleware } from './auth-middleware'

import faker from 'faker'
import { LoadUserByTokenRepository } from '../../usecases/protocols'

const mockRequest = (): AuthMiddleware.Request => ({
  tokenDeAcesso: faker.datatype.uuid()
})

export class LoadUserByTokenSpy implements LoadUserByTokenRepository {
  tokenDeAcesso: string
  response: LoadUserByTokenRepository.Response = {
    id: faker.name.findName()
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
})
