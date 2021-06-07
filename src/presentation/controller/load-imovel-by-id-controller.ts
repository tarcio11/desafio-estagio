import { Controller, HttpResponse } from '../protocols'
import { LoadImovelById } from '../../entities/usecases/imoveis'
import { unauthorized } from '../helpers'

export class LoadImovelByIdController implements Controller {
  constructor (private readonly loadImovelById: LoadImovelById) {}

  async handle (request: LoadImovelByIdController.Request): Promise<HttpResponse> {
    const { imovelId } = request
    const imovelModel = await this.loadImovelById.load(imovelId)
    if (!imovelModel) {
      return unauthorized()
    }
    return null
  }
}

export namespace LoadImovelByIdController {
  export type Request = {
    imovelId: string
  }
}
