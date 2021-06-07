import { LoadImoveis } from '../../entities/usecases/imoveis'
import { LoadImoveisRepository } from '../protocols/db/imovel'

export class DbLoadImoveis implements LoadImoveis {
  constructor (private readonly loadImoveisRepository: LoadImoveisRepository) {}

  async load (): Promise<LoadImoveis.Result> {
    await this.loadImoveisRepository.loadAll()
    return null
  }
}
