export interface DeleteImovelRepository {
  delete: (userId: string, imovelId: string) => Promise<boolean>
}
