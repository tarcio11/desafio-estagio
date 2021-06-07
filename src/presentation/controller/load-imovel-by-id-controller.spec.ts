import { LoadImovelByIdController } from './load-imovel-by-id-controller'
import { LoadImovelById } from '../../entities/usecases/imoveis'
import { unauthorized } from '../helpers'

import faker from 'faker'

const mockRequest = (): LoadImovelByIdController.Request => ({
  imovelId: faker.random.uuid()
})

class LoadImovelByIdSpy implements LoadImovelById {
  imovelId: string
  response: LoadImovelById.Result = {
    id: faker.datatype.uuid(),
    userId: faker.datatype.uuid(),
    cep: faker.address.zipCode(),
    complemento: faker.address.cityPrefix(),
    numero: Number(faker.finance.amount(1, 3000, null)),
    quantidade_de_quartos: faker.datatype.number(4),
    valor_do_aluguel_em_reais: faker.finance.amount(600, 1500),
    disponivel: faker.datatype.boolean()
  }

  async load (imovelId: string): Promise<LoadImovelById.Result> {
    this.imovelId = imovelId
    return this.response
  }
}

type SutTypes = {
  sut: LoadImovelByIdController
  loadImovelByIdSpy: LoadImovelByIdSpy
}

const makeSut = (): SutTypes => {
  const loadImovelByIdSpy = new LoadImovelByIdSpy()
  const sut = new LoadImovelByIdController(loadImovelByIdSpy)
  return {
    sut,
    loadImovelByIdSpy
  }
}

describe('LoadImovels Controller', () => {
  test('Deve chamar LoadImovelById com o id correto', async () => {
    const { sut, loadImovelByIdSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(loadImovelByIdSpy.imovelId).toBe(request.imovelId)
  })

  test('Deve retornar 403 se LoadImovelById retornar nulo', async () => {
    const { sut, loadImovelByIdSpy } = makeSut()
    loadImovelByIdSpy.response = null
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(unauthorized())
  })
})
