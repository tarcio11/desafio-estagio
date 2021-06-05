import { CpfValidator, Validation } from '../presentation/protocols'
import { InvalidParamError } from '../presentation/errors'

export class CpfValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly cpfValidator: CpfValidator
  ) {}

  validate (input: any): Error {
    const isValid = this.cpfValidator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
