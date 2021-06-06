export interface LoadUserByToken {
  load: (token: string) => Promise<LoadUserByToken.Result>
}

export namespace LoadUserByToken {
  export type Result = {
    id: string
  }
}
