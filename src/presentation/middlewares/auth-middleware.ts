import { HttpResponse, Middleware } from '../protocols'
import { LoadUserByTokenRepository } from '../../usecases/protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadUserByTokenRepository: LoadUserByTokenRepository
  ) {}

  async handle (request: AuthMiddleware.Request): Promise<HttpResponse> {
    const { tokenDeAcesso } = request
    if (tokenDeAcesso) {
      await this.loadUserByTokenRepository.loadByToken(tokenDeAcesso)
    }
    return null
  }
}

export namespace AuthMiddleware {
  export type Request = {
    tokenDeAcesso?: string
  }
}
