import { ImovelResultModel } from '../../../../entities/models'

export interface LoadImoveisRepository {
  loadAll: () => Promise<LoadImoveisRepository.Response>
}

export namespace LoadImoveisRepository {
  export type Response = ImovelResultModel[]
}
