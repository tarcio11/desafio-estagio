import { EmailValidation } from './email-validation'
import { EmailValidator } from '../presentation/protocols'
import { InvalidParamError } from '../presentation/errors'

import faker from 'faker'

const field = faker.random.word()

export class EmailValidatorSpy implements EmailValidator {
  email: string
  isEmailValid = true

  isValid (email: string): boolean {
    this.email = email
    return this.isEmailValid
  }
}

type SutTypes = {
  sut: EmailValidation
  emailValidatorSpy: EmailValidatorSpy
}

const makeSut = (): SutTypes => {
  const emailValidatorSpy = new EmailValidatorSpy()
  const sut = new EmailValidation(field, emailValidatorSpy)
  return {
    sut,
    emailValidatorSpy
  }
}

describe('Email Validation', () => {
  test('Deve retorna um erro se EmailValidator retornar falso', () => {
    const { sut, emailValidatorSpy } = makeSut()
    emailValidatorSpy.isEmailValid = false
    const email = faker.internet.email()
    const error = sut.validate({ [field]: email })
    expect(error).toEqual(new InvalidParamError(field))
  })

  test('Deve chamar EmailValidator com email correto', () => {
    const { sut, emailValidatorSpy } = makeSut()
    const email = faker.internet.email()
    sut.validate({ [field]: email })
    expect(emailValidatorSpy.email).toBe(email)
  })
})
