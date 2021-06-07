import { makeDbDeleteImovel } from '../usecases'
import { Controller } from '../../../presentation/protocols'
import { DeleteImovelController } from '../../../presentation/controller'

export const makeDeleteImovelController = (): Controller => {
  return new DeleteImovelController(makeDbDeleteImovel())
}
