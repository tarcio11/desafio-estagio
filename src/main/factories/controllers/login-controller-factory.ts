import { makeLoginValidation } from './login-validation-factory'
import { makeDbAuthentication } from '../usecases'
import { LoginController } from '../../../presentation/controller'
import { Controller } from '../../../presentation/protocols'

export const makeLoginController = (): Controller => {
  return new LoginController(makeLoginValidation(), makeDbAuthentication())
}
