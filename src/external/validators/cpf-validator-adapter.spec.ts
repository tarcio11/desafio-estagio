import { CpfValidatorAdapter } from './cpf-validator-adapter'

import { cpf } from 'cpf-cnpj-validator'
const fakeCPF = cpf.generate()

const makeSut = (): CpfValidatorAdapter => {
  return new CpfValidatorAdapter()
}

describe('EmailValidatorAdapter', () => {
  test('Deve chamar o cpf com valor correto', () => {
    const sut = makeSut()
    const isCPFSpy = jest.spyOn(cpf, 'isValid')
    sut.isValid(Number(fakeCPF))
    expect(isCPFSpy).toHaveBeenCalledWith(fakeCPF)
  })

  test('Deve retorna falso se cpf retornar falso', () => {
    const sut = makeSut()
    jest.spyOn(cpf, 'isValid').mockReturnValueOnce(false)
    const isValid = sut.isValid(Number(fakeCPF))
    expect(isValid).toBe(false)
  })

  test('Deve retorna verdadeiro se cpf retornar verdadeiro', () => {
    const sut = makeSut()
    const isValid = sut.isValid(Number(fakeCPF))
    expect(isValid).toBe(true)
  })
})
