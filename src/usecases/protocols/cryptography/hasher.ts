export interface Hasher {
  hash: (senha: string) => Promise<string>
}
