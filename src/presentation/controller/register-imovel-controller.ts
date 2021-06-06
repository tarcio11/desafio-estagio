import { Controller, HttpResponse, Validation } from '../protocols'

export class RegisterImovelController implements Controller {
  constructor (private readonly validation: Validation) {}

  async handle (request: RegisterImovelController.Request): Promise<HttpResponse> {
    this.validation.validate(request)
    return null
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
