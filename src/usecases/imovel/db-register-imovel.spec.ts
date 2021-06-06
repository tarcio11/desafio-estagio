import { DbRegisterImovel } from './db-register-imovel'
import { RegisterImovel } from '../../entities/usecases/imoveis'
import { RegisterImovelRepository } from '../protocols/db/imovel'

import faker from 'faker'

class RegisterImovelRepositorySpy implements RegisterImovelRepository {
  imovel: RegisterImovelRepository.Params

  async register (imovel: RegisterImovelRepository.Params): Promise<void> {
    this.imovel = imovel
  }
}

const mockRegisterImovelParams = (): RegisterImovel.Params => ({
  userId: faker.datatype.uuid(),
  cep: faker.address.zipCode(),
  complemento: faker.address.cityPrefix(),
  numero: Number(faker.finance.amount(1, 3000, null)),
  quantidade_de_quartos: faker.datatype.number(4),
  valor_do_aluguel_em_reais: faker.finance.amount(600, 1500),
  disponivel: faker.datatype.boolean()
})

type SutTypes = {
  sut: DbRegisterImovel
  registerImovelRepositorySpy: RegisterImovelRepositorySpy
}

const makeSut = (): SutTypes => {
  const registerImovelRepositorySpy = new RegisterImovelRepositorySpy()
  const sut = new DbRegisterImovel(registerImovelRepositorySpy)
  return {
    sut,
    registerImovelRepositorySpy
  }
}

describe('DbAddUsuario caso de uso', () => {
  test('Deve chamar RegisterImovelRepository com os valores corretos', async () => {
    const { sut, registerImovelRepositorySpy } = makeSut()
    const registerImovelParams = mockRegisterImovelParams()
    await sut.register(registerImovelParams)
    expect(registerImovelRepositorySpy.imovel).toBe(registerImovelParams)
  })
})
