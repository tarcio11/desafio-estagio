import { DbAddUser } from './db-add-usurio'
import { Hasher } from '../protocols'
import { Usuario } from '../../entities/usecases'

import faker from 'faker'

class HasherSpy implements Hasher {
  senha: string
  response = faker.datatype.uuid()

  async hash (senha: string): Promise<string> {
    this.senha = senha
    return this.response
  }
}

const mockAddAccountParams = (): Usuario.Params => ({
  nomeCompleto: faker.name.findName(),
  cpf: faker.random.number(11),
  email: faker.internet.email(),
  senha: faker.internet.password()
})

type SutTypes = {
  sut: DbAddUser
  hasherSpy: HasherSpy
}

const makeSut = (): SutTypes => {
  const hasherSpy = new HasherSpy()
  const sut = new DbAddUser(hasherSpy)
  return {
    sut,
    hasherSpy
  }
}

describe('DbAddUsuario Caso de uso', () => {
  test('Deve chamar Hasher com a senha correta', async () => {
    const { sut, hasherSpy } = makeSut()
    const addAccountParams = mockAddAccountParams()
    await sut.add(addAccountParams)
    expect(hasherSpy.senha).toBe(addAccountParams.senha)
  })

  test('Deve retornar erro de Hasher se retornar erro', async () => {
    const { sut, hasherSpy } = makeSut()
    jest.spyOn(hasherSpy, 'hash').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })
})
