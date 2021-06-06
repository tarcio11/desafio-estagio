export interface HashComparer {
  compare: (senha: string, hashedSenha: string) => Promise<boolean>
}
