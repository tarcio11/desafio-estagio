import { LoadImoveis } from '../../entities/usecases/imoveis'
import { ok } from '../helpers'
import { Controller, HttpResponse } from '../protocols'

export class LoadImoveisController implements Controller {
  constructor (private readonly loadImoveis: LoadImoveis) {}

  async handle (): Promise<HttpResponse> {
    const imoveisModel = await this.loadImoveis.load()
    return ok(imoveisModel)
  }
}
