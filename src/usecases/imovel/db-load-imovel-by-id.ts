import { LoadImovelById } from '../../entities/usecases/imoveis'
import { LoadImovelByIdRepository } from '../protocols/db/imovel'

export class DbLoadImovelById implements LoadImovelById {
  constructor (private readonly loadImovelByIdRepository: LoadImovelByIdRepository) {}

  async load (imovelId: string): Promise<LoadImovelById.Result> {
    await this.loadImovelByIdRepository.loadImovelById(imovelId)
    return null
  }
}
