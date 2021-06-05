import { Usuario } from '../../entities/usecases'
import { Hasher } from '../protocols'

export class DbAddUser implements Usuario {
  constructor (private readonly hasher: Hasher) {}

  async add (user: Usuario.Params): Promise<Usuario.Response> {
    await this.hasher.hash(user.senha)
    return null
  }
}
