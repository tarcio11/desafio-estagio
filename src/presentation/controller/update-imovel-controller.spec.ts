import { UpdateImovelController } from './update-imovel-controller'
import { UpdateImovel } from '../../entities/usecases/imoveis'
import { forbidden, ok, serverError } from '../helpers'
import { InvalidParamError } from '../errors'

import faker from 'faker'

export class UpdateImovelSpy implements UpdateImovel {
  params: UpdateImovel.Params
  response: UpdateImovel.Response = {
    id: faker.datatype.uuid(),
    userId: faker.datatype.uuid(),
    cep: faker.address.zipCode(),
    complemento: faker.address.cityPrefix(),
    numero: Number(faker.finance.amount(1, 3000, null)),
    quantidade_de_quartos: faker.datatype.number(4),
    valor_do_aluguel_em_reais: faker.finance.amount(600, 1500),
    disponivel: faker.datatype.boolean()
  }

  async update (params: UpdateImovel.Params): Promise<UpdateImovel.Response> {
    this.params = params
    return this.response
  }
}

const mockUpdateImovelParams = (): UpdateImovelController.Request => ({
  imovelId: faker.datatype.uuid(),
  userId: faker.datatype.uuid(),
  data: {
    cep: faker.address.zipCode(),
    complemento: faker.address.cityPrefix(),
    numero: Number(faker.finance.amount(1, 3000, null))
  }
})

type SutTypes = {
  sut: UpdateImovelController
  updateImovelSpy: UpdateImovelSpy
}

const makeSut = (): SutTypes => {
  const updateImovelSpy = new UpdateImovelSpy()
  const sut = new UpdateImovelController(updateImovelSpy)
  return {
    sut,
    updateImovelSpy
  }
}

describe('RegisterImovel Controller', () => {
  test('Deve chamar UpdateImovel com os valores corretos', async () => {
    const { sut, updateImovelSpy } = makeSut()
    const updateImovelParams = mockUpdateImovelParams()
    await sut.handle(updateImovelParams)
    expect(updateImovelSpy.params).toEqual(updateImovelParams)
  })

  test('Deve retornar 403 se UpdateImovel retornar nulo', async () => {
    const { sut, updateImovelSpy } = makeSut()
    updateImovelSpy.response = null
    const httpResponse = await sut.handle(mockUpdateImovelParams())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('imovelId')))
  })

  test('Deve retornar erro 500 se UpdateImovel arremessar um erro', async () => {
    const { sut, updateImovelSpy } = makeSut()
    jest.spyOn(updateImovelSpy, 'update').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(mockUpdateImovelParams())
    expect(httpResponse).toEqual(serverError())
  })

  test('Deve retornar 200 com os dados da atualização em caso de sucesso', async () => {
    const { sut, updateImovelSpy } = makeSut()
    const httpResponse = await sut.handle(mockUpdateImovelParams())
    expect(httpResponse).toEqual(ok(updateImovelSpy.response))
  })
})
