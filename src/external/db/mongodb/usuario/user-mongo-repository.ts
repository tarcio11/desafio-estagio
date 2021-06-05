import { CheckUserByEmailRepository, AddUserRepository } from '../../../../usecases/protocols'
import { MongoHelper } from '../helpers/mongo-helper'

export class UserMongoRepository implements CheckUserByEmailRepository, AddUserRepository {
  async add (data: AddUserRepository.Params): Promise<AddUserRepository.Response> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = accountCollection.insertOne(data)
    return (await result).ops[0] !== null
  }

  async checkByEmail (email: string): Promise<boolean> {
    const accountCollection = await MongoHelper.getCollection('users')
    const account = await accountCollection.findOne({
      email
    }, {
      projection: {
        _id: 1
      }
    })
    return account
  }
}
