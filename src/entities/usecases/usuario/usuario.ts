export interface Usuario {
  add: (user: Usuario.Params) => Promise<Usuario.Response>
}

export namespace Usuario {
  export type Params = {
    nomeCompleto: string
    cpf: number
    email: string
    senha: string
  }
  export type Response = boolean
}
