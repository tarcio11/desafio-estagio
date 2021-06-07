import { DeleteImovelController } from './delete-imovel-controller'
import { DeleteImovel } from '../../entities/usecases/imoveis'

import faker from 'faker'

export class DeleteImovelSpy implements DeleteImovel {
  userId: string
  imovelId: string
  response = true

  async delete (userId: string, imovelId: string): Promise<boolean> {
    this.userId = userId
    this.imovelId = imovelId
    return this.response
  }
}

const mockDeleteImovelParams = (): DeleteImovelController.Request => ({
  userId: faker.datatype.uuid(),
  imovelId: faker.datatype.uuid()
})

type SutTypes = {
  sut: DeleteImovelController
  deleteImovelSpy: DeleteImovelSpy
}

const makeSut = (): SutTypes => {
  const deleteImovelSpy = new DeleteImovelSpy()
  const sut = new DeleteImovelController(deleteImovelSpy)
  return {
    sut,
    deleteImovelSpy
  }
}

describe('RegisterImovel Controller', () => {
  test('Deve chamar DeleteImovel com os valores corretos', async () => {
    const { sut, deleteImovelSpy } = makeSut()
    const DeleteImovelParams = mockDeleteImovelParams()
    await sut.handle(DeleteImovelParams)
    expect(deleteImovelSpy.userId).toBe(DeleteImovelParams.userId)
    expect(deleteImovelSpy.imovelId).toBe(DeleteImovelParams.imovelId)
  })
})
