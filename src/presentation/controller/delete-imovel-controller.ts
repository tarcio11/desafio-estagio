import { DeleteImovel } from '../../entities/usecases/imoveis'
import { InvalidParamError } from '../errors'
import { forbidden } from '../helpers'
import { Controller, HttpResponse } from '../protocols'

export class DeleteImovelController implements Controller {
  constructor (private readonly deleteImovel: DeleteImovel) {}

  async handle (request: DeleteImovelController.Request): Promise<HttpResponse> {
    const { userId, imovelId } = request
    const result = await this.deleteImovel.delete(userId, imovelId)
    if (!result) {
      return forbidden(new InvalidParamError('imovelId'))
    }
    return null
  }
}

export namespace DeleteImovelController {
  export type Request = {
    userId: string
    imovelId: string
  }
}
