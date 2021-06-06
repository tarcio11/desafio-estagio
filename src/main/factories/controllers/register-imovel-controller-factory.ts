import { makeLoginValidation } from './login-validation-factory'
import { makeDbRegisterImovel } from '../usecases'
import { RegisterImovelController } from '../../../presentation/controller'
import { Controller } from '../../../presentation/protocols'

export const makeRegisterImovelController = (): Controller => {
  return new RegisterImovelController(makeLoginValidation(), makeDbRegisterImovel())
}
