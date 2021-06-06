export interface LoadUserByTokenRepository {
  loadByToken: (token: string) => Promise<LoadUserByTokenRepository.Response>
}

export namespace LoadUserByTokenRepository {
  export type Response = {
    id: string
  }
}
