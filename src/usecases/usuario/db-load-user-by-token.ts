import { LoadUserByToken } from '../../entities/usecases'
import { Decrypter, LoadUserByTokenRepository } from '../protocols'

export class DbLoadUserByToken implements LoadUserByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadUserByTokenRepository: LoadUserByTokenRepository
  ) {}

  async load (token: string): Promise<LoadUserByToken.Result> {
    const tokenDeAcesso = await this.decrypter.decrypt(token)
    if (tokenDeAcesso) {
      const user = await this.loadUserByTokenRepository.loadByToken(token)
      if (user) {
        return user
      }
    }
    return null
  }
}
