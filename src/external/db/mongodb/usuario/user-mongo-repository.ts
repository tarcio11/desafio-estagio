import { CheckUserByEmailRepository, AddUserRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadUserByTokenRepository } from '../../../../usecases/protocols'
import { MongoHelper } from '../helpers/mongo-helper'

export class UserMongoRepository implements CheckUserByEmailRepository, AddUserRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadUserByTokenRepository {
  async add (data: AddUserRepository.Params): Promise<AddUserRepository.Response> {
    const accountCollection = await MongoHelper.getCollection('users')
    const result = await accountCollection.insertOne(data)
    return result.ops[0] !== null
  }

  async checkByEmail (email: string): Promise<boolean> {
    const accountCollection = await MongoHelper.getCollection('users')
    const user = await accountCollection.findOne({
      email
    }, {
      projection: {
        _id: 1
      }
    })
    return user
  }

  async loadByEmail (email: string): Promise<LoadAccountByEmailRepository.Response> {
    const accountCollection = await MongoHelper.getCollection('users')
    const user = await accountCollection.findOne({
      email
    }, {
      projection: {
        _id: 1,
        nomeCompleto: 1,
        cpf: 1,
        senha: 1
      }
    })
    return user && MongoHelper.map(user)
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('users')
    await accountCollection.updateOne({
      _id: id
    }, {
      $set: {
        tokenDeAcesso: token
      }
    })
  }

  async loadByToken (tokenDeAcesso: string): Promise<LoadUserByTokenRepository.Response> {
    const accountCollection = await MongoHelper.getCollection('users')
    const user = await accountCollection.findOne({
      tokenDeAcesso
    }, {
      projection: {
        _id: 1
      }
    })
    return user && MongoHelper.map(user)
  }
}
