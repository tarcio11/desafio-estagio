import { LoadImoveisController } from '../../../presentation/controller'
import { Controller } from '../../../presentation/protocols'
import { makeDbLoadImoveis } from '../usecases'

export const makeLoadImoveisController = (): Controller => {
  return new LoadImoveisController(makeDbLoadImoveis())
}
