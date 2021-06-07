import { Router } from 'express'
import { adaptMiddleware, adaptRoute } from '../adapters'
import { makeRegisterImovelController, makeUpdateImovelController } from '../factories/controllers'
import { makeAuthMiddleware } from '../factories/middlewares'

export default (router: Router): void => {
  router.put('/imoveis/:imovelId', adaptMiddleware(makeAuthMiddleware()), adaptRoute(makeUpdateImovelController()))
  router.post('/imoveis', adaptMiddleware(makeAuthMiddleware()), adaptRoute(makeRegisterImovelController()))
}
