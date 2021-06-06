import { LoginController } from './login-controller'

import faker from 'faker'
import { Validation } from '../protocols'

export class ValidationSpy implements Validation {
  input: any
  error: Error = null

  validate (input: any): Error {
    this.input = input
    return this.error
  }
}

const mockAddAccountParams = (): LoginController.Request => ({
  email: faker.internet.email(),
  senha: faker.internet.password()
})

type SutTypes = {
  sut
  validationSpy: ValidationSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const sut = new LoginController(validationSpy)
  return {
    sut,
    validationSpy
  }
}

describe('Login Controller', () => {
  test('Deve chamar Validation com os valores corretos', async () => {
    const { sut, validationSpy } = makeSut()
    const request = mockAddAccountParams()
    await sut.handle(request)
    expect(validationSpy.input).toEqual(request)
  })
})
