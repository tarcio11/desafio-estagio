import { Authentication } from '../../entities/usecases'
import { Encrypter, HashComparer, LoadAccountByEmailRepository } from '../protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter
  ) {}

  async auth (authenticationParams: Authentication.Params): Promise<Authentication.Result> {
    const user = await this.loadAccountByEmailRepository.loadByEmail(authenticationParams.email)
    if (user) {
      const isValid = await this.hashComparer.compare(authenticationParams.senha, user.senha)
      if (isValid) {
        const tokenDeAcesso = await this.encrypter.encrypt(user.id)
        return {
          tokenDeAcesso,
          nome: user.nome
        }
      }
    }
    return null
  }
}
