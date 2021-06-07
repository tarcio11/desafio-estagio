import { LoadImovelById } from '../../../entities/usecases/imoveis'
import { ImovelMongoRepository } from '../../../external/db/mongodb/imovel/imovel-mongo-repository'
import { DbLoadImovelById } from '../../../usecases/imovel/db-load-imovel-by-id'

export const makeDbLoadImovelById = (): LoadImovelById => {
  const imovelMongoRepository = new ImovelMongoRepository()
  return new DbLoadImovelById(imovelMongoRepository)
}
