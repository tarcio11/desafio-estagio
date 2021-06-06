import { RegisterImovelRepository } from '../../../../usecases/protocols/db/imovel'
import { MongoHelper } from '../helpers/mongo-helper'

export class ImovelMongoRepository implements RegisterImovelRepository {
  async register (data: RegisterImovelRepository.Params): Promise<RegisterImovelRepository.Response> {
    const imovelCollection = await MongoHelper.getCollection('imoveis')
    const result = await imovelCollection.insertOne(data)
    const imovel = result.ops[0]
    return imovel && MongoHelper.map(imovel)
  }
}
