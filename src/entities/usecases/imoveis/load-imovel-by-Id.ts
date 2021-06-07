import { ImovelResultModel } from '../../models'

export interface LoadImovelById {
  load: (imovelId: string) => Promise<LoadImovelById.Result>
}

export namespace LoadImovelById {
  export type Result = ImovelResultModel
}
