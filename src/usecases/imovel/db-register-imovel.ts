import { RegisterImovel } from '../../entities/usecases/imoveis'
import { RegisterImovelRepository } from '../protocols/db/imovel'

export class DbRegisterImovel implements RegisterImovel {
  constructor (private readonly registerImovelRepository: RegisterImovelRepository) {}

  async register (imovel: RegisterImovel.Params): Promise<RegisterImovel.Response> {
    await this.registerImovelRepository.register(imovel)
    return null
  }
}
