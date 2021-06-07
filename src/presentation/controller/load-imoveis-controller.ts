import { LoadImoveis } from '../../entities/usecases/imoveis'
import { noContent, ok, serverError } from '../helpers'
import { Controller, HttpResponse } from '../protocols'

export class LoadImoveisController implements Controller {
  constructor (private readonly loadImoveis: LoadImoveis) {}

  async handle (): Promise<HttpResponse> {
    try {
      const imoveisModel = await this.loadImoveis.load()
      return imoveisModel.length ? ok(imoveisModel) : noContent()
    } catch (error) {
      return serverError()
    }
  }
}
