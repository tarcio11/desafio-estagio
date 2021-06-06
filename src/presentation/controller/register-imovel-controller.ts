import { Controller, HttpResponse, Validation } from '../protocols'
import { badRequest, serverError } from '../helpers'
import { RegisterImovel } from '../../entities/usecases/imoveis'

export class RegisterImovelController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly registerImovel: RegisterImovel
  ) {}

  async handle (request: RegisterImovelController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      await this.registerImovel.register(request)
      return null
    } catch (error) {
      return serverError()
    }
  }
}

export namespace RegisterImovelController {
  export type Request = {
    userId: string
    cep: string
    numero: number
    complemento: string
    valor_do_aluguel_em_reais: string
    quantidade_de_quartos: number
    disponivel: boolean
  }
}
