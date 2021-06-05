import { CpfValidator } from '../../presentation/protocols'

import { cpf } from 'cpf-cnpj-validator'

export class CpfValidatorAdapter implements CpfValidator {
  isValid (cpfParam: number): boolean {
    cpf.isValid(String(cpfParam))
    return null
  }
}
