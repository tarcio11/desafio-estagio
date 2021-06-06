import { Usuario } from '../../../entities/usecases'
import { BcryptAdapter } from '../../../external/cryptography'
import { UserMongoRepository } from '../../../external/db/mongodb/usuario'
import { DbAddUser } from '../../../usecases/usuario'

const salt = 8
export const makeDbUsuario = (): Usuario => {
  const bcryptAdapter = new BcryptAdapter(salt)
  const userMongoRepository = new UserMongoRepository()
  return new DbAddUser(bcryptAdapter, userMongoRepository, userMongoRepository)
}
