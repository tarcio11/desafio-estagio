import { Usuario } from '../../entities/usecases'
import { EmailInUseError } from '../errors'
import { badRequest, forbidden, ok, serverError } from '../helpers'
import { Controller, HttpResponse, Validation } from '../protocols'

export class UsuarioController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly usuario: Usuario
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
      return ok(isValid)
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
