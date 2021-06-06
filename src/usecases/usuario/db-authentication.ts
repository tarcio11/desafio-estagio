import { Authentication } from '../../entities/usecases'
import { HashComparer, LoadAccountByEmailRepository } from '../protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer
  ) {}

  async auth (authenticationParams: Authentication.Params): Promise<Authentication.Result> {
    const user = await this.loadAccountByEmailRepository.loadByEmail(authenticationParams.email)
    if (user) {
      await this.hashComparer.compare(authenticationParams.senha, user.senha)
    }
    return null
  }
}
