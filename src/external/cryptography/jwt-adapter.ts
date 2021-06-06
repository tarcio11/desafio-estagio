import { Decrypter, Encrypter } from '../../usecases/protocols'

import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {}

  async encrypt (id: string): Promise<string> {
    return jwt.sign({ id }, this.secret)
  }

  async decrypt (token: string): Promise<string> {
    jwt.verify(token, this.secret)
    return null
  }
}
