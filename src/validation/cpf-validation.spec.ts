import { CpfValidation } from './cpf-validation'
import { CpfValidator } from '../presentation/protocols'
import { InvalidParamError } from '../presentation/errors'

import faker from 'faker'

const field = faker.random.word()

export class CpfValidatorSpy implements CpfValidator {
  cpf: number
  isCPFValid = true

  isValid (cpf: number): boolean {
    this.cpf = cpf
    return this.isCPFValid
  }
}

type SutTypes = {
  sut: CpfValidation
  cpfValidatorSpy: CpfValidatorSpy
}

const makeSut = (): SutTypes => {
  const cpfValidatorSpy = new CpfValidatorSpy()
  const sut = new CpfValidation(field, cpfValidatorSpy)
  return {
    sut,
    cpfValidatorSpy
  }
}

describe('Email Validation', () => {
  test('Deve retorna um erro se CpfValidator retornar falso', () => {
    const { sut, cpfValidatorSpy } = makeSut()
    cpfValidatorSpy.isCPFValid = false
    const cpf = '11111111111'
    const error = sut.validate({ [field]: cpf })
    expect(error).toEqual(new InvalidParamError(field))
  })

  test('Deve chamar CpfValidator com cpf correto', () => {
    const { sut, cpfValidatorSpy } = makeSut()
    const cpf = '11111111111'
    sut.validate({ [field]: cpf })
    expect(cpfValidatorSpy.cpf).toBe(cpf)
  })

  test('Deve retornar erro de EmailValidator se retornar erro', () => {
    const { sut, cpfValidatorSpy } = makeSut()
    jest.spyOn(cpfValidatorSpy, 'isValid').mockImplementationOnce(() => { throw new Error() })
    expect(sut.validate).toThrow()
  })
})
