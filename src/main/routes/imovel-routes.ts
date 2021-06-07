import { Router } from 'express'
import { adaptMiddleware, adaptRoute } from '../adapters'
import { makeRegisterImovelController } from '../factories/controllers'
import { makeAuthMiddleware } from '../factories/middlewares'

export default (router: Router): void => {
  router.post('/imoveis', adaptMiddleware(makeAuthMiddleware()), adaptRoute(makeRegisterImovelController()))
}
