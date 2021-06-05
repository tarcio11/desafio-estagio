import { Hasher } from '../../usecases/protocols'

import bcrypt from 'bcryptjs'

export class BcryptAdapter implements Hasher {
  constructor (private readonly salt: number) {}

  async hash (plaintext: string): Promise<string> {
    await bcrypt.hash(plaintext, this.salt)
    return null
  }
}
