import { Authentication, Usuario } from '../../entities/usecases'
import { EmailInUseError } from '../errors'
import { badRequest, forbidden, ok, serverError } from '../helpers'
import { Controller, HttpResponse, Validation } from '../protocols'

export class UsuarioController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly usuario: Usuario,
    private readonly authentication: Authentication
  ) {}

  async handle (request: UsuarioController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const isValid = await this.usuario.add(request)
      if (!isValid) {
        return forbidden(new EmailInUseError())
      }
      const { email, senha } = request
      const authenticationModel = await this.authentication.auth({ email, senha })
      return ok(authenticationModel)
    } catch {
      return serverError()
    }
  }
}

export namespace UsuarioController {
  export type Request = {
    nomeCompleto: string
    cpf: number
    email: string
    senha: string
  }
}
