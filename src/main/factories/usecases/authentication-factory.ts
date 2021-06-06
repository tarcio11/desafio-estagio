import env from '../../config/env'

import { UserMongoRepository } from '../../../external/db/mongodb/usuario'
import { Authentication } from '../../../entities/usecases'
import { BcryptAdapter, JwtAdapter } from '../../../external/cryptography'
import { DbAuthentication } from '../../../usecases/usuario'

export const makeDbAuthentication = (): Authentication => {
  const salt = 8
  const userMongoRepository = new UserMongoRepository()
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  return new DbAuthentication(userMongoRepository, bcryptAdapter, jwtAdapter, userMongoRepository)
}
