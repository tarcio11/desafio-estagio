import { MongoHelper } from '../../external/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

import request from 'supertest'
import { Collection } from 'mongodb'
import { hash } from 'bcryptjs'
import { cpf } from 'cpf-cnpj-validator'

let accountCollection: Collection

describe('Login Routes', () => {
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

  test('Deve retornar 200 no login', async () => {
    const senha = await hash('123456', 12)
    await accountCollection.insertOne({
      nomeCompleto: 'Tarcio Rocha',
      cpf: Number(cpf.generate()),
      email: 'tarcio@mail.com',
      senha
    })
    await request(app)
      .post('/api/login')
      .send({
        email: 'tarcio@mail.com',
        senha: '123456'
      })
      .expect(200)
  })
})
