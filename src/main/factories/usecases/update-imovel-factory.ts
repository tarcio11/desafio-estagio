import { UpdateImovel } from '../../../entities/usecases/imoveis'
import { ImovelMongoRepository } from '../../../external/db/mongodb/imovel/imovel-mongo-repository'
import { DbUpdateImovel } from '../../../usecases/imovel/db-update-imovel'

export const makeDbUpdateImovel = (): UpdateImovel => {
  const imovelMongoRepository = new ImovelMongoRepository()
  return new DbUpdateImovel(imovelMongoRepository)
}
