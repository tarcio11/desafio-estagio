import { ImovelResultModel } from '../../models'

export interface LoadImoveis {
  load: () => Promise<LoadImoveis.Result>
}

export namespace LoadImoveis {
  export type Result = ImovelResultModel[]
}
