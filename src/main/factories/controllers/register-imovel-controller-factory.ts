import { makeDbRegisterImovel } from '../usecases'
import { RegisterImovelController } from '../../../presentation/controller'
import { Controller } from '../../../presentation/protocols'
import { makeRegisterImovelValidation } from './register-imovel-validation-factory'

export const makeRegisterImovelController = (): Controller => {
  return new RegisterImovelController(makeRegisterImovelValidation(), makeDbRegisterImovel())
}
