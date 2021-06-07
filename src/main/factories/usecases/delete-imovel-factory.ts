import { DeleteImovel } from '../../../entities/usecases/imoveis'
import { ImovelMongoRepository } from '../../../external/db/mongodb/imovel/imovel-mongo-repository'
import { DbDeleteImovel } from '../../../usecases/imovel/db-delete-imovel'

export const makeDbDeleteImovel = (): DeleteImovel => {
  const imovelMongoRepository = new ImovelMongoRepository()
  return new DbDeleteImovel(imovelMongoRepository)
}
