import faker from 'faker'
import { LoadImoveisRepository } from '../protocols/db/imovel'
import { DbLoadImoveis } from './db-load-imoveis'

class LoadImoveisRepositorySpy implements LoadImoveisRepository {
  response: LoadImoveisRepository.Response = [{
    id: faker.datatype.uuid(),
    userId: faker.datatype.uuid(),
    cep: faker.address.zipCode(),
    complemento: faker.address.cityPrefix(),
    numero: Number(faker.finance.amount(1, 3000, null)),
    quantidade_de_quartos: faker.datatype.number(4),
    valor_do_aluguel_em_reais: faker.finance.amount(600, 1500),
    disponivel: faker.datatype.boolean()
  }, {
    id: faker.datatype.uuid(),
    userId: faker.datatype.uuid(),
    cep: faker.address.zipCode(),
    complemento: faker.address.cityPrefix(),
    numero: Number(faker.finance.amount(1, 3000, null)),
    quantidade_de_quartos: faker.datatype.number(4),
    valor_do_aluguel_em_reais: faker.finance.amount(600, 1500),
    disponivel: faker.datatype.boolean()
  }]

  async loadAll (): Promise<LoadImoveisRepository.Response> {
    return this.response
  }
}

type SutTypes = {
  sut: DbLoadImoveis
  loadImoveisRepositorySpy: LoadImoveisRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadImoveisRepositorySpy = new LoadImoveisRepositorySpy()
  const sut = new DbLoadImoveis(loadImoveisRepositorySpy)
  return {
    sut,
    loadImoveisRepositorySpy
  }
}

describe('DbLoadAccounts', () => {
  test('Deve chamar LoadImoveisRepository', async () => {
    const { sut } = makeSut()
    expect(await sut.load()).toBe(await sut.load())
  })

  test('Deve retornar uma lista de imoveis em caso de sucesso', async () => {
    const { sut, loadImoveisRepositorySpy } = makeSut()
    const imoveis = await sut.load()
    expect(imoveis).toEqual(loadImoveisRepositorySpy.response)
  })

  test('Deve retornar nulo se LoadImoveisRepository retornar nulo', async () => {
    const { sut, loadImoveisRepositorySpy } = makeSut()
    loadImoveisRepositorySpy.response = null
    const model = await sut.load()
    expect(model).toBeNull()
  })
})
