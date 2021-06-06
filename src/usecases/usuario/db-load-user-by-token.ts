import { LoadAccountByToken } from '../../entities/usecases'
import { Decrypter } from '../protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter
  ) {}

  async load (token: string): Promise<LoadAccountByToken.Result> {
    await this.decrypter.decrypt(token)
    return null
  }
}
