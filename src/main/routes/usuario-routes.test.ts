import { Collection } from 'mongodb'
import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../external/db/mongodb/helpers/mongo-helper'

import { cpf } from 'cpf-cnpj-validator'
const FakeCPF = cpf.generate()
let accountCollection: Collection

describe('SingUp Routes', () => {
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

  test('Deve retornar uma conta em caso de sucesso', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        nomeCompleto: 'Tarcio Rocha',
        cpf: Number(FakeCPF),
        email: 'tarcio@mail.com',
        senha: '123456'
      })
      .expect(200)
  })
})
