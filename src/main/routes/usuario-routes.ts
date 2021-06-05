import { Router } from 'express'
import { adaptRoute } from '../adapters'
import { makeUsuarioController } from '../factories/controllers'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeUsuarioController()))
}
