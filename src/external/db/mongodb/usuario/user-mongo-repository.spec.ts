import { UserMongoRepository } from './user-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { Usuario } from '../../../../entities/usecases'

import { Collection } from 'mongodb'
import faker from 'faker'
import { cpf } from 'cpf-cnpj-validator'

let accountCollection: Collection

const mockAddAccountParams = (): Usuario.Params => ({
  nomeCompleto: faker.name.findName(),
  cpf: Number(cpf.generate()),
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

  describe('add()', () => {
    test('Deve retorna um Usuario em caso de sucesso', async () => {
      const sut = makeSut()
      const isValid = await sut.add(mockAddAccountParams())
      expect(isValid).toBe(true)
    })
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

  describe('loadByEmail()', () => {
    test('Deve retornar um usuario em caso de sucesso', async () => {
      const sut = makeSut()
      const addAccountParams = mockAddAccountParams()
      await accountCollection.insertOne(addAccountParams)
      const account = await sut.loadByEmail(addAccountParams.email)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.nomeCompleto).toBe(addAccountParams.nomeCompleto)
      expect(account.cpf).toBe(addAccountParams.cpf)
      expect(account.senha).toBe(addAccountParams.senha)
    })

    test('Deve retornar nulo se loadByEmail falhar', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail(faker.internet.email())
      expect(account).toBeFalsy()
    })
  })

  describe('updateAccessToken()', () => {
    test('Deve atualizar a conta tokenDeAcesso em caso de sucesso', async () => {
      const sut = makeSut()
      const addAccountParams = mockAddAccountParams()
      const res = await accountCollection.insertOne(addAccountParams)
      const fakeAccount = res.ops[0]
      expect(fakeAccount.accessToken).toBeFalsy()
      const tokenDeAcesso = faker.datatype.uuid()
      await sut.updateAccessToken(fakeAccount._id, tokenDeAcesso)
      const account = await accountCollection.findOne({ _id: fakeAccount._id })
      expect(account).toBeTruthy()
      expect(account.tokenDeAcesso).toBe(tokenDeAcesso)
    })
  })

  describe('loadByToken()', () => {
    test('Deve retornar um usuario em caso de sucesso', async () => {
      const sut = makeSut()
      const addAccountParams = mockAddAccountParams()
      const res = await accountCollection.insertOne(addAccountParams)
      const fakeAccount = res.ops[0]
      const account = await sut.loadByToken(fakeAccount.tokenDeAcesso)
      expect(account.id).toBeTruthy()
    })
  })
})
