import { Router } from 'express'
import { adaptRoute } from '../adapters'
import { makeLoginController } from '../factories/controllers'

export default (router: Router): void => {
  router.post('/login', adaptRoute(makeLoginController()))
}
