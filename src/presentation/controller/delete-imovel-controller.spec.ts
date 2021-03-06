import { DeleteImovelController } from './delete-imovel-controller'
import { DeleteImovel } from '../../entities/usecases/imoveis'
import { forbidden, ok, serverError } from '../helpers'
import { InvalidParamError } from '../errors'

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

  test('Deve retornar 403 se DeleteImovel retornar false', async () => {
    const { sut, deleteImovelSpy } = makeSut()
    deleteImovelSpy.response = false
    const httpResponse = await sut.handle(mockDeleteImovelParams())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('imovelId')))
  })

  test('Deve retornar 200 em caso de sucesso', async () => {
    const { sut, deleteImovelSpy } = makeSut()
    const httpResponse = await sut.handle(mockDeleteImovelParams())
    expect(httpResponse).toEqual(ok(deleteImovelSpy.response))
  })

  test('Deve retornar erro 500 se DeleteImovel arremessar um erro', async () => {
    const { sut, deleteImovelSpy } = makeSut()
    jest.spyOn(deleteImovelSpy, 'delete').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(mockDeleteImovelParams())
    expect(httpResponse).toEqual(serverError())
  })
})
