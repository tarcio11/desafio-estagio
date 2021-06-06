import { Usuario } from '../../entities/usecases/usuario'
import { Hasher } from '../protocols'
import { AddUserRepository, CheckUserByEmailRepository } from '../protocols/db'

export class DbAddUser implements Usuario {
  constructor (
    private readonly hasher: Hasher,
    private readonly addUserRepository: AddUserRepository,
    private readonly checkUserByEmailRepository: CheckUserByEmailRepository
  ) {}

  async add (user: Usuario.Params): Promise<Usuario.Response> {
    const exist = await this.checkUserByEmailRepository.checkByEmail(user.email)
    let isValid = false
    if (!exist) {
      const hashedSenha = await this.hasher.hash(user.senha)
      isValid = await this.addUserRepository.add({ ...user, senha: hashedSenha })
    }
    return isValid
  }
}
