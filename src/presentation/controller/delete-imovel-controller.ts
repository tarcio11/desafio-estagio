import { DeleteImovel } from '../../entities/usecases/imoveis'
import { InvalidParamError } from '../errors'
import { forbidden, ok, serverError } from '../helpers'
import { Controller, HttpResponse } from '../protocols'

export class DeleteImovelController implements Controller {
  constructor (private readonly deleteImovel: DeleteImovel) {}

  async handle (request: DeleteImovelController.Request): Promise<HttpResponse> {
    try {
      const { userId, imovelId } = request
      const result = await this.deleteImovel.delete(userId, imovelId)
      if (!result) {
        return forbidden(new InvalidParamError('imovelId'))
      }
      return ok(result)
    } catch (error) {
      return serverError()
    }
  }
}

export namespace DeleteImovelController {
  export type Request = {
    userId: string
    imovelId: string
  }
}
