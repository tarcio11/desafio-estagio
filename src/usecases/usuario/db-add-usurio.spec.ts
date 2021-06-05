import { DbAddUser } from './db-add-usurio'
import { Hasher } from '../protocols'
import { Usuario } from '../../entities/usecases'

import faker from 'faker'
import { AddUserRepository } from '../protocols/db'

class HasherSpy implements Hasher {
  senha: string
  response = faker.datatype.uuid()

  async hash (senha: string): Promise<string> {
    this.senha = senha
    return this.response
  }
}

class AddUserRepositorySpy implements AddUserRepository {
  user: AddUserRepository.Params
  response = true

  async add (user: AddUserRepository.Params): Promise<AddUserRepository.Response> {
    this.user = user
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
  addUserRepositorySpy: AddUserRepositorySpy
}

const makeSut = (): SutTypes => {
  const hasherSpy = new HasherSpy()
  const addUserRepositorySpy = new AddUserRepositorySpy()
  const sut = new DbAddUser(hasherSpy, addUserRepositorySpy)
  return {
    sut,
    hasherSpy,
    addUserRepositorySpy
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

  test('Deve chamar AddUserRepository com os valores corretos', async () => {
    const { sut, addUserRepositorySpy, hasherSpy } = makeSut()
    const addAccountParams = mockAddAccountParams()
    await sut.add(addAccountParams)
    expect(addUserRepositorySpy.user).toEqual({
      nomeCompleto: addAccountParams.nomeCompleto,
      cpf: addAccountParams.cpf,
      email: addAccountParams.email,
      senha: hasherSpy.response
    })
  })

  test('Deve retornar erro de AddUserRepository se retornar erro', async () => {
    const { sut, addUserRepositorySpy } = makeSut()
    jest.spyOn(addUserRepositorySpy, 'add').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  test('Deve retornar verdadeiro em caso de sucesso', async () => {
    const { sut } = makeSut()
    const isValid = await sut.add(mockAddAccountParams())
    expect(isValid).toBe(true)
  })

  test('Deve retorna falso se AddUserRepository retornar falso', async () => {
    const { sut, addUserRepositorySpy } = makeSut()
    addUserRepositorySpy.response = false
    const isValid = await sut.add(mockAddAccountParams())
    expect(isValid).toBe(false)
  })
})
