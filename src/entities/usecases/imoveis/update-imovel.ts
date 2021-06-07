import { ImovelResultModel } from '../../models'

export interface UpdateImovel {
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  update (params: UpdateImovel.Params): Promise<UpdateImovel.Response>
}

export namespace UpdateImovel {
  export type Params = {
    userId: string
    imovelId: string
    cep?: string
    numero?: number
    complemento?: string
    valor_do_aluguel_em_reais?: string
    quantidade_de_quartos?: number
    disponivel?: boolean
  }
  export type Response = ImovelResultModel
}
