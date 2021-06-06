import { ImovelResultModel } from '../../models'

export interface RegisterImovel {
  register: (imovel: ImovelResultModel) => Promise<RegisterImovel.Response>
}

export namespace RegisterImovel {
  export type Params = Omit<ImovelResultModel, 'id'>
  export type Response = ImovelResultModel
}
