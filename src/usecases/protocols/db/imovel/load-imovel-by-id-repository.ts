import { ImovelResultModel } from '../../../../entities/models'

export interface LoadImovelByIdRepository {
  loadImovelById: (imovelId: string) => Promise<LoadImovelByIdRepository.Response>
}

export namespace LoadImovelByIdRepository {
  export type Response = ImovelResultModel
}
