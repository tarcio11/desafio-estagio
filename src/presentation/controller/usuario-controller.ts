import { badRequest } from '../helpers'
import { Controller, HttpResponse, Validation } from '../protocols'

export class UsuarioController implements Controller {
  constructor (private readonly validation: Validation) {}

  async handle (request: UsuarioController.Request): Promise<HttpResponse> {
    const error = this.validation.validate(request)
    if (error) {
      return badRequest(error)
    }
    return null
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
