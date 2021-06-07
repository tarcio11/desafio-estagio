/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { ObjectId } from 'mongodb'
import { RegisterImovelRepository, UpdateImovelRepository, LoadImoveisRepository, LoadImovelByIdRepository, DeleteImovelRepository } from '../../../../usecases/protocols/db/imovel'
import { MongoHelper } from '../helpers/mongo-helper'

export class ImovelMongoRepository implements RegisterImovelRepository, UpdateImovelRepository, LoadImoveisRepository, LoadImovelByIdRepository, DeleteImovelRepository {
  async register (data: RegisterImovelRepository.Params): Promise<RegisterImovelRepository.Response> {
    const imovelCollection = await MongoHelper.getCollection('imoveis')
    const result = await imovelCollection.insertOne(data)
    const imovel = result.ops[0]
    return imovel && MongoHelper.map(imovel)
  }

  async update (data: UpdateImovelRepository.Params): Promise<UpdateImovelRepository.Response> {
    let cep
    let numero
    let complemento
    let valor_do_aluguel_em_reais
    let quantidade_de_quartos
    let disponivel

    const imovelResultCollection = await MongoHelper.getCollection('imoveis')
    const imovelResult = await imovelResultCollection.findOne({ _id: new ObjectId(data.imovelId) })
    data.cep ? cep = data.cep : cep = imovelResult.cep
    data.numero ? numero = data.numero : numero = imovelResult.numero
    data.complemento ? complemento = data.complemento : complemento = imovelResult.complemento
    data.quantidade_de_quartos ? quantidade_de_quartos = data.quantidade_de_quartos : quantidade_de_quartos = imovelResult.quantidade_de_quartos
    data.valor_do_aluguel_em_reais ? valor_do_aluguel_em_reais = data.valor_do_aluguel_em_reais : valor_do_aluguel_em_reais = imovelResult.valor_do_aluguel_em_reais
    data.disponivel ? disponivel = data.disponivel : disponivel = imovelResult.disponivel
    const result = await imovelResultCollection.findOneAndUpdate({
      _id: new ObjectId(data.imovelId),
      userId: new ObjectId(data.userId)
    }, {
      $set: {
        cep,
        numero,
        complemento,
        quantidade_de_quartos,
        valor_do_aluguel_em_reais,
        disponivel
      }
    }, { upsert: true })
    return result.value
  }

  async loadAll (): Promise<LoadImoveisRepository.Response> {
    const imovelCollection = await MongoHelper.getCollection('imoveis')
    const imoveis = await imovelCollection.find().toArray()
    return imoveis
  }

  async loadImovelById (imovelId): Promise<LoadImovelByIdRepository.Response> {
    const imovelCollection = await MongoHelper.getCollection('imoveis')
    const imovel = await imovelCollection.findOne({ _id: new ObjectId(imovelId) })
    return imovel && MongoHelper.map(imovel)
  }

  async delete (userId: string, imovelId: string): Promise<boolean> {
    const imovelCollection = await MongoHelper.getCollection('imoveis')
    const result = await imovelCollection.findOneAndDelete({
      _id: new ObjectId(imovelId),
      userId: new ObjectId(userId)
    })
    return result !== null
  }
}
