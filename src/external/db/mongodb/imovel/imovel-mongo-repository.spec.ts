import { ImovelMongoRepository } from './imovel-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { RegisterImovelRepository } from '../../../../usecases/protocols/db/imovel'
import { Usuario } from '../../../../entities/usecases/usuario'

import { Collection, ObjectId } from 'mongodb'
import faker from 'faker'

let imovelCollection: Collection
let accountCollection: Collection

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

const mockAddAccountParams = (): Usuario.Params => ({
  nomeCompleto: faker.name.findName(),
  cpf: 11438374798,
  email: faker.internet.email(),
  senha: faker.internet.password()
})

const mockAccountId = async (): Promise<string> => {
  const res = await accountCollection.insertOne(mockAddAccountParams())
  return res.ops[0]._id
}

describe('UserMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('users')
    await accountCollection.deleteMany({})
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

  describe('update()', () => {
    test('Deve atualizar todos os dados fornecidos em caso de sucesso', async () => {
      const userId = await mockAccountId()
      const result = await imovelCollection.insertOne({
        userId: new ObjectId(userId),
        cep: faker.address.zipCode(),
        complemento: faker.address.cityPrefix(),
        numero: Number(faker.finance.amount(1, 3000, null)),
        quantidade_de_quartos: faker.datatype.number(4),
        valor_do_aluguel_em_reais: faker.finance.amount(600, 1500),
        disponivel: faker.datatype.boolean()
      })
      const sut = makeSut()
      await sut.update({
        imovelId: result.ops[0]._id,
        userId,
        data: {
          cep: '151515',
          numero: 1515
        }
      })
      const imovelResult = await imovelCollection.findOne({
        _id: result.ops[0]._id,
        userId
      })
      expect(imovelResult).toBeTruthy()
    })
  })
})
