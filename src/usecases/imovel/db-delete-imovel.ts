import { DeleteImovel } from '../../entities/usecases/imoveis'
import { DeleteImovelRepository } from '../protocols/db/imovel'

export class DbDeleteImovel implements DeleteImovel {
  constructor (private readonly deleteImovelRepository: DeleteImovelRepository) {}

  async delete (userId: string, imovelId: string): Promise<boolean> {
    return await this.deleteImovelRepository.delete(userId, imovelId)
  }
}
