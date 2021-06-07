import { LoadImovelByIdController } from '../../../presentation/controller'
import { Controller } from '../../../presentation/protocols'
import { makeDbLoadImovelById } from '../usecases'

export const makeLoadImovelByIdController = (): Controller => {
  return new LoadImovelByIdController(makeDbLoadImovelById())
}
