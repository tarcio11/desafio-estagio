import { HashComparer, Hasher } from '../../usecases/protocols'

import bcrypt from 'bcryptjs'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor (private readonly salt: number) {}

  async hash (plaintext: string): Promise<string> {
    return await bcrypt.hash(plaintext, this.salt)
  }

  async compare (senha: string, hashedSenha: string): Promise<boolean> {
    await bcrypt.compare(senha, hashedSenha)
    return null
  }
}
