import { RegisterImovel } from '../../../entities/usecases/imoveis'
import { DbRegisterImovel } from '../../../usecases/imovel/db-register-imovel'
import { ImovelMongoRepository } from '../../../external/db/mongodb/imovel/imovel-mongo-repository'

export const makeDbRegisterImovel = (): RegisterImovel => {
  const imovelMongoRepository = new ImovelMongoRepository()
  return new DbRegisterImovel(imovelMongoRepository)
}
