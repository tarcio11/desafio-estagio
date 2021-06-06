export interface Authentication {
  auth: (authenticationParams: Authentication.Params) => Promise<Authentication.Result>
}

export namespace Authentication {
  export type Params = {
    email: string
    senha: string
  }

  export type Result = {
    tokenDeAcesso: string
    nomeCompleto: string
  }
}
