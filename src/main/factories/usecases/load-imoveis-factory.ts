import { LoadImoveis } from '../../../entities/usecases/imoveis'
import { ImovelMongoRepository } from '../../../external/db/mongodb/imovel/imovel-mongo-repository'
import { DbLoadImoveis } from '../../../usecases/imovel/db-load-imoveis'

export const makeDbLoadImoveis = (): LoadImoveis => {
  const imovelMongoRepository = new ImovelMongoRepository()
  return new DbLoadImoveis(imovelMongoRepository)
}
