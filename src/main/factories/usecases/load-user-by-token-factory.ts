import env from '../../config/env'
import { LoadUserByToken } from '../../../entities/usecases'
import { JwtAdapter } from '../../../external/cryptography'
import { UserMongoRepository } from '../../../external/db/mongodb/usuario'
import { DbLoadUserByToken } from '../../../usecases/usuario'

export const makeDbLoadUserByToken = (): LoadUserByToken => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new UserMongoRepository()
  return new DbLoadUserByToken(jwtAdapter, accountMongoRepository)
}
