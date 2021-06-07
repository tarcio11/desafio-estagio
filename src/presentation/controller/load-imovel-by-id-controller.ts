import { Controller, HttpResponse } from '../protocols'
import { LoadImovelById } from '../../entities/usecases/imoveis'

export class LoadImovelByIdController implements Controller {
  constructor (private readonly loadImovelById: LoadImovelById) {}

  async handle (request: LoadImovelByIdController.Request): Promise<HttpResponse> {
    const { imovelId } = request
    await this.loadImovelById.load(imovelId)
    return null
  }
}

export namespace LoadImovelByIdController {
  export type Request = {
    imovelId: string
  }
}
