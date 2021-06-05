import { CpfValidatorAdapter } from './cpf-validator-adapter'

import { cpf } from 'cpf-cnpj-validator'

const makeSut = (): CpfValidatorAdapter => {
  return new CpfValidatorAdapter()
}

describe('EmailValidatorAdapter', () => {
  test('Deve chamar o cpf com valor correto', () => {
    const sut = makeSut()
    const isCPFSpy = jest.spyOn(cpf, 'isValid')
    const fakeCPF = cpf.generate()
    sut.isValid(Number(fakeCPF))
    expect(isCPFSpy).toHaveBeenCalledWith(fakeCPF)
  })
})
