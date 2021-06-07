import { LoadImoveis } from '../../entities/usecases/imoveis'
import { Controller, HttpResponse } from '../protocols'

export class LoadImoveisController implements Controller {
  constructor (private readonly loadImoveis: LoadImoveis) {}

  async handle (): Promise<HttpResponse> {
    return null
  }
}
