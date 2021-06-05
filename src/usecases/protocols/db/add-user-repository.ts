import { Usuario } from '../../../entities/usecases'

export interface AddUserRepository {
  add: (user: AddUserRepository.Params) => Promise<AddUserRepository.Response>
}

export namespace AddUserRepository {
  export type Params = Usuario.Params
  export type Response = Usuario.Response
}
