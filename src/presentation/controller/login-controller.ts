import { Authentication } from '../../entities/usecases'
import { badRequest, unauthorized } from '../helpers'
import { Controller, HttpResponse, Validation } from '../protocols'

export class LoginController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle (request: LoginController.Request): Promise<HttpResponse> {
    const error = this.validation.validate(request)
    if (error) {
      return badRequest(error)
    }
    const authenticationModel = await this.authentication.auth(request)
    if (!authenticationModel) {
      return unauthorized()
    }
    return null
  }
}

export namespace LoginController {
  export type Request = {
    email: string
    senha: string
  }
}