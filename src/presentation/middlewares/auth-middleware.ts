import { HttpResponse, Middleware } from '../protocols'
import { LoadUserByTokenRepository } from '../../usecases/protocols'
import { forbidden, ok, serverError } from '../helpers'
import { AccessDeniedError } from '../errors'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadUserByTokenRepository: LoadUserByTokenRepository
  ) {}

  async handle (request: AuthMiddleware.Request): Promise<HttpResponse> {
    const { tokenDeAcesso } = request
    try {
      if (tokenDeAcesso) {
        const user = await this.loadUserByTokenRepository.loadByToken(tokenDeAcesso)
        if (user) {
          return ok({ userId: user.id })
        }
      }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError()
    }
  }
}

export namespace AuthMiddleware {
  export type Request = {
    tokenDeAcesso?: string
  }
}
