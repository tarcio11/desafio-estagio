import { DbDeleteImovel } from './db-delete-imovel'
import { DeleteImovelRepository } from '../protocols/db/imovel'

import faker from 'faker'

class DeleteImovelSpy implements DeleteImovelRepository {
  userId: string
  imovelId: string
  response = true

  async delete (userId: string, imovelId: string): Promise<boolean> {
    this.userId = userId
    this.imovelId = imovelId
    return this.response
  }
}

type SutTypes = {
  sut: DbDeleteImovel
  deleteImovelSpy: DeleteImovelSpy
}

const makeSut = (): SutTypes => {
  const deleteImovelSpy = new DeleteImovelSpy()
  const sut = new DbDeleteImovel(deleteImovelSpy)
  return {
    sut,
    deleteImovelSpy
  }
}

describe('DbLoadAccounts', () => {
  test('Deve chamar DeleteImovelRepository com os valores corretos', async () => {
    const { sut, deleteImovelSpy } = makeSut()
    const userId = faker.random.uuid()
    const imovelId = faker.random.uuid()
    await sut.delete(userId, imovelId)
    expect(deleteImovelSpy.userId).toBe(userId)
    expect(deleteImovelSpy.imovelId).toBe(imovelId)
  })

  test('Deve retornar verdadeiro se DeleteImovelRepository retornar verdadeiro', async () => {
    const { sut, deleteImovelSpy } = makeSut()
    const userId = faker.random.uuid()
    const imovelId = faker.random.uuid()
    const imoveis = await sut.delete(userId, imovelId)
    expect(imoveis).toEqual(deleteImovelSpy.response)
  })

  test('Deve retornar falso se DeleteImovelRepository retornar falso', async () => {
    const { sut, deleteImovelSpy } = makeSut()
    deleteImovelSpy.response = false
    const userId = faker.random.uuid()
    const imovelId = faker.random.uuid()
    const imoveis = await sut.delete(userId, imovelId)
    expect(imoveis).toEqual(deleteImovelSpy.response)
  })

  test('Deve retornar erro de DeleteImovelRepository se retornar erro', async () => {
    const { sut, deleteImovelSpy } = makeSut()
    jest.spyOn(deleteImovelSpy, 'delete').mockImplementationOnce(() => { throw new Error() })
    const userId = faker.random.uuid()
    const imovelId = faker.random.uuid()
    const promise = sut.delete(userId, imovelId)
    await expect(promise).rejects.toThrow()
  })
})
