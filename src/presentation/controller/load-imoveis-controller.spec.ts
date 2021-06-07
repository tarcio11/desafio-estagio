import { LoadImoveisController } from './load-imoveis-controller'
import { LoadImoveis } from '../../entities/usecases/imoveis'

import faker from 'faker'
import { ok } from '../helpers'

class LoadImoveisSpy implements LoadImoveis {
  response: LoadImoveis.Result = [{
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

  async load (): Promise<LoadImoveis.Result> {
    return this.response
  }
}

type SutTypes = {
  sut: LoadImoveisController
  loadImoveisSpy: LoadImoveisSpy
}

const makeSut = (): SutTypes => {
  const loadImoveisSpy = new LoadImoveisSpy()
  const sut = new LoadImoveisController(loadImoveisSpy)
  return {
    sut,
    loadImoveisSpy
  }
}

describe('LoadAccounts Controller', () => {
  test('Deve chamar LoadImoveis', async () => {
    const { sut, loadImoveisSpy } = makeSut()
    await sut.handle()
    expect(loadImoveisSpy.load).toBe(loadImoveisSpy.load)
  })

  test('Deve retornar 200 em caso de sucesso', async () => {
    const { sut, loadImoveisSpy } = makeSut()
    const httpResponse = await sut.handle()
    expect(httpResponse).toEqual(ok(loadImoveisSpy.response))
  })
})
