import { RegisterImovel } from '../../../../entities/usecases/imoveis'

export interface RegisterImovelRepository {
  register: (imovel: RegisterImovelRepository.Params) => Promise<RegisterImovelRepository.Response>
}

export namespace RegisterImovelRepository {
  export type Params = RegisterImovel.Params
  export type Response = RegisterImovel.Response
}
