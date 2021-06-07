import { UpdateImovel } from '../../entities/usecases/imoveis'
import { UpdateImovelRepository } from '../protocols/db/imovel'

export class DbUpdateImovel implements UpdateImovel {
  constructor (private readonly updateImovelRepository: UpdateImovelRepository) {}

  async update (params: UpdateImovel.Params): Promise<UpdateImovel.Response> {
    await this.updateImovelRepository.update(params)
    return null
  }
}
