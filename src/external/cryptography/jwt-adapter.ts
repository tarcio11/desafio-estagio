import { Encrypter } from '../../usecases/protocols'

import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter {
  constructor (private readonly secret: string) {}

  async encrypt (id: string): Promise<string> {
    await jwt.sign({ id }, this.secret)
    return null
  }
}
