import { makeUsuarioValidation } from './usuario-validation-factory'
import { UsuarioController } from '../../../presentation/controller'
import { Controller } from '../../../presentation/protocols'
import { makeDbAuthentication, makeDbUsuario } from '../usecases'

export const makeUsuarioController = (): Controller => {
  return new UsuarioController(makeUsuarioValidation(), makeDbUsuario(), makeDbAuthentication())
}
