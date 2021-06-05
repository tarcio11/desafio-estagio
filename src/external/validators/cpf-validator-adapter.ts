import { CpfValidator } from '../../presentation/protocols'

import { cpf } from 'cpf-cnpj-validator'

export class CpfValidatorAdapter implements CpfValidator {
  isValid (cpfParam: number): boolean {
    return cpf.isValid(String(cpfParam))
  }
}
