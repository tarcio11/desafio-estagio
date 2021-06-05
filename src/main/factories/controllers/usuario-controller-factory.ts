import { makeUsuarioValidation } from './usuario-validation-factory'
import { UsuarioController } from '../../../presentation/controller'
import { Controller } from '../../../presentation/protocols'
import { DbAddUser } from '../../../usecases/usuario'
import { BcryptAdapter } from '../../../external/cryptography'
import { UserMongoRepository } from '../../../external/db/mongodb/usuario'

export const makeUsuarioController = (): Controller => {
  const salt = 8
  const bcryptAdapter = new BcryptAdapter(salt)
  const userMongoRepository = new UserMongoRepository()
  const dbAddUser = new DbAddUser(bcryptAdapter, userMongoRepository, userMongoRepository)
  return new UsuarioController(makeUsuarioValidation(), dbAddUser)
}
