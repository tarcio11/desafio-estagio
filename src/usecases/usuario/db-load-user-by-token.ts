import { LoadAccountByToken } from '../../entities/usecases'
import { Decrypter, LoadUserByTokenRepository } from '../protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadUserByTokenRepository: LoadUserByTokenRepository
  ) {}

  async load (token: string): Promise<LoadAccountByToken.Result> {
    const tokenDeAcesso = await this.decrypter.decrypt(token)
    if (tokenDeAcesso) {
      await this.loadUserByTokenRepository.loadByToken(token)
    }
    return null
  }
}
