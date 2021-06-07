import { makeDbUpdateImovel } from '../usecases'
import { Controller } from '../../../presentation/protocols'
import { UpdateImovelController } from '../../../presentation/controller/update-imovel-controller'

export const makeUpdateImovelController = (): Controller => {
  return new UpdateImovelController(makeDbUpdateImovel())
}
