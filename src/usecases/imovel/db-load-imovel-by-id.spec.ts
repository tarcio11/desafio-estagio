import { DbLoadImovelById } from './db-load-imovel-by-id'
import { LoadImovelByIdRepository } from '../protocols/db/imovel'

import faker from 'faker'

class LoadImovelByIdRepositorySpy implements LoadImovelByIdRepository {
  imovelId: string
  response: LoadImovelByIdRepository.Response = {
    id: faker.datatype.uuid(),
    userId: faker.datatype.uuid(),
    cep: faker.address.zipCode(),
    complemento: faker.address.cityPrefix(),
    numero: Number(faker.finance.amount(1, 3000, null)),
    quantidade_de_quartos: faker.datatype.number(4),
    valor_do_aluguel_em_reais: faker.finance.amount(600, 1500),
    disponivel: faker.datatype.boolean()
  }

  async loadImovelById (imovelId: string): Promise<LoadImovelByIdRepository.Response> {
    this.imovelId = imovelId
    return this.response
  }
}

type SutTypes = {
  sut: DbLoadImovelById
  loadImovelByIdRepositorySpy: LoadImovelByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadImovelByIdRepositorySpy = new LoadImovelByIdRepositorySpy()
  const sut = new DbLoadImovelById(loadImovelByIdRepositorySpy)
  return {
    sut,
    loadImovelByIdRepositorySpy
  }
}

describe('DbLoadAccounts', () => {
  test('Deve chamar LoadAccountByIdRepository com o id correto', async () => {
    const { sut, loadImovelByIdRepositorySpy } = makeSut()
    const imovelId = faker.random.uuid()
    await sut.load(imovelId)
    expect(loadImovelByIdRepositorySpy.imovelId).toBe(imovelId)
  })
})
