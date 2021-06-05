import { CheckUserByEmailRepository } from '../../../../usecases/protocols/'
import { MongoHelper } from '../helpers/mongo-helper'

export class UserMongoRepository implements CheckUserByEmailRepository {
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
