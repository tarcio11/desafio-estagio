import { RegisterImovel } from '../../../../entities/usecases/imoveis'

export interface RegisterImovelRepository {
  register: (imovel: RegisterImovelRepository.Params) => Promise<void>
}

export namespace RegisterImovelRepository {
  export type Params = RegisterImovel.Params
}
