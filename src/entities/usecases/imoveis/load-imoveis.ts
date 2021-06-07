import { ImovelResultModel } from '../../models'

export interface LoadAImoveis {
  load: () => Promise<LoadAImoveis.Result>
}

export namespace LoadAImoveis {
  export type Result = ImovelResultModel[]
}
