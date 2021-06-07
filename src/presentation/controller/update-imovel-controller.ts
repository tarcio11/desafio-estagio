import { UpdateImovel } from '../../entities/usecases/imoveis'
import { Controller, HttpResponse } from '../protocols'

export class UpdateImovelController implements Controller {
  constructor (private readonly updateImove: UpdateImovel) {}

  async handle (request: UpdateImovelController.Request): Promise<HttpResponse> {
    await this.updateImove.update(request)
    return null
  }
}

export namespace UpdateImovelController {
  export type Request = {
    userId: string
    imovelId: string
    data: any
  }
}
