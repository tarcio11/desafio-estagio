/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { ObjectId } from 'mongodb'
import { RegisterImovelRepository, UpdateImovelRepository } from '../../../../usecases/protocols/db/imovel'
import { MongoHelper } from '../helpers/mongo-helper'

export class ImovelMongoRepository implements RegisterImovelRepository, UpdateImovelRepository {
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
    const imovelResult = await imovelResultCollection.findOne({ _id: data.imovelId })
    data.data.cep ? cep = data.data.cep : cep = imovelResult.cep
    data.data.numero ? numero = data.data.numero : numero = imovelResult.numero
    data.data.complemento ? complemento = data.data.complemento : complemento = imovelResult.complemento
    data.data.quantidade_de_quartos ? quantidade_de_quartos = data.data.quantidade_de_quartos : quantidade_de_quartos = imovelResult.quantidade_de_quartos
    data.data.valor_do_aluguel_em_reais ? valor_do_aluguel_em_reais = data.data.valor_do_aluguel_em_reais : valor_do_aluguel_em_reais = imovelResult.valor_do_aluguel_em_reais
    data.data.disponivel ? disponivel = data.data.disponivel : disponivel = imovelResult.disponivel
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
}
