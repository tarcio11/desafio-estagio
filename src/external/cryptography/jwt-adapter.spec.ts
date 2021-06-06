import { JwtAdapter } from './jwt-adapter'

import jwt from 'jsonwebtoken'

const secret = 'secret'
const makeSut = (): JwtAdapter => {
  return new JwtAdapter(secret)
}

describe('JWT Adapter', () => {
  describe('sign()', () => {
    test('Deve chamar sign com os valores corretos', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt('any_id')
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, secret)
    })
  })
})
