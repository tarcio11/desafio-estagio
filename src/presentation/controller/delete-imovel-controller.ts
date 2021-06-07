import { DeleteImovel } from '../../entities/usecases/imoveis'
import { Controller, HttpResponse } from '../protocols'

export class DeleteImovelController implements Controller {
  constructor (private readonly deleteImovel: DeleteImovel) {}

  async handle (request: DeleteImovelController.Request): Promise<HttpResponse> {
    const { userId, imovelId } = request
    await this.deleteImovel.delete(userId, imovelId)
    return null
  }
}

export namespace DeleteImovelController {
  export type Request = {
    userId: string
    imovelId: string
  }
}
