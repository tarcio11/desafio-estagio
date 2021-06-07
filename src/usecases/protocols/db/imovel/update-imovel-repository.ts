import { UpdateImovel } from '../../../../entities/usecases/imoveis'

export interface UpdateImovelRepository {
  update: (params: UpdateImovelRepository.Params) => Promise<UpdateImovelRepository.Response>
}

export namespace UpdateImovelRepository {
  export type Params = UpdateImovel.Params
  export type Response = UpdateImovel.Response
}
