import { MongoHelper } from '../../external/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import env from '../config/env'

import request from 'supertest'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'

let imovelCollection: Collection
let accountCollection: Collection

type Response = {
  id: string
  tokenDeAcesso: string
}

const mockAccessToken = async (): Promise<Response> => {
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
  return {
    id,
    tokenDeAcesso
  }
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
      const { tokenDeAcesso } = await mockAccessToken()
      await request(app)
        .post('/api/imoveis')
        .set('x-token-acesso', tokenDeAcesso)
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

  describe('PUT()', () => {
    test('Deve retornar 200 em caso de atualização bem sucedida', async () => {
      const { tokenDeAcesso, id } = await mockAccessToken()
      const res = await imovelCollection.insertOne({
        userId: id,
        cep: '68500-000',
        complemento: 'casa',
        numero: 1818,
        quantidade_de_quartos: 4,
        valor_do_aluguel_em_reais: '1500,00 R$',
        disponivel: false
      })
      console.log(res.ops[0])
      await request(app)
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        .put(`/api/imoveis/${res.ops[0]._id}`)
        .set('x-token-acesso', tokenDeAcesso)
        .send({
          cep: '68500-000',
          numero: 1010,
          complemento: 'Casa',
          valor_do_aluguel_em_reais: '1300,00 R$',
          quantidade_de_quartos: 4,
          disponivel: true
        })
        .expect(200)
    })
  })

  describe('GET /imoveis', () => {
    test('Deve retornar 403 em caso de ausência de tokenDeAcesso', async () => {
      await request(app)
        .get('/api/imoveis')
        .expect(403)
    })
  })
})
