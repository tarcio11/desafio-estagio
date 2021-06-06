import { ImovelMongoRepository } from './imovel-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { RegisterImovelRepository } from '../../../../usecases/protocols/db/imovel'

import { Collection } from 'mongodb'
import faker from 'faker'

let imovelCollection: Collection

const mockRegisterImovelParams = (): RegisterImovelRepository.Params => ({
  userId: faker.datatype.uuid(),
  cep: faker.address.zipCode(),
  complemento: faker.address.cityPrefix(),
  numero: Number(faker.finance.amount(1, 3000, null)),
  quantidade_de_quartos: faker.datatype.number(4),
  valor_do_aluguel_em_reais: faker.finance.amount(600, 1500),
  disponivel: faker.datatype.boolean()
})

const makeSut = (): ImovelMongoRepository => {
  return new ImovelMongoRepository()
}

describe('UserMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    imovelCollection = await MongoHelper.getCollection('imoveis')
    await imovelCollection.deleteMany({})
  })

  describe('add()', () => {
    test('Deve retorna um Imóvel em caso de sucesso', async () => {
      const sut = makeSut()
      const registerImovelParams = mockRegisterImovelParams()
      const imovel = await sut.register(registerImovelParams)
      expect(imovel).toBeTruthy()
      expect(imovel.id).toBeTruthy()
      expect(imovel.userId).toBe(registerImovelParams.userId)
      expect(imovel.cep).toBe(registerImovelParams.cep)
      expect(imovel.complemento).toBe(registerImovelParams.complemento)
      expect(imovel.numero).toBe(registerImovelParams.numero)
      expect(imovel.quantidade_de_quartos).toBe(registerImovelParams.quantidade_de_quartos)
      expect(imovel.valor_do_aluguel_em_reais).toBe(registerImovelParams.valor_do_aluguel_em_reais)
      expect(imovel.disponivel).toBe(registerImovelParams.disponivel)
    })
  })
})
