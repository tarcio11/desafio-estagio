import { UserMongoRepository } from './user-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { Usuario } from '../../../../entities/usecases'

import { Collection } from 'mongodb'
import faker from 'faker'

let accountCollection: Collection

const mockAddAccountParams = (): Usuario.Params => ({
  nomeCompleto: faker.name.findName(),
  cpf: faker.random.number(11),
  email: faker.internet.email(),
  senha: faker.internet.password()
})

const makeSut = (): UserMongoRepository => {
  return new UserMongoRepository()
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
  })

  describe('checkByEmail()', () => {
    test('Deve retorna verdadeiro se email for valido', async () => {
      const sut = makeSut()
      const addAccountParams = mockAddAccountParams()
      await accountCollection.insertOne(addAccountParams)
      const exist = await sut.checkByEmail(addAccountParams.email)
      expect(exist).toBeTruthy()
    })
  })
})
