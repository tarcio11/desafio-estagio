import { Authentication } from '../../entities/usecases'
import { Encrypter, HashComparer, LoadAccountByEmailRepository, UpdateAccessTokenRepository } from '../protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (authenticationParams: Authentication.Params): Promise<Authentication.Result> {
    const user = await this.loadAccountByEmailRepository.loadByEmail(authenticationParams.email)
    if (user) {
      const isValid = await this.hashComparer.compare(authenticationParams.senha, user.senha)
      if (isValid) {
        const tokenDeAcesso = await this.encrypter.encrypt(user.id)
        await this.updateAccessTokenRepository.updateAccessToken(user.id, tokenDeAcesso)
        return {
          tokenDeAcesso,
          nomeCompleto: user.nomeCompleto
        }
      }
    }
    return null
  }
}
