import { Usuario } from '../../entities/usecases'
import { Hasher } from '../protocols'
import { AddUserRepository } from '../protocols/db'

export class DbAddUser implements Usuario {
  constructor (
    private readonly hasher: Hasher,
    private readonly addUserRepository: AddUserRepository
  ) {}

  async add (user: Usuario.Params): Promise<Usuario.Response> {
    const hashedSenha = await this.hasher.hash(user.senha)
    console.log(hashedSenha)
    await this.addUserRepository.add({ ...user, senha: hashedSenha })
    return null
  }
}
