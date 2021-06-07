import { ImovelResultModel } from '../../models'

export interface UpdateImovel {
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  update (params: UpdateImovel.Params): Promise<ImovelResultModel>
}

export namespace UpdateImovel {
  export type Params = {
    userId: string
    imovelId: string
    data: any
  }
}
