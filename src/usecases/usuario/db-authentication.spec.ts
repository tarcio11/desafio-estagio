import { DbAuthentication } from './db-authentication'
import { Authentication } from '../../entities/usecases'
import { LoadAccountByEmailRepository } from '../protocols'

import faker from 'faker'
import { cpf } from 'cpf-cnpj-validator'

const mockAuthenticationParams = (): Authentication.Params => ({
  email: faker.internet.email(),
  senha: faker.internet.password()
})

class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
  email: string
  response = {
    id: faker.datatype.uuid(),
    nome: faker.name.findName(),
    cpf: Number(cpf.generate()),
    senha: faker.internet.password()
  }

  async loadByEmail (email: string): Promise<LoadAccountByEmailRepository.Response> {
    this.email = email
    return this.response
  }
}

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy()
  const sut = new DbAuthentication(loadAccountByEmailRepositorySpy)
  return {
    sut,
    loadAccountByEmailRepositorySpy
  }
}

describe('DbAuthentication caso de uso', () => {
  test('Deve chamar LoadAccountByEmailRepository com o email correto', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    const authenticationParams = mockAuthenticationParams()
    await sut.auth(authenticationParams)
    expect(loadAccountByEmailRepositorySpy.email).toBe(authenticationParams.email)
  })
})
