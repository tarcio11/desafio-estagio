import { Router } from 'express'
import { adaptMiddleware, adaptRoute } from '../adapters'
import { makeDeleteImovelController, makeLoadImoveisController, makeLoadImovelByIdController, makeRegisterImovelController, makeUpdateImovelController } from '../factories/controllers'
import { makeAuthMiddleware } from '../factories/middlewares'

export default (router: Router): void => {
  router.get('/imoveis', adaptMiddleware(makeAuthMiddleware()), adaptRoute(makeLoadImoveisController()))
  router.get('/imoveis/:imovelId', adaptMiddleware(makeAuthMiddleware()), adaptRoute(makeLoadImovelByIdController()))
  router.put('/imoveis/:imovelId', adaptMiddleware(makeAuthMiddleware()), adaptRoute(makeUpdateImovelController()))
  router.post('/imoveis', adaptMiddleware(makeAuthMiddleware()), adaptRoute(makeRegisterImovelController()))
  router.delete('/imoveis/:imovelId', adaptMiddleware(makeAuthMiddleware()), adaptRoute(makeDeleteImovelController()))
}
