import { UpdateImovel } from '../../entities/usecases/imoveis'
import { InvalidParamError } from '../errors'
import { forbidden, serverError } from '../helpers'
import { Controller, HttpResponse } from '../protocols'

export class UpdateImovelController implements Controller {
  constructor (private readonly updateImove: UpdateImovel) {}

  async handle (request: UpdateImovelController.Request): Promise<HttpResponse> {
    try {
      const imovelModel = await this.updateImove.update(request)
      if (!imovelModel) {
        return forbidden(new InvalidParamError('imovelId'))
      }
      return null
    } catch (error) {
      return serverError()
    }
  }
}

export namespace UpdateImovelController {
  export type Request = {
    userId: string
    imovelId: string
    data: any
  }
}
