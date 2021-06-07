import { DbUpdateImovel } from './db-update-imovel'
import { UpdateImovelRepository } from '../protocols/db/imovel'

import faker from 'faker'

const mockUpdateImovelParams = (): UpdateImovelRepository.Params => ({
  userId: faker.datatype.uuid(),
  imovelId: faker.datatype.uuid(),
  data: { cep: 2626266, complemento: 5555, numero: 1816 }
})

class UpdateImovelRepositorySpy implements UpdateImovelRepository {
  params: UpdateImovelRepository.Params
  response: UpdateImovelRepository.Response = {
    id: faker.datatype.uuid(),
    userId: faker.datatype.uuid(),
    cep: faker.address.zipCode(),
    complemento: faker.address.cityPrefix(),
    numero: Number(faker.finance.amount(1, 3000, null)),
    quantidade_de_quartos: faker.datatype.number(4),
    valor_do_aluguel_em_reais: faker.finance.amount(600, 1500),
    disponivel: faker.datatype.boolean()
  }

  async update (params: UpdateImovelRepository.Params): Promise<UpdateImovelRepository.Response> {
    this.params = params
    return this.response
  }
}

type SutTypes = {
  sut: DbUpdateImovel
  updateImovelRepositorySpy: UpdateImovelRepositorySpy
}

const makeSut = (): SutTypes => {
  const updateImovelRepositorySpy = new UpdateImovelRepositorySpy()
  const sut = new DbUpdateImovel(updateImovelRepositorySpy)
  return {
    sut,
    updateImovelRepositorySpy
  }
}

describe('DbSaveSurveyResult Usecase', () => {
  test('Deve chamar UpdateImovelRepository com os valores corretos', async () => {
    const { sut, updateImovelRepositorySpy } = makeSut()
    const surveyResultData = mockUpdateImovelParams()
    await sut.update(surveyResultData)
    expect(updateImovelRepositorySpy.params).toEqual(surveyResultData)
  })
})
