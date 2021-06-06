import { HttpResponse, Middleware } from '../protocols'
import { forbidden, ok, serverError } from '../helpers'
import { AccessDeniedError } from '../errors'
import { LoadUserByToken } from '../../entities/usecases'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadUserByTokenRepository: LoadUserByToken
  ) {}

  async handle (request: AuthMiddleware.Request): Promise<HttpResponse> {
    const { tokenDeAcesso } = request
    try {
      if (tokenDeAcesso) {
        const user = await this.loadUserByTokenRepository.load(tokenDeAcesso)
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
