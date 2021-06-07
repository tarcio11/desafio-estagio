import { MongoHelper } from '../../external/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import env from '../config/env'

import request from 'supertest'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'

let imovelCollection: Collection
let accountCollection: Collection

const mockAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    nome: 'Tarcio',
    cfp: 11438374798,
    email: 'tarcio.mail@gmail.com',
    senha: '123456'
  })
  const id = res.ops[0]._id
  const tokenDeAcesso = sign({ id }, env.jwtSecret)
  await accountCollection.updateOne({
    _id: id
  }, {
    $set: {
      tokenDeAcesso
    }
  })
  return tokenDeAcesso
}

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
    imovelCollection = await MongoHelper.getCollection('imoveis')
    await imovelCollection.deleteMany({})
  })

  describe('POST()', () => {
    test('Deve retornar 200 no Imovel', async () => {
      const accessToken = await mockAccessToken()
      await request(app)
        .post('/api/imoveis')
        .set('x-token-acesso', accessToken)
        .send({
          cep: '68500-000',
          numero: 1010,
          complemento: 'Casa',
          valor_do_aluguel_em_reais: '1300,00 R$',
          quantidade_de_quartos: 4,
          disponivel: false
        })
        .expect(200)
    })
  })
})
