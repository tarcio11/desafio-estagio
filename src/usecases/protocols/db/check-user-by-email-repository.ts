export interface CheckUserByEmailRepository {
  checkByEmail: (email: string) => Promise<CheckUserByEmailRepository.Response>
}

export namespace CheckUserByEmailRepository {
  export type Response = boolean
}
